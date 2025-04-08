import { useState, useEffect } from 'react';

export function LoadingModal({ isVisible, onClose }) {
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setDotCount((prev) => (prev % 3) + 1);
    }, 500);
    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          &times;
        </button>
        <p className="text-gray-700">
          The server is waking up from inactivity. Please wait a moment
          <span
            style={{
              opacity: dotCount >= 1 ? 1 : 0,
              transition: 'opacity 0.2s ease-in-out',
            }}>
            .
          </span>
          <span
            style={{
              opacity: dotCount >= 2 ? 1 : 0,
              transition: 'opacity 0.2s ease-in-out',
            }}>
            .
          </span>
          <span
            style={{
              opacity: dotCount >= 3 ? 1 : 0,
              transition: 'opacity 0.2s ease-in-out',
            }}>
            .
          </span>
        </p>
      </div>
    </div>
  );
}
