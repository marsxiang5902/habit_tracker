import React, { useContext } from 'react';
import { appContext } from '../context/appContext';
import '../static/page.css'
import Layout from '../components/layout';
import { updateEventHistory } from '../services/eventServices';
import { getAllEvents } from '../lib/locateEvents';
import noCheckedHistory from '../lib/noCheckedHistory';

function Habits(props) {
    const context = useContext(appContext)
    let allEvents = getAllEvents(context)
    return (
        <div className="wrapper">
            <Layout name="🗺 THE LITTLE THINGS" handleLogout={props.handleLogout} />
            {Object.keys(allEvents).map(_id => {
                let record = allEvents[_id]
                if (noCheckedHistory.has(record.type)) {
                    return null
                }
                let checked = false
                if (('checkedHistory' in record) && ('0' in record.checkedHistory)) {
                    checked = record.checkedHistory['0'];
                }
                return <div className="habit-list margin-middle" key={_id}>
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