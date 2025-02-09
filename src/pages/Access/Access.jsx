import React, { useRef, useState } from "react";
import { Col, notification, Row, AutoComplete, Button, Skeleton } from "antd";
import "./Access.scss";
import ErrorSection from "components/ErrorSection/ErrorSection";
import { SubmitBtn } from "../Buttons/Buttons";
import { AiOutlineTable } from "react-icons/ai";
import { HiOutlineRefresh } from "react-icons/hi";
import { useAuth } from "utils/hooks/useAuth";
import { useMutation, useQuery } from "react-query";

const Access = () => {
  const { getApi, sendRequest } = useAuth();

  const [selectedClientId, setSelectedClientId] = useState();
  const [selectedMenuId, setSelectedMenuId] = useState();
  const [selectedRoleId, setSelectedRoleId] = useState();
  const [showAccessTable, setShowAccessTable] = useState(false);
  const [allValues, setAllValues] = useState({});

  const tableHeader = useRef();

  const {
    data: clients,
    status: clientsStatus,
    refetchApi: clientsRefetch,
  } = useQuery("/clients", getApi);

  const {
    data: menus,
    status: menusStatus,
    refetchApi: menusRefetch,
  } = useQuery(`/menus/client-id?clientId=${selectedClientId}`, getApi, {
    enabled: !!selectedClientId,
  });

  const {
    data: resources,
    status: resourcesStatus,
    refetchApi: resourcesRefetch,
  } = useQuery(`/resources/menu-id?menuId=${selectedMenuId}`, getApi, {
    enabled: !!selectedMenuId,
  });

  const {
    data: roles,
    status: rolesStatus,
    refetchApi: rolesRefetch,
  } = useQuery("/roles?pageSize=100&currentPage=1", getApi);

  const { data: permissions } = useQuery(
    "/permissions?pageSize=100&currentPage=1",
    getApi
  );

  const { isLoading, mutate } = useMutation({
    mutationFn: sendRequest,
    onSuccess: () => {
      notification.success({
        message: "عملیات با موفقیت انجام شد",
        placement: "bottomLeft",
      });
    },
    onError: () => {
      notification.error({
        message: "خطا در انجام عملیات",
        placement: "bottomLeft",
      });
    },
  });

  function togglePermission(id, objectData) {
    if (
      !objectData ||
      Object.keys(objectData).length === 0 ||
      !objectData.resourceTypePermissionUuidList ||
      objectData.resourceTypePermissionUuidList.length === 0
    ) {
      return {
        resourceTypePermissionUuidList: [id],
      };
    }
    if (objectData.resourceTypePermissionUuidList.includes(id)) {
      return {
        resourceTypePermissionUuidList:
          objectData.resourceTypePermissionUuidList.filter(
            (item) => item !== id
          ),
      };
    }
    return {
      resourceTypePermissionUuidList: [
        ...objectData.resourceTypePermissionUuidList,
        id,
      ],
    };
  }

  async function handleSave() {
    let data = [];
    for (let [key, values] of Object.entries(allValues)) {
      let temp = {
        resourceId: key,
        resourceTypePermissionUuidList: values.resourceTypePermissionUuidList,
        roleId: selectedRoleId,
      };
      data.push(temp);
    }
    mutate({
      method: "POST",
      endpoint: "access/save-all",
      data,
    });
  }

  return (
    <div className="access-section">
      <Row>
        <Col md={8}>
          <div className="client-section">
            <h3>سامانه:</h3>
            {clientsStatus === "error" ? (
              <ErrorSection handleRefresh={clientsRefetch} />
            ) : clientsStatus === "loading" ? (
              <Skeleton.Input active />
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
            <h3>منو:</h3>
            {menusStatus === "error" ? (
              <ErrorSection handleRefresh={menusRefetch} />
            ) : menusStatus === "loading" ? (
              <Skeleton.Input active />
            ) : (
              <AutoComplete
                className="search-form"
                onSelect={(value, item) => {
                  setSelectedMenuId(item.key);
                }}
                filterOption={(inputValue, option) =>
                  option.children.includes(inputValue)
                }
                placeholder={"منو را انتخاب کنید"}
                disabled={showAccessTable || !selectedClientId}
                allowClear
              >
                {menus?.data?.map((client) => {
                  return (
                    <AutoComplete.Option key={client.id} value={client.title}>
                      {`${client.title}`}
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
            {rolesStatus === "error" ? (
              <ErrorSection handleRefresh={rolesRefetch} />
            ) : rolesStatus === "loading" ? (
              <Skeleton.Input active />
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
      {selectedMenuId && selectedRoleId && (
        <div className="control-button">
          <Button
            type="primary"
            onClick={() => setShowAccessTable(true)}
            disabled={showAccessTable}
          >
            مشاهده
            <AiOutlineTable />
          </Button>
          <Button
            type="danger"
            onClick={() => setShowAccessTable(false)}
            disabled={!showAccessTable}
          >
            انتخاب مجدد
            <HiOutlineRefresh />
          </Button>
        </div>
      )}
      {resourcesStatus === "error" ? (
        <ErrorSection handleRefresh={resourcesRefetch} />
      ) : resourcesStatus === "loading" ? (
        <Skeleton active />
      ) : resourcesStatus === "success" && showAccessTable ? (
        <>
          {permissions?.data?.rows?.length > 0 ? (
            <>
              <table className="info-table">
                <thead>
                  <tr ref={tableHeader}>
                    <td>نام منابع</td>
                    {permissions?.data?.rows?.map((header) => (
                      <td key={header.id}>{header.title}</td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {resources?.data?.map((resource) => {
                    return (
                      <tr key={resource.id}>
                        <td className="bold-text">{resource.title}</td>
                        {permissions?.data?.rows?.map((permission) => {
                          const resourceTypePermission =
                            resource.resourceTypePermissions;
                          let selectedPermission = resourceTypePermission?.find(
                            (rtp) => rtp.permissionTitle === permission.title
                          );
                          if (selectedPermission) {
                            return (
                              <td key={permission.permissionTitle}>
                                <input
                                  type="checkbox"
                                  value={`${selectedPermission.id}`}
                                  onChange={(e) => {
                                    let temp = { ...allValues };
                                    temp[resource.id] = togglePermission(
                                      selectedPermission.id,
                                      temp[resource.id]
                                    );
                                    setAllValues((p) => ({ ...p, ...temp }));
                                  }}
                                />
                              </td>
                            );
                          } else {
                            return (
                              <td key={permission.permissionTitle}>---</td>
                            );
                          }
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="FormButtons">
                <SubmitBtn
                  disabled={!selectedMenuId || !selectedRoleId}
                  onSubmit={handleSave}
                  isUpdating={isLoading}
                />
              </div>
            </>
          ) : (
            <h3>منبعی وجود ندارد</h3>
          )}
        </>
      ) : null}
    </div>
  );
};

export default Access;
