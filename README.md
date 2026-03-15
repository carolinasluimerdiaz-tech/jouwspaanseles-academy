
# ZayroLingua Academy - Deployment Guide

Congratulations! You are ready to deploy your own Spanish academy live.

## Step 1: Save Files
Copy all the code from this chat and save it on your computer in a folder named `zayrolingua`. Ensure the folder structure is correct (put components in the `components` folder, etc.).

## Step 2: GitHub (Pushing the code online)
1. Create an account on [GitHub.com](https://github.com).
2. Create a "New Repository" named `zayrolingua`.
3. Use the "uploading an existing file" button and drag all the files from your computer to the screen.
4. Click on "Commit changes".

## Step 3: Vercel (Making the app truly work)
1. Go to [Vercel.com](https://vercel.com) and log in with your new GitHub account.
2. Click on **"Add New..."** -> **"Project"**.
3. Import your `zayrolingua` repository.
4. **IMPORTANT:** Click on "Environment Variables".
   - Name: `API_KEY`
   - Value: (Paste your Google Gemini API Key here)
5. Click on **"Deploy"**.

Once Vercel finishes, you will get a link (like `zayrolingua.vercel.app`) that you can share with your friends!