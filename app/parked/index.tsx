import { getData } from "@/utils/storage";
import { useEffect, useState } from "react";
import { Text, View, Image } from "react-native";
export default function Parked() {
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [heading, setHeading] = useState(null);

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

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <View></View>
      <View style={{ width: "100%", height: "50%" }}>
        <Image
          source={{ uri: image ? image : "" }}
          style={{
            width: "100%",
            height: "100%",
            resizeMode: "contain",
          }}
        />
      </View>
    </View>
  );
}
