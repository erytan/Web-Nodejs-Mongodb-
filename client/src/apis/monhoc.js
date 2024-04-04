    import axios from "../axios";
    export const apiCreateMonHoc = (data) =>
    axios({
        url: "monhoc/crate-monhoc",
        method: "post",
        data,
    });
    export const apiGetMonHoc = (data) =>
    axios({
        url: "monhoc/",
        method: "get",
        data,
    });
    export const apiThemTGMonHoc = (monHocId, data) => {
    return axios({
        url: `monhoc/tgmonhoc/${monHocId}`,
        method: "put",
        data,   
    });
    };
    export const apiDeleteMonHoc = (monHocId) => {
        return axios({
            url: `monhoc/${monHocId}`, // Đường dẫn của API
            method: "delete", // Phương thức HTTP DELETE
        });
};
export const apiGetCurrentMH = (monHocId, data) => {
    return axios({
        url: `monhoc/tgmonhoc/current/${monHocId}`,
      method: "get",
      data
    });
  };