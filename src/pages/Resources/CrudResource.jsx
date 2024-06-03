import { Form, Row, Col } from "antd";
import { useMemo, useState } from "react";
import { useForm } from "antd/es/form/Form";
import RenderElement from "components/RenderElement/RenderElement";
import { FormButtons } from "../Buttons/Buttons";
import { useAuth } from "utils/hooks/useAuth";
import { useMutation, useQuery } from "react-query";

const CrudResource = ({
  onBack,
  refetch,
  menuId,
  selectedResource,
  isCreate,
}) => {
  const { getApi, sendRequest } = useAuth();
  const [nameForm] = useForm();
  const [parentId, setParentId] = useState();

  const { isLoading, mutate } = useMutation({
    mutationFn: sendRequest,
    onSuccess: () => {
      refetch();
      onBack();
    },
  });

  const { response: menu } = useQuery(`/api/menus/id/${menuId}`, getApi);
  const { response: resources, status: resourceStatus } = useQuery(
    "/api/resources?currentPage=1&pageSize=20",
    getApi
  );
  const { response: resourceType, status: resourceTypeStatus } = useQuery(
    "/api/resource-types?pageSize=20&currentPage=1",
    getApi
  );

  const ITEMS = useMemo(
    () => [
      {
        name: "title",
        label: "عنوان",
        type: "text",
        size: 12,
        defaultValue: selectedResource?.title,
      },
      {
        name: "path",
        label: "مسیر",
        type: "text",
        size: 12,
        defaultValue: selectedResource?.path,
      },
      {
        name: "parentId",
        label: "پدر",
        type: "autocomplete",
        data:
          resourceStatus === "pending" || resourceStatus === "rejected"
            ? []
            : resourceStatus === "resolved"
            ? resources?.data?.rows
            : [],
        autoCompleteValue: "id",
        autoCompleteTitle: "title",
        size: 12,
        handleChange(...rest) {
          setParentId(rest[1]?.key);
        },
        defaultValue: selectedResource?.parentName,
      },
      {
        name: "menuId",
        label: "منو",
        type: "text",
        isDisabled: true,
        placeholder: menu?.data?.title || "",
        size: 12,
        defaultValue: selectedResource?.menuName,
      },
      {
        name: "resourceTypeId",
        label: "نوع",
        type: "dropdown",
        options:
          resourceTypeStatus === "pending" || resourceTypeStatus === "rejected"
            ? []
            : resourceTypeStatus === "resolved"
            ? resourceType?.data?.rows
            : [],
        autoCompleteValue: "id",
        autoCompleteTitle: "title",
        size: 12,
        defaultValue: selectedResource?.resourceTypeId,
      },
    ],
    [
      selectedResource?.title,
      selectedResource?.path,
      selectedResource?.parentName,
      selectedResource?.menuName,
      selectedResource?.resourceTypeId,
      resourceStatus,
      resources?.data?.rows,
      menu?.data?.title,
      resourceTypeStatus,
      resourceType?.data?.rows,
    ]
  );

  async function onNewSource(data) {
    let temp = {};
    for (let [key, value] of Object.entries(data)) {
      if (value) {
        temp[key] = value;
      }
    }
    mutate({
      method: isCreate ? "POST" : "PUT",
      endpoint: "api/resources",
      data: {
        ...(!isCreate && selectedResource),

        ...temp,
        menuId,
        parentId,
      },
    });
  }

  return (
    <Form onFinish={onNewSource}>
      <Row>
        {ITEMS.map((item) => (
          <Col key={item.name} span={item.size}>
            <RenderElement searchForm={nameForm} {...item} />
          </Col>
        ))}
      </Row>
      <FormButtons onBack={onBack} isUpdating={isLoading} />
    </Form>
  );
};

export default CrudResource;
