import { Form, notification } from "antd";
import RenderElement from "components/RenderElement/RenderElement";
import React from "react";
import { useMutation } from "react-query";
import { useAuth } from "utils/hooks/useAuth";
import { FormButtons } from "../Buttons/Buttons";

const CrudResourcesType = ({ onBack, selectedResource, isCreate }) => {
  const { sendRequest } = useAuth();
  const [form] = Form.useForm();
  const { isLoading, mutate } = useMutation({
    mutationFn: sendRequest,
    onSuccess: () => {
      notification.success({
        message: "تغییرات با موفقیت اعمال شد",
        placement: "bottomLeft",
      });
      onBack(true);
    },
    onError: () => {
      notification.error({
        message: "خطا در اعمال تغییرات",
        placement: "bottomLeft",
      });
    },
  });

  const submitHandler = (data) => {
    mutate({
      method: isCreate ? "POST" : "PUT",
      endpoint: "resource-types/",
      data: {
        ...(isCreate ? {} : { id: selectedResource.id }),
        ...data,
      },
    });
  };

  const ITEMS = [
    {
      label: "عنوان",
      name: "title",
      type: "text",
      defaultValue: selectedResource.title,
    },
  ];

  return (
    <Form onFinish={submitHandler}>
      {ITEMS.map((item) => (
        <RenderElement searchForm={form} {...item} />
      ))}
      <FormButtons onBack={onBack} isUpdating={isLoading} />
    </Form>
  );
};

export default CrudResourcesType;
