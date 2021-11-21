import React from "react";
import "./header.css";

const Header = () => {
  return (
    <div class="header">
      <a href="#default" class="logo">
        Ascend capital
      </a>
      <div class="header-right">
        <a class="active" href="#home">
          EMI calculator
        </a>
      </div>
    </div>
  );
};

export default Header;
