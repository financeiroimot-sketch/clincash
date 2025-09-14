import { CSSProperties } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

function Loader() {
  return (
    <div style={loaderStyle}>
      <Spin indicator={<LoadingOutlined style={{ fontSize: 56 }} />} />
    </div>
  );
}

const loaderStyle: CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  zIndex: 9999999,
  width: "100vw",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0, 0, 0, .25)",
}

export default Loader;
