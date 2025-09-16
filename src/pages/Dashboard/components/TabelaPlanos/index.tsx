import { Table } from "antd";
import columns from "./columns";
import { Conta, PlanoConta } from "src/utils/typings";

interface TabelaPlanosProps {
  contasPagar: Conta[];
  contasReceber: Conta[];
  planosContas: PlanoConta[];
}

function TabelaPlanos({ contasPagar, contasReceber, planosContas }: TabelaPlanosProps) {

  const receitasSemPlanos = contasReceber.filter(item => !item.planoContasId);
  const receitaTotalRealizado = receitasSemPlanos.reduce((acc, item) => acc += item?.valorPagamento ?? 0, 0);
  const receitaTotalPlanejado = receitasSemPlanos.reduce((acc, item) => acc += item?.valor ?? 0, 0);
  const receitaSemPlano = {
    descricao: "Receitas sem Plano Informado",
    tipoConta: "receita",
    valorPagamento: receitaTotalRealizado,
    valor: receitaTotalPlanejado,
  }

  const despesasSemPlanos = contasPagar.filter(item => !item.planoContasId);
  const despesaTotalRealizado = despesasSemPlanos.reduce((acc, item) => acc += item?.valorPagamento ?? 0, 0);
  const despesaTotalPlanejado = despesasSemPlanos.reduce((acc, item) => acc += item?.valor ?? 0, 0);
  const despesaSemPlano = {
    descricao: "Despesas sem Plano Informado",
    tipoConta: "despesa",
    valorPagamento: despesaTotalRealizado,
    valor: despesaTotalPlanejado,
  }

  const contas = [...contasPagar, ...contasReceber];
  
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

  const data = buildTree(planosCompletos as PlanoConta[]);

  return (
    <div style={{ marginTop: 16, marginBottom: 16 }}>
      <h2>Planos de Contas</h2>
      <Table
        dataSource={[...data, receitaSemPlano, despesaSemPlano]}
        columns={columns}
        pagination={false}
        rowKey="id"
      />
    </div>
  );
}

export default TabelaPlanos;
