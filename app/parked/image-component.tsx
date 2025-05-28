import { View, StyleSheet, Text, Pressable, Modal } from "react-native";
import { Image } from "expo-image";
import { useTheme } from "@/hooks/use-theme";
import { useState } from "react";

export default function ImageComponent({ url }: { url: string | null }) {
  const { colors } = useTheme();
  const [showFullscreen, setShowFullscreen] = useState(false);

  if (!url) {
    return (
      <View
        style={[
          styles.container,
          styles.placeholderContainer,
          { backgroundColor: colors.surfaceSecondary },
        ]}
      >
        <Text style={styles.placeholderText}>📷</Text>
        <Text
          style={[styles.placeholderSubText, { color: colors.textSecondary }]}
        >
          이미지 로딩 중...
        </Text>
      </View>
    );
  }

  return (
    <>
      <View
        style={[styles.container, { backgroundColor: colors.surfaceSecondary }]}
      >
        <Image
          source={{ uri: url }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />

        {/* 전체보기 버튼 */}
        <View style={styles.buttonOverlay}>
          <Pressable
            onPress={() => setShowFullscreen(true)}
            style={[
              styles.fullscreenButton,
              { backgroundColor: colors.surface },
            ]}
          >
            <Text style={styles.fullscreenIcon}>🔍</Text>
            <Text style={[styles.fullscreenText, { color: colors.text }]}>
              전체보기
            </Text>
          </Pressable>
        </View>
      </View>

      {/* 전체화면 모달 */}
      <Modal
        visible={showFullscreen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFullscreen(false)}
      >
        <View style={styles.modalContainer}>
          <Pressable
            style={styles.modalBackground}
            onPress={() => setShowFullscreen(false)}
          >
            <View style={styles.modalContent}>
              <Image
                source={{ uri: url }}
                style={styles.fullscreenImage}
                contentFit="contain"
                transition={200}
              />

              {/* 닫기 버튼 */}
              <Pressable
                onPress={() => setShowFullscreen(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </Pressable>

              {/* 안내 텍스트 */}
              <View style={styles.instructionContainer}>
                <Text style={styles.instructionText}>화면을 탭하여 닫기</Text>
              </View>
            </View>
          </Pressable>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 300,
    borderRadius: 15,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholderContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 40,
    marginBottom: 10,
  },
  placeholderSubText: {
    fontSize: 14,
    fontWeight: "500",
  },
  buttonOverlay: {
    position: "absolute",
    top: 15,
    right: 15,
  },
  fullscreenButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  fullscreenIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  fullscreenText: {
    fontSize: 12,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  fullscreenImage: {
    width: "90%",
    height: "80%",
  },
  closeButton: {
    position: "absolute",
    top: 60,
    right: 30,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  instructionContainer: {
    position: "absolute",
    bottom: 60,
    alignSelf: "center",
  },
  instructionText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    fontWeight: "500",
  },
});
