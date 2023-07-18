const {createTransport} = require('nodemailer');

const {MAIL_ID, MAIL_PASS} = process.env;
const otpMap = new Map();
const OTP_EXPIRE_TIME = (5 * 60 * 1000);

const sender = createTransport({
    service: 'gmail',
    auth: {
        user: MAIL_ID,
        pass: MAIL_PASS
    }
});

const otpGenerator = function() {
    let otp = [];
    for (let i=0; i<6; i++) {
        otp.push(Math.floor(Math.random() * 10));
    }
    return otp.join('').toString();
}

const sendEmail = async (req, res) => {
    const otp = otpGenerator();
    const email = req.body.email;
    try {
        const sendResponse = await sender.sendMail({
                from: MAIL_ID,
                to: email,
                subject: "OTP from Zokso Clothing",
                text: `OTP for your email verification is ${otp}, this code will expire in 5 minutes, do not share this code with anyone!`
        });
        if (sendResponse) {
            const otpData = {
                otp,
                expireAt: (Date.now() + OTP_EXPIRE_TIME)
            }
            otpMap.set(email, otpData);
            res.status(200).json({message: `otp send to your email ${email}`});
        } else {
            console.log("something went wrong");
        }
    } catch(err) {
        res.status(500).json({error: err});
        console.log(err);
    }
}

const User = require('../../model/user');

const verifyEmail = async (req, res) => {
    const {email, otp} = req.body;
    try {
        const otpData = otpMap.get(email);
        if (otpData && otpData.otp == otp && otpData.expireAt >= Date.now()) {
            try {
                const response = await User.updateOne({email}, {$set: {"verified.email": true}});
                if (response.matchedCount === 0) {
                    otpMap.delete(email);
                    const error = new Error("user not found");
                    error.code = 400;
                    throw error;
                } else if (response.modifiedCount === 1) {
                    res.status(200).json({message: `email verified successfully`});
                    otpMap.delete(email);
                } else {
                    throw new Error();
                }
            } catch(err) {
                if (err.code === 400) {
                    return res.status(400).json({error: err.message});
                } else {
                    return res.status(500).json({error: "something went wrong! try resending"});
                }
            }
        } else if (otpData && otpData.otp == otp && otpData.expireAt < Date.now()) {
            res.status(400).json({error: `otp is expired`});
        } else if (otpData && otpData.otp != otp) {
            res.status(400).json({error: `invalid otp`});
        } else {
            res.status(400).json({error: `expired or invalid otp`});
        }
    } catch {
        res.status(500).json({error: "something went wrong! try resending"});
    }
}

module.exports = {sendEmail, verifyEmail};