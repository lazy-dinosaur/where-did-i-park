import InfoComponent from "./info-component";
import ButtonComponent from "./button-component";
import CameraComponent from "./camera-component";
import ScreenWrapper from "@/component/screen-wrapper";
import { useRef } from "react";
import { useCameraPermissions, CameraView } from "expo-camera";
import { Text, View, Button } from "react-native";

export default function Index() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 100,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            marginBottom: 20,
          }}
        >
          카메라 권한이 필요합니다.
        </Text>
        <Button title="권한 요청" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <ScreenWrapper>
      <InfoComponent />
      <CameraComponent ref={cameraRef} />
      <ButtonComponent
        onClick={async () => {
          const picture = await cameraRef.current?.takePictureAsync();
          const { uri } = picture!;
          console.log(uri);
        }}
      />
    </ScreenWrapper>
  );
}
