import React from "react";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { TiLightbulb } from "react-icons/ti";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";

type MenuItem = Required<MenuProps>["items"][number] & { link?: string };

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group",
  link?: string
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
    link,
  } as MenuItem;
}

type Props = {
  isRightMenuCollapsed: boolean;
};

const RightMenu: React.FC<Props> = ({ isRightMenuCollapsed }) => {
  const navigate = useNavigate();
  const MENU_ITEMS: TMenuItems[] = [
    {
      label: "مدیریت",
      name: "managment",
      key: "managment",
      icon: <TiLightbulb />,
      children: [
        {
          label: "مدیریت منابع",
          link: "menu",
          key: "menu",
          icon: <TiLightbulb />,
          onClick: () => navigate("/menu"),
        },
        {
          label: "نوع منابع",
          link: "resources-type",
          key: "resources-type",
          icon: <TiLightbulb />,
          onClick: () => navigate("/menu"),
        },
        {
          label: "تخصیص نقش به مجوز",
          link: "access",
          key: "access",
          icon: <TiLightbulb />,
          onClick: () => navigate("/access"),
        },
        {
          label: "نمایش دسترسی ها",
          link: "show-access",
          key: "show-access",
          icon: <TiLightbulb />,
          onClick: () => navigate("/show-access"),
        },
        {
          label: "مدیریت نقش ها",
          link: "roles-management",
          key: "roles-management",
          icon: <TiLightbulb />,
          onClick: () => navigate("/roles-management"),
        },
        {
          label: "مجوز ها ",
          link: "permissions",
          key: "permissions",
          icon: <TiLightbulb />,
          onClick: () => navigate("/permissions"),
        },
        {
          label: "کاربران",
          link: "users",
          key: "users",
          icon: <TiLightbulb />,
          onClick: () => navigate("/users"),
        },
      ],
    },
  ];

  return (
    <Menu
      defaultSelectedKeys={["1"]}
      mode="inline"
      // theme="dark"
      inlineCollapsed={isRightMenuCollapsed}
      items={MENU_ITEMS}
      style={{ maxWidth: "240px" }}
    />
  );
};

export default RightMenu;

type TMenuWithSubMenu = {
  key: string;
  label: string;
  name: string;
  icon?: React.ReactNode;
  children: Array<TMenu | TMenuWithSubMenu>;
};
type TMenu = {
  key: string;
  label: string;
  link: string;
  icon?: React.ReactNode;
  onClick?: () => void;
};

type TMenuItems = TMenuWithSubMenu | TMenu;
