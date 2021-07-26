import React, { useState } from "react";
import * as Icons from "react-icons/fa";
import { Link } from "react-router-dom";
import { SidebarData } from "./menu-options";
import { IconContext } from "react-icons";
import "../static/layout.css";
import AuthButtons from "../auth/AuthButtons";

function Layout(props) {
    const [menu, setMenu] = useState(false);

    const showMenu = () => {
        setMenu(!menu);
    };
    return (
        <div className="header">
            <div className="navbar">
                <Link to="#" className="menu-bars">
                    <Icons.FaBars onClick={showMenu} />
                </Link>
                <IconContext.Provider value={{ color: "#fff" }}>
                    <nav className={menu ? "nav-menu active" : "nav-menu"}>
                        <ul className="nav-menu-items" onClick={showMenu}>
                            <li className="navbar-toggle">
                                <Link to="#" className="menu-bars">
                                    <Icons.FaRegWindowClose />
                                </Link>
                            </li>
                            {SidebarData.map((item, index) => {
                                return (
                                    <li key={index} className={item.cName}>
                                        <Link to={item.path}>
                                            {item.icon}
                                            <span>{item.title}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </IconContext.Provider>
            </div>
            <div>
                <h1 className={menu ? "title-active" : "title"}>{props.name}</h1>
                <hr></hr>
            </div>
            <AuthButtons handleLogout={props.handleLogout} />
        </div>
    );
}

export default Layout;
