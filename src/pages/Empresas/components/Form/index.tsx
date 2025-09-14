import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form as AntdForm, Input, Card, Button } from "antd";
import { toast } from "react-toastify";
import dayjs, { Dayjs } from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { FormFields } from "src/components";
import useQuery from "src/services/useQuery";
import { maskCNPJ, unmask } from "src/utils/documentMask";

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(customParseFormat);

const { useForm, Item } = AntdForm;

interface FormProps {
  id: string | null;
  setShowForm: (show: boolean) => void;
}

function Form({ id, setShowForm }: FormProps) {

  const [form] = useForm();
  const navigate = useNavigate();
  const { getDataById, saveData, updateData } = useQuery();

  async function getData() {
    const data: any = await getDataById(id!, "empresas");
    if (data) {
      const dataCadastro = data.dataCadastro ? dayjs(data.dataCadastro, "DD/MM/YYYY") : dayjs();
      form.setFieldsValue({ ...data, dataCadastro });
    }
  }

  function formatData(values: any) {
    values.dataCadastro = (values.dataCadastro as Dayjs).format("DD/MM/YYYY");
    values.ativo = values.ativo === undefined ? true : values.ativo;
    const arr = Object.entries(values);
    const cleared = arr.filter(([_, value]) => value !== undefined);
    return Object.fromEntries(cleared);
  }

  async function handleSave(values: any) {
    const data = formatData(values);
    const result = await updateData(id!, data, "empresas");
    if (result) {
      toast.success("Empresa salva com sucesso");
      handleBack();
    }
  }

  async function handleCreate(values: any) {
    const data = formatData(values);
    const result = await saveData(data, "empresas");
    if (result) {
      toast.success("Empresa salva com sucesso");
      handleBack();
    }
  }

  function onCnpjKeyUp(event: any) {
    if (event.code !== "Backspace") {
      const cnpj = unmask((event.target as HTMLInputElement).value);
      const cnpjMasked = maskCNPJ(cnpj);
      form.setFieldValue("cnpj", cnpjMasked);
    }
  }

  function handleBack() {
    setShowForm(false);
    navigate("/empresas");
  }

  useEffect(() => {
    if (id) {
      getData();
    }
  }, []);

  return (
    <Card>
      <AntdForm
        form={form}
        layout="vertical"
        onFinish={id ? handleSave : handleCreate}
        style={{ display: "flex", flexDirection: "column", gap: 8 }}
      >
        <Item
          label="CNPJ"
          name="cnpj"
          style={inputStyle}
        >
          <Input
            size="large"
            placeholder="CNPJ"
            onKeyUp={onCnpjKeyUp}
          />
        </Item>

        <Item
          label="Razão Social"
          name="razaoSocial"
          style={inputStyle}
        >
          <Input size="large" placeholder="Razão Social" />
        </Item>

        <FormFields form={form} />

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
