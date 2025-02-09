import { Button, Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";

import { AiFillEdit } from "react-icons/ai";
import { useQuery } from "react-query";
import { useAuth } from "../../utils/hooks/useAuth";
import UserCU from "./UserCU";

const Users = () => {
  const { getApi } = useAuth();
  const [selectedUser, setSelectedUser] = useState();
  const {
    data: roleData,
    status,
    refetchApi,
  } = useQuery("/user?pageSize=10&currentPage=1", getApi);

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
      render: (text, value) => (
        <>
          {value.firstName} {value.lastName}
        </>
      ),
    },
    {
      title: "نام کاربری",
      dataIndex: "username",
    },
    {
      title: "عملیات",
      render: (text, value) => (
        <>
          <Tooltip title="ویرایش">
            <Button type="link" danger onClick={() => setSelectedUser(value)}>
              <AiFillEdit className="icon" />
            </Button>
          </Tooltip>
        </>
      ),
    },
  ];

  function handleBack(needRefresh) {
    if (needRefresh) {
      refetchApi();
    }
    setSelectedUser();
  }

  if (selectedUser) {
    return <UserCU onBack={handleBack} selectedRole={selectedUser} />;
  }

  return (
    <>
      <Table
        dataSource={roleData?.data?.rows}
        loading={status === "loading"}
        columns={columns}
        rowKey="id"
      />
      <Button onClick={() => setSelectedUser("create")}>جدید</Button>
    </>
  );
};

export default Users;
