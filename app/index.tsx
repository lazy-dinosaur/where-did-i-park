import InfoComponent from "./info-component";
import ButtonComponent from "./button-component";
import CameraComponent from "./camera-component";
import ScreenWrapper from "@/components/screen-wrapper";
import { useEffect, useRef, useState } from "react";
import { useCameraPermissions, CameraView } from "expo-camera";
import { Text, View, Pressable, StyleSheet } from "react-native";
import { useForegroundPermissions } from "expo-location";
import { useRouter } from "expo-router";
import { getData } from "@/utils/storage";
import { useTheme } from "@/hooks/use-theme";
import { LinearGradient } from "expo-linear-gradient";

export default function Index() {
  const [permission, requestPermission] = useCameraPermissions();
  const [loaded, setLoaded] = useState(false);
  const [locationPermission, requestLocationPermission] =
    useForegroundPermissions();
  const cameraRef = useRef<CameraView>(null);
  const route = useRouter();
  const { colors, isDark } = useTheme();

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
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          로딩 중...
        </Text>
      </View>
    );
  }

  if (!permission.granted || !locationPermission.granted) {
    return (
      <LinearGradient
        colors={
          isDark
            ? (colors.gradientDark as any)
            : (["#E3F2FD", "#BBDEFB", "#90CAF9"] as any)
        }
        style={styles.permissionContainer}
      >
        <View
          style={[
            styles.permissionContent,
            {
              backgroundColor: isDark
                ? "rgba(28, 28, 30, 0.95)"
                : "rgba(255, 255, 255, 0.95)",
            },
          ]}
        >
          <View
            style={[styles.logoContainer, { backgroundColor: colors.surface }]}
          >
            {/* 로고의 노란 자동차 */}
          </View>

          <Text style={[styles.appTitle, { color: colors.text }]}>
            잊지마차
          </Text>
          <Text style={[styles.appSubtitle, { color: colors.textSecondary }]}>
            차량 위치를 쉽게 기억하고 찾아보세요
          </Text>

          <View style={styles.permissionSection}>
            {!permission.granted && (
              <View
                style={[
                  styles.permissionItem,
                  { backgroundColor: colors.surfaceSecondary },
                ]}
              >
                <View
                  style={[
                    styles.permissionIconBg,
                    { backgroundColor: colors.surface },
                  ]}
                >
                  <Text style={styles.permissionIcon}>📷</Text>
                </View>
                <View style={styles.permissionTextContainer}>
                  <Text
                    style={[styles.permissionTitle, { color: colors.text }]}
                  >
                    카메라 권한
                  </Text>
                  <Text
                    style={[
                      styles.permissionDescription,
                      { color: colors.textSecondary },
                    ]}
                  >
                    주차 위치 사진을 촬영하기 위해 필요합니다
                  </Text>
                </View>
              </View>
            )}

            {!locationPermission.granted && (
              <View
                style={[
                  styles.permissionItem,
                  { backgroundColor: colors.surfaceSecondary },
                ]}
              >
                <View
                  style={[
                    styles.permissionIconBg,
                    { backgroundColor: colors.surface },
                  ]}
                >
                  <Text style={styles.permissionIcon}>📍</Text>
                </View>
                <View style={styles.permissionTextContainer}>
                  <Text
                    style={[styles.permissionTitle, { color: colors.text }]}
                  >
                    위치 권한
                  </Text>
                  <Text
                    style={[
                      styles.permissionDescription,
                      { color: colors.textSecondary },
                    ]}
                  >
                    정확한 주차 위치를 저장하기 위해 필요합니다
                  </Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.buttonContainer}>
            {!permission.granted && (
              <Pressable
                style={styles.permissionButton}
                onPress={requestPermission}
              >
                <LinearGradient
                  colors={colors.gradientSecondary as any}
                  style={styles.gradientButton}
                >
                  <Text style={styles.buttonText}>📷 카메라 권한 허용</Text>
                </LinearGradient>
              </Pressable>
            )}

            {!locationPermission.granted && (
              <Pressable
                style={styles.permissionButton}
                onPress={requestLocationPermission}
              >
                <LinearGradient
                  colors={colors.gradientPrimary as any}
                  style={styles.gradientButton}
                >
                  <Text style={styles.buttonText}>📍 위치 권한 허용</Text>
                </LinearGradient>
              </Pressable>
            )}
          </View>

          <Text style={styles.footerText}>
            권한은 앱에서만 사용되며 외부로 전송되지 않습니다
          </Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <ScreenWrapper backgroundColor={colors.background}>
      <InfoComponent />
      <CameraComponent ref={cameraRef} />
      <ButtonComponent ref={cameraRef} />
    </ScreenWrapper>
  );
}

const createDynamicStyles = (colors: any, isDark: boolean) =>
  StyleSheet.create({
    // 동적 스타일이 필요한 경우 여기에 추가
  });

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    fontSize: 18,
    color: "#666",
    fontWeight: "500",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  permissionContent: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 25,
    padding: 30,
    margin: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#fff",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  // 새로운 로고 스타일
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 10,
  },
  speechBubble: {
    backgroundColor: "#4A90E2",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 10,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  speechBubbleText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  speechBubbleTail: {
    position: "absolute",
    bottom: -8,
    left: "50%",
    marginLeft: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#4A90E2",
  },
  carContainer: {
    width: 90,
    height: 60,
    backgroundColor: "#FFD700",
    borderRadius: 30,
    position: "relative",
    borderWidth: 3,
    borderColor: "#1E3A8A",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  carWindow: {
    position: "absolute",
    top: 8,
    left: 15,
    width: 60,
    height: 25,
    backgroundColor: "#87CEEB",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#1E3A8A",
  },
  carFace: {
    position: "absolute",
    bottom: 8,
    left: "50%",
    marginLeft: -15,
    width: 30,
    height: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  carEyes: {
    fontSize: 12,
    color: "#1E3A8A",
    fontWeight: "bold",
    marginBottom: -2,
  },
  carMouth: {
    fontSize: 10,
    color: "#1E3A8A",
    fontWeight: "bold",
  },
  carWheels: {
    position: "absolute",
    bottom: -8,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  wheel: {
    width: 16,
    height: 16,
    backgroundColor: "#1E3A8A",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#87CEEB",
  },
  appIcon: {
    fontSize: 40,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 8,
    textAlign: "center",
  },
  appSubtitle: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  permissionSection: {
    width: "100%",
    marginBottom: 30,
  },
  permissionItem: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
  permissionIconBg: {
    width: 50,
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  permissionIcon: {
    fontSize: 24,
  },
  permissionTextContainer: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 4,
  },
  permissionDescription: {
    fontSize: 14,
    color: "#7f8c8d",
    lineHeight: 18,
  },
  buttonContainer: {
    width: "100%",
    gap: 15,
  },
  permissionButton: {
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  gradientButton: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: "center",
    borderRadius: 15,
  },
  cameraButton: {
    backgroundColor: "#ff6b6b",
  },
  locationButton: {
    backgroundColor: "#4ecdc4",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footerText: {
    fontSize: 12,
    color: "#95a5a6",
    textAlign: "center",
    marginTop: 20,
    lineHeight: 16,
  },
});
