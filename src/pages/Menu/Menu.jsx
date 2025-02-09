import { AutoComplete, Button, Skeleton, Table, Tooltip } from "antd";
import { useState } from "react";
import CrudBtn from "components/CrudBtn/CrudBtn";
import CUMenu from "./CUMenu";
import "./Menu.scss";
import ErrorSection from "components/ErrorSection/ErrorSection";
import {
  AiOutlineOrderedList,
  AiOutlineDelete,
  AiFillEdit,
} from "react-icons/ai";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { useAuth } from "utils/hooks/useAuth";

const ManageSystemMenu = () => {
  const { id } = useParams();
  const { getApi } = useAuth();
  const [state, setState] = useState("");
  const [selectedClientId, setSelectedClientId] = useState(id);

  const navigate = useNavigate();
  const {
    response: clientsData,
    status: clientsStatus,
    refetchApi: clientsRefetch,
  } = useQuery("/clients", getApi);

  const {
    response: responseMenu,
    status,
    refetchApi: responseMenuRefetch,
  } = useQuery(`/menus/client-id?clientId=${selectedClientId}`, getApi, {
    enabled: !!selectedClientId,
  });

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
      title: "مسیر",
      dataIndex: "path",
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
                  pathname: `/management/resources/${value.id}`,
                  state: { clientId: selectedClientId },
                }}
                state={{ id: value.id }}
              >
                <AiOutlineOrderedList />
              </Link>
            </Button>
          </Tooltip>
          <Button>
            <AiOutlineDelete />
          </Button>
          <Tooltip title="ویرایش">
            <Button onClick={() => setState(value)}>
              <AiFillEdit />
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
    return <CUMenu onBack={handleBack} clientId={selectedClientId} />;
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
      {clientsStatus === "rejected" ? (
        <ErrorSection handleRefresh={clientsRefetch} />
      ) : clientsStatus === "pending" ? (
        <div className="skeleton-section">
          <Skeleton.Input active className="skeleton" />
        </div>
      ) : clientsStatus === "resolved" && clientsData ? (
        <div className="client-section">
          <AutoComplete
            onSelect={(value, item) => {
              setSelectedClientId(item.key);
              navigate(`/management/menu/${item.key}`);
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
            loading={status === "pending"}
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
