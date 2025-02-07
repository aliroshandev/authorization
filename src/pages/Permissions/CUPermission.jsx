import { Form } from "antd";
import RenderElement from "components/RenderElement/RenderElement";
import React from "react";
import { useMutation } from "react-query";
import { useAuth } from "utils/hooks/useAuth";
import { FormButtons } from "../Buttons/Buttons";
import {useNavigate} from "react-router-dom";


const CUPermission = ({ onBack, selectedPermission }) => {
  const { sendRequest } = useAuth();
  const { mutate } = useMutation({
    mutationFn: sendRequest,
  });
  const isCreate = selectedPermission === "new";
  const [menuForm] = Form.useForm();
  const navigate = useNavigate();

  const ITEMS = [
    {
      label: "عنوان",
      name: "title",
      type: "text",
      defaultValue: isCreate ? "" : selectedPermission.title,
    },
  ];

  async function onSubmit(values) {
    const { title } = values
    // const temp = menuForm.getFieldsValue();
    mutate({
      method: isCreate ? "post" : "PUT",
      endpoint: "permissions",
      data: {
        ...(isCreate ? {} : {id: selectedPermission.id}),
        ...{
          title: title ?? selectedPermission.title, 
          key: title ?? selectedPermission.title, 
        }
      },
    },
    {
      onSuccess: (res) => {
        window.location.reload();
      },
      onError: (err) => {
        console.log(err)
        alert(err)
      }
    });
  }

  return (
    <Form form={menuForm} onFinish={onSubmit}>
      {ITEMS.map((item, index) => (
        <RenderElement key={"CUPERM_" + (index)} searchForm={menuForm} {...item} />
      ))}

      <FormButtons onBack={onBack} />
    </Form>
  );
};

export default CUPermission;
