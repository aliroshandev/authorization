import CrudBtn from "components/CrudBtn/CrudBtn";
import React, { useMemo } from "react";
// import { useGetApiCall } from "base/hooks/useGetApiCall";
import { AutoComplete, Button, Form, Spin, Table, Tooltip } from "antd";
import { useState } from "react";
import "./Resources.scss";
import CrudResource from "./CrudResource";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { BackBtn } from "../Buttons/Buttons";
import ErrorSection from "components/ErrorSection/ErrorSection";
import { AiFillEdit, AiOutlineDelete } from "react-icons/ai";
import { useAuth } from "utils/hooks/useAuth";
import { useQuery } from "react-query";

// const {createRoot} = ReactDOM;
// const {Button, Table } = antd;
// const {useState} = react;

const Resources = (props) => {
  const navigate = useNavigate();
  const { getApi } = useAuth();
  const { clientId } = props?.location?.state || 0;
  if (!clientId) {
    navigate("/menu");
  }

  const { id: menuId } = useParams();
  const [selectedClientId, setSelectedClientId] = useState(clientId);
  const {
    data: clients,
    status: clientsStatus,
    refetch: clientsRefetch,
  } = useQuery("/clients", getApi);

  const {
    data: menus,
    status: menusStatus,
    refetch: menusRefetch,
  } = useQuery(`/menus/client-id/${selectedClientId}`, getApi, {
    enabled: !!selectedClientId,
  });

  const { response, isFetching, refetch } = useQuery(
    `/resources/menu-id/${menuId}`,
    getApi,
    {
      enabled: !!menuId,
    }
  );
  const [selectedResource, setSelectedResource] = useState("");

  const columns = useMemo(
    () => [
      {
        title: "ردیف",
        render: (text, value, i) => {
          return i + 1;
        },
      },
      {
        title: "عنوان",
        dataIndex: "title",
        key: "title",
      },
      {
        title: "مسیر",
        dataIndex: "path",
        key: "path",
      },
      {
        title: "عملیات",
        dataIndex: "actions",
        key: "actions",
        render: (text, value) => (
          <>
            <Tooltip title="ویرایش">
              <Button type="link" danger>
                <AiOutlineDelete className="icon" />
              </Button>
            </Tooltip>
            <Tooltip title="ویرایش">
              <Button
                type="link"
                danger
                onClick={() => setSelectedResource(value)}
              >
                <AiFillEdit className="icon" />
              </Button>
            </Tooltip>
          </>
        ),
      },
    ],
    []
  );

  if (selectedResource) {
    return (
      <CrudResource
        onBack={() => setSelectedResource("")}
        refetch={refetch}
        clientId={selectedClientId}
        menuId={menuId}
        isCreate={selectedResource === "create"}
        selectedResource={
          selectedResource === "create" ? null : selectedResource
        }
      />
    );
  }

  return (
    <>
      <div className="header-section">
        <h2>منابع</h2>
        <Link to={`/menu/${selectedClientId}`}>
          <BackBtn />
        </Link>
      </div>
      <div className="resource-autocomplete-inputs">
        <Form.Item label="سامانه">
          {clientsStatus === "loading" ? (
            <Spin />
          ) : clientsStatus === "error" ? (
            <ErrorSection handleRefresh={clientsRefetch} />
          ) : clientsStatus === "success" && clients?.data ? (
            <AutoComplete
              onSelect={(value, item) => {
                setSelectedClientId(item.key);
              }}
              filterOption={(inputValue, option) =>
                option.children.includes(inputValue)
              }
              defaultValue={
                clients?.data?.find((client) => client.id === selectedClientId)
                  ?.description
              }
            >
              {clients?.data
                ?.filter((client) => client.description)
                ?.map((client) => {
                  return (
                    <AutoComplete.Option
                      key={client.id}
                      value={client.description}
                    >
                      {`${client.description}`}
                    </AutoComplete.Option>
                  );
                })}
            </AutoComplete>
          ) : (
            <></>
          )}
        </Form.Item>
        <Form.Item label="منو">
          {menusStatus === "loading" ? (
            <Spin />
          ) : menusStatus === "error" ? (
            <ErrorSection handleRefresh={menusRefetch} />
          ) : menusStatus === "success" && selectedClientId ? (
            <AutoComplete
              onSelect={(value, item) => {
                navigate({
                  pathname: `/resources/${item.key}`,
                  state: {
                    clientId: selectedClientId,
                  },
                });
              }}
              filterOption={(inputValue, option) =>
                option.children.includes(inputValue)
              }
              defaultValue={
                menus?.data?.find((menu) => menu.id === menuId)?.title
              }
            >
              {menus?.data?.map((client) => {
                return (
                  <AutoComplete.Option key={client.id} value={client.title}>
                    {`${client.title}`}
                  </AutoComplete.Option>
                );
              })}
            </AutoComplete>
          ) : (
            <></>
          )}
        </Form.Item>
      </div>
      <Table
        loading={isFetching}
        columns={columns}
        dataSource={response?.data}
      />
      <CrudBtn onNew={() => setSelectedResource("create")} />
    </>
  );
};

export default Resources;
