# Vercel Deployment Guide

## Fixing 404 Errors on Page Refresh

### Problem
When users refresh the page or navigate directly to a URL (like `/dashboard`), Vercel shows a 404 error because it doesn't know how to handle client-side routes.

### Solution
We've added a `vercel.json` configuration file that tells Vercel to serve `index.html` for all routes, allowing React Router to handle the routing.

## Deployment Steps

### 1. Update Your Repository
Make sure you have the latest changes:
- `vercel.json` configuration file
- Updated `vite.config.js`

### 2. Redeploy to Vercel
1. Push your changes to your Git repository
2. Vercel will automatically redeploy
3. Or manually trigger a redeploy in the Vercel dashboard

### 3. Verify the Fix
1. Go to your deployed app
2. Navigate to `/dashboard`
3. Refresh the page - it should work now
4. Try navigating directly to `/login` or `/signup`

## Configuration Details

### vercel.json
```json
{
  "rewrites": [
    {
      "source": "/((?!api|_next/static|_next/image|favicon.ico).*)",
      "destination": "/index.html"
    }
  ]
}
```

This configuration:
- Redirects all requests to `index.html`
- Excludes API routes and static assets
- Allows React Router to handle client-side routing

### vite.config.js
```javascript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore']
        }
      }
    }
  }
})
```

This configuration:
- Optimizes build output
- Splits vendor and Firebase code into separate chunks
- Improves loading performance

## Testing the Fix

1. **Direct Navigation**: Try going directly to `https://your-app.vercel.app/dashboard`
2. **Page Refresh**: Navigate to dashboard and refresh the page
3. **Browser Back/Forward**: Use browser navigation buttons
4. **Deep Links**: Share a direct link to `/dashboard`

## Common Issues

### Still Getting 404?
1. **Clear Vercel Cache**: In Vercel dashboard, go to Settings → General → Clear Cache
2. **Check Build Logs**: Ensure the build completed successfully
3. **Verify Configuration**: Make sure `vercel.json` is in the root directory

### Environment Variables
Make sure your Firebase environment variables are set in Vercel:
1. Go to Vercel dashboard → Your project → Settings → Environment Variables
2. Add all your Firebase environment variables:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

### Build Issues
If you're getting build errors:
1. Check that all dependencies are in `package.json`
2. Ensure Node.js version is compatible (use 18.x or 20.x)
3. Check build logs in Vercel dashboard

## Alternative Solutions

If the `vercel.json` approach doesn't work, you can also:

### 1. Use Hash Router
Change from `BrowserRouter` to `HashRouter` in your App.jsx:
```javascript
import { HashRouter as Router } from "react-router-dom";
```

### 2. Add a Custom 404 Page
Create a `public/404.html` file that redirects to your app.

## Verification Checklist

- [ ] `vercel.json` is in the root directory
- [ ] Environment variables are set in Vercel
- [ ] Build completes successfully
- [ ] Direct navigation to `/dashboard` works
- [ ] Page refresh on `/dashboard` works
- [ ] Browser back/forward navigation works
- [ ] Deep links work correctly 