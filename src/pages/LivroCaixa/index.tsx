import { useEffect, useState } from "react";
import { Card, Button, Tooltip } from "antd";
import { LockOutlined, UnlockOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { Table, Layout } from "src/components";
import useQuery from "src/services/useQuery";
import { Conta, Pessoa, Coluna, PlanoConta, Option } from "src/utils/typings";
import getColumns from "./columns";

function Empresas() {

  const { getDataByCollection, updateData, saveData, getUser } = useQuery();

  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [contas, setContas] = useState<Conta[]>([]);
  const [contasFilter, setContasFilter] = useState<Conta[]>([]);
  const [pessoasOptions, setPessoasOptions] = useState<Option[]>([]);
  const [planosOptions, setPlanosOptions] = useState<Option[]>([]);
  const [editedIds, setEditedIds] = useState<string[]>([]);
  const [colunasAtivas, setColunasAtivas] = useState<Coluna[]>([]);

  function getPermissaoLivroCaixa() {
    const permissao = sessionStorage.getItem("clin-cash-permissao");
    setCanEdit(permissao === "livro-caixa");
  }

  async function getPessoas() {
    const data = await getDataByCollection<Pessoa>("pessoas");
    const dataOrdered = data?.sort((a, b) => a.razaoSocial.localeCompare(b.razaoSocial));
    const options = dataOrdered?.map(item => ({ value: item.id, label: item.razaoSocial }));
    setPessoasOptions(options);
  }

  async function getPlanosContas() {
    const data = await getDataByCollection<PlanoConta>("planosContas");
    const dataFiltered = data?.filter(item => item?.tipoConta === "despesa");
    const dataOrdered = dataFiltered?.sort((a, b) => a.classificacao.localeCompare(b?.classificacao));
    const options = dataOrdered?.map(item => (
      {
        disabled: item.natureza === "sintetica",
        value: item.id,
        label: `${item.classificacao} ${item.descricao} (${item.natureza === "analitica" ? "A" : "S"})`,
      }
    ));
    setPlanosOptions(options);
  }

  async function getData() {
    const usuario = await getUser();
    setColunasAtivas(usuario.colunasLivroCaixa);

    const [contasPagar, contasReceber, planosContas, pessoas] = await Promise.all([
      getDataByCollection<Conta>("contasPagar"),
      getDataByCollection<Conta>("contasReceber"),
      getDataByCollection<PlanoConta>("planosContas"),
      getDataByCollection<Pessoa>("pessoas"),
    ]);
    const tipoContaPagar = contasPagar?.map(item => ({ ...item, tipoConta: "contasPagar", editing: false }));
    const tipoContaReceber = contasReceber?.map(item => ({ ...item, tipoConta: "contasReceber", editing: false }));
    const data = [...tipoContaPagar as Conta[], ...tipoContaReceber as Conta[]]
      ?.filter(item => item.statusPagamento === "pago")
      ?.map(item => {
        const planoContas = planosContas?.find(plano => plano.id === item?.planoContasId);
        const pessoa = pessoas?.find(pessoas => pessoas.id === item?.razaoSocial);
        const planoContasDescricao = planoContas?.descricao;
        const razaoSocialDescricao = pessoa?.razaoSocial;
        return { ...item, planoContasDescricao, razaoSocialDescricao }
      });
    setContas(data as Conta[]);
    setContasFilter(data as Conta[]);
  }

  function handleSearch(search: string, key: string) {
    const data = contas.filter(item => item[key]?.toLowerCase().includes(search.toLowerCase()));
    setContasFilter(search ? data : contas);
  }

  async function handleUpdate() {
    await Promise.all(
      editedIds.map(id => {
        const conta = contas.find(conta => conta.id === id);
        return updateData(id, conta, conta?.tipoConta!);
      })
    );
  }

  async function handleSave() {
    const conta = contas.find(conta => conta.isNew);
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

  function formatCurrency(value: number) {
    return value.toLocaleString("pt-br", { style: "currency", currency: "BRL" });
  }

  function reset() {
    setContasFilter(contas);
  }

  function handleCheckColumn(columnName: string) {
    const column = colunasAtivas.find(item => item.coluna === columnName);
    return column ? !column.ativo : true;
  }

  useEffect(() => {
    getPermissaoLivroCaixa();
    getPessoas();
    getPlanosContas();
    getData();
  }, []);

  return (
    <Layout>
      {canEdit && (
        <Card style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
          <Tooltip title={isEditing ? "Finalizar edição" : "Editar"}>
            <Button
              type="primary"
              shape="circle"
              size="large"
              onClick={handleSetEditing}
              icon={isEditing
                ? <UnlockOutlined style={{ fontSize: 22 }} />
                : <LockOutlined style={{ fontSize: 22 }} />
              }
            />
          </Tooltip>
        </Card>
      )}
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
