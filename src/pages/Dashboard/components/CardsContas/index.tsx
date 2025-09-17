import { Card, Col, Row } from "antd";
import { Conta } from "src/utils/typings";

interface CardsContasProps {
  contasReceber: Conta[];
  contasPagar: Conta[];
}

function CardsContas({ contasReceber, contasPagar }: CardsContasProps) {

  const contasReceberRealizado = contasReceber.reduce((acc, conta) => acc += conta.valorPagamento ?? 0, 0);
  const contasReceberPlanejado = contasReceber.reduce((acc, conta) => acc += conta.valor ?? 0, 0);
  const contasPagarRealizado = contasPagar.reduce((acc, conta) => acc += conta.valorPagamento ?? 0, 0);
  const contasPagarPlanejado = contasPagar.reduce((acc, conta) => acc += conta.valor ?? 0, 0);

  function formatCurrency(value: number) {
    return value.toLocaleString("pt-br", { style: "currency", currency: "BRL" });
  }

  return (
    <Row gutter={[16, 16]}>
      <Col span={6}>
        <Card title="A Receber Realizado" style={{ borderLeft: "4px solid #22c55e" }}>
          <h1 style={{ margin: 0 }}>{formatCurrency(contasReceberRealizado ?? 0)}</h1>
        </Card>
      </Col>
      <Col span={6}>
        <Card title="A Receber Planejado" style={{ borderLeft: "4px solid #3b82f6" }}>
          <h1 style={{ margin: 0 }}>{formatCurrency(contasReceberPlanejado ?? 0)}</h1>
        </Card>
      </Col>
      <Col span={6}>
        <Card title="A Pagar Realizado" style={{ borderLeft: "4px solid #ef4444" }}>
          <h1 style={{ margin: 0 }}>{formatCurrency(contasPagarRealizado ?? 0)}</h1>
        </Card>
      </Col>
      <Col span={6}>
        <Card title="A Pagar Planejado" style={{ borderLeft: "4px solid #f59e0b" }}>
          <h1 style={{ margin: 0 }}>{formatCurrency(contasPagarPlanejado ?? 0)}</h1>
        </Card>
      </Col>
    </Row>
  );
}

export default CardsContas;
