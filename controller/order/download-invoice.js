const Order = require('../../model/order');
const pdfDocument = require('pdfkit');
const path = require('path');

const spartanMB = path.join(__dirname, '../../public/fonts/SpartanMB-SemiBold.ttf');

module.exports = async (req, res) => {
    const {orderId} = req.body;
    console.log(orderId);
    try {
        const order = await Order.findById(orderId).populate('orderItems.productId', 'productName').populate('userId');
        if (!order) {
            throw new Error("couldn't find order");
        }

        const doc = new pdfDocument({
            size: [700, 792],
        });


        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice.pdf`);

        doc.pipe(res);

        doc.font('Helvetica-Bold').fillColor('black').fontSize(18).text('Order Invoice', { align: 'center' });
        doc.moveDown(1.2);

         // Order Details
        doc.font(spartanMB).fontSize(18).text("Order Details:");
        doc.moveDown(0.2);
        doc.fontSize(12).text(`Order ID: ${order.orderId}`);
        doc.text(`Ordered Date: ${order.orderDate.toLocaleDateString()}`);
        doc.text(`Order Delivered Date: ${order.trackInfo.deliveryDate.toLocaleDateString()}`);

        // Customer Information
        doc.moveDown(1.2);
        doc.font(spartanMB).fontSize(18).text("Customer Information:");
        doc.moveDown(0.2);
        doc.fontSize(12).text(`Customer Name: ${order.shippingAddress.customerName}`);
        doc.text(`Email: ${order.userId.email}`);
        doc.text(`Contact Number: ${order.shippingAddress.contactNumber}`);
        doc.text(`Payment Method: ${order.paymentMethod}`);
        doc.text(
        `Address: ${order.shippingAddress.houseNumber}, ${order.shippingAddress.street}, ${order.shippingAddress.city} - ${order.shippingAddress.pincode}, ${order.shippingAddress.state}, ${order.shippingAddress.country}`
        );

        // Product Details
        doc.moveDown(1.2);
        doc.font(spartanMB).fontSize(18).text("Product Details:");
        doc.moveDown(0.2);

        order.orderItems.forEach((item, index) => {
        doc.fontSize(12).text(`${index + 1}. Product: ${item.productId.productName}`);
        doc.text(`   Quantity: ${item.quantity}`);
        doc.text(`   Price per Unit: RS.${item.price}`);
        doc.text(`   Subtotal: RS.${item.price * item.quantity}`);
        doc.moveDown(0.4);
        });

        // Total Amount
        doc.moveDown(1.2);
        doc.font(spartanMB).fontSize(14).text(`Total Amount: RS.${order.totalAmount}`, {
        align: "right",
        });
        doc.end();
    } catch(err) {
        console.log(err);
        res.json({error: "Internal server error"});
    }
}