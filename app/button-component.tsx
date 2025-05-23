import { Text, TouchableOpacity, View } from "react-native";

const ButtonComponent = ({ onClick }: { onClick: Function }) => {
  return (
    <View
      style={{
        padding: 20,
        backgroundColor: "#f0f0f0",
        borderRadius: 10,
        marginBottom: 20,
      }}
    >
      <TouchableOpacity
        onPress={(e) => {
          onClick();
        }}
      >
        <Text>Ocr button component</Text>
      </TouchableOpacity>
    </View>
  );
};
export default ButtonComponent;
