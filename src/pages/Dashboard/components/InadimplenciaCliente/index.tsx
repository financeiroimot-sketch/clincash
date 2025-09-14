import { Card } from "antd";
import { Bar } from "react-chartjs-2";
import { Conta, Pessoa } from "src/utils/typings";

interface InadimplenciaClienteProps {
  contasReceber: Conta[];
  pessoas: Pessoa[];
}

function InadimplenciaCliente({ contasReceber, pessoas }: InadimplenciaClienteProps) {

  const contas = contasReceber.filter(item => item.statusPagamento === "emAberto");
  const pessoasContas = pessoas.filter(item => contas.some(conta => conta.razaoSocial === item.id));

  const data = pessoasContas.map(item => {
    const total = contas
      .filter(conta => conta.razaoSocial === item.id)
      .reduce((acc, item) => acc + item.valor, 0);
    return { pessoa: item.razaoSocial, total }
  });

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
        label: "Inadimplência",
        data: data.map(item => item.total),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  }

  return (
    <Card title="Inadimplência por Cliente" style={{ marginBottom: 16 }}>
      <Bar options={options} data={barData} />
    </Card>
  );
}

export default InadimplenciaCliente;
