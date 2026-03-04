# 📁 The Pretty Parcel - File Structure Reference

## Complete Project Structure

```
pretty-parcel/
├── frontend/                    # Frontend files (User Interface)
│   ├── index.html              # Main homepage
│   ├── checkout.html           # Checkout/order page
│   ├── style.css              # All styling (CSS)
│   └── script.js              # Frontend logic & API calls
│
├── backend/                     # Backend files (Server & Database)
│   ├── server.js              # Express server, routes, models
│   ├── package.json           # Node dependencies list
│   ├── .env                   # Environment variables (SECRET)
│   └── .gitignore             # Git ignore file
│
├── README.md                   # Main project documentation
└── SETUP.md                    # Detailed setup guide
```

---

## 🎨 Frontend Files

### 1. **index.html** (Frontend)
**Purpose:** Main homepage of the website
**Contains:**
- Navigation bar with logo, links, login button, cart
- Hero section with animated gift parcel
- Featured products grid (3 products)
- About/Why Choose Us section
- Footer with Instagram link
- Cart sidebar (hidden by default)
- Login/Signup modal (hidden by default)

**Key Elements:**
- Uses Playfair Display font for headings (elegant serif)
- Poppins font for body text (modern sans-serif)
- Links to style.css and script.js
- Responsive grid layouts

**When to modify:**
- Change text content
- Add more product sections
- Update social media links
- Modify footer content

---

### 2. **checkout.html** (Frontend)
**Purpose:** Checkout page where customers enter delivery info
**Contains:**
- Navigation bar (back to store link)
- Success message (hidden until order placed)
- Two-column layout:
  - Left: Order form with sections for personal info & delivery address
  - Right: Order summary showing items and total price
- Forms for:
  - Full Name, Email, Phone
  - Street Address, City, Postal Code
  - Special Notes/Instructions

**Key Features:**
- Pre-fills user data (name, email from localStorage)
- Shows order items with emojis and prices
- Calculates and displays total
- Sends order to backend API
- Shows loading state during submission
- Redirects to home after successful order

**When to modify:**
- Add more form fields (state, country, etc)
- Change form validation rules
- Customize success message
- Modify order summary display

---

### 3. **style.css** (Frontend)
**Purpose:** Complete styling for the entire website
**Size:** ~1000+ lines of CSS
**Contains:**

**CSS Variables (Customizable):**
```css
--primary-pink: #f8e8f0    (Light pink background)
--secondary-pink: #f5d6e8  (Lighter pink)
--accent-pink: #e6b5d8     (Medium pink)
--dark-pink: #d4a5cc       (Dark pink - main color)
--text-dark: #3d3d3d       (Dark gray text)
--text-light: #6b6b6b      (Light gray text)
```

**Main Sections:**
1. **Reset & Base** - Universal styling
2. **Typography** - Font sizes and families
3. **Navigation** - Navbar styling & animations
4. **Buttons** - Primary, secondary button styles
5. **Hero Section** - Homepage banner with floating animation
6. **Products** - Product grid and cards
7. **About Section** - Features with icons
8. **Cart Sidebar** - Shopping cart panel
9. **Modal** - Login/Signup popup
10. **Footer** - Bottom section
11. **Responsive Design** - Mobile/tablet breakpoints

**Key Features:**
- CSS animations (float, bounce, slide, fade)
- Smooth transitions throughout
- Mobile-responsive with media queries
- Sticky navigation
- Gradient backgrounds
- Box shadows for depth

**When to modify:**
- Change colors (edit CSS variables at top)
- Adjust font sizes
- Modify animation speeds
- Add new animations
- Change responsive breakpoints

---

### 4. **script.js** (Frontend)
**Purpose:** All JavaScript logic for frontend functionality
**Size:** ~700 lines of JavaScript
**Key Functionality:**

**Configuration:**
```javascript
const API_BASE_URL = 'http://localhost:5000/api'
// Change this if backend is on different URL
```

**Products Data:**
```javascript
const products = [
    { id, name, description, price, emoji }
]
// Edit this to add/remove products
```

**State Management:**
- `cart` - Array of items in shopping cart
- `currentUser` - Currently logged-in user object
- `authToken` - JWT token for authentication

**Main Functions:**

**Cart Functions:**
- `loadCart()` - Load cart from localStorage
- `saveCart()` - Save cart to localStorage
- `addToCart(productId)` - Add product to cart
- `removeFromCart(productId)` - Remove item
- `updateQuantity(productId, qty)` - Change quantity
- `updateCartUI()` - Update cart display
- `toggleCart()` / `closeCart()` - Show/hide cart

**Auth Functions:**
- `loadUserData()` - Load user from localStorage
- `openAuthModal()` / `closeAuthModal()` - Show/hide login
- `switchAuthMode(mode)` - Switch between login/signup
- `handleLogin(e)` - Login API call
- `handleSignup(e)` - Signup API call
- `updateAuthUI()` - Update button based on login state
- `logout()` - Clear user data

**Product Functions:**
- `renderProducts()` - Display products on page

**Checkout Functions:**
- `proceedToCheckout()` - Go to checkout page

**Utility Functions:**
- `showNotification(msg, type)` - Show toast message

**When to modify:**
- Add new products (edit products array)
- Change API URLs (edit API_BASE_URL)
- Add form validation
- Modify cart behavior
- Add new features

---

## ⚙️ Backend Files

### 1. **server.js** (Backend)
**Purpose:** Complete Express server with all routes and database models
**Size:** ~500 lines of Node.js code
**Key Features:**

