import React, { useState, useEffect, useMemo } from "react";
import Select from "react-select";

function SelectComponent({
  className = "",
  placeholder = "اختر...",
  label,
  containerStyle,
  labelStyle,
  selectStyle,
  options = [],
  value,
  onChange,
  disabled,
  isDisabled,
  error,
  id,
  isClearable = false,
  isSearchable = true,
}) {
  const resolvedValue = useMemo(() => {
    if (value && typeof value === "object" && "value" in value) {
      return value;
    }
    if (value !== undefined && value !== null && value !== "" && Array.isArray(options)) {
      return options.find((opt) => String(opt.value) === String(value)) || null;
    }
    return null;
  }, [value, options]);

  const [selectedOption, setSelectedOption] = useState(resolvedValue);

  useEffect(() => {
    setSelectedOption(resolvedValue);
  }, [resolvedValue]);

  const handleChange = (selected) => {
    setSelectedOption(selected);
    if (onChange) {
      // Create a compatible event-like object for handlers expecting (e) => e.target.value
      if (selected) {
        selected.target = {
          value: selected.value,
          name: id || "",
        };
      }
      onChange(selected);
    }
  };

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      color: "var(--text-color, #382f22)",
      backgroundColor: state.isSelected
        ? "var(--buttonbackgroundhover-color, #b89358)"
        : state.isFocused
        ? "var(--hover-bg-color, rgba(184, 147, 88, 0.1))"
        : "transparent",
      textAlign: "right",
      fontFamily: "inherit",
      cursor: "pointer",
    }),
    control: (provided, state) => ({
      ...provided,
      ...selectStyle,
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "var(--text-color, #382f22)",
      textAlign: "right",
      fontFamily: "inherit",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "var(--placeholder-color, #9c8e7c)",
      textAlign: "right",
      fontFamily: "inherit",
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 99999,
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 99999,
      backgroundColor: "var(--menu-bg-color, #ffffff)",
      borderRadius: "10px",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
    }),
  };

  return (
    <div className={`select-component-container responParent ${className}`} style={containerStyle}>
      {label && <label style={{ marginBottom: "6px", display: "block", ...labelStyle }}>{label}</label>}
      <Select
        id={id}
        options={options}
        className="select-component w-100"
        classNamePrefix="select-component-prefix"
        styles={customStyles}
        placeholder={placeholder}
        value={selectedOption}
        onChange={handleChange}
        isDisabled={Boolean(disabled || isDisabled)}
        isClearable={isClearable}
        isSearchable={isSearchable}
        menuPortalTarget={typeof document !== "undefined" ? document.body : null}
      />
      {error && (
        <span className="error-text" style={{ color: "#e53e3e", fontSize: "12px", marginTop: "4px", display: "block", textAlign: "right" }}>
          {error}
        </span>
      )}
    </div>
  );
}

export default SelectComponent;
