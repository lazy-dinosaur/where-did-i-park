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
import { useEffect, useState } from "react";
import { Platform, Text, View } from "react-native";
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

  // 두 지점 간의 거리 계산 (미터 단위)
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number => {
    const R = 6371e3; // 지구 반지름 (미터)
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  useEffect(() => {
    startTracking();
    DeviceMotion.setUpdateInterval(16); // 100ms마다 업데이트

    let deviceMotionSubscription = DeviceMotion.addListener((motionData) => {
      // motionData 전체를 체크
      if (!motionData || !motionData.rotation) {
        return;
      }

      const { rotation } = motionData;

      // rotation 객체와 alpha 값 체크
      if (!rotation || typeof rotation.alpha !== "number") {
        return;
      }

      const { alpha } = rotation;

      // Calculate heading
      let calculatedHeading = 360 - (alpha * 180) / Math.PI;
      if (calculatedHeading < 0) {
        calculatedHeading += 360;
      }
      if (calculatedHeading > 360) {
        calculatedHeading -= 360;
      }
      setDeviceMotionHeading(+calculatedHeading.toFixed(1));
    });

    return () => {
      // 정리
      if (locationSubscription) locationSubscription.remove();
      if (headingSubscription) headingSubscription.remove();
      if (deviceMotionSubscription) deviceMotionSubscription.remove();
    };
  }, []);

  const startTracking = async () => {
    // 권한 요청
    const { status } = await requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("위치 권한이 거부되었습니다");
      return;
    }

    // 위치 추적 시작
    const locSubscription = await watchPositionAsync(
      {
        accuracy: Accuracy.High,
        timeInterval: 500, // 1초마다 업데이트
        distanceInterval: 0.1, // 1미터 이동시마다 업데이트
      },
      (locationData) => {
        setUserLocation(locationData);
      },
    );

    // 나침반 추적 시작
    const headSubscription = await watchHeadingAsync(
      (headingData) => {
        if (headingData.trueHeading > 0) setHeading(headingData);
      },
      (error) => {
        console.error("나침반 에러:", error);
      },
    );

    setLocationSubscription(locSubscription);
    setHeadingSubscription(headSubscription);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <MapView
        style={{ width: "100%", height: "100%" }}
        showsUserLocation
        initialCamera={{
          center: {
            longitude: userLocation?.coords.longitude || 0,
            latitude: userLocation?.coords.latitude || 0,
          },
          pitch: 20,
          heading:
            Platform.OS === "android"
              ? deviceMotionHeading || 0
              : heading?.trueHeading || 0,
          altitude: 180,
          zoom: 18,
        }}
        camera={{
          center: {
            longitude: userLocation?.coords.longitude || 0,
            latitude: userLocation?.coords.latitude || 0,
          },
          pitch: 20,
          heading:
            Platform.OS === "android"
              ? deviceMotionHeading || 0
              : heading?.trueHeading || 0,
          altitude: 180,
          zoom: 18,
        }}
      >
        {/* 주차 위치 마커 */}
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
