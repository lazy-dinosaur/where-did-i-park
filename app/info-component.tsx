import { StyleSheet, View, Text } from "react-native";

const InfoComponent = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        주차 위치를 기억할 수 있는 사진을 찍어 저장하세요
      </Text>
    </View>
  );
};
export default InfoComponent;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "10%",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 10,
  },
});
