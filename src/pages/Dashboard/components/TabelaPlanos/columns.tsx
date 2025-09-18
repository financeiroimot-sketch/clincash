import formatCurrency from "src/utils/formatCurrency";
import formatNatureza from "src/utils/formatNatureza";

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
    onFilter: (value: string, record: any) => record.tipoConta === value,
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
    onFilter: (value: string, record: any) => record.natureza === value,
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
