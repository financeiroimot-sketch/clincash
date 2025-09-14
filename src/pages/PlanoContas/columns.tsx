import { Button, Input, Space, } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Actions from "./components/Actions";
import { PlanoConta } from "src/utils/typings";

function formatNatureza(value: string) {
  return value === "sintetica" ? "Sintética" : "Analítica";
}

const getColumns = (
  refetch: () => void,
  reset: () => void,
  handleSearch: (search: string, key: any) => void,
) => {
  return [
    {
      title: "Classificação",
      dataIndex: "classificacao",
      key: "classificacao",
      width: 350,
      render: (value: string) => <span>{value ?? "-"}</span>,
      filterDropdown: ({ setSelectedKeys, selectedKeys, close }) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Input
            placeholder="Filtar por classificação"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            style={{ marginBottom: 8, width: 250 }}
          />
          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="primary"
              onClick={() => {
                handleSearch(selectedKeys[0] as string, "classificacao");
                close();
              }}
              icon={<SearchOutlined />}
              size="small"
            >Filtrar</Button>
            <Button
              onClick={() => {
                setSelectedKeys([]);
                reset();
                close();
              }}
              size="small"
            >Limpar</Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined, fontSize: 16 }} />
      ),
    },
    {
      title: "Descrição",
      dataIndex: "descricao",
      key: "descricao",
      render: (value: string) => <span>{value ?? "-"}</span>,
      filterDropdown: ({ setSelectedKeys, selectedKeys, close }) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Input
            placeholder="Filtar por descrição"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            style={{ marginBottom: 8, width: 250 }}
          />
          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="primary"
              onClick={() => {
                handleSearch(selectedKeys[0] as string, "descricao");
                close();
              }}
              icon={<SearchOutlined />}
              size="small"
            >Filtrar</Button>
            <Button
              onClick={() => {
                setSelectedKeys([]);
                reset();
                close();
              }}
              size="small"
            >Limpar</Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined, fontSize: 16 }} />
      ),
    },
    {
      title: "Tipo de Conta",
      dataIndex: "tipoConta",
      key: "tipoConta",
      render: (value: string) => <span style={{ textTransform: "capitalize" }}>{value ?? "-"}</span>,
      filters: [
        {
          text: "Receita",
          value: "receita",
        },
        {
          text: "Despesa",
          value: "despesa",
        },
      ],
      onFilter: (value: string, record: PlanoConta) => record.tipoConta === value,
    },
    {
      title: "Natureza",
      dataIndex: "natureza",
      key: "natureza",
      render: (value: string) => <span>{value ? formatNatureza(value) : "-"}</span>,
      filters: [
        {
          text: "Analítica",
          value: "analitica",
        },
        {
          text: "Sintética",
          value: "sintetica",
        },
      ],
      onFilter: (value: string, record: PlanoConta) => record.natureza === value,
    },
    {
      title: "Ações",
      dataIndex: "id",
      key: "acoes",
      align: "center",
      render: (value: string, record: any) =>
        <Actions
          id={value}
          nivel={record.nivel}
          descricao={record.descricao}
          classificacao={record.classificacao}
          refetch={refetch}
        />,
    },
  ];
}

export default getColumns;
