import React, { useState, useEffect } from "react";
// import { ErrorBoundary } from "react-error-boundary";
import RightMenu from "../rightMenu/RightMenu";
import { Layout, Space } from "antd";
// import CartableRoutes from "../Routes";
// import MainContainer from "../Shared/Components/MainContainer/MainContainer";
// import TopHeader from "../Shared/Components/TopHeader/TopHeader";
import "./Layout.scss";
import { ErrorBoundary } from "react-error-boundary";

const { Header, Footer, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [isProfileMenuCollapsed, setIsProfileMenuCollapsed] = useState(false);

  // const [darkTheme, setDarkTheme] = useState(
  //   store.getState().dashboard.darkTheme
  // );

  const handleToggleBurgerBtn = () => {
    setIsMenuCollapsed(!isMenuCollapsed);
  };

  useEffect(() => {
    document.addEventListener(
      "onUpdateTheme",
      function (e) {
        // @ts-ignore
        setDarkTheme(e.detail);
      },
      false
    );
  }, []);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <h1>h1</h1>test
      <div className={`App `}>
        {/* <TopMenu toggleBurgerBtn={handleToggleBurgerBtn} /> */}
        <div
          className={
            isProfileMenuCollapsed
              ? "wrapper new-wrapper active-profile"
              : "wrapper new-wrapper"
          }
        >
          <RightMenu
            isMenuCollapsed={isMenuCollapsed}
            toggleBurgerBtn={handleToggleBurgerBtn}
          />
          {/* <MainContainer>
            <TopHeader
              isProfileMenuCollapsed={isProfileMenuCollapsed}
              setIsProfileMenuCollapsed={setIsProfileMenuCollapsed}
            />
            <div className="main-content">
              <CartableRoutes />
            </div>
          </MainContainer> */}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default MainLayout;

export function ErrorFallback({ error }: any) {
  return (
    <div role="alert">
      <h2>
        مشکلی در سامانه به وجود آمده. لطفا این مورد را به پشتیبانی گزارش کنید
      </h2>
      <pre style={{ color: "red", textAlign: "center", marginTop: "22px" }}>
        {error.message}
      </pre>

      <p>صفحه را مجدد بارگزاری کنید</p>
    </div>
  );
}
