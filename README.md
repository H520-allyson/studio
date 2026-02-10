# Print Genie | AI-Enhanced Printing Shop

This is a Next.js 15 project configured for **Firebase Hosting**.

## How to host for FREE

This project is set up to run on the **Firebase Hosting Spark Plan**.

### 1. Build the project
Next.js is configured for static export. Running build will create an `out/` directory.
```bash
npm run build
```

### 2. Deploy to Firebase
Make sure you have the Firebase CLI installed (`npm install -g firebase-tools`) and are logged in (`firebase login`).
```bash
firebase deploy --only hosting
```

### 3. CI/CD (Optional)
This project includes GitHub Actions workflows. If you push this code to a GitHub repository, it will automatically:
- Create a **Preview URL** for every Pull Request.
- Deploy to your **Live Site** when you merge to `main`.

## Key Features
- **Static Export**: Zero-server runtime for maximum speed and security.
- **AI-Powered**: Uses Genkit for image resolution checks and printing summaries.
- **Admin Dashboard**: Real-time order management and shop customization.