**Imports:**
```javascript
express        - Web framework
mongoose       - MongoDB driver
cors           - Enable cross-origin requests
jsonwebtoken   - JWT authentication
bcryptjs       - Password hashing
```

**Database Models (Schemas):**

**User Schema:**
- name, email, password (hashed)
- phone, address, city, postalCode
- orders (array of Order IDs)
- timestamps

**Order Schema:**
- userId (reference to User)
- products (array of item objects)
- totalPrice
- deliveryInfo (address details)
- orderStatus (pending/processing/shipped/delivered/cancelled)
- timestamps

**API Routes:**

**User Routes:**
```
POST /api/users/signup           - Create new account
POST /api/users/login            - Login (returns JWT token)
GET /api/users/me                - Get current user (protected)
PUT /api/users/profile           - Update profile (protected)
```

**Order Routes:**
```
POST /api/orders/create          - Place new order (protected)
GET /api/orders/my-orders        - Get user's orders (protected)
GET /api/orders/:orderId         - Get single order (protected)
```

**Admin Routes:**
```
GET /api/admin/orders            - View all orders
PUT /api/admin/orders/:id/status - Update order status
```

**Authentication Middleware:**
- `auth` middleware - Validates JWT token on protected routes

**Security Features:**
- Passwords hashed with bcryptjs
- JWT tokens for session management
- CORS enabled for frontend
- Password validation (min 6 characters)

**When to modify:**
- Add new database fields
- Create new API endpoints
- Change validation rules
- Add payment processing
- Add email notifications

---

### 2. **package.json** (Backend)
**Purpose:** Lists all Node.js dependencies and project metadata
**Key Dependencies:**

```json
"dependencies": {
    "express": "^4.18.2",        - Web framework
    "mongoose": "^7.0.0",        - MongoDB driver
    "cors": "^2.8.5",            - Cross-origin requests
    "dotenv": "^16.0.3",         - Environment variables
    "jsonwebtoken": "^9.0.0",    - JWT authentication
    "bcryptjs": "^2.4.3"         - Password hashing
},
"devDependencies": {
    "nodemon": "^2.0.20"         - Auto-restart on file changes
}
```

**Scripts:**
```json
"start": "node server.js"         - Run production
"dev": "nodemon server.js"        - Run with auto-reload
```

**When to modify:**
- Add new packages (npm install package-name)
- Update version numbers
- Change startup script
- Add new npm scripts

**Installation:**
```bash
npm install
```

---

### 3. **.env** (Backend - SECRET FILE)
**Purpose:** Store sensitive configuration variables
**IMPORTANT:** Never commit this to Git!
**Contains:**

```
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb://localhost:27017/pretty-parcel
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FRONTEND_URL=http://localhost:3000
```

**What Each Variable Does:**
- `PORT` - What port backend runs on
- `NODE_ENV` - Development vs Production mode
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for signing tokens (CHANGE IN PRODUCTION!)
- `FRONTEND_URL` - Frontend URL for CORS

**When to modify:**
- Change to production database URL
- Change JWT secret to random string
- Change port if 5000 is taken
- Update frontend URL for deployment

**Security Note:**
- This file is in .gitignore (not uploaded to GitHub)
- Different for local, test, and production
- Never share JWT_SECRET
- Generate random string for production

---

### 4. **.gitignore** (Backend)
**Purpose:** Tell Git which files NOT to upload
**Contains:**
- node_modules/ (installed packages)
- .env (secret variables)
- logs and cache
- OS files (.DS_Store, etc)
- IDE files (.vscode, .idea)

---

## 📄 Documentation Files

### **README.md**
- Project overview
- Features list
- Installation instructions
- API endpoint reference
- Database schema
- Troubleshooting guide
- Customization tips

### **SETUP.md**
- OS-specific setup (Windows, Mac, Linux)
- Step-by-step instructions
- Verification checklist
- Common issues and solutions

---

## 🔄 How Files Work Together

```
User Opens Browser
        ↓
index.html loads (HTML)
        ↓
script.js executes (JavaScript)
        ↓
style.css applies styling (CSS)
        ↓
User clicks "Add to Cart"
        ↓
script.js updates cart state
        ↓
Calls API: http://localhost:5000/api
        ↓
server.js handles request
        ↓
MongoDB stores/retrieves data
        ↓
Response sent back to script.js
        ↓
HTML updated with new data
```

---

## 📊 File Relationships

**Frontend Files:**
- `index.html` ← `script.js` ← `style.css`
- `checkout.html` ← `style.css` ← `script.js`

**Backend Files:**
- `server.js` ← `package.json` ← `npm install`
- `.env` ← `server.js` (read config)

**Communication:**
- `script.js` → HTTP calls → `server.js`
- `server.js` → MongoDB queries → Database
- `server.js` → Response → `script.js`

---

## 🎯 Quick Edit Locations

**To change:**
- Colors → Edit `style.css` CSS variables
- Products → Edit `script.js` products array
- API URL → Edit `script.js` API_BASE_URL
- Server port → Edit `.env` PORT variable
- Database name → Edit `.env` MONGODB_URI
- Form fields → Edit `checkout.html` form inputs
- Text content → Edit `.html` files
- Animations → Edit `style.css` @keyframes

---

## 📦 Total File Count
- Frontend: 4 files
- Backend: 4 files
- Documentation: 2 files
- **Total: 10 files** ✨

All together create a complete, production-ready ecommerce website!
