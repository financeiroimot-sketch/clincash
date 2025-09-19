import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form as AntdForm, Input, Card, Button, Tabs, TabsProps, Checkbox, Table } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { toast } from "react-toastify";
import dayjs, { Dayjs } from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { FormFields } from "src/components";
import useQuery from "src/services/useQuery";
import { maskPhone, unmaskPhone } from "src/utils/phoneMask";
import { Usuario, Coluna, CollectionName } from "src/utils/typings";
import { contasPagar, contasReceber, livroCaixa, dashboard } from "./columns";

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(customParseFormat);

const { useForm, Item } = AntdForm;
const { Password } = Input;

interface FormProps {
  id: string | null;
  setShowForm: (show: boolean) => void;
}

function Form({ id, setShowForm }: FormProps) {

  const [form] = useForm();
  const navigate = useNavigate();
  const { getDataById, updateData, saveUser, resetPassword } = useQuery();

  const [colunasContasPagar, setColunasContasPagar] = useState<Coluna[]>(contasPagar);
  const [colunasContasReceber, setColunasContasReceber] = useState<Coluna[]>(contasReceber);
  const [colunasLivroCaixa, setColunasLivroCaixa] = useState<Coluna[]>(livroCaixa);
  const [colunasDashboard, setColunasDashboard] = useState<Coluna[]>(dashboard);

  async function getData() {
    const data = await getDataById(id!, "usuarios");
    const usuario = data as Usuario;
    if (data) {
      const dataCadastro = usuario?.dataCadastro ? dayjs(usuario?.dataCadastro, "DD/MM/YYYY") : dayjs();
      form.setFieldsValue({ ...usuario, dataCadastro });

      setColunasContasPagar(contasPagar.map(item => {
        const colunaUsuario = usuario?.colunasContasPagar?.find(c => c.coluna === item.coluna);
        return colunaUsuario || item;
      }));

      setColunasContasReceber(contasReceber.map(item => {
        const colunaUsuario = usuario?.colunasContasReceber?.find(c => c.coluna === item.coluna);
        return colunaUsuario || item;
      }));

      setColunasLivroCaixa(livroCaixa.map(item => {
        const colunaUsuario = usuario?.colunasLivroCaixa?.find(c => c.coluna === item.coluna);
        return colunaUsuario || item;
      }));

      setColunasDashboard(dashboard.map(item => {
        const colunaUsuario = usuario?.colunasDashboard?.find(c => c.coluna === item.coluna);
        return colunaUsuario || item;
      }));
    }
  }

  function formatData(values: any) {
    values.dataCadastro = (values.dataCadastro as Dayjs).format("DD/MM/YYYY");
    values.ativo = values.ativo === undefined ? true : values.ativo;
    values.permissaoLivroCaixa = values.permissaoLivroCaixa === undefined ? true : values.permissaoLivroCaixa;
    sessionStorage.setItem("clin-cash-permissao", values.permissaoLivroCaixa ? "livro-caixa" : "");
    const arr = Object.entries(values);
    const cleared = arr.filter(([_, value]) => value !== undefined);
    return Object.fromEntries(cleared);
  }

  async function handleSave(values: any) {
    const data = formatData(values);
    const result = await updateData(id!, {
      ...data,
      colunasContasPagar,
      colunasContasReceber,
      colunasLivroCaixa,
      colunasDashboard,
    }, "usuarios");
    if (result) {
      toast.success("Usuário salvo com sucesso");
      handleBack();
    }
  }

  async function handleCreate(values: any) {
    const data = formatData(values);
    const result = await saveUser({
      ...data,
      colunasContasPagar,
      colunasContasReceber,
      colunasLivroCaixa,
      colunasDashboard,
    }, "usuarios");
    if (result) {
      toast.success("Usuário salvo com sucesso");
      handleBack();
    }
  }

  async function handleResetPassword() {
    const email = form.getFieldValue("email");
    const isEmailSent = await resetPassword(email);
    if (isEmailSent) {
      toast.success("E-mail de recuperação de senha enviado");
      return;
    }
    toast.error("Erro ao enviar e-mail de recuperação de senha");
  }

  function handleChangeColumn(column: string, collection: CollectionName) {
    if (collection === "contasPagar") {
      const columns = colunasContasPagar.map(item => {
        if (item.coluna === column) {
          return { ...item, ativo: !item.ativo }
        }
        return item;
      });
      setColunasContasPagar(columns);
      return;
    }
    if (collection === "contasReceber") {
      const columns = colunasContasReceber.map(item => {
        if (item.coluna === column) {
          return { ...item, ativo: !item.ativo }
        }
        return item;
      });
      setColunasContasReceber(columns);
      return;
    }
    if (collection === "livroCaixa") {
      const columns = colunasLivroCaixa.map(item => {
        if (item.coluna === column) {
          return { ...item, ativo: !item.ativo }
        }
        return item;
      });
      setColunasLivroCaixa(columns);
      return;
    }
    if (collection === "dashboard") {
      const columns = colunasDashboard.map(item => {
        if (item.coluna === column) {
          return { ...item, ativo: !item.ativo }
        }
        return item;
      });
      setColunasDashboard(columns);
      return;
    }
  }

  function onPhoneKeyUp(event: any) {
    if (event.code !== "Backspace") {
      const tel = unmaskPhone((event.target as HTMLInputElement).value);
      form.setFieldValue("telefone", maskPhone(tel));
    }
  }

  function handleBack() {
    setShowForm(false);
    navigate("/usuarios");
  }

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Dados do Usuário",
      forceRender: true,
      children: (
        <>
          <Item
            label="Nome"
            name="nome"
            style={inputStyle}
            rules={[{ required: true, message: "Nome é obrigatório" }]}
          >
            <Input size="large" placeholder="Nome" />
          </Item>

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

          <Item
            label="E-mail"
            name="email"
            style={inputStyle}
            rules={[
              { required: true, message: "E-mail é obrigatório" },
              { type: "email", message: "E-mail inválido" },
            ]}
          >
            <Input size="large" placeholder="E-mail" />
          </Item>

          {!id && (
            <Item
              label="Senha"
              name="senha"
              rules={[
                { required: id ? false : true, message: "Senha é obrigatório" },
                { min: 6, message: "A senha deve conter no mínimo 6 dígitos" },
              ]}
              style={inputStyle}
            >
              <Password
                size="large"
                placeholder="Senha"
                disabled={!!id}
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Item>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Item name="ativo" valuePropName="checked">
              <Checkbox>Ativo</Checkbox>
            </Item>
            <Item name="permissaoLivroCaixa" valuePropName="checked">
              <Checkbox>Livro Caixa</Checkbox>
            </Item>
          </div>
        </>
      ),
    },
    {
      key: "2",
      label: "Contas a Pagar",
      forceRender: true,
      children: (
        <Table
          dataSource={colunasContasPagar}
          pagination={false}
          columns={[
            {
              title: "Coluna",
              dataIndex: "coluna",
              key: "coluna",
              render: (value: string) => <span>{value ?? "-"}</span>
            },
            {
              title: "Ativo",
              dataIndex: "ativo",
              key: "ativo",
              render: (value: boolean, record: Coluna) => (
                <Checkbox
                  checked={value}
                  onChange={() => handleChangeColumn(record.coluna, "contasPagar")}
                />
              ),
            }
          ]}
        />
      ),
    },
    {
      key: "3",
      label: "Contas a Receber",
      forceRender: true,
      children: (
        <Table
          dataSource={colunasContasReceber}
          pagination={false}
          columns={[
            {
              title: "Coluna",
              dataIndex: "coluna",
              key: "coluna",
              render: (value: string) => <span>{value ?? "-"}</span>
            },
            {
              title: "Ativo",
              dataIndex: "ativo",
              key: "ativo",
              render: (value: boolean, record: Coluna) => (
                <Checkbox
                  checked={value}
                  onChange={() => handleChangeColumn(record.coluna, "contasReceber")}
                />
              ),
            }
          ]}
        />
      ),
    },
    {
      key: "4",
      label: "Livro Caixa",
      forceRender: true,
      children: (
        <Table
          dataSource={colunasLivroCaixa}
          pagination={false}
          columns={[
            {
              title: "Coluna",
              dataIndex: "coluna",
              key: "coluna",
              render: (value: string) => <span>{value ?? "-"}</span>
            },
            {
              title: "Ativo",
              dataIndex: "ativo",
              key: "ativo",
              render: (value: boolean, record: Coluna) => (
                <Checkbox
                  checked={value}
                  onChange={() => handleChangeColumn(record.coluna, "livroCaixa")}
                />
              ),
            }
          ]}
        />
      ),
    },
    {
      key: "5",
      label: "Dashboard",
      forceRender: true,
      children: (
        <Table
          dataSource={colunasDashboard}
          pagination={false}
          columns={[
            {
              title: "Coluna",
              dataIndex: "coluna",
              key: "coluna",
              render: (value: string) => <span>{value ?? "-"}</span>
            },
            {
              title: "Ativo",
              dataIndex: "ativo",
              key: "ativo",
              render: (value: boolean, record: Coluna) => (
                <Checkbox
                  checked={value}
                  onChange={() => handleChangeColumn(record.coluna, "dashboard")}
                />
              ),
            }
          ]}
        />
      ),
    },
    {
      key: "6",
      label: "Histórico",
      forceRender: true,
      children: <FormFields form={form} />,
    },
  ];

  useEffect(() => {
    if (id) {
      getData();
    }
  }, []);

  return (
    <Card style={{ maxWidth: 780 }}>
      <AntdForm
        form={form}
        layout="vertical"
        onFinish={id ? handleSave : handleCreate}
        style={{ display: "flex", flexDirection: "column", gap: 8 }}
      >
        <Tabs type="card" items={items} />

        <div style={actionsStyle}>
          {id && <Button onClick={handleResetPassword}>Recuperar Senha</Button>}
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
