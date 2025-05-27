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
import { LinearGradient } from 'expo-linear-gradient';

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
              backgroundColor: colors.surface,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            🚗 주차 정보
          </Text>
          <Text
            style={[styles.headerSubtitle, { color: colors.textSecondary }]}
          >
            저장된 위치와 메모를 확인하세요
          </Text>
        </View>

        {/* 콘텐츠 영역 */}
        <ScrollView
          style={[styles.content, { backgroundColor: colors.surfaceSecondary }]}
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
        <View
          style={[
            styles.bottomContainer,
            { backgroundColor: colors.surface, borderTopColor: colors.border },
          ]}
        >
          <Pressable onPress={handleFoundCar} style={styles.foundButton}>
            <LinearGradient
              colors={isDark 
                ? ['#28a745', '#20a039', '#17982d']
                : ['#28a745', '#32d94c', '#4ade80']
              }
              style={styles.gradientFoundButton}
            >
              <Text style={styles.foundButtonText}>🚗 차를 찾았어요!</Text>
            </LinearGradient>
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
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
    borderTopWidth: 1,
  },
  foundButton: {
    borderRadius: 25,
    shadowColor: '#28a745',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  gradientFoundButton: {
    paddingVertical: 18,
    alignItems: "center",
    borderRadius: 25,
  },
  foundButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
