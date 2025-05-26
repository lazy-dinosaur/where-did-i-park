import { LocationObject } from "expo-location";
import { View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useMapController } from "@/hooks/use-map-controller";

// 에러 폴백 컴포넌트

const MapComponent = ({ location }: { location: LocationObject | null }) => {
  const {
    mapRef,
    parkedLocation,
    handleMapReady,
    handleTouchStart,
    handleTouchEnd,
  } = useMapController({ parkedLocation: location });

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "black",
        borderRadius: 25,
        overflow: "hidden",
      }}
    >
      <MapView
        ref={mapRef}
        style={{ width: "100%", height: "100%" }}
        showsUserLocation
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
    </View>
  );
};

export default MapComponent;
