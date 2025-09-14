import { Button, Input, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { EditButton } from "src/components";
import { Pessoa } from "src/utils/typings";

function formatTipo(pessoa: Pessoa) {
  if (pessoa.isCliente && pessoa.isFornecedor) {
    return "Cliente/Fornecedor";
  }
  if (pessoa.isCliente) {
    return "Cliente";
  }
  if (pessoa.isFornecedor) {
    return "Fornecedor";
  }
  return "-";
}

function filterTipo(value: string, record: Pessoa) {
  if (value === "vazio") {
    return !record.isCliente && !record.isFornecedor;
  }
  if (value === "cliente") {
    return record.isCliente;
  }
  if (value === "fornecedor") {
    return record.isFornecedor;
  }
}

function getColummns(
  reset: () => void,
  handleSearch: (search: string, key: any) => void,
) {
  return [
    {
      title: "Razão Social",
      dataIndex: "razaoSocial",
      key: "razaoSocial",
      sorter: (a: Pessoa, b: Pessoa) => a.razaoSocial.localeCompare(b.razaoSocial),
      sortDirections: ["ascend", "descend", "ascend"],
      defaultSortOrder: "ascend",
      render: (value: string) => <span>{value ?? "-"}</span>,
      filterDropdown: ({ setSelectedKeys, selectedKeys, close }) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Input
            placeholder="Filtar por razão social"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            style={{ marginBottom: 8, width: 250 }}
          />
          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="primary"
              onClick={() => {
                handleSearch(selectedKeys[0] as string, "razaoSocial");
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
      title: "CNPJ/CPF",
      dataIndex: "documento",
      key: "documento",
      render: (value: string) => <span>{!!value ? value : "-"}</span>,
      filterDropdown: ({ setSelectedKeys, selectedKeys, close }) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Input
            placeholder="Filtar por CNPJ/CPF"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            style={{ marginBottom: 8, width: 250 }}
          />
          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="primary"
              onClick={() => {
                handleSearch(selectedKeys[0] as string, "documento");
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
      title: "Plano de Contas",
      dataIndex: "planoContasDescricao",
      key: "planoContasDescricao",
      render: (value: string) => <span>{value ?? "-"}</span>,
      filterDropdown: ({ setSelectedKeys, selectedKeys, close }) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Input
            placeholder="Filtar por plano de contas"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            style={{ marginBottom: 8, width: 250 }}
          />
          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="primary"
              onClick={() => {
                handleSearch(selectedKeys[0] as string, "planoContasDescricao");
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
      title: "Tipo",
      dataIndex: "id",
      key: "id",
      render: (_, record: Pessoa) => <span>{formatTipo(record)}</span>,
      filters: [
        {
          text: "Cliente",
          value: "cliente",
        },
        {
          text: "Fornecedor",
          value: "fornecedor",
        },
        {
          text: "Vazio",
          value: "vazio",
        },
      ],
      onFilter: (value: string, record: Pessoa) => filterTipo(value, record),
    },
    {
      title: "Ações",
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (value: string) => (
        <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
          <EditButton id={value} />
        </div>
      ),
    },
  ];
}

export default getColummns;
