# Metafield Guru — Shop-Level Config

## Table of Contents

- [Purpose](#purpose)
- [How the Bundle Works](#how-the-bundle-works)
- [The Metafield](#the-metafield)
- [Usage in Liquid Templates](#usage-in-liquid-templates)
- [Changing the Subscription or Physical Product](#changing-the-subscription-or-physical-product)
- [Adding a New Metafield](#adding-a-new-metafield)

---

## Purpose

The `subscription_variant_id` shop metafield is the link between the **physical sifter product** and its **subscription product** in Shopify. It tells the cart which subscription product to automatically bundle with the sifter when a customer adds it to their cart.

Without this metafield pointing to the correct product, the bundle add-to-cart flow will break — the subscription will NOT be added alongside the physical item.

---

## How the Bundle Works

When a customer clicks Add to Cart on the sifter product page, the React component (`customAddToCartButtonSifter.jsx`) reads two data attributes from the DOM that are populated by this metafield:

1. **`data-subscription-variant-id`** — the variant ID of the subscription product to add to cart
2. **`data-selling-plan-id`** — the selling plan ID that makes the subscription recurring

Both are pulled from `shop.metafields.global.subscription_variant_id.value`, which resolves to the full product object of whatever product is set as the metafield value.

> ⚠️ **Constraint:** The subscription product referenced by this metafield **must have exactly one selling plan**. The code always reads `selling_plan_allocations[0]` — if the product has multiple plans, only the first will ever be used and the others will be silently ignored.

---

## The Metafield

```
Namespace: global
Key:       subscription_variant_id
Type:      product_reference
```

| Namespace | Key | Type | Used For |
|-----------|-----|------|----------|
| `global` | `subscription_variant_id` | `product_reference` | Determines which subscription product is bundled with the sifter at checkout |

---

## Usage in Liquid Templates

**Passing variant ID and selling plan to the React component** (`sections/main-product.liquid`):

```liquid
<div id="product-form-buttons-holder-react"
  data-subscription-variant-id="{{ shop.metafields.global.subscription_variant_id.value.variants[0].id }}"
  data-selling-plan-id="{{ shop.metafields.global.subscription_variant_id.value.selling_plan_allocations[0].selling_plan_id }}"
></div>
```

**Hiding the subscription line item in the cart drawer** (`snippets/cart-drawer.liquid`):

The subscription product is added to the cart behind the scenes — customers should not see it as a separate line item in the cart. It is hidden using the product handle from this same metafield:

```liquid
{% assign subscription_handle = shop.metafields.global.subscription_variant_id.value.handle %}
{% if item.product.handle == subscription_handle %} !tw-hidden {% endif %}
```

> ⚠️ **Important:** Never nest `{{ }}` output tags inside `{% if %}` string comparisons. Always use `{% assign %}` to store the metafield value in a variable first, then use the variable in conditions.

**Excluding the subscription from the cart bubble count** (`sections/cart-icon-bubble.liquid` and `sections/header.liquid`):

Because the subscription is a hidden line item, including it in the cart count bubble would cause the number shown to the customer to be higher than the number of visible items they see in the cart — which would appear broken. The bubble count loops through all cart items and skips any whose handle matches the subscription:

```liquid
{%- liquid
  assign filtered_item_count = 0
  for item in cart.items
    if item.product.handle != shop.metafields.global.subscription_variant_id.value.handle
      assign filtered_item_count = filtered_item_count | plus: item.quantity
    endif
  endfor
-%}
<div class="cart-count-bubble">
  <span aria-hidden="true">{{ filtered_item_count }}</span>
</div>
```

This logic exists in both the header cart icon and the standalone cart icon bubble section so the count stays consistent regardless of which component renders it.

---

## Changing the Subscription or Physical Product

If the subscription product or its selling plan ever needs to change, **both of the following must be updated**:

### 1. Update the Metafield in Shopify Admin

1. Open the **Metafield Guru** app in the Shopify admin
2. Navigate to **Shop** metafields
3. Find `global` / `subscription_variant_id`
4. Update the value to point to the new subscription product
5. Save

The Liquid templates will automatically pick up the new product — no code changes needed for the handle hiding or the data attributes.

### 2. Ensure the New Subscription Product Has Exactly One Selling Plan

The code reads `selling_plan_allocations[0]` — the first (and only) plan. The replacement subscription product must be set up in Shopify with **exactly one selling plan**. If it has more than one, only the first will be used.

> ⚠️ **If you also change the physical sifter product**, make sure the new product page still renders the `#product-form-buttons-holder-react` div with the correct data attributes, otherwise the React bundle component will not initialize.

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
