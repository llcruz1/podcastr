import axios from "axios";

export const api = axios.create({
  baseURL: "https://listen-api.listennotes.com/api/v2",
});
