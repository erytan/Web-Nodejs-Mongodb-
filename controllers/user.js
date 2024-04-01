const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt')
const jwt = require('jsonwebtoken')
const sendMail = require('../ultils/sendMail')
const crypto = require('crypto')

const register = asyncHandler(async(req, res) => {
    const { email, password, firstname, lastname } = req.body
    if (!email || !password || !firstname || !lastname)
        return res.status(400).json({
            success: false,
            mess: 'Missing'
        })
    const user = await User.findOne({ email })
    if (user) throw new Error('User have existed')
    else {
        const newUser = await User.create(req.body)
        return res.status(200).json({
            success: newUser ? true : false,
            mess: newUser ? 'Register is successfully' : 'Something went wrong'
        })
    }
})
const login = asyncHandler(async(req, res) => {
    const { email, password } = req.body
    if (!email || !password)
        return res.status(400).json({
            success: false,
            mess: 'Missing'
        })
    const response = await User.findOne({ email })
    if (response && await response.isCorrectPassword(password)) {
        // tách password and role ra khỏi responese
        const { password, role, resfreshToken, ...userData } = response.toObject()
            // tạo access token
        const accessToken = generateAccessToken(response._id, role)
            // tạo refresh token
        const newRefreshToken = generateRefreshToken(response._id)
            // lưu refreshToken vào database
        await User.findByIdAndUpdate(response._id, { refreshToken: newRefreshToken }, { new: true })
            // lưu refreshToken vào cookie
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
        return res.status(200).json({
            success: true,
            accessToken,
            userData
        })
    } else {
        throw new Error('Invalid password')
    }
})
const getCurrent = asyncHandler(async(req, res) => {
    const { _id } = req.user
    const user = await User.findById(_id).select('-refreshToken -password -role')
    return res.status(200).json({
        success: user ? true : false,
        rs: user ? user : 'User not found'
    })
})

const refreshAccessToken = asyncHandler(async(req, res) => {
    try {
        // Lấy token từ cookie
        const refreshToken = req.cookies.refreshToken;

        // Kiểm tra xem refreshToken có tồn tại không
        if (!refreshToken) {
            throw new Error('No refresh token found in cookies');
        }

        // Xác thực refreshToken
        const decoded = await jwt.verify(refreshToken, process.env.JWT_SECRET);

        // Tìm người dùng trong cơ sở dữ liệu dựa trên decoded._id và refreshToken
        const user = await User.findOne({ _id: decoded._id, refreshToken });

        if (!user) {
            throw new Error('User not found or refreshToken does not match');
        }

        // Tạo và trả về accessToken mới
        const newAccessToken = generateAccessToken(user._id, user.role);
        return res.status(200).json({
            success: true,
            newAccessToken
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message
        });
    }
});
const logout = asyncHandler(async(req, res) => {
    try {
        // Lấy refreshToken từ cookie
        const refreshToken = req.cookies.refreshToken;

        // Kiểm tra xem refreshToken có tồn tại không
        if (!refreshToken) {
            throw new Error('No refresh token found in cookies');
        }

        // Cập nhật refreshToken trong cơ sở dữ liệu
        await User.findOneAndUpdate({ refreshToken }, { refreshToken: '' });

        // Xóa refreshToken trong cookie của trình duyệt
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true
        });

        return res.status(200).json({
            success: true,
            message: 'User logged out successfully'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
//client gửi gmail
//Server check email có hợp lệ hay không => gửi gmail + kèm theo link ( password change token)
//Client check email=> click link
//Client gửi api kemf token
//Check token có giống với token mà server gửi qua email hay không
//Change pasword
const forgetPassword = asyncHandler(async(req, res) => {
    const { email } = req.query;
    if (!email) throw new Error('Missing email');

    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');

    const resetToken = user.createPasswordChangedToken();
    await user.save();

    const html = `Xin vui lòng click vào link bên dưới để thay đổi mật khẩu của bạn. Link này sẽ hết hạn trong vòng 15 phút kể từ bây giờ <a href=${process.env.URL_SERVER}/api/user/reset-password/${resetToken}> Click Here </a>`;

    const data = {
        email, // Đây là người nhận email
        html
    };

    const rs = await sendMail(data);

    return res.status(200).json({
        success: true,
        rs
    });
});
const resetPassword = asyncHandler(async(req, res) => {
    const { password, token } = req.body
    console.log({ password, token });
    if (!password || !token) throw new Error('Missing input')
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({
        passwordResetToken,
        passwordResetExpires: { $gt: Date.now() }
    })
    if (!user) throw new Error('Invalid password reset token')
    user.password = password
    user.passwordResetToken = undefined
    user.passwordChangeAt = Date.now()
    user.passwrordResetExpires = undefined
    await user.save()
    return res.status(200).json({
        success: true,
        mes: user ? 'update password' : 'something went wrong'
    })
})
const getUser = asyncHandler(async(req, res) => {
    const response = await User.find().select('-refreshToken -password -role')
    return res.status(200).json({
        success: response ? true : false,
        user: response
    })
})
const deleteUser = asyncHandler(async(req, res) => {
    const { _id } = req.query
    if (!_id) throw new Error('missing input id')
    const response = await User.findByIdAndDelete(_id)
    return res.status(200).json({
        success: response ? true : false,
        deleteUer: response ? `user with email : ${response.email} deleted !!` : 'No user delete'
    })
})

const updateUser = asyncHandler(async(req, res) => {
    const { _id } = req.user;

    if (!_id || Object.keys(req.body).length === 0) {
        throw new Error('Missing input id or body');
    }

    const response = await User.findByIdAndUpdate(_id, req.body, { new: true }).select('-password -role -refreshToken');

    if (!response) {
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        });
    }

    return res.status(200).json({
        success: true,
        updateUser: response
    });
});
const updateUserByAdmin = asyncHandler(async(req, res) => {
    const { uid } = req.params; // Sử dụng uid từ req.params

    if (!uid || Object.keys(req.body).length === 0) {
        throw new Error('Missing input id or body');
    }

    const response = await User.findByIdAndUpdate(uid, req.body, { new: true }).select('-password -role');

    if (!response) {
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        });
    }

    return res.status(200).json({
        success: true,
        updateUser: response // Thay đổi deleteUer thành updateUser
    });
});
const updateUserAddress = asyncHandler(async(req, res) => {
    const { _id } = req.user
    if (!req.body.address) throw new Error('Missing input')
    const response = await User.findByIdAndUpdate(_id, { $push: { address: req.body.address } }, { new: true }).select('-password -role -refreshToken');
    return res.status(200).json({
        mes: response ? true : false,
        updateAddress: response ? response : "Can not update address"
    })
})
// thêm api checkin
const monhocdky = require('../models/monhocdky')
const checkIn = asyncHandler(async(req, res) => {
    const { mamonhoc,_id } = req.body
    if (!mamonhoc || !_id) throw new Error('Missing input')
    const response = await monhocdky.find({ "mamonhoc": mamonhoc });
    if (response == []){
        return res.status(400).json({
            success: false,
            message: "Không có môn học này !!!"
        })
    }
    let flag = false;
    for (const doc of response) {
        if (doc.sinhviendky && doc.sinhviendky.includes(_id)) {
            console.log(`Tìm thấy ${_id} trong trường sinhviendky của ${mamonhoc}`);
            flag= true;
            break;
        }
    }
    return res.status(200).json({
        success: flag ? true : false,
        message: flag ? "Checkin thành công" : "User not register this class"
    })
})
const getMonHoc = asyncHandler(async(req, res) => {
    const response = await monhocdky.find()
    return res.status(200).json({
        mes: response ? true : false,
        Monhoc: response ? response : " Something went wrong",
    })
});
module.exports = {
    register,
    login,
    getCurrent,
    refreshAccessToken,
    logout,
    forgetPassword,
    resetPassword,
    getUser,
    deleteUser,
    updateUser,
    updateUserByAdmin,
    updateUserAddress,checkIn,getMonHoc
}