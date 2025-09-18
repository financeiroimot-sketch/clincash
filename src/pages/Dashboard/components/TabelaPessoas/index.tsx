import { useEffect, useState } from "react";
import { Table } from "src/components";
import getColumns from "./columns";
import { Conta, Pessoa } from "src/utils/typings";

interface TabelaPessoasProps {
  contas: Conta[];
  pessoas: Pessoa[];
}

export interface Data {
  razaoSocial: string;
  telefone: string;
  tipoConta: string;
  data: string;
  realizado: number;
  planejado: number;
}

function TabelaPessoas({ contas, pessoas }: TabelaPessoasProps) {

  const [data, setData] = useState<Data[]>([]);

  function getData() {
    const result = pessoas
      .filter(item => contas.some(conta => conta.razaoSocial === item.id))
      .map(item => {
        const conta = contas?.find(conta => conta.razaoSocial === item.id);
        return {
          razaoSocial: item.razaoSocial,
          telefone: item.telefone,
          tipoConta: conta?.tipoConta,
          data: conta?.dataVencimento,
          realizado: conta?.valorPagamento,
          planejado: conta?.valor,
        }
      });
    setData(result as Data[]);
  }

  function handleSearch(search: string, key: string) {
    const result = data.filter(item => item[key]?.toLowerCase().includes(search.toLowerCase()));
    setData(search ? result : data);
  }

  useEffect(() => {
    if (contas && pessoas) {
      getData();
    }
  }, [contas, pessoas]);

  return (
    <div style={{ marginTop: 16, marginBottom: 16 }}>
      <h2>Pessoas</h2>
      <Table
        data={data}
        columns={getColumns(getData, handleSearch)}
        pagination={false}
      />
    </div>
  );
}

export default TabelaPessoas;
