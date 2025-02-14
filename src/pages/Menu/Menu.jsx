import {AutoComplete, Button, notification, Popconfirm, Skeleton, Table, Tooltip} from "antd";
import {useEffect, useState} from "react";
import CrudBtn from "components/CrudBtn/CrudBtn";
import CUMenu from "./CUMenu";
import "./Menu.scss";
import ErrorSection from "components/ErrorSection/ErrorSection";
import {AiFillEdit, AiOutlineDelete, AiOutlineOrderedList,} from "react-icons/ai";
import {useParams} from "react-router";
import {Link, useNavigate} from "react-router-dom";
import {useMutation, useQuery} from "react-query";
import {useAuth} from "utils/hooks/useAuth";

const ManageSystemMenu = () => {
  const {id} = useParams();
  const {getApi, sendRequest} = useAuth();
  const [state, setState] = useState("");
  const [selectedClientId, setSelectedClientId] = useState(id);
  const {isLoading, mutate} = useMutation({
    mutationFn: sendRequest,
  });

  const navigate = useNavigate();
  const {
    data: clientsData,
    status: clientsStatus,
    refetch: clientsRefetch,
  } = useQuery("/clients", getApi, {
    onSuccess: (response) => {
      console.log(response);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const {
    data: responseMenu,
    status,
    refetch: responseMenuRefetch,
  } = useQuery(`/menus/client-id/${selectedClientId}`, getApi, {
    enabled: !!selectedClientId,
  });

  useEffect(() => {

  }, [id, setSelectedClientId])

  useEffect(() => {
    console.log(clientsData?.data);
  }, [clientsData?.data, clientsStatus]);

  const handleDelete = (value) => {
    mutate({
        method: "DELETE",
        endpoint: `menus/${value.id}`,
      },
      {
        onSuccess: () => {
          notification.success({
            message: "عملیات حذف با موفقیت انجام شد",
            placement: "bottomLeft",
          });
          responseMenuRefetch();
        },
        onError: (err) => {
          notification.error({
            message: err?.message || "خطا در حذف",
            placement: "bottomLeft",
          });
        },
      })
  };

  const columns = [
    {
      title: "ردیف",
      render: (text, value, i) => {
        return i + 1;
      },
    },
    {
      title: "منوی پدر",
      dataIndex: "parentName",
      render: (item) => <>{item ?? "-"}</>,
    },
    {
      title: "عنوان",
      dataIndex: "title",
    },
    {
      title: "کلید",
      dataIndex: "key",
    },
    {
      title: "عملیات",
      dataIndex: "parentId",
      render: (text, value) => (
        <div className="table-action-section">
          <Tooltip title=" لیست منابع">
            <Button>
              <Link
                to={{
                  pathname: `menu/${selectedClientId}/resources/${value.id}`,
                }}
                state={{id: value.id}}
              >
                <AiOutlineOrderedList/>
              </Link>
            </Button>
          </Tooltip>
          <Popconfirm
            title="آیا از حذف منو اطمینان دارید؟"
            onConfirm={() => handleDelete(value)}
          >
            <Button>
              <AiOutlineDelete/>
            </Button>
          </Popconfirm>
          <Tooltip title="ویرایش">
            <Button onClick={() => setState(value)}>
              <AiFillEdit/>
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  function handleBack(needRefresh) {
    if (needRefresh) {
      responseMenuRefetch();
    }
    setState("");
  }

  if (state === "new") {
    return <CUMenu onBack={handleBack} clientId={selectedClientId}/>;
  }

  if (state) {
    return (
      <CUMenu
        onBack={handleBack}
        clientId={selectedClientId}
        selectedMenu={state}
      />
    );
  }

  return (
    <div className="menu-section">
      <h3>سامانه:</h3>
      {clientsStatus === "error" ? (
        <ErrorSection handleRefresh={clientsRefetch}/>
      ) : clientsStatus === "loading" ? (
        <div className="skeleton-section">
          <Skeleton.Input active className="skeleton"/>
        </div>
      ) : clientsStatus === "success"/* && clientsData?.data*/ ? (
        <div className="client-section">
          <AutoComplete
            onSelect={(value, item) => {
              setSelectedClientId(item.key);
              navigate(`/menu/${item.key}`);
            }}
            filterOption={(inputValue, option) =>
              option.children.includes(inputValue)
            }
            placeholder={"سامانه را انتخاب کنید"}
            className="menu-client-autocomplete"
            defaultValue={
              clientsData?.data?.find((client) => {
                return client?.id === selectedClientId;
              })?.description
            }
          >
            {clientsData?.data
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
        </div>
      ) : (
        <>...</>
      )}
      {selectedClientId && (
        <>
          <h4>لیست منو ها</h4>
          <Table
            columns={columns}
            dataSource={responseMenu?.data}
            loading={status === "loading"}
            rowKey={"id"}
          />
        </>
      )}
      <CrudBtn
        onNew={() => {
          setState("new");
        }}
      />
    </div>
  );
};

export default ManageSystemMenu;
