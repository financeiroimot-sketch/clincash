import { useState, useEffect } from "react";
import { Card, DatePicker, Button } from "antd";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import moment from "moment";
import CardsContas from "./components/CardsContas";
import FaturamentoCliente from "./components/FaturamentoCliente";
import InadimplenciaCliente from "./components/InadimplenciaCliente";
import InadimplenciaFornecedor from "./components/InadimplenciaFornecedor";
import Tabelas from "./components/Tabelas";
import useQuery from "src/services/useQuery";
import { Conta, Pessoa, PlanoConta } from "src/utils/typings";
import { SearchOutlined } from "@ant-design/icons";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const { RangePicker } = DatePicker;

function Dashboard() {

  const { getDataByCollection } = useQuery();

  const [periodoInicio, setPeriodoInicio] = useState<string>();
  const [periodoFim, setPeriodoFim] = useState<string>();
  const [contasReceber, setContasReceber] = useState<Conta[]>([]);
  const [contasPagar, setContasPagar] = useState<Conta[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [planosContas, setPlanosContas] = useState<PlanoConta[]>([]);

  async function getData() {
    const [contasPagar, contasReceber, planosContas, pessoas] = await Promise.all([
      getDataByCollection<Conta>("contasPagar"),
      getDataByCollection<Conta>("contasReceber"),
      getDataByCollection<PlanoConta>("planosContas"),
      getDataByCollection<Pessoa>("pessoas"),
    ]);

    setPlanosContas(planosContas);
    setPessoas(pessoas);

    if (periodoInicio && periodoFim) {
      const inicio = moment(periodoInicio, "DD/MM/YYYY");
      const fim = moment(periodoFim, "DD/MM/YYYY");

      const receber = contasReceber.filter(item => {
        const data = moment(item.dataVencimento, "DD/MM/YYYY");
        return data.isBetween(inicio, fim);
      });
      setContasReceber(receber);

      const pagar = contasPagar.filter(item => {
        const data = moment(item.dataVencimento, "DD/MM/YYYY");
        return data.isBetween(inicio, fim);
      });
      setContasPagar(pagar);
      return;
    }

    setContasReceber(contasReceber);
    setContasPagar(contasPagar);
  }

  function handleSetDates(dates: any) {
    const [startDate, endDate] = dates;
    const start = moment(new Date(startDate)).format("DD/MM/YYYY");
    const end = moment(new Date(endDate)).format("DD/MM/YYYY");
    setPeriodoInicio(start);
    setPeriodoFim(end);
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <RangePicker
          size="large"
          format="DD/MM/YYYY"
          onChange={handleSetDates}
        />
        <Button
          type="primary"
          size="large"
          icon={<SearchOutlined />}
          onClick={getData}
          style={{ marginLeft: 8 }}
        />
      </Card>

      <CardsContas
        contasReceber={contasReceber}
        contasPagar={contasPagar}
      />

      <Tabelas
        contas={[...contasPagar, ...contasReceber]}
        pessoas={pessoas}
        planosContas={planosContas}
      />

      <FaturamentoCliente contasReceber={contasReceber} pessoas={pessoas} />
      <InadimplenciaCliente contasReceber={contasReceber} pessoas={pessoas} />
      <InadimplenciaFornecedor contasPagar={contasPagar} pessoas={pessoas} />
    </div>
  );
}

export default Dashboard;
