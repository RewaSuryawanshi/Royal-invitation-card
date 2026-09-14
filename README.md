# Dynamic Invitation Card Studio

A modern, responsive web application for creating, customizing, and sharing royal wedding and event invitation cards with real-time RSVP management, multi-event schedules, venue maps, photo galleries, and Firebase integration.

## Features

- **Royal Invitation Themes**: Choose from curated luxury aesthetics (Royal Maroon, Emerald & Champagne, Midnight Sapphire, Velvet Plum) with typography pairing and ornaments.
- **Creator Studio & Admin Portal**: Edit card details, event schedules, dress codes, host names, and custom greetings.
- **Guest RSVP System**: Real-time RSVP submissions with headcount, dietary preferences, and warm congratulations messages.
- **Event Schedule & Interactive Venue**: Detail ceremony times, locations, interactive Google Maps links, and countdown timers.
- **Firebase Firestore Integration**: Cloud synchronization for cards, RSVPs, and user accounts.
- **Mobile Responsive**: Optimized view for mobile devices and tablets.

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion
- **Icons**: Lucide React
- **Cloud Database & Auth**: Firebase Firestore & Firebase Authentication
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone or download the repository:
   ```bash
   git clone <your-github-repo-url>
   cd dynamic-invitation-studio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

## Firebase Configuration

The project uses Firebase for database persistence and authentication. Configurations are loaded from `firebase-applet-config.json`. Ensure your domain or `localhost` is added to your Firebase project's **Authorized domains** under **Authentication > Settings**.

## Available Scripts

- `npm run dev` - Starts the development server at port 3000.
- `npm run build` - Builds the application for production.
- `npm run preview` - Locally preview the production build.
- `npm run lint` - Runs TypeScript type checking.
