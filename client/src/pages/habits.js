import React, { useContext } from 'react';
import { appContext } from '../context/appContext';
import '../static/page.css'
import Layout from '../components/layout';
import { updateEventHistory } from '../services/eventServices';

function Habits(props) {
    let context = useContext(appContext)
    let habits = context.timedEvents.habit
    return (
        <>
            <Layout name="🗺 THE LITTLE THINGS" handleLogout={props.handleLogout} />
            {Object.keys(habits).map(_id => {
                let record = habits[_id], checked = false
                if (('history' in record) && ('0' in record.history)) {
                    checked = record.history['0'];
                }
                return <div className="habit-card" key={_id}>
                    <input type="checkbox" className="checkbox"
                        checked={checked}
                        onChange={async (e) => (props.setContext(await updateEventHistory(context, record, { 0: e.target.checked })))}>
                    </input>

                    <div className="habit">
                        <h5 style={{ marginBottom: "0px" }}>{record.name}</h5>
                    </div>
                </div>
            }
            )}
        </>
    )
}

export default Habits;