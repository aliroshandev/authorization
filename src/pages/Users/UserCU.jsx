import { Form, Row, Col, notification } from "antd";
import { useMemo } from "react";
import { useForm } from "antd/es/form/Form";
import RenderElement from "components/RenderElement/RenderElement";
import { FormButtons } from "../Buttons/Buttons";
import { useMutation } from "react-query";
import { useAuth } from "../../utils/hooks/useAuth";

const englishCharRegex = /^[a-zA-Z0-9ـ ]+$/;

const UserCU = ({ selectedRole, onBack }) => {
  const { sendRequest } = useAuth();
  const { isLoading, mutate } = useMutation({
    mutationFn: sendRequest,
    // onSuccess: () => {
    //   onBack(true);
    //   notification.success({
    //     message: "عملیات با موفقیت انجام شد",
    //     placement: "bottomLeft",
    //   });
    // },

    // onError: () =>
    //   notification.error({
    //     message: "خطا در انجام عملیات",
    //     placement: "bottomLeft",
    //   }),
  });
  const IS_CREATE = selectedRole === "create";
  const [roleForm] = useForm();

  const ITEMS = useMemo(
    () => [
      {
        name: "firstName",
        label: "نام ",
        type: "text",
        size: 8,
        // defaultValue: selectedRole?.firstName,
      },
      {
        name: "lastName",
        label: "نام خانوادگی",
        type: "text",
        size: 8,
        // defaultValue: selectedRole?.lastName,
      },
      {
        name: "username",
        label: "نام کاربری",
        type: "text",
        size: 8,
        // defaultValue: selectedRole?.username,
        rules: [
          {
            required: true,
            message: "وارد کردن نام کاربری الزامی میباشد",
          },
          {
            pattern: englishCharRegex,
            message: "از حروف انگلیسی باید استفاده شود",
          },
        ],
      },
    ],
    [selectedRole?.firstName, selectedRole?.lastName, selectedRole?.username]
  );

  function onSubmit(data) {
    let temp = {};
    for (let [key, value] of Object.entries(data)) {
      if (value) {
        temp[key] = value;
      }
    }
    console.log(data)
    mutate({
      method: IS_CREATE ? "POST" : "PUT",
      endpoint: "api/user",
      data: {
        ...(!IS_CREATE && selectedRole),
        ...temp,
      },
    },{
      onSuccess: (res) => {
        notification.success({
          message: "عملیات با موفقیت انجام شد",
          placement: "bottomLeft",
        });
        setTimeout(()=>{
          window.location.reload();
        }, 2000)
      },
      onError: (err) => {
        console.log(err)
        notification.error({
          message: "خطا در انجام عملیات",
          placement: "bottomLeft",
        })
      }
    });
  }

  return (
    <Form onFinish={onSubmit} initialValues={{
      ["firstName"]: selectedRole?.firstName,
      ["lastName"]: selectedRole?.lastName,
      ["username"]: selectedRole?.username,
    }}>
      <Row>
        {ITEMS.map((item) => (
          <Col key={item.name} span={item.size}>
            <RenderElement searchForm={roleForm} {...item} />
          </Col>
        ))}
      </Row>
      <FormButtons onBack={onBack} isUpdating={isLoading} />
    </Form>
  );
};

export default UserCU;
