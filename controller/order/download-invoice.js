const Order = require('../../model/order');
const pdfDocument = require('pdfkit');

module.exports = async (req, res) => {
    const {orderId} = req.body;
    console.log(orderId);
    try {
        const order = await Order.findById(orderId).populate('orderItems.productId', 'productName');
        if (!order) {
            throw new Error("couldn't find order");
        }

        const doc = new pdfDocument();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice.pdf`);

        doc.pipe(res);

        doc.font('Helvetica-Bold').fillColor('black').fontSize(18).text('Invoice', { align: 'center' });
        doc.moveDown();

        doc.fontSize(12).text(`Order ID: ${order.orderId}`);
        doc.fontSize(12).text(`Customer: ${order.shippingAddress.customerName} (${order.shippingAddress.contactNumber})`);
        doc.fontSize(12).text(`Order Date: ${order.orderDate.toDateString()}`);
        doc.fontSize(12).text(`Total Amount: $${order.totalAmount.toFixed(2)}`);

        doc.moveDown();
        doc.fontSize(12).text('Order Items:');
        order.orderItems.forEach(item => {
            doc.fontSize(10).text(`- Product: ${item.productId.productName}`);
            doc.fontSize(10).text(`  Quantity: ${item.quantity}`);
            doc.fontSize(10).text(`  Price: $${item.price.toFixed(2)}`);
        });

        doc.end();
    } catch(err) {
        console.log(err);
        res.json({error: "Internal server error"});
    }
}