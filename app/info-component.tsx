import { StyleSheet, View, Text } from "react-native";
import { useTheme } from "@/hooks/use-theme";

const InfoComponent = () => {
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.textContainer]}>
        <Text style={[styles.mainText, { color: colors.text }]}>
          📸 주차 위치 기록
        </Text>
        <Text style={[styles.subText, { color: colors.textSecondary }]}>
          주차 위치를 기억할 수 있는 사진을 찍어 저장하세요
        </Text>
      </View>
    </View>
  );
};
export default InfoComponent;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "12%",
  },
  textContainer: {
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  miniLogo: {
    marginBottom: 10,
  },
  miniCar: {
    width: 30,
    height: 20,
    backgroundColor: "#FFD700",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#1E3A8A",
  },
  miniCarFace: {
    fontSize: 10,
    color: "#1E3A8A",
    fontWeight: "bold",
  },
  mainText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  subText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 18,
  },
});
