# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Create a development build on your device or emulator

   ```bash
   npx expo run:android
   ```

   On iOS, use:

   ```bash
   npx expo run:ios
   ```

3. Start the Metro bundler for the dev client

   ```bash
   npm start
   ```

This project is configured to open in a development build, not Expo Go.

## Connect the App to Render

The app already reads `EXPO_PUBLIC_API_BASE_URL` from the Expo environment. To point the mobile app at your Render backend:

1. Copy [.env.example](.env.example) to a local `.env` file.
2. Replace the placeholder URL with your Render backend URL, for example `https://energeia-backend.onrender.com`.
3. Rebuild or restart Expo so the new environment value is picked up.

All API calls from `services/apiClient.ts` will then use that base URL instead of the local development server.

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
"# evcharging-app" 
