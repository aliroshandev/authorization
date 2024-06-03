import React, { useState } from "react";
import {
  AppstoreOutlined,
  CalendarOutlined,
  LinkOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import SubMenu from "antd/es/menu/SubMenu";
import { NavLink } from "react-router-dom";
import { BaseMenuProps, MENU_ITEMS } from "./MenuItems";
import "./RightMenu.scss";
import { MenuItemsType } from "./types/MenuItemsTypes";

interface ActiveMenuType {
  submenu?: string | undefined;
  menu: string | MenuItemsType | undefined;
}

interface RightMenuProps {
  isMenuCollapsed: boolean;
  toggleBurgerBtn: () => void;
}

const RightMenu: React.FC<RightMenuProps> = ({
  isMenuCollapsed,
  toggleBurgerBtn,
}) => {
  let result: ActiveMenuType = { menu: "dashboard" };

  // const pathname = location.pathname.substr(1);
  // const { SubMenu }: { SubMenu: any } = Menu;

  // function getActiveMenu(): ActiveMenuType {
  //   MENU_ITEMS.find((menu: any) => {
  //     if (pathname.includes("/")) {
  //       let [submenu]: Array<string> = pathname.split("/");
  //       result = { submenu, menu: pathname };
  //       return true;
  //     } else if (menu.link === pathname) {
  //       result = { menu: menu.link };
  //       return true;
  //     } else if (menu.submenus) {
  //       let indexOfSubmenu;
  //       let findInSubmenus = menu.submenus.find((submenu: any, index: any) => {
  //         indexOfSubmenu = index;
  //         if (submenu.link)
  //           return submenu.link.toLowerCase() === pathname.toLowerCase();
  //         else return false;
  //       });
  //       if (findInSubmenus) {
  //         let generatedKey = `${menu.comp}-menu-item_${indexOfSubmenu}`;
  //         result = { submenu: menu.comp, menu: generatedKey };
  //         return true;
  //       }
  //     }
  //     return false;
  //   });
  //   return result;
  // }

  return (
    <div className={isMenuCollapsed ? "menu-bg hide" : "menu-bg"}>
      <button
        className="burger-btn"
        type="button"
        onClick={() => toggleBurgerBtn()}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <Menu
        mode="inline"
        className="root-menu"
        // defaultSelectedKeys={[getActiveMenu().menu, pathname]}
        // defaultOpenKeys={[getActiveMenu().submenu!]}
        inlineCollapsed={isMenuCollapsed}
        // theme={store.getState().dashboard.darkTheme ? "dark" : "light"}
        theme={"light"}
      >
        {MENU_ITEMS.map((menu: BaseMenuProps) => {
          if (menu.children) {
            return (
              <SubMenu key={menu.name} icon={menu.icon} title={menu.label}>
                {menu.children.map((submenu: BaseMenuProps) => {
                  return (
                    <Menu.Item
                      key={`${menu.name}-${submenu.link}`}
                      className="custom-menu-item"
                      icon={submenu.icon}
                    >
                      <NavLink to={"/" + menu.name + "/" + submenu.link}>
                        {submenu.name}
                      </NavLink>
                    </Menu.Item>
                  );
                })}
              </SubMenu>
            );
          }
          return (
            <Menu.Item
              key={menu.link}
              icon={menu.icon}
              // icon={<GrAppsRounded />}
              className="custom-menu-item"
              // style={menu.style}
            >
              <NavLink to={`${menu.link}`}>{menu.name}</NavLink>
            </Menu.Item>
          );
        })}
      </Menu>
    </div>
  );
};

export default RightMenu;
