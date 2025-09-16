import { Table } from "antd";
import columns from "./columns";
import { Conta, Pessoa } from "src/utils/typings";

interface TabelaPessoasProps {
  contas: Conta[];
  pessoas: Pessoa[];
}

function TabelaPessoas({ contas, pessoas }: TabelaPessoasProps) {

  const data = pessoas
    .filter(item => contas.some(conta => conta.razaoSocial === item.id))
    .map(item => {
      const conta = contas?.find(conta => conta.razaoSocial === item.id);
      return {
        ...item,
        data: conta?.dataVencimento,
        realizado: conta?.valorPagamento,
        planejado: conta?.valor
      }
    });

  return (
    <div style={{ marginTop: 16, marginBottom: 16 }}>
      <h2>Pessoas</h2>
      <Table
        dataSource={data}
        columns={columns}
        pagination={false}
      />
    </div>
  );
}

export default TabelaPessoas;
