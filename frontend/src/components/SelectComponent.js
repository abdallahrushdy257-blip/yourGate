import React, { useState } from "react";
import Select from "react-select";

function SelectComponent({
  className,
  placeholder,
  label,
  containerStyle,
  labelStyle,
  selectStyle,
  options,
  value,
  onChange,
}) {
  const [selectedOption, setSelectedOption] = useState(value);

  const handleChange = (selected) => {
    setSelectedOption(selected);
    if (onChange) {
      onChange(selected);
    }
  };

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      color: "black", 
      backgroundColor: state.isSelected
        ? "var(--buttonbackgroundhover-color)"
        : state.isFocused
        ? "var(--hover-bg-color)"
        : "transparent",
    }),
    control: (provided) => ({
      ...provided,
      ...selectStyle,
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "black", 
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "black", 
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
  };
  

  return (
    <div className="select-component-container responParent" style={containerStyle}>
      {label && <label style={labelStyle}>{label}</label>}
      <Select
        options={options}
        className={`${className} select-component w-100`}
        classNamePrefix="select-component-prefix"
        styles={customStyles}
        value={selectedOption ? selectedOption : value}
        onChange={handleChange}
        menuPortalTarget={document.body} 
      />
    </div>
  );
}

export default SelectComponent;
