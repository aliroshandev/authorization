import axios from "axios";
import useSessionStorageState from "./useSessionStorage";
import {TServerCall} from '../types/authContext';
import {convertArabicCharToPersian} from '../functions/convertArabicCharToPersian';
import {notification} from 'antd';

interface sendRequestType {
  method: string;
  endpoint: string;
  query?: null | {
    page?: number | string;
    size?: number | string;
    sort?: string;
  };
  data?: any;
  headers?: {};
}

export const axiosInstance = axios.create({
  baseURL: "https://auth.betaja.ir/auth-api/",
});

let localToken = "";

export function useAuth() {
  const [token,] = useSessionStorageState("token");
  // const [refresh_token, setRefresh_Token] =
  //   useSessionStorageState("refreshToken");

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        // axiosInstance.defaults.headers.common.Authorization = `Bearer ${refreshedToken}`;
        return axiosInstance(originalRequest);
      }
      return Promise.reject(error);
    }
  );

  const serverCall = async ({ entity, method, data = { test: 1 } }: TServerCall) => {
    try {
      let requestOptions = {
        url: convertArabicCharToPersian(entity),
        method,
        headers: {
          Authorization: "Bearer " + (localToken || token)
        },
        redirect: "follow",
        ...(data && { data: convertArabicCharToPersian(JSON.stringify(data)) })
      };
      let response = await axiosInstance({ ...requestOptions });
      if (response.status === 200) {
        return response.data;
      } else if (response.status === 204) {
        return { data: { rows: [] } };
      } else {
        // setNotification(response.status, `خطا در انجام عملیات - ${response?.statusText}`, "error");
        // setNotification(response.status, "", "error");
        notification.error({
          message: `خطا در انجام عملیات - ${response?.statusText}`,
          placement: "bottomLeft"
        });
        throw new Error(`خطا در انجام عملیات - ${response?.statusText}`);
      }
    } catch (e: any) {
      if (e.response) {
        // setNotification(e.response.status, e.message ?? `خطا در انجام عملیات`, "error");
        // setNotification(e.response.status, "", "error");
        notification.error({
          message: e.message ?? `خطا در انجام عملیات`,
          placement: "bottomLeft"
        });
      }
      throw new Error(JSON.stringify(e) || `خطا در انجام عملیات`);
    }
  };

  /**
   * @deprecated use alternative getRequest
   * @param queryKey
   */
  async function getApi({
                          queryKey,
                        }: {
    queryKey: (string | number | boolean)[];
  }) {
    let request = queryKey.join("/");
    try {
      return await axiosInstance.get(request, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      throw new Error();
    }
  }

  const getRequest = async ({
                              queryKey
                            }: {
    queryKey: string | number | boolean | Array<number | boolean | string>;
  }) => {
    let tempEntity = queryKey;
    if (Array.isArray(queryKey)) {
      tempEntity = queryKey.join("/");
    }
    tempEntity = String(tempEntity);
    try {
      return await serverCall({ entity: tempEntity, method: "get" });
    } catch (error: any) {
      throw new Error(error?.message || `خطا در انجام عملیات`);
    }
  };

  async function sendRequest({
                               method,
                               endpoint,
                               query = null,
                               data = {},
                               headers = {},
                             }: sendRequestType) {
    return await axiosInstance(endpoint, {
      method,
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data,
    });
  }

  return {
    serverCall, getRequest, getApi, sendRequest};
}
