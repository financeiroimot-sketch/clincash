import { ReactNode, useState } from "react";
import {
  Button,
  Select,
  DatePicker,
  Row,
  Col,
  Card,
  Space,
  Tag,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  UpOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { Option, ContasFilter } from "src/utils/typings";
import moment from "moment";

const { RangePicker } = DatePicker;

const statusPagamentoOptions = [
  { value: "pago", label: "Pago" },
  { value: "emAberto", label: "Em Aberto" },
];

const statusVencimentoOptions = [
  { value: "Vence Hoje", label: "Vence Hoje" },
  { value: "Vencido", label: "Vencido" },
  { value: "Vence Essa Semana", label: "Vence Essa Semana" },
  { value: "A Vencer", label: "A Vencer" },
];

interface FiltersContasProps {
  planosOptions: Option[];
  pessoasOptions: Option[];
  exportButton?: ReactNode;
  submit: (args: ContasFilter | undefined) => void;
}

function FiltersContas({
  planosOptions,
  pessoasOptions,
  exportButton,
  submit,
}: FiltersContasProps) {
  const [filters, setFilters] = useState<ContasFilter>();
  const [expanded, setExpanded] = useState(true);

  const [appliedTags, setAppliedTags] = useState<
    { key: string; label: string }[]
  >([]);

  function handleSetDatesVencimento(dates: any) {
    if (!dates) {
      setFilters((prev) => ({
        ...prev,
        dataVencimentoInicial: undefined,
        dataVencimentoFinal: undefined,
      }));
      return;
    }
    const [startDate, endDate] = dates;
    const start = moment(startDate).format("DD/MM/YYYY");
    const end = moment(endDate).format("DD/MM/YYYY");
    setFilters((prev) => ({
      ...prev,
      dataVencimentoInicial: start,
      dataVencimentoFinal: end,
    }));
  }

  function handleSetDatesPagamento(dates: any) {
    if (!dates) {
      setFilters((prev) => ({
        ...prev,
        dataPagamentoInicial: undefined,
        dataPagamentoFinal: undefined,
      }));
      return;
    }
    const [startDate, endDate] = dates;
    const start = moment(startDate).format("DD/MM/YYYY");
    const end = moment(endDate).format("DD/MM/YYYY");
    setFilters((prev) => ({
      ...prev,
      dataPagamentoInicial: start,
      dataPagamentoFinal: end,
    }));
  }

  function aplicarFiltros() {
    const tags: { key: string; label: string }[] = [];

    if (filters?.statusVencimento?.length) {
      tags.push({
        key: "statusVencimento",
        label: `Status Venc.: ${filters.statusVencimento.join(", ")}`,
      });
    }

    if (filters?.statusPagamento?.length) {
      tags.push({
        key: "statusPagamento",
        label: `Status Pag.: ${filters.statusPagamento.join(", ")}`,
      });
    }

    if (filters?.razaoSocialDescricao?.length) {
      tags.push({
        key: "razaoSocial",
        label: `Razão Social: ${filters.razaoSocialDescricao.join(", ")}`,
      });
    }

    if (filters?.planoContasDescricao?.length) {
      tags.push({
        key: "planoContas",
        label: `Plano: ${filters.planoContasDescricao.join(", ")}`,
      });
    }

    if (filters?.dataVencimentoInicial && filters?.dataVencimentoFinal) {
      tags.push({
        key: "periodoVencimento",
        label: `Vencimento: ${filters.dataVencimentoInicial} → ${filters.dataVencimentoFinal}`,
      });
    }

    if (filters?.dataPagamentoInicial && filters?.dataPagamentoFinal) {
      tags.push({
        key: "periodoPagamento",
        label: `Pagamento: ${filters.dataPagamentoInicial} → ${filters.dataPagamentoFinal}`,
      });
    }

    setAppliedTags(tags);
    submit(filters);
  }

  function removerTag(key: string) {
    setAppliedTags((prev) => prev.filter((tag) => tag.key !== key));

    setFilters((prev) => {
      if (!prev) return prev;
      const novo = { ...prev };
      if (key === "statusVencimento") novo.statusVencimento = [];
      if (key === "statusPagamento") novo.statusPagamento = [];
      if (key === "razaoSocial") novo.razaoSocialDescricao = [];
      if (key === "planoContas") novo.planoContasDescricao = [];
      if (key === "periodoVencimento") {
        novo.dataVencimentoInicial = undefined;
        novo.dataVencimentoFinal = undefined;
      }
      if (key === "periodoPagamento") {
        novo.dataPagamentoInicial = undefined;
        novo.dataPagamentoFinal = undefined;
      }
      return novo;
    });
  }

  function limparFiltros() {
    setFilters({});
    setAppliedTags([]);
  }

  return (
    <Card
      title="Filtros"
      extra={
        <Button
          type="link"
          icon={expanded ? <UpOutlined /> : <DownOutlined />}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Recolher" : "Expandir"}
        </Button>
      }
      style={{ borderRadius: 10, marginBottom: 8 }}
    >
      {expanded && (
        <>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Select
                allowClear
                mode="multiple"
                options={statusVencimentoOptions}
                placeholder="Status de Vencimento"
                size="large"
                value={filters?.statusVencimento}
                onChange={(value) =>
                  setFilters((prev) => ({ ...prev, statusVencimento: value }))
                }
                style={{ width: "100%" }}
              />
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Select
                allowClear
                mode="multiple"
                options={statusPagamentoOptions}
                placeholder="Status de Pagamento"
                size="large"
                value={filters?.statusPagamento}
                onChange={(value) =>
                  setFilters((prev) => ({ ...prev, statusPagamento: value }))
                }
                style={{ width: "100%" }}
              />
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Select
                allowClear
                mode="multiple"
                options={pessoasOptions}
                placeholder="Razão Social"
                size="large"
                value={filters?.razaoSocialDescricao}
                onChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    razaoSocialDescricao: value,
                  }))
                }
                style={{ width: "100%" }}
              />
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Select
                allowClear
                mode="multiple"
                options={planosOptions}
                placeholder="Plano de Contas"
                size="large"
                value={filters?.planoContasDescricao}
                onChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    planoContasDescricao: value,
                  }))
                }
                style={{ width: "100%" }}
              />
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col xs={24} sm={12} md={8}>
              <RangePicker
                allowClear
                size="large"
                format="DD/MM/YYYY"
                placeholder={["Vencimento Inicial", "Vencimento Final"]}
                onChange={handleSetDatesVencimento}
                style={{ width: "100%" }}
              />
            </Col>

            <Col xs={24} sm={12} md={8}>
              <RangePicker
                allowClear
                size="large"
                format="DD/MM/YYYY"
                placeholder={["Pagamento Inicial", "Pagamento Final"]}
                onChange={handleSetDatesPagamento}
                style={{ width: "100%" }}
              />
            </Col>

            <Col xs={24} sm={24} md={8}>
              <Space style={{ float: "right", gap: 6 }}>
                <Button onClick={limparFiltros} icon={<ReloadOutlined />} size="large">
                  Limpar
                </Button>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  size="large"
                  onClick={aplicarFiltros}
                >
                  Aplicar Filtros
                </Button>
                {exportButton}
              </Space>
            </Col>
          </Row>

          {appliedTags.length > 0 && (
            <Row style={{ marginTop: 16 }}>
              <Col span={24}>
                <Space wrap>
                  {appliedTags.map((tag) => (
                    <Tag
                      key={tag.key}
                      closable
                      onClose={() => removerTag(tag.key)}
                      color="blue"
                    >
                      {tag.label}
                    </Tag>
                  ))}
                </Space>
              </Col>
            </Row>
          )}
        </>
      )}
    </Card>
  );
}

export default FiltersContas;
