import InfoComponent from "./info-component";
import ButtonComponent from "./button-component";
import CameraComponent from "./camera-component";
import ScreenWrapper from "@/components/screen-wrapper";
import { useEffect, useRef, useState } from "react";
import { useCameraPermissions, CameraView } from "expo-camera";
import { Text, View, Button } from "react-native";
import { useForegroundPermissions } from "expo-location";
import { useRouter } from "expo-router";
import { getData } from "@/utils/storage";

export default function Index() {
  const [permission, requestPermission] = useCameraPermissions();
  const [loaded, setLoaded] = useState(false);
  const [locationPermission, requestLocationPermission] =
    useForegroundPermissions();
  const cameraRef = useRef<CameraView>(null);
  const route = useRouter();
  useEffect(() => {
    async function checkParked() {
      const image = await getData("image");
      const location = await getData("location");
      if (image && location) {
        route.push("/parked");
      }
      setTimeout(() => setLoaded(true), 500);
    }
    checkParked();
  }, [route]);

  if (!permission || !locationPermission || !loaded) {
    return <View />;
  }

  if (!permission.granted || !locationPermission.granted) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 100,
        }}
      >
        {!permission.granted && (
          <>
            <Text
              style={{
                fontSize: 20,
                marginBottom: 20,
              }}
            >
              카메라 권한이 필요합니다.
            </Text>
            <Button title="권한 요청" onPress={requestPermission} />
          </>
        )}
        {!locationPermission.granted && (
          <>
            <Text
              style={{
                fontSize: 20,
                marginBottom: 20,
              }}
            >
              위치 권한이 필요합니다.
            </Text>
            <Button title="권한 요청" onPress={requestLocationPermission} />
          </>
        )}
      </View>
    );
  }

  return (
    <ScreenWrapper>
      <InfoComponent />
      <CameraComponent ref={cameraRef} />
      <ButtonComponent ref={cameraRef} />
    </ScreenWrapper>
  );
}
