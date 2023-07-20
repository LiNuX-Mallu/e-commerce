require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const nocache = require('nocache');
// const csrf = require('csurf');
// const cors = require('cors');

const {connectDB} = require('./database/db-connect');
const otpRouter = require('./routes/otpRouter');
const mainRouter = require('./routes/mainRouter');
const userRouter = require('./routes/userRouter');
const adminRouter = require('./routes/adminRouter');

const app = express();

// const corsOptions = {
//     origin: 'http://localhost:5000',
//     credentials: true,
//   };
// app.use(cors(corsOptions));

app.use(nocache());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const generateSecretKey = (length) => {
    return crypto.randomBytes(length).toString('hex');
};
const sessionSecretKey = generateSecretKey(32);

app.use(session({
    secret: sessionSecretKey,
    resave: true,
    saveUninitialized: true,
}));

//app.use(csrf());

app.set('view engine', 'ejs');


app.use('/', mainRouter);
app.use('/user', userRouter);
app.use('/otp', otpRouter);
app.use('/admin', adminRouter);

const port = process.env.PORT || 5000;

(async () => {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log(`server running: ${port}`);
        });
    } catch(err) {
        console.log('failed connecting to database', err);
    }
})();

