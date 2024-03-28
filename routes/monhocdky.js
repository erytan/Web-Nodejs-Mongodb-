const router = require('express').Router()
const ctrls = require('../controllers/monhocdky')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

router.post('/', [verifyAccessToken, isAdmin], ctrls.createMonHocDky)
router.get('/', ctrls.getMonHocDky)
// router.put('/:mid', [verifyAccessToken, isAdmin], ctrls.updateMonHoc)
router.put('/dkymonhoc/:mid', [verifyAccessToken], ctrls.updateTGMonHoc)

// router.get('/one/:blid', ctrls.getBlogs)
// router.put('/like/:blid', verifyAccessToken, ctrls.likeBlog)
// router.put('/dislike/:blid', verifyAccessToken, ctrls.dislikeBlog)
// router.put('/image/:blid', [verifyAccessToken, isAdmin], uploader.single('images'), ctrls.uploadImageBlog)


// router.put('/:blid', [verifyAccessToken, isAdmin], ctrls.updateBlog)
// router.delete('/:blid', [verifyAccessToken, isAdmin], ctrls.deleteBlog)

module.exports = router