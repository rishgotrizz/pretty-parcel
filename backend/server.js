const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();

/* ================= MIDDLEWARE ================= */

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

/* ================= DATABASE ================= */

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected:", conn.connection.host);
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
        process.exit(1);
    }
};

connectDB();

/* ================= MODELS ================= */

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: String,
    address: String,
    city: String,
    postalCode: String,
    createdAt: { type: Date, default: Date.now }
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    products: Array,
    totalPrice: Number,
    deliveryInfo: Object,
    orderStatus: { type: String, default: "pending" },
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", orderSchema);

/* ================= AUTH ================= */

const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ message: "Invalid token" });
    }
};

/* ================= ROUTES ================= */

app.get("/api/health", (req, res) => {
    res.json({ message: "✅ Pretty Parcel API is running" });
});

/* ===== SIGNUP ===== */

app.post("/api/users/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password)
            return res.status(400).json({ message: "All fields required" });

        if (password.length < 6)
            return res.status(400).json({ message: "Password must be 6+ characters" });

        const existing = await User.findOne({ email });

        if (existing)
            return res.status(400).json({ message: "User already exists" });

        const user = new User({ name, email, password });
        await user.save();

        res.status(201).json({
            message: "User created",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Signup failed" });
    }
});

/* ===== LOGIN ===== */

app.post("/api/users/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user)
            return res.status(401).json({ message: "Invalid credentials" });

        const match = await user.comparePassword(password);

        if (!match)
            return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (err) {
        res.status(500).json({ message: "Login failed" });
    }
});

/* ===== CREATE ORDER ===== */

app.post("/api/orders/create", auth, async (req, res) => {
    try {
        const { products, deliveryInfo } = req.body;

        const totalPrice = products.reduce(
            (sum, p) => sum + p.price * p.quantity,
            0
        );

        const order = new Order({
            userId: req.user.userId,
            products,
            deliveryInfo,
            totalPrice
        });

        await order.save();

        res.status(201).json({
            message: "Order placed",
            orderId: order._id
        });

    } catch {
        res.status(500).json({ message: "Order failed" });
    }
});

/* ===== ADMIN GET ORDERS ===== */

app.get("/api/admin/orders", async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("userId", "name email")
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch {
        res.status(500).json({ message: "Failed to fetch orders" });
    }
});

/* ===== ADMIN UPDATE ORDER STATUS ===== */

app.put("/api/admin/orders/:id", async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { orderStatus: req.body.status },
            { new: true }
        );

        res.json(order);
    } catch {
        res.status(500).json({ message: "Failed to update order" });
    }
});

/* ================= SERVER ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});