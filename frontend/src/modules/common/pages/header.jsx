import React, { useContext } from "react";
import CountValue from "./count-value";
import { ThemeContext } from "../../context/theme-context";

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
