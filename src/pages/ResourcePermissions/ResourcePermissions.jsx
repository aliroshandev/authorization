import React, {useEffect, useRef, useState} from "react";
import {AutoComplete, Button, Col, notification, Row, Skeleton} from "antd";
import "./ResourcePermissions.scss";
import {SubmitBtn} from "../Buttons/Buttons";
import {AiOutlineTable} from "react-icons/ai";
import {HiOutlineRefresh} from "react-icons/hi";
import {useAuth} from "../../utils/hooks/useAuth";
import {useMutation, useQuery} from "react-query";
import ErrorSection from "../../components/ErrorSection/ErrorSection";

const ResourcePermissions = () => {
    const [selectedClientId, setSelectedClientId] = useState();
    const [selectedMenuId, setSelectedMenuId] = useState();
    // const [selectedRoleId, setSelectedRoleId] = useState();
    const [showAccessTable, setShowAccessTable] = useState(false);
    const [allValues, setAllValues] = useState({});

    const tableHeader = useRef();
    const {getApi, sendRequest} = useAuth();
    const {isLoading: isUpdating, mutate} = useMutation({
        mutationFn: sendRequest,
    });

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

    const {
        data: resources,
        status: resourcesStatus,
        refetch: resourcesRefetch,
    } = useQuery(`/resources/menu-id/${selectedMenuId}`, getApi, {
        enabled: !!selectedMenuId,
    });

    const {
        data: resourcePermissions,
        // status: resourcePermissionssStatus,
        // refetch: resourcePermissionssRefetch,
    } = useQuery(`/resource-permission/find-by-menu-id/${selectedMenuId}`, getApi, {
        enabled: !!selectedMenuId,
    });

    const {
        data: permissions,
        // status: permissionsStatus,
        // refetch: permissionsRefetch,
    } = useQuery("/permissions?pageSize=100&currentPage=1", getApi);

    async function fillPermissionsToAllData(objectModal) {
        setAllValues(p => {
            Object.assign(p, objectModal);
            return p;
        });
    }

    useEffect(() => {
        if (resourcePermissions?.data && resources?.data && permissions?.data) {
            resourcePermissions.data.map((resource) => {
                const currentPermissions = resource.permissionDtoList.map((dtoItem) => dtoItem?.id) ?? [];

                permissions.data.rows?.map((permission) => {
                    const resourcePermissionDTO = resource.permissionDtoList;
                    let selectedPermission = resourcePermissionDTO?.find(
                        (rtp) => rtp.title === permission.title
                    );

                    resourcePermissions.data.find((resourcePermissionsItem) => {
                        if (selectedPermission?.resourcePermissionId)
                            resourcePermissionsItem.permissionDtoList.map((item) => {
                                if (selectedPermission.id === item?.id) {
                                    let temp = {...allValues};
                                    temp[resource.resourceId] = {
                                        permissions: [...currentPermissions],
                                    };

                                    fillPermissionsToAllData(temp)
                                        .then()
                                        .catch((e) => {})
                                    // wholeDataSelected[resource.resourceId] = {
                                    //     permissions: currentPermissions ?? [],
                                    // };
                                }
                            });
                    });
                });
            });
            // setCurrentAccess(resourcePermissions?.data);
        }
    }, [allValues, resourcePermissions?.data, resources?.data, permissions?.data, setAllValues]);

    function togglePermission(permissionId, objectData) {
        if (
            !objectData ||
            Object.keys(objectData).length === 0 ||
            !objectData.permissions ||
            objectData.permissions.length === 0
        ) {
            return {
                permissions: [permissionId],
            };
        }
        if (objectData.permissions.includes(permissionId)) {
            return {
                permissions:
                    objectData.permissions.filter(
                        (item) => item !== permissionId
                    ),
            };
        }
        return {
            permissions: [
                ...objectData.permissions,
                permissionId,
            ],
        };
    }

    function handleSave() {
        let data = [];
        for (let [key, values] of Object.entries(allValues)) {
            let temp = {
                resourceId: key,
                permissions: values.permissions,
            };
            data.push(temp);
        }
        mutate({
            method: "POST",
            endpoint: `resource-permission/save-all?menuId=${selectedMenuId}`,
            data,
        }, {
            onSuccess: (res) => {
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
        })
    }

    const isChecked = ({allValues, resourceId, permissionId}) => {
        // console.log(resourceId, permissionId);
        let result = false;
        [allValues]?.map((item) => {
            if (!item[resourceId]) result = false;
            if (!item[resourceId]?.permissions) result = false;

            result = item[resourceId]?.permissions?.find(
                (selectedPermissionId) => {
                    return (permissionId === selectedPermissionId);
                }
            );
        });
        return result;
    };

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
            </Row>
            {selectedMenuId && selectedClientId && (
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
                                            <td className="bold-text">{resource.title}</td>
                                            {permissions?.data?.rows?.map((permission) => {
                                                // const resourcePermission =
                                                //   resource.permissionDtoList;
                                                // let selectedPermission = resourcePermission?.find(
                                                //   (rtp) => rtp.title === permission.title
                                                // );
                                                // const ic = isChecked({
                                                //   allValues,
                                                //   resource,
                                                //   permission,
                                                // });

                                                // console.log("ic", ic);

                                                return (
                                                    <td key={resource.id + '_' + permission.id}>
                                                        <input
                                                            type="checkbox"
                                                            value={`${permission?.id}`}
                                                            onChange={(e) => {
                                                                let temp = {...allValues};
                                                                temp[resource?.id] = togglePermission(
                                                                    permission?.id,
                                                                    temp[resource?.id]
                                                                );
                                                                setAllValues((p) => ({...p, ...temp}));
                                                            }}
                                                            checked={isChecked({
                                                                allValues,
                                                                resourceId: resource?.id,
                                                                permissionId: permission?.id,
                                                            })}
                                                            // checked={allValues[
                                                            //   resource?.id
                                                            // ]?.permissions?.find(
                                                            //   (resourcePermissionsItem) => {
                                                            //     debugger;
                                                            //     if (permission?.id === resourcePermissionsItem)
                                                            //       return true;
                                                            //   }
                                                            // )}
                                                        />
                                                    </td>
                                                );
                                                // const resourcePermission =
                                                //   resource.resourcePermissions;
                                                // let selectedPermission = resourcePermission?.find(
                                                //   (rtp) => rtp.permissionTitle === permission.title
                                                // );
                                                // if (selectedPermission) {
                                                //   return (
                                                //     <td key={permission.permissionTitle}>
                                                //       <input
                                                //         type="checkbox"
                                                //         value={`${selectedPermission.id}`}
                                                //         onChange={(e) => {
                                                //           let temp = { ...allValues };
                                                //           temp[resource.id] = togglePermission(
                                                //             selectedPermission.id,
                                                //             temp[resource.id]
                                                //           );
                                                //           setAllValues((p) => ({ ...p, ...temp }));
                                                //         }}
                                                //       />
                                                //     </td>
                                                //   );
                                                // } else {
                                                //   return (
                                                //     <td key={permission.permissionTitle}>---</td>
                                                //   );
                                                // }
                                            })}
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                            <div className="FormButtons">
                                <SubmitBtn
                                    disabled={!selectedMenuId}
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

export default ResourcePermissions;
