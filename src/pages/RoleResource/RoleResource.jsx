import React, { useMemo, useState } from "react";
import { Button, Col, Form, notification, Row } from "antd";
import RenderElement from "components/RenderElement/RenderElement";
import { useAuth } from "utils/hooks/useAuth";
import { useMutation, useQuery } from "react-query";

const RoleResource = () => {
  const { sendRequest, getApi } = useAuth();
  const [form] = Form.useForm();
  const [selectedClientId, setSelectedClientId] = useState();
  const [selectedMenuId, setSelectedMenuId] = useState();
  const [resourceId, setResourceId] = useState();
  const [roleId, setRoleId] = useState();

  const { response: clients } = useQuery("clients", getApi, {
    staleTime: Infinity,
    cacheTime: Infinity,
  });
  const { response: menus } = useQuery(
    `menus/client-id?clientId=${selectedClientId}`,
    getApi,
    {
      enabled: !!selectedClientId,
    }
  );
  const { response: resources } = useQuery(
    `resources/menu-id?menuId=${selectedMenuId}`,
    getApi,
    {
      enabled: !!selectedMenuId,
    }
  );

  const { response: roles } = useQuery("roles", getApi, {
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  const { isLoading: isUpdating, mutate } = useMutation({
    mutationFn: sendRequest,
    onSuccess: () =>
      notification.success({
        message: "عملیات با موفقیت انجام شد",
        placement: "bottomLeft",
      }),
    onError: () =>
      notification.error({
        message: "خطا در انجام عملیات",
        placement: "bottomLeft",
      }),
  });

  const ITEMS = useMemo(
    () => [
      {
        label: "سامانه",
        name: "clientId",
        type: "autocomplete",
        data: clients?.data || [],
        autoCompleteValue: "id",
        autoCompleteTitle: "client",
        handleChange(...rest) {
          setSelectedClientId(rest[1]?.key);
        },
        size: 12,
      },
      {
        label: "منو",
        name: "menuId",
        type: !!selectedClientId ? "autocomplete" : "text",
        data: menus?.data || [],
        autoCompleteValue: "id",
        autoCompleteTitle: "title",
        handleChange(...rest) {
          setSelectedMenuId(rest[1]?.key);
        },
        isDisabled: !!selectedClientId ? false : true,
        size: 12,
      },
      {
        label: "منبع",
        name: "resourceId",
        type: !!selectedMenuId ? "autocomplete" : "text",
        data: resources?.data || [],
        autoCompleteValue: "id",
        autoCompleteTitle: "title",
        handleChange(...rest) {
          setResourceId(rest[1]?.key);
        },
        isDisabled: !!selectedMenuId ? false : true,
        size: 12,
      },
      {
        label: "نقش",
        name: "roleId",
        type: "autocomplete",
        data: roles?.data || [],
        autoCompleteValue: "id",
        autoCompleteTitle: "name",
        handleChange(...rest) {
          setRoleId(rest[1]?.key);
        },
        size: 12,
      },
    ],
    [
      clients?.data,
      menus?.data,
      resources?.data,
      roles?.data,
      selectedClientId,
      selectedMenuId,
    ]
  );

  async function submitHandler() {
    mutate({
      method: "POST",
      endpoint: "role-resources",
      data: {
        resourceId,
        roleId,
      },
    });
  }

  return (
    <>
      <Form onFinish={submitHandler}>
        <Row>
          {ITEMS.map((item) => (
            <Col md={item.size}>
              <RenderElement searchForm={form} {...item} />
            </Col>
          ))}
        </Row>
        <Button
          htmlType="submit"
          type="primary"
          disabled={roleId && resourceId ? false : true}
          loading={isUpdating}
        >
          ذخیره
        </Button>
      </Form>
    </>
  );
};

export default RoleResource;
