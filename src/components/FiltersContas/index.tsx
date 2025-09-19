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
  Flex,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  UpOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { Option, ContasFilter } from "src/utils/typings";
import dayjs from "dayjs";

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
  subtitle: string;
  planosOptions: Option[];
  pessoasOptions: Option[];
  exportButton?: ReactNode;
  defaultFilters?: ContasFilter;
  submit: (args: ContasFilter | undefined) => void;
}

function FiltersContas({
  subtitle,
  planosOptions,
  pessoasOptions,
  exportButton,
  defaultFilters,
  submit,
}: FiltersContasProps) {

  const [filters, setFilters] = useState<ContasFilter | undefined>(defaultFilters);
  const [expanded, setExpanded] = useState(true);

  const [appliedTags, setAppliedTags] = useState<{ key: string; label: string }[]>([]);

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

    setFilters((prev) => ({
      ...prev,
      dataVencimentoInicial: startDate ? dayjs(startDate).format("DD/MM/YYYY") : undefined,
      dataVencimentoFinal: endDate ? dayjs(endDate).format("DD/MM/YYYY") : undefined,
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

    setFilters((prev) => ({
      ...prev,
      dataPagamentoInicial: startDate ? dayjs(startDate).format("DD/MM/YYYY") : undefined,
      dataPagamentoFinal: endDate ? dayjs(endDate).format("DD/MM/YYYY") : undefined,
    }));
  }

  function applyFilters() {
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
    setFilters(undefined);
    setAppliedTags([]);
  }

  return (
    <Card style={{ borderRadius: 10, marginBottom: 8 }}>
      <Flex justify="space-between" align="center" style={{ marginBottom: expanded ? 20 : 0 }}>
        <p style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Filtros - {subtitle}</p>
        <Button
          type="link"
          icon={expanded ? <UpOutlined /> : <DownOutlined />}
          onClick={() => setExpanded(!expanded)}
          size="large"
        >
          {expanded ? "Recolher" : "Expandir"}
        </Button>
      </Flex>

      {expanded ? (
        <>
          <Row gutter={[8, 8]}>
            <Col xs={24} sm={12} md={6}>
              <Select
                allowClear
                mode="multiple"
                options={statusVencimentoOptions}
                placeholder="Status de Vencimento"
                size="large"
                maxTagCount={0}
                maxTagPlaceholder={() =>
                  `Status de Vencimento (${filters?.statusVencimento?.length || 0})`
                }
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
                maxTagCount={0}
                maxTagPlaceholder={() =>
                  `Status de Pagamento (${filters?.statusPagamento?.length || 0})`
                }
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
                maxTagCount={0}
                maxTagPlaceholder={() =>
                  `Razão Social (${filters?.razaoSocialDescricao?.length || 0})`
                }
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
                maxTagCount={0}
                maxTagPlaceholder={() =>
                  `Plano de Contas (${filters?.planoContasDescricao?.length || 0})`
                }
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

          <Row gutter={[8, 8]} style={{ marginTop: 16 }}>
            <Col xs={24} sm={12} md={8}>
              <RangePicker
                allowClear
                size="large"
                format="DD/MM/YYYY"
                placeholder={["Vencimento Inicial", "Vencimento Final"]}
                value={
                  filters?.dataVencimentoInicial && filters?.dataVencimentoFinal
                    ? [dayjs(filters.dataVencimentoInicial, "DD/MM/YYYY"), dayjs(filters.dataVencimentoFinal, "DD/MM/YYYY")]
                    : null
                }
                onChange={handleSetDatesVencimento}
                style={{ width: "100%" }}
              />
            </Col>

            <Col xs={24} sm={12} md={7}>
              <RangePicker
                allowClear
                size="large"
                format="DD/MM/YYYY"
                placeholder={["Pagamento Inicial", "Pagamento Final"]}
                value={
                  filters?.dataPagamentoInicial && filters?.dataPagamentoFinal
                    ? [dayjs(filters.dataPagamentoInicial, "DD/MM/YYYY"), dayjs(filters.dataPagamentoFinal, "DD/MM/YYYY")]
                    : null
                }
                onChange={handleSetDatesPagamento}
                style={{ width: "100%" }}
              />
            </Col>

            <Col xs={24} sm={24} md={3}>
              <Button
                onClick={limparFiltros}
                icon={<ReloadOutlined />}
                size="large"
                style={{ width: "100%" }}
              >
                Limpar
              </Button>
            </Col>

            <Col xs={24} sm={24} md={3}>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                size="large"
                onClick={applyFilters}
                style={{ width: "100%" }}
              >
                Buscar
              </Button>
            </Col>

            <Col xs={24} sm={24} md={3}>
              {exportButton}
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
      ) : appliedTags.length > 0 && (
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
    </Card>
  );
}

export default FiltersContas;
