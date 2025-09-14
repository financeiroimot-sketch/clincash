import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip, Modal } from "antd";
import { MinusSquareOutlined, PlusSquareOutlined, EditOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import useQuery from "src/services/useQuery";

interface ActionsProps {
  id: string;
  nivel: number;
  descricao: string;
  classificacao: string;
  refetch: () => void;
}

function Actions({ id, nivel, descricao, classificacao, refetch }: ActionsProps) {
  
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { getDataByCollection, deleteData } = useQuery();

  const iconStyle = { cursor: "pointer", fontSize: 20 }

  async function handleDeletePlano() {
    setLoading(true);
    try {
      const planos = await getDataByCollection("planosContas");
      const related = planos?.filter((item: any) => item.classificacao.startsWith(classificacao));
      const ids = related?.map(item => item.id) ?? [];
      await Promise.all(ids.map(item => deleteData(item, "planosContas")));
      toast.success("Plano de contas excluído com sucesso");
      refetch();
    } catch (error) {
      toast.error("Erro ao excluir plano de contas");
    }
    setLoading(false);
    setOpen(false);
  }

  return (
    <>
      <Modal
        title={`${classificacao} ${descricao}`}
        open={open}
        onOk={handleDeletePlano}
        onCancel={() => setOpen(false)}
        okText="Confirmar"
        cancelText="Cancelar"
        loading={loading}
      >
        <p>Tem certeza que deseja excluir a {classificacao} e seus dependentes?</p>
      </Modal>

      <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
        {nivel !== 5 && (
          <Tooltip title="Adicionar">
            <PlusSquareOutlined
              onClick={() => navigate(`/plano-contas/${id}`)}
              style={{ ...iconStyle, color: "#198754" }}
            />
          </Tooltip>
        )}
        <Tooltip title="Remover">
          <MinusSquareOutlined
            onClick={() => setOpen(true)}
            style={{ ...iconStyle, color: "#b02a37" }}
          />
        </Tooltip>
        <Tooltip title="Editar">
          <EditOutlined
            onClick={() => navigate(`/plano-contas/editar/${id}`)}
            style={iconStyle}
          />
        </Tooltip>
      </div>
    </>
  );
}

export default Actions;
