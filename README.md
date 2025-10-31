# Portfolio Rio

Personal portfolio website showcasing my professional experience, achievements, and projects.

## Technologies Used
- HTML
- CSS
- JavaScript
- Netlify Functions (Serverless)
- Google Fonts
- Font Awesome

## Environment Variables

For security, the portfolio password is stored as an environment variable. To set it up:

### Netlify Deployment
1. Go to your Netlify dashboard
2. Navigate to: **Site settings** ? **Environment variables**
3. Add a new variable:
   - **Key**: `PORTFOLIO_PASSWORD`
   - **Value**: Your desired password
4. Redeploy the site for changes to take effect

### Local Development
Create a `.env` file in the root directory (not committed to git):
```
PORTFOLIO_PASSWORD=your_password_here
```

**Note**: Never commit the `.env` file or hardcode passwords in the codebase.
