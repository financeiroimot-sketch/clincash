import { ReactNode, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Layout, Flex, Dropdown } from "antd";
import type { MenuProps } from "antd";
import { SettingOutlined, LogoutOutlined, MenuOutlined, UserOutlined } from "@ant-design/icons";
import { SideBar } from "src/components";

const { Header, Content } = Layout;

interface ContainerProps {
  children: ReactNode;
}

function Container({ children }: ContainerProps) {

  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false)

  const items: MenuProps["items"] = [
    {
      key: 1,
      icon: <UserOutlined style={{ fontSize: 16 }} />,
      label: "Usuários",
      onClick: () => navigate("/usuarios"),
    },
    {
      key: 2,
      icon: <LogoutOutlined style={{ fontSize: 16 }} />,
      label: "Sair",
      onClick: () => logout(),
    },
  ];

  function logout() {
    sessionStorage.clear();
    navigate("/login");
  }

  useEffect(() => {
    const width = window.innerWidth;
    setCollapsed(width <= 600);
  }, []);

  return (
    <>
      {location.pathname === "/login" ? children : (
        <Layout style={{ minHeight: "100%" }}>
          <Header style={{ backgroundColor: "#1677FF", padding: 16 }}>
            <Flex justify="space-between" align="center" style={{ height: "100%" }}>
              <Flex gap={16}>
                <MenuOutlined
                  onClick={() => setCollapsed(!collapsed)}
                  style={{ color: "#fff", fontSize: 18, cursor: "pointer" }}
                />
                <h2 style={{ color: "#fff", fontWeight: 500, margin: 0 }}>ClinCash</h2>
              </Flex>
              <Dropdown menu={{ items }} trigger={["click"]}>
                <SettingOutlined style={{ color: "#fff", fontSize: 22, cursor: "pointer" }} />
              </Dropdown>
            </Flex>
          </Header>
          <Layout>
            <SideBar collapsed={collapsed} />
            <Content style={{ padding: 24 }}>
              {children}
            </Content>
          </Layout>
        </Layout>
      )}
    </>
  );
}

export default Container;
