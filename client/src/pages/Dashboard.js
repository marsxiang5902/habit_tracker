import Layout from "../components/layout";
import DisplayProgress from "../components/ProgressBars";
import { Now, NowTime } from "./Now";

function Dashboard(props){
    return (
        <div className='wrapper'>
            <Layout name="You Improve x% Today" handleLogout={props.handleLogout} menu={props.menu} showMenu={props.showMenu}></Layout>
            <NowTime />
        </div>
    )
}

export default Dashboard;