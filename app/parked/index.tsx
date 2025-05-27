import { getData, storeData } from "@/utils/storage";
import { useEffect, useState, useCallback } from "react";
import {
  View,
  Pressable,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
  Image,
  BackHandler,
} from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ImageComponent from "./image-component";
import MapComponent from "./map-component";
import ScreenWrapper from "@/components/screen-wrapper";
import MemoComponent from "./memo-component";
import { useRouter, useFocusEffect } from "expo-router";
import { useTheme } from "@/hooks/use-theme";

export default function Parked() {
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const router = useRouter();
  const { colors, isDark } = useTheme();

  useEffect(() => {
    getData("image").then((res) => {
      setImage(res);
    });
    getData("location").then((res) => {
      setLocation(res);
    });
  }, []);

  useEffect(() => {
    console.log("image", image);
    console.log("location", location);
  }, [image, location]);

  // 뒤로가기 제스처 및 하드웨어 버튼 비활성화
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // 뒤로가기를 완전히 차단하고 대신 안내 메시지 표시
        Alert.alert(
          "🚗 주차 정보",
          "차를 찾으셨나요? '차를 찾았어요!' 버튼을 눌러주세요.",
          [
            { text: "확인", style: "default" }
          ]
        );
        return true; // 뒤로가기 동작을 차단
      };

      // Android 하드웨어 뒤로가기 핸들러 등록
      const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        // 컴포넌트 언마운트 시 핸들러 제거
        backHandler.remove();
      };
    }, [])
  );

  const handleFoundCar = () => {
    Alert.alert(
      "🚗 차를 찾았나요?",
      "주차 정보를 모두 삭제하고 메인 화면으로 돌아갑니다.",
      [
        { text: "취소", style: "cancel" },
        {
          text: "네, 찾았어요!",
          style: "default",
          onPress: async () => {
            // 모든 주차 데이터 삭제
            await storeData({ key: "image", value: "" });
            await storeData({ key: "location", value: "" });
            await storeData({ key: "memo", value: [] });
            // 메인 화면으로 이동
            router.replace("/");
          },
        },
      ],
    );
  };

  if (!image && !location) {
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

  const dynamicStyles = createDynamicStyles(colors, isDark);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScreenWrapper backgroundColor={colors.background}>
        <View style={styles.container}>
        {/* 헤더 */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.surface,
              borderBottomColor: colors.border,
            },
          ]}
        >
          {/* 실제 로고 이미지 */}
          <View style={styles.headerLogo}>
            <Image
              source={require("../../assets/images/잊지마차.png")}
              style={styles.headerLogoImage}
              resizeMode="contain"
            />
          </View>
          
          <Text
            style={[
              styles.headerTitle,
              { color: colors.text },
            ]}
          >
            주차 정보
          </Text>
          <Text
            style={[
              styles.headerSubtitle,
              { color: colors.textSecondary },
            ]}
          >
            저장된 위치와 메모를 확인하세요
          </Text>
        </View>

        {/* 콘텐츠 영역 */}
        <ScrollView
          style={[styles.content]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              📍 위치
            </Text>
            <MapComponent location={location} />
          </View>

          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              📝 메모
            </Text>
            <MemoComponent />
          </View>

          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              📸 사진
            </Text>
            <ImageComponent url={image} />
          </View>
        </ScrollView>

        {/* 하단 버튼 영역 */}
        <View style={[styles.bottomContainer]}>
          <Pressable
            onPress={handleFoundCar}
            style={[
              styles.foundButton,
              {
                backgroundColor: colors.success,
                shadowColor: colors.success,
              },
            ]}
          >
            <View style={styles.foundButtonContent}>
              <Text style={styles.foundButtonIcon}>🚗</Text>
              <Text style={styles.foundButtonText}>차를 찾았어요!</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
    </GestureHandlerRootView>
  );
}

const createDynamicStyles = (colors: any, isDark: boolean) =>
  StyleSheet.create({
    // 필요시 동적 스타일 추가
  });

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "500",
  },
  header: {
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    shadowColor: "#1E3A8A",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    alignItems: "center",
  },
  headerLogo: {
    alignItems: "center",
    marginBottom: 15,
  },
  headerLogoImage: {
    width: 60,
    height: 50,
    shadowColor: "#1E3A8A",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
  },
  content: {
    flex: 1,
  },
  section: {
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  foundButton: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  foundButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  foundButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  foundButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "600",
  },
});
