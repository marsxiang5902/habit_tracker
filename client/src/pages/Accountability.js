import React, { useContext } from "react";
import { appContext } from "../context/appContext";
import '../static/page.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from "../components/layout";


export default function Accountability(props) {
    let context = useContext(appContext)
    let partnerUndone = context.partnerUndone

    let allUndone = []
    for (let type in partnerUndone) {
        for (let name of partnerUndone[type]) {
            allUndone.push(name)
        }
    }

    return (
        <div className="wrapper">
            <Layout name="🗺 THE USER" handleLogout={props.handleLogout} menu={props.menu} showMenu={props.showMenu}/>
            <div className="dashboard">
                <div class="fullheader">
                    <h2>{`${context.session.partner}'s Undone Events`}</h2>
                </div>

                {allUndone.map((name, idx) => (
                    <div className="card-2 border-2" key={idx}>
                        <div className="habit habit-2 inline">
                            <h5 className="habit no-padding-top">{name}</h5>
                        </div>
                    </div>))}

            </div>
        </div>
    );

}