import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useQuery from "src/services/useQuery";
import { Empresa } from "src/utils/typings";
import { Table, AddButton } from "src/components";
import Form from "./components/Form";
import columns from "./columns";

function Empresas() {

  const params = useParams();
  const { getDataByCollection } = useQuery();
  
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);

  async function getEmpresas() {
    const data = await getDataByCollection("empresas");
    setEmpresas(data as Empresa[]);
  }

  useEffect(() => {
    getEmpresas();
  }, [showForm, JSON.stringify(params)]);

  return (
    <>
      {(params?.id || showForm) ? (
        <Form id={params?.id || null} setShowForm={setShowForm} />
      ) : (
        <>
          <AddButton setShowForm={setShowForm} />
          <Table
            columns={columns}
            data={empresas}
          />
        </>
      )}
    </>
  );
}

export default Empresas;
