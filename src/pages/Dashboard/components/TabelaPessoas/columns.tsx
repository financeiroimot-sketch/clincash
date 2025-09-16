function formatCurrency(value: number) {
  return value.toLocaleString("pt-br", { style: "currency", currency: "BRL" });
}

const columns = [
  {
    // filtro
    title: "Razão Social",
    dataIndex: "razaoSocial",
    key: "razaoSocial",
    render: (value: string) => <span>{value ?? "-"}</span>,
  },
  {
    title: "Telefone",
    dataIndex: "telefone",
    key: "telefone",
    render: (value: string) => <span>{value ?? "-"}</span>,
  },
  {
    // filtro
    title: "Data",
    dataIndex: "data",
    key: "data",
    render: (value: string) => <span>{value ?? "-"}</span>,
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

export default columns;
