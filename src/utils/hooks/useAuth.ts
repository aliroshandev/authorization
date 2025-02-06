import axios from "axios";
import useSessionStorageState from "./useSessionStorage";

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

export function useAuth() {
  const [token, setToken] = useSessionStorageState("token");
  const [refresh_token, setRefresh_Token] =
    useSessionStorageState("refreshToken");

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

  async function getApi({
    queryKey,
  }: {
    queryKey: (string | number | boolean)[];
  }) {
    let request = queryKey.join("/");
    try {
      const { data } = await axiosInstance.get(request, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      throw new Error();
    }
  }

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

  return { getApi, sendRequest };
}
