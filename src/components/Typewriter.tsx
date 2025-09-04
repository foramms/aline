import React, { useState, useEffect } from "react";

type Props = {
  textArray: string[];
  speed?: number;
  pause?: number; // pause between phrases in ms
};

export default function Typewriter({ textArray, speed = 100, pause = 1000 }: Props) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let i = -1;
    setDisplayedText(""); // reset displayed text for new phrase
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + textArray[currentIndex].charAt(i));
      i++;
      if (i >= textArray[currentIndex].length) {
        clearInterval(interval);
        // Pause before next phrase
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % textArray.length);
        }, pause);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [currentIndex, textArray, speed, pause]);

  return (
    <span className="bg-gradient-to-r from-primary-500 to-sage-400 bg-clip-text text-transparent font-semibold">
      {displayedText}
      <span className="animate-pulse">|</span>
    </span>
  );
}
