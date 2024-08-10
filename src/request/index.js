import axios from "axios";

export default {
  get(url, params = {}) {
    return axios({
      url: url,
      method: "get",
      params,
    });
  },
  post(url, params = {}) {
    console.log(url,params);
    return axios({
      url: url,
      method: "post",
      params,
    });
  },
};
