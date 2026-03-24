# Metafield Guru — Shop-Level Config

## Table of Contents

- [Overview](#overview)
- [The Pattern](#the-pattern)
- [Usage in Liquid Templates](#usage-in-liquid-templates)
- [Current Shop Metafields](#current-shop-metafields)
- [Adding a New Metafield](#adding-a-new-metafield)

---

## Overview

[Metafield Guru](https://apps.shopify.com/metafields-editor-2) is used to store store-wide configuration values on the `shop` global object — acting as environment variables accessible in any Liquid template without hardcoding.

---

## The Pattern

Instead of hardcoding product handles, variant IDs, or selling plan IDs into templates, values are stored as **shop-level metafields** and referenced in Liquid:

```
Namespace: global
Key:       subscription_variant_id
Type:      product_reference
```

---

## Usage in Liquid Templates

**Accessing the subscription variant ID and selling plan:**

```liquid
{{- shop.metafields.global.subscription_variant_id.value.variants[0].id -}}
{{- shop.metafields.global.subscription_variant_id.value.selling_plan_allocations[0].selling_plan_id -}}
```

These are passed as data attributes into the React component mount point in `sections/main-product.liquid`:

```liquid
<div id="product-form-buttons-holder-react"
  data-subscription-variant-id="{{ shop.metafields.global.subscription_variant_id.value.variants[0].id }}"
  data-selling-plan-id="{{ shop.metafields.global.subscription_variant_id.value.selling_plan_allocations[0].selling_plan_id }}"
></div>
```

**Conditionally hiding cart line items by product handle:**

```liquid
{% assign subscription_handle = shop.metafields.global.subscription_variant_id.value.handle %}
{% if item.product.handle == subscription_handle %} !tw-hidden {% endif %}
```

> ⚠️ **Important:** Never nest `{{ }}` output tags inside `{% if %}` string comparisons. Always use `{% assign %}` to store the metafield value in a variable first, then use the variable in conditions.

---

## Current Shop Metafields

| Namespace | Key | Type | Used For |
|-----------|-----|------|----------|
| `global` | `subscription_variant_id` | `product_reference` | Subscription product handle, variant ID, and selling plan ID |

---

## Adding a New Metafield

1. Open the Metafield Guru app in the Shopify admin
2. Navigate to **Shop** metafields
3. Click **Add metafield**
4. Set the **Namespace** and **Key** (e.g., `global` / `your_key`)
5. Choose the **Type** (e.g., `product_reference`, `single_line_text_field`)
6. Save and assign a value
7. Reference it in Liquid as `shop.metafields.[namespace].[key].value`

---

[← Back to README](../README.md)
