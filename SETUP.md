# 🎀 The Pretty Parcel - Detailed Setup Guide

Complete step-by-step instructions for Windows, Mac, and Linux users.

## 📋 Table of Contents
1. [Prerequisites & Installation](#prerequisites--installation)
2. [Windows Setup](#-windows-setup)
3. [Mac Setup](#-mac-setup)
4. [Linux Setup](#-linux-setup)
5. [Running the Application](#-running-the-application)
6. [Verification Checklist](#-verification-checklist)

---

## Prerequisites & Installation

### What You Need
- **Node.js** v14+ (includes npm)
- **MongoDB** Community Edition
- **A text editor** (VS Code recommended)
- **A web browser** (Chrome recommended)
- **Terminal/Command Prompt** access

### Download Links
- Node.js: https://nodejs.org/en/download/
- MongoDB: https://www.mongodb.com/try/download/community
- VS Code: https://code.visualstudio.com/

---

## 🪟 Windows Setup

### Step 1: Install Node.js on Windows
1. Go to https://nodejs.org/en/
2. Download **LTS version** (left button)
3. Run the installer
4. Follow the installation wizard
5. Accept default settings
6. Click Install
7. Restart your computer

**Verify Installation:**
```bash
node --version
npm --version
```
Both should show version numbers (e.g., v18.12.0)

### Step 2: Install MongoDB on Windows
1. Go to https://www.mongodb.com/try/download/community
2. Select **Windows** → **MSI**
3. Download and run installer
4. Click Next through the setup
5. Choose "Complete" installation
6. **IMPORTANT:** Check "Install as a Service"
7. Continue with default settings
8. Complete installation

**Verify MongoDB is running:**
1. Press `Win + R`
2. Type: `services.msc`
3. Look for "MongoDB Server" - should show "Running"

### Step 3: Create Project Folders
```bash
# Open Command Prompt (Win + R → cmd)
mkdir C:\Projects\pretty-parcel
cd C:\Projects\pretty-parcel

# Create subfolders
mkdir frontend
mkdir backend
```

### Step 4: Set Up Backend (Windows)

```bash
# Navigate to backend folder
cd backend

# Create the three files:
# 1. package.json
# 2. server.js
# 3. .env

# Install dependencies
npm install

# Start backend server
npm start
```

You should see:
```
✅ MongoDB Connected: localhost
🎀 The Pretty Parcel Backend is running on http://localhost:5000
```

**Keep this terminal open!**

### Step 5: Set Up Frontend (Windows)

**Open a NEW Command Prompt window:**
```bash
cd C:\Projects\pretty-parcel\frontend

# Start Python server (Windows comes with Python 3)
python -m http.server 3000
```

You should see:
```
Serving HTTP on 0.0.0.0 port 3000 (http://0.0.0.0:3000/) ...
```

**Alternative if Python doesn't work:**
```bash
npx http-server -p 3000
```

### Step 6: Access the Website

Open your browser and go to:
```
http://localhost:3000
```

You should see the beautiful Pink Pretty Parcel homepage!

---

## 🍎 Mac Setup

### Step 1: Install Node.js on Mac
1. Go to https://nodejs.org/en/
2. Download **LTS version**
3. Run the installer
4. Follow the installation wizard
5. Complete installation

**Verify Installation:**
```bash
# Open Terminal (Cmd + Space → "terminal")
node --version
npm --version
```

### Step 2: Install MongoDB on Mac

**Using Homebrew (Recommended):**
```bash
# Install Homebrew first (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify it's running
mongosh
# Type: exit
```

**Using DMG Installer:**
1. Go to https://www.mongodb.com/try/download/community
2. Select Mac → DMG
3. Download and open
4. Drag MongoDB to Applications folder

### Step 3: Create Project Structure
```bash
# Open Terminal
mkdir ~/pretty-parcel
cd ~/pretty-parcel

mkdir frontend
mkdir backend
```

### Step 4: Set Up Backend (Mac)

```bash
cd backend

# Create files: package.json, server.js, .env
# (Copy content from provided files)

# Install dependencies
npm install

# Start server
npm start
```

Keep this Terminal window open!

### Step 5: Set Up Frontend (Mac)

**Open a NEW Terminal window:**
```bash
cd ~/pretty-parcel/frontend

# Python 3 is included on Mac
python3 -m http.server 3000
```

### Step 6: Open Website

Click this link or open in browser:
```
http://localhost:3000
```

---

## 🐧 Linux Setup

### Step 1: Install Node.js on Linux

**Ubuntu/Debian:**
```bash
# Update package manager
sudo apt update
sudo apt upgrade

# Install Node.js
sudo apt install nodejs npm

# Verify
node --version
npm --version
```

**Fedora/RHEL:**
```bash
sudo dnf install nodejs npm
```

### Step 2: Install MongoDB on Linux

**Ubuntu/Debian:**
```bash
# Add MongoDB repository
curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify
mongosh
```

**Fedora/RHEL:**
```bash
sudo dnf install mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Step 3: Create Project
```bash
mkdir ~/pretty-parcel
cd ~/pretty-parcel

mkdir frontend
mkdir backend
```

### Step 4: Set Up Backend (Linux)

```bash
cd backend

# Create the 3 files from provided content
# Install dependencies
npm install

# Start backend
npm start
```

### Step 5: Set Up Frontend (Linux)

**New Terminal:**
```bash
cd ~/pretty-parcel/frontend
python3 -m http.server 3000
```

### Step 6: Open Website
```
http://localhost:3000
```

---

## ▶️ Running the Application

### Standard Startup (All Operating Systems)

**Terminal 1 - Backend:**
```bash
cd pretty-parcel/backend
npm start
```

**Terminal 2 - Frontend (Choose one):**

**Option A: Python (Recommended)**
```bash
cd pretty-parcel/frontend
python -m http.server 3000
# Or on Mac: python3 -m http.server 3000
```

**Option B: Node HTTP Server**
```bash
cd pretty-parcel/frontend
npx http-server -p 3000
```

**Option C: Direct File (No Server)**
- Open File Explorer/Finder
- Navigate to: `pretty-parcel/frontend/`
- Double-click `index.html`
- Or right-click → Open with Browser

### Browser Access
```
http://localhost:3000
```

### Check MongoDB Status

**Windows:** Services.msc → Look for MongoDB Server
**Mac:** `brew services list` → Look for mongodb-community
**Linux:** `sudo systemctl status mongod`

---

## ✅ Verification Checklist

### 1. Backend Running
- [ ] Terminal shows "🎀 The Pretty Parcel Backend is running on http://localhost:5000"
- [ ] No error messages
- [ ] MongoDB shows as "✅ Connected"

### 2. Frontend Loading
- [ ] Browser shows homepage with hero section
- [ ] Navigation bar visible with logo
- [ ] Products section shows 3 gift parcels
- [ ] No errors in browser console (F12)

### 3. Test Signup
- [ ] Click "Login" button
- [ ] Click "Sign Up"
- [ ] Fill form with:
  - Name: Test User
  - Email: test@example.com
  - Password: Test123
- [ ] Click "Create Account"
- [ ] See success message

### 4. Test Login
- [ ] Click "Login" button
- [ ] Use test@example.com / Test123
- [ ] Click "Login"
- [ ] Button should show user name (Logout)

### 5. Test Shopping
- [ ] Add a product to cart (click "Add to Cart")
- [ ] Cart count increases
- [ ] Click cart icon (🛍️)
- [ ] See product in cart sidebar
- [ ] Adjust quantity works
- [ ] Remove button works

### 6. Test Checkout
- [ ] Cart has items
- [ ] Click "Proceed to Checkout"
- [ ] Fill delivery form
- [ ] Click "Place Order"
- [ ] See success message
- [ ] Redirects to homepage

### 7. Database Check
**In new terminal, check MongoDB:**
```bash
mongosh
use pretty-parcel
db.orders.find().pretty()
db.users.find().pretty()
```
Should show your test order and user!

---

## 🆘 Common Issues & Solutions

### Issue: "npm: command not found"
**Solution:** Node.js not installed. Download and install from nodejs.org

### Issue: "MongoDB Connection Error"
**Windows:** 
- Open Services (Win+R → services.msc)
- Right-click "MongoDB Server" → Start

**Mac:** `brew services start mongodb-community`

**Linux:** `sudo systemctl start mongod`

### Issue: "Port 5000 already in use"
```bash
# Find what's using port 5000
# Windows: netstat -ano | findstr :5000
# Mac/Linux: lsof -i :5000

# Kill the process or change PORT in .env
PORT=5001
```

### Issue: "Cannot find module express"
```bash
cd backend
npm install
```

### Issue: "Blank page / 404 error"
- Make sure frontend server is running (http.server or http-server)
- Check browser console (F12) for errors
- Try opening directly: `file:///C:/path/to/index.html`

### Issue: "Login not working"
- Check browser console (F12) for errors
- Make sure backend is running on port 5000
- Check if MongoDB is running
- Try signup instead

### Issue: "Cart persists after logout"
- This is normal - cart data is in browser storage
- Clear browser cache: Ctrl+Shift+Delete

---

## 📞 Need Help?

1. Check error messages in terminal and browser console (F12)
2. Verify MongoDB is running
3. Verify backend is running on port 5000
4. Verify frontend is being served on port 3000
5. Check that you're using correct localhost URLs

---

## 🎉 Success!

Once everything is running, you should have:
- ✅ Beautiful homepage with animated hero section
- ✅ Working login/signup
- ✅ Functional shopping cart
- ✅ Complete checkout process
- ✅ Orders saved in MongoDB

Congratulations! Your full-stack ecommerce website is ready! 🎀
