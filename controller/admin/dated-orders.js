const Order = require('../../model/order');
const moment = require('moment');

module.exports = async (req, res) => {
    const {startDate, endDate} = req.query;
    try {
        const start = moment(startDate);
        const end = moment(endDate);

        const orders = await Order.find({
            orderDate: {$gte: start.toDate(), $lte: end.toDate()}
        });
        const labels = orders.map(order => order.orderDate.toISOString().split('T')[0]);
        const values = orders.map(order => order.totalAmount);
        
        res.status(200).json({labels, values});
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Internal server error"});
    }
}