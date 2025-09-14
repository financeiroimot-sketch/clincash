import { Card } from "antd";
import { Bar } from "react-chartjs-2";
import { Conta, Pessoa } from "src/utils/typings";

interface FaturamentoClienteProps {
  contasReceber: Conta[];
  pessoas: Pessoa[];
}

function FaturamentoCliente({ contasReceber, pessoas }: FaturamentoClienteProps) {

  const contas = contasReceber.filter(item => item.statusPagamento === "pago");
  const pessoasContas = pessoas.filter(item => contas.some(conta => conta.razaoSocial === item.id));

  const data = pessoasContas.map(item => {
    const total = contas
      .filter(conta => conta.razaoSocial === item.id)
      .reduce((acc, item) => acc + item.valor, 0);
    return { pessoa: item.razaoSocial, total }
  }).sort((a, b) => b.total - a.total);

  const options = {
    indexAxis: "y" as const,
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            return `R$ ${value.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}`;
          },
        },
      },
    },
  }

  const labels = data.map(item => item.pessoa);

  const barData = {
    labels,
    datasets: [
      {
        label: "Faturamento",
        data: data.map(item => item.total),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  }

  return (
    <Card title="Faturamento por Cliente" style={{ marginBottom: 16 }}>
      <Bar options={options} data={barData} />
    </Card>
  );
}

export default FaturamentoCliente;
