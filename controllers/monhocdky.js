const asyncHandler = require('express-async-handler')
const monhocdky = require('../models/monhocdky')

const createMonHocDky = asyncHandler(async (req, res) => {
    // Check if the request body exists
    if (!req.body) {
        return res.status(400).json({ success: false, error: 'Missing input: Request body is required' });
    }

    // Check if required fields are provided in the request body
    if (!req.body.tgmonhoc || !req.body.tenmonhoc || !req.body.mamonhoc|| !req.body.sinhviendky) {
        return res.status(400).json({ success: false, error: 'Missing input' });
    }

    try {
        // Create a new document using the data from the request body
        const newMonHocDky = await monhocdky.create(req.body);

        // Return a success response with the created document
        return res.status(200).json({ success: true, data: newMonHocDky });
    } catch (error) {
        // Return an error response if document creation fails
        return res.status(500).json({ success: false, error: 'Something went wrong' });
    }
});
const updateTGMonHoc = asyncHandler(async(req, res) => {
    const { mid } = req.params;
    if (!req.body.sinhviendky) {
        return res.status(400).json({ success: false, error: 'Missing input: tgmonhoc' });
    }
    try {
        const response = await monhocdky.findByIdAndUpdate(mid, { $push: { sinhviendky: req.body.sinhviendky } }, { new: true }).select('-tenmonhoc -mamonhoc -tgmonhoc');
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

module.exports = {
    createMonHocDky,
    updateTGMonHoc,
    getMonHocDky
}