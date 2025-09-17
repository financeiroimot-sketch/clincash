import { Button, Input, Space, DatePicker } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { Data } from ".";

const { RangePicker } = DatePicker;

function formatCurrency(value: number) {
  return value.toLocaleString("pt-br", { style: "currency", currency: "BRL" });
}

function getColumns(
  reset: () => void,
  handleSearch: (search: string, key: any) => void,
) {
  return [
    {
      title: "Razão Social",
      dataIndex: "razaoSocial",
      key: "razaoSocial",
      render: (value: string) => <span>{value ?? "-"}</span>,
      sorter: (a: Data, b: Data) => a.razaoSocial.localeCompare(b.razaoSocial),
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
      title: "Telefone",
      dataIndex: "telefone",
      key: "telefone",
      render: (value: string) => <span>{value ?? "-"}</span>,
    },
    {
      title: "Tipo de Conta",
      dataIndex: "tipoConta",
      key: "tipoConta",
      render: (value: string) => <span>{value === "contasPagar" ? "A Pagar" : "A Receber"}</span>,
    },
    {
      title: "Data",
      dataIndex: "data",
      key: "data",
      render: (value: string) => <span>{value ?? "-"}</span>,
      sorter: (a: Data, b: Data) => dayjs(a.data, "DD/MM/YYYY").unix() - dayjs(b.data, "DD/MM/YYYY").unix(),
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
      onFilter: (value: string[], record: Data) => {
        const [start, end] = JSON.parse(String(value)) as [string, string];
        const startDate = dayjs(start);
        const endDate = dayjs(end);
        const recordDate = dayjs(record.data, "DD/MM/YYYY");
        return record.data && recordDate.isBetween(startDate, endDate, null, "[]");
      },
    },
    {
      title: "Realizado",
      dataIndex: "realizado",
      key: "realizado",
      render: (value: number) => <span>{value ? formatCurrency(value) : "-"}</span>,
    },
    {
      title: "Planejado",
      dataIndex: "planejado",
      key: "planejado",
      render: (value: number) => <span>{value ? formatCurrency(value) : "-"}</span>,
    },
  ];
}

export default getColumns;
