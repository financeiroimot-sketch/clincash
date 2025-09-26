import { Modal } from "antd";
import useQuery from "src/services/useQuery";
import { CollectionName } from "src/utils/typings";

interface ExcluirContaProps {
  id: string;
  open: boolean;
  collection: CollectionName;
  handleClose: () => void;
  refetch: () => void;
}

function ExcluirConta({ id, open, collection, refetch, handleClose }: ExcluirContaProps) {

  const { deleteData } = useQuery();

  async function handleDelete() {
    await deleteData(id, collection);
    handleClose();
    refetch();
  }

  return (
    <Modal
      open={open}
      okText="Confirmar"
      title="Excluir Conta"
      onOk={handleDelete}
      onCancel={handleClose}
    >
      <p>Tem certeza que deseja excluir esta conta?</p>
    </Modal>
  );
}

export default ExcluirConta;
