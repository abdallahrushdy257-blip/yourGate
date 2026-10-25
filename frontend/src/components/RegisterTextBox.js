import { Form } from "react-bootstrap";
import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import 'react-datepicker/dist/react-datepicker.css';
import 'react-datepicker/dist/react-datepicker.module.css';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';


function RegisterTextbox(props) {

  return (
    <Form.Group
      className="responParent"
      controlId={props.id}
      style={{ ...props.parentStyle }}
    >
      {props.isDropdown ? (
        <Form.Select
          className="register-label-dropdown"
          value={props.labelValue}
          onChange={props.onLabelChange}
          style={{ marginBottom: "10px", ...props.labelStyle }}
        >
          {props.labelOptions?.map((option, index) => (
            <option
              key={index}
              value={option.value}
              className="register-option-dropdown"
            >
              {option.label}
            </option>
          ))}
        </Form.Select>
      ) : (

        <Form.Label className="register-label" style={{ ...props.labelStyle,direction:"rtl" }}>
          {props.label} {props.required && <span style={{ color: 'red' }}>*</span>}
        </Form.Label>
      )}

      <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
        {props.prefix && (
          <span
            style={{
              color: "var(--text-color)",
              // border: "3px solid var(--border-color)",
              // borderRadius: "20px",
              padding: "8px",
              fontSize: "16px",
              marginRight: "10px",
              position: "absolute",
              left: props.customPrefixLeft ? props.customPrefixLeft : "10px",
            }}
          >
            {props.flag && (
              <img
                src={props.flag}
                alt="flag"
                width="25px"
                style={{ marginRight: "5px" }}
              />
            )}
            {props.prefix}
          </span>
        )}

        {props.type === "date" ? (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={props.format === "YYYY" ? "YYYY" : "DD-MM-YYYY"}
              value={props.value ? dayjs(props.value) : null}
              onChange={(newValue) => {
                if (props.onChange) {
                  const formattedValue = newValue && newValue.isValid() 
                    ? newValue.format(props.format === "YYYY" ? "YYYY" : "YYYY-MM-DD") 
                    : newValue;
                  props.onChange({
                    target: {
                      value: formattedValue,
                      id: props.id,
                      name: props.id
                    }
                  });
                }
              }}
              format={props.format ? props.format : "DD-MM-YYYY"}
              slotProps={{
                textField: {
                  style: { ...props.stylee, flex: "1"},
                },
              }}

            />
          </LocalizationProvider>
        ) : (
          // add foucs prop
          <Form.Control
            type={props.type}

            className="register-textbox"
            style={{
              ...props.stylee,
              flex: "1",
              textAlign: props.align,
            }}
            value={props.value}
            onChange={props.onChange}
            disabled={props.disabled}
            onBlur={props.onBlur}
            placeholder={props.placeholder}
            max={props.max}
            min={props.type === "number" ? 0 : undefined}
            autoFocus={props.autoFocus}
            step={props.step}
            
          />

        )}
      </div>
      {props.error && (
        <span className="error" >
          {props.error}
        </span>
      )}
    </Form.Group>
  );
}

export default RegisterTextbox;