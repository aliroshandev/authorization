import { notification, Skeleton } from "antd";
import ErrorSection from "components/ErrorSection/ErrorSection";
import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useAuth } from "utils/hooks/useAuth";
import { BackBtn } from "../Buttons/Buttons";
import { useParams } from "react-router";

const AssignRoleToUser = ({ onBack, selectedRole }) => {
  const { sendRequest, getApi } = useAuth();
  const [selectedUser, setSelectedUser] = useState();
  const { id: clientId } = useParams();

  const {
    data: assignedUsers,
    status: assignedUsersStatus,
    refetch: assignedUsersRefetch,
  } = useQuery(
    `/user/get-by-client-and-role?clientId=${clientId}&roleName=${selectedRole.name}`,
    getApi,
    {
      enabled: !!((selectedRole.clientId || clientId) && selectedRole.name),
    }
  );

  const {
    data: users,
    status: usersStatus,
    refetch: usersRefetch,
  } = useQuery(`/user?currentPage=1&pageSize=20`, getApi);

  const { mutate } = useMutation({
    mutationFn: sendRequest,
  });

  function addRoleToUser() {
    mutate(
      {
        method: "POST",
        endpoint: "user/add-roles",
        data: {
          clientId: selectedRole.clientId?? clientId,
          userId: selectedUser.id,
          roles: [
            {
              name: selectedRole.name,
              id: selectedRole.roleIdKeycloak,
            },
          ],
        },
      },
      {
        onSuccess: () => {
          notification.success({
            message: `نقش ${selectedRole.name} به کاربر ${selectedUser.username} اضافه گردید`,
            placement: "bottomLeft",
          });
          setSelectedUser();
          assignedUsersRefetch();
        },
        onError: () => {
          notification.error({
            message: "خطا در اعمال تغییرات",
            placement: "bottomLeft",
          });
        },
      }
    );
  }

  function removeUserFromRole() {
    mutate(
      {
        method: "DELETE",
        endpoint: `user/role-by-user-client-role?userId=${selectedUser.id}&clientId=${selectedRole.clientId?? clientId}&roleName=${selectedRole.name}`,
      },
      {
        onSuccess: () => {
          notification.success({
            message: `نقش ${selectedRole.name} از کاربر ${selectedUser.username} حذف گردید`,
            placement: "bottomLeft",
          });
          setSelectedUser();
          assignedUsersRefetch();
        },
        onError: () => {
          notification.error({
            message: "خطا در اعمال تغییرات",
            placement: "bottomLeft",
          });
        },
      }
    );
  }

  return (
    <div className="assign-role-to-user">
      <div className="top-section">
        <BackBtn onBack={onBack} />
      </div>
      <div className="transfer-list">
        <div className="users-list transfer-container">
          <p>لیست کل کاربران</p>
          {usersStatus === "loading" ? (
            <Skeleton active loading paragraph />
          ) : usersStatus === "error" ? (
            <ErrorSection handleRefresh={usersRefetch} />
          ) : usersStatus === "success" ? (
            <ul>
              {users?.data?.rows?.map((user) => {
                return (
                  <li
                    key={user.id}
                    className={
                      !selectedUser?.isAssigned && selectedUser?.id === user.id
                        ? "selected"
                        : ""
                    }
                    onClick={() =>
                      setSelectedUser({ ...user, isAssigned: false })
                    }
                  >{`${user.username} (${user.firstName || ""} ${
                    user.lastName || ""
                  })`}</li>
                );
              })}
            </ul>
          ) : null}
        </div>
        <div className="control-buttons">
          <button
            aria-label="user-to-assignee"
            disabled={
              !selectedUser || !(selectedUser?.id && !selectedUser?.isAssigned)
            }
            onClick={addRoleToUser}
          >
            {">"}
          </button>
          <button
            aria-label="unassign-user"
            disabled={
              !selectedUser || !(selectedUser?.id && selectedUser?.isAssigned)
            }
            onClick={removeUserFromRole}
          >
            {"<"}
          </button>
        </div>
        <div className="assigned-users-list transfer-container">
          <p>کاربران تخصیص داده شده</p>
          {assignedUsersStatus === "loading" ? (
            <Skeleton active loading paragraph />
          ) : assignedUsersStatus === "error" ? (
            <ErrorSection handleRefresh={assignedUsersRefetch} />
          ) : assignedUsersStatus === "success" ? (
            <ul>
              {assignedUsers?.data?.map((user) => {
                return (
                  <li
                    key={user.id}
                    className={
                      selectedUser?.isAssigned && selectedUser?.id === user.id
                        ? "selected"
                        : ""
                    }
                    onClick={() =>
                      setSelectedUser({ ...user, isAssigned: true })
                    }
                  >
                    {user.username}
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AssignRoleToUser;
