import { useState, useRef } from "react";
import { Button, Tooltip, DatePicker, Row, Col } from "antd";
import { ExportOutlined, LockOutlined, SearchOutlined, UnlockOutlined } from "@ant-design/icons";
import styled from "styled-components";
import moment from "moment";
import { Table, Layout, Filter } from "src/components";
import useQuery from "src/services/useQuery";
import { Conta, Pessoa, Coluna, PlanoConta, Option } from "src/utils/typings";
import getColumns from "./columns";
import exportPDF from "src/utils/exportPDFLivroCaixa";
import formatCurrency from "src/utils/formatCurrency";

const { RangePicker } = DatePicker;

function Empresas() {

  const { getDataByCollection, updateData, saveData, getUser } = useQuery();
  const ref = useRef(null);

  const [searched, setSearched] = useState<boolean>(false);
  const [periodoInicio, setPeriodoInicio] = useState<string>();
  const [periodoFim, setPeriodoFim] = useState<string>();
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [contas, setContas] = useState<Conta[]>([]);
  const [contasFilter, setContasFilter] = useState<Conta[]>([]);
  const [pessoasOptions, setPessoasOptions] = useState<Option[]>([]);
  const [planosOptions, setPlanosOptions] = useState<Option[]>([]);
  const [editedIds, setEditedIds] = useState<string[]>([]);
  const [colunasAtivas, setColunasAtivas] = useState<Coluna[]>([]);

  async function getSettings() {
    const usuario = await getUser();
    setCanEdit(usuario?.permissaoLivroCaixa ?? false);
    setColunasAtivas(usuario?.colunasLivroCaixa);
  }

  async function setPessoas(pessoas: Pessoa[]) {
    const ordered = pessoas?.sort((a, b) => a.razaoSocial.localeCompare(b.razaoSocial));
    const options = ordered?.map(item => ({ value: item.id, label: item.razaoSocial }));
    setPessoasOptions(options);
  }

  async function setPlanosContas(planosContas: PlanoConta[]) {
    const filtered = planosContas?.filter(item => item?.tipoConta === "despesa");
    const ordered = filtered?.sort((a, b) => a.classificacao.localeCompare(b?.classificacao));
    const options = ordered?.map(item => (
      {
        disabled: item.natureza === "sintetica",
        value: item.id,
        label: `${item.classificacao} ${item.descricao} (${item.natureza === "analitica" ? "A" : "S"})`,
      }
    ));
    setPlanosOptions(options);
  }

  async function getData() {
    if (periodoInicio && periodoFim) {
      await getSettings();

      const [contasPagar, contasReceber, planosContas, pessoas] = await Promise.all([
        getDataByCollection<Conta>("contasPagar"),
        getDataByCollection<Conta>("contasReceber"),
        getDataByCollection<PlanoConta>("planosContas"),
        getDataByCollection<Pessoa>("pessoas"),
      ]);

      setPessoas(pessoas);
      setPlanosContas(planosContas);

      const inicio = moment(periodoInicio, "DD/MM/YYYY");
      const fim = moment(periodoFim, "DD/MM/YYYY");

      const tipoContaPagar = contasPagar
        .filter(item => moment(item.dataVencimento, "DD/MM/YYYY").isBetween(inicio, fim, undefined, "[]"))
        .map(item => ({ ...item, tipoConta: "contasPagar", editing: false }));

      const tipoContaReceber = contasReceber
        .filter(item => moment(item.dataVencimento, "DD/MM/YYYY").isBetween(inicio, fim, undefined, "[]"))
        .map(item => ({ ...item, tipoConta: "contasReceber", editing: false }));

      const data = [...tipoContaPagar, ...tipoContaReceber]
        .filter(item => item.statusPagamento === "pago")
        .map(item => {
          const planoContas = planosContas.find(plano => plano.id === item?.planoContasId);
          const pessoa = pessoas.find(pessoas => pessoas.id === item?.razaoSocial);
          const planoContasDescricao = planoContas?.descricao;
          const razaoSocialDescricao = pessoa?.razaoSocial;
          return { ...item, planoContasDescricao, razaoSocialDescricao }
        });

      setContas(data as Conta[]);
      setContasFilter(data as Conta[]);
      setSearched(true);
    }
  }

  async function handleUpdate() {
    await Promise.all(
      editedIds.map(id => {
        const conta = contas?.find(conta => conta.id === id);
        return updateData(id, conta, conta?.tipoConta!);
      })
    );
  }

  async function handleSave() {
    const conta = contas?.find(conta => conta.isNew);
    if (conta?.isNew && conta.tipoConta) {
      delete conta?.isNew;
      const response = await saveData(conta, conta?.tipoConta);
      if (response) {
        getData();
      }
    }
  }

  function handleSetEditing() {
    setIsEditing(!isEditing);
    if (isEditing && editedIds.length > 0) {
      handleUpdate();
    }
    if (!isEditing) {
      setContas([...contas, { isNew: true }] as Conta[]);
      setContasFilter([...contas, { isNew: true }] as Conta[]);
      return;
    }
    setContas(prevState => prevState.filter(item => !item.isNew).map(item => ({ ...item, editing: false })));
    setContasFilter(prevState => prevState.filter(item => !item.isNew).map(item => ({ ...item, editing: false })));
  }

  function handleEdit(id: string) {
    const edited = contasFilter?.map(item => ({ ...item, editing: item.id === id }));
    setContas(edited as Conta[]);
    setContasFilter(edited as Conta[]);
  }

  function handleChange(id: string, changes: Partial<Conta>) {
    setEditedIds(prev => Array.from(new Set([...prev, id])));
    const edited = contas?.map(item => {
      if ((item.id === id) || (!id && item.isNew)) {
        return { ...item, ...changes }
      }
      return item;
    });
    setContas(edited as Conta[]);
    setContasFilter(edited as Conta[]);
  }

  function handleGetTotal(values) {
    return values.reduce((acc, item) => {
      if (item.tipoConta === "contasPagar") {
        acc.contasPagar += Number(item.valorPagamento) || 0;
      } else if (item.tipoConta === "contasReceber") {
        acc.contasReceber += Number(item.valorPagamento) || 0;
      }
      return acc;
    }, { contasPagar: 0, contasReceber: 0 });
  }

  function handleSearch(search: string, key: string) {
    const data = contas.filter(item => item[key]?.toLowerCase().includes(search.toLowerCase()));
    setContasFilter(search ? data : contas);
  }

  function reset() {
    setContasFilter(contas);
  }

  function handleCheckColumn(columnName: string) {
    const column = colunasAtivas?.find(item => item.coluna === columnName);
    return column ? !column.ativo : true;
  }

  function handleSetDates(dates: any) {
    const [startDate, endDate] = dates;
    const start = moment(new Date(startDate)).format("DD/MM/YYYY");
    const end = moment(new Date(endDate)).format("DD/MM/YYYY");
    setPeriodoInicio(start);
    setPeriodoFim(end);
  }

  return (
    <Layout>
      <Filter subtitle="Livro Caixa">
        <Row gutter={[8, 8]}>
          <Col xs={24} sm={12} md={8}>
            <RangePicker
              size="large"
              format="DD/MM/YYYY"
              onChange={handleSetDates}
              style={{ width: "100%" }}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              size="large"
              onClick={getData}
              style={{ width: "100%" }}
              disabled={!periodoInicio || !periodoFim}
            >
              Buscar
            </Button>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Tooltip title="Exportar PDF">
              <Button
                size="large"
                onClick={() => exportPDF(
                  ref,
                  "livro-caixa",
                  "Livro Caixa",
                  `${periodoInicio} a ${periodoFim}`
                )}
                icon={<ExportOutlined />}
                disabled={!searched}
                style={{ width: "100%" }}
              >
                Exportar
              </Button>
            </Tooltip>
          </Col>
          {canEdit && (
            <Col xs={24} sm={12} md={3}>
              <Tooltip title={isEditing ? "Finalizar edição" : "Editar"}>
                <Button
                  size="large"
                  onClick={handleSetEditing}
                  disabled={!searched}
                  icon={isEditing
                    ? <UnlockOutlined style={{ fontSize: 22 }} />
                    : <LockOutlined style={{ fontSize: 22 }} />
                  }
                >{isEditing ? "Finalizar edição" : "Editar"}</Button>
              </Tooltip>
            </Col>
          )}
        </Row>
      </Filter>

      {searched && (
        <div ref={ref}>
          <Table
            columns={
              getColumns(
                pessoasOptions,
                planosOptions,
                reset,
                handleSave,
                handleCheckColumn,
                handleChange,
                handleSearch,
              )
            }
            data={contasFilter}
            onRow={(record) => ({
              onClick: () => {
                if (isEditing) {
                  handleEdit(record.id);
                }
              }
            })}
            summary={(pageData) => {
              const { contasPagar, contasReceber } = handleGetTotal(pageData);
              const saldoFinal = contasReceber - contasPagar;
              return (
                <tr>
                  <td colSpan={8}>
                    <TotalContainer>
                      <div>
                        <p><Label color="#3b82f6" /> Crédito Total:</p>
                        <p><Label color="#ef4444" /> Débito Total:</p>
                        <p><Label color="#22c55e" /> Saldo Final:</p>
                      </div>
                      <div>
                        <p>{formatCurrency(contasReceber)}</p>
                        <p>{formatCurrency(contasPagar)}</p>
                        <p>{formatCurrency(saldoFinal)}</p>
                      </div>
                    </TotalContainer>
                  </td>
                </tr>
              );
            }}
          />
        </div>
      )}
    </Layout>
  );
}

const TotalContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;

  p {
    width: 200px;
    font-weight: bold;
    font-size: 16px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
  }
`;

const Label = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

export default Empresas;
