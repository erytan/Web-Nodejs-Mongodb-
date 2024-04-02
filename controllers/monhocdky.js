const asyncHandler = require('express-async-handler')
const monhocdky = require('../models/monhocdky')
const createMonHocDky = asyncHandler(async (req, res) => {
    // Kiểm tra xem có request body không
    if (!req.body) {
        return res.status(400).json({ success: false, error: 'Missing input: Request body is required' });
    }

    // Kiểm tra xem các trường bắt buộc có được cung cấp trong request body không
    if (!req.body.tgmonhoc || !req.body.tenmonhoc || !req.body.mamonhoc || !req.body.sinhviendky) {
        return res.status(400).json({ success: false, error: 'Missing input' });
    }

    try {
        // Tạo một tài liệu mới sử dụng dữ liệu từ request body
        const newMonHocDky = await monhocdky.create(req.body);

        // Trả về một phản hồi thành công với tài liệu đã tạo
        return res.status(200).json({ success: true, data: newMonHocDky });
    } catch (error) {
        // Xử lý trường hợp xung đột nếu cần
        if (error.code === 11000 && error.keyPattern && (error.keyPattern.mamonhoc || error.keyPattern.tenmonhoc)) {
            // Xử lý tình huống xung đột ở đây (ví dụ: bỏ qua, cập nhật, hoặc xử lý theo cách khác)
            return res.status(400).json({ success: false, error: 'Duplicate mamonhoc or tenmonhoc' });
        } else {
            // Trả về một phản hồi lỗi chung nếu không phải là lỗi xung đột
            console.error("Lỗi khi tạo tài liệu:", error);
            return res.status(500).json({ success: false, error: 'Something went wrong' });
        }
    }
});

const updateTGMonHoc = asyncHandler(async(req, res) => {
    const { tid } = req.params;
    if (!req.body.sinhviendky) {
        return res.status(400).json({ success: false, error: 'Missing input: Ma sv' });
    }
    try {
        const response = await monhocdky.findByIdAndUpdate(tid, { $push: { sinhviendky: req.body.sinhviendky } }, { new: true }).select('-tenmonhoc -mamonhoc -tgmonhoc');
        return res.status(200).json({
            success: response ? true : false,
            mes: response ? response : "Can not update svdky mon hoc"
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
const getMonHocDky = asyncHandler(async(req, res) => {
    const response = await monhocdky.find()
    return res.status(200).json({
        mes: response ? true : false,
        Monhoc: response ? response : " Something went wrong",
    })
});
const getCurrentMHDKy = asyncHandler(async (req, res) => {
    const { tid } = req.params;
    try {
        const response = await monhocdky.findById(tid);
        if (!response) {
            return res.status(404).json({ success: false, message: 'MonHocDky not found' });
        }
        return res.status(200).json({ success: true, data: response });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = {
    createMonHocDky,
    updateTGMonHoc,
    getMonHocDky,
    getCurrentMHDKy
}