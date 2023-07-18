const User = require('../../model/user');
const bcrypt = require('bcrypt');

async function validate(data) {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    //for email
    const emailExist = await User.findOne({email: data.email});
    if (!data.email) {
        errors.email = "please enter your email address";
    } else if (!emailRegex.test(data.email)) {
        errors.email = "please provide a valid email";
    } else if (emailExist) {
        errors.email = "email already registered. try signing in";
    }

    //for new password
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[\w\s@$!%*?&#]{8,}$/;  
    if (!data.pass) {
        errors.pass = "please enter new password"
    } else if (!passRegex.test(data.pass) || data.pass.length < 8) {
        errors.pass = "password must be atleast 8 characters with atleast one uppercase, lowercase, digit and special character";
    }

    //for comfirm password
    if (data.pass && !data.conpass) {
        errors.conpass = "please confirm new password"
    } else if (data.pass && data.conpass && data.pass !== data.conpass) {
        errors.conpass = "passwords doesn't match";
    }

    //for gender
    if (data.gender && !['male', 'female'].includes(data.gender)) {
        errors.gender = "gender option corrupted!"
    }

    //for date for birth
    if (!data.dob) {
        errors.dob = "please provide your date of birth";
    } else {
        const current = new Date();
        const dob = new Date(data.dob);
        const age = current.getFullYear() - dob.getFullYear();
        if (age < 12) {
            errors.dob = "you must be atleast 12 years old";
        }
    }

    //for phone number
    const phoneExist = await User.findOne({phone: data.phone});
    const phoneRegex = /^\d{10}$/;   
    if (!data.phone) {
        errors.phone = "please provide your mobile number";
    } else if (!phoneRegex.test(data.phone)) {
        errors.phone = "please check your number and provide a valid one";
    } else if (phoneExist) {
        errors.phone = "phone number already registered";
    }

    //for firstname
    const nameRegex = /^[A-Za-z]+$/;
    if (!data.firstName) {
        errors.firstName = "please enter your firstname";
    } else if (data.firstName.includes(" ")) {
        errors.firstName = "name shouldn't contain spaces";
    } else if (!nameRegex.test(data.firstName)) {
        errors.firstName = "Firstname should only contain alphabetic characters";
    }

    //for lastname
    if (!data.lastName) {
        errors.lastName = "please enter your lastname";
    } else if (data.lastName.includes(" ")) {
        errors.lastName = "name shouldn't contain spaces";
    } else if (!nameRegex.test(data.lastName)) {
        errors.lastName = "Lastname should only contain alphabetic characters";
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
} 

module.exports = async (req, res) => {
    const valid = await validate(req.body);
    if (valid.isValid) {
        try {
            const formData = req.body;
            formData.password = await bcrypt.hash(formData.pass, 10);
            delete formData.pass;
            const user = new User(formData);
            const response = await user.save();
            if (response) {
                res.status(200).json({status: 200, message: "registered successfully"});
            } else {
                throw new Error();
            }
        } catch(err) {
            console.log(err);
            res.status(500).json({error: "internal server error"});
        }
    } else if (!valid.isValid) {
        res.status(400).json({status: 400, error: valid.errors});
    }
}
