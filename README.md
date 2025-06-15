
# Stubud AI - Static Site Deployment

This is a complete static site build of the Stubud AI Academic Answer Generator. The application generates comprehensive academic answers for 2, 13, and 15 mark questions using Google's Gemini AI.

## Files Included

- `index.html` - Complete HTML structure with embedded Tailwind CSS
- `styles.css` - Custom styles and responsive design
- `app.js` - Full JavaScript application logic
- `README.md` - This file with hosting instructions

## Features

- ✅ AI-powered answer generation using Google Gemini API
- ✅ Support for 2, 13, and 15 mark question formats
- ✅ Rate limiting with local storage persistence
- ✅ Responsive design for all devices
- ✅ Academic-quality formatting
- ✅ Real-time usage tracking
- ✅ Mobile ad placeholder containers

## Hosting Options

### 1. GitHub Pages (Free)
1. Create a new repository on GitHub
2. Upload all files to the repository
3. Go to Settings → Pages
4. Select "Deploy from a branch" and choose `main`
5. Your site will be available at `https://yourusername.github.io/repository-name`

### 2. Netlify (Free)
1. Visit [netlify.com](https://netlify.com)
2. Drag and drop the folder containing these files
3. Your site will be deployed instantly with a random URL
4. Optional: Connect a custom domain

### 3. Vercel (Free)
1. Visit [vercel.com](https://vercel.com)
2. Import from Git or drag and drop files
3. Deploy instantly with automatic HTTPS

### 4. Traditional Web Hosting
Upload all files to your web server's public directory (usually `public_html` or `www`).

## Browser Requirements

- Modern browsers with ES6+ support
- JavaScript enabled
- Internet connection for Tailwind CSS CDN and Gemini API

## API Configuration

The application uses Google's Gemini AI API. The API key is included in the code for demonstration purposes. For production use, consider:

1. Implementing server-side API calls
2. Using environment variables
3. Adding additional security measures

## Rate Limiting

The application includes built-in rate limiting:
- 30 requests per minute
- 1,400 requests per day  
- 60,000 tokens per day
- 2-second cooldown between requests

Rate limit data is stored in browser's localStorage and persists across sessions.

## Customization

### Styling
- Modify `styles.css` for custom styling
- Tailwind classes can be customized in the `tailwind.config` section of `index.html`

### Content
- Update the header, features, and CTA sections in `index.html`
- Modify the prompt templates in `app.js` for different answer formats

### API Settings
- Change the Gemini model in `app.js` (line with `gemini-2.0-flash-exp`)
- Adjust rate limits in the `RateLimiter` class
- Modify generation parameters like temperature and max tokens

## Mobile Ads

The template includes placeholder containers for mobile advertisements:
- `#mobile-ad-top` - Top banner (16 units high)
- `#mobile-ad-bottom` - Bottom banner (16 units high)

Replace the placeholder content with your ad network's code.

## Support

For issues or questions about the static site build, refer to the original Lovable project or create an issue in your repository.

## License

This is an educational project. Please ensure you comply with Google's Gemini API terms of service when using this application.
