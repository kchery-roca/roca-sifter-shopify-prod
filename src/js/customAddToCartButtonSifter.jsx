import React from 'react';
import { useState } from 'react';

const CustomAddToCartButtonSifter = () => {

  const [isTCGPlayer, setIsTCGPlayer] = useState(false);
  const [acceptTermsAndConditions, setAcceptTermsAndConditions] = useState(false);

  const container = document.getElementById('product-form-buttons-holder-react');
  const variantId = container?.dataset?.variantId;
  const subscriptionVariantId = container?.dataset?.subscriptionVariantId;
  const sellingPlanId = container?.dataset?.sellingPlanId;
  const productPrice = container?.dataset?.productPrice;

  const generateSerialNumber = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const twoLetters = letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)];
    const fiveNumbers = String(Math.floor(10000 + Math.random() * 90000));
    return twoLetters + '-' + fiveNumbers;
  };

  const addToCart = async () => {
    // Check if both checkboxes are checked
    if (!isTCGPlayer || !acceptTermsAndConditions) {
      const missingItems = [];
      if (!isTCGPlayer) missingItems.push('acknowledge TCGplayer seller account requirement');
      if (!acceptTermsAndConditions) missingItems.push('agree to Terms and Conditions');
      
      alert(`Please ${missingItems.join(' and ')} by checking the boxes above.`);
      return;
    }

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
      
      // Fetch both cart sections
      const sectionsResponse = await fetch(`${window.routes.cart_url}?sections=cart-drawer,cart-icon-bubble`);
      const sectionsData = await sectionsResponse.json();
      
      const cartDrawer = document.querySelector('cart-drawer');
      if (cartDrawer) {
        const parser = new DOMParser();
        
        // Update drawer content
        const drawerDoc = parser.parseFromString(sectionsData['cart-drawer'], 'text/html');
        const newDrawerInner = drawerDoc.querySelector('.drawer__inner');
        
        if (newDrawerInner) {
          const currentDrawerInner = cartDrawer.querySelector('.drawer__inner');
          if (currentDrawerInner) {
            currentDrawerInner.innerHTML = newDrawerInner.innerHTML;
          }
        }
        
        // Update cart icon bubble - get content from section wrapper
        const bubbleDoc = parser.parseFromString(sectionsData['cart-icon-bubble'], 'text/html');
        const bubbleSection = bubbleDoc.querySelector('.shopify-section');
        const currentBubble = document.querySelector('#cart-icon-bubble');
        
        if (bubbleSection && currentBubble) {
          currentBubble.innerHTML = bubbleSection.innerHTML;
        }
        
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
      <div className="tw-flex tw-items-center tw-gap-2">
        <input type="checkbox" checked={isTCGPlayer} onChange={() => setIsTCGPlayer(!isTCGPlayer)} />
        <label htmlFor="isTCGPlayer" className="tw-text-base tw-font-[400] tw-tracking-[0.16px]">I acknowledge that I am required to have a <a href="https://www.tcgplayer.com/become-a-seller" target="_blank" className="tw-text-blue-500">TCGplayer seller account</a>  in order to operate a Roca Sifter </label>
      </div>
      <div className="tw-flex tw-items-center tw-gap-2">
      <input type="checkbox" checked={acceptTermsAndConditions} onChange={() => setAcceptTermsAndConditions(!acceptTermsAndConditions)} />
      <label htmlFor="acceptTermsAndConditions" className="tw-text-base tw-font-[400] tw-tracking-[0.16px]">By clicking order I agree to the <a href="/pages/terms-and-conditions" target="_blank" className="tw-text-blue-500">Terms and Conditions</a> and acknowledge the <a href="/pages/privacy-policy" target="_blank" className="tw-text-blue-500">Privacy Policy</a></label>
      </div>
      <p>Available for purchase within U.S only</p>
      <div className="tw-flex tw-gap-4 tw-mt-2">
      <button 
       type="button" 
       onClick={addToCart} 
       disabled={!isTCGPlayer || !acceptTermsAndConditions} 
       className={`tw-px-[16px] tw-py-[8px] tw-text-white disabled:tw-text-black tw-py-2 tw-rounded-[8px] tw-text-base tw-font-[600] tw-tracking-[150%] tw-border-none ${
         !isTCGPlayer || !acceptTermsAndConditions 
           ? 'tw-bg-gray-400 tw-cursor-not-allowed' 
           : 'tw-bg-[#0835DB] tw-cursor-pointer'
       }`}
      >
        Order
      </button>
      <span className="tw-text-lg tw-text-black tw-font-bold">{productPrice}</span>
      </div>
    </div>
  );
};

export default CustomAddToCartButtonSifter;
