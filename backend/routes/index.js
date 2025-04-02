const bookRouter = require("./bookRouter");
const siteRouter = require("./siteRouter");
const authorRouter = require("./authorRouter");
const publisherRouter = require("./publisherRouter");
const categoryRouter = require("./categoryRouter");
const volumeRouter = require("./volumeRouter");
const authRouter = require("./authRouter");
const meRouter = require("./meRouter");
const userRouter = require("./userRouter");

function route(app){
    app.use('/book', bookRouter);
    app.use('/author', authorRouter);
    app.use('/publisher', publisherRouter);
    app.use('/category', categoryRouter);
    app.use('/volume', volumeRouter);
    app.use('/auth', authRouter);
    app.use('/user', userRouter);
    app.use('/me', meRouter);
    app.use('/', siteRouter);
};

module.exports = route;