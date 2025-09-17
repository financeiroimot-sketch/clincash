import { Button, Input, Space, Tooltip, DatePicker } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { Actions } from "src/components";
import { Conta } from "src/utils/typings";

dayjs.extend(isBetween);

const { RangePicker } = DatePicker;

function formatCurrency(value: number) {
  return value.toLocaleString("pt-br", { style: "currency", currency: "BRL" });
}

function formatStatus(value: string) {
  const status = value === "pago" ? "Pago" : "Em Aberto";
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Tooltip title={status}>
        <div style={{
          width: 15,
          height: 15,
          borderRadius: "50%",
          backgroundColor: value === "pago" ? "#0f0" : "#f00",
        }}></div>
      </Tooltip>
    </div>
  );
}

function formatStatusVencimento(text: string, color: string) {
  return (
    <Tooltip title={text}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 15,
          height: 15,
          borderRadius: "50%",
          backgroundColor: color,
        }}></div>
        {text}
      </div>
    </Tooltip>
  );
}

function getColummns(
  refetch: () => void,
  reset: () => void,
  handleCheckColumn: (columnName: string) => boolean,
  handleSearch: (search: string, key: any) => void,
) {
  return [
    {
      dataIndex: "statusPagamento",
      key: "statusPagamento",
      width: 30,
      hidden: handleCheckColumn("Status de Pagamento"),
      render: (value: string) => <span>{formatStatus(value)}</span>,
      filters: [
        {
          text: "Em Aberto",
          value: "emAberto",
        },
        {
          text: "Pago",
          value: "pago",
        },
      ],
      onFilter: (value: string, record: Conta) => record.statusPagamento === value,
    },
    {
      title: "Status de Vencimento",
      dataIndex: "statusVencimento",
      key: "statusVencimento",
      width: 200,
      hidden: handleCheckColumn("Status de Vencimento"),
      render: (value: string, record: Conta) => <span>{formatStatusVencimento(value, record.statusVencimentoCor)}</span>,
      filters: [
        {
          text: "Vence Hoje",
          value: "Vence Hoje",
        },
        {
          text: "Vencido",
          value: "Vencido",
        },
        {
          text: "Vence Essa Semana",
          value: "Vence Essa Semana",
        },
        {
          text: "A Vencer",
          value: "A Vencer",
        },
      ],
      onFilter: (value: string, record: Conta) => record.statusVencimento === value,
    },
    {
      title: "Razão Social",
      dataIndex: "razaoSocialDescricao",
      key: "razaoSocialDescricao",
      hidden: handleCheckColumn("Razão Social"),
      render: (value: string) => <span>{value ?? "-"}</span>,
      sorter: (a: Conta, b: Conta) => a.razaoSocialDescricao.localeCompare(b.razaoSocialDescricao),
      sortDirections: ["ascend", "descend", "ascend"],
      defaultSortOrder: "ascend",
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
                handleSearch(selectedKeys[0] as string, "razaoSocialDescricao");
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
      hidden: handleCheckColumn("Plano de Contas"),
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
      title: "Valor",
      dataIndex: "valor",
      key: "valor",
      hidden: handleCheckColumn("Valor"),
      render: (value: number) => <span>{value ? formatCurrency(value) : "-"}</span>,
    },
    {
      title: "Valor do Pagamento",
      dataIndex: "valorPagamento",
      key: "valorPagamento",
      hidden: handleCheckColumn("Valor do Pagamento"),
      render: (value: number) => <span>{value ? formatCurrency(value) : "-"}</span>,
    },
    {
      title: "Data de Pagamento",
      dataIndex: "dataPagamento",
      key: "dataPagamento",
      hidden: handleCheckColumn("Data de Pagamento"),
      render: (value: string) => <span>{value ?? "-"}</span>,
      sorter: (a: Conta, b: Conta) => dayjs(a.dataPagamento, "DD/MM/YYYY").unix() - dayjs(b.dataPagamento, "DD/MM/YYYY").unix(),
      sortDirections: ["ascend", "descend", "ascend"],
      defaultSortOrder: "ascend",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 8 }}>
          <RangePicker
            format={"DD/MM/YYYY"}
            value={
              selectedKeys[0]
                ? (JSON.parse(String(selectedKeys[0])) as [string, string]).map(d => dayjs(d)) as [Dayjs, Dayjs]
                : null
            }
            onChange={(dates) =>
              setSelectedKeys(
                dates ? [JSON.stringify([dates[0]?.toISOString(), dates[1]?.toISOString()])] : []
              )
            }
          />
          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button type="primary" onClick={confirm} size="small">
              Filtrar
            </Button>
            <Button onClick={clearFilters} size="small" >
              Resetar
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value: string[], record: Conta) => {
        const [start, end] = JSON.parse(String(value)) as [string, string];
        const startDate = dayjs(start);
        const endDate = dayjs(end);
        const recordDate = dayjs(record.dataPagamento, "DD/MM/YYYY");
        return record.dataPagamento && recordDate.isBetween(startDate, endDate, null, "[]");
      },
    },
    {
      title: "Data de Vencimento",
      dataIndex: "dataVencimento",
      key: "dataVencimento",
      hidden: handleCheckColumn("Data de Vencimento"),
      render: (value: string) => <span>{value ?? "-"}</span>,
      sorter: (a: Conta, b: Conta) => dayjs(a.dataVencimento, "DD/MM/YYYY").unix() - dayjs(b.dataVencimento, "DD/MM/YYYY").unix(),
      sortDirections: ["ascend", "descend", "ascend"],
      defaultSortOrder: "ascend",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 8 }}>
          <RangePicker
            format={"DD/MM/YYYY"}
            value={
              selectedKeys[0]
                ? (JSON.parse(String(selectedKeys[0])) as [string, string]).map(d => dayjs(d)) as [Dayjs, Dayjs]
                : null
            }
            onChange={(dates) =>
              setSelectedKeys(
                dates ? [JSON.stringify([dates[0]?.toISOString(), dates[1]?.toISOString()])] : []
              )
            }
          />
          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button type="primary" onClick={confirm} size="small">
              Filtrar
            </Button>
            <Button onClick={clearFilters} size="small">
              Resetar
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value: string[], record: Conta) => {
        const [start, end] = JSON.parse(String(value)) as [string, string];
        const startDate = dayjs(start);
        const endDate = dayjs(end);
        const recordDate = dayjs(record.dataVencimento, "DD/MM/YYYY");
        return record.dataVencimento && recordDate.isBetween(startDate, endDate, null, "[]");
      },
    },
    {
      title: "Ações",
      dataIndex: "id",
      key: "id",
      align: "center",
      className: "hide-on-pdf",
      render: (value: string, record: Conta) => (
        <Actions
          id={value}
          collection="contasPagar"
          status={record.statusPagamento}
          comprovante={record.comprovante}
          nomeComprovante={record.nomeComprovante}
          refetch={refetch}
        />
      ),
    },
  ];
}

export default getColummns;
