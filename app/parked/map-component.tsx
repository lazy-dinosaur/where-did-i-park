import { LocationObject } from "expo-location";
import { TouchableOpacity, Text, View, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useMapController } from "@/hooks/use-map-controller";

const { width } = Dimensions.get('window');

const MapComponent = ({ location }: { location: LocationObject | null }) => {
  const {
    mapRef,
    parkedLocation,
    handleMapReady,
    handleTouchStart,
    handleTouchEnd,
    manualFitToCoordinates,
    isCameraUpdatePaused,
  } = useMapController({ parkedLocation: location });

  // 로딩 상태 또는 위치 없음
  if (!location) {
    return (
      <View style={styles.placeholderContainer}>
        <Text style={styles.placeholderIcon}>🗺️</Text>
        <Text style={styles.placeholderText}>위치 정보 로딩 중...</Text>
      </View>
    );
  }

  // 초기 지역 설정 (주차 위치 기준)
  const initialRegion = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
        followsUserLocation={false}
        scrollEnabled={true}
        zoomEnabled={true}
        rotateEnabled={true}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMapReady={handleMapReady}
        mapType="standard"
        showsPointsOfInterest={true}
        showsBuildings={true}
        showsTraffic={false}
      >
        {/* 주차 위치 마커 */}
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

      {/* 컨트롤 버튼 */}
      <TouchableOpacity
        style={[
          styles.controlButton,
          {
            backgroundColor: isCameraUpdatePaused ? "#FF6B6B" : "#007AFF",
          }
        ]}
        onPress={manualFitToCoordinates}
        disabled={isCameraUpdatePaused}
      >
        <Text style={styles.controlButtonText}>
          {isCameraUpdatePaused ? "조정 중..." : "📍 위치보기"}
        </Text>
      </TouchableOpacity>

      {/* 정보 카드 */}
      <View style={styles.infoCard}>
        <Text style={styles.infoText}>
          📍 위도: {location.coords.latitude.toFixed(6)}
        </Text>
        <Text style={styles.infoText}>
          📍 경도: {location.coords.longitude.toFixed(6)}
        </Text>
        <Text style={styles.accuracyText}>
          정확도: ±{location.coords.accuracy?.toFixed(0)}m
        </Text>
      </View>
    </View>
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
    backgroundColor: "#e9ecef",
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
    color: "#6c757d",
    fontWeight: "500",
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
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  infoText: {
    fontSize: 12,
    color: "#2c3e50",
    fontWeight: "500",
    marginBottom: 2,
  },
  accuracyText: {
    fontSize: 11,
    color: "#7f8c8d",
    fontWeight: "400",
  },
});
