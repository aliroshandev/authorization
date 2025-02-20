import { Table } from "antd";
import { useQuery } from "react-query";
import { useAuth } from "utils/hooks/useAuth";

const Roles = () => {
  const { getApi } = useAuth();
  const { data: roleData, status } = useQuery(
    "roles?pageSize=100&currentPage=1",
    getApi
  );

  const columns = [
    {
      title: "ردیف",
      render: (text, value, i) => {
        return i + 1;
      },
    },
    {
      title: "نام",
      dataIndex: "name",
    },
    {
      title: "توضیحات",
      dataIndex: "description",
    },
  ];

  return (
    <>
      <Table
        dataSource={roleData?.data}
        loading={status === "loading"}
        columns={columns}
        rowKey="id"
      />
    </>
  );
};

export default Roles;
