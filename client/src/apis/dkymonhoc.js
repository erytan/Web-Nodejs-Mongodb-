import axios from "../axios";
export const apiCreateMonHocDky = (data) =>
  axios({
    url: "dangkymonhoc/dky-monhoc",
    method: "post",

  });
export const apiGetDKyMonHoc = (data) =>
  axios({
    url: "dangkymonhoc/",
    method: "get",

  });
export const apiThemSVDky = (monHocId, data) => {
  return axios({
    url: `dangkymonhoc/dkymonhoc/${monHocId}`,
    method: "put",
    
  });
};
export const apiMonHocDky = (monHocId, data) => {
  return axios({
    url: `dangkymonhoc/dkymonhoc/current/${monHocId}`,
    method: "get",
  });
};