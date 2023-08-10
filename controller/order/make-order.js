const User = require('../../model/user');
const Order = require('../../model/order');
const Product = require('../../model/product');

const Coupon = require('../../model/coupon');

async function couponCheck (couponCode, totalAmount, req) {
    try {
        const coupon = await Coupon.findOne({couponCode: couponCode.toLowerCase()});
        if (coupon) {
            if ((+totalAmount - 40) < coupon.minOrderAmount) {
                return false;
            }
            if (coupon.expireDate < Date.now() || coupon.usedBy.includes(req.session.userId)) {
                return false
            }
            let money;
            if (coupon.couponType === "freeDelivery") {
                money = 40;
            } else if (coupon.couponType === "percentageDiscount") {
                money = +totalAmount * (coupon.discountValue / 100);
            } else if (coupon.couponType === "fixedPriceDiscount") {
                money = coupon.discountValue;
            }
            return money;
        } else {
            return false;
        } 
    } catch(err) {
        throw err;
    }
}

module.exports = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);

        const formData = {};
        if (req.body.address) {
            formData.shippingAddress = user.address.find((address) => address._id.toString() === req.body.address);
        } else {
            formData.shippingAddress = {};
            formData.shippingAddress.customerName = req.body.customerName;
            formData.shippingAddress.contactNumber = req.body.contactNumber;
            formData.shippingAddress.addressType = req.body.addressType;
            formData.shippingAddress.houseNumber = req.body.houseNumber;
            formData.shippingAddress.street = req.body.street;
            formData.shippingAddress.city = req.body.city;
            formData.shippingAddress.state = req.body.state;
            formData.shippingAddress.pincode = req.body.pincode;
            formData.shippingAddress.landmark = req.body.landmark;
        }
        formData.paymentMethod = req.body.paymentMethod;
        formData.userId = req.session.userId;
        formData.orderItems = [];
        formData.totalAmount = 0;

        for (const item of user.cart) {
            const product = await Product.findById(item.productId).populate('category.categoryId', 'offer');
            const orderItem = {
                productId: item.productId,
                quantity: item.quantity,
                price: (product.price - ((product.price * product.category.categoryId.offer) / 100) - ((product.price * product.offer) / 100)) * item.quantity,
                size: item.size,
                color: item.color
            };
            formData.orderItems.push(orderItem);
            formData.totalAmount += (product.price - ((product.price * product.category.categoryId.offer) / 100) - ((product.price * product.offer) / 100)) * item.quantity;
        };
        formData.totalAmount += 40;
        
        if (req.body.paymentMethod === "razorpay" || req.body.paymentMethod === "walletPay") {
            formData.paymentStatus = "pending";
            formData.orderStatus = "pending";
        } else if (req.body.paymentMethod === "cod") {
            formData.paymentStatus = "success";
            formData.orderStatus = "confirmed";
        }

        if (req.body.couponCode) {
            const money = await couponCheck(req.body.couponCode, formData.totalAmount, req)
            if (money) {
                formData.totalAmount -= money;
                formData.couponMoney = money;
            } else {
                throw new Error();
            }
        }


        const currentDate = new Date();
        const deliveryDate = new Date(currentDate);
        deliveryDate.setDate(currentDate.getDate() + 7);
        formData['trackInfo.deliveryDate'] = deliveryDate;

        const newOrder = new Order(formData);
        const ordered = await newOrder.save();
        if (ordered) {
            res.status(200).json({order: ordered});
            if (req.body.paymentMethod === "cod") {
                const stockUpdater = user.cart.map(async (item) => {
                    const product = await Product.findById(item.productId);
                    product.sizeAndStock[item.size] -= item.quantity;
                    return product.save();
                });
                await Promise.all(stockUpdater);
                user.cart = [];
                await user.save();
            }
        } else {
            throw new Error();
        }

    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Internal server error"});
    }   
};