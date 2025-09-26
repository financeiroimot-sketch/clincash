import { useState } from "react";
import { Modal, Input, DatePicker, Upload, Button, Form } from "antd";
import type { GetProp, UploadProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { CurrencyInput } from "react-currency-mask";
import { toast } from "react-toastify";
import { Dayjs } from "dayjs";
import useQuery from "src/services/useQuery";
import { CollectionName, Conta } from "src/utils/typings";

const { useForm, Item } = Form;

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

interface InformarPagamentoProps {
  id: string;
  open: boolean;
  collection: CollectionName;
  handleClose: () => void;
  updateAccount: (id: string, conta: Conta) => void;
}

function InformarPagamento({
  id,
  open,
  collection,
  handleClose,
  updateAccount,
}: InformarPagamentoProps) {

  const [form] = useForm();

  const { updateData } = useQuery();

  const [comprovante, setComprovante] = useState<string>("");
  const [nomeComprovante, setNomeComprovante] = useState<string>("");
  const [isDataRequired, setIsDataRequired] = useState<boolean>(false);
  const [isValorRequired, setIsValorRequired] = useState<boolean>(false);

  function handleCancel() {
    form.resetFields();
    setIsDataRequired(false);
    setIsValorRequired(false);
    setNomeComprovante("");
    setComprovante("");
    handleClose();
  }

  function getStatusPagamento(values: any) {
    if (values.dataPagamento && values.valorPagamento) {
      return "pago";
    }
    return "emAberto";
  }

  function formatData(values: any) {
    values.dataPagamento = values.dataPagamento ? (values.dataPagamento as Dayjs).format("DD/MM/YYYY") : undefined;
    values.statusPagamento = getStatusPagamento(values);
    const arr = Object.entries(values);
    const cleared = arr.filter(([_, value]) => value !== undefined);
    return Object.fromEntries(cleared);
  }

  async function handleUpdate(values: any) {
    const data = formatData(values);
    const body = { ...data, comprovante, nomeComprovante }
    const result = await updateData(id, body, collection);
    if (result) {
      toast.success("Pagamento registrado com sucesso");
      handleCancel();
      updateAccount(id, body as Conta);
      return;
    }
    toast.error("Erro ao registrar o pagamento");
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
    return false;
  }

  return (
    <Modal
      open={open}
      footer={null}
      onCancel={handleCancel}
      title="Informar Pagamento"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleUpdate}
      >
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
            maxCount={1}
            beforeUpload={handleUploadChange}
          >
            <Button icon={<UploadOutlined />}>Enviar Comprovante</Button>
          </Upload>
        </Item>

        <div style={{ display: "flex", marginTop: 8, gap: 8, justifyContent: "flex-end" }}>
          <Button onClick={handleCancel}>Cancelar</Button>
          <Button type="primary" htmlType="submit">Finalizar</Button>
        </div>
      </Form>
    </Modal>
  );
}

const inputStyle = {
  marginBottom: 8,
}

export default InformarPagamento;
