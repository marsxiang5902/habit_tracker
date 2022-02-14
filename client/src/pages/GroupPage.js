import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { appContext } from "../context/appContext";
import { getGroupData } from "../services/groupServices";
import '../static/page.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import context from "react-bootstrap/esm/AccordionContext";


function GroupUser(props) {
    let user = props.user, pointsHistory = props.pointsHistory, events = props.events
    console.log(pointsHistory, events)
    return <div className="groups-user-item">
        <h3>{user}</h3>
        <div>
            {`${Object.values(pointsHistory).reduce((x, y) => x + y)} point(s)`}
        </div>
    </div>
}

export default function GroupPage(props) {
    let { groupId } = useParams()
    let context = useContext(appContext)
    let [groupRecord, setGroupRecord] = useState(null)
    useEffect(() => {
        if (groupRecord === null) {
            (async () => {
                setGroupRecord(await getGroupData(context, groupId))
            })()
        }
    }, [groupId])
    return <>
        <Link className="link-black" to={props.back}>Back</Link>
        <div className="dashboard">

            {groupRecord === null ? null : Object.keys(groupRecord).length === 0 ? "error" :
                Object.keys(groupRecord).map(user => <GroupUser user={user} pointsHistory={groupRecord[user].pointsHistory} events={groupRecord[user].events} />)}
        </div>
    </>
}