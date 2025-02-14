import React, {useState} from "react";
import {AutoComplete, Button, Col, Row, Skeleton} from "antd";
// import { useGetApiCall } from "base/hooks/useGetApiCall";
import "./ShowAccess.scss";
import {useQuery} from "react-query";
import {useAuth} from "utils/hooks/useAuth";
import {AiOutlineTable} from "react-icons/ai";

const ShowAccess = () => {
  const {getApi} = useAuth();
  const [selectedClientId, setSelectedClientId] = useState("");

  const {data: clients, status: clientsStatus} = useQuery(
    "/clients",
    getApi
  );

  const {
    response: roles,
    status: rolesStatus,
    refetchApi: rolesRefetch,
  } = useQuery(
    `/roles/client-id?clientId=${selectedClientId}&pageSize=100&currentPage=1`,
    getApi,
    {
      enabled: !!selectedClientId,
    });

  return (
    <div className="access-section">
      <Row>
        <Col md={8}>
          <div className="client-section">
            <h3>سامانه:</h3>
            {clientsStatus === "rejected" ? (
              <ErrorSection handleRefresh={clientsRefetch}/>
            ) : clientsStatus === "pending" ? (
              <Skeleton.Input active/>
            ) : (
              <AutoComplete
                className="search-form"
                onSelect={(value, item) => {
                  setSelectedClientId(item.key);
                }}
                filterOption={(inputValue, option) =>
                  option.children.includes(inputValue)
                }
                placeholder={"سامانه را انتخاب کنید"}
                disabled={showAccessTable}
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
            )}
          </div>
        </Col>

        <Col md={8}>
          <div className="client-section">
            <h3>نقش:</h3>
            {rolesStatus === "rejected" ? (
              <ErrorSection handleRefresh={rolesRefetch}/>
            ) : rolesStatus === "pending" ? (
              <Skeleton.Input active/>
            ) : (
              <AutoComplete
                className="search-form"
                onSelect={(value, item) => {
                  setSelectedRoleId(item.key);
                }}
                filterOption={(inputValue, option) =>
                  option.children.includes(inputValue)
                }
                placeholder={"نقش را انتخاب کنید"}
                disabled={showAccessTable}
                allowClear
              >
                {roles?.data?.rows?.map((client) => {
                  return (
                    <AutoComplete.Option key={client.id} value={client.name}>
                      {`${client.name}`}
                    </AutoComplete.Option>
                  );
                })}
              </AutoComplete>
            )}
          </div>
        </Col>
      </Row>
      {selectedRoleId && (
        <div className="control-button">
          <Button
            type="primary"
            onClick={() => setShowAccessTable(true)}
            disabled={showAccessTable}
          >
            مشاهده
            <AiOutlineTable/>
          </Button>
          <Button
            type="danger"
            onClick={() => setShowAccessTable(false)}
            disabled={!showAccessTable}
          >
            انتخاب مجدد
            <HiOutlineRefresh/>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ShowAccess;
