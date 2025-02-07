import React, { useEffect, useState } from "react";
import { AutoComplete, Col, Row, Skeleton } from "antd";
// import { useGetApiCall } from "base/hooks/useGetApiCall";
import "./ShowAccess.scss";
import { useQuery } from "react-query";
import { useAuth } from "utils/hooks/useAuth";

const ShowAccess = () => {
  const { getApi } = useAuth();
  const [selectedClientId, setSelectedClientId] = useState("");

  const { data: clients, status: clientsStatus } = useQuery(
    "clients",
    getApi
  );

  return (
    <div className="show-access-section">
      <Row>
        <Col md={8}>
          <div className="client-section">
            <h3>سامانه:</h3>
            {clientsStatus === "pending" ? (
              <Skeleton.Input active />
            ) : (
              <AutoComplete
                className="search-form"
                onSelect={(value, item) => {
                  setSelectedClientId(item.key);
                  console.log(value, item)
                }}
                filterOption={(inputValue, option) =>
                  option.children.includes(inputValue)
                }
                placeholder={"سامانه را انتخاب کنید"}
                allowClear
                style={{
                  width: 200,
                }}
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
            <h3>منو:</h3>
            <AutoComplete
              className="search-form"
              // onSelect={(value, item) => {
              //   setSelectedMenuId(item.key);
              // }}
              filterOption={(inputValue, option) =>
                option.children.includes(inputValue)
              }
              placeholder={"منو را انتخاب کنید"}
              // disabled={showAccessTable}
              allowClear
            >
              {/* {menus?.data?.map((client) => {
                return (
                  <AutoComplete.Option key={client.id} value={client.title}>
                    {`${client.title}`}
                  </AutoComplete.Option>
                );
              })} */}
            </AutoComplete>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ShowAccess;
