# Print Genie | AI-Enhanced Printing Shop

This is a Next.js 15 project configured for **Firebase Hosting** with automated **GitHub Actions** deployment.

## 🚀 How to Host Online (Automated)

This project uses **Continuous Deployment**. You don't need to run manual deployment commands if your GitHub repository is connected.

### 1. Push to Main
Whenever you want to update your live site, simply push your code to the `main` branch:
```bash
git add .
git commit -m "Describe your changes"
git push origin main
```

### 2. Monitor Deployment
- Go to your GitHub repository.
- Click on the **Actions** tab.
- You will see a workflow named "Deploy to Firebase Hosting on merge" running.
- Once it finishes (green checkmark), your site is live!

## 🛠 Manual Build & Export (Optional)

If you want to test the static build locally:

### 1. Build the project
This generates the `out/` directory.
```bash
npm run build
```

### 2. Preview Locally
You can use a local server to test the static output:
```bash
npx serve out
```

### 3. Manual Firebase Deploy
```bash
firebase deploy --only hosting
```

## Key Features
- **Static Export**: Optimized for Firebase's global CDN with zero-runtime overhead.
- **AI-Powered**: Uses Genkit for image resolution checks and printing summaries.
- **Admin Dashboard**: Real-time order management and shop customization.
- **CI/CD**: Automatic "Preview Channels" for every Pull Request and auto-deploy on merge.
