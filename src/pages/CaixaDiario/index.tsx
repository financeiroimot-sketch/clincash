import { useEffect, useState } from "react";
import { Card, Button, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import useQuery from "src/services/useQuery";
import { Conta } from "src/utils/typings";

dayjs.extend(customParseFormat);

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ApiData {
  data?: string;
  receberPlanejado?: number;
  receberRealizado?: number;
  pagarPlanejado?: number;
  pagarRealizado?: number;
}

const monthOptions = [
  { label: "Janeiro", value: "1" },
  { label: "Fevereiro", value: "2" },
  { label: "Março", value: "3" },
  { label: "Abril", value: "4" },
  { label: "Maio", value: "5" },
  { label: "Junho", value: "6" },
  { label: "Julho", value: "7" },
  { label: "Agosto", value: "8" },
  { label: "Setembro", value: "9" },
  { label: "Outubro", value: "10" },
  { label: "Novembro", value: "11" },
  { label: "Dezembro", value: "12" },
];

function CaixaDiario() {

  const { getDataByCollection } = useQuery();

  const [apiData, setApiData] = useState<ApiData[]>();
  const [month, setMonth] = useState<string>();
  const [year, setYear] = useState<string>();

  function getYearOptions() {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 3;
    const endYear = currentYear + 10;

    return Array.from({ length: endYear - startYear + 1 }, (_, i) => {
      const year = startYear + i;
      return { label: year.toString(), value: year.toString() }
    });
  }

  async function getData() {
    const currentMonth = month ?? dayjs().month() + 1;
    const currentYear = year ?? dayjs().year();

    const [contasPagar, contasReceber] = await Promise.all([
      getDataByCollection<Conta>("contasPagar"),
      getDataByCollection<Conta>("contasReceber"),
    ]);

    const contas = [...contasPagar, ...contasReceber];
    const contasFiltered = contas.filter(item => {
      const vencimento = dayjs(item.dataVencimento, "DD/MM/YYYY");
      return vencimento.year() === Number(currentYear) && vencimento.month() + 1 === Number(currentMonth);
    });

    const contasDatas = [...new Set(contasFiltered.map(item => item.dataVencimento))].sort();

    const result = contasDatas.map(item => {
      const receberPlanejado = contasReceber
        ?.filter((conta) => conta.dataVencimento === item)
        ?.reduce((acc, conta) => acc += conta.valor ?? 0, 0);
      const receberRealizado = contasReceber
        ?.filter((conta) => conta.dataVencimento === item)
        ?.reduce((acc, conta) => acc += conta.valorPagamento ?? 0, 0);

      const pagarPlanejado = contasPagar
        ?.filter((conta) => conta.dataVencimento === item)
        ?.reduce((acc, conta) => acc += conta.valor ?? 0, 0);
      const pagarRealizado = contasPagar
        ?.filter((conta) => conta.dataVencimento === item)
        ?.reduce((acc, conta) => acc += conta.valorPagamento ?? 0, 0);

      return { data: item, receberPlanejado, receberRealizado, pagarPlanejado, pagarRealizado }
    });

    setApiData(result);
  }

  function formatCurrency(value: number) {
    return value.toLocaleString("pt-br", { style: "currency", currency: "BRL" });
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => formatCurrency(context.raw),
        },
      },
      legend: {
        position: "top" as const,
      },
    },
  }

  const labels = apiData?.map((item) => item.data?.split("/")[0]);

  const data = {
    labels,
    datasets: [
      {
        label: "Receber Realizado",
        data: apiData?.map((item) => item.receberRealizado),
        backgroundColor: "#22c55e",
      },
      {
        label: "Receber Planejado",
        data: apiData?.map((item) => item.receberPlanejado),
        backgroundColor: "#3b82f6",
      },
      {
        label: "Pagar Realizado",
        data: apiData?.map((item) => item.pagarRealizado),
        backgroundColor: "#ef4444",
      },
      {
        label: "Pagar Planejado",
        data: apiData?.map((item) => item.pagarPlanejado),
        backgroundColor: "#f59e0b",
      },
    ],
  }

  useEffect(() => {
    const currentMonth = dayjs().month() + 1;
    const currentYear = dayjs().year();
    setMonth(currentMonth.toString());
    setYear(currentYear.toString());
    getData();
  }, []);

  return (
    <div style={{ maxWidth: "60%", height: "calc(100vh - 200px)" }}>
      <Card style={{ marginBottom: 8 }}>
        <Select
          placeholder="Mês"
          size="large"
          value={month}
          options={monthOptions}
          onChange={setMonth}
          style={{ minWidth: 120 }}
        />

        <Select
          placeholder="Ano"
          size="large"
          value={year}
          options={getYearOptions()}
          onChange={setYear}
          style={{ marginLeft: 8, minWidth: 120 }}
        />

        <Button
          type="primary"
          size="large"
          icon={<SearchOutlined />}
          onClick={getData}
          disabled={!year || !month}
          style={{ marginLeft: 8 }}
        />
      </Card>

      {month && year && apiData && <Bar options={options} data={data} />}
    </div>
  );
}

export default CaixaDiario;
