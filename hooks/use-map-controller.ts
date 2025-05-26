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
import { Platform } from "react-native";
import MapView from "react-native-maps";

interface UseMapControllerProps {
  parkedLocation: LocationObject | null;
}

export const useMapController = ({ parkedLocation }: UseMapControllerProps) => {
  // States
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
  const [mapReady, setMapReady] = useState(false);

  // Refs
  const mapRef = useRef<MapView>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);
  // 안전한 mapRef 접근 함수
  const safeMapRef = useCallback(() => {
    if (!isMountedRef.current || !mapReady || !mapRef.current) {
      return null;
    }
    return mapRef.current;
  }, [mapReady]);

  // 중간점 계산
  const getMiddlePoint = useCallback(
    (coord1: LocationObject, coord2: LocationObject) => {
      return {
        latitude: (coord1.coords.latitude + coord2.coords.latitude) / 2,
        longitude: (coord1.coords.longitude + coord2.coords.longitude) / 2,
      };
    },
    [],
  );

  // 카메라 업데이트 함수
  const updateCamera = useCallback(
    async (animated = false) => {
      const map = safeMapRef();
      if (!map || !userLocation || !parkedLocation) return;

      try {
        const centerPoint = getMiddlePoint(userLocation, parkedLocation);
        const currentHeading =
          Platform.OS === "android"
            ? deviceMotionHeading || 0
            : heading?.trueHeading || 0;

        const curCamera = await map.getCamera();
        const newCamera = {
          ...curCamera,
          center: centerPoint,
          heading: currentHeading,
        };

        if (animated) {
          map.animateCamera(newCamera, { duration: 500 });
        } else {
          map.setCamera(newCamera);
        }
      } catch (error) {
        console.warn("카메라 업데이트 실패:", error);
      }
    },
    [
      userLocation,
      parkedLocation,
      deviceMotionHeading,
      heading,
      getMiddlePoint,
      safeMapRef,
    ],
  );
  // 초기 지도 핏
  const fitMapToShowBothLocations = useCallback(() => {
    const map = safeMapRef();
    if (!map || !userLocation || !parkedLocation || isInitialized) return;

    try {
      const coordinates = [
        {
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
        },
        {
          latitude: parkedLocation.coords.latitude,
          longitude: parkedLocation.coords.longitude,
        },
      ];

      map.fitToCoordinates(coordinates, {
        edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
        animated: true,
      });

      setIsInitialized(true);
    } catch (error) {
      console.warn("지도 핏 실패:", error);
    }
  }, [userLocation, parkedLocation, isInitialized, safeMapRef]);

  // 맵 준비 완료 핸들러
  const handleMapReady = useCallback(() => {
    console.log("맵이 준비되었습니다");
    setMapReady(true);
  }, []);

  // 드래그 핸들러
  const handleTouchStart = useCallback(() => {
    if (!isMountedRef.current) return;
    setDrag(true);

    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!isMountedRef.current) return;

    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
    }

    dragTimeoutRef.current = setTimeout(() => {
      if (!isMountedRef.current) return;

      updateCamera(true).then(() => {
        if (!isMountedRef.current) return;
        setTimeout(() => {
          if (isMountedRef.current) {
            setDrag(false);
          }
        }, 500);
      });
    }, 1000);
  }, [updateCamera]);
  // 위치 추적 시작
  const startTracking = useCallback(async () => {
    if (!isMountedRef.current) return;

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
        if (isMountedRef.current) {
          setUserLocation(locationData);
        }
      },
    );

    const headSubscription = await watchHeadingAsync(
      (headingData) => {
        if (
          isMountedRef.current &&
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

    if (isMountedRef.current) {
      setLocationSubscription(locSubscription);
      setHeadingSubscription(headSubscription);
    } else {
      locSubscription?.remove();
      headSubscription?.remove();
    }
  }, []);
  // 초기 설정
  useEffect(() => {
    isMountedRef.current = true;

    startTracking();
    DeviceMotion.setUpdateInterval(16);

    let deviceMotionSubscription = DeviceMotion.addListener((motionData) => {
      if (!isMountedRef.current) return;

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

      if (isMountedRef.current) {
        setDeviceMotionHeading(+calculatedHeading.toFixed(1));
      }
    });

    return () => {
      isMountedRef.current = false;

      locationSubscription?.remove();
      headingSubscription?.remove();
      deviceMotionSubscription?.remove();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (dragTimeoutRef.current) clearTimeout(dragTimeoutRef.current);
    };
  }, [startTracking]);

  // 초기 지도 핏
  useEffect(() => {
    if (!isMountedRef.current || !mapReady) return;

    if (userLocation && parkedLocation && !isInitialized) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          fitMapToShowBothLocations();
        }
      }, 500);
    }
  }, [
    userLocation,
    parkedLocation,
    fitMapToShowBothLocations,
    isInitialized,
    mapReady,
  ]);
  // 카메라 실시간 업데이트
  useEffect(() => {
    if (!isMountedRef.current || !mapReady) return;

    if (isInitialized && !drag && userLocation && parkedLocation) {
      updateCamera();
    }
  }, [
    heading,
    deviceMotionHeading,
    isInitialized,
    drag,
    updateCamera,
    mapReady,
  ]);

  // 반환값
  return {
    mapRef,
    userLocation,
    parkedLocation,
    mapReady,
    handleMapReady,
    handleTouchStart,
    handleTouchEnd,
  };
};
