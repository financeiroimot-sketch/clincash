import { Button, Input, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { EditButton } from "src/components";
import { Usuario } from "src/utils/typings";

function getColumns(
  reset: () => void,
  handleSearch: (search: string, key: any) => void,
) {
  return [
    {
      title: "Nome",
      dataIndex: "nome",
      key: "nome",
      render: (value: string) => <span>{value ?? "-"}</span>,
      sorter: (a: Usuario, b: Usuario) => a.nome.localeCompare(b.nome),
      sortDirections: ["ascend", "descend", "ascend"],
      defaultSortOrder: "ascend",
      filterDropdown: ({ setSelectedKeys, selectedKeys, close }) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Input
            placeholder="Filtar por nome"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            style={{ marginBottom: 8, width: 250 }}
          />
          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="primary"
              onClick={() => {
                handleSearch(selectedKeys[0] as string, "nome");
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
      title: "Telefone",
      dataIndex: "telefone",
      key: "telefone",
      render: (value: string) => <span>{value ?? "-"}</span>,
    },
    {
      title: "E-mail",
      dataIndex: "email",
      key: "email",
      render: (value: string) => <span>{value ?? "-"}</span>,
      sorter: (a: Usuario, b: Usuario) => a.email.localeCompare(b.email),
      sortDirections: ["ascend", "descend", "ascend"],
      defaultSortOrder: "ascend",
      filterDropdown: ({ setSelectedKeys, selectedKeys, close }) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Input
            placeholder="Filtar por email"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            style={{ marginBottom: 8, width: 250 }}
          />
          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="primary"
              onClick={() => {
                handleSearch(selectedKeys[0] as string, "email");
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
      title: "Status",
      dataIndex: "ativo",
      key: "ativo",
      render: (value: boolean) => <span>{value ? "Ativo" : "Inativo"}</span>,
      filters: [
        {
          text: "Ativo",
          value: true,
        },
        {
          text: "Inativo",
          value: false,
        },
      ],
      onFilter: (value: boolean, record: Usuario) => record.ativo === value,
    },
    {
      title: "Ações",
      dataIndex: "id",
      key: "acoes",
      align: "center",
      render: (value: string) => (
        <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
          <EditButton id={value} />
        </div>
      ),
    },
  ];
}

export default getColumns;
