import { Form } from "react-bootstrap";
import React, { useRef } from "react";

function KpiTextbox(props) {
  const inputRef = useRef();

  const handleInput = (event) => {
    const element = inputRef.current;
    if (element) {
      element.style.height = "auto"; 
      element.style.height = `${element.scrollHeight}px`; 
    }
    if (props.onChange) {
      props.onChange(event);
    }
  }; 

  return (
    <Form.Group
      className="mb-3 responParent"
      controlId={props.id}
      style={{ ...props.parentStyle }}
    >
      <Form.Label className="register-label" >
          {props.label}
        </Form.Label>
      <div style={{ ...props.styleeParent, display: "flex", alignItems: "center" }}>
        
        <Form.Control
          as="textarea" 
          ref={inputRef}
          className="register-textbox"
          style={{
            ...props.stylee,
            flex: "1",
            textAlign: props.align,
            resize: "none", 
            overflow: "hidden", 
            height: "auto",
            minHeight: "30px",
          }}
          value={props.value}
          onChange={handleInput}
          disabled={props.disabled}
          onBlur={props.onBlur}
          rows={1} 
        />
      </div>
    </Form.Group>
  );
}

export default KpiTextbox;
