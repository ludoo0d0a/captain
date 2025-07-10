# Deployment Guide - Netlify

This guide explains how to deploy your Captain dashboard to Netlify using GitHub Actions.

## Prerequisites

1. A GitHub repository with your Captain app
2. A Netlify account
3. Node.js 18+ installed locally

## Setup Steps

### 1. Create a Netlify Site

1. Go to [Netlify](https://netlify.com) and sign in
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub account and select your Captain repository
4. Configure the build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.output/public`
   - **Node version**: `18`
5. Click "Deploy site"

### 2. Get Netlify Credentials

After creating your site, you'll need two important values:

1. **Site ID**: Found in your site's dashboard under "Site settings" → "General" → "Site information"
2. **Personal Access Token**: 
   - Go to "User settings" → "Applications" → "Personal access tokens"
   - Click "New access token"
   - Give it a name (e.g., "GitHub Actions")
   - Copy the token (you won't see it again!)

### 3. Add GitHub Secrets

In your GitHub repository:

1. Go to "Settings" → "Secrets and variables" → "Actions"
2. Add these repository secrets:
   - `NETLIFY_AUTH_TOKEN`: Your personal access token from step 2
   - `NETLIFY_SITE_ID`: Your site ID from step 2

### 4. Configure Environment Variables (Optional)

If your app uses environment variables, add them in Netlify:

1. Go to your site's dashboard
2. Navigate to "Site settings" → "Environment variables"
3. Add any required environment variables

## How It Works

### GitHub Actions Workflow

The workflow (`.github/workflows/deploy-netlify.yml`) will:

1. **Trigger on**: Push to main/master branch or pull requests
2. **Build**: Install dependencies and build the Nuxt app
3. **Deploy**: Upload the built files to Netlify
4. **Comment**: Add deployment links to PRs

### Netlify Configuration

The `netlify.toml` file configures:

- **Build settings**: Publish directory and build command
- **Redirects**: SPA routing for Nuxt
- **Headers**: Security headers and caching rules
- **Environment**: Node.js version

## Deployment Types

### Production Deployments
- Triggered by pushes to main/master branch
- Deployed to your production URL
- Automatic and immediate

### Preview Deployments
- Triggered by pull requests
- Creates unique preview URLs
- Perfect for testing changes before merging

## Troubleshooting

### Common Issues

1. **Build fails**: Check the build logs in GitHub Actions
2. **404 errors**: Ensure `netlify.toml` redirects are configured
3. **Environment variables**: Verify they're set in Netlify dashboard
4. **Node version**: Ensure you're using Node 18+

### Debugging

- **GitHub Actions logs**: Check the Actions tab in your repository
- **Netlify logs**: Available in your site's dashboard under "Deploys"
- **Build logs**: Click on any deploy to see detailed logs

## Customization

### Custom Domain
1. Go to "Domain settings" in your Netlify dashboard
2. Add your custom domain
3. Configure DNS as instructed

### Branch Deployments
To deploy from different branches:
1. Edit the workflow file
2. Change the `branches` array in the `on.push` section
3. Update the `production-branch` in the deploy step

### Build Optimization
- The workflow uses `npm ci` for faster, reliable installs
- Assets are cached for better performance
- Security headers are automatically applied

## Security

The deployment includes:
- Security headers (XSS protection, content type options)
- HTTPS enforcement (automatic with Netlify)
- Environment variable protection
- Access token security

## Monitoring

Monitor your deployments:
- **Netlify Analytics**: Built-in performance monitoring
- **GitHub Actions**: Build status and logs
- **Netlify Status**: Site uptime and performance

## Support

If you encounter issues:
1. Check the [Netlify documentation](https://docs.netlify.com)
2. Review [GitHub Actions documentation](https://docs.github.com/en/actions)
3. Check the build logs for specific error messages 