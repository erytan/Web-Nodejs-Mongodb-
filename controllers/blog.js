const asyncHandler = require('express-async-handler')
const Blog = require('../models/blog')

const createBlog = asyncHandler(async(req, res) => {
    if (!req.body || !req.body.title) {
        throw new Error('Missing input: Title is required');
    }
    const response = await Blog.create(req.body)
    return res.status(200).json({
        mes: response ? true : false,
        Blog: response ? response : " Something went wrong"
    })
});
const getBlog = asyncHandler(async(req, res) => {
    const response = await Blog.find()
    return res.status(200).json({
        mes: response ? true : false,
        Blog: response ? response : " Something went wrong",
    })
});

//Dislike 
//Like
/*
Khi người dùng like một bài blog thì :
1. Check xem người đó có dislike hay không => bỏ dislike
2. Check xem người đó có like hay không => bỏ like / thêm like
 */
//pull
//push
const likeBlog = asyncHandler(async(req, res) => {
    if (!req.user) {
        return res.status(401).json({ mes: "Người dùng chưa xác thực." });
    }

    const { _id } = req.user;
    const { blid } = req.params;
    if (!blid) {
        throw new Error("Thiếu thông tin đầu vào");
    }

    const blog = await Blog.findById(blid);

    const alreadyDisLiked = blog && blog.disLikes && blog.disLikes.find(el => el.toString() === _id);
    if (alreadyDisLiked) {
        const response = await Blog.findByIdAndUpdate(blid, { $pull: { disLikes: _id } }, { new: true });
        return res.status(200).json({
            success: response ? true : false,
            rs: response
        });
    }

    const isLiked = blog && blog.likes && blog.likes.find(el => el.toString() === _id);
    if (isLiked) {
        const response = await Blog.findByIdAndUpdate(blid, { $pull: { likes: _id } }, { new: true });
        return res.status(200).json({
            success: response ? true : false,
            rs: response
        });
    }

    const response = await Blog.findByIdAndUpdate(blid, { $push: { likes: _id } }, { new: true });
    return res.status(200).json({
        success: response ? true : false,
        rs: response
    });
});

const dislikeBlog = asyncHandler(async(req, res) => {
    if (!req.user) {
        return res.status(401).json({ mes: "Người dùng chưa xác thực." });
    }

    const { _id } = req.user;
    const { blid } = req.params;
    if (!blid) {
        throw new Error("Thiếu thông tin đầu vào");
    }

    const blog = await Blog.findById(blid);

    const alreadyLiked = blog && blog.likes && blog.likes.find(el => el.toString() === _id);
    if (alreadyLiked) {
        const response = await Blog.findByIdAndUpdate(blid, { $pull: { likes: _id } }, { new: true });
        return res.status(200).json({
            success: response ? true : false,
            rs: response
        });
    }

    const alreadyDisLiked = blog && blog.disLikes && blog.disLikes.find(el => el.toString() === _id);
    if (alreadyDisLiked) {
        const response = await Blog.findByIdAndUpdate(blid, { $pull: { disLikes: _id } }, { new: true });
        return res.status(200).json({
            success: response ? true : false,
            rs: response
        });
    }

    const response = await Blog.findByIdAndUpdate(blid, { $push: { disLikes: _id } }, { new: true });
    return res.status(200).json({
        success: response ? true : false,
        rs: response
    });
});

const updateBlog = asyncHandler(async(req, res) => {
    const { blid } = req.params
    const response = await Blog.findByIdAndUpdate(blid, req.body, { new: true })
    return res.status(200).json({
        mes: response ? true : false,
        updateBlog: response ? response : " Something went wrong",
    })
});

const deleteBlog = asyncHandler(async(req, res) => {
    const { blid } = req.params
    const response = await Blog.findByIdAndDelete(blid)
    return res.status(200).json({
        mes: response ? true : false,
        updateBlog: response ? "Delete Successfully!!" : " Something went wrong",
    })
});
//Hiên thông tin người like trong blog sử dụng populate
const getBlogs = asyncHandler(async(req, res) => {
    const { blid } = req.params;
    try {
        const response = await Blog.findByIdAndUpdate(blid, { $inc: { munberViews: 1 } }, { new: true })
            .populate('likes', 'firstname lastname')
            .populate('disLikes', 'firstname lastname');

        if (!response) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy blog với ID đã cung cấp."
            });
        }

        return res.status(200).json({
            success: true,
            Blog: response
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi khi lấy blog."
        });
    }
});
const uploadImageBlog = asyncHandler(async(req, res) => {
    const { blid } = req.params;

    if (!req.file) {
        throw new Error("Missing input");
    }

    // Kiểm tra xem có tìm thấy sản phẩm với blid không
    const existingBlog = await Blog.findById(blid);
    if (!existingBlog) {
        return res.status(404).json({
            success: false,
            message: "Blog not found"
        });
    }
    try {
        // Gán ảnh mới cho blog
        existingBlog.images = req.file.path;

        // Lưu sản phẩm với ảnh mới
        const updatedBlog = await existingBlog.save();

        return res.status(200).json({
            success: true,
            updatedBlog
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update Blog",
            error: error.message
        });
    }
});
module.exports = {
    createBlog,
    getBlog,
    updateBlog,
    deleteBlog,
    likeBlog,
    dislikeBlog,
    getBlogs,
    uploadImageBlog

}