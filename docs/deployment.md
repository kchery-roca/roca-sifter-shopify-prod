# Deployment

## Table of Contents

- [Build for Production](#build-for-production)
- [Push to Shopify](#push-to-shopify)
- [Additional Resources](#additional-resources)

---

## Build for Production

```bash
npm run build
```

This creates optimized, minified CSS in `assets/tailwind.css`.

---

## Push to Shopify

After building, push your theme:

```bash
shopify theme push --theme THEME_ID
```

Or push to your live theme:

```bash
shopify theme push --live
```

> ⚠️ **Warning:** Always test on a development theme before pushing to live!

---

## Additional Resources

- [Shopify Theme Development](https://shopify.dev/docs/themes)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shopify Liquid Reference](https://shopify.dev/docs/api/liquid)
- [Shopify Metafields Reference](https://shopify.dev/docs/api/liquid/objects/metafield)
- [Webpack Documentation](https://webpack.js.org/)

---

[← Back to README](../README.md)
