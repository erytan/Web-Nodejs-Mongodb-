const { notFound, errHandler } = require('../middlewares/errHandler')
const userRouter = require('./user')
const productRouter = require('./product')
const productCategoryRouter = require('./productCategory')
const blogCategory = require('./blogCategory')


const initRoutes = (app) => {
    app.use('/api/user', userRouter)
    app.use('/api/product', productRouter)
    app.use('/api/prodcategory', productCategoryRouter)
    app.use('/api/blogcategory', blogCategory)

    app.use(notFound)
    app.use(errHandler)
}
module.exports = initRoutes