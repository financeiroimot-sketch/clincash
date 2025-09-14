import { useEffect } from "react";
import { DatePicker, Checkbox, Form, Input, FormInstance } from "antd";
import useGetUser from "src/utils/useGetUser";
import dayjs from "dayjs";

const { Item } = Form;

interface FormFieldsProps {
  form: FormInstance;
}

function FormFields({ form }: FormFieldsProps) {

  const user = useGetUser();

  useEffect(() => {
    if (user) {
      form.setFieldValue("dataCadastro", dayjs());
      form.setFieldValue("usuarioResponsavel", user);
    }
  }, [user]);

  return (
    <>
      <Item
        label="Data de Cadastro"
        name="dataCadastro"
        style={inputStyle}
      >
        <DatePicker
          style={{ width: "100%" }}
          size="large"
          disabled
          placeholder="Data de Cadastro"
          format="DD/MM/YYYY"
        />
      </Item>

      <Item
        label="Usuário Responsável"
        name="usuarioResponsavel"
        style={inputStyle}
      >
        <Input
          size="large"
          placeholder="Usuário Responsável"
          disabled
        />
      </Item>

      <Item name="ativo">
        <Checkbox checked disabled>Ativo</Checkbox>
      </Item>
    </>
  );
}

const inputStyle = {
  marginBottom: 8,
}

export default FormFields;
