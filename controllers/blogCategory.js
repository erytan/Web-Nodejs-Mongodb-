const asyncHandler = require('express-async-handler')
const BlogCategory = require('../models/blogCategory')

const createBlogCategory = asyncHandler(async(req, res) => {
    const { title } = req.body;

    // Kiểm tra xem đã tồn tại  blog category với title này chưa
    const existingCategory = await BlogCategory.findOne({ title });

    if (existingCategory) {
        return res.status(400).json({ error: ' Blog Category with this title already exists' });
    }

    // Tạo mới  blog category nếu không có trùng lặp
    const newCategory = await BlogCategory.create(req.body);
    return res.json({
        mes: true,
        category: newCategory ? newCategory : 'Something went wrong'
    });
});
const getBlogCategory = asyncHandler(async(req, res) => {
    const response = await BlogCategory.find().select('title _id')
    return res.status(200).json({
        mes: response ? true : false,
        blogCategory: response ? response : "Something went wrong"
    })
})
const updateBlogCategory = asyncHandler(async(req, res) => {
    const { bid } = req.params
    const response = await BlogCategory.findByIdAndUpdate(bid, req.body, { new: true })
    return res.status(200).json({
        mes: response ? true : false,
        updateCategory: response ? response : "something went wrong"
    })
})
const deleteBlogCategory = asyncHandler(async(req, res) => {
    const { bid } = req.params
    const response = await BlogCategory.findByIdAndDelete(bid)
    return res.status(200).json({
        mes: response ? true : false,
        updateCategory: response ? "Delete successfully!!!" : "something went wrong"
    })
})
module.exports = {
    createBlogCategory,
    getBlogCategory,
    updateBlogCategory,
    deleteBlogCategory
}