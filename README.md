# 🎀 The Pretty Parcel - Full Stack Ecommerce Website

A beautiful, modern ecommerce website for personalised gift parcels with user authentication, shopping cart, checkout, and order management.

## ✨ Features

- 🛍️ **Product Catalog** - Beautiful product cards with smooth animations
- 👤 **User Authentication** - Secure signup and login with JWT tokens
- 🛒 **Shopping Cart** - Add/remove items, update quantities, persistent cart
- 💳 **Checkout** - Complete order form with delivery address
- 📦 **Order Management** - Users can view their orders, admins can manage all orders
- 📱 **Responsive Design** - Perfect on desktop, tablet, and mobile
- 💎 **Premium Aesthetic** - Pink/pastel theme with smooth animations

## 🏗️ Project Structure

```
pretty-parcel/
├── frontend/
│   ├── index.html          # Main homepage
│   ├── checkout.html       # Checkout page
│   ├── style.css          # All styling
│   └── script.js          # Frontend logic & API calls
├── backend/
│   ├── server.js          # Express server, routes, models
│   ├── package.json       # Dependencies
│   └── .env              # Environment variables
└── README.md             # This file
```

## 🚀 Prerequisites

Before you start, make sure you have installed:

1. **Node.js** (v14 or higher) - Download from https://nodejs.org/
   - Check: `node --version` and `npm --version`

2. **MongoDB** - Download Community Edition from https://www.mongodb.com/try/download/community
   - Windows: Install and run MongoDB Community Server
   - Mac: Use Homebrew: `brew tap mongodb/brew && brew install mongodb-community`
   - Linux: Follow MongoDB installation guide
   - Check if running: `mongosh` (should connect to local MongoDB)

3. **Git** (optional) - For version control

## 📥 Installation Steps

### Step 1: Create Project Folder
```bash
# Create project directory
mkdir pretty-parcel
cd pretty-parcel
```

### Step 2: Set Up Backend

```bash
# Create backend directory
mkdir backend
cd backend

# Create package.json with provided content
# Create server.js with provided code
# Create .env with provided variables

# Install dependencies
npm install

# To run backend, use:
npm start
# Output should show: "🎀 The Pretty Parcel Backend is running on http://localhost:5000"
```

**Backend folder should contain:**
- `server.js` - Main server file
- `package.json` - Dependencies
- `.env` - Environment variables

### Step 3: Set Up Frontend

```bash
# Go back to main directory
cd ..

# Create frontend directory
mkdir frontend
cd frontend

# Create files:
# - index.html
# - checkout.html
# - style.css
# - script.js
```

**Frontend folder should contain:**
- `index.html` - Homepage
- `checkout.html` - Checkout page
- `style.css` - Styling
- `script.js` - JavaScript logic

### Step 4: Start the Application

#### Terminal 1 - Start Backend Server
```bash
cd pretty-parcel/backend
npm start

# You should see:
# ✅ MongoDB Connected: localhost
# 🎀 The Pretty Parcel Backend is running on http://localhost:5000
```

#### Terminal 2 - Start Frontend (Open File)
```bash
cd pretty-parcel/frontend

# Option A: Using Python's built-in server (Python 3)
python -m http.server 3000

# Option B: Using Node's http-server
npx http-server -p 3000

# Option C: Just open index.html in your browser
# File → Open → Select frontend/index.html
# OR double-click index.html
```

Then open your browser and go to:
- **If using server:** http://localhost:3000
- **If opening file directly:** file:///path/to/frontend/index.html

## 🧪 Testing the Website

### 1. Test Signup/Login
1. Click "Login" button in top right
2. Click "Sign Up" tab
3. Fill in: Name, Email, Password (min 6 chars)
4. Click "Create Account"
5. Login with the created account

### 2. Test Shopping
1. Browse products on home page
2. Click "Add to Cart" on any product
3. Click cart icon (🛍️) in top right
4. View cart, adjust quantities, remove items

### 3. Test Checkout
1. With items in cart, click "Proceed to Checkout"
2. Login if not already logged in
3. Fill delivery information form
4. Click "Place Order"
5. See success message

### 4. Check Database (MongoDB)
```bash
# Open MongoDB shell
mongosh

# List databases
show databases

# Connect to pretty-parcel database
use pretty-parcel

# View collections
show collections

# View orders
db.orders.find().pretty()

# View users
db.users.find().pretty()
```

## 🔑 Default API Endpoints

### User Authentication
```
POST /api/users/signup
Body: { name, email, password }

POST /api/users/login
Body: { email, password }
Response: { token, user }

GET /api/users/me
Headers: { Authorization: "Bearer TOKEN" }

PUT /api/users/profile
Headers: { Authorization: "Bearer TOKEN" }
Body: { name, phone, address, city, postalCode }
```

