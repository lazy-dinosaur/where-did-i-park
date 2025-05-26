import { View, Image } from "react-native";

export default function ImageComponent({ url }: { url: string | null }) {
  return (
    <View style={{ flex: 1, borderRadius: 25, overflow: "hidden" }}>
      <Image
        source={{ uri: url ? url : "" }}
        style={{
          width: "100%",
          height: "100%",
          resizeMode: "cover",
        }}
      />
    </View>
  );
}
