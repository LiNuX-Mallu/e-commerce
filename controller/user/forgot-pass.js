const User =require('../../model/user');
const {v4: uuidv4} = require('uuid');
const {createTransport} = require('nodemailer');
const bcrypt = require('bcrypt');

const {MAIL_ID, MAIL_PASS} = process.env;
const uuidMap = new Map();
const UUID_EXPIRE_TIME = (5 * 60 * 1000);

const sender = createTransport({
    service: 'gmail',
    auth: {
        user: MAIL_ID,
        pass: MAIL_PASS
    }
});

const forgotPass = async (req, res) => {
    const {user} = req.body;
    try {
        let userExist;
        const isString = (isNaN(+user));
        if (isString) {
            userExist = await User.findOne({email: user});
        } else {
            userExist = await User.findOne({phone: user});
        }
        if (userExist) {
            const uuid = uuidv4();
            const sendResponse = await sender.sendMail({
                from: MAIL_ID,
                to: userExist.email,
                subject: "Password reset link from Zokso Clothing",
                text: `http://zokso.online/reset-password/${uuid}
                link is only valid for 5 minutes!`,
            });
            if (sendResponse) {
                const uuidData = {
                    email: userExist.email,
                    expireAt: (Date.now() + UUID_EXPIRE_TIME)
                }
                uuidMap.set(uuid, uuidData);
            } else {
                throw new Error("couldn't send reset link");
            }

            if (isString) {
                return res.status(200).json({message: `password reset link send to email ${userExist.email}`});
            } else {
                userEmail = userExist.email.split("");
                for (let i=0; i<userEmail.length/4; i++) {
                    userEmail[i] = "*";
                }
                return res.status(200).json({message: `password reset link send to registered email ${userEmail.join("")}`});
            }
        } else {
            let error;
            if (isString) {
                error = new Error("No user found with this email address");
            } else {
                error = new Error("No user found with this phone number");
            }
            error.code = 400;
            throw error;
        }
    } catch(err) {
        console.log(err);
        if (err.code === 400) {
            res.status(400).json({error: err.message});
        }
    }
};

const resetTemplate = (req, res) => {
    const uuid = req.params.uuid;
    const uuidData = uuidMap.get(uuid);
    if (!uuidData) {
        return res.status(500).end("invalid url address");
    } else if (uuidData.expireAt < Date.now()) {
        uuidMap.delete(uuid);
        return res.status(500).end("reset link expired");
    } else {
        res.render('user/forgot', {uuid: uuid.toString()});
    }
};

const resetPass = async (req, res) => {
    const {uuid, password, confirmPassword} = req.body;
    const uuidData = uuidMap.get(uuid);
    if (!uuidData) {
        return res.status(500).json({error: "something went wrong"});
    } else {
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[\w\s@$!%*?&#]{8,}$/;  
        if (!password) {
            return res.status(400).json({error: "please enter new password"});
        } else if (!passRegex.test(password) || password.length < 8) {
            return res.status(400).json({error: "password must be atleast 8 characters with atleast one uppercase, lowercase, digit and special character"});
        }

        if (password && !confirmPassword) {
            return res.status(400).json({error: "please confirm new password"});
        } else if (password && confirmPassword && password !== confirmPassword) {
            return res.status(400).json({error: "Comfirm password doesn't match"});
        }
        const email = uuidData.email;
        const pass = await bcrypt.hash(password, 10);
        try {
            const updated = await User.updateOne({email}, {$set: {password: pass}});
            console.log(updated.modifiedCount);
            if (updated.modifiedCount !== 0) {
                uuidMap.delete(uuid);
                return res.status(200).json({message: "New password updated"});
            } else {
                return res.status(500).json({error: "error updating password"});
            }
        } catch(err) {
            console.log(err);
            return res.status(500).json({error: "something went wrong"});
        }
    }
}

module.exports = {forgotPass, resetTemplate, resetPass};