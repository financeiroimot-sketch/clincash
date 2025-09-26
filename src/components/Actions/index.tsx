import { useState } from "react";
import { Tooltip } from "antd";
import { DollarOutlined, FileTextOutlined, CloseOutlined } from "@ant-design/icons";
import { EditButton, InformarPagamento, ExcluirConta } from "src/components";
import { CollectionName, Conta, StatusPagamento } from "src/utils/typings";

interface ActionsProps {
  id: string;
  collection: CollectionName;
  status: StatusPagamento;
  comprovante?: string;
  nomeComprovante?: string;
  refetch: () => void;
  updateAccount: (id: string, conta: Conta) => void;
}

function Actions({
  id,
  collection,
  status,
  comprovante,
  nomeComprovante,
  refetch,
  updateAccount,
}: ActionsProps) {

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState<boolean>(false);

  function getMimeType() {
    if (comprovante && nomeComprovante) {
      const extension = nomeComprovante.split(".").at(-1);
      if (extension === "jpg" || extension === "jpeg") {
        return "image/jpeg";
      }
      if (extension === "png") {
        return "image/png";
      }
      return "application/pdf";
    }
  }

  function handleOpenComprovante() {
    if (comprovante && nomeComprovante) {
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
  }

  return (
    <>
      <InformarPagamento
        id={id}
        open={modalOpen}
        collection={collection}
        handleClose={() => setModalOpen(false)}
        updateAccount={updateAccount}
      />
      <ExcluirConta
        id={id}
        open={modalDeleteOpen}
        collection={collection}
        handleClose={() => setModalDeleteOpen(false)}
        refetch={refetch}
      />
      <div style={{ display: "flex", gap: 16 }}>
        <Tooltip title="Excluir">
          <CloseOutlined
            onClick={() => setModalDeleteOpen(true)}
            style={{ cursor: "pointer", fontSize: 18, color: "#f00" }}
          />
        </Tooltip>
        <EditButton id={id} />
        {status !== "pago" && (
          <Tooltip title="Informar Pagamento">
            <DollarOutlined
              onClick={() => setModalOpen(true)}
              style={{ cursor: "pointer", fontSize: 18 }}
            />
          </Tooltip>
        )}
        {comprovante && (
          <Tooltip title="Ver Comprovante">
            <FileTextOutlined
              onClick={handleOpenComprovante}
              style={{ cursor: "pointer", fontSize: 18 }}
            />
          </Tooltip>
        )}
      </div>
    </>
  );
}

export default Actions;
