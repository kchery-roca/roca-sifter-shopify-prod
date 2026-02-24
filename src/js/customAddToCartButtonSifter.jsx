import React from 'react';
import { useState, useEffect } from 'react';
import OrderConstraintModal from './orderConstraintModal';

const CustomAddToCartButtonSifter = () => {
  const [isTCGPlayer, setIsTCGPlayer] = useState(false);
  const [acceptTermsAndConditions, setAcceptTermsAndConditions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [validationError, setValidationError] = useState(null);
  const [isOrderConstraintModalOpen, setIsOrderConstraintModalOpen] = useState(false);
  const [remainingSifters, setRemainingSifters] = useState(0);

  const openZendeskChat = () => {
    zE('messenger', 'open');
  };

  // When the cart updates, check if it's empty and inject the empty state into the drawer
  useEffect(() => {
    const handleCartUpdate = (event) => {
      const itemCount = event?.cartData?.item_count;
      if (itemCount !== 0) return;

      const cartDrawerEl = document.querySelector('cart-drawer');
      const drawerInner = cartDrawerEl?.querySelector('.drawer__inner');
      if (!cartDrawerEl || !drawerInner) return;

      // is-empty class drives the CSS (hides header/footer, shows empty div)
      cartDrawerEl.classList.add('is-empty');

      // Ensure the outer empty wrapper exists
      let innerEmpty = drawerInner.querySelector('.drawer__inner-empty');
      if (!innerEmpty) {
        innerEmpty = document.createElement('div');
        innerEmpty.className = 'drawer__inner-empty';
        drawerInner.insertBefore(innerEmpty, drawerInner.firstChild);
      }

      // Inject the full empty-content block if not already present
      if (!innerEmpty.querySelector('.cart-drawer__empty-content')) {
        innerEmpty.innerHTML = `
        <div class="cart-drawer__warnings center cart-drawer__warnings--has-collection">
          <div class="cart-drawer__empty-content">
            <h2 class="cart__empty-text">Your cart is empty</h2>
            <button class="drawer__close" type="button" onclick="this.closest('cart-drawer').close()" aria-label="Close">
              <span class="svg-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" class="icon icon-close" viewBox="0 0 18 17">
                  <path fill="currentColor" d="M.865 15.978a.5.5 0 0 0 .707.707l7.433-7.431 7.579 7.282a.501.501 0 0 0 .846-.37.5.5 0 0 0-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 1 0-.707-.708L8.991 7.853 1.413.573a.5.5 0 1 0-.693.72l7.563 7.268z"></path>
                </svg>
              </span>
            </button>
            <a href="/collections/all" class="button">Continue shopping</a>
            <p class="cart__login-title h3">Have an account?</p>
            <p class="cart__login-paragraph">
              <a href="/customer_authentication/redirect?locale=en&region_country=US" class="link underlined-link">Log in</a> to check out faster.
            </p>
          </div>
        </div>
        `;
      }
    };

    // subscribe/publish are plain script globals, not on window
    const sub =
      typeof subscribe !== 'undefined' && typeof PUB_SUB_EVENTS !== 'undefined'
        ? subscribe(PUB_SUB_EVENTS.cartUpdate, handleCartUpdate)
        : null;

    return () => {
      if (typeof sub === 'function') sub();
    };
  }, []);

  // Sync React state with browser-restored checkbox state on mount
  useEffect(() => {
    const tcgCheckbox = document.querySelector('input[type="checkbox"]');
    const termsCheckbox = document.querySelectorAll('input[type="checkbox"]')[1];

    if (tcgCheckbox?.checked) {
      setIsTCGPlayer(true);
    }
    if (termsCheckbox?.checked) {
      setAcceptTermsAndConditions(true);
    }
  }, []);

  const container = document.getElementById('product-form-buttons-holder-react');
  const variantId = container?.dataset?.variantId;
  const subscriptionVariantId = container?.dataset?.subscriptionVariantId;
  const sellingPlanId = container?.dataset?.sellingPlanId;
  const productPrice = container?.dataset?.productPrice;

  const generateSerialNumber = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const twoLetters =
      letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)];
    const fiveNumbers = String(Math.floor(10000 + Math.random() * 90000));
    return twoLetters + '-' + fiveNumbers;
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const SIFTER_LIMIT = 9;
  const SIFTER_HANDLE = 'roca-sifter';

  const getSifterCountInCart = async () => {
    const response = await fetch('/cart.js');
    const cart = await response.json();
    return cart.items
      .filter((item) => item.handle === SIFTER_HANDLE)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  const addToCart = async () => {
    // Prevent multiple clicks while loading
    if (isLoading) return;

    // Check if both checkboxes are checked
    if (!isTCGPlayer || !acceptTermsAndConditions) {
      setValidationError(
        'Acknowledge you will need a seller account to operate the Roca Sifter and agree to Terms & Conditions to continue.'
      );
      return;
    }

    setValidationError(null);
    // Start loading
    setIsLoading(true);

    // Check how many sifters are already in the cart before adding
    try {
      const currentSifterCount = await getSifterCountInCart();
      if (currentSifterCount + quantity > SIFTER_LIMIT) {
        setRemainingSifters(SIFTER_LIMIT - currentSifterCount);
        setIsOrderConstraintModalOpen(true);
        setIsLoading(false);
        return;
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      setIsLoading(false);
      return;
    }

    // Generate unique serial numbers for each sifter bundle
    const serialNumbers = Array.from({ length: quantity }, () => generateSerialNumber());
    const formData = new FormData();

    // Add each sifter bundle (regular product + subscription) with unique serial
    serialNumbers.forEach((webSerialNumber, index) => {
      const itemIndex = index * 2;

      // Regular product
      formData.append(`items[${itemIndex}][id]`, variantId);
      formData.append(`items[${itemIndex}][quantity]`, '1');
      formData.append(`items[${itemIndex}][properties][Web-Serial-Number]`, webSerialNumber);

      // Subscription with same serial
      formData.append(`items[${itemIndex + 1}][id]`, subscriptionVariantId);
      formData.append(`items[${itemIndex + 1}][quantity]`, '1');
      formData.append(`items[${itemIndex + 1}][selling_plan]`, sellingPlanId);
      formData.append(`items[${itemIndex + 1}][properties][Web-Serial-Number]`, webSerialNumber);
    });

    try {
      const response = await fetch(window.routes.cart_add_url, {
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          Accept: 'application/javascript',
        },
        body: formData,
      });

      const data = await response.json();

      if (data.status) {
        console.error(data.description);
        setIsLoading(false);
        return;
      }

      // Fetch both cart sections
      const sectionsResponse = await fetch(
        `${window.routes.cart_url}?sections=cart-drawer,cart-icon-bubble`
      );
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <p className="tw-mb-2">Available for purchase within U.S.</p>
      <p className="tw-mb-4 ">
        <span className="tw-font-bold">Have questions?</span>{' '}
        <a href="#" onClick={openZendeskChat}>
          Contact Us
        </a>
      </p>

      <div className="tw-flex tw-items-center tw-gap-2">
        <span
          className={
            validationError && !isTCGPlayer
              ? 'tw-inline-flex tw-ring-2 tw-ring-red-500 tw-ring-offset-0 tw-rounded'
              : 'tw-inline-flex'
          }
        >
          <input
            type="checkbox"
            checked={isTCGPlayer}
            onChange={() => {
              setIsTCGPlayer(!isTCGPlayer);
              setValidationError(null);
            }}
            className={validationError && !isTCGPlayer ? 'tw-outline-none' : ''}
          />
        </span>
        <label htmlFor="isTCGPlayer" className="tw-text-base tw-font-[400] tw-tracking-[0.16px]">
          I acknowledge that I am required to have a
          <a
            href="https://store.tcgplayer.com/oauth/login/register"
            target="_blank"
            className="tw-text-[#0000ef] tw-mx-3"
          >
            TCGplayer seller account
          </a>
          in order to operate a Roca Sifter.{' '}
        </label>
      </div>

      <div className="tw-flex tw-items-center tw-gap-2">
        <span
          className={
            validationError && !acceptTermsAndConditions
              ? 'tw-inline-flex tw-ring-2 tw-ring-red-500 tw-ring-offset-0 tw-rounded'
              : 'tw-inline-flex'
          }
        >
          <input
            type="checkbox"
            checked={acceptTermsAndConditions}
            onChange={() => {
              setAcceptTermsAndConditions(!acceptTermsAndConditions);
              setValidationError(null);
            }}
            className={validationError && !acceptTermsAndConditions ? 'tw-outline-none' : ''}
          />
        </span>
        <label
          htmlFor="acceptTermsAndConditions"
          className="tw-text-base tw-font-[400] tw-tracking-[0.16px]"
        >
          By clicking order I agree to the{' '}
          <a
            href="https://mktg-assets.tcgplayer.com/web/seller/seller-support/Roca/Roca-Sifter-terms-and-conditions.pdf"
            target="_blank"
            className="tw-text-[#0000ef] tw-ms-2"
          >
            Terms and Conditions
          </a>{' '}
          and acknowledge the
          <a
            href="https://help.tcgplayer.com/hc/en-us/articles/11736500567959-TCGplayer-Privacy-Policy"
            target="_blank"
            className="tw-text-[#0000ef] tw-ms-2"
          >
            Privacy Policy
          </a>
        </label>
      </div>

      {validationError && <p className="tw-text-red-600 tw-mb-2">{validationError}</p>}

      {/* Quantity Selector */}
      <div className="tw-flex tw-items-center tw-gap-3 tw-mt-4 tw-mb-2">
        {/* <label className="tw-text-base tw-font-[600]">Quantity:</label> */}
        <div className="tw-flex tw-items-center tw-border tw-border-gray-300 tw-rounded-[8px] tw-overflow-hidden tw-mb-3">
          <button
            type="button"
            onClick={decrementQuantity}
            disabled={quantity <= 1 || isLoading}
            className="tw-px-3 tw-py-2 tw-bg-gray-100  tw-border-0 hover:tw-bg-gray-200  tw-font-bold disabled:tw-opacity-50 disabled:tw-cursor-not-allowed tw-transition-colors tw-text-[20px]"
          >
            -
          </button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={handleQuantityChange}
            disabled={isLoading}
            className="tw-w-20 tw-w-20 tw-h-12 tw-text-center tw-py-2 tw-border-0 tw-outline-none tw-font-[600] disabled:tw-bg-gray-50 tw-text-base"
          />
          <button
            type="button"
            onClick={incrementQuantity}
            disabled={isLoading || quantity >= SIFTER_LIMIT}
            className="tw-px-3 tw-py-2 tw-bg-gray-100 tw-border-0 hover:tw-bg-gray-200   tw-font-bold disabled:tw-opacity-50 disabled:tw-cursor-not-allowed tw-transition-colors tw-text-[20px]"
          >
            +
          </button>
        </div>
      </div>

      <div className="tw-flex tw-gap-4 tw-mt-2">
        <button
          type="button"
          onClick={addToCart}
          disabled={isLoading}
          className={`tw-px-[16px] tw-py-[8px] tw-text-white tw-py-2 tw-rounded-[8px] tw-text-base tw-font-[600] tw-tracking-[2px] tw-border-none tw-min-w-[120px] tw-flex tw-items-center tw-justify-center tw-gap-2 ${
            isLoading
              ? 'tw-bg-gray-400 tw-cursor-wait'
              : !isTCGPlayer || !acceptTermsAndConditions
                ? 'tw-bg-[#0835DB] tw-cursor-pointer'
                : 'tw-bg-[#0835DB] tw-cursor-pointer'
          }`}
        >
          {isLoading && (
            <svg
              className="tw-animate-spin tw-h-5 tw-w-5 tw-text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="tw-opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="tw-opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          {isLoading ? 'Processing...' : 'Order'}
        </button>
        <span className="tw-text-lg tw-text-black tw-font-bold tw-pt-[5px]">{productPrice}</span>
      </div>

      <OrderConstraintModal
        isModalOpen={isOrderConstraintModalOpen}
        setIsModalOpen={setIsOrderConstraintModalOpen}
        remainingSifters={remainingSifters}
      />
    </div>
  );
};

export default CustomAddToCartButtonSifter;
