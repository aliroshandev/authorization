import { Form, Row, Col, Checkbox, notification } from "antd";
import { useMemo, useState } from "react";
import { useForm } from "antd/es/form/Form";
import RenderElement from "components/RenderElement/RenderElement";
import { FormButtons } from "../Buttons/Buttons";
import { useAuth } from "utils/hooks/useAuth";
import { useMutation } from "react-query";

const englishCharRegex = /^[a-zA-Z0-9ـ ]+$/;

const RoleCrud = ({ selectedRole, onBack, clientId }) => {
  const { sendRequest } = useAuth();
  const { isLoading, mutate } = useMutation({
    mutationFn: sendRequest,
    onSuccess: () => {
      onBack(true);
      notification.success({
        message: "عملیات با موفقیت انجام شد",
        placement: "bottomLeft",
      });
    },
    onError: () =>
      notification.error({
        message: "خطا در انجام عملیات",
        placement: "bottomLeft",
      }),
  });
  const IS_CREATE = selectedRole === "create";
  const [roleForm] = useForm();
  const [isActive, setIsActive] = useState(!!selectedRole?.composite);

  const ITEMS = useMemo(
    () => [
      {
        name: "name",
        label: "نام انگلیسی",
        type: "text",
        size: 8,
        defaultValue: selectedRole?.name,
        rules: [
          {
            required: true,
            message: "وارد کردن نام انگلیسی الزامی میباشد",
          },
          {
            pattern: englishCharRegex,
            message: "از حروف انگلیسی باید استفاده شود",
          },
        ],
      },
      {
        name: "description",
        label: "نام فارسی",
        type: "text",
        size: 8,
        defaultValue: selectedRole?.description,
        rules: [
          {
            required: true,
            message: "وارد کردن نام فارسی الزامی میباشد",
          },
        ],
      },
    ],
    [selectedRole?.description, selectedRole?.name]
  );

  async function onSubmit(data) {
    let temp = {};
    for (let [key, value] of Object.entries(data)) {
      if (value) {
        temp[key] = value;
      }
    }
    mutate({
      method: IS_CREATE ? "POST" : "PUT",
      endpoint: "api/roles",
      data: {
        ...(!IS_CREATE && selectedRole),
        ...temp,
        composite: isActive,
        clientId,
      },
    });
  }

  return (
    <Form onFinish={onSubmit}>
      <Row>
        {ITEMS.map((item) => (
          <Col key={item.name} span={item.size}>
            <RenderElement searchForm={roleForm} {...item} />
          </Col>
        ))}
        <Col span={8} className="role-crud-checkbox">
          <Form.Item label={"فعال باشد"} name="composite">
            <Checkbox
              defaultChecked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
          </Form.Item>
        </Col>
      </Row>
      <FormButtons onBack={onBack} isUpdating={isLoading} />
    </Form>
  );
};

export default RoleCrud;
