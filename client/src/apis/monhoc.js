export const apiCreateMonHoc = (data) => axios({
    url: 'monhoc/crate-monhoc',
    method: 'post',
    data
})