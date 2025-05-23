import { CameraView } from "expo-camera";

const CameraComponent = ({
  ref,
}: {
  ref: React.RefObject<CameraView | null>;
}) => {
  return (
    <CameraView
      style={{ overflow: "hidden", flex: 1, borderRadius: 15 }}
      ref={ref}
    ></CameraView>
  );
};
export default CameraComponent;