### Orders
```
POST /api/orders/create
Headers: { Authorization: "Bearer TOKEN" }
Body: { products, deliveryInfo }

GET /api/orders/my-orders
Headers: { Authorization: "Bearer TOKEN" }

GET /api/orders/:orderId
Headers: { Authorization: "Bearer TOKEN" }
```

### Admin
```
GET /api/admin/orders
(No auth required - add in production)

PUT /api/admin/orders/:orderId/status
Body: { status: "pending|processing|shipped|delivered|cancelled" }
```

## 📝 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: "John Doe",
  email: "john@example.com",
  password: "hashed_password",
  phone: "9876543210",
  address: "123 Main St",
  city: "Mumbai",
  postalCode: "400001",
  orders: [ObjectId, ObjectId],
  createdAt: Date
}
```

### Orders Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  products: [
    {
      id: 1,
      name: "Love Parcel",
      price: 899,
      quantity: 2,
      emoji: "💕"
    }
  ],
  totalPrice: 1798,
  deliveryInfo: {
    fullName: "John Doe",
    email: "john@example.com",
    phone: "9876543210",
    address: "123 Main St",
    city: "Mumbai",
    postalCode: "400001",
    specialNotes: "Add a card"
  },
  orderStatus: "pending",
  createdAt: Date,
  updatedAt: Date
}
```

## 🛠️ Troubleshooting

### "Cannot GET /"
**Problem:** Frontend not serving files properly
**Solution:** 
- Use `python -m http.server 3000` in frontend folder
- Make sure you're accessing http://localhost:3000 (not file:///)

### "Connection refused on port 5000"
**Problem:** Backend not running
**Solution:**
- Check backend terminal - is `npm start` running?
- Make sure you're in `/backend` folder
- Run `npm install` first

### "MongoDB Connection Error"
**Problem:** MongoDB not running
**Solution:**
- Start MongoDB server:
  - Windows: Run MongoDB Server from Services
  - Mac: `brew services start mongodb-community`
  - Linux: `sudo systemctl start mongod`
- Check with: `mongosh`

### "Cannot find module"
**Problem:** Dependencies not installed
**Solution:** Run `npm install` in backend folder

### Login/Signup not working
**Problem:** Backend and frontend on different ports
**Solution:**
- Frontend should run on port 3000
- Backend should run on port 5000
- Script.js API_BASE_URL should be `http://localhost:5000/api`
- Backend CORS should allow `http://localhost:3000`

### Cart not persisting
**Problem:** localStorage issues
**Solution:**
- Clear browser cache (Ctrl+Shift+Delete)
- Check browser console (F12) for errors
- Make sure JavaScript is enabled

## 🎨 Customization

### Change Colors
Edit `frontend/style.css` CSS variables at the top:
```css
:root {
    --primary-pink: #f8e8f0;
    --secondary-pink: #f5d6e8;
    --accent-pink: #e6b5d8;
    --dark-pink: #d4a5cc;
    /* ... change these colors */
}
```

### Add Products
Edit products array in `frontend/script.js`:
```javascript
const products = [
    {
        id: 4,
        name: 'New Product',
        description: 'Description here',
        price: 1299,
        emoji: '🎉'
    }
];
```

### Change Company Name
Search and replace "The Pretty Parcel" with your business name in:
- `frontend/index.html`
- `frontend/checkout.html`
- `frontend/script.js`

## 📦 Deployment (Future)

To deploy this website:

1. **Frontend:** Deploy to Vercel, Netlify, or GitHub Pages
2. **Backend:** Deploy to Heroku, Railway, or AWS
3. **Database:** Use MongoDB Atlas (cloud database)

Update API_BASE_URL in script.js to production server URL.

## 📧 Contact & Support

This is a demonstration project. For production:
- Add payment gateway (Razorpay, Stripe)
- Add email notifications
- Add order tracking
- Implement admin dashboard
- Add product images
- Add reviews/ratings

## 📄 License

This project is provided as-is for The Pretty Parcel.

---

## Quick Start Commands

```bash
# Backend setup and run
cd backend
npm install
npm start

# Frontend serve (in new terminal)
cd frontend
python -m http.server 3000
# Open: http://localhost:3000

# MongoDB check
mongosh
use pretty-parcel
db.orders.find().pretty()
```

## Key Features Summary

✅ Beautiful responsive design with Playfair Display typography
✅ Smooth animations and transitions
✅ User authentication with password hashing
✅ JWT token-based session management
✅ Cart system with localStorage persistence
✅ Order placement with delivery details
✅ MongoDB database for data persistence
✅ Admin order viewing
✅ Mobile-optimized interface
✅ Instagram-inspired aesthetic

---

**Made with 💕 for The Pretty Parcel**
