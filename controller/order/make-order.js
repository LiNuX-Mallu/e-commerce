const User = require('../../model/user');
const Order = require('../../model/order');
const Product = require('../../model/product');

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
            const product = await Product.findById(item.productId);
            const orderItem = {
                productId: item.productId,
                quantity: item.quantity,
                price: product.price * item.quantity,
                size: item.size,
                color: item.color
            };
            formData.orderItems.push(orderItem);
            formData.totalAmount += product.price * item.quantity;
        };
        formData.totalAmount += 40;
        if (req.body.paymentMethod === "cod") {
            formData.paymentStatus = "pending";
            formData.orderStatus = "confirmed";

            const currentDate = new Date();
            const deliveryDate = new Date(currentDate);
            deliveryDate.setDate(currentDate.getDate() + 7);
            formData['trackInfo.deliveryDate'] = deliveryDate;

            const newOrder = new Order(formData);
            const ordered = await newOrder.save();
            if (ordered) {
                const dayIndex = deliveryDate.getDay();
                const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                const day = daysOfWeek[dayIndex];

                const monthIndex = deliveryDate.getMonth();
                const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                const month = monthsOfYear[monthIndex];

                const date = deliveryDate.getDate();

                const delivery = `${day} ${date} ${month}`;

                res.status(200).json({delivery});

                const stockUpdater = user.cart.map(async (item) => {
                    const product = await Product.findById(item.productId);
                    product.sizeAndStock[item.size] -= item.quantity;
                    return product.save();
                });
                await Promise.all(stockUpdater);
                user.cart = [];
                await user.save();
            } else {
                throw new Error();
            }
        }

    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Internal server error"});
    }   
};