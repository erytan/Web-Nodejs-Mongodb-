const Product = require('../models/product')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify');

const createProduct = asyncHandler(async(req, res) => {
    if (!req.body || !req.body.title) {
        throw new Error('Missing input: Title is required');
    }

    const titleSlug = slugify(req.body.title);

    try {
        const newProduct = await Product.create({...req.body, slug: titleSlug });
        return res.status(200).json({
            success: true,
            createProduct: newProduct
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
const getProduct = asyncHandler(async(req, res) => {
        const { pid } = req.params
        const product = await Product.findById(pid);
        return res.status(200).json({
            success: product ? true : false,
            productData: product ? product : "Cannot get product "
        })
    })
    //Filtering & sorting && pagination
const getProducts = asyncHandler(async(req, res) => {
    const queries = {...req.query }
        //tách các trường hợp đặt biệt ra khỏi query
    const excludeFields = ['limit', 'sort', 'page', 'fields']
    excludeFields.forEach(el => delete queries[el])

    //Format lại các operators cho đúng cú pháp của mongoose
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchedEl => `$${matchedEl}`)
    const formatedQueries = JSON.parse(queryString)

    //Filtering 
    if (queries && queries.title) formatedQueries.title = {
        $regex: queries.title,
        $options: 'i'
    }
    let queryCommand = Product.find(formatedQueries)


    // Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        queryCommand = queryCommand.sort(sortBy)
    }

    //Execute query
    //Số lượng sp thỏa điều kiện != số lượng sp trả về 1 lần gọi API
    try {
        const response = await queryCommand.exec();
        const counts = await Product.find(formatedQueries).countDocuments();

        return res.status(200).json({
            success: response ? true : false,
            productDataS: response ? response : "Cannot get product ",
            count: counts
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
})
const updateProduct = asyncHandler(async(req, res) => {
    const { pid } = req.params
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const updateProduct = await Product.findByIdAndUpdate(pid, req.body, { new: true })
    return res.status(200).json({
        success: updateProduct ? true : false,
        updateProduct: updateProduct ? updateProduct : "Can't update product "
    })
})
const deleteProduct = asyncHandler(async(req, res) => {
    const { pid } = req.params
    const deleteProduct = await Product.findByIdAndDelete(pid)
    return res.status(200).json({
        success: deleteProduct ? true : false,
        deleteProduct: deleteProduct ? "Delete successfully!!!!" : "Can't delete product "
    })
})
module.exports = {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct
}