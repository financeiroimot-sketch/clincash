import { BaseSyntheticEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form as AntdForm,
  Input,
  Card,
  Button,
  Select,
  DatePicker,
  Row,
  Col,
  Checkbox,
  Flex,
  Tabs,
  TabsProps,
} from "antd";
import { toast } from "react-toastify";
import dayjs, { Dayjs } from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import customParseFormat from "dayjs/plugin/customParseFormat";
import useQuery from "src/services/useQuery";
import { maskPhone, unmaskPhone } from "src/utils/phoneMask";
import { maskCNPJ, maskCPF, unmask } from "src/utils/documentMask";
import useGetUser from "src/utils/useGetUser";
import { estados } from "src/utils/estados";
import getAddress from "src/services/cep";
import { FormFields } from "src/components";
import { PlanoConta } from "src/utils/typings";

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
  const user = useGetUser();
  const { getDataById, saveData, updateData, getDataByCollection } = useQuery();

  const [planosOptions, setPlanosOptions] = useState<any>([]);

  async function getData() {
    const data: any = await getDataById(id!, "pessoas");
    if (data) {
      const dataCadastro = data.dataCadastro ? dayjs(data.dataCadastro, "DD/MM/YYYY") : dayjs();
      const dataAtualizacao = data.dataAtualizacao ? dayjs(data.dataAtualizacao, "DD/MM/YYYY") : dayjs();
      form.setFieldsValue({ ...data, dataCadastro, dataAtualizacao });
    }
  }

  async function getPlanosContas() {
    const data = await getDataByCollection<PlanoConta>("planosContas");
    const dataOrdered = data.sort((a, b) => a.classificacao.localeCompare(b.classificacao));
    const options = dataOrdered?.map(item => (
      {
        disabled: item.natureza === "sintetica",
        value: item.id,
        label: `${item.classificacao} ${item.descricao} (${item.natureza === "analitica" ? "A" : "S"})`,
      }
    ));
    setPlanosOptions(options);
  }

  function formatData(values: any) {
    values.dataCadastro = (values.dataCadastro as Dayjs).format("DD/MM/YYYY");
    values.dataAtualizacao = values.dataAtualizacao ? (values.dataAtualizacao as Dayjs).format("DD/MM/YYYY") : undefined;
    values.ativo = values.ativo === undefined ? true : values.ativo;
    values.isFornecedor = values.isFornecedor === undefined ? false : values.isFornecedor;
    values.isCliente = values.isCliente === undefined ? false : values.isCliente;
    const arr = Object.entries(values);
    const cleared = arr.filter(([_, value]) => value !== undefined);
    return Object.fromEntries(cleared);
  }

  async function handleSave(values: any) {
    const data = formatData(values);
    const result = await updateData(id!, data, "pessoas");
    if (result) {
      toast.success("Pessoa salva com sucesso");
      handleBack();
    }
  }

  async function handleCreate(values: any) {
    const data = formatData(values);
    const result = await saveData(data, "pessoas");
    if (result) {
      toast.success("Pessoa salva com sucesso");
      handleBack();
    }
  }

  function onPhoneKeyUp(event: any) {
    if (event.code !== "Backspace") {
      const tel = unmaskPhone((event.target as HTMLInputElement).value);
      form.setFieldValue("telefone", maskPhone(tel));
    }
  }

  function onDocumentKeyUp(event: any) {
    if (event.code !== "Backspace") {
      const doc = unmask((event.target as HTMLInputElement).value);
      if (doc.length <= 11) {
        const masked = maskCPF(doc);
        form.setFieldValue("documento", masked);
        return;
      }
      const masked = maskCNPJ(doc);
      form.setFieldValue("documento", masked);
    }
  }

  async function onChangeCep(e: BaseSyntheticEvent) {
    const cep = e.target.value;
    if (cep.length === 8) {
      const address = await getAddress(cep);
      form.setFieldsValue({
        endereco: address?.logradouro,
        cidade: address?.localidade,
        complemento: address?.complemento,
        estado: address?.uf,
        bairro: address?.bairro,
      });
    }
  }

  function handleBack() {
    setShowForm(false);
    navigate("/pessoas");
  }

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Dados da Pessoa",
      forceRender: true,
      children: (
        <>
          <Row gutter={[8, 8]}>
            <Col span={12}>
              <Item
                label="Razão Social"
                name="razaoSocial"
                rules={[{ required: true, message: "Razão Social é obrigatório" }]}
                style={inputStyle}
              >
                <Input size="large" placeholder="Razão Social" />
              </Item>
            </Col>

            <Col span={12}>
              <Item
                label="CNPJ/CPF"
                name="documento"
                style={inputStyle}
              >
                <Input
                  size="large"
                  placeholder="CNPJ/CPF"
                  onKeyUp={onDocumentKeyUp}
                />
              </Item>
            </Col>
          </Row>

          <Row gutter={[8, 8]}>
            <Col span={12}>
              <Item
                label="E-mail"
                name="email"
                style={inputStyle}
                rules={[
                  { type: "email", message: "E-mail inválido" },
                  { required: false },
                ]}
              >
                <Input size="large" placeholder="E-mail" />
              </Item>
            </Col>

            <Col span={12}>
              <Item
                label="Telefone"
                name="telefone"
                style={inputStyle}
              >
                <Input
                  size="large"
                  placeholder="Telefone"
                  onKeyUp={onPhoneKeyUp}
                />
              </Item>
            </Col>
          </Row>

          <Row gutter={[8, 8]}>
            <Col span={6}>
              <Item
                label="CEP"
                name="cep"
                style={inputStyle}
              >
                <Input
                  size="large"
                  placeholder="CEP"
                  onChange={onChangeCep}
                />
              </Item>
            </Col>

            <Col span={14}>
              <Item
                label="Endereço"
                name="endereco"
                style={inputStyle}
              >
                <Input size="large" placeholder="Endereço" />
              </Item>
            </Col>

            <Col span={4}>
              <Item
                label="Número"
                name="numero"
                style={inputStyle}
              >
                <Input size="large" placeholder="Número" />
              </Item>
            </Col>
          </Row>

          <Row gutter={[8, 8]}>
            <Col span={6}>
              <Item
                label="Bairro"
                name="bairro"
                style={inputStyle}
              >
                <Input size="large" placeholder="Bairro" />
              </Item>
            </Col>

            <Col span={6}>
              <Item
                label="Complemento"
                name="complemento"
                style={inputStyle}
              >
                <Input size="large" placeholder="Complemento" />
              </Item>
            </Col>

            <Col span={6}>
              <Item
                label="Estado"
                name="estado"
                style={inputStyle}
              >
                <Select
                  allowClear
                  options={estados}
                  size="large"
                  placeholder="Estado"
                />
              </Item>
            </Col>

            <Col span={6}>
              <Item
                label="Cidade"
                name="cidade"
                style={inputStyle}
              >
                <Input size="large" placeholder="Cidade" />
              </Item>
            </Col>
          </Row>

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

          <Flex gap={16}>
            <Item name="isFornecedor" valuePropName="checked">
              <Checkbox>Fornecedor</Checkbox>
            </Item>

            <Item name="isCliente" valuePropName="checked">
              <Checkbox>Cliente</Checkbox>
            </Item>
          </Flex>
        </>
      ),
    },
    {
      key: "2",
      label: "Histórico",
      forceRender: true,
      children: (
        <>
          <Item
            label="Data de Atualização"
            name="dataAtualizacao"
            style={inputStyle}
          >
            <DatePicker
              style={{ width: "100%" }}
              size="large"
              disabled
              placeholder="Data de Atualização"
              format="DD/MM/YYYY"
            />
          </Item>

          <Item
            label="Usuário Responsável pela Atualização"
            name="usuarioAtualizacao"
            style={inputStyle}
          >
            <Input
              size="large"
              placeholder="Usuário Responsável pela Atualização"
              disabled
            />
          </Item>
          <FormFields form={form} />
        </>
      ),
    },
  ];

  useEffect(() => {
    getPlanosContas();
    if (id) {
      form.setFieldValue("dataAtualizacao", dayjs());
      form.setFieldValue("usuarioAtualizacao", user);
      getData();
    }
  }, []);

  return (
    <Card style={{ maxWidth: 600 }}>
      <AntdForm
        form={form}
        layout="vertical"
        onFinish={id ? handleSave : handleCreate}
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
