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
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>로딩 중...</Text>
      </View>
    );
  }

  if (!permission.granted || !locationPermission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <View style={styles.permissionContent}>
          <View style={styles.iconContainer}>
            <Text style={styles.appIcon}>🚗</Text>
          </View>
          
          <Text style={styles.appTitle}>어디 주차했지?</Text>
          <Text style={styles.appSubtitle}>
            차량 위치를 쉽게 기억하고 찾아보세요
          </Text>

          <View style={styles.permissionSection}>
            {!permission.granted && (
              <View style={styles.permissionItem}>
                <View style={styles.permissionIconBg}>
                  <Text style={styles.permissionIcon}>📷</Text>
                </View>
                <View style={styles.permissionTextContainer}>
                  <Text style={styles.permissionTitle}>카메라 권한</Text>
                  <Text style={styles.permissionDescription}>
                    주차 위치 사진을 촬영하기 위해 필요합니다
                  </Text>
                </View>
              </View>
            )}

            {!locationPermission.granted && (
              <View style={styles.permissionItem}>
                <View style={styles.permissionIconBg}>
                  <Text style={styles.permissionIcon}>📍</Text>
                </View>
                <View style={styles.permissionTextContainer}>
                  <Text style={styles.permissionTitle}>위치 권한</Text>  
                  <Text style={styles.permissionDescription}>
                    정확한 주차 위치를 저장하기 위해 필요합니다
                  </Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.buttonContainer}>
            {!permission.granted && (
              <Pressable
                style={[styles.permissionButton, styles.cameraButton]}
                onPress={requestPermission}
              >
                <Text style={styles.buttonText}>📷 카메라 권한 허용</Text>
              </Pressable>
            )}

            {!locationPermission.granted && (
              <Pressable
                style={[styles.permissionButton, styles.locationButton]}
                onPress={requestLocationPermission}
              >
                <Text style={styles.buttonText}>📍 위치 권한 허용</Text>
              </Pressable>
            )}
          </View>

          <Text style={styles.footerText}>
            권한은 앱에서만 사용되며 외부로 전송되지 않습니다
          </Text>
        </View>
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#667eea',
    backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  permissionContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    padding: 30,
    margin: 20,
    alignItems: 'center',
    shadowColor: '#000',
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
    backgroundColor: '#fff',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  appIcon: {
    fontSize: 40,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  appSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  permissionSection: {
    width: '100%',
    marginBottom: 30,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
  permissionIconBg: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: '#000',
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
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  permissionDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 18,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  permissionButton: {
    borderRadius: 15,
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  cameraButton: {
    backgroundColor: '#ff6b6b',
  },
  locationButton: {
    backgroundColor: '#4ecdc4',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    fontSize: 12,
    color: '#95a5a6',
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 16,
  },
});
