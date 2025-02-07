import { Button, Table, Tooltip } from "antd";
import { useEffect, useState } from "react";
import CrudBtn from "components/CrudBtn/CrudBtn";
import CUPermission from "./CUPermission";
import { AiFillEdit } from "react-icons/ai";
import { useQuery } from "react-query";
import { useAuth } from "utils/hooks/useAuth";

const Permissions = () => {
  const { getApi } = useAuth();
  const [selectedPermission, setSelectedPermission] = useState();
  const { 
    data: roleData,
    status,
    refetchApi } = useQuery(
    "permissions?pageSize=20&currentPage=1",
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
      title: "عنوان",
      dataIndex: "title",
    },
    {
      title: "عملیات",
      dataIndex: "parentId",
      render: (text, value) => (
        <Tooltip title="ویرایش">
          <Button
            type="link"
            danger
            onClick={() => setSelectedPermission(value)}
          >
            <AiFillEdit className="icon" />
          </Button>
        </Tooltip>
      ),
    },
  ];

  if (selectedPermission) {
    return (
      <CUPermission
        onBack={() => setSelectedPermission()}
        selectedPermission={selectedPermission}
      />
    );
  }

  return (
    <>
      <Table
        dataSource={roleData?.data?.rows || []}
        columns={columns}
        loading={status}
      />
      <CrudBtn onNew={() => setSelectedPermission("new")} />
    </>
  );
};

export default Permissions;
