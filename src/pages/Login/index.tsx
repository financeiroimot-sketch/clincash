import { CSSProperties, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Layout, Card } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { auth } from "src/services/firebase";
import { useLoader } from "src/components/Loader/useLoader";
import useQuery from "src/services/useQuery";
import bgImg from "src/assets/images/bg.jpg";

const { Item, useForm } = Form;
const { Password } = Input;

function Login() {

  const [form] = useForm();
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();
  const { resetPassword, getUser } = useQuery();

  async function handleLogin(values: any) {
    showLoader();
    try {
      const response = await signInWithEmailAndPassword(auth, values.email, values.password);
      if (response.user.uid) {
        const user = await getUser(response.user.uid);
        sessionStorage.setItem("clin-cash-permissao", user?.permissaoLivroCaixa ? "livro-caixa" : "");
        sessionStorage.setItem("clin-cash-user-name", user?.nome);
        sessionStorage.setItem("clin-cash-user-email", values.email);
        sessionStorage.setItem("clin-cash-user-uid", response.user.uid);
        hideLoader();
        navigate("/inicio");
      }
    } catch (error: any) {
      toast.error("E-mail e/ou senha inválidos");
    }

    hideLoader();
  }

  async function handleResetPassword() {
    const email = form.getFieldValue("email");
    if (!email) {
      toast.error("Informe o e-mail para recuperar a senha");
      return;
    }
    const isEmailSent = await resetPassword(email);
    if (isEmailSent) {
      toast.success("E-mail de recuperação de senha enviado");
      return;
    }
    toast.error("Erro ao enviar e-mail de recuperação de senha");
  }

  useEffect(() => {
    hideLoader();
    const isAuthenticated = sessionStorage.getItem("clin-cash-user-uid");
    if (isAuthenticated) {
      navigate("/inicio");
    }
  }, []);

  return (
    <Layout style={layoutStyle}>
      <img src={bgImg} alt="ClinCash" style={{ height: "100vh", width: "100%", objectFit: "cover" }} />

      <Card style={cardStyle}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: 8 }}
        >
          <Item
            label="E-mail"
            name="email"
            rules={[{ required: true, message: "E-mail inválido" }]}
            style={inputStyle}
          >
            <Input size="large" placeholder="E-mail" />
          </Item>

          <Item
            label="Senha"
            name="password"
            rules={[{ required: true, message: "Senha inválida" }]}
            style={inputStyle}
          >
            <Password
              size="large"
              placeholder="Senha"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Item>
          <Button type="primary" htmlType="submit">Entrar</Button>
          <Button onClick={handleResetPassword}>Recuperar Senha</Button>
        </Form>
      </Card>
    </Layout>
  );
}

const cardStyle: CSSProperties = {
  width: 420,
  position: "absolute",
  // backgroundColor: "#ffffff40",
  border: "none",
}

const layoutStyle = {
  height: "100%",
  justifyContent: "center",
  alignItems: "center",
}

const inputStyle = {
  marginBottom: 8,
}

export default Login;
