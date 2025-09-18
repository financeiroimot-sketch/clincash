import { useState } from "react";
import { Button, Select, DatePicker } from "antd";
import { SearchOutlined } from "@ant-design/icons";
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

interface FiltersProps {
  planosOptions: Option[];
  pessoasOptions: Option[];
  submit: (args: ContasFilter | undefined) => void;
}

function Filters({
  planosOptions,
  pessoasOptions,
  submit,
}: FiltersProps) {

  const [filters, setFilters] = useState<ContasFilter>();

  function handleSetDatesVencimento(dates: any) {
    const [startDate, endDate] = dates;
    const start = moment(new Date(startDate)).format("DD/MM/YYYY");
    const end = moment(new Date(endDate)).format("DD/MM/YYYY");
    setFilters(prevState => ({ ...prevState, dataVencimentoInicial: start }));
    setFilters(prevState => ({ ...prevState, dataVencimentoFinal: end }));
  }

  function handleSetDatesPagamento(dates: any) {
    const [startDate, endDate] = dates;
    const start = moment(new Date(startDate)).format("DD/MM/YYYY");
    const end = moment(new Date(endDate)).format("DD/MM/YYYY");
    setFilters(prevState => ({ ...prevState, dataPagamentoInicial: start }));
    setFilters(prevState => ({ ...prevState, dataPagamentoFinal: end }));
  }

  return (
    <>
      <Select
        allowClear
        options={statusVencimentoOptions}
        placeholder="Status de Vencimento"
        size="large"
        onChange={value => setFilters(prevState => ({ ...prevState, statusVencimento: value }))}
        style={{ width: 195, marginRight: 6 }}
      />

      <Select
        allowClear
        options={statusPagamentoOptions}
        placeholder="Status de Pagamento"
        size="large"
        onChange={value => setFilters(prevState => ({ ...prevState, statusPagamento: value }))}
        style={{ width: 195, marginRight: 6 }}
      />

      <Select
        allowClear
        mode="multiple"
        options={pessoasOptions}
        placeholder="Razão Social"
        size="large"
        onChange={value => setFilters(prevState => ({ ...prevState, razaoSocialDescricao: value }))}
        style={{ width: 210, marginRight: 6 }}
      />

      <Select
        allowClear
        mode="multiple"
        options={planosOptions}
        placeholder="Plano de Contas"
        size="large"
        onChange={value => setFilters(prevState => ({ ...prevState, planoContasDescricao: value }))}
        style={{ width: 210, marginRight: 6 }}
      />

      <RangePicker
        allowClear
        size="large"
        format="DD/MM/YYYY"
        placeholder={["Vencimento Inicial", "Vencimento Final"]}
        onChange={handleSetDatesVencimento}
        style={{ width: 250, marginRight: 6 }}
      />

      <RangePicker
        allowClear
        size="large"
        format="DD/MM/YYYY"
        placeholder={["Pagamento Inicial", "Pagamento Final"]}
        onChange={handleSetDatesPagamento}
        style={{ width: 250 }}
      />

      <Button
        type="primary"
        size="large"
        shape="circle"
        onClick={() => submit(filters)}
        icon={<SearchOutlined />}
        style={{ marginLeft: 6, marginRight: 6 }}
      />
    </>
  );
}

export default Filters;
