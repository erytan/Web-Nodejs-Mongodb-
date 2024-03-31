import axios from "../axios";
export const apiCreateMonHocDky = (data) =>
  axios({
    url: "dangkymonhoc/dky-monhoc",
    method: "post",
    data,
  });
export const apiGetDKyMonHoc = (data) =>
  axios({
    url: "dangkymonhoc/",
    method: "get",
    data,
  });
export const apiThemSVDky = (monHocId, data) => {
  return axios({
    url: `dangkymonhoc/dkymonhoc/${monHocId}`,
    method: "put",
    data,
  });
};
