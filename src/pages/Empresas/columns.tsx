import { EditButton } from "src/components";

const columns = [
  {
    title: "Razão Social",
    dataIndex: "razaoSocial",
    key: "razaoSocial",
    render: (value: string) => <span>{value ?? "-"}</span>,
  },
  {
    title: "CNPJ",
    dataIndex: "cnpj",
    key: "cnpj",
    render: (value: string) => <span>{value ?? "-"}</span>,
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

export default columns;
