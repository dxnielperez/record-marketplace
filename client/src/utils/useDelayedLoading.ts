import { useState, useEffect } from 'react';

export function useDelayedLoading(loading, delay = 5000) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let timer;
    if (loading) {
      timer = setTimeout(() => {
        setShowModal(true);
      }, delay);
    } else {
      setShowModal(false);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [loading, delay]);

  return showModal;
}
