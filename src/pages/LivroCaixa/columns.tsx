import { Button, Input, Space, Tooltip, DatePicker, Select } from "antd";
import { SearchOutlined, SaveOutlined } from "@ant-design/icons";
import { CurrencyInput } from "react-currency-mask";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { Conta } from "src/utils/typings";
import formatCurrency from "src/utils/formatCurrency";

dayjs.extend(isBetween);

const { RangePicker } = DatePicker;

function getColumns(
  pessoasOptions: any[],
  planosOptions: any[],
  reset: () => void,
  handleSave: () => void,
  handleCheckColumn: (columnName: string) => boolean,
  handleChange: (id: string, changes: Partial<Conta>) => void,
  handleSearch: (search: string, key: any) => void,
) {
  return [
    {
      title: "Data de Vencimento",
      dataIndex: "dataVencimento",
      key: "dataVencimento",
      hidden: handleCheckColumn("Data de Vencimento"),
      render: (value: string, record: Conta) => record.editing || record.isNew ? (
        <DatePicker
          size="large"
          defaultValue={value ? dayjs(value, "DD/MM/YYYY") : undefined}
          onChange={value => handleChange(record.id, { dataVencimento: dayjs(value).format("DD/MM/YYYY") })}
          placeholder="Data de Vencimento"
          format="DD/MM/YYYY"
          style={{ width: "100%" }}
        />
      ) : (
        <span>{value ?? "-"}</span>
      ),
      sorter: (a: Conta, b: Conta) => {
        if (a.isNew) return 1;
        if (b.isNew) return -1;
        return dayjs(a.dataVencimento, "DD/MM/YYYY").unix() - dayjs(b.dataVencimento, "DD/MM/YYYY").unix();
      },
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
      title: "Razão Social",
      dataIndex: "razaoSocialDescricao",
      key: "razaoSocialDescricao",
      hidden: handleCheckColumn("Razão Social"),
      render: (value: string, record: Conta) => record.editing || record.isNew ? (
        <Select
          allowClear
          showSearch
          size="large"
          defaultValue={record.razaoSocial}
          options={pessoasOptions}
          onChange={(value, option) => handleChange(record.id, { razaoSocial: value, razaoSocialDescricao: option.label })}
          placeholder="Razão Social"
          optionFilterProp="label"
          style={{ width: "100%" }}
        />
      ) : (
        <span>{value ?? "-"}</span>
      ),
      sorter: (a: Conta, b: Conta) => {
        if (a.isNew) return 1;
        if (b.isNew) return -1;
        return a.razaoSocialDescricao.localeCompare(b.razaoSocialDescricao)
      },
      sortDirections: ["ascend", "descend", "ascend"],
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
      title: "Categoria",
      dataIndex: "planoContasDescricao",
      key: "planoContasDescricao",
      hidden: handleCheckColumn("Categoria"),
      render: (value: string, record: Conta) => record.editing || record.isNew ? (
        <Select
          allowClear
          showSearch
          defaultValue={record.planoContasId}
          onChange={(value, option) => handleChange(record.id, { planoContasId: value, planoContasDescricao: option.label })}
          optionFilterProp="label"
          options={planosOptions}
          size="large"
          placeholder="Plano de Contas"
          style={{ width: "100%" }}
        />
      ) : (
        <span>{value ?? "-"}</span>
      ),
      filterDropdown: ({ setSelectedKeys, selectedKeys, close }) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Input
            placeholder="Filtar por categoria"
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
      title: "Débito",
      dataIndex: "valorPagamento",
      key: "valorPagamento",
      hidden: handleCheckColumn("Débito"),
      render: (value: number, record: Conta) => record.editing || record.isNew ? (
        <CurrencyInput
          InputElement={
            <Input
              size="large"
              placeholder="Débito"
              disabled={record.tipoConta === "contasReceber"}
            />
          }
          max={9999999999}
          defaultValue={record.tipoConta === "contasPagar" ? value : 0}
          onChangeValue={(_, value) =>
            handleChange(record.id, { valorPagamento: Number(value), tipoConta: value === 0 ? undefined : "contasPagar" })
          }
        />
      ) : (
        <span>
          {record.tipoConta === "contasPagar" ? formatCurrency(value) : "R$ 0,00"}
        </span>
      ),
    },
    {
      title: "Crédito",
      dataIndex: "valorPagamento",
      key: "valorPagamento",
      hidden: handleCheckColumn("Crédito"),
      render: (value: number, record: Conta) => record.editing || record.isNew ? (
        <CurrencyInput
          InputElement={
            <Input
              size="large"
              placeholder="Crédito"
              disabled={record.tipoConta === "contasPagar"}
            />
          }
          max={9999999999}
          defaultValue={record.tipoConta === "contasReceber" ? value : 0}
          onChangeValue={(_, value) =>
            handleChange(record.id, { valorPagamento: Number(value), tipoConta: value === 0 ? undefined : "contasReceber" })
          }
        />
      ) : (
        <span>
          {record.tipoConta === "contasReceber" ? formatCurrency(value) : "R$ 0,00"}
        </span>
      ),
    },
    {
      title: "",
      dataIndex: "id",
      key: "id",
      render: (_: string, record: Conta) => (
        <span>
          {
            record.isNew && (
              <Tooltip title="Salvar">
                <Button
                  type="primary"
                  shape="circle"
                  size="large"
                  onClick={handleSave}
                  disabled={!record.valorPagamento}
                >
                  <SaveOutlined style={{ fontSize: 20 }} />
                </Button>
              </Tooltip>
            )
          }
        </span>
      ),
    },
  ];
}

export default getColumns;
