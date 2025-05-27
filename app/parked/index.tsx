import { getData, storeData } from "@/utils/storage";
import { useEffect, useState } from "react";
import {
  View,
  Pressable,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import ImageComponent from "./image-component";
import MapComponent from "./map-component";
import ScreenWrapper from "@/components/screen-wrapper";
import MemoComponent from "./memo-component";
import { useRouter } from "expo-router";
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
    <ScreenWrapper backgroundColor={colors.background}>
      <View style={styles.container}>
        {/* 헤더 */}
        <View
          style={[
            styles.header,
            {
              borderBottomColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.headerTitle,
              { color: isDark ? colors.text : "black" },
            ]}
          >
            주차 정보
          </Text>
          <Text
            style={[
              styles.headerSubtitle,
              {
                color: isDark ? colors.textSecondary : "rgba(0,0,0,0.9)",
              },
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerLogo: {
    alignItems: "center",
    marginBottom: 15,
    position: "relative",
  },
  headerCar: {
    width: 40,
    height: 25,
    backgroundColor: "#FFD700",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#1E3A8A",
    marginBottom: 5,
  },
  headerCarFace: {
    fontSize: 12,
    color: "#1E3A8A",
    fontWeight: "bold",
  },
  headerBubble: {
    backgroundColor: "#4A90E2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    position: "absolute",
    top: -25,
    right: -20,
  },
  headerBubbleText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
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
