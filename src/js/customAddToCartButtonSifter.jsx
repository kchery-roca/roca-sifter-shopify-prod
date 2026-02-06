import React from 'react';

const CustomAddToCartButtonSifter = () => {


  const addToCart = () => {
    alert('Add to Cart');

    
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