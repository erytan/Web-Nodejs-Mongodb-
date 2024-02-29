const asyncHandler = require('express-async-handler')
const ProductCategory = require('../models/productCategory')

const createCategory = asyncHandler(async(req, res) => {
    const { title } = req.body;

    // Kiểm tra xem đã tồn tại category với title này chưa
    const existingCategory = await ProductCategory.findOne({ title });

    if (existingCategory) {
        return res.status(400).json({ error: 'Category with this title already exists' });
    }

    // Tạo mới category nếu không có trùng lặp
    const newCategory = await ProductCategory.create(req.body);
    return res.json({
        mes: true,
        category: newCategory ? newCategory : 'Something went wrong'
    });
});
const getCategory = asyncHandler(async(req, res) => {
    const response = await ProductCategory.find().select('title _id')
    return res.status(200).json({
        mes: response ? true : false,
        categoryDatas: response ? response : "Something went wrong"
    })
})
const updateCategory = asyncHandler(async(req, res) => {
    const { pcid } = req.params
    const response = await ProductCategory.findByIdAndUpdate(pcid, req.body, { new: true })
    return res.status(200).json({
        mes: response ? true : false,
        updateCategory: response ? response : "something went wrong"
    })
})
const deleteCategory = asyncHandler(async(req, res) => {
    const { pcid } = req.params
    const response = await ProductCategory.findByIdAndDelete(pcid)
    return res.status(200).json({
        mes: response ? true : false,
        updateCategory: response ? "Delete successfully!!!" : "something went wrong"
    })
})
module.exports = {
    createCategory,
    getCategory,
    updateCategory,
    deleteCategory
}