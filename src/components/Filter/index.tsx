import { PlusOutlined } from "@ant-design/icons";

interface FilterProps {
  setShowForm: (show: boolean) => void;
}

function Filter({ setShowForm }: FilterProps) {
  return (
    <div style={{ position: "fixed", zIndex: 999999, bottom: 25, right: 25 }}>
      <PlusOutlined
        style={{ fontSize: 20, backgroundColor: "#1677FF", color: "#fff", borderRadius: "50%", padding: 8 }}
        onClick={() => setShowForm(true)}
      />
    </div>
  );
}

export default Filter;
