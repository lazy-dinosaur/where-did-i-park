import { LocationObject } from "expo-location";
import { TouchableOpacity, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useMapController } from "@/hooks/use-map-controller";

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

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "black",
        borderRadius: 25,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <MapView
        ref={mapRef}
        style={{ width: "100%", height: "100%" }}
        showsUserLocation
        followsUserLocation={false}
        scrollEnabled={true}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMapReady={handleMapReady}
        initialCamera={{
          center: {
            longitude: parkedLocation?.coords.longitude || 0,
            latitude: parkedLocation?.coords.latitude || 0,
          },
          pitch: 0,
          heading: 0,
          altitude: 180,
          zoom: 18,
        }}
      >
        {parkedLocation && (
          <Marker
            coordinate={{
              latitude: parkedLocation.coords.latitude,
              longitude: parkedLocation.coords.longitude,
            }}
            title="주차 위치"
            description="여기에 차를 주차했습니다"
            pinColor="red"
          />
        )}
      </MapView>

      {/* 핏 버튼 */}
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          backgroundColor: isCameraUpdatePaused ? "#FF6B6B" : "#007AFF",
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderRadius: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
        onPress={manualFitToCoordinates}
        disabled={isCameraUpdatePaused}
      >
        <Text
          style={{
            color: "white",
            fontSize: 14,
            fontWeight: "600",
          }}
        >
          {isCameraUpdatePaused ? "조정 중..." : "위치보기"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default MapComponent;
