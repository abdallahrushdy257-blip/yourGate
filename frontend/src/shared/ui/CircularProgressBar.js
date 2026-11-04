import React, { useState, useEffect, useRef } from "react"; 
import PropTypes from "prop-types";

const CircularProgressBar = ({
  percentage, 
  size = 150,
  strokeWidth = 25,
  bgColor = "#37474F",
  progressColor = "#4CAF50",
  textColor = "#FFFFFF",
  title = "",
  shadowColor = "rgba(0, 0, 0, 0.35)",
  shadowOffsetY = "5px",
  shadowBlur = "10px",
  useGradient = true,
  gradientStartColor = "#81C784",
  gradientEndColor = "#388E3C",
  animationDuration = 1000, 
  animationDelay = 0,
}) => {
  const [currentPercentage, setCurrentPercentage] = useState(0);
  const requestRef = useRef(); 
  const startTimeRef = useRef(); 

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (currentPercentage / 100) * circumference;

  useEffect(() => {
    const animate = (timestamp) => {
      if (startTimeRef.current === undefined) {
        startTimeRef.current = timestamp + animationDelay;
      }

      const elapsed = Math.max(0, timestamp - startTimeRef.current);

      const progress = Math.min(1, elapsed / animationDuration);

      const nextPercentage = progress * percentage; 

      setCurrentPercentage(nextPercentage);

      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        setCurrentPercentage(percentage);
      }
    };

    startTimeRef.current = undefined; 
    setCurrentPercentage(0); 

    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [percentage, animationDuration, animationDelay]); 

  const gradientId = `progressGradient-${size}-${percentage}`;

  const svgRotateStyle = {
    transform: "rotate(-90deg)",
    transformOrigin: "center center",
  };
  const textStyle = {
    fill: textColor,
    fontSize: `${size * 0.2}px`,
    fontWeight: "bold",
     dominantBaseline: "middle",
    textAnchor: "middle",
    transition: "fill 0.3s ease", 
  };
  const titleStyle = {
    textAlign: "center",
    marginBottom: "10px",
    fontSize: "1.1em",
    color: textColor,
    fontFamily: "sans-serif",
  };
  const containerStyle = {
    display: "inline-block",
    padding: "20px",
  };
  const svgShadowStyle = {
    filter: `drop-shadow(0 ${shadowOffsetY} ${shadowBlur} ${shadowColor})`,
    overflow: "visible",
  };

  const progressStrokeColor = useGradient
    ? `url(#${gradientId})`
    : progressColor;

  return (
    <div style={containerStyle}>
      {title && <div style={titleStyle}>{title}</div>}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={svgShadowStyle}
      >
        {useGradient && (
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={gradientStartColor} />
              <stop offset="100%" stopColor={gradientEndColor} />
            </linearGradient>
          </defs>
        )}

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={progressStrokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset} 
          strokeLinecap="round"
          style={svgRotateStyle}
        />

        <text x="50%" y="50%" style={textStyle}>
          {`${Math.round(currentPercentage)}%`}
        </text>
      </svg>
    </div>
  );
};

CircularProgressBar.propTypes = {
  percentage: PropTypes.number.isRequired,
  size: PropTypes.number,
  strokeWidth: PropTypes.number,
  useGradient: PropTypes.bool,
  gradientStartColor: PropTypes.string,
  gradientEndColor: PropTypes.string,
  animationDuration: PropTypes.number, 
  animationDelay: PropTypes.number,
};

export default CircularProgressBar;
