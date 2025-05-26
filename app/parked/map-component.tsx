import {
  requestForegroundPermissionsAsync,
  LocationHeadingObject,
  LocationObject,
  watchHeadingAsync,
  Accuracy,
  watchPositionAsync,
  LocationSubscription,
} from "expo-location";
import { DeviceMotion } from "expo-sensors";
import { useEffect, useRef, useState, useCallback } from "react";
import { Platform, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

const MapComponent = ({ location }: { location: LocationObject | null }) => {
  const [userLocation, setUserLocation] = useState<LocationObject | null>(null);
  const [heading, setHeading] = useState<LocationHeadingObject | null>(null);
  const [locationSubscription, setLocationSubscription] =
    useState<LocationSubscription | null>(null);
  const [headingSubscription, setHeadingSubscription] =
    useState<LocationSubscription | null>(null);
  const [deviceMotionHeading, setDeviceMotionHeading] = useState<number | null>(
    null,
  );
  const [drag, setDrag] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const mapRef = useRef<MapView>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 중간점 계산 (메모이제이션)
  const getMiddlePoint = useCallback(
    (coord1: LocationObject, coord2: LocationObject) => {
      return {
        latitude: (coord1.coords.latitude + coord2.coords.latitude) / 2,
        longitude: (coord1.coords.longitude + coord2.coords.longitude) / 2,
      };
    },
    [],
  );

  // 거리 계산 (메모이제이션)
  const calculateDistance = useCallback(
    (lat1: number, lon1: number, lat2: number, lon2: number): number => {
      const R = 6371e3;
      const φ1 = (lat1 * Math.PI) / 180;
      const φ2 = (lat2 * Math.PI) / 180;
      const Δφ = ((lat2 - lat1) * Math.PI) / 180;
      const Δλ = ((lon2 - lon1) * Math.PI) / 180;

      const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return R * c;
    },
    [],
  );

  // 카메라 업데이트 함수 (중복 제거)
  const updateCamera = useCallback(
    async (animated = false) => {
      if (!mapRef.current || !userLocation || !location) return;

      const centerPoint = getMiddlePoint(userLocation, location);
      const currentHeading =
        Platform.OS === "android"
          ? deviceMotionHeading || 0
          : heading?.trueHeading || 0;

      const curCamera = await mapRef.current.getCamera();
      const newCamera = {
        ...curCamera,
        center: centerPoint,
        heading: currentHeading,
      };

      if (animated) {
        mapRef.current.animateCamera(newCamera, { duration: 500 });
      } else {
        mapRef.current.setCamera(newCamera);
      }
    },
    [userLocation, location, deviceMotionHeading, heading, getMiddlePoint],
  );

  // 초기 지도 핏
  const fitMapToShowBothLocations = useCallback(() => {
    if (!mapRef.current || !userLocation || !location || isInitialized) return;

    const coordinates = [
      {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
      },
      {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
    ];

    mapRef.current.fitToCoordinates(coordinates, {
      edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
      animated: true,
    });

    setIsInitialized(true);
  }, [userLocation, location, isInitialized]);

  // 드래그 핸들러
  const handleTouchStart = useCallback(() => {
    setDrag(true);

    // 기존 드래그 타이머 취소
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    // 기존 타이머 취소
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
    }

    // 2.5초 후 자동으로 중심점으로 복귀
    dragTimeoutRef.current = setTimeout(() => {
      updateCamera(true).then(() => {
        const resetTimeout = setTimeout(() => setDrag(false), 500);
        return resetTimeout;
      });
    }, 1000);
  }, [updateCamera]);

  // 위치 추적 시작
  const startTracking = useCallback(async () => {
    const { status } = await requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("위치 권한이 거부되었습니다");
      return;
    }

    const locSubscription = await watchPositionAsync(
      {
        accuracy: Accuracy.High,
        timeInterval: 500,
        distanceInterval: 0.1,
      },
      (locationData) => {
        setUserLocation(locationData);
      },
    );

    const headSubscription = await watchHeadingAsync(
      (headingData) => {
        if (
          headingData.trueHeading !== undefined &&
          headingData.trueHeading > 0
        ) {
          setHeading(headingData);
        }
      },
      (error) => {
        console.error("나침반 에러:", error);
      },
    );

    setLocationSubscription(locSubscription);
    setHeadingSubscription(headSubscription);
  }, []);

  // 초기 설정
  useEffect(() => {
    startTracking();
    DeviceMotion.setUpdateInterval(16);

    let deviceMotionSubscription = DeviceMotion.addListener((motionData) => {
      if (
        !motionData?.rotation?.alpha ||
        typeof motionData.rotation.alpha !== "number"
      ) {
        return;
      }

      const { alpha } = motionData.rotation;
      let calculatedHeading = 360 - (alpha * 180) / Math.PI;

      if (calculatedHeading < 0) calculatedHeading += 360;
      if (calculatedHeading > 360) calculatedHeading -= 360;

      setDeviceMotionHeading(+calculatedHeading.toFixed(1));
    });

    return () => {
      locationSubscription?.remove();
      headingSubscription?.remove();
      deviceMotionSubscription?.remove();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (dragTimeoutRef.current) clearTimeout(dragTimeoutRef.current);
    };
  }, [startTracking]);

  // 초기 지도 핏
  useEffect(() => {
    if (userLocation && location && !isInitialized) {
      // 약간의 지연을 두고 실행 (중복 방지)
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        fitMapToShowBothLocations();
      }, 500);
    }
  }, [userLocation, location, fitMapToShowBothLocations, isInitialized]);

  // 카메라 실시간 업데이트 (드래그 중이 아닐 때만)
  useEffect(() => {
    if (isInitialized && !drag && userLocation && location) {
      updateCamera();
    }
  }, [heading, deviceMotionHeading, isInitialized, drag, updateCamera]);

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <MapView
        ref={mapRef}
        style={{ width: "100%", height: "100%" }}
        showsUserLocation
        scrollEnabled={true}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        initialCamera={{
          center: { longitude: 0, latitude: 0 },
          pitch: 0,
          heading: 0,
          altitude: 180,
          zoom: 18,
        }}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="주차 위치"
            description="여기에 차를 주차했습니다"
            pinColor="red"
          />
        )}
      </MapView>
    </View>
  );
};

export default MapComponent;

