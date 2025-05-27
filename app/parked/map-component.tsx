import { LocationObject } from "expo-location";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Modal,
  Pressable,
  Platform,
} from "react-native";
import MapView, { Marker, MapType } from "react-native-maps";
import { useMapController } from "@/hooks/use-map-controller";
import { useTheme } from "@/hooks/use-theme";
import { useState } from "react";
import { calculateDistance } from "@/utils/libs";

const MapComponent = ({ location }: { location: LocationObject | null }) => {
  const {
    mapRef,
    userLocation,
    handleMapReady,
    handleTouchStart,
    handleTouchEnd,
    manualFitToCoordinates,
    isCameraUpdatePaused,
  } = useMapController({ parkedLocation: location });

  const { colors, isDark } = useTheme();
  const [showFullscreen, setShowFullscreen] = useState(false);

  // 플랫폼별 맵 설정
  const getMapProps = () => {
    const baseProps = {
      ref: mapRef,
      style: styles.map,
      initialRegion: initialRegion,
      showsUserLocation: true,
      showsMyLocationButton: false,
      showsCompass: false,
      followsUserLocation: false,
      scrollEnabled: true,
      zoomEnabled: true,
      rotateEnabled: true,
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
      onMapReady: handleMapReady,
      showsPointsOfInterest: true,
      showsBuildings: true,
      showsTraffic: false,
    };

    // iOS에서만 mapType 속성 추가
    if (Platform.OS === 'ios') {
      return {
        ...baseProps,
        mapType: (isDark ? "mutedStandard" : "standard") as MapType,
      };
    }

    return baseProps;
  };

  const getFullscreenMapProps = () => {
    const baseProps = {
      style: styles.fullscreenMap,
      initialRegion: initialRegion,
      showsUserLocation: true,
      showsMyLocationButton: true,
      showsCompass: false,
      followsUserLocation: false,
      scrollEnabled: true,
      zoomEnabled: true,
      rotateEnabled: true,
      showsPointsOfInterest: true,
      showsBuildings: true,
      showsTraffic: false,
    };

    // iOS에서만 mapType 속성 추가
    if (Platform.OS === 'ios') {
      return {
        ...baseProps,
        mapType: (isDark ? "mutedStandard" : "standard") as MapType,
      };
    }

    return baseProps;
  };

  // 거리 계산
  const getDistance = () => {
    if (!location || !userLocation) return null;

    const distance = calculateDistance(
      userLocation.coords.latitude,
      userLocation.coords.longitude,
      location.coords.latitude,
      location.coords.longitude,
    );

    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    } else {
      return `${(distance / 1000).toFixed(1)}km`;
    }
  };

  if (!location) {
    return (
      <View
        style={[
          styles.placeholderContainer,
          { backgroundColor: colors.surfaceSecondary },
        ]}
      >
        <Text style={styles.placeholderIcon}>🗺️</Text>
        <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>
          위치 정보 로딩 중...
        </Text>
      </View>
    );
  }

  const initialRegion = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <>
      <View style={styles.container}>
        <MapView
          {...getMapProps()}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="🚗 주차 위치"
            description="여기에 차를 주차했습니다"
            pinColor="red"
          />
        </MapView>

        <View style={styles.buttonOverlay}>
          <Pressable
            onPress={() => setShowFullscreen(true)}
            style={[
              styles.fullscreenButton,
              { backgroundColor: colors.surface },
            ]}
          >
            <Text style={styles.fullscreenIcon}>🗺️</Text>
            <Text style={[styles.fullscreenText, { color: colors.text }]}>
              전체보기
            </Text>
          </Pressable>
        </View>

        <TouchableOpacity
          style={[
            styles.controlButton,
            {
              backgroundColor: isCameraUpdatePaused
                ? colors.warning
                : colors.primary,
            },
          ]}
          onPress={manualFitToCoordinates}
          disabled={isCameraUpdatePaused}
        >
          <Text style={styles.controlButtonText}>
            {isCameraUpdatePaused ? "조정 중..." : "📍 위치보기"}
          </Text>
        </TouchableOpacity>

        {/* 정보 카드 (좌상단) */}
        <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>
            🚗 주차 위치
          </Text>
          {getDistance() && (
            <Text style={[styles.distanceText, { color: colors.primary }]}>
              📏 거리: {getDistance()}
            </Text>
          )}
          <Text style={[styles.accuracyText, { color: colors.textSecondary }]}>
            정확도: ±{location.coords.accuracy?.toFixed(0)}m
          </Text>
        </View>
      </View>

      <Modal
        visible={showFullscreen}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setShowFullscreen(false)}
      >
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <MapView
            {...getFullscreenMapProps()}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="🚗 주차 위치"
              description="여기에 차를 주차했습니다"
              pinColor="red"
            />
          </MapView>

          <Pressable
            onPress={() => setShowFullscreen(false)}
            style={[styles.closeButton, { backgroundColor: colors.surface }]}
          >
            <Text style={[styles.closeButtonText, { color: colors.text }]}>
              ✕ 닫기
            </Text>
          </Pressable>
        </View>
      </Modal>
    </>
  );
};

export default MapComponent;

const styles = StyleSheet.create({
  container: {
    height: 300,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#f8f9fa",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  placeholderContainer: {
    height: 300,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  placeholderIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: "500",
  },
  buttonOverlay: {
    position: "absolute",
    top: 15,
    right: 15,
  },
  fullscreenButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  fullscreenIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  fullscreenText: {
    fontSize: 12,
    fontWeight: "600",
  },
  controlButton: {
    position: "absolute",
    bottom: 15,
    right: 15,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  controlButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  infoCard: {
    position: "absolute",
    top: 15,
    left: 15,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 2,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 2,
  },
  accuracyText: {
    fontSize: 11,
    fontWeight: "400",
  },
  modalContainer: {
    flex: 1,
    position: "relative",
  },
  fullscreenMap: {
    width: "100%",
    height: "100%",
  },
  closeButton: {
    position: "absolute",
    top: 60,
    right: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
