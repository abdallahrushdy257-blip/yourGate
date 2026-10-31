import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "./title";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

function LandingInfo({ text , title }) {
  return (
    <div className="infoContainer">
      <Title title={title} />
      <div className="textContainer">
        {text.map((item, index) => (
          <div className="infoText" key={index}>
            <div className="iconCreateContainer">
              <FontAwesomeIcon icon={faCheck} className="infoCheck" />
            </div>
            <p className="infoBody">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LandingInfo;
