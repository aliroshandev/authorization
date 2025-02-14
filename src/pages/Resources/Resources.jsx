import CrudBtn from "components/CrudBtn/CrudBtn";
import React, {useMemo, useState} from "react";
// import { useGetApiCall } from "base/hooks/useGetApiCall";
import {AutoComplete, Button, Form, notification, Popconfirm, Spin, Table, Tooltip} from "antd";
import "./Resources.scss";
import CrudResource from "./CrudResource";
import {useParams} from "react-router";
import {Link, useNavigate} from "react-router-dom";
import {BackBtn} from "../Buttons/Buttons";
import ErrorSection from "components/ErrorSection/ErrorSection";
import {AiFillEdit, AiOutlineDelete} from "react-icons/ai";
import {useAuth} from "utils/hooks/useAuth";
import {useMutation, useQuery} from "react-query";

// const {createRoot} = ReactDOM;
// const {Button, Table } = antd;
// const {useState} = react;

const Resources = (props) => {
  const navigate = useNavigate();
  const {getApi, sendRequest} = useAuth();

  const {id: menuId} = useParams();
  const [selectedClientId, setSelectedClientId] = useState(menuId);
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

  const {response, isFetching, refetch} = useQuery(
    `/resources/menu-id/${menuId}`,
    getApi,
    {
      enabled: !!menuId,
    }
  );
  const [selectedResource, setSelectedResource] = useState("");


  const {isLoading, mutate} = useMutation({
    mutationFn: sendRequest,
  });

  const handleDelete = (value) => {
    mutate({
        method: "DELETE",
        endpoint: `/resources/${value.id}`,
      },
      {
        onSuccess: () => {
          notification.success({
            message: "عملیات حذف با موفقیت انجام شد",
            placement: "bottomLeft",
          });
          refetch();
        },
        onError: (err) => {
          notification.error({
            message: err?.message || "خطا در حذف",
            placement: "bottomLeft",
          });
        },
      })
  };

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
        title: "کلید",
        dataIndex: "key",
        key: "key",
      },
      {
        title: "آدرس",
        dataIndex: "url",
      },
      {
        title: "عملیات",
        dataIndex: "actions",
        key: "actions",
        render: (text, value) => (
          <>
            <Popconfirm
              title="آیا از حذف منبع اطمینان دارید؟"
              onConfirm={() => handleDelete(value)}
            >
              <Button>
                <AiOutlineDelete/>
              </Button>
            </Popconfirm>
            <Tooltip title="ویرایش">
              <Button
                type="link"
                danger
                onClick={() => setSelectedResource(value)}
              >
                <AiFillEdit className="icon"/>
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
          <BackBtn/>
        </Link>
      </div>
      <div className="resource-autocomplete-inputs">
        <Form.Item label="سامانه">
          {clientsStatus === "loading" ? (
            <Spin/>
          ) : clientsStatus === "error" ? (
            <ErrorSection handleRefresh={clientsRefetch}/>
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
            <Spin/>
          ) : menusStatus === "error" ? (
            <ErrorSection handleRefresh={menusRefetch}/>
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
      <CrudBtn onNew={() => setSelectedResource("create")}/>
    </>
  );
};

export default Resources;
