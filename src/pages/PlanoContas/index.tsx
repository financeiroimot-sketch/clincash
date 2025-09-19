import { useEffect, useState, Key } from "react";
import { useParams, useLocation } from "react-router-dom";
import useQuery from "src/services/useQuery";
import { PlanoConta } from "src/utils/typings";
import { Table, AddButton, Layout } from "src/components";
import Form from "./components/Form";
import getColumns from "./columns";

function PlanoContas() {

  const params = useParams();
  const location = useLocation();
  const { getDataByCollection } = useQuery();

  const [planos, setPlanos] = useState<PlanoConta[]>([]);
  const [planosFilter, setPlanosFilter] = useState<PlanoConta[]>([]);
  const [editing, setEditing] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState<Key[]>([]);

  function orderData(data: any[]) {
    return data.sort((a, b) => {
      const partsA = a.classificacao.split(".").map(Number);
      const partsB = b.classificacao.split(".").map(Number);

      const length = Math.max(partsA.length, partsB.length);
      for (let i = 0; i < length; i++) {
        const numA = partsA[i] ?? 0;
        const numB = partsB[i] ?? 0;
        if (numA !== numB) {
          return numA - numB;
        }
      }
      return 0;
    });
  }

  function buildTree(data: PlanoConta[]) {
    const map: Record<string, any> = {}
    const roots: PlanoConta[] = [];

    data.forEach(item => {
      map[item.id] = {
        key: item.id,
        title: item.descricao,
        ...item,
      }
    });

    data.forEach(item => {
      if (item.referencialId && map[item.referencialId]) {
        const parent = map[item.referencialId];
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(map[item.id]);
        return;
      }

      roots.push(map[item.id]);
    });

    return roots;
  }

  async function getData() {
    const data = await getDataByCollection<PlanoConta>("planosContas");
    const orderedData = orderData(data);
    const treeData = buildTree(orderedData);
    setPlanos(treeData as PlanoConta[]);
    setPlanosFilter(treeData as PlanoConta[]);
  }

  function handleSearch(search: string, key: string) {
    const data = planos.filter(item => item[key]?.toLowerCase().includes(search.toLowerCase()));
    setPlanosFilter(search ? data : planos);
  }

  function reset() {
    setPlanosFilter(planos);
  }

  useEffect(() => {
    if (location.pathname.includes("editar")) {
      setEditing(true);
      return;
    }
    setEditing(false);
  }, [location]);

  useEffect(() => {
    getData();
  }, [JSON.stringify(params), showForm]);

  return (
    <Layout>
      {(params?.id || showForm) ? (
        <Form
          id={params?.id || null}
          editing={editing}
          setShowForm={setShowForm}
        />
      ) : (
        <>
          <AddButton setShowForm={setShowForm} />
          <Table
            columns={getColumns(getData, reset, handleSearch)}
            data={planosFilter}
            expandable={{
              expandedRowKeys,
              onExpand: (expanded, record) => {
                if (expanded) {
                  setExpandedRowKeys([...expandedRowKeys, record.key]);
                } else {
                  setExpandedRowKeys(expandedRowKeys.filter((k) => k !== record.key));
                }
              },
            }}
          />
        </>
      )}
    </Layout>
  );
}

export default PlanoContas;
