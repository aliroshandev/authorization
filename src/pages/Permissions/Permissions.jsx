import {Button, notification, Popconfirm, Table, Tooltip} from "antd";
import {useState} from "react";
import CrudBtn from "components/CrudBtn/CrudBtn";
import CUPermission from "./CUPermission";
import {AiFillEdit, AiOutlineDelete} from "react-icons/ai";
import {useMutation, useQuery} from "react-query";
import {useAuth} from "utils/hooks/useAuth";

const Permissions = () => {
  const {getApi, sendRequest} = useAuth();
  const [selectedPermission, setSelectedPermission] = useState();
  const {
    data: roleData,
    status,
    refetch
  } = useQuery(
    "/permissions?pageSize=20&currentPage=1",
    getApi
  );

  const {isLoading, mutate} = useMutation({
    mutationFn: sendRequest,
  });

  const handleDelete = (value) => {
    mutate({
        method: "DELETE",
        endpoint: `/permissions/${value.id}`,
      },
      {
        onSuccess: () => {
          notification.success({
            message: "عملیات حذف با موفقیت انجام شد",
            placement: "bottomLeft",
          });
          refetch();
        },
        onError: (err) => {
          notification.error({
            message: err?.message || "خطا در حذف",
            placement: "bottomLeft",
          });
        },
      })
  };

  const columns = [
    {
      title: "ردیف",
      render: (text, value, i) => {
        return i + 1;
      },
    },
    {
      title: "عنوان",
      dataIndex: "title",
    },
    {
      title: "کلید",
      dataIndex: "key",
    },
    {
      title: "آدرس",
      dataIndex: "url",
    },
    {
      title: "متد درخواست",
      dataIndex: "httpRequestMethod",
    },
    {
      title: "عملیات",
      dataIndex: "parentId",
      render: (text, value) => (
        <>
          <Popconfirm
            title="آیا از حذف دسترسی اطمینان دارید؟"
            onConfirm={() => handleDelete(value)}
          >
            <Button>
              <AiOutlineDelete />
            </Button>
          </Popconfirm>
          <Tooltip title="ویرایش">
            <Button
              type="link"
              danger
              onClick={() => setSelectedPermission(value)}
            >
              <AiFillEdit className="icon"/>
            </Button>
          </Tooltip>
        </>
      ),
    },
  ];

  if (selectedPermission) {
    return (
      <CUPermission
        onBack={() => setSelectedPermission()}
        selectedPermission={selectedPermission}
        refetch={refetch}
      />
    );
  }

  return (
    <>
      <Table
        dataSource={roleData?.data?.rows || []}
        columns={columns}
        loading={status}
      />
      <CrudBtn onNew={() => setSelectedPermission("new")}/>
    </>
  );
};

export default Permissions;
