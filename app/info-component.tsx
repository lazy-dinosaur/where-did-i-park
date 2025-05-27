import { StyleSheet, View, Text } from "react-native";
import { useTheme } from "@/hooks/use-theme";

const InfoComponent = () => {
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.textContainer]}>
        <Text
          style={[styles.mainText, { color: isDark ? colors.text : "black" }]}
        >
          📸 주차 위치 기록
        </Text>
        <Text
          style={[
            styles.subText,
            { color: isDark ? colors.textSecondary : "rgba(0,0,0,0.9)" },
          ]}
        >
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
    paddingHorizontal: 20,
  },
  textContainer: {
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
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
