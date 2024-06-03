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
  baseURL: "http://192.168.4.22:8082",
});

export function useAuth() {
  const [token, setToken] = useSessionStorageState("token");
  const [refresh_token, setRefresh_Token] =
    useSessionStorageState("refreshToken");
  const refreshToken = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("client_id", "residence-ui");
    urlencoded.append("client_secret", "ZrWUmP2RSCUBm5JvmSL4QLh5B5PqIm4b");
    urlencoded.append("refresh_token", refresh_token);
    urlencoded.append("grant_type", "refresh_token");

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      // redirect: 'follow'
    };

    fetch(
      "http://192.180.9.79:9080/auth/realms/mtna/protocol/openid-connect/token",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setToken(result.access_token);
        setRefresh_Token(result.refresh_token);
      })
      .catch((error) => console.log("error", error));
  };

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        await refreshToken();
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
