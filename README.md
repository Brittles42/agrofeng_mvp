# AgroFeng App

A progressive web application that helps users transform their land into sustainable food production systems using principles of agroecology and feng shui.

## About the App

AgroFeng allows users to:
- Scan their land using photos
- Generate landscape designs based on agroecology and feng shui principles
- Visualize how their landscape will evolve over time
- Follow step-by-step implementation guides

## MVP Implementation

This is an MVP (Minimum Viable Product) version of the app that demonstrates the core concept. In this version:

1. Users can upload photos of their land (instead of using LiDAR scanning)
2. The app simulates analysis and generates mock designs
3. Users can view simulated time progressions of their landscape
4. Implementation guides are provided with checklists for tracking progress

## Setup Instructions

1. Install dependencies:
```
npm install
```

2. Start the development server:
```
npm start
```

## Required Images

To complete the app setup, you'll need to add the following images:

1. Create an `assets` folder in the `src` directory:
```
mkdir -p src/assets
```

2. Add the following placeholder images:
   - `src/assets/hero-garden.jpg` - A beautiful garden image for the landing page hero
   - `src/assets/cta-background.jpg` - Background image for the call-to-action section
   - `src/assets/present-view.jpg` - Current view of a landscape
   - `src/assets/one-year-view.jpg` - Simulated 1-year growth
   - `src/assets/three-year-view.jpg` - Simulated 3-year growth
   - `src/assets/five-year-view.jpg` - Simulated 5-year growth

3. Add PWA icons to the public folder:
   - `public/favicon.ico` - Favicon for the browser tab
   - `public/logo192.png` - Small app icon (192x192 pixels)
   - `public/logo512.png` - Large app icon (512x512 pixels)

## Future Enhancements

In future versions, the app will include:
- Actual LiDAR scanning integration for precise terrain mapping
- Machine learning for plant identification and growth modeling
- Real-time 3D visualization using Three.js
- Integration with climate and soil databases
- Augmented reality visualization of the proposed landscape

## Technologies Used

- React.js
- React Router
- Progressive Web App (PWA) capabilities
- CSS Grid and Flexbox for responsive layouts
