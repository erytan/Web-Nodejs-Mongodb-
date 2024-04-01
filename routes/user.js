const router = require('express').Router()
const ctrls = require('../controllers/user')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')
router.post('/register', ctrls.register)
router.post('/login', ctrls.login)
//add router checkin
router.post('/checkin', ctrls.checkIn)
router.get('/monhoc', ctrls.getMonHoc)
router.get('/current', verifyAccessToken, ctrls.getCurrent)
router.post('/refreshtoken', ctrls.refreshAccessToken)
router.get('/logout', ctrls.logout)
router.get('/forgetpassword', ctrls.forgetPassword)
router.put('/resetpassword', ctrls.resetPassword)



router.put('/current', [verifyAccessToken], ctrls.updateUser)
router.put('/address', [verifyAccessToken], ctrls.updateUserAddress)

router.get('/', [verifyAccessToken, isAdmin], ctrls.getUser)
router.delete('/', [verifyAccessToken, isAdmin], ctrls.deleteUser)
router.put('/:uid', [verifyAccessToken, isAdmin], ctrls.updateUserByAdmin)

module.exports = router

// CRUD | Create - Read - Update - Delete | POST - GET -PUT - DELETE