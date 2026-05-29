# Figuritas Frontend

Mobile app for the Figuritas sticker exchange marketplace.

**Stack:** Expo SDK 54 · React Native · TypeScript · React Navigation · AsyncStorage

---

## Prerequisites

- Node.js 22+
- Expo CLI (`npm install -g expo-cli`) — or use `npx expo` directly
- For iOS: Xcode + iOS Simulator, or the **Expo Go** app on a real device
- For Android: Android Studio + an emulator, or the **Expo Go** app on a real device

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the API URL

Open `src/services/config.ts` and set `API_URL` to point to the backend:

```ts
// For iOS simulator or web:
export const API_URL = "http://localhost:4000/api";

// For Android emulator:
export const API_URL = "http://10.0.2.2:4000/api";

// For a real device on the same network, use your machine's local IP:
export const API_URL = "http://192.168.x.x:4000/api";
```

### 3. Start the development server

```bash
npm start
```

This opens the Expo dev console. Then:

- Press **i** to open in the iOS Simulator
- Press **a** to open in an Android Emulator
- Scan the QR code with **Expo Go** to run on a real device

---

## Available Scripts

| Script | Description |
|---|---|
| `npm start` | Start Expo dev server |
| `npm run ios` | Open in iOS Simulator directly |
| `npm run android` | Open in Android Emulator directly |
| `npm run web` | Open in the browser |

---

## Project Structure

```
src/
├── context/         # Auth context (token storage, login/logout)
├── controllers/     # Custom hooks with screen logic
│   ├── useAlbumController.ts
│   └── useSearchController.ts
├── screens/         # Pure view components
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   ├── AlbumScreen.tsx
│   └── SearchScreen.tsx
├── services/        # API calls
│   ├── api.ts
│   ├── auth.ts
│   └── config.ts
└── types/           # Shared TypeScript types
    └── index.ts
App.tsx              # Navigation setup
```

---

## Notes

- The backend must be running before launching the app.
- Tokens are persisted via AsyncStorage and survive app restarts.
- The album data is hardcoded on the backend — no internet connection is required for the sticker catalog.
