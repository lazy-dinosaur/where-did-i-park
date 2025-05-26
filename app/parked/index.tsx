import { getData } from "@/utils/storage";
import { useEffect, useState } from "react";
import { Text, View, Image } from "react-native";
import ImageComponent from "./image-component";
import MapComponent from "./map-component";
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
    <View style={{ flex: 1, justifyContent: "center" }}>
      <MapComponent location={location} />
      <ImageComponent url={image} />
    </View>
  );
}
