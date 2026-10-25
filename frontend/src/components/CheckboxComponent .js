import React, { useState } from "react";

const CheckboxComponent = ({
  label,
  id,
  type = "checkbox",
  name,
  value,
  checked,
  onChange,
  className,
  inline,
}) => {
  return (
    <div className={`form-check ${inline ? "form-check-inline" : ""}` + className}>
      <input
        className="form-check-input prepolable2"
        type={type}
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <label className="form-check-label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
};

export default CheckboxComponent;
