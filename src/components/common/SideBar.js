import React, { useEffect } from "react";
import "./SideBar.css";

function SideBar() {
  // SideBar mobile process
  // useEffect(() => {
  //   const parentMenu = document.getElementsByClassName("has-submenu");

  //   const subMenu = document.querySelectorAll("li.has-submenu > div.submenu");
  //   console.log("Parent menu: ", parentMenu.length);
  //   if (parentMenu.length) {
  //     for (let i = 0; i < parentMenu.length; i++) {
  //       parentMenu[i].addEventListener("click", function (event) {
  //         event.preventDefault();
  //         console.log("click");
  //         if (subMenu.length >= i) {
  //           subMenu[i].style.display =
  //             subMenu[i].style.display === "block" ? "none" : "block";
  //         }
  //       });
  //     }
  //   }
  // }, []);

  // function hdlShowSubMenu(event) {
  //   event.preventDefault();
  //   console.log("click parent menu");
  // }

  return (
    <div className="sidebar">
      <h3>Menu</h3>
      <ul className="sidebar_ul">
        <li className="sidebar_li">
          <a href="#">Menu1</a>
        </li>
        <li className="sidebar_li has-submenu">
          <a href="#">Menu2</a>
          <div className="submenu">
            <a href="#">Sub item 2.1</a>
            <a href="#">Sub item 2.2</a>
            <a href="#">Sub item 2.3</a>
          </div>
        </li>
        <li className="sidebar_li has-submenu">
          <a href="#">Menu3</a>
          <div className="submenu">
            <a href="#">Sub item 3.1</a>
            <a href="#">Sub item 3.2</a>
            <a href="#">Sub item 3.3</a>
          </div>
        </li>
        <li className="sidebar_li">
          <a href="#">Menu4</a>
        </li>
      </ul>
    </div>
  );
}

export default SideBar;
