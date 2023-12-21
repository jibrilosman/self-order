const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./database/collections/products');
require('./database/collections/categories');
require('./database/collections/orders');
const productRoutes = require('./api/productRoutes');
const categoryRoutes = require('./api/categoryRoutes');
const Order = require('./database/collections/orders');

const app = express();

const port = process.env.PORT; 
const DATABASE = process.env.MONGODB_URI;

// Middleware
app.use(express.json());
app.use(cors());

//connect to database
mongoose.connect(DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Connected to Database'));


app.get('/api/', (req, res) => {
    res.send('Hello World');
});


// order routes

app.post('/api/orders', async (req, res) => {
    const lastOrder = await Order.find().sort({ number: -1 }).limit(1);
    const lastNumber = lastOrder.length === 0 ? 0 : lastOrder[0].number;
    if (
        !req.body.orderType ||
        !req.body.paymentType ||
        !req.body.orderItems ||
        req.body.orderItems.length === 0
    ) {
        return res.send({ message: "Data is required." });
    }
    const order = await Order({...req.body, number: lastNumber + 1 }).save();
    res.send(order);
});

app.get('/api/orders', async (req, res) => {
    const orders = await Order.find({ isDelivered: false , isCanceled: false });
    res.send(orders);
});

app.put('/api/orders/:id', async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        if (req.body.action === 'ready') {
            order.isReady = true;
            order.inProgress = false;
        } else if (req.body.action === 'deliver') {
            order.isDelivered = true;
        } else if (req.body.action === 'cancel') {
            order.isCanceled = true;
        }
        await order.save();
        res.send({ message: 'Done' });
    } else {
        res.status(404).send({ message: 'Order not found' });
    }
});



// Routes
app.use('/api', productRoutes);
app.use('/api', categoryRoutes);
app.use('/images', express.static('images'));


app.listen(port, () => console.log(`Server started on port ${port}`));



