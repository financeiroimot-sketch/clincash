import { Card, Col, Row } from "antd";
import { Conta } from "src/utils/typings";
import formatCurrency from "src/utils/formatCurrency";

interface CardsContasProps {
  contasReceber: Conta[];
  contasPagar: Conta[];
}

function CardsContas({ contasReceber, contasPagar }: CardsContasProps) {

  const contasReceberRealizado = contasReceber.reduce((acc, conta) => acc += conta.valorPagamento ?? 0, 0);
  const contasReceberPlanejado = contasReceber.reduce((acc, conta) => acc += conta.valor ?? 0, 0);
  const contasPagarRealizado = contasPagar.reduce((acc, conta) => acc += conta.valorPagamento ?? 0, 0);
  const contasPagarPlanejado = contasPagar.reduce((acc, conta) => acc += conta.valor ?? 0, 0);

  return (
    <Row gutter={[6, 6]}>
      <Col span={6}>
        <Card title="A Receber Realizado" style={{ borderLeft: "4px solid #22c55e" }}>
          <h2 style={{ margin: 0, fontSize: "1.3rem" }}>
            {formatCurrency(contasReceberRealizado ?? 0)}
          </h2>
        </Card>
      </Col>
      <Col span={6}>
        <Card title="A Receber Planejado" style={{ borderLeft: "4px solid #3b82f6" }}>
          <h2 style={{ margin: 0, fontSize: "1.3rem" }}>
            {formatCurrency(contasReceberPlanejado ?? 0)}
          </h2>
        </Card>
      </Col>
      <Col span={6}>
        <Card title="A Pagar Realizado" style={{ borderLeft: "4px solid #ef4444" }}>
          <h2 style={{ margin: 0, fontSize: "1.3rem" }}>
            {formatCurrency(contasPagarRealizado ?? 0)}
          </h2>
        </Card>
      </Col>
      <Col span={6}>
        <Card title="A Pagar Planejado" style={{ borderLeft: "4px solid #f59e0b" }}>
          <h2 style={{ margin: 0, fontSize: "1.3rem" }}>
            {formatCurrency(contasPagarPlanejado ?? 0)}
          </h2>
        </Card>
      </Col>
    </Row>
  );
}

export default CardsContas;
