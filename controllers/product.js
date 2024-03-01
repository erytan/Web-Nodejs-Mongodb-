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
    //Field Limiting 
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ')
        queryCommand = queryCommand.select(fields)
    }


    //Pagination
    //Page=2&limit=10, 1-10 page 1, 11-20 page 2, 21-30 page 3
    //limit : số object lấy về 1 lần gọi API
    //skip : 2 
    // 1 2 3 ... 10
    // +2 => 2
    const page = +req.query.page || 1
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS
    const skip = (page - 1) * limit
    queryCommand = queryCommand.skip(skip).limit(limit)

    //Execute query
    //Số lượng sp thỏa điều kiện != số lượng sp trả về 1 lần gọi API
    try {
        const response = await queryCommand.exec();
        const counts = await Product.find(formatedQueries).countDocuments();

        return res.status(200).json({
            success: response ? true : false,
            count: counts,
            productDatas: response ? response : "Cannot get product "

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
const ratings = asyncHandler(async(req, res) => {
    const { _id } = req.user;
    const { star, comments, pid } = req.body;

    // Kiểm tra xem star, comments và pid đã được cung cấp hay không
    if (!star || !comments || !pid) {
        return res.status(400).json({ error: 'Missing inputs' });
    }

    try {
        // Tìm sản phẩm dựa trên pid
        const ratingProduct = await Product.findById(pid);

        // Kiểm tra xem người dùng đã đánh giá sản phẩm trước đó hay chưa
        const alreadyRating = ratingProduct && ratingProduct.ratings && ratingProduct.ratings.find(rating => rating.postedBy.toString() === _id.toString());

        if (alreadyRating) {
            // Nếu đã đánh giá trước đó, cập nhật star và comments
            const ratingId = alreadyRating._id; // Định nghĩa ratingId
            await Product.updateOne({ "ratings._id": ratingId }, { $set: { "ratings.$.star": star, "ratings.$.comments": comments } }, { new: true });
        } else {
            // Nếu chưa đánh giá trước đó, thêm star và comments mới
            await Product.findByIdAndUpdate(pid, { $push: { ratings: { star, comments, postedBy: _id } } }, { new: true });
        }

        // Sum ratings
        const updateProduct = await Product.findById(pid);
        const ratingCount = updateProduct.ratings.length;
        const sumRatings = updateProduct.ratings.reduce((sum, el) => sum + el.star, 0);
        updateProduct.totalRatings = Math.round(sumRatings * 10 / ratingCount) / 10;

        await updateProduct.save();

        return res.status(200).json({ success: true, updateProduct });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
// update ảnh mới ( + dồn ảnh )
// const uploadImagesProduct = asyncHandler(async(req, res) => {
//     const { pid } = req.params
//     if (pid) {
//     }
//     if (!req.files) throw new Error("Missing input")
//     const response = await Product.findByIdAndUpdate(pid, { $push: { images: { $each: req.files.map(el => el.path) } } }, { new: true })
//     return res.status(200).json({
//         mess: response ? true : false,
//         updateProduct: response ? response : 'Can not update product '
//     })
// })
const uploadImagesProduct = asyncHandler(async(req, res) => {
    const { pid } = req.params;

    if (!req.files) {
        throw new Error("Missing input");
    }

    // Kiểm tra xem có tìm thấy sản phẩm với pid không
    const existingProduct = await Product.findById(pid);
    if (!existingProduct) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    try {
        // Xóa ảnh cũ
        existingProduct.images = [];

        // Thêm ảnh mới
        existingProduct.images.push(...req.files.map(el => el.path));

        // Lưu sản phẩm với ảnh mới
        const updatedProduct = await existingProduct.save();

        return res.status(200).json({
            success: true,
            updatedProduct
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update product",
            error: error.message
        });
    }
});
module.exports = {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    ratings,
    uploadImagesProduct
}