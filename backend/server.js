const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // Frontend URL
    credentials: true
}));

// ========== MongoDB Connection ==========
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pretty-parcel', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB Connected:', conn.connection.host);
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};

connectDB();

// ========== Database Models ==========

// User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    postalCode: { type: String, default: '' },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

// Order Schema
const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
        id: Number,
        name: String,
        price: Number,
        quantity: Number,
        emoji: String
    }],
    totalPrice: { type: Number, required: true },
    deliveryInfo: {
        fullName: String,
        email: String,
        phone: String,
        address: String,
        city: String,
        postalCode: String,
        specialNotes: String
    },
    orderStatus: { type: String, default: 'pending', enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// ========== Authentication Middleware ==========
const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// ========== API Routes ==========

// ===== USER AUTHENTICATION ROUTES =====

// Signup Route
app.post('/api/users/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Create new user
        user = new User({
            name,
            email,
            password
        });

        await user.save();

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error during signup' });
    }
});

// Login Route
app.post('/api/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                city: user.city,
                postalCode: user.postalCode
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// Get Current User Route
app.get('/api/users/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update User Profile Route
app.put('/api/users/profile', auth, async (req, res) => {
    try {
        const { name, phone, address, city, postalCode } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            {
                name: name || undefined,
                phone: phone || undefined,
                address: address || undefined,
                city: city || undefined,
                postalCode: postalCode || undefined
            },
            { new: true }
        ).select('-password');

        res.json({
            message: 'Profile updated successfully',
            user
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during profile update' });
    }
});

// ===== ORDER ROUTES =====

// Create Order Route
app.post('/api/orders/create', auth, async (req, res) => {
    try {
        const { products, deliveryInfo } = req.body;

        // Validation
        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: 'Invalid products' });
        }

        if (!deliveryInfo) {
            return res.status(400).json({ message: 'Delivery information required' });
        }

        // Calculate total price
        const totalPrice = products.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Create order
        const order = new Order({
            userId: req.user.userId,
            products,
            totalPrice,
            deliveryInfo,
            orderStatus: 'pending'
        });

        await order.save();

        // Add order to user's orders
        await User.findByIdAndUpdate(
            req.user.userId,
            { $push: { orders: order._id } }
        );

        res.status(201).json({
            message: 'Order placed successfully',
            order: {
                id: order._id,
                totalPrice: order.totalPrice,
                orderStatus: order.orderStatus,
                createdAt: order.createdAt
            }
        });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ message: 'Server error while creating order' });
    }
});

// Get User Orders Route
app.get('/api/orders/my-orders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching orders' });
    }
});

// Get Single Order Route
app.get('/api/orders/:orderId', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user owns this order
        if (order.userId.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching order' });
    }
});

// ===== ADMIN ROUTES =====

// Get All Orders (Admin)
app.get('/api/admin/orders', async (req, res) => {
    try {
        // In production, add authentication to verify admin
        const orders = await Order.find()
            .populate('userId', 'name email phone')
            .sort({ createdAt: -1 });
        
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching orders' });
    }
});

// Update Order Status (Admin)
app.put('/api/admin/orders/:orderId/status', async (req, res) => {
    try {
        const { status } = req.body;

        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.orderId,
            { orderStatus: status, updatedAt: Date.now() },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({
            message: 'Order status updated',
            order
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error updating order' });
    }
});

// ===== Health Check =====
app.get('/api/health', (req, res) => {
    res.json({ message: '✅ The Pretty Parcel API is running!' });
});

// ========== Error Handler ==========
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal server error'
    });
});

// ========== Start Server ==========
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n🎀 The Pretty Parcel Backend is running on http://localhost:${PORT}`);
    console.log(`📚 API Documentation:`);
    console.log(`   - Signup: POST /api/users/signup`);
    console.log(`   - Login: POST /api/users/login`);
    console.log(`   - Create Order: POST /api/orders/create`);
    console.log(`   - View Orders: GET /api/orders/my-orders`);
    console.log(`   - Admin Orders: GET /api/admin/orders\n`);
});

module.exports = { app, User, Order };
