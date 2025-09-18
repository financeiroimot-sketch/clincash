import { useEffect, useState, useRef } from "react";
import { Button, Card, Tooltip } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import moment from "moment";
import useQuery from "src/services/useQuery";
import { Conta, Coluna, PlanoConta, Pessoa, Option, ContasFilter } from "src/utils/typings";
import { Table, Filter, Layout } from "src/components";
import Filters from "./components/Filters";
import Form from "./components/Form";
import getColumns from "./columns";
import exportPDF from "src/utils/exportPDFContas";

function ContasPagar() {

  const params = useParams();
  const { getDataByCollection, getUser } = useQuery();
  const ref = useRef(null);

  const [searched, setSearched] = useState<boolean>(false);
  const [filters, setFilters] = useState<ContasFilter>();
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [planosContas, setPlanosContas] = useState<PlanoConta[]>([]);
  const [pessoasOptions, setPessoasOptions] = useState<Option[]>([]);
  const [planosOptions, setPlanosOptions] = useState<Option[]>([]);
  const [contas, setContas] = useState<Conta[]>([]);
  const [contasFilter, setContasFilter] = useState<Conta[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [colunasAtivas, setColunasAtivas] = useState<Coluna[]>([]);

  function getStatusVencimento(conta: Conta) {
    const today = dayjs();
    const dataVencimento = dayjs(conta.dataVencimento, "DD/MM/YYYY");
    if (dataVencimento.isSame(today, "date")) {
      return { statusVencimento: "Vence Hoje", statusVencimentoCor: "#0f0" }
    }
    if (dataVencimento.isBefore(today)) {
      return { statusVencimento: "Vencido", statusVencimentoCor: "#8819f7" }
    }
    if (dataVencimento.diff(today, "week") === 0) {
      return { statusVencimento: "Vence Essa Semana", statusVencimentoCor: "#fc9403" }
    }
    return { statusVencimento: "A Vencer", statusVencimentoCor: "#bababa" }
  }

  function handleFilter(data: Conta[], filters: ContasFilter) {
    return data.filter((item) => {
      if (filters.razaoSocialDescricao?.length && !filters.razaoSocialDescricao.includes(item.razaoSocialDescricao)) {
        return false;
      }

      if (filters.statusPagamento && item.statusPagamento !== filters.statusPagamento) {
        return false;
      }

      if (filters.statusVencimento && item.statusVencimento !== filters.statusVencimento) {
        return false;
      }

      if (
        (filters.planoContasDescricao?.length && item.planoContasDescricao && !filters.planoContasDescricao.includes(item.planoContasDescricao))
        || !item.planoContasDescricao
      ) {
        return false;
      }

      if (filters.dataVencimentoInicial || filters.dataVencimentoFinal) {
        const dataItem = moment(item.dataVencimento, "DD/MM/YYYY");
        const dataInicial = filters.dataVencimentoInicial ? moment(filters.dataVencimentoInicial, "DD/MM/YYYY") : null;
        const dataFinal = filters.dataVencimentoFinal ? moment(filters.dataVencimentoFinal, "DD/MM/YYYY") : null;

        if (dataInicial && dataItem.isBefore(dataInicial, "day")) return false;
        if (dataFinal && dataItem.isAfter(dataFinal, "day")) return false;
      }

      if (filters.dataPagamentoInicial || filters.dataPagamentoFinal) {
        if (!item.dataPagamento) return false;

        const dataItem = moment(item.dataPagamento, "DD/MM/YYYY");
        const dataInicial = filters.dataPagamentoInicial ? moment(filters.dataPagamentoInicial, "DD/MM/YYYY") : null;
        const dataFinal = filters.dataPagamentoFinal ? moment(filters.dataPagamentoFinal, "DD/MM/YYYY") : null;

        if (dataInicial && dataItem.isBefore(dataInicial, "day")) return false;
        if (dataFinal && dataItem.isAfter(dataFinal, "day")) return false;
      }

      return true;
    });
  }

  async function getOptions() {
    const [planosContas, pessoas] = await Promise.all([
      getDataByCollection<PlanoConta>("planosContas"),
      getDataByCollection<Pessoa>("pessoas"),
    ]);

    const planosOrdered = planosContas.sort((a, b) => a.descricao.localeCompare(b.descricao));
    const planosResult = planosOrdered.map(item => ({ value: item.descricao, label: item.descricao }));
    setPlanosContas(planosContas);
    setPlanosOptions(planosResult);

    const pessoasOrdered = pessoas.sort((a, b) => a.razaoSocial.localeCompare(b.razaoSocial));
    const pessoasResult = pessoasOrdered.map(item => ({ value: item.razaoSocial, label: item.razaoSocial }));
    setPessoas(pessoas);
    setPessoasOptions(pessoasResult);
  }

  async function getData(filters?: ContasFilter) {
    const usuario = await getUser();
    setColunasAtivas(usuario?.colunasContasPagar);

    const contasPagar = await getDataByCollection<Conta>("contasPagar");

    setFilters(filters);

    const data = contasPagar.map((item: any) => {
      const planoContas = planosContas?.find(plano => plano.id === item?.planoContasId);
      const pessoa = pessoas?.find(pessoa => pessoa.id === item?.razaoSocial);
      const planoContasDescricao = planoContas?.descricao;
      const razaoSocialDescricao = pessoa?.razaoSocial;
      const statusVencimento = getStatusVencimento(item);
      return { ...item, planoContasDescricao, razaoSocialDescricao, ...statusVencimento }
    });

    if (filters) {
      const result = handleFilter(data, filters);
      setSearched(true);
      setContas(result as Conta[]);
      setContasFilter(result as Conta[]);
      return;
    }

    setSearched(true);
    setContas(data as Conta[]);
    setContasFilter(data as Conta[]);
  }

  function handleSearch(search: string, key: string) {
    const data = contas.filter(item => item[key]?.toLowerCase().includes(search.toLowerCase()));
    setContasFilter(search ? data : contas);
  }

  function reset() {
    setContasFilter(contas);
  }

  function handleCheckColumn(columnName: string) {
    const column = colunasAtivas?.find(item => item.coluna === columnName);
    return column ? !column.ativo : true;
  }

  useEffect(() => {
    setSearched(false);
    getOptions();
  }, [JSON.stringify(params), showForm]);

  return (
    <Layout>
      {(params?.id || showForm) ? (
        <Form
          id={params?.id || null}
          setShowForm={setShowForm}
        />
      ) : (
        <>
          <Filter setShowForm={setShowForm} />

          <Card style={{ marginBottom: 8, display: "flex" }}>
            <Filters
              planosOptions={planosOptions}
              pessoasOptions={pessoasOptions}
              submit={getData}
            />

            <Tooltip title="Exportar PDF">
              <Button
                size="large"
                onClick={() => exportPDF(ref, "contas-pagar", "Contas a Pagar", filters)}
                icon={<DownloadOutlined style={{ fontSize: 20 }} />}
                shape="circle"
                type="primary"
                disabled={!searched}
              />
            </Tooltip>
          </Card>

          {searched && (
            <div ref={ref}>
              <Table
                columns={getColumns(getData, reset, handleCheckColumn, handleSearch)}
                data={contasFilter}
              />
            </div>
          )}
        </>
      )}
    </Layout>
  );
}

export default ContasPagar;
