function SubscriptionContainer({ plans }) {
    return (
      <div className="subscriptionContainer">
        {plans.map((plan, index) => (
          <div className="subSys" key={index}>
            <div className="subText">
              <div className="subTitleCon">
                <h3 className="subtitle">{plan.title}</h3>
                <p className="subSentance">{plan.subtitle}</p>
                <p className="subPrice">{plan.price}</p>
              </div>
              <p className="subDesc">{plan.description}</p>
            </div>
            <button className="subButton">{plan.buttonText}</button>
          </div>
        ))}
      </div>
    );
  }
  
  export default SubscriptionContainer;
  