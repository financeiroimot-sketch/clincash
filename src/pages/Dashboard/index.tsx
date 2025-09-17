import { useState, useEffect, useRef } from "react";
import { Card, DatePicker, Button, Tooltip as AntdTooltip } from "antd";
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
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
import TabelaPessoas from "./components/TabelaPessoas";
import TabelaPlanos from "./components/TabelaPlanos";
import useQuery from "src/services/useQuery";
import { Conta, Pessoa, PlanoConta } from "src/utils/typings";
import exportPDF from "src/utils/exportPDF";

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
  const ref = useRef(null);

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
      setContasReceber(receber.map(item => ({ ...item, tipoConta: "contasReceber" })));

      const pagar = contasPagar.filter(item => {
        const data = moment(item.dataVencimento, "DD/MM/YYYY");
        return data.isBetween(inicio, fim);
      });
      setContasPagar(pagar.map(item => ({ ...item, tipoConta: "contasPagar" })));
      return;
    }

    setContasReceber(contasReceber.map(item => ({ ...item, tipoConta: "contasReceber" })));
    setContasPagar(contasPagar.map(item => ({ ...item, tipoConta: "contasPagar" })));
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
          shape="circle"
          icon={<SearchOutlined />}
          onClick={getData}
          style={{ marginLeft: 8, marginRight: 8 }}
        />
        <AntdTooltip title="Exportar PDF">
          <Button
            size="large"
            onClick={() => exportPDF(ref, "dashboard", "Dashboard")}
            icon={<DownloadOutlined style={{ fontSize: 20 }} />}
            shape="circle"
            type="primary"
            style={{ marginRight: 8 }}
          />
        </AntdTooltip>
      </Card>

      <div ref={ref}>
        <CardsContas
          contasReceber={contasReceber}
          contasPagar={contasPagar}
        />

        <TabelaPessoas
          contas={[...contasPagar, ...contasReceber]}
          pessoas={pessoas}
        />

        <TabelaPlanos
          contasPagar={contasPagar}
          contasReceber={contasReceber}
          planosContas={planosContas}
        />

        <FaturamentoCliente contasReceber={contasReceber} pessoas={pessoas} />
        <InadimplenciaCliente contasReceber={contasReceber} pessoas={pessoas} />
        <InadimplenciaFornecedor contasPagar={contasPagar} pessoas={pessoas} />
      </div>
    </div>
  );
}

export default Dashboard;
