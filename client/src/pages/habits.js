import React, { useContext } from 'react';
import { appContext } from '../context/appContext';
import '../static/page.css'
import Layout from '../components/layout';
import { checkHabit } from '../components/helperFunctions';

function Habits(props) {
    let context = useContext(appContext)
    let habits = context.timedEvents.habit
    return (
        <>
            <Layout name="🗺 THE LITTLE THINGS" handleLogout={props.handleLogout}>
            </Layout>
            {habits.map((item, index) => {
                return (
                    <div className="habit-card" key={index}>
                        <input type="checkbox" className="checkbox"
                            checked={item.history[0]}
                            onChange={async(e) => (props.setContext(await checkHabit(context, e.target.checked, index)))}>
                        </input>

                        <div className="habit">
                            <h5 style={{ marginBottom: "0px" }}>{item.name}</h5>
                        </div>
                    </div>
                );
            })}
        </>
    )
}

export default Habits;