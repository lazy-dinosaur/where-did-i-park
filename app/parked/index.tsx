import { getData } from "@/utils/storage";
import { useEffect, useState } from "react";
import { Text, View, Image } from "react-native";
import ImageComponent from "./image-component";
import MapComponent from "./map-component";
import ScreenWrapper from "@/components/screen-wrapper";
export default function Parked() {
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);

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
  if (!image && !location) return <View />;

  return (
    <ScreenWrapper>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <MapComponent location={location} />
        <View style={{}}>
          <View>
            <Text>ddd</Text>
          </View>
        </View>
        <ImageComponent url={image} />
        <View style={{ flex: 1 }}></View>
      </View>
    </ScreenWrapper>
  );
}
