import React, { useEffect, useRef } from "react";

function Stars() {
  const starsRef = useRef();

  useEffect(() => {
    const starsContainer = starsRef.current;

    while (starsContainer.firstChild) {
      starsContainer.removeChild(starsContainer.firstChild);
    }

    const totalStars = 250;
    for (let i = 0; i < totalStars; i++) {
      const star = document.createElement("div");
      star.className = "star";

      star.style.top = `${Math.random() * 100}%`;
      star.style.left = `${Math.random() * 100}%`;

      star.style.setProperty("--randomX", Math.random() * 2 - 1);
      star.style.setProperty("--randomY", Math.random() * 2 - 1);
      star.style.setProperty("--randomDelay", Math.random() * 10);

      starsContainer.appendChild(star);
    }
  }, []);

  return <div className="stars" ref={starsRef}></div>;
}

export default Stars;
