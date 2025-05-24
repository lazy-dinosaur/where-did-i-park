import { storeData } from "@/utils/storage";
import { CameraView } from "expo-camera";
import { getCurrentPositionAsync } from "expo-location";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const ButtonComponent = ({
  ref,
}: {
  ref: React.RefObject<CameraView | null>;
}) => {
  const route = useRouter();
  const handleButtonPress = useCallback(async () => {
    const picture = await ref.current?.takePictureAsync();
    const location = await getCurrentPositionAsync();
    const { uri } = picture!;
    const image = await storeData({ key: "image", value: uri });
    const locationData = await storeData({ key: "location", value: location });
    if (image && locationData) {
      route.push("/parked");
    } else {
      console.warn("사진 혹은 위치 저장 실패");
    }
  }, [ref, route]);

  return (
    <View
      style={{
        height: "20%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TouchableOpacity onPress={handleButtonPress}>
        <View
          style={{
            padding: 15,
            backgroundColor: "#007AFF",
            borderRadius: 10,
            paddingHorizontal: 40,
          }}
        >
          <Text style={{ color: "white", fontSize: 20 }}>주차 하기</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
export default ButtonComponent;
