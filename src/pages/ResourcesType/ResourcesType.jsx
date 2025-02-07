import { Button, Table, Tooltip } from "antd";
import CrudBtn from "components/CrudBtn/CrudBtn";
import ErrorSection from "components/ErrorSection/ErrorSection";
import React, { useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { useQuery } from "react-query";
import { useAuth } from "utils/hooks/useAuth";
import CrudResourcesType from "./CrudResourcesType";

const ResourcesType = () => {
  const { getApi } = useAuth();
  const [selectedResource, setSelectedResource] = useState();
  const { response, status, refetchApi } = useQuery(
    "resource-types?pageSize=10&currentPage=1",
    getApi
  );

  const COLUMNS = [
    {
      title: "ردیف",
      render: (text, value, i) => {
        return i + 1;
      },
    },
    {
      title: "نوع",
      dataIndex: "title",
    },
    {
      title: "عملیات",
      dataIndex: "parentId",
      render: (text, value) => (
        <Tooltip title="ویرایش">
          <Button type="link" danger onClick={() => setSelectedResource(value)}>
            <AiFillEdit className="icon" />
          </Button>
        </Tooltip>
      ),
    },
  ];

  if (selectedResource) {
    return (
      <CrudResourcesType
        isCreate={selectedResource === "create"}
        selectedResource={selectedResource}
        onBack={(needRefresh) => {
          refetchApi();
          setSelectedResource("");
        }}
      />
    );
  }

  return (
    <>
      <Table
        columns={COLUMNS}
        loading={status === "pending"}
        dataSource={response?.data?.rows}
      />
      {status === "rejected" && <ErrorSection handleRefresh={refetchApi} />}
      <CrudBtn onNew={() => setSelectedResource("create")} />
    </>
  );
};

export default ResourcesType;
