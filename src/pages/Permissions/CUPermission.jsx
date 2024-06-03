import { Form } from "antd";
import RenderElement from "components/RenderElement/RenderElement";
import React from "react";
import { useMutation } from "react-query";
import { useAuth } from "utils/hooks/useAuth";
import { FormButtons } from "../Buttons/Buttons";

const CUPermission = ({ onBack, selectedPermission }) => {
  const { sendRequest } = useAuth();
  const { mutate } = useMutation({
    mutationFn: sendRequest,
  });
  const isCreate = selectedPermission === "new";
  const [menuForm] = Form.useForm();

  const ITEMS = [
    {
      label: "عنوان",
      name: "title",
      type: "text",
      defaultValue: isCreate ? "" : selectedPermission.title,
    },
  ];

  async function onSubmit(values) {
    const temp = menuForm.getFieldsValue();
    mutate({
      method: isCreate ? "post" : "PUT",
      endpoint: "api/permissions",
      data: {
        ...(isCreate ? {} : { id: selectedPermission.id }),
        ...temp,
      },
    });
  }
  return (
    <Form form={menuForm} onFinish={onSubmit}>
      {ITEMS.map((item) => (
        <RenderElement searchForm={menuForm} {...item} />
      ))}

      <FormButtons onBack={onBack} />
    </Form>
  );
};

export default CUPermission;
