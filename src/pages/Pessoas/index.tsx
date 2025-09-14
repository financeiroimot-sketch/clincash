import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useQuery from "src/services/useQuery";
import { Pessoa, PlanoConta } from "src/utils/typings";
import { Table, Filter, Layout } from "src/components";
import Form from "./components/Form";
import getColumns from "./columns";

function Pessoas() {

  const params = useParams();
  const { getDataByCollection } = useQuery();

  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [pessoasFilter, setPessoasFilter] = useState<Pessoa[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);

  async function getData() {
    const [pessoas, planosContas] = await Promise.all([
      getDataByCollection<Pessoa>("pessoas"),
      getDataByCollection<PlanoConta>("planosContas"),
    ]);
    const data = pessoas.map(item => {
      const planoContas = planosContas?.find(plano => plano.id === item?.planoContasId);
      const descricao = planoContas?.descricao;
      return { ...item, planoContasDescricao: descricao }
    });
    setPessoas(data as Pessoa[]);
    setPessoasFilter(data as Pessoa[]);
  }

  function handleSearch(search: string, key: string) {
    const data = pessoas.filter(item => item[key]?.toLowerCase().includes(search.toLowerCase()));
    setPessoasFilter(search ? data : pessoas);
  }

  function reset() {
    setPessoasFilter(pessoas);
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
            columns={getColumns(reset, handleSearch)}
            data={pessoasFilter}
          />
        </>
      )}
    </Layout>
  );
}

export default Pessoas;
