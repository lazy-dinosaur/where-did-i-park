import { getData, storeData } from "@/utils/storage";
import { useEffect, useState } from "react";
import { View, Pressable, Text, Alert, StyleSheet, ScrollView } from "react-native";
import ImageComponent from "./image-component";
import MapComponent from "./map-component";
import ScreenWrapper from "@/components/screen-wrapper";
import MemoComponent from "./memo-component";
import { useRouter } from "expo-router";

export default function Parked() {
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const router = useRouter();

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
      ]
    );
  };

  if (!image && !location) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>로딩 중...</Text>
      </View>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🚗 주차 정보</Text>
          <Text style={styles.headerSubtitle}>저장된 위치와 메모를 확인하세요</Text>
        </View>

        {/* 콘텐츠 영역 */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📍 위치</Text>
            <MapComponent location={location} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📝 메모</Text>
            <MemoComponent />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📸 사진</Text>
            <ImageComponent url={image} />
          </View>
        </ScrollView>

        {/* 하단 버튼 영역 */}
        <View style={styles.bottomContainer}>
          <Pressable onPress={handleFoundCar} style={styles.foundButton}>
            <Text style={styles.foundButtonText}>🚗 차를 찾았어요!</Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  header: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    shadowColor: '#000',
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
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 5,
  },
  content: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 15,
    shadowColor: '#000',
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
    fontWeight: '600',
    color: '#2c3e50',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  foundButton: {
    backgroundColor: '#28a745',
    borderRadius: 25,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#28a745',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  foundButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
