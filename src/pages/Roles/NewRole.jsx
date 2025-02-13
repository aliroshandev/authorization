import { Button, Form } from "antd";
import RenderElement from "base/components/RenderElement/RenderElement";
import { useGetApiCall } from "base/hooks/useGetApiCall";
import { asyncHttpRequest } from "base/services/asyncHttpRequest";
import { useState } from "react";

function NewRole({ setIsAddPushed }) {
  const [roleForm] = Form.useForm();
  const [roleId, setRoleId] = useState();
  const [resourceId, setResourceId] = useState();

  const { data: resources } = useGetApiCall({
    endpoint: "resources?pageSize=100&currentPage=1",
  });
  const { data: role } = useGetApiCall({
    endpoint: "roles?pageSize=100&currentPage=1",
  });

  const ITEMS = [
    {
      label: "نقش",
      name: "roleId",
      type: "autocomplete",
      data: role?.data || [],
      autoCompleteValue: "id",
      autoCompleteTitle: "name",
      onChange: (...rest) => {
        setRoleId(rest[0]?.value);
      },
    },
    {
      label: "منبع",
      name: "resourceId",
      type: "autocomplete",
      data: resources?.data?.rows || [],
      autoCompleteValue: "id",
      autoCompleteTitle: "title",
      onChange: (...rest) => {
        setResourceId(rest[0]?.value);
      },
    },
  ];

  const submitHandler = () => {
    asyncHttpRequest({
      method: "POST",
      endpoint: "role-resources/",
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
