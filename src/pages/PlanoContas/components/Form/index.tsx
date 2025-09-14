import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form as AntdForm, Input, Card, Button, Tabs, Select, TabsProps } from "antd";
import { toast } from "react-toastify";
import dayjs, { Dayjs } from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { FormFields } from "src/components";
import useQuery from "src/services/useQuery";
import { PlanoConta } from "src/utils/typings";

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(customParseFormat);

const { useForm, Item } = AntdForm;

interface FormProps {
  id: string | null;
  editing: boolean;
  setShowForm: (show: boolean) => void;
}

function Form({ id, editing, setShowForm }: FormProps) {

  const [form] = useForm();
  const navigate = useNavigate();
  const { saveData, updateData, getDataByCollection } = useQuery();

  const [planosContas, setPlanosContas] = useState<any[]>([]);

  const tipoOptions = [
    { value: "receita", label: "Receita" },
    { value: "despesa", label: "Despesa" },
  ];

  const naturezaOptions = [
    { value: "analitica", label: "Analítica (aceita lançamento)" },
    { value: "sintetica", label: "Sintética (agrupadora, não aceita)" },
  ];

  async function getPlanosContas() {
    const data = await getDataByCollection<PlanoConta>("planosContas");
    setPlanosContas(data);

    if (id && !editing) {
      const parent: any = data?.find(item => item.id === id);
      const accountType = parent?.tipoConta;
      form.setFieldValue("tipoConta", accountType);
    }

    if (id && editing) {
      const parent: any = data?.find(item => item.id === id);
      const dataCadastro = parent.dataCadastro ? dayjs(parent.dataCadastro, "DD/MM/YYYY") : dayjs();
      form.setFieldsValue({ ...parent, dataCadastro });
    }
  }

  function getLevel() {
    if (!id) {
      return 1;
    }
    const parent = planosContas.find(item => item.id === id);
    const level = parent.nivel + 1;
    return level;
  }

  function getClassification() {
    if (!id) {
      const level1Plans = planosContas.filter(item => item.nivel === 1);
      if (level1Plans?.length === 0) {
        return "01";
      }
      const classifications = level1Plans
        .map(item => Number(item.classificacao))
        .sort((a, b) => b - a);
      const classification = classifications[0] + 1;
      return `0${classification}`;
    }
    const parent = planosContas.find(item => item.id === id);
    const parentClassification = parent.classificacao;
    const children = planosContas.filter(item => item.referencialId === id);
    if (children.length === 0) {
      return `${parentClassification}.001`;
    }
    const classifications = children.map(item => item.classificacao).sort((a, b) => b.localeCompare(a));
    const last = classifications[0];
    const lastSplit = last.split(".");
    const siblingClassification = Number(lastSplit[lastSplit.length - 1]);
    const classification = siblingClassification + 1;
    return `${parentClassification}.00${classification}`;
  }

  function formatData(values: any) {
    values.referencialId = id;
    values.dataCadastro = (values.dataCadastro as Dayjs).format("DD/MM/YYYY");
    values.ativo = values.ativo === undefined ? true : values.ativo;
    const arr = Object.entries(values);
    const cleared = arr.filter(([_, value]) => value !== undefined && value !== null);
    const obj = Object.fromEntries(cleared);
    const level = getLevel();
    const classification = getClassification();
    return { ...obj, nivel: level, classificacao: classification }
  }

  async function handleCreate(values: any) {
    const data = formatData(values);
    const result = await saveData(data, "planosContas");
    if (result) {
      toast.success("Plano de Contas salvo com sucesso");
      handleBack();
    }
  }

  async function handleSave(values: any) {
    values.dataCadastro = (values.dataCadastro as Dayjs).format("DD/MM/YYYY");
    const result = await updateData(id!, values, "planosContas");
    if (result) {
      toast.success("Plano de Contas salvo com sucesso");
      handleBack();
    }
  }

  function handleBack() {
    setShowForm(false);
    navigate("/plano-contas");
  }

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Dados da Conta",
      forceRender: true,
      children: (
        <>
          <Item
            label="Descrição"
            name="descricao"
            rules={[{ required: true, message: "Descrição é obrigatório" }]}
            style={inputStyle}
          >
            <Input size="large" placeholder="Descrição" />
          </Item>

          <Item
            label="Natureza"
            name="natureza"
            rules={[{ required: true, message: "Natureza é obrigatório" }]}
            style={inputStyle}
          >
            <Select
              allowClear
              options={naturezaOptions}
              size="large"
              placeholder="Natureza"
            />
          </Item>

          <Item
            label="Tipo de Conta"
            name="tipoConta"
            rules={[{ required: true, message: "Tipo de Conta é obrigatório" }]}
            style={inputStyle}
          >
            <Select
              allowClear
              options={tipoOptions}
              disabled={!!id}
              size="large"
              placeholder="Tipo"
            />
          </Item>
        </>
      ),
    },
    {
      key: "2",
      label: "Histórico",
      forceRender: true,
      children: <FormFields form={form} />,
    },
  ];

  useEffect(() => {
    getPlanosContas();
  }, [editing]);

  return (
    <Card style={{ maxWidth: 500 }}>
      <AntdForm
        form={form}
        layout="vertical"
        onFinish={editing ? handleSave : handleCreate}
        style={{ display: "flex", flexDirection: "column", gap: 8 }}
      >
        <Tabs type="card" items={items} />

        <div style={actionsStyle}>
          <Button type="primary" danger onClick={handleBack}>Voltar</Button>
          <Button type="primary" htmlType="submit">Salvar</Button>
        </div>
      </AntdForm>
    </Card>
  );
}

const actionsStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 8,
  marginTop: 8,
}

const inputStyle = {
  marginBottom: 8,
}

export default Form;
