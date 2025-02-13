import {Col, Form, Row} from "antd";
import {useMemo, useState} from "react";
import {useForm} from "antd/es/form/Form";
import RenderElement from "components/RenderElement/RenderElement";
import {FormButtons} from "../Buttons/Buttons";
import {useAuth} from "utils/hooks/useAuth";
import {useMutation, useQuery} from "react-query";

const CrudResource = ({
                        onBack,
                        refetch,
                        menuId,
                        selectedResource,
                        isCreate,
                      }) => {
  const {getApi, sendRequest} = useAuth();
  const [nameForm] = useForm();
  const [parentId, setParentId] = useState();

  const {isLoading, mutate} = useMutation({
    mutationFn: sendRequest,
    onSuccess: () => {
      refetch();
      onBack();
    },
  });

  const {data: menu} = useQuery(`/menus/id/${menuId}`, getApi);
  const {data: resources, status: resourceStatus} = useQuery(
    "/resources?currentPage=1&pageSize=20",
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
          resourceStatus === "loading" || resourceStatus === "error"
            ? []
            : resourceStatus === "success"
              ? resources?.data?.rows
              : [],
        autoCompleteValue: "id",
        autoCompleteTitle: "title",
        size: 12,
        onChange: (...rest) => {
          setParentId(rest[0]?.value);
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
    ],
    [
      selectedResource?.title,
      selectedResource?.path,
      selectedResource?.parentName,
      selectedResource?.menuName,
      resourceStatus,
      resources?.data?.rows,
      menu?.data?.title,
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
      endpoint: "resources",
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
      <FormButtons onBack={onBack} isUpdating={isLoading}/>
    </Form>
  );
};

export default CrudResource;
