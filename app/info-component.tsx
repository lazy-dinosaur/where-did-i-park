import { StyleSheet, View, Text } from "react-native";
import { useTheme } from "@/hooks/use-theme";

const InfoComponent = () => {
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.textContainer, { backgroundColor: colors.surface }]}>
        <Text style={[styles.mainText, { color: colors.text }]}>📸 주차 위치 기록</Text>
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
    paddingHorizontal: 20,
  },
  textContainer: {
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mainText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 18,
  },
});
