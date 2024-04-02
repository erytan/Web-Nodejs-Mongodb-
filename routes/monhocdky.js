const router = require('express').Router()
const ctrls = require('../controllers/monhocdky')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

router.post('/dky-monhoc', [verifyAccessToken, isAdmin], ctrls.createMonHocDky)
router.get('/', ctrls.getMonHocDky)
router.put('/dkymonhoc/:tid', [verifyAccessToken], ctrls.updateTGMonHoc)
router.get('/dkymonhoc/current/:tid', [verifyAccessToken], ctrls.getCurrentMHDKy)
// router.get('/one/:blid', ctrls.getBlogs)
// router.put('/like/:blid', verifyAccessToken, ctrls.likeBlog)
// router.put('/dislike/:blid', verifyAccessToken, ctrls.dislikeBlog)
// router.put('/image/:blid', [verifyAccessToken, isAdmin], uploader.single('images'), ctrls.uploadImageBlog)


// router.put('/:blid', [verifyAccessToken, isAdmin], ctrls.updateBlog)
// router.delete('/:blid', [verifyAccessToken, isAdmin], ctrls.deleteBlog)

module.exports = router