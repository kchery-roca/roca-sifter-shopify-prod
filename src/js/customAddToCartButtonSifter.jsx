import React from 'react';

const CustomAddToCartButtonSifter = () => {

  const container = document.getElementById('product-form-buttons-holder-react');
  const variantId = container.dataset.variantId;
  const subscriptionVariantId = container.dataset.subscriptionVariantId;
  const sellingPlanId = container.dataset.sellingPlanId;


  const generateSerialNumber = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const twoLetters = letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)];
    const fiveNumbers = String(Math.floor(10000 + Math.random() * 90000));
    return twoLetters + '-' + fiveNumbers;
  }

  const addToCart = () => {

    const webSerialNumber = generateSerialNumber();

    const items = [
        { id: variantId, quantity: 1, properties: { webSerialNumber } },
        { id: subscriptionVariantId, quantity: 1, selling_plan: sellingPlanId, properties: { webSerialNumber } }
    ]

    fetch(`${window.routes.cart_add_url}.js`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({items})
    }).then(response => response.json())
    .then((data) => {
        if(data.status) console.error(data.errors)
    })
    .catch(console.error)


  } 

  return (
    <div>
      <div>
        Checkbox 1
      </div>
      <div>
        Checkbox 2
      </div>
      <button onClick={addToCart}>Add to Cart 23 1023</button>
    </div>
  );
};

export default CustomAddToCartButtonSifter;