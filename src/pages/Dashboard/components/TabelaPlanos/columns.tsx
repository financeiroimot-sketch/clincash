function formatCurrency(value: number) {
  return value.toLocaleString("pt-br", { style: "currency", currency: "BRL" });
}

function formatNatureza(value: string) {
  return value === "sintetica" ? "Sintética" : "Analítica";
}

const columns = [
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
    render: (value: string) => <span>{value ? formatNatureza(value) : "-"}</span>,
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

export default columns;
