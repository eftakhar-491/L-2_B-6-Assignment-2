# 🚗 Vehicle Booking System

A vehicle booking platform where users can create profiles, book vehicles, cancel bookings, and admins can manage vehicle details and process returns.

#### URL: https://l2-b6-assignment-2-two.vercel.app/

# ✨ Features

- Authentication & Authorization (JWT-based)
- Update User Profile
- Create & Manage Vehicle Information (Admin)
- Create, Cancel & Manage Bookings
- Admin Return Processing

# 🛠️ Technology Stack

- Server: Node.js, Express.js
- Authentication: JSON Web Tokens (JWT)
- Database: PostgreSQL

# 📦 Setup & Usage Instructions

```
git clone https://github.com/eftakhar-491/L-2_B-6-Assignment-2
cd L-2_B-6-Assignment-2
npm install

```

### .env

```

NODE_ENV=production
PORT=5000

DATABASE_URL=postgresql://neondb_owner:npg_gI9@ep-soft-hall-a1s3op8w-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
FRONTEND_URL=http://localhost:3000
BCRYPT_SALT_ROUND=10

JWT_ACCESS_SECRET=alfjkspa8fhp-fdsauifha-alksdfjpoiuwer
JWT_ACCESS_EXPIRES=90d
JWT_REFRESH_SECRET=alfjkspa8fhp-fdsaui
JWT_REFRESH_EXPIRES=7d
```

#### Start the Server

```
npm run dev
```

#### Production build

```
npm run build
npm start
```

### API Usage

```
http://localhost:5000/api/v1
```

## Core modules

```
/auth → signup, signin
/users → profile update
/vehicles → create/update/delete vehicles
/bookings → create/cancel/return bookings
```
