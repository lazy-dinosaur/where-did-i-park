import { useFonts } from "expo-font";
import { useAssets } from "expo-asset";
import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

const fontsToLoad = {
  SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
};
const imagesToLoad = [require("../assets/images/react-logo.png")];

export default function RootLayout() {
  const [fontLoaded, fontError] = useFonts(fontsToLoad);
  const [imageAssets, imageError] = useAssets(imagesToLoad);

  // 초기화 시 스플래시 스크린을 숨기지 않도록 설정
  useEffect(() => {
    async function prepareAppResources() {
      try {
        await SplashScreen.preventAutoHideAsync();
        // 에셋 불러오는 로직
      } catch (e) {
        console.warn("앱 리소스 준비 중 에러 발생:", e);
      }
    }
    prepareAppResources();
  }, []);

  // 폰트 로딩 에러 처리
  useEffect(() => {
    if (fontError) {
      console.error("폰트 로딩 에러:", fontError);
      SplashScreen.hideAsync();
    }
    if (imageError) {
      console.error("이미지 에셋 로딩 에러:", imageError);
      SplashScreen.hideAsync();
    }
  }, [fontError, imageError]);

  // 모든 에셋이 로드되면 스플래시 스크린 숨기기
  useEffect(() => {
    if (fontLoaded && imageAssets) {
      SplashScreen.hideAsync();
    }
  }, [fontLoaded, imageAssets]);

  if (!fontLoaded || !imageAssets) {
    return null;
  }
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
            gestureEnabled: false,
            animation: "slide_from_left",
          }}
        />
        <Stack.Screen
          name="parked/index"
          options={{
            headerShown: false,
            gestureEnabled: false,
            animation: "slide_from_right",
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
