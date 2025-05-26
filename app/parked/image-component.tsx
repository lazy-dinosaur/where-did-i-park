import { View, Image } from "react-native";

export default function ImageComponent({ url }: { url: string | null }) {
  return (
    <View style={{ width: "100%", height: "50%" }}>
      <Image
        source={{ uri: url ? url : "" }}
        style={{
          width: "100%",
          height: "100%",
          resizeMode: "contain",
        }}
      />
    </View>
  );
}
