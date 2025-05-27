import { storeData } from "@/utils/storage";
import { CameraView } from "expo-camera";
import { getCurrentPositionAsync } from "expo-location";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet, ActivityIndicator } from "react-native";

const ButtonComponent = ({
  ref,
}: {
  ref: React.RefObject<CameraView | null>;
}) => {
  const route = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleButtonPress = useCallback(async () => {
    setIsLoading(true);
    try {
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
    } catch (error) {
      console.error("주차 기록 실패:", error);
    } finally {
      setIsLoading(false);
    }
  }, [ref, route]);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={handleButtonPress}
        disabled={isLoading}
        style={[styles.button, isLoading && styles.buttonDisabled]}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <View style={styles.loadingContent}>
            <ActivityIndicator color="white" size="small" />
            <Text style={styles.loadingText}>기록 중...</Text>
          </View>
        ) : (
          <View style={styles.buttonContent}>
            <Text style={styles.buttonIcon}>📸</Text>
            <Text style={styles.buttonText}>주차 기록하기</Text>
          </View>
        )}
      </TouchableOpacity>
      
      <Text style={styles.hintText}>
        탭하여 현재 위치와 사진을 저장하세요
      </Text>
    </View>
  );
};

export default ButtonComponent;

const styles = StyleSheet.create({
  container: {
    height: "20%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 40,
    shadowColor: "#007AFF",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 200,
  },
  buttonDisabled: {
    backgroundColor: "#95a5a6",
    shadowColor: "#95a5a6",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  loadingContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 10,
  },
  hintText: {
    fontSize: 14,
    color: "#7f8c8d",
    textAlign: "center",
    marginTop: 15,
    lineHeight: 18,
  },
});
