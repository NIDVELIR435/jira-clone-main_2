import { Axios } from "axios";

export const jsonplaceholderClient = new Axios({
  baseURL: process.env.REACT_APP_JSONPLACEHOLDER_HOST_URL,
  responseType: "json",
  transformResponse: (res) => JSON.parse(res),
});
