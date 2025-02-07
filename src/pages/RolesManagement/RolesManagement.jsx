import React, { useEffect } from "react";
import {
  AutoComplete,
  Button,
  Form,
  Table,
  Tooltip,
  Popconfirm,
  notification,
  Skeleton,
} from "antd";
import { useMemo, useState } from "react";
import ErrorSection from "components/ErrorSection/ErrorSection";
import { useNavigate, useParams } from "react-router";
import RoleCrud from "./RoleCrud";
import {
  AiFillEdit,
  AiOutlineDelete,
  AiOutlineUsergroupAdd,
} from "react-icons/ai";
import "./RolesManagement.scss";
import AssignRoleToUser from "./AssignRoleToUser";
import CrudBtn from "components/CrudBtn/CrudBtn";
import { useAuth } from "utils/hooks/useAuth";
import { useMutation, useQuery } from "react-query";

const RolesManagement = (props) => {
  const navigate = useNavigate();
  const { sendRequest, getApi } = useAuth();
  const { isLoading, mutate } = useMutation({
    mutationFn: sendRequest,
    onSuccess: () => {
      notification.success({
        message: "عملیات حذف با موفقیت انجام شد",
        placement: "bottomLeft",
      });
      rolesRefetch();
    },
    onError: () =>
      notification.error({
        message: "خطا در حذف نقش",
        placement: "bottomLeft",
      }),
  });
  const { id: clientId } = useParams();
  const [selectedClientId, setSelectedClientId] = useState(clientId);
  const [selectedRole, setSelectedRole] = useState();
  const [addUserRole, setAddUserRole] = useState(false);
  const {
    data: clients,
    status: clientsStatus,
    refetchApi: clientsRefetch,
  } = useQuery("clients", getApi);

  const {
    data: roles,
    status: rolesStatus,
    refetch: rolesRefetch,
  } = useQuery(
    `roles/client-id?clientId=${selectedClientId}&currentPage=1&pageSize=100`,
    getApi,
    {
      enabled: !!selectedClientId,
    }
  );

  async function handleDelete(data) {
    console.log(data)
    mutate({
      method: "DELETE", 
      endpoint: "roles",  
      data: {
        ...data,
        clientId: selectedClientId
      }
    });
  }

  const columns = useMemo(
    () => [
      {
        title: "ردیف",
        render: (value, record, i) => {
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
      {
        title: "عملیات",
        dataIndex: "actions",
        key: "actions",
        render: (text, value) => (
          <div className="action-section">
            <Tooltip title="کاربران">
              <Button
                onClick={() => {
                  setAddUserRole(true);
                  setSelectedRole(value);
                }}
              >
                <AiOutlineUsergroupAdd />
              </Button>
            </Tooltip>
            <Tooltip title="حذف">
              <Popconfirm
                title="آیا از حذف نقش اطمینان دارید؟"
                onConfirm={() => handleDelete(value)}
              >
                <Button>
                  <AiOutlineDelete />
                </Button>
              </Popconfirm>
            </Tooltip>
            <Tooltip title="ویرایش">
              <Button onClick={() => setSelectedRole(value)}>
                <AiFillEdit />
              </Button>
            </Tooltip>
          </div>
        ),
      },
    ],
    []
  );

  function handleBack(needRefresh) {
    if (needRefresh) {
      rolesRefetch();
    }
    setSelectedRole();
  }

  if (addUserRole && selectedRole) {
    return (
      <AssignRoleToUser
        onBack={() => {
          setAddUserRole(false);
          setSelectedRole();
        }}
        selectedRole={selectedRole}
      />
    );
  }

  if (selectedRole) {
    return (
      <RoleCrud
        onBack={handleBack}
        selectedRole={selectedRole}
        clientId={selectedClientId}
      />
    );
  }

  return (
    <div>
      {clientsStatus === "loading" ? (
        <Skeleton.Input active />
      ) : clientsStatus === "error" ? (
        <ErrorSection handleRefresh={clientsRefetch} />
      ) : clientsStatus === "success" && clients?.data ? (
        <>
          <Form.Item label="سامانه" className="autocomplete-input">
            <AutoComplete
              onSelect={(value, item) => {
                setSelectedClientId(item.key);
                navigate(`/roles-management/${item.key}`);
              }}
              filterOption={(inputValue, option) =>
                option.children.includes(inputValue)
              }
              defaultValue={
                clients?.data?.find((client) => client.id === selectedClientId)
                  ?.description
              }
              allowClear
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
          </Form.Item>
        </>
      ) : (
        <></>
      )}

      {rolesStatus === "success" ? (
        <>
          <Table
            // loading={rolesStatus === "loading" || isLoading}
            columns={columns}
            dataSource={roles?.data}
          />
          <CrudBtn onNew={() => setSelectedRole("create")} />
        </>
      ) : rolesStatus === "error" ? (
        <ErrorSection handleRefresh={rolesRefetch} />
      ) : (
        <></>
      )}
    </div>
  );
};

export default RolesManagement;
