import { Dialog } from '@headlessui/react';
import React, { useEffect } from 'react';

const OrderConstraintModal = ({ isModalOpen, setIsModalOpen }) => {
  useEffect(() => {
    console.log('The modal is ', isModalOpen);
  }, [isModalOpen]);

  return (
    <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <div className="tw-fixed tw-inset-0 tw-flex tw-items-center tw-justify-center tw-p-4 !tw-bg-black-500">
        <Dialog.Panel className="tw-bg-white tw-rounded-lg tw-p-6 tw-max-w-md tw-w-full tw-shadow-xl">
          <Dialog.Title className="tw-text-lg tw-font-bold tw-mb-2">Your Modal Title</Dialog.Title>

          <p className="tw-text-base tw-mb-4">Your modal content goes here.</p>

          <button
            onClick={() => setIsModalOpen(false)}
            className="tw-bg-[#0835DB] tw-text-white tw-px-4 tw-py-2 tw-rounded-lg"
          >
            Close
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default OrderConstraintModal;
