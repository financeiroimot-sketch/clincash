import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useQuery from "src/services/useQuery";
import { Usuario } from "src/utils/typings";
import { Table, AddButton, Layout } from "src/components";
import Form from "./components/Form";
import getColumns from "./columns";

function Usuarios() {

  const params = useParams();
  const { getDataByCollection } = useQuery();

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuariosFilter, setUsuariosFilter] = useState<Usuario[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);

  async function getData() {
    const data = await getDataByCollection("usuarios");
    setUsuarios(data as Usuario[]);
    setUsuariosFilter(data as Usuario[]);
  }

  function handleSearch(search: string, key: string) {
    const data = usuarios.filter(item => item[key]?.toLowerCase().includes(search.toLowerCase()));
    setUsuariosFilter(search ? data : usuarios);
  }

  function reset() {
    setUsuariosFilter(usuarios);
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
          <AddButton setShowForm={setShowForm} />
          <Table
            columns={getColumns(reset, handleSearch)}
            data={usuariosFilter}
          />
        </>
      )}
    </Layout>
  );
}

export default Usuarios;
