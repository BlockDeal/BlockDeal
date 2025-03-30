import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import LoadingSpinner from './LoadingSpinner';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: string) => Promise<void>;
  title: string;
  description: string;
  confirmText: string;
  currentPrice?: string;
}

export default function TransactionModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  currentPrice,
}: TransactionModalProps) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!amount) return;

    setLoading(true);
    setError(null);

    try {
      await onConfirm(amount);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6">
          <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
            {title}
          </Dialog.Title>

          <div className="mt-2">
            <p className="text-sm text-gray-500">
              {description}
            </p>
          </div>

          {currentPrice && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Current Price: {currentPrice} ETH
              </p>
            </div>
          )}

          <div className="mt-4">
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700"
            >
              Amount (ETH)
            </label>
            <div className="mt-1">
              <input
                type="number"
                name="amount"
                id="amount"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="0.00"
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              onClick={handleConfirm}
              disabled={loading || !amount}
            >
              {loading ? (
                <LoadingSpinner size="sm" color="text-white" />
              ) : (
                confirmText
              )}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 