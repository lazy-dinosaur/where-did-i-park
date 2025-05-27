import { View, StyleSheet, Text } from "react-native";
import { Image } from "expo-image";

export default function ImageComponent({ url }: { url: string | null }) {
  if (!url) {
    return (
      <View style={[styles.container, styles.placeholderContainer]}>
        <Text style={styles.placeholderText}>📷</Text>
        <Text style={styles.placeholderSubText}>이미지 로딩 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: url }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    backgroundColor: "#f8f9fa",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholderContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e9ecef",
  },
  placeholderText: {
    fontSize: 40,
    marginBottom: 10,
  },
  placeholderSubText: {
    fontSize: 14,
    color: "#6c757d",
    fontWeight: "500",
  },
});
