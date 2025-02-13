import {useEffect, useMemo, useState} from "react";
import {Form, notification} from "antd";
import RenderElement from "components/RenderElement/RenderElement";

import {FormButtons} from "../Buttons/Buttons";
import "./CUMenu.scss";
import {useAuth} from "utils/hooks/useAuth";
import {useMutation, useQuery} from "react-query";

const CUMenu = ({onBack, clientId, selectedMenu}) => {
  const {getApi, sendRequest} = useAuth();
  const isCreate = !selectedMenu;
  const [menuForm] = Form.useForm();
  const [parentId, setParentId] = useState();
  useEffect(() => {
    if (selectedMenu) {
      let {title, key} = selectedMenu;
      menuForm.setFieldsValue({
        key,
        title,
      });
    }
  }, [menuForm, selectedMenu]);

  const {isLoading, mutate} = useMutation({
    mutationFn: sendRequest,
    onSuccess: () => {
      notification.success({
        message: "عملیات با موفقیت انجام شد",
        placement: "bottomLeft",
      });
      onBack(true);
    },
    onError: () => {
      notification.error({
        message: "خطا در انجام عملیات",
        placement: "bottomLeft",
      });
    },
  });

  const {data: responseClient} = useQuery(
    "/clients",
    getApi
  );

  const {data: menus} = useQuery(
    `/menus/client-id/${clientId}`,
    getApi,
    {
      enabled: !!clientId,
    }
  );

  const ITEMS = useMemo(
    () => [
      {
        label: "عنوان",
        name: "title",
        type: "text",
      },
      {
        label: "کلید",
        name: "key",
        type: "text",
      },
      ...((clientId) && menus?.data?.length > 0
        ? [
          {
            label: "منوی پدر",
            name: "parentId",
            type: "autocomplete",
            data: menus?.data,
            autoCompleteValue: "id",
            autoCompleteTitle: "title",
            onChange: (...rest) => {
              setParentId(rest[0]?.value);
            },
            placeholder:
              menus?.data?.find((client) => client.id === selectedMenu?.id)
                ?.parentName || "",
            disabled: menus?.data?.length <= 0,
          },
        ]
        : []),
    ],
    [responseClient?.data, clientId, menus?.data, selectedMenu]
  );

  async function onSubmit() {
    const temp = menuForm.getFieldsValue();
    mutate({
      method: isCreate ? "post" : "PUT",
      endpoint: "menus",
      data: {
        ...(!isCreate && selectedMenu),
        ...temp,
        parentId,
        clientId,
      },
    });
  }

  return (
    <>
      <Form form={menuForm} onFinish={onSubmit} className="sh-menu-item">
        <div className="sh-countainer">
          {ITEMS.map((item) => (
            <RenderElement searchForm={menuForm} {...item} />
          ))}
        </div>
        <div className="sh-button">
          <FormButtons onBack={onBack} isUpdating={isLoading}/>
        </div>
      </Form>
    </>
  );
};

export default CUMenu;
