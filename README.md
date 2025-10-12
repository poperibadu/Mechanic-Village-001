# Mechanic Village - Auto Parts Marketplace

A modern, responsive marketplace for automotive parts and services built with HTML, CSS, JavaScript, and Supabase.

## Features

- **User Authentication**: Email/password signup and login with Supabase Auth
- **Product Listings**: Browse automotive parts with real-time inventory tracking
- **Mechanic Directory**: Find qualified mechanics by specialization and location
- **Order Management**: Create orders with real-time inventory updates
- **AI Diagnosis**: Smart car problem diagnosis with part recommendations
- **Real-time Updates**: Live inventory changes and notifications
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Deployment**: Netlify (ready for deployment)

## Database Schema

### Tables Created:
- `users` - User profiles (extends Supabase auth.users)
- `products` - Auto parts inventory
- `orders` - Order management
- `inventory` - Real-time stock tracking
- `mechanics` - Mechanic profiles and services

### Row Level Security (RLS):
- Anonymous users can view products and mechanics
- Authenticated users can create orders and update profiles
- Admins have full access to all data

## Setup Instructions

### 1. Supabase Setup
The database schema is already configured with:
- ✅ User authentication tables
- ✅ Product catalog tables
- ✅ Order management system
- ✅ Inventory tracking
- ✅ Row Level Security policies
- ✅ Sample data inserted

### 2. Environment Variables
For production deployment, set these environment variables in Netlify:

```
SUPABASE_URL=https://vsxjcsppyjwvxxopetky.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzeGpjc3BweWp3dnh4b3BldGt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2NzAzMzMsImV4cCI6MjA3NTI0NjMzM30.xbSUOX0M1PDDBbsZSDhBXbhHuUZkXulbqIKxu-oEQ4w
```

### 3. Deployment to Netlify

1. **Connect Repository**: Link your GitHub repository to Netlify
2. **Build Settings**: 
   - Build command: `echo 'Static site - no build needed'`
   - Publish directory: `.` (root)
3. **Environment Variables**: Add the Supabase credentials above
4. **Deploy**: Click deploy - your site will be live!

## Sample Data

The database includes sample data:
- 10 automotive products (brake pads, filters, batteries, etc.)
- Inventory levels for each product
- Ready-to-test order functionality

## Key Features Implemented

### Authentication
- ✅ User registration with profile creation
- ✅ Secure login/logout
- ✅ Session persistence
- ✅ Profile management

### Product Management
- ✅ Real-time product loading from Supabase
- ✅ Product search and filtering
- ✅ View tracking and analytics
- ✅ Inventory level checking

### Order System
- ✅ Create orders with user authentication
- ✅ Real-time inventory updates
- ✅ Order status tracking
- ✅ Stock level validation

### Real-time Features
- ✅ Inventory change subscriptions
- ✅ Live data updates
- ✅ Real-time notifications

## Testing the Application

1. **Sign Up**: Create a new account
2. **Browse Products**: View the automotive parts catalog
3. **Test Orders**: Try the "Buy Now" functionality
4. **Check Inventory**: Verify real-time stock updates
5. **AI Diagnosis**: Use the car problem diagnosis feature

## API Endpoints Used

- `POST /auth/v1/signup` - User registration
- `POST /auth/v1/token` - User login
- `GET /rest/v1/products` - Fetch products
- `GET /rest/v1/mechanics` - Fetch mechanics
- `POST /rest/v1/orders` - Create orders
- `PUT /rest/v1/inventory` - Update inventory
- `GET /rest/v1/inventory` - Check stock levels

## Security Features

- Row Level Security (RLS) enabled on all tables
- JWT-based authentication
- Secure API endpoints
- Input validation and sanitization
- CORS protection

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Performance Optimizations

- Lazy loading of images
- Efficient database queries
- Real-time subscriptions only when needed
- Responsive image optimization
- Minimal JavaScript bundle

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@mechanicvillage.ng or create an issue in the repository.

---

**Ready for Production Deployment** 🚀
