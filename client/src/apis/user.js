import axios from "../axios";

export const apiLogin = (data) => axios({
    url: 'user/login',
    method: 'post',
    data
})
export const apiRegister = (data) => axios({
    url: 'user/register',
    method: 'post',
    data
})
export const apiGetUSER = (data) => axios({
    url: 'user/current',
    method: 'get',
    data
})
export const apiCheckin = (data) => axios({
    url: 'user/checkin',
    method: 'post',
    data
})
