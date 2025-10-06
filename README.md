# 🚀 Traveler Frontend Application

## Introduction

The Traveler Frontend is a modern, responsive single-page application built with React.js. It allows users to discover and book accommodation/tour listings, manage their profiles and bookings, and provides a comprehensive administrative interface for managing listings, users, and all bookings.

## Features

*   **User Authentication:** Secure registration, login, and logout functionalities with role-based access.
*   **Role-Based Access Control (RBAC):** Different interfaces and access levels for `user`, `host`, and `admin` roles.
*   **Public Listing Browsing:**
    *   View all approved listings.
    *   Powerful search and filter capabilities by location, check-in/check-out dates (with real-time availability check), number of guests, and tour type.
    *   Sorting options (price, rating, newest).
    *   Pagination for efficient browsing of large datasets.
*   **Detailed Listing View:**
    *   Comprehensive page for each listing showing title, description, location, price, max guests, amenities, host information, and images.
    *   Integrated booking form with a user-friendly date picker that highlights unavailable dates.
*   **Booking Management:**
    *   Users can easily book available listings directly from the detail page.
    *   Validates booking dates and guest numbers against listing availability.
    *   Confirmation modal after successful booking.
*   **User Dashboard (`/profile`, `/user/bookings`):**
    *   **My Profile:** View and update personal information, including name, email, and profile photo.
    *   **My Bookings:** See a list of all current user's bookings.
*   **Admin Panel (`/admin/*`):**
    *   **Dashboard:** Overview of total listings, bookings, and users, with graphical representations of sales revenue and booking status distribution.
    *   **Manage Listings:** View all listings (regardless of status - pending, approved, rejected), add new listings, edit existing ones, delete listings, and update listing approval status. Supports image uploads for listings.
    *   **Manage Users:** View a list of all registered users.
    *   **Manage Bookings:** View a list of all bookings made across the platform and delete bookings.
*   **Responsive Design:** Optimized for various screen sizes using React Bootstrap.
*   **Global State Management:** `AuthContext` provides user authentication state throughout the application.

## Technologies Used

*   **Frontend Framework:** React.js
*   **Routing:** React Router DOM v6
*   **UI Library:** React Bootstrap (based on Bootstrap 5)
*   **HTTP Requests:** Axios
*   **Date Handling:** `date-fns` (for date formatting and logic)
*   **Date Picker:** `react-datepicker`
*   **Icons:** Bootstrap Icons (`react-bootstrap-icons`)
*   **Styling:** Custom CSS (`main.css`)

## Installation

To get the frontend application up and running on your local machine, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url-for-frontend>
    cd frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create Environment Variables:**
    Create a `.env` file in the `frontend/` directory. This file should contain:
    ```
    REACT_APP_API_BASE_URL=http://localhost:5000/api/v1
    ```
    *   **Note:** Adjust `http://localhost:5000/api/v1` to match the URL where your backend API is running.
4.  **Run the application:**
    ```bash
    npm start
    ```
    This will open the application in your browser at `http://localhost:3000` (or another available port).

## Project Structure

The `src` directory is organized into logical folders for maintainability:
src/
├── assets/ # Static assets like images
├── components/
│ ├── common/ # Reusable, generic UI components (Alert, LoadingSpinner, Pagination, AppTable, etc.)
│ ├── forms/ # Form-specific components (ListingForm, LoginForm, RegisterForm, SearchForm)
│ └── layout/ # Layout wrappers (AppLayout, AdminLayout, AuthLayout, Header, Footer, Navbar, Sidebar)
├── context/ # React Context for global state (AuthContext.js)
├── pages/
│ ├── Admin/ # Admin-specific pages (Dashboard, Manage Listings, Users, Bookings)
│ ├── Auth/ # Authentication pages (Login, Register)
│ ├── Listings/ # Public listing pages (ListingsPage, ListingDetailPage)
│ ├── User/ # User-specific pages (UserProfile, UserBookings)
│ ├── HomePage.js # Redirects based on user login/role
│ └── NotFoundPage.js # 404 error page
├── services/ # API interaction logic (authService, bookingService, listingService, userService)
├── styles/ # Global styles (main.css)
├── utils/ # Utility functions and Axios instance with interceptors (apiResponseHandler.js, dateUtils.js)
├── App.js # Main application component, defines routing
└── index.js # React entry point

## Key Components and Pages

*   **`App.js`**: The central component defining all application routes using `react-router-dom`. It conditionally renders the `Navbar` and `Footer` based on the current path.
*   **`AuthContext.js`**: Provides the global authentication state (`user`, `loading`) and methods (`login`, `register`, `logout`) to all consuming components.
*   **`PrivateRoute.js` / `AdminRoute.js`**: Route wrapper components that protect routes based on user authentication status and role.
*   **`ListingCard.js`**: Displays a summary of a single listing on the `ListingsPage`.
*   **`AppTable.js`**: A generic table component used across admin and user dashboards to display lists of data efficiently.
*   **`ListingForm.js`**: A versatile form used for both adding new listings and editing existing ones, including handling image uploads and amenity lists.
*   **`SearchForm.js`**: The search and filter component on the main `ListingsPage`, enabling users to refine their search criteria.
*   **`apiResponseHandler.js`**: Configures Axios with base URL, JWT token interception for authenticated requests, and centralized error handling.
*   **Layout Components (`AppLayout`, `AdminLayout`, `AuthLayout`):** These components provide consistent structural wrappers for different sections of the application, managing common elements like sidebars and overall page structure.

## Available Scripts

In the project directory, you can run:

*   **`npm start`**: Runs the app in development mode. Opens `http://localhost:3000` in your browser.
*   **`npm test`**: Launches the test runner.
*   **`npm run build`**: Builds the app for production to the `build` folder.
*   **`npm run eject`**: **Note: This is a one-way operation. Once you `eject`, you can't go back!**