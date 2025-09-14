function formatCurrency(value: number) {
  return value.toLocaleString("pt-br", { style: "currency", currency: "BRL" });
}

const pessoasColumns = [
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

const planosContasColumns = [
  {
    title: "Classificação",
    dataIndex: "classificacao",
    key: "classificacao",
    render: (value: string) => <span>{value ?? "-"}</span>,
  },
  {
    title: "Descrição",
    dataIndex: "descricao",
    key: "descricao",
    render: (value: string) => <span>{value ?? "-"}</span>,
  },
  {
    title: "Tipo",
    dataIndex: "tipoConta",
    key: "tipoConta",
    render: (value: string) => <span>{value === "receita" ? "Receita" : "Despesa"}</span>,
  },
  {
    title: "Natureza",
    dataIndex: "natureza",
    key: "natureza",
    render: (value: string) => <span>{value === "sintetica" ? "Sintética" : "Analítica"}</span>,
  },
  {
    title: "Realizado",
    dataIndex: "valorPagamento",
    key: "valorPagamento",
    render: (value: number) => <span>{value ? formatCurrency(value) : "-"}</span>,
  },
  {
    title: "Planejado",
    dataIndex: "valor",
    key: "valor",
    render: (value: number) => <span>{value ? formatCurrency(value) : "-"}</span>,
  },
];

export { pessoasColumns, planosContasColumns }
