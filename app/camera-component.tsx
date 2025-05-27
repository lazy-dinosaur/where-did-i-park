import { CameraView } from "expo-camera";
import { useState } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";

const CameraComponent = ({
  ref,
}: {
  ref: React.RefObject<CameraView | null>;
}) => {
  const [zoom, setZoom] = useState(0);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 0.9));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0));
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        zoom={zoom}
        ref={ref}
        autofocus="on"
        enableTorch={false}
      />

      {/* 카메라 오버레이 */}
      <View style={styles.overlay}>
        {/* 그리드 라인 */}
        <View style={styles.gridContainer}>
          {/* 수직선들 */}
          <View
            style={[styles.gridLine, styles.verticalLine, { left: "33.33%" }]}
          />
          <View
            style={[styles.gridLine, styles.verticalLine, { left: "66.66%" }]}
          />
          {/* 수평선들 */}
          <View
            style={[styles.gridLine, styles.horizontalLine, { top: "33.33%" }]}
          />
          <View
            style={[styles.gridLine, styles.horizontalLine, { top: "66.66%" }]}
          />
        </View>

        {/* 가이드 텍스트 */}
        <View style={styles.guideContainer}>
          <Text style={styles.guideText}>
            주차 위치를 기억할 수 있는 사진을 촬영하세요
          </Text>
        </View>

        {/* 줌 컨트롤 */}
        <View style={styles.zoomContainer}>
          <Pressable onPress={handleZoomOut} style={styles.zoomButton}>
            <Text style={styles.zoomButtonText}>-</Text>
          </Pressable>

          <View style={styles.zoomDisplay}>
            <Text style={styles.zoomText}>
              {zoom === 0 ? "1x" : `${(1 + zoom).toFixed(1)}x`}
            </Text>
          </View>

          <Pressable onPress={handleZoomIn} style={styles.zoomButton}>
            <Text style={styles.zoomButtonText}>+</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default CameraComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
    borderRadius: 20,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gridContainer: {
    flex: 1,
    position: "relative",
  },
  gridLine: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  verticalLine: {
    width: 1,
    height: "100%",
  },
  horizontalLine: {
    height: 1,
    width: "100%",
  },
  guideContainer: {
    position: "absolute",
    top: 30,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  guideText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    overflow: "hidden",
  },
  zoomContainer: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 25,
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  zoomButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  zoomButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  zoomDisplay: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 5,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 15,
  },
  zoomText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    minWidth: 30,
    textAlign: "center",
  },
});
