const router = require('express').Router()
const ctrls = require('../controllers/blog')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')
const uploader = require('../config/cloudinary.config')

router.post('/', [verifyAccessToken, isAdmin], ctrls.createBlog)
router.get('/', ctrls.getBlog)
router.get('/one/:blid', ctrls.getBlogs)
router.put('/like/:blid', verifyAccessToken, ctrls.likeBlog)
router.put('/dislike/:blid', verifyAccessToken, ctrls.dislikeBlog)
router.put('/image/:blid', [verifyAccessToken, isAdmin], uploader.single('images'), ctrls.uploadImageBlog)


router.put('/:blid', [verifyAccessToken, isAdmin], ctrls.updateBlog)
router.delete('/:blid', [verifyAccessToken, isAdmin], ctrls.deleteBlog)

module.exports = router