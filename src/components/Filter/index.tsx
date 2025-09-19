import { ReactNode, useState } from "react";
import { Button, Card, Flex } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";

interface FilterProps {
  children: ReactNode;
  subtitle: string;
}

function Filter({ children, subtitle }: FilterProps) {

  const [expanded, setExpanded] = useState(true);

  return (
    <Card style={{ borderRadius: 10, marginBottom: 8 }}>
      <Flex justify="space-between" align="center" style={{ marginBottom: expanded ? 20 : 0 }}>
        <p style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Filtros - {subtitle}</p>
        <Button
          type="link"
          icon={expanded ? <UpOutlined /> : <DownOutlined />}
          onClick={() => setExpanded(!expanded)}
          size="large"
        >
          {expanded ? "Recolher" : "Expandir"}
        </Button>
      </Flex>

      {expanded && children}
    </Card>
  );
}

export default Filter;
