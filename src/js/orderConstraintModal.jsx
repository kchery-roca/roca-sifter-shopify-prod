import { Dialog } from '@headlessui/react';
import React, { useEffect } from 'react';

const OrderConstraintModal = ({ isModalOpen, setIsModalOpen, remainingSifters }) => {
  useEffect(() => {
    console.log('The modal is ', isModalOpen);
  }, [isModalOpen]);

  return (
    <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <div className="tw-fixed tw-inset-0 tw-flex tw-items-center tw-justify-center tw-p-4 !tw-bg-[#0000009e]">
        <Dialog.Panel className="tw-bg-white tw-rounded-lg tw-p-6  tw-w-full md:!tw-w-[50%] tw-shadow-xl">
          <div className="tw-text-right tw-flex tw-justify-end">
            <button
              onClick={() => setIsModalOpen(false)}
              className="tw-bg-white tw-border-none tw-font-bold tw-text-black tw-flex tw-items-center tw-gap-2 tw-px-4 tw-py-2 tw-rounded-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path d="M18 6L6 18" stroke="black" stroke-width="2" stroke-linecap="round" />
                <path d="M6 6L18 18" stroke="black" stroke-width="2" stroke-linecap="round" />
              </svg>
              <span>Close</span>
            </button>
          </div>

          <Dialog.Title className="tw-text-lg tw-leading-[157%] tw-tracking-[-0.16px] tw-font-bold tw-mb-2">
            Maximum Quantity Reached
          </Dialog.Title>

          <p className="tw-text-base tw-text-[16px] tw-leading-[157%] tw-tracking-[-0.16px] tw-mb-4">
            You can add up to <span className="tw-font-bold">9 sifters</span> to your cart at a
            time.
          </p>
          <p className="tw-text-base tw-text-[16px] tw-leading-[157%] tw-tracking-[-0.16px] tw-mb-4">
            Based on what you have in your cart, you can only add{' '}
            <span className="tw-font-bold">
              {remainingSifters} {remainingSifters === 1 ? 'more sifter' : 'more sifters'}
            </span>
            .
          </p>
          <p className="tw-text-base tw-text-[16px] tw-leading-[157%] tw-tracking-[-0.16px] tw-mb-4">
            If you’re looking to purchase <span className="tw-font-bold">10 or more</span>, we offer
            better pricing through our sales team. Please use the link below to chat with sales and
            get the best deal.
          </p>

          <br />

          <a
            href="https://tcgplayer-5.tcgplayer.com/book-a-roca-demo-meeting"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="tw-bg-[#0735dc] tw-border-none tw-text-white  tw-py-[5%] md:tw-py-[2%] tw-rounded-lg tw-w-full md:tw-w-auto tw-px-4 tw-py-2">
              Chat with Sales
            </button>
          </a>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default OrderConstraintModal;
