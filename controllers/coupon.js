const asyncHandler = require('express-async-handler');
const Coupon = require('../models/coupon');


const createNewCoupon = asyncHandler(async(req, res) => {
    const { name, discount, expiry } = req.body;
    if (!name || !discount || !expiry) {
        throw new Error("Missing inputs");
    }

    // Kiểm tra xem mã giảm giá đã tồn tại hay chưa
    const existingCoupon = await Coupon.findOne({ name });

    if (existingCoupon) {
        return res.status(400).json({
            success: false,
            message: "Coupon with the same name already exists"
        });
    }

    try {
        // Tạo mã giảm giá mới nếu không tồn tại mã giảm giá có cùng tên
        const response = await Coupon.create({
            ...req.body,
            expiry: Date.now() + +expiry * 24 * 60 * 60 * 1000
        });

        if (!response) {
            return res.status(500).json({
                success: false,
                message: "Failed to create coupon"
            });
        }
        return res.status(200).json({
            success: true,
            Coupon: response
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create coupon",
            error: error.message
        });
    }
});
const getCoupons = asyncHandler(async(req, res) => {
    const response = await Coupon.find().select('-createAt -updatedAt')
    return res.status(200).json({
        mess: response ? true : false,
        Coupons: response ? response : "Something went wrong"
    })
})
const updateCoupon = asyncHandler(async(req, res) => {
    const { cid } = req.params
    if (Object.keys(req.body).length === 0) throw new Error("Missing input")
    if (req.body.expiry) {
        const expiry = parseInt(req.body.expiry);
        if (!isNaN(expiry)) {
            req.body.expiry = new Date(Date.now() + expiry * 24 * 60 * 60 * 1000);
        } else {
            throw new Error("Invalid expiry time");
        }
    }
    const response = await Coupon.findByIdAndUpdate(cid, req.body, { new: true })
    return res.status(200).json({
        mess: response ? true : false,
        Coupons: response ? response : "Something went wrong"
    })
})
const deleteCoupon = asyncHandler(async(req, res) => {
    const { cid } = req.params
    const response = await Coupon.findByIdAndDelete(cid)
    return res.status(200).json({
        mes: response ? true : false,
        updateCategory: response ? "Delete successfully!!!" : "something went wrong"
    })
})

module.exports = {
    createNewCoupon,
    getCoupons,
    updateCoupon,
    deleteCoupon,
}