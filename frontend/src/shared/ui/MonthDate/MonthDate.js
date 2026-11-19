import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import styles from "./MonthDate.module.css";
import { Form } from "react-bootstrap";
import { useRef } from "react";

const MonthDate = ({ month, onChange, type = "month" }) => {
  const inputRef = useRef();

  const openPicker = () => {
    if (inputRef.current) {
      inputRef.current.showPicker(); // ← هنا السحر الحقيقي
    }
  };

  return (
    <div className={styles.wrapper}>
      <Form.Control
        ref={inputRef}
        type={type}
        value={month}
        onChange={onChange}
        className={styles.monthInput}
      />

      <FontAwesomeIcon
        icon={faCalendar}
        className={styles.icon}
        onClick={openPicker}
      />
    </div>
  );
};

export default MonthDate;
