# Interactive Dashboard Builder

A modern, responsive dashboard builder with drag-and-drop functionality, real-time collaboration, and customizable widgets. Built with React and Firebase for seamless data persistence and user authentication.

 ✨ Features

 🎨 Interactive Widget System
- Drag & Drop Interface: Intuitive drag-and-drop functionality for adding and positioning widgets
- Resizable Widgets: All widgets can be resized and repositioned on the canvas
- Widget Types: 
  - Text widgets with inline editing
  - Headings with customizable styles
  - Charts (Bar, Line, Pie, Area charts)
  - Tables with sortable columns
  - Counters and gauges
  - Progress bars
  - Image and video widgets
  - Calendar widget
  - Toggle switches and sliders

 🎯 User Experience
- Real-time Saving: Automatic saving of dashboard layout and widget configurations
- Theme Support: Light and dark mode with seasonal themes
- Responsive Design: Works seamlessly across desktop and tablet devices
- Loading States: Smooth loading animations and progress indicators

 🔐 Authentication & Security
- User Authentication: Secure login/signup system powered by Firebase Auth
- Protected Routes: Dashboard access requires authentication
- Data Persistence: User dashboards are saved to Firebase Firestore

 🎨 Customization
- Properties Panel: Edit widget properties, styling, and data
- Theme Switcher: Toggle between light and dark modes
- Widget Styling: Customize colors, fonts, and layout for each widget
- Canvas Management: Clear canvas functionality with confirmation

 🛠️ Tech Stack

 Frontend
- React 19 - Modern React with hooks and context API
- Vite - Fast build tool and development server
- Tailwind CSS - Utility-first CSS framework for styling
- React Router DOM - Client-side routing

 Charts & Visualization
- Chart.js - Flexible charting library
- React Chart.js 2 - React wrapper for Chart.js
- Recharts - Composable charting library for React

 UI Components
- React RND - Resizable and draggable components
- UUID - Unique identifier generation

 Backend & Database
- Firebase - Backend-as-a-Service
  - Firebase Auth - User authentication
  - Firestore - NoSQL cloud database for data persistence

 Development Tools
- ESLint - Code linting and formatting
- PostCSS - CSS processing
- Autoprefixer - CSS vendor prefixing

 🚀 Getting Started

 Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

 Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd Dashboard
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up Firebase
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Copy your Firebase configuration

4. Environment Variables
   Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

5. Start development server
   ```bash
   npm run dev
   ```

6. Open your browser
   Navigate to `http://localhost:5173`

 📖 How to Use

 Creating Your First Dashboard

1. Sign Up/Login
   - Create an account or sign in with existing credentials
   - You'll be automatically redirected to the dashboard

2. Adding Widgets
   - Use the sidebar on the left to browse available widgets
   - Drag any widget from the sidebar onto the canvas
   - Widgets will automatically position themselves to avoid overlaps

3. Customizing Widgets
   - Click on any widget to select it
   - Use the properties panel on the right to customize:
     - Widget title and content
     - Colors and styling
     - Data sources for charts
     - Size and position

4. Managing Layout
   - Drag widgets to reposition them
   - Resize widgets by dragging the corners
   - Delete widgets using the delete button in the properties panel
   - Clear the entire canvas using the clear button

5. Theme Customization
   - Toggle between light and dark themes using the theme switcher
   - Seasonal themes are automatically applied

 Widget Types Guide

- Text Widget: Add formatted text with inline editing
- Heading Widget: Create titles and section headers
- Chart Widgets: Visualize data with bar, line, pie, and area charts
- Table Widget: Display tabular data with sorting capabilities
- Counter Widget: Show numerical metrics with animations
- Gauge Widget: Display progress or percentage data
- Progress Widget: Show progress bars with customizable styling
- Media Widgets: Embed images and videos
- Calendar Widget: Display date-based information
- Interactive Widgets: Toggle switches and sliders for user input

 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality



