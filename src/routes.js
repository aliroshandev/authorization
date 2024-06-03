import React from "react";
import { Route, Routes } from "react-router-dom";
import Manager from "./pages/Manager/Manager";
import Resources from "./pages/Resources/Resources";
import Permissions from "./pages/Permissions/Permissions";
import Roles from "./pages/Roles/Roles";
import Users from "./pages/Users/Users";
import ManageSystemMenu from "./pages/Menu/Menu";
import ResourcesType from "./pages/ResourcesType/ResourcesType";
import RoleResource from "./pages/RoleResource/RoleResource";
import Access from "./pages/Access/Access";
import ShowAccess from "./pages/ShowAccess/ShowAccess";
import RolesManagement from "./pages/RolesManagement/RolesManagement";
import Dashboard from "pages/Dashboard";

const AuthRoutes = () => {
  return (
    <Routes>
      <Route key="/Manager" path="/manager" element={<Manager />} />

      <Route key="/Resources" path="/resources/:id" element={<Resources />} />
      <Route
        key="/ResourcesType"
        path="/resources-type"
        element={<ResourcesType />}
      />
      <Route key="/Permissions" path="/permissions" element={<Permissions />} />
      <Route key="/Roles" path="/roles" element={<Roles />} />
      <Route
        key="/Roles-management"
        path="/roles-management"
        element={<RolesManagement />}
      />
      <Route
        key="/Roles-management"
        path="/roles-management/:id"
        element={<RolesManagement />}
      />
      <Route key="/Users" path="users" element={<Users />} />
      <Route key="/Menu" path="/menu" element={<ManageSystemMenu />} />
      <Route key="/Menu" path="/menu/:id" element={<ManageSystemMenu />} />
      <Route
        key="/RoleResource"
        path="/role-resource"
        element={<RoleResource />}
      />
      <Route key="/Access" path="/access" element={<Access />} />
      <Route key="/showAccess" path="/show-access" element={<ShowAccess />} />
      <Route key="/dashboard" path="/" element={<Dashboard />} />
    </Routes>
  );
};

export default AuthRoutes;
