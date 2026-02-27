import { Dialog } from '@headlessui/react';
import React, { useState, useRef, useEffect } from 'react';

export const COOKIE_NAME = 'sifter_dash_auth';
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

export const sha256 = async (message) => {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

export const getAuthCookie = () =>
  document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${COOKIE_NAME}=`))
    ?.split('=')[1];

export const setAuthCookie = (hash) => {
  document.cookie = `${COOKIE_NAME}=${hash}; max-age=${COOKIE_MAX_AGE}; SameSite=Strict; Secure; path=/`;
};

const DashboardPasswordModal = ({ isOpen, expectedHash, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 50);
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || isChecking) return;
    setIsChecking(true);
    setError(false);
    try {
      const hash = await sha256(password);
      if (hash === expectedHash) {
        setAuthCookie(hash);
        onSuccess();
      } else {
        setError(true);
        setPassword('');
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={() => {}}>
      <div className="tw-fixed tw-inset-0 tw-flex tw-items-center tw-justify-center tw-p-4 !tw-bg-[#0000009e]">
        <Dialog.Panel className="tw-bg-white tw-rounded-lg tw-p-8 tw-w-full md:!tw-w-[420px] tw-shadow-xl">
          {/* Lock icon */}
          <div className="tw-flex tw-justify-center tw-mb-5">
            <div
              style={{
                background: '#0835DB14',
                borderRadius: '50%',
                padding: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0835DB"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: '34px', height: '34px' }}
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
          </div>

          <Dialog.Title className="tw-text-xl tw-leading-[157%] tw-tracking-[-0.16px] tw-font-bold tw-mb-1 tw-text-center">
            Dashboard Access
          </Dialog.Title>

          <p className="tw-text-sm tw-leading-[157%] tw-tracking-[-0.16px] tw-mb-6 tw-text-center tw-text-gray-400">
            Enter the password to view Sifter analytics.
          </p>

          <form onSubmit={handleSubmit} className="tw-flex tw-flex-col tw-gap-3">
            <input
              ref={inputRef}
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Password"
              autoComplete="current-password"
              style={{
                width: '100%',
                border: `1.5px solid ${error ? '#ef4444' : '#d1d5db'}`,
                borderRadius: '10px',
                padding: '12px 16px',
                fontSize: '15px',
                outline: 'none',
                background: error ? '#fef2f2' : '#fff',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => {
                if (!error) e.target.style.borderColor = '#0835DB';
              }}
              onBlur={(e) => {
                if (!error) e.target.style.borderColor = '#d1d5db';
              }}
            />

            {error && (
              <p
                style={{
                  color: '#dc2626',
                  fontSize: '13px',
                  textAlign: 'center',
                  margin: '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ width: '14px', height: '14px', flexShrink: 0 }}
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                Incorrect password. Please try again.
              </p>
            )}

            <button
              type="submit"
              disabled={!password || isChecking}
              style={{
                background: !password || isChecking ? '#e5e7eb' : '#0835DB',
                color: !password || isChecking ? '#9ca3af' : '#fff',
                border: 'none',
                borderRadius: '10px',
                padding: '13px',
                width: '100%',
                fontWeight: 600,
                fontSize: '15px',
                cursor: !password || isChecking ? 'not-allowed' : 'pointer',
                letterSpacing: '0.3px',
                transition: 'background 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {isChecking ? (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      width: '16px',
                      height: '16px',
                      animation: 'sifter-spin 0.6s linear infinite',
                    }}
                  >
                    <line x1="12" y1="2" x2="12" y2="6" />
                    <line x1="12" y1="18" x2="12" y2="22" />
                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                    <line x1="2" y1="12" x2="6" y2="12" />
                    <line x1="18" y1="12" x2="22" y2="12" />
                    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
                  </svg>
                  Verifying…
                </>
              ) : (
                'Unlock'
              )}
            </button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default DashboardPasswordModal;
