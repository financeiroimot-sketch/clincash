import { useState, useRef } from "react";
import { DatePicker, Button, Tooltip as AntdTooltip, Row, Col } from "antd";
import { ExportOutlined, SearchOutlined } from "@ant-design/icons";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import moment from "moment";
import { Filter } from "src/components";
import CardsContas from "./components/CardsContas";
import FaturamentoCliente from "./components/FaturamentoCliente";
import InadimplenciaCliente from "./components/InadimplenciaCliente";
import InadimplenciaFornecedor from "./components/InadimplenciaFornecedor";
import TabelaPessoas from "./components/TabelaPessoas";
import TabelaPlanos from "./components/TabelaPlanos";
import useQuery from "src/services/useQuery";
import { Conta, Pessoa, PlanoConta, Coluna } from "src/utils/typings";
import exportPDF from "src/utils/exportPDFDashboard";

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

  const { getDataByCollection, getUser } = useQuery();
  const ref = useRef(null);

  const [searched, setSearched] = useState<boolean>(false);
  const [periodoInicio, setPeriodoInicio] = useState<string>();
  const [periodoFim, setPeriodoFim] = useState<string>();
  const [contasReceber, setContasReceber] = useState<Conta[]>([]);
  const [contasPagar, setContasPagar] = useState<Conta[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [planosContas, setPlanosContas] = useState<PlanoConta[]>([]);
  const [colunasAtivas, setColunasAtivas] = useState<Coluna[]>([]);

  async function getData() {
    if (periodoInicio && periodoFim) {
      const usuario = await getUser();
      setColunasAtivas(usuario?.colunasDashboard);

      const [contasPagar, contasReceber, planosContas, pessoas] = await Promise.all([
        getDataByCollection<Conta>("contasPagar"),
        getDataByCollection<Conta>("contasReceber"),
        getDataByCollection<PlanoConta>("planosContas"),
        getDataByCollection<Pessoa>("pessoas"),
      ]);

      setPlanosContas(planosContas);
      setPessoas(pessoas);

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
      setSearched(true);
    }
  }

  function handleSetDates(dates: any) {
    const [startDate, endDate] = dates;
    const start = moment(new Date(startDate)).format("DD/MM/YYYY");
    const end = moment(new Date(endDate)).format("DD/MM/YYYY");
    setPeriodoInicio(start);
    setPeriodoFim(end);
  }

  function handleCheckColumn(columnName: string) {
    const column = colunasAtivas?.find(item => item.coluna === columnName);
    return column ? column.ativo : true;
  }

  return (
    <div>
      <Filter subtitle="Dashboard">
        <Row gutter={[8, 8]}>
          <Col xs={24} sm={12} md={6}>
            <RangePicker
              size="large"
              format="DD/MM/YYYY"
              onChange={handleSetDates}
              style={{ width: "100%" }}
            />
          </Col>
          <Col xs={24} sm={12} md={3}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              size="large"
              onClick={getData}
              style={{ width: "100%" }}
              disabled={!periodoInicio || !periodoFim}
            >
              Buscar
            </Button>
          </Col>
          <Col xs={24} sm={12} md={3}>
            <AntdTooltip title="Exportar PDF">
              <Button
                size="large"
                onClick={() => exportPDF(
                  ref,
                  "dashboard",
                  "Dashboard",
                  `${periodoInicio} a ${periodoFim}`,
                )}
                icon={<ExportOutlined />}
                disabled={!searched}
                style={{ width: "100%" }}
              >
                Exportar
              </Button>
            </AntdTooltip>
          </Col>
        </Row>
      </Filter>

      {searched && (
        <div ref={ref}>
          {handleCheckColumn("Resumo das Contas") && (
            <CardsContas
              contasReceber={contasReceber}
              contasPagar={contasPagar}
            />
          )}

          {handleCheckColumn("Tabela de Pessoas") && (
            <TabelaPessoas
              contas={[...contasPagar, ...contasReceber]}
              pessoas={pessoas}
            />
          )}

          {handleCheckColumn("Tabela de Planos de Contas") && (
            <TabelaPlanos
              contasPagar={contasPagar}
              contasReceber={contasReceber}
              planosContas={planosContas}
            />
          )}

          {handleCheckColumn("Faturamento por Cliente") && (
            <FaturamentoCliente contasReceber={contasReceber} pessoas={pessoas} />
          )}

          {handleCheckColumn("Inadimplência por Cliente") && (
            <InadimplenciaCliente contasReceber={contasReceber} pessoas={pessoas} />
          )}

          {handleCheckColumn("Inadimplência por Fornecedor") && (
            <InadimplenciaFornecedor contasPagar={contasPagar} pessoas={pessoas} />
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
