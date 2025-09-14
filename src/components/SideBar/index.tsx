import { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  PlusSquareOutlined,
  MinusSquareOutlined,
  ShopOutlined,
  FundProjectionScreenOutlined,
  ReadOutlined,
  PieChartOutlined,
  BarChartOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

interface SideBarProps {
  collapsed: boolean;
}

function SideBar({ collapsed }: SideBarProps) {

  const navigate = useNavigate();
  const location = useLocation();

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const relatoriosItems = [
    {
      key: "livro-caixa",
      icon: <ReadOutlined />,
      label: "Livro Caixa",
      onClick: () => navigate("/livro-caixa"),
    },
    {
      key: "caixa-diario",
      icon: <BarChartOutlined />,
      label: "Caixa Diário",
      onClick: () => navigate("/caixa-diario"),
    },
    {
      key: "dashboard",
      icon: <PieChartOutlined />,
      label: "Dashboard",
      onClick: () => navigate("/dashboard"),
    },
  ];

  const items = [
    {
      key: "pessoas",
      icon: <ShopOutlined />,
      label: "Pessoas",
      onClick: () => navigate("/pessoas"),
    },
    {
      key: "contas-pagar",
      icon: <MinusSquareOutlined />,
      label: "Contas a Pagar",
      onClick: () => navigate("/contas-pagar"),
    },
    {
      key: "contas-receber",
      icon: <PlusSquareOutlined />,
      label: "Contas a Receber",
      onClick: () => navigate("/contas-receber"),
    },
    {
      key: "plano-contas",
      icon: <FundProjectionScreenOutlined />,
      label: "Plano de Contas",
      onClick: () => navigate("/plano-contas"),
    },
    {
      key: "relatorios-menu",
      icon: <FileTextOutlined />,
      label: "Relatórios",
      children: relatoriosItems,
    },
  ];

  useEffect(() => {
    setSelectedKeys([location.pathname.split("/")[1]]);
  }, [location.pathname]);

  return (
    <Sider style={{ backgroundColor: "#fff" }} collapsed={collapsed}>
      <Menu
        mode="inline"
        items={items}
        selectedKeys={selectedKeys}
      />
    </Sider>
  );
}

export default SideBar;
