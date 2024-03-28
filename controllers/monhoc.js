const asyncHandler = require('express-async-handler')
const monhoc = require('../models/monhoc')


const createMonHoc = asyncHandler(async (req, res) => {
    // Check if the request body exists
    if (!req.body) {
        return res.status(400).json({ success: false, error: 'Missing input: Request body is required' });
    }

    // Check if required fields are provided in the request body
    if (!req.body.tgmonhoc || !req.body.tenmonhoc || !req.body.mamonhoc) {
        return res.status(400).json({ success: false, error: 'Missing input: Required fields are tgmonhoc, tenmonhoc, and mamonhoc' });
    }

    try {
        // Create a new document using the data from the request body
        const newMonHoc = await monhoc.create(req.body);

        // Return a success response with the created document
        return res.status(200).json({ success: true, data: newMonHoc });
    } catch (error) {
        // Return an error response if document creation fails
        return res.status(500).json({ success: false, error: 'Something went wrong' });
    }
});
const getMonHoc = asyncHandler(async(req, res) => {
    const response = await monhoc.find()
    return res.status(200).json({
        mes: response ? true : false,
        Monhoc: response ? response : " Something went wrong",
    })
});
const updateMonHoc = asyncHandler(async(req, res) => {
    const { mid } = req.params;
    const updateMH = await monhoc.findByIdAndUpdate(mid, req.body, { new: true });
    return res.status(200).json({
        success: updateMH ? true : false,
        updateMonHoc: updateMH ? updateMH : "Can't update Mon Hoc "
    });
});
const updateTGMonHoc = asyncHandler(async(req, res) => {
    const { mid } = req.params;
    if (!req.body.tgmonhoc) {
        return res.status(400).json({ success: false, error: 'Missing input: tgmonhoc' });
    }
    try {
        const response = await monhoc.findByIdAndUpdate(mid, { $push: { tgmonhoc: req.body.tgmonhoc } }, { new: true }).select('-tenmonhoc -mamonhoc');
        return res.status(200).json({
            success: response ? true : false,
            mes: response ? response : "Can not update address"
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});




module.exports = {
    createMonHoc,
    getMonHoc,
    updateMonHoc,
    updateTGMonHoc,
}