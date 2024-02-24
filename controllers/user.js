const User = require('../models/user')
const asyncHandler = require('express-async-handler')
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
        const { password, role, ...userData } = response.toObject()
        return res.status(200).json({
            success: true,
            userData: response
        })
    } else {
        throw new Error('Invalid password')
    }
})

module.exports = {
    register,
    login
}