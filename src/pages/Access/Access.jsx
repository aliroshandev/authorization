import React, {useEffect, useRef, useState} from "react";
import {AutoComplete, Button, Col, notification, Row, Skeleton} from "antd";
import "./Access.scss";
import ErrorSection from "components/ErrorSection/ErrorSection";
import {SubmitBtn} from "../Buttons/Buttons";
import {AiOutlineTable} from "react-icons/ai";
import {HiOutlineRefresh} from "react-icons/hi";
import {useAuth} from "utils/hooks/useAuth";
import {useMutation, useQuery} from "react-query";

const Access = () => {
  const [selectedClientId, setSelectedClientId] = useState();
  const [selectedMenuId, setSelectedMenuId] = useState();
  const [selectedRoleId, setSelectedRoleId] = useState();
  const [showAccessTable, setShowAccessTable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [allValues, setAllValues] = useState({});
  const {getApi, sendRequest} = useAuth();
  const {isLoading, mutate} = useMutation({
    mutationFn: sendRequest,
  });

  const tableHeader = useRef();

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

  // const {
  //   data: resources,
  //   status: resourcesStatus,
  //   refetch: resourcesRefetch,
  // } = useQuery(`/resource-permission/find-by-menu-id/${selectedMenuId}`,
  //   getApi,
  //   {
  //     enabled: !!selectedMenuId,
  //   });

  const {
    data: resources,
    status: resourcesStatus,
    refetch: resourcesRefetch,
  } = useQuery(`/resources/menu-id/${selectedMenuId}`,
    getApi,
    {
      enabled: !!selectedMenuId,
    });

  const {
    data: roles,
    status: rolesStatus,
    refetch: rolesRefetch,
  } = useQuery(`/roles/client-id?clientId=${selectedClientId}&pageSize=100&currentPage=1`,
    getApi,
    {
      enabled: !!selectedClientId,
    });

  const {
    data: permissions,
    // status: permissionsStatus,
    refetch: permissionsRefetch,
  } = useQuery(
    "/permissions?pageSize=100&currentPage=1",
    getApi
  );

  const {
    data: accessRole,
    // status: accessRoleStatus,
    refetch: accessRoleRefetch,
  } = useQuery(`/access/role/${selectedRoleId}`,
    getApi,
    {
      enabled: !!selectedRoleId,
    });

  useEffect(() => {
    const currentPermissions = [];
    if (accessRole?.data && resources?.data && permissions?.data) {
      accessRole.data.map((item) => {
        currentPermissions.push(item.resourcePermissionId);
      });
      resources?.data?.map((resource) => {
        permissions?.data?.rows?.map((permission) => {
          const resourceTypePermission = resource.permissionDtoList;
          // let isChecked = false;
          let selectedPermission = resourceTypePermission?.find(
            (rtp) => rtp.title === permission.title
          );

          accessRole.data.find((accessRoleItem) => {
            if (selectedPermission?.resourcePermissionId)
              if (
                selectedPermission.resourcePermissionId ===
                accessRoleItem.resourcePermissionId
              ) {
                let temp = {...allValues};
                temp[resource.id] = {
                  resourceTypePermissionUuidList: [...currentPermissions],
                };
                setAllValues((p) => {
                  return {...p, ...temp};
                });
                // isChecked = true;
              }
          });
        });
      });

      // setCurrentAccess(accessRole?.data);
    }
  }, [allValues, accessRole, resources, permissions]);

  // const {
  //   data: avalablePermissions,
  //   status: avalablePermissionsStatus,
  //   refetch: avalablePermissionsRefetch,
  // } =
  // useGetApiCall({
  //   endpoint: `/resource-permission/find-by-menu-id/${selectedMenuId}`,
  //   enabled: !!selectedMenuId,
  // });

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
    for (let [, values] of Object.entries(allValues)) {
      let temp = {
        // resourceId: key,
        resourcePermissions: values.resourceTypePermissionUuidList,
        roleId: selectedRoleId,
      };
      data.push(temp);
    }
    console.log(data);
    setIsUpdating(true);
    mutate({
        method: "POST",
        endpoint: "access/save-all",
        data: data[0],
      },
      {
        onSuccess: (res) => {
          setIsUpdating(false);
          notification.success({
            message: "عملیات با موفقیت انجام شد",
            placement: "bottomLeft",
          });
        },
        onError: (err) => {
          setIsUpdating(false);
          notification.error({
            message: "خطا در انجام عملیات",
            placement: "bottomLeft",
          });
        }
      });
  }

  return (
    <div className="access-section">
      <Row>
        <Col md={8}>
          <div className="client-section">
            <h3>سامانه:</h3>
            {clientsStatus === "error" ? (
              <ErrorSection handleRefresh={clientsRefetch}/>
            ) : clientsStatus === "loading" ? (
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
            <h3>منو:</h3>
            {menusStatus === "error" ? (
              <ErrorSection handleRefresh={menusRefetch}/>
            ) : menusStatus === "loading" ? (
              <Skeleton.Input active/>
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
              <ErrorSection handleRefresh={rolesRefetch}/>
            ) : rolesStatus === "loading" ? (
              <Skeleton.Input active/>
            ) : (
              <AutoComplete
                // value={
                //   roles?.data?.rows.length < 1 &&
                //   "نقشی برای این سامانه تعریف نشده است!"
                // }
                className="search-form"
                onSelect={(value, item) => {
                  setSelectedRoleId(item.key);
                }}
                filterOption={(inputValue, option) =>
                  option.children.includes(inputValue)
                }
                placeholder={"نقش را انتخاب کنید"}
                disabled={showAccessTable || roles?.data?.length < 1}
                allowClear
              >
                {roles?.data?.map((client) => {
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
      {resourcesStatus === "error" ? (
        <ErrorSection handleRefresh={resourcesRefetch}/>
      ) : resourcesStatus === "loading" ? (
        <Skeleton active/>
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
                      <td className="bold-text">{resource.resourceName}</td>
                      {permissions?.data?.rows?.map((permission) => {
                        const resourceTypePermission =
                          resource.permissionDtoList;
                        let selectedPermission = resourceTypePermission?.find(
                          (rtp) => rtp.title === permission.title
                        );

                        if (selectedPermission) {
                          return (
                            <td key={permission.permissionTitle}>
                              <input
                                type="checkbox"
                                checked={allValues?.null?.resourceTypePermissionUuidList?.find(
                                  (accessRoleItem) => {
                                    if (
                                      selectedPermission?.resourcePermissionId
                                    )
                                      if (
                                        selectedPermission.resourcePermissionId ===
                                        accessRoleItem
                                      ) {
                                        return true;
                                      }
                                  }
                                )}
                                value={`${selectedPermission.resourcePermissionId}`}
                                onChange={(e) => {
                                  let temp = {...allValues};
                                  temp[resource.id] = togglePermission(
                                    selectedPermission.resourcePermissionId,
                                    temp[resource.id]
                                  );
                                  setAllValues((p) => {
                                    return {...p, ...temp};
                                  });
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
                  isUpdating={isUpdating}
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
