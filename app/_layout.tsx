import { useFonts } from "expo-font";
import { useAssets } from "expo-asset";
import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  View,
  Image,
  StyleSheet,
  useColorScheme,
  Animated,
} from "react-native";

const fontsToLoad = {
  SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
};
const imagesToLoad = [require("../assets/images/react-logo.png")];

export default function RootLayout() {
  const [fontLoaded, fontError] = useFonts(fontsToLoad);
  const [imageAssets, imageError] = useAssets(imagesToLoad);
  const [appIsReady, setAppIsReady] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const fadeAnim = useState(new Animated.Value(1))[0]; // 페이드 애니메이션

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
      // 페이드 아웃 애니메이션 후 앱 준비 완료로 설정
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          setAppIsReady(true);
          SplashScreen.hideAsync();
        });
      }, 800); // 0.8초 후 페이드 아웃 시작
    }
  }, [fontLoaded, imageAssets, fadeAnim]);

  // 커스텀 스플래시 화면 표시
  if (!appIsReady) {
    return (
      <Animated.View
        style={[
          styles.splashContainer,
          {
            backgroundColor: isDark ? "#1C252E" : "#E3F2FD",
            opacity: fadeAnim,
          },
        ]}
      >
        <Animated.Image
          source={require("../assets/images/잊지마차.png")}
          style={[styles.splashLogo, { opacity: fadeAnim }]}
          resizeMode="contain"
        />
      </Animated.View>
    );
  }

  if (!fontLoaded || !imageAssets) {
    return (
      <View
        style={[
          styles.splashContainer,
          { backgroundColor: isDark ? "#1C252E" : "#E3F2FD" },
        ]}
      >
        <Animated.Image
          source={require("../assets/images/잊지마차.png")}
          style={[styles.splashLogo, { opacity: fadeAnim }]}
          resizeMode="contain"
        />
      </View>
    );
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

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  splashLogo: {
    width: 200,
    height: 160,
    shadowColor: "#1E3A8A",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
});
