import { CameraView } from "expo-camera";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

const CameraComponent = ({
  ref,
}: {
  ref: React.RefObject<CameraView | null>;
}) => {
  const [zoom, setZoom] = useState(0);

  return (
    <View
      style={{
        flex: 1,
        position: "relative",
        overflow: "hidden",
        borderRadius: 15,
      }}
    >
      <CameraView style={{ flex: 1 }} zoom={zoom} ref={ref} autofocus="on" />
      <View
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            display: "flex",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            padding: 5,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: 150,
            marginBottom: 20,
          }}
        >
          <Pressable
            onPress={() => {
              setZoom((prev) => {
                let next = prev - 0.1;
                if (next <= 0) {
                  next = 0;
                }
                return next;
              });
            }}
            style={{
              padding: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              marginRight: 5,
              borderRadius: "50%",
            }}
          >
            <Text
              style={{
                color: "rgba(255,255,255,0.6)",
                aspectRatio: 1,
                textAlign: "center",
              }}
            >
              -
            </Text>
          </Pressable>
          <View
            style={{
              padding: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              borderRadius: "50%",
            }}
          >
            <Text
              style={{
                color: "rgba(255,255,255,0.6)",
                aspectRatio: 1,
                textAlign: "center",
                display: "flex",
              }}
            >
              {Math.floor(zoom * 10)}x
            </Text>
          </View>
          <Pressable
            onPress={() => {
              setZoom((prev) => {
                let next = prev + 0.1;
                if (next > 0.9) {
                  next = 0.9;
                }
                return next;
              });
            }}
            style={{
              padding: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              marginLeft: 5,
              borderRadius: "50%",
            }}
          >
            <Text
              style={{
                color: "rgba(255,255,255,0.6)",
                aspectRatio: 1,
                textAlign: "center",
              }}
            >
              +
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};
export default CameraComponent;
