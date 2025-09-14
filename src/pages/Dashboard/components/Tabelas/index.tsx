import { Table } from "antd";
import { pessoasColumns, planosContasColumns } from "./columns";
import { Conta, Pessoa, PlanoConta } from "src/utils/typings";

interface TabelasProps {
  contas: Conta[];
  pessoas: Pessoa[];
  planosContas: PlanoConta[];
}

function Tabelas({ contas, pessoas, planosContas }: TabelasProps) {

  function buildTree(data: PlanoConta[]): any[] {
    const map: Record<string, any> = {};

    data.forEach(item => {
      const somaLocalValor = item.contasPlano?.reduce((acc, c) => acc + (c.valor || 0), 0) || 0;
      const somaLocalPagamento = item.contasPlano?.reduce((acc, c) => acc + (c.valorPagamento || 0), 0) || 0;

      map[item.id] = {
        ...item,
        valor: somaLocalValor,
        valorPagamento: somaLocalPagamento
      };
    });

    const roots: any[] = [];

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

    function acumular(node: any): { valor: number; valorPagamento: number } {
      const filhos = node.children?.map(acumular) || [];

      const somaFilhosValor = filhos.reduce((acc, c) => acc + c.valor, 0);
      const somaFilhosPagamento = filhos.reduce((acc, c) => acc + c.valorPagamento, 0);

      node.valor += somaFilhosValor;
      node.valorPagamento += somaFilhosPagamento;

      return { valor: node.valor, valorPagamento: node.valorPagamento };
    }

    roots.forEach(r => acumular(r));

    return roots;
  }

  const orderedData = planosContas.sort((a, b) => a.classificacao.localeCompare(b.classificacao));
  const planosCompletos = orderedData.map(item => {
    const contasPlano = contas
      .filter(conta => conta.planoContasId === item.id)
      .map(conta => ({ valor: conta.valor, valorPagamento: conta.valorPagamento }));
    return { ...item, contasPlano }
  });
  const treePlanosContas = buildTree(planosCompletos as PlanoConta[]);

  const pessoasContas = pessoas
    .filter(item => contas.some(conta => conta.razaoSocial === item.id))
    .map(item => {
      const conta = contas.find(conta => conta.razaoSocial === item.id);
      return {
        ...item,
        data: conta?.dataVencimento,
        realizado: conta?.valorPagamento,
        planejado: conta?.valor
      }
    });

  return (
    <>
      <div style={{ marginTop: 16, marginBottom: 16 }}>
        <h2>Pessoas</h2>
        <Table
          dataSource={pessoasContas}
          columns={pessoasColumns}
          pagination={false}
        />
      </div>

      <div style={{ marginTop: 16, marginBottom: 16 }}>
        <h2>Planos de Contas</h2>
        <Table
          dataSource={treePlanosContas}
          columns={planosContasColumns}
          pagination={false}
          rowKey="id"
        />
      </div>
    </>
  );
}

export default Tabelas;
