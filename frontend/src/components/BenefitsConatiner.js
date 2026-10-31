import Title from "./title";

function BenefitsConatiner(props) {
  return (
    <div className="benefitsConatiner">
      <Title title={props.title} />

      <div className="benefits">
        <h4 className="benTitle">{props.benTitle}</h4>
        <p className="benDesc">
          {props.benDesc}
        </p>
      </div>
    </div>
  );
}

export default BenefitsConatiner