import { useState } from "react";
import Title from "./title";

function OurSystemContainer({ items }) {
  const [index, setIndex] = useState(0);

  const next = () => {
    setIndex((prev) => (prev + 1) % items.length);
  };

  return (
    <div className="ourSystemContainer">
      <Title title="نظامنا" />

      <div className="carouselWrapper">
        <div
          className="carouselTrack"
          style={{
            transform: `translateX(-${index * 50}%)`,
          }}
        >
          {items.map((item, i) => (
            <div key={i} className="ourSystemcard">
              {item.price && <h6 className="ourPrice">{item.price}</h6>}
              <h5 className="ourSystext">{item.text}</h5>
              {item.list && <p className="ourNote">{item.list.map((item, i) => <li key={i}>{item}</li>)}</p>}
            </div>
          ))}
        </div>
      </div>

      <button className="carouselBtn" style={{background:"transparent" , color:"var(--text-color)"}} onClick={next}>&#62;</button>
    </div>
  );
}

export default OurSystemContainer;
