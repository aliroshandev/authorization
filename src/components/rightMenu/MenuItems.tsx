import { MenuProps } from "antd";
import {
  AppstoreOutlined,
  CalendarOutlined,
  LinkOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";

// type MenuItem = Required<MenuProps>["items"][number];

export interface BaseMenuProps {
  label: string;
  icon?: React.ReactNode;
  name: string;
  link?: string;
  children?: BaseMenuProps[];
}

export const MENU_ITEMS: BaseMenuProps[] = [
  {
    label: "سامانه اتوماسیون",
    icon: <CalendarOutlined />,
    name: "baseInformation",
    children: [
      {
        label: "ارشدیت",
        icon: <AppstoreOutlined />,
        link: "seniority",
        name: "ارشدیت",
      },
    ],
  },
  {
    label: "مرکز عملیات",
    icon: <LinkOutlined />,
    name: "automation",
    children: [
      {
        label: "گردش کار",
        icon: <MailOutlined />,
        link: "workflow",
        name: "گردش کار",
      },
    ],
  },
];
