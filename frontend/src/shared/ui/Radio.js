import { Form } from "react-bootstrap";

function RegisterRadio(props) {
  const id = props.id || `radio-${props.value}`;

  return (
    <div className="mb-3">
      <Form.Check
        id={id}
        inline
        label={props.label}
        name={props.name ? props.name : 'name'}
        type="radio"
        className="createManage-redio"
        value={props.value}
        onChange={props.onChange}
        defaultChecked={props.defaultChecked}
        
        checked={props.checked}
      />
    </div>
  );
}

export default RegisterRadio;
