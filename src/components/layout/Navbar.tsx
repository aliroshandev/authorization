import React from "react";
import "./Navbar.scss";
import { Button, Layout, Typography, theme } from "antd";
import { AiOutlineMenuUnfold } from "react-icons/ai";

const { Header } = Layout;

type Props = {
  toggleRightMenuCollapsed: () => void;
  isRightMenuCollapsed: boolean;
};

const Navbar: React.FC<Props> = ({
  toggleRightMenuCollapsed,
  isRightMenuCollapsed,
}) => {
  const {
    token: { colorWhite },
  } = theme.useToken();
  return (
    <Header className="navbar">
      <div>
        <Button
          style={{ color: colorWhite }}
          className="navbar__button"
          shape="circle"
          onClick={toggleRightMenuCollapsed}
          type="text"
          icon={
            <AiOutlineMenuUnfold
              className={`navbar__button__${
                isRightMenuCollapsed ? "close" : "open"
              }`}
            />
          }
        />
      </div>
      <img src="img/logo.png" alt="army logo" className="navbar__logo" />
      <Typography.Title level={3} style={{ color: colorWhite, margin: "0px" }}>
        مدیریت سامانه ها
      </Typography.Title>
    </Header>
  );
};

export default Navbar;
