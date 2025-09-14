import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form as AntdForm, Input, Card, Button, DatePicker, Select, Tabs, Upload } from "antd";
import type { TabsProps, GetProp, UploadProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { CurrencyInput } from "react-currency-mask";
import { toast } from "react-toastify";
import dayjs, { Dayjs } from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { FormFields } from "src/components";
import useQuery from "src/services/useQuery";
import { Pessoa, PlanoConta } from "src/utils/typings";

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(customParseFormat);

const { useForm, Item } = AntdForm;

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

interface FormProps {
  id: string | null;
  setShowForm: (show: boolean) => void;
}

function Form({ id, setShowForm }: FormProps) {

  const [form] = useForm();
  const navigate = useNavigate();
  const { getDataById, saveData, updateData, getDataByCollection } = useQuery();

  const [pessoas, setPessoas] = useState<any>([]);
  const [pessoasOptions, setPessoasOptions] = useState<any>([]);
  const [planosOptions, setPlanosOptions] = useState<any>([]);
  const [fileList, setFileList] = useState<any[]>([]);
  const [comprovante, setComprovante] = useState<string>("");
  const [nomeComprovante, setNomeComprovante] = useState<string>("");
  const [isDataRequired, setIsDataRequired] = useState<boolean>(false);
  const [isValorRequired, setIsValorRequired] = useState<boolean>(false);

  async function getPessoas() {
    const data = await getDataByCollection<Pessoa>("pessoas");
    const dataOrdered = data?.sort((a, b) => a.razaoSocial.localeCompare(b.razaoSocial));
    if (id) {
      const options = dataOrdered?.map(item => ({ value: item.id, label: item.razaoSocial }));
      setPessoasOptions(options);
    }
    setPessoas(dataOrdered);
  }

  async function getPlanosContas() {
    const data = await getDataByCollection<PlanoConta>("planosContas");
    const dataFiltered = data?.filter(item => item?.tipoConta === "despesa");
    const dataOrdered = dataFiltered?.sort((a, b) => a.classificacao.localeCompare(b.classificacao));
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
    const data: any = await getDataById(id!, "contasPagar");
    if (data) {
      const dataCadastro = data.dataCadastro ? dayjs(data.dataCadastro, "DD/MM/YYYY") : dayjs();
      const dataVencimento = data.dataVencimento ? dayjs(data.dataVencimento, "DD/MM/YYYY") : dayjs();
      const dataPagamento = data.dataPagamento ? dayjs(data.dataPagamento, "DD/MM/YYYY") : null;
      if (data.comprovante && data.nomeComprovante) {
        base64ToFile(data.comprovante, data.nomeComprovante);
      }
      form.setFieldsValue({ ...data, dataCadastro, dataVencimento, dataPagamento });
    }
  }

  function getStatusPagamento(values: any) {
    if (values.dataPagamento && values.valorPagamento) {
      return "pago";
    }
    return "emAberto";
  }

  function formatData(values: any) {
    values.dataCadastro = (values.dataCadastro as Dayjs).format("DD/MM/YYYY");
    values.dataVencimento = values.dataVencimento ? (values.dataVencimento as Dayjs).format("DD/MM/YYYY") : undefined;
    values.dataPagamento = values.dataPagamento ? (values.dataPagamento as Dayjs).format("DD/MM/YYYY") : undefined;
    values.ativo = values.ativo === undefined ? true : values.ativo;
    values.statusPagamento = getStatusPagamento(values);
    const arr = Object.entries(values);
    const cleared = arr.filter(([_, value]) => value !== undefined);
    return Object.fromEntries(cleared);
  }

  async function handleSave(values: any) {
    const data = formatData(values);
    const result = await updateData(id!, { ...data, comprovante, nomeComprovante }, "contasPagar");
    if (result) {
      toast.success("Conta salva com sucesso");
      handleBack();
    }
  }

  async function handleCreate(values: any) {
    const data = formatData(values);
    const result = await saveData({ ...data, comprovante, nomeComprovante }, "contasPagar");
    if (result) {
      toast.success("Conta salva com sucesso");
      handleBack();
    }
  }

  function base64ToFile(base64: string, filename: string) {
    setComprovante(base64);
    setNomeComprovante(filename);
    const [header, data] = base64.split(",");
    const mime = header?.match(/:(.*?);/)?.[1];
    const binary = atob(data);
    const array: any = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    const blob = new Blob([new Uint8Array(array)], { type: mime });
    const file = new File([blob], filename, { type: blob.type });
    const fileObj = {
      uid: "-1",
      name: filename,
      status: "done",
      url: URL.createObjectURL(file),
    }
    setFileList([fileObj]);
  }

  function getBase64(file: FileType): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  async function handleUploadChange(file: FileType) {
    const fileBase64 = await getBase64(file as FileType);
    setComprovante(fileBase64);
    setNomeComprovante(file.name);
    base64ToFile(fileBase64, file.name);
    return false;
  }

  function handleSetPlanoContas(pessoaId: string) {
    const pessoa = pessoas.find(item => item.id === pessoaId);
    const planoContasId = pessoa?.planoContasId;
    if (planosOptions.some(item => item.value === planoContasId)) {
      form.setFieldValue("planoContasId", planoContasId);
      return;
    }
    form.setFieldValue("planoContasId", undefined);
  }

  function handleSearch(search: string) {
    if (search.length >= 3) {
      const options = pessoas?.map((item: any) => ({ value: item.id, label: item.razaoSocial }));
      setPessoasOptions(options);
      return;
    }
    setPessoasOptions([]);
  }

  function getMimeType() {
    const extension = nomeComprovante.split(".").at(-1);
    if (extension === "jpg" || extension === "jpeg") {
      return "image/jpeg";
    }
    if (extension === "png") {
      return "image/png";
    }
    return "application/pdf";
  }

  function handleOpenComprovante() {
    const base64 = comprovante.split(";base64,")[1];
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: getMimeType() });
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, "_blank");
  }

  function handleBack() {
    setShowForm(false);
    navigate("/contas-pagar");
  }

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Dados da Conta",
      forceRender: true,
      children: (
        <>
          <Item
            label="Razão Social"
            name="razaoSocial"
            rules={[{ required: true, message: "Razão Social é obrigatório" }]}
            style={inputStyle}
          >
            <Select
              allowClear
              showSearch
              size="large"
              onChange={handleSetPlanoContas}
              onSearch={handleSearch}
              options={pessoasOptions}
              placeholder="Razão Social"
              optionFilterProp="label"
            />
          </Item>

          <Item
            label="Plano de Contas"
            name="planoContasId"
            style={inputStyle}
          >
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              options={planosOptions}
              size="large"
              placeholder="Plano de Contas"
            />
          </Item>

          <Item
            label="Valor"
            name="valor"
            style={inputStyle}
          >
            <CurrencyInput
              InputElement={
                <Input
                  placeholder="Valor"
                  size="large"
                  inputMode="numeric"
                />
              }
              max={9999999999}
              onChangeValue={(_, value) => {
                form.setFieldValue("valor", value);
              }}
            />
          </Item>

          <Item
            label="Data de Vencimento"
            name="dataVencimento"
            style={inputStyle}
          >
            <DatePicker
              style={{ width: "100%" }}
              size="large"
              placeholder="Data de Vencimento"
              format="DD/MM/YYYY"
            />
          </Item>
        </>
      ),
    },
    {
      key: "2",
      label: "Informações de Pagamento",
      forceRender: true,
      children: (
        <>
          <Item
            label="Valor do Pagamento"
            name="valorPagamento"
            style={inputStyle}
            rules={[
              { required: isValorRequired, message: "Valor do Pagamento é obrigatório" }
            ]}
          >
            <CurrencyInput
              InputElement={
                <Input
                  placeholder="Valor do Pagamento"
                  size="large"
                  inputMode="numeric"
                />
              }
              max={9999999999}
              onChangeValue={(_, value) => {
                if (value === 0) {
                  setIsDataRequired(false);
                  setIsValorRequired(false);
                  form.setFieldValue("dataPagamento", null);
                  form.setFieldValue("valorPagamento", null);
                  return;
                }
                setIsDataRequired(true);
                form.setFieldValue("valorPagamento", value);
              }}
            />
          </Item>

          <Item
            label="Data de Pagamento"
            name="dataPagamento"
            style={inputStyle}
            rules={[
              { required: isDataRequired, message: "Data de Pagamento é obrigatório" }
            ]}
          >
            <DatePicker
              style={{ width: "100%" }}
              size="large"
              placeholder="Data de Pagamento"
              format="DD/MM/YYYY"
              onChange={(value) => {
                if (value === null) {
                  setIsDataRequired(false);
                  setIsValorRequired(false);
                  form.setFieldValue("valorPagamento", null);
                  return;
                }
                setIsValorRequired(true);
              }}
            />
          </Item>

          <Item
            label="Comprovante"
            name="comprovante"
            style={inputStyle}
          >
            <Upload
              accept=".pdf, .jpg, .jpeg, .png"
              maxCount={1}
              fileList={fileList}
              beforeUpload={handleUploadChange}
            >
              <Button icon={<UploadOutlined />}>Enviar Comprovante</Button>
            </Upload>
          </Item>
        </>
      ),
    },
    {
      key: "3",
      label: "Histórico",
      forceRender: true,
      children: <FormFields form={form} />,
    },
  ];

  useEffect(() => {
    getPessoas();
    getPlanosContas();
    if (id) {
      getData();
    }
  }, []);

  return (
    <Card style={{ maxWidth: 500 }}>
      <AntdForm
        form={form}
        layout="vertical"
        onFinish={id ? handleSave : handleCreate}
      >
        <Tabs type="card" items={items} />
        <div style={actionsStyle}>
          {comprovante && <Button onClick={handleOpenComprovante}>Ver Comprovante</Button>}
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
