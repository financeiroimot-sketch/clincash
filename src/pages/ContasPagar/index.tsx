import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import useQuery from "src/services/useQuery";
import { Conta, Coluna, PlanoConta, Pessoa } from "src/utils/typings";
import { Table, Filter, Layout } from "src/components";
import Form from "./components/Form";
import getColumns from "./columns";

function ContasPagar() {

  const params = useParams();
  const { getDataByCollection, getUser } = useQuery();

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

  async function getData() {
    const usuario = await getUser();
    setColunasAtivas(usuario.colunasContasPagar);

    const [contasPagar, planosContas, pessoas] = await Promise.all([
      getDataByCollection<Conta>("contasPagar"),
      getDataByCollection<PlanoConta>("planosContas"),
      getDataByCollection<Pessoa>("pessoas"),
    ]);
    const data = contasPagar.map((item: any) => {
      const planoContas = planosContas.find(plano => plano.id === item?.planoContasId);
      const pessoa = pessoas.find(pessoa => pessoa.id === item?.razaoSocial);
      const planoContasDescricao = planoContas?.descricao;
      const razaoSocialDescricao = pessoa?.razaoSocial;
      const statusVencimento = getStatusVencimento(item);
      return { ...item, planoContasDescricao, razaoSocialDescricao, ...statusVencimento }
    });
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
    const column = colunasAtivas.find(item => item.coluna === columnName);
    return column ? !column.ativo : true;
  }

  useEffect(() => {
    getData();
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
          <Table
            columns={getColumns(getData, reset, handleCheckColumn, handleSearch)}
            data={contasFilter}
          />
        </>
      )}
    </Layout>
  );
}

export default ContasPagar;
