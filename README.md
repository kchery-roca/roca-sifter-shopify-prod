# Roca Sifter Shopify Theme

A custom Shopify theme built with Tailwind CSS v3, Webpack, and modern development tooling.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [Environment Configuration](#environment-configuration)
- [Development Workflow](#development-workflow)
- [Available Scripts](#available-scripts)
- [Deploying to Shopify](#deploying-to-shopify)

---

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

1. **Node.js** (v16 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **Shopify CLI**
   - Install globally: `npm install -g @shopify/cli @shopify/theme`
   - Verify installation: `shopify version`

4. **Git**
   - Download from [git-scm.com](https://git-scm.com/)
   - Verify installation: `git --version`

---

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/kchery-roca/roca-sifter-shopify-prod.git
cd roca-sifter-shopify-prod
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Tailwind CSS v3
- Webpack & loaders
- PostCSS & Autoprefixer
- Development utilities

### 3. Authenticate with Shopify

First-time setup requires authentication:

```bash
shopify auth login
```

Follow the prompts to authenticate with your Shopify partner account.

---

## Environment Configuration

Create a `.env` file in the project root (already included in `.gitignore`):

```env
STORE_URL=your-store.myshopify.com
THEME_ID=your_theme_id
```

### Finding Your Theme ID

```bash
shopify theme list --store your-store.myshopify.com
```

This will display all themes with their IDs:
```
ID            Name                    Role
123456789     Development             development
987654321     Production              live
```

Copy the ID for the theme you want to develop on and add it to your `.env` file.

---

## Development Workflow

### Starting Development

Run this command to start development:

```bash
npm run start
```

This starts Webpack in watch mode, which will:
- Watch your Liquid files for Tailwind class changes
- Automatically rebuild `assets/tailwind.css` when changes are detected
- Run in development mode with source maps

### Running Shopify Theme Dev

In a **separate terminal**, start the Shopify development server:

```bash
npm run dev
```

This starts the Shopify theme dev server with hot-reloading.

### Accessing Your Development Store

Once running, you'll see:
```
Preview your theme:
  • http://127.0.0.1:9292

Share your theme preview:
  • https://your-store.myshopify.com/?preview_theme_id=THEME_ID
```

Open the local URL in your browser to preview changes with hot-reloading.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm install` | Install all dependencies |
| `npm run build` | Build production-ready assets (minified) |
| `npm run watch` | Watch files and rebuild Tailwind CSS on changes |
| `npm run start` | Start Webpack in development mode with watch |
| `npm run dev` | Start Shopify theme dev server |
| `npm run prod-development` | Run dev server against production theme |

---

## Deploying to Shopify

### Build for Production

```bash
npm run build
```

This creates optimized, minified CSS in `assets/tailwind.css`.

### Push to Shopify

After building, push your theme:

```bash
shopify theme push --theme THEME_ID
```

Or push to your live theme:

```bash
shopify theme push --live
```

**⚠️ Warning:** Always test on a development theme before pushing to live!

---

## Additional Resources

- [Shopify Theme Development](https://shopify.dev/docs/themes)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shopify Liquid Reference](https://shopify.dev/docs/api/liquid)
- [Webpack Documentation](https://webpack.js.org/)

---

## Support

For issues or questions:
- Review [GitHub Issues](https://github.com/kchery-roca/roca-sifter-shopify-prod/issues)
- Contact the development team

---

## License

ISC
