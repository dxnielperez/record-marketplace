import { useState, useEffect } from 'react';

export function SlidingBar() {
  const textUnit = 'Ripple Records • ';
  const [repeatCount, setRepeatCount] = useState(10);

  useEffect(() => {
    const updateRepeatCount = () => {
      const viewportWidth = window.innerWidth;
      const approxCharWidth = 8;
      const textUnitWidth = textUnit.length * approxCharWidth;
      const minUnitsNeeded = Math.ceil((viewportWidth * 2) / textUnitWidth);

      setRepeatCount(Math.max(minUnitsNeeded, 10));
    };

    updateRepeatCount();
    window.addEventListener('resize', updateRepeatCount);

    return () => window.removeEventListener('resize', updateRepeatCount);
  }, [textUnit]);

  const baseText = Array(repeatCount).fill(textUnit).join('');

  return (
    <div className="relative w-full overflow-hidden bg-royal-blue text-white my-4">
      <div className="group w-full flex items-center h-10">
        <div className="flex animate-slide group-hover:animation-paused">
          <span className="whitespace-nowrap">{baseText}</span>
        </div>
      </div>
    </div>
  );
}
