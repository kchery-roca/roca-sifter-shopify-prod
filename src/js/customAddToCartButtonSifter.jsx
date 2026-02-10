import React from 'react';
import { useState } from 'react';

const CustomAddToCartButtonSifter = () => {

  const [isTCGPlayer, setIsTCGPlayer] = useState(false);
  const [acceptTermsAndConditions, setAcceptTermsAndConditions] = useState(false);

  const container = document.getElementById('product-form-buttons-holder-react');
  const variantId = container?.dataset?.variantId;
  const subscriptionVariantId = container?.dataset?.subscriptionVariantId;
  const sellingPlanId = container?.dataset?.sellingPlanId;

  const generateSerialNumber = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const twoLetters = letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)];
    const fiveNumbers = String(Math.floor(10000 + Math.random() * 90000));
    return twoLetters + '-' + fiveNumbers;
  };

  const addToCart = async () => {
    const webSerialNumber = generateSerialNumber();
    const formData = new FormData();
    
    formData.append('items[0][id]', variantId);
    formData.append('items[0][quantity]', '1');
    formData.append('items[0][properties][Web-Serial-Number]', webSerialNumber);
    
    formData.append('items[1][id]', subscriptionVariantId);
    formData.append('items[1][quantity]', '1');
    formData.append('items[1][selling_plan]', sellingPlanId);
    formData.append('items[1][properties][Web-Serial-Number]', webSerialNumber);
    
    try {
      // Step 1: Add to cart
      const response = await fetch(window.routes.cart_add_url, {
        method: 'POST',
        headers: { 
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/javascript'
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (data.status) {
        console.error(data.description);
        return;
      }
      
      // Step 2: Fetch cart sections separately
      const sectionsResponse = await fetch(`${window.routes.cart_url}?section_id=cart-drawer`);
      const sectionsHTML = await sectionsResponse.text();
      
      // Step 3: Render and open drawer
      const cartDrawer = document.querySelector('cart-drawer');
      if (cartDrawer) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(sectionsHTML, 'text/html');
        const newDrawerInner = doc.querySelector('.drawer__inner');
        
        if (newDrawerInner) {
          const currentDrawerInner = cartDrawer.querySelector('.drawer__inner');
          if (currentDrawerInner) {
            currentDrawerInner.innerHTML = newDrawerInner.innerHTML;
          }
        }
        
        // Remove empty class if present
        cartDrawer.classList.remove('is-empty');
        
        if (typeof cartDrawer.open === 'function') {
          cartDrawer.open();
        }
      }
    } catch (error) {
      console.error('Add to cart error:', error);
    }
  };

  return (
    <div>
      <div>
        <input type="checkbox" checked={isTCGPlayer} onChange={() => setIsTCGPlayer(!isTCGPlayer)} />
        Checkbox 1
      </div>
      <div>
      <input type="checkbox" checked={acceptTermsAndConditions} onChange={() => setAcceptTermsAndConditions(!acceptTermsAndConditions)} />
        Checkbox 2
      </div>
      <button onClick={addToCart}>Add to Cart</button>
    </div>
  );
};

export default CustomAddToCartButtonSifter;
