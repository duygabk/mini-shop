import axios from "axios";

const BASE_URL = "http://localhost:8888/api";

function fetchData(options) {
  return axios({
    ...options
  });
}

export const getAppMenu = function() {
  return fetchData({
    method: "GET",
    url: `${BASE_URL}/menu/all`
  });
};
