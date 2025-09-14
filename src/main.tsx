import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConfigProvider } from "antd";
import { ToastContainer } from "react-toastify";
import AppRoutes from "./routes";
import { LoaderProvider } from "src/components/Loader/LoaderContext";
import ptBR from "antd/es/locale/pt_BR";
import "react-toastify/dist/ReactToastify.css";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider locale={ptBR}>
      <LoaderProvider>
        <ToastContainer />
        <AppRoutes />
      </LoaderProvider>
    </ConfigProvider>
  </StrictMode>,
);
