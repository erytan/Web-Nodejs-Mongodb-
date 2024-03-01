const asyncHandler = require('express-async-handler')
const Brand = require('../models/brand')

const createBrand = asyncHandler(async(req, res) => {
    const { title } = req.body;

    // Kiểm tra xem đã tồn tại  blog category với title này chưa
    const existingCategory = await Brand.findOne({ title });

    if (existingCategory) {
        return res.status(400).json({ error: ' Blog Category with this title already exists' });
    }

    // Tạo mới  blog category nếu không có trùng lặp
    const brand = await Brand.create(req.body);
    return res.json({
        mes: true,
        brand: brand ? brand : 'Something went wrong'
    });
});
const getBrand = asyncHandler(async(req, res) => {
    const response = await Brand.find().select('title _id')
    return res.status(200).json({
        mes: response ? true : false,
        Brand: response ? response : "Something went wrong"
    })
})
const updateBrand = asyncHandler(async(req, res) => {
    const { bid } = req.params
    const response = await Brand.findByIdAndUpdate(bid, req.body, { new: true })
    return res.status(200).json({
        mes: response ? true : false,
        updateBrand: response ? response : "something went wrong"
    })
})
const deleteBrand = asyncHandler(async(req, res) => {
    const { bid } = req.params
    const response = await Brand.findByIdAndDelete(bid)
    return res.status(200).json({
        mes: response ? true : false,
        deleteBrand: response ? "Delete successfully!!!" : "something went wrong"
    })
})
module.exports = {
    createBrand,
    getBrand,
    updateBrand,
    deleteBrand
}