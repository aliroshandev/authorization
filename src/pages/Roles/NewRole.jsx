import { Button, Form } from "antd";
import RenderElement from "base/components/RenderElement/RenderElement";
import { useGetApiCall } from "base/hooks/useGetApiCall";
import { asyncHttpRequest } from "base/services/asyncHttpRequest";
import { useState } from "react";

function NewRole({ setIsAddPushed }) {
  const [roleForm] = Form.useForm();
  const [roleId, setRoleId] = useState();
  const [resourceId, setResourceId] = useState();

  const { response: resources } = useGetApiCall({
    endpoint: "api/resources?pageSize=100&currentPage=1",
  });
  const { response: role } = useGetApiCall({
    endpoint: "api/roles?pageSize=100&currentPage=1",
  });

  const ITEMS = [
    {
      label: "نقش",
      name: "roleId",
      type: "autocomplete",
      data: role?.data || [],
      autoCompleteValue: "id",
      autoCompleteTitle: "name",
      handleChange(...rest) {
        setRoleId(rest[1]?.key);
      },
    },
    {
      label: "منبع",
      name: "resourceId",
      type: "autocomplete",
      data: resources?.data?.rows || [],
      autoCompleteValue: "id",
      autoCompleteTitle: "title",
      handleChange(...rest) {
        setResourceId(rest[1]?.key);
      },
    },
  ];

  const submitHandler = () => {
    asyncHttpRequest({
      method: "POST",
      endpoint: "api/role-resources/",
      data: {
        roleId,
        resourceId,
      },
    });
    // setIsAddPushed(false);
  };

  return (
    <Form onFinish={submitHandler}>
      {ITEMS.map((item) => (
        <RenderElement searchForm={roleForm} {...item} />
      ))}
      <Button htmlType="submit" type="primary">
        ذخیره
      </Button>
    </Form>
  );
}

export default NewRole;
