import React from "react";

export interface SubmenuType {
  name: string;
  comp?: string;
  icon: any;
  link: string;
  submenus?: Array<SubmenuType>;
  accessBy?: Array<RoleTypes>;
  style?: React.CSSProperties;
}

export interface MenuItemsType {
  name: string;
  link?: string;
  comp?: string;
  icon: any;
  disabled?: boolean;
  accessBy?: Array<RoleTypes>;
  submenus?: Array<SubmenuType>;
  class?: string;
  id?: string;
  style?: React.CSSProperties;
}

export type RoleTypes = "ROLE_ADMIN" | "ROLE_USER" | "ROLE_MANAGER";
