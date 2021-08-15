import React, { useContext } from 'react';
import { appContext } from '../context/appContext';
import '../static/page.css'
import Layout from '../components/layout';
import { updateEventHistory } from '../services/eventServices';
import { getAllEvents } from '../lib/locateEvents';

function Habits(props) {
    const context = useContext(appContext)
    let allEvents = getAllEvents(context)
    return (
        <div className="wrapper">
            <Layout name="🗺 THE LITTLE THINGS" handleLogout={props.handleLogout} />
            {Object.keys(allEvents).map(_id => {
                let record = allEvents[_id]
                if (record.type === 'todo') {
                    return null
                }
                let checked = false
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
        </div>
    )
}

export default Habits;