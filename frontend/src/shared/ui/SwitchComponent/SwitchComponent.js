import { useState } from "react";
import "./switchcomponent.css"; // لو عندك CSS الخاص بالـ switch

function SwitchComponent({checked, setChecked}) {

  return (
    <div>
      <label className="switcher">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => setChecked(!checked)}
        />
        <span className="sliderer"></span>
      </label>
    </div>
  );
}

export default SwitchComponent;
