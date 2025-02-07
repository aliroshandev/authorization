import "./App.scss";
import "./assets/styles/global.scss";
import RightMenu from "./components/layout/RightMenu";
import Navbar from "./components/layout/Navbar";
import { useEffect, useState } from "react";
import { Layout } from "antd";
import AuthRoutes from "./routes";
import { useNavigate } from "react-router-dom";
import useSessionStorageState from "utils/hooks/useSessionStorage";

const { Content } = Layout;

function App() {
  const navigate = useNavigate();
  const [token, setToken] = useSessionStorageState("token");
  // const [, setRefreshToken] = useSessionStorageState("refreshToken");

  const [isRightMenuCollapsed, setIsRightMenuCollapsed] =
    useState<boolean>(false);

  // const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(ACT_SetAccessToken(token));
  //   dispatch(ACT_SetRefreshToken(refreshToken));
  // }, [token, refreshToken]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    try {
      if (urlParams.has("token")) {
        queueMicrotask(() => {
          setToken(urlParams.get("token") ?? '');
        });
        // setToken(urlParams.get("token") ?? '');
        // dispatch(ACT_SetAccessToken(urlParams.get('token')));
      } else if (!token) {
        navigate("login");
      }
    } catch (error) {

    } finally {
      setTimeout(() => {
        navigate("dashboard");
      }, 1000);
    }
    // if (
    //   window.location.pathname === "/" &&
    //   window.location?.search?.length > 10
    // ) {
    //   let param: { token?: string; refreshToken?: string } & URLSearchParams =
    //     new Proxy(new URLSearchParams(window.location?.search), {
    //       get: (searchParam, props) => searchParam.get(String(props)),
    //     });
    //   setToken(param.token);
    //   navigate("/");
    // }
  }, [navigate, setToken]);

  return (
    <div className="app">
      <Navbar
        toggleRightMenuCollapsed={() => setIsRightMenuCollapsed((p) => !p)}
        isRightMenuCollapsed={isRightMenuCollapsed}
      />
      <div className="app__content">
        <RightMenu isRightMenuCollapsed={isRightMenuCollapsed} />
        <Content className="app__main">
          <>{<AuthRoutes />}</>
        </Content>
      </div>
    </div>
  );
}

export default App;
