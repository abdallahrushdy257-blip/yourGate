import { useState, useEffect } from "react";
import "../CreateLoan/createLoan.css";

import "./addBeneficiary.css";

import ForBenefitAdding from "./PartsOfBenefitAddDetails/ForBenefitAdding";
import ForBenefitBank from "./PartsOfBenefitAddDetails/ForBenefitBank";
import ForBenefitQualificationPosition from "./PartsOfBenefitAddDetails/ForBenefitQualificationPosition";
import ForBenefitHousingData from "./PartsOfBenefitAddDetails/ForBenefitHousingData";
import ForBenefitHealthData from "./PartsOfBenefitAddDetails/ForBenefitHealthData";
import ForBenefitDependentsData from "./PartsOfBenefitAddDetails/ForBenefitDependentsData";
import { useParams } from "react-router-dom";

function BenefitAddDetails({handleDataSubmit}) {
  const tabs = [
    "mainbeneficiarydata",
    "bankdata",
    "qualificationposition",
    "housingdata",
    "healthdata",
    "dependentsdata",
  ];

  const {code} = useParams();
 
  const [myid , setMyid] = useState('');
  const [activeTab, setActiveTab] = useState("mainbeneficiarydata");
  const [error, setError] = useState([]);
  const { id } = useParams();
  const [iddate, setIddate] = useState(new Date().toISOString().substr(0, 10));


  

 

  const handleNext = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };





  const renderContent = () => {
    switch (activeTab) {
      case "mainbeneficiarydata":
        return (
           <ForBenefitAdding
      tabs={tabs}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onNext={handleNext} 
      onDataSubmit={handleDataSubmit} 
    />
        );
      case "bankdata":
        return (
            <ForBenefitBank onNext={handleNext} />
        );
      case "qualificationposition":
        return (
          <>
            <ForBenefitQualificationPosition onNext={handleNext}/>
          </>
        );
      case "housingdata":
        return (
          <>
            <ForBenefitHousingData onNext={handleNext}/>
          </>
        );
      case "healthdata":
        return (
          <>
            <ForBenefitHealthData onNext={handleNext}/>
          </>
        );
      case "dependentsdata":
        return (
          <>
            <ForBenefitDependentsData onNext={handleNext}/>
          </>
        );
      default:
        return null;
    }
  };


  // New
 

  return  (
    <>
      

      <div className="createloan">
        <form>
          <div className="divre">
            <div className="myTabs myTabs2" style={{ direction: "rtl" }}>
               
              {tabs.map((tab, index) => (
                <button
                  
                  key={index}
                  className={`loantab ${
                    activeTab === tab ? "active" : ""
                  } loantab2`}
                  //onClick={() => setActiveTab(tab)}
                  type="button"
                >
                  {tab === "mainbeneficiarydata"
                    ? "1"
                    : tab === "bankdata"
                    ? "2"
                    : tab === "qualificationposition"
                    ? "3"
                    : tab === "housingdata"
                    ? "4"
                    : tab === "healthdata"
                    ? "5"
                    : tab === "dependentsdata"
                    ? "6"
                    : ""}
                </button>
              ))}
            </div>
            <div className="line"></div>
          </div>
          <div className="tabContent">{renderContent()}</div>

          {/* <div className="navigationButtons">
            <button
              className=" loanbtn nextButton"
              onClick={handleNext}
              disabled={tabs.indexOf(activeTab) === tabs.length - 1}
              type="button"
            >
              حفظ
            </button>
            
          </div> */}
        </form>
      </div>
    </>
  );
}

export default BenefitAddDetails;
