# Print Genie | AI-Enhanced Printing Shop

Welcome to your new AI-powered printing shop! This project is set up to automatically update your website whenever you "save" your work to GitHub.

## 🚀 How to Publish Your Website (The "Push" Guide)

Think of GitHub as your master storage in the cloud. "Pushing" is the act of sending your local changes to that cloud storage.

### Step 1: Prepare your changes
In your terminal (the command line at the bottom), tell the computer which files you want to save:
```bash
git add .
```

### Step 2: Label your save
Give your "save" a name so you know what you changed:
```bash
git commit -m "I updated the homepage"
```

### Step 3: Push to Main (The Publish Button)
This sends your work to the `main` (primary) version of your site on GitHub:
```bash
git push origin main
```

---

## 🛠 What happens next?
1. **GitHub** receives your code.
2. **GitHub Actions** (the "robots" we set up) start building your website.
3. **Firebase Hosting** receives the finished build and puts it online.

You can watch this happen by going to your GitHub website and clicking the **"Actions"** tab at the top. When the yellow circle turns into a green checkmark, your site is live!

## 🔗 Your Website Link
Your site is hosted for free at:
**https://studio-2566474323-dc85e.web.app**

## Key Features
- **AI Quality Check**: Automatically warns users if their photos are too blurry to print.
- **Cost Estimator**: Live price calculator based on your shop settings.
- **Admin Portal**: A private area for you to manage orders and change prices.
