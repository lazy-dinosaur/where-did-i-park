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
  const [isCameraUpdatePaused, setIsCameraUpdatePaused] = useState(false);

  // Refs
  const mapRef = useRef<MapView>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);

  // 부드러운 헤딩 보간을 위한 Refs
  const currentHeadingRef = useRef<number>(0);
  const targetHeadingRef = useRef<number>(0);
  const lastUpdateTimeRef = useRef<number>(0);
  const animationFrameIdRef = useRef<number | null>(null);

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
          // 실시간 업데이트의 경우 duration을 0으로 설정하여 지연 없이 바로 적용
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

  // 수동 지도 핏 (버튼 클릭 시 사용)
  const manualFitToCoordinates = useCallback(async () => {
    const map = safeMapRef();
    if (!map || !userLocation || !parkedLocation) return;

    try {
      // 카메라 업데이트 일시 중단
      setIsCameraUpdatePaused(true);

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

      // 1단계: fitToCoordinates로 전체 보기
      map.fitToCoordinates(coordinates, {
        edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
        animated: true,
      });

      // 2단계: fitToCoordinates 애니메이션 완료 대기 후 중간점으로 애니메이션 이동
      setTimeout(async () => {
        if (!isMountedRef.current) return;

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

          // 애니메이션이 있는 카메라 이동
          map.animateCamera(newCamera, { duration: 500 });

          // 3단계: 애니메이션 완료 후 일반 setCamera 동작 재개
          setTimeout(() => {
            if (isMountedRef.current) {
              setIsCameraUpdatePaused(false);
            }
          }, 500);
        } catch (error) {
          console.warn("중간점 카메라 이동 실패:", error);
          setIsCameraUpdatePaused(false);
        }
      }, 1000);
    } catch (error) {
      console.warn("수동 지도 핏 실패:", error);
      setIsCameraUpdatePaused(false);
    }
  }, [
    userLocation,
    parkedLocation,
    safeMapRef,
    getMiddlePoint,
    deviceMotionHeading,
    heading,
  ]);
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

  // 부드러운 헤딩 업데이트 함수
  const updateSmoothHeading = useCallback(() => {
    if (!isMountedRef.current) return;

    const now = Date.now();
    // 60fps에 맞춰 업데이트 (약 16.7ms 간격)
    if (now - lastUpdateTimeRef.current >= 16.7) {
      lastUpdateTimeRef.current = now;

      // 현재 heading에서 목표 heading으로 부드럽게 이동
      const diff = targetHeadingRef.current - currentHeadingRef.current;

      // 각도 차이가 180도 이상일 때 처리 (예: 350도 -> 10도)
      let adjustedDiff = diff;
      if (Math.abs(diff) > 180) {
        adjustedDiff = diff > 0 ? diff - 360 : diff + 360;
      }

      // 부드러운 보간 (이동 속도 조절)
      // 0.15는 부드러움의 정도를 조절하는 계수 (값이 클수록 빠르게 따라감)
      currentHeadingRef.current += adjustedDiff * 0.15;

      // 360도 범위 내로 유지
      if (currentHeadingRef.current < 0) currentHeadingRef.current += 360;
      if (currentHeadingRef.current >= 360) currentHeadingRef.current -= 360;

      // 상태 업데이트 (UI 렌더링용)
      setDeviceMotionHeading(+currentHeadingRef.current.toFixed(1));
    }

    animationFrameIdRef.current = requestAnimationFrame(updateSmoothHeading);
  }, []);

  // 초기 설정
  useEffect(() => {
    isMountedRef.current = true;
    lastUpdateTimeRef.current = Date.now();

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

      // 계산된 헤딩 값을 타겟 헤딩으로 설정 (직접 상태를 업데이트하지 않음)
      targetHeadingRef.current = calculatedHeading;
    });

    // 부드러운 헤딩 업데이트 시작
    animationFrameIdRef.current = requestAnimationFrame(updateSmoothHeading);

    return () => {
      isMountedRef.current = false;

      locationSubscription?.remove();
      headingSubscription?.remove();
      deviceMotionSubscription?.remove();

      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (dragTimeoutRef.current) clearTimeout(dragTimeoutRef.current);
    };
  }, [startTracking, updateSmoothHeading]);
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

    if (
      isInitialized &&
      !drag &&
      !isCameraUpdatePaused &&
      userLocation &&
      parkedLocation
    ) {
      updateCamera();
    }
  }, [
    heading,
    deviceMotionHeading,
    isInitialized,
    drag,
    isCameraUpdatePaused,
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
    manualFitToCoordinates,
    isCameraUpdatePaused,
  };
};
