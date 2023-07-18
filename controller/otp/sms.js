const {TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID} = process.env;
const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, {lazyLoading: true});


const sendSMS = async (req, res) => {
    const phoneNumber = req.body.phone;
    const countryCode = 91;
    try {
        const otpResponse = await client.verify.v2
        .services(TWILIO_SERVICE_SID)
        .verifications.create({
            to: `+${countryCode}${phoneNumber}`,
            channel: "sms",
        });
        res.status(200).json({message: `otp send to your number ${phoneNumber}`});
    } catch(err) {
        res.status(400).json({error: 'something went wrong'});
    }
}


const User = require('../../model/user');

const verifySMS = async (req, res) => {
    const phoneNumber = req.body.phone;
    const otp = req.body.otp;
    const countryCode = 91;
    if (!otp) {
        return res.status(400).json({error: "invalid otp"});
    }
    try {
        const verifyResponse = await client.verify.v2
        .services(TWILIO_SERVICE_SID)
        .verificationChecks.create({
            to: `+${countryCode}${phoneNumber}`,
            code: otp,
        });

        const response = await User.updateOne({phone: phoneNumber}, {$set: {"verified.phone": true}});
        if (response.matchedCount === 0) {
            const error = new Error("user not found");
            error.code = 400;
            throw error;
        } else if (response.modifiedCount === 1) {
            res.status(200).json({message: `phone number verified successfully`});
        } else {
            throw new Error();
        }     
    } catch(err) {
        console.log(err);
        if (err.code === 400) {
            res.status(400).json({error: err.message});
        } else {
            res.status(500).json({error: "something went wrong! try resending"});
        } 
    }
}

module.exports = {sendSMS, verifySMS};