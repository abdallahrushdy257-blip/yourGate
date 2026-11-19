import React, { useContext } from "react";
import CountValue from "./count-value";
<<<<<<< HEAD
import { ThemeContext } from "../../../app/providers/theme-context";
=======
import { ThemeContext } from "../../../context/theme-context";
>>>>>>> 6dd3331de590899fc05b1df69047e8f83980c401

function Header({ counter }) {
  const { theme } = useContext(ThemeContext);

  return (
    <div>
      The header
      <CountValue />
      The theme is {theme}
    </div>
  );
}

export default Header;
