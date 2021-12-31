import React, { useContext, useEffect, useState } from "react";
import * as Icons from "react-icons/fa";
import { Link, withRouter } from "react-router-dom";
import getSidebarData from "./menu-options";
import { IconContext } from "react-icons";
import "../static/layout.css";
import '../static/page.css'
import AuthButtons from "../auth/AuthButtons";
import { appContext } from "../context/appContext";
import fetchData from "../api/fetchData";
import path from 'path';
import ReactGA from 'react-ga';
import config from "../config";
import {CreateAvatar} from './AvatarColor'
import Logo from '../static/LogoAsset 3@4x.png'
import DisplayProgress from "./ProgressBars";


ReactGA.initialize(config.google_analytics)
function Layout(props) {
    const context = useContext(appContext)
    console.log(context)

    useEffect(() => {
        ReactGA.pageview(window.location.pathname + window.location.search);
    })
    return (
        <div className="header">
            <div className="navbar">
                <Link to="#" className="menu-bars">
                    <Icons.FaBars onClick={props.showMenu} />
                </Link>
                <IconContext.Provider value={{ color: "#fff" }}>
                    <nav className={props.menu ? "nav-menu active" : "nav-menu"}>
                        <ul className="nav-menu-items">
                            <li className="navbar-toggle" onClick={props.showMenu}>
                                <Link to="#" className="menu-bars">
                                    <Icons.FaRegWindowClose />
                                </Link>
                            </li>

                            {/* Avatar */}
                            <li>
                                <div className="avatar-parent">
                                    <CreateAvatar habits={context.timedEvents.habit} />
                                    <div style={{'display': 'flex', 'flexDirection': 'column'}}>
                                        <span>{context.session.user}</span>
                                        {/* Getting daily points currently */}
                                        <span style={{'fontSize': 'small'}}>Today's Points: {context.session.pointsHistory['0']}</span>
                                    </div>
                                </div>
                            </li>

                            {/* Menu Options */}
                            {getSidebarData(context).map((item, index) => {
                                return (
                                    <li key={index} className='nav-text' onClick={window.innerWidth < 600 ? props.showMenu : null}>
                                        <Link to={path.join('/app/', item.path)}>
                                            {/* {item.icon} */}
                                            <span>{item.title}</span>
                                        </Link>
                                    </li>
                                );
                            })}

                            {/* Logout Button */}
                            <li className="nav-text">                    
                                <AuthButtons handleLogout={props.handleLogout} />
                            </li>

                            {/* Growthify Logo */}
                            <li>
                                <div className="side-logo" style={{'height': 'auto', 'paddingTop': '40%', 'width': '100%'}}>
                                    <img src={Logo} alt="" style={{"maxWidth":"50%", "height": "auto"}}/>
                                    <h2 style={{"color": "white", "fontSize": "1em", "fontWeight":"bold", "paddingTop":"10%"}}>Growthify</h2>
                                </div>
                            </li>
                        </ul>
                    </nav>
                </IconContext.Provider>
            </div>
            <div className={props.menu ? 'progress-wrapper active':'progress-wrapper'}>
                <DisplayProgress context={context}/>
            </div>
            {/* <div>
                <h1 className={menu ? "title-active" : "title"}>{props.name}</h1>
                <hr></hr>
            </div> */}
            {/* <div> */}
                {/* <h4>
                    <Icons.FaRedo className="hover button" onClick={async () => {
                        if (context.session.isAuthed) {
                            context.setContext(await fetchData(context.session.user, context.session.jwt))
                        }
                    }} />
                </h4> */}
                {/* <AuthButtons handleLogout={props.handleLogout} />
            </div> */}
        </div>
    );
}

export default withRouter(Layout);
