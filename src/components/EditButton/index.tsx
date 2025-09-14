import { useNavigate, useLocation } from "react-router-dom";
import { Tooltip } from "antd";
import { EditOutlined } from "@ant-design/icons";

interface EditButtonProps {
  id: string;
}

function EditButton({ id }: EditButtonProps) {

  const navigate = useNavigate();
  const location = useLocation();

  const path = location.pathname;

  return (
    <Tooltip title="Editar">
      <EditOutlined
        onClick={() => navigate(`${path}/${id}`)}
        style={{ cursor: "pointer", fontSize: 18 }}
      />
    </Tooltip>
  );
}

export default EditButton;
