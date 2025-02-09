import {Col, Form, notification, Row} from "antd";
import RenderElement from "components/RenderElement/RenderElement";
import React, {useEffect, useState} from "react";
import {useMutation} from "react-query";
import {useAuth} from "utils/hooks/useAuth";
import {FormButtons} from "../Buttons/Buttons";
import {useNavigate} from "react-router-dom";


const CUPermission = ({onBack, selectedPermission, refetch}) => {
  const {sendRequest} = useAuth();
  const {mutate} = useMutation({
    mutationFn: sendRequest,
  });
  const isCreate = selectedPermission === "new";
  const [isUpdating, setIsUpdating] = useState(false);
  const [menuForm] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedPermission) {
      menuForm.setFieldsValue({
        title: selectedPermission?.title,
        key: selectedPermission?.key,
      });
    }
  }, [selectedPermission]);

  const ITEMS = [
    {
      label: "عنوان",
      name: "title",
      type: "text",
      size: 12,
      rules: [
        {
          required: true,
          message: "این فیلد اجباری است",
        },
      ],
      defaultValue: isCreate ? "" : selectedPermission.title,
    },
    {
      label: "کلید",
      name: "key",
      type: "text",
      size: 12,
      rules: [
        {
          required: true,
          message: "این فیلد اجباری است",
        },
      ],
      defaultValue: isCreate ? "" : selectedPermission.key,
    },
    {
      label: "آدرس",
      name: "url",
      type: "text",
      size: 12,
      rules: [
        {
          required: true,
          message: "این فیلد اجباری است",
        },
      ],
      defaultValue: isCreate ? "" : selectedPermission.title,
    },
    {
      label: "متد درخواست",
      name: "httpRequestMethod",
      type: "text",
      size: 12,
      rules: [
        {
          required: true,
          message: "این فیلد اجباری است",
        },
      ],
      defaultValue: isCreate ? "" : selectedPermission.title,
    },
  ];

  async function onSubmit(values) {
    const {title} = values
    const temp = menuForm.getFieldsValue();
    mutate({
        method: isCreate ? "post" : "PUT",
        endpoint: "permissions",
        data: {
          ...(isCreate ? {} : {id: selectedPermission.id}),
          ...temp,
          // ...{
          //   title: title ?? selectedPermission.title,
          //   key: title ?? selectedPermission.title,
          // }
        },
      },
      {
        onSuccess: (res) => {
          notification.success({
            message: "عملیات با موفقیت انجام شد",
            placement: "bottomLeft",
          });
          refetch();
          setIsUpdating(false);
          onBack();
        },
        onError: (err) => {
          console.log(err)
          alert(err)
        }
      });
  }

  return (
    <Form form={menuForm} onFinish={onSubmit}>
      <Row gutter={[16]}>
        {ITEMS.map((item) => (
          <Col key={item.name} span={item.size}>
            <RenderElement searchForm={menuForm} {...item} />
          </Col>
        ))}
      </Row>

      <FormButtons onBack={onBack} isUpdating={isUpdating}/>
    </Form>
  );
};

export default CUPermission;
