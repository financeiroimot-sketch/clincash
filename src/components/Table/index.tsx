import {
  Table as AntdTable,
  TableProps as AntdTableProps,
} from "antd";

interface TableProps extends AntdTableProps {
  data: any[];
  columns: any[];
}

function Table({ data, columns, ...props }: TableProps) {  
  return (
    <AntdTable
      rowKey="id"
      locale={{ 
        triggerDesc: "Ordem Decrescente",
        triggerAsc: "Ordem Crescente",
      }}
      pagination={{ pageSize: 200 }}
      dataSource={data}
      columns={columns}
      scroll={{ x: true }}
      {...props}
    />
  );
}

export default Table;
