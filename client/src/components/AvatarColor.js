import '../static/page.css'
import { streaks } from '../lib/dataServices'

function determineColor(habits){
    //get curr max streak and decide color based on streak
    let streak = streaks(habits).curr.value;
    //blue
    if (streak < 1){
        return 0;
    }
    //yellow
    if (streak < 4){
        return 1;
    }
    //orange
    if (streak < 6){
        return 2;
    }
    //red
    if (streak < 8){
        return 3;
    }
    //gradient
    if (streak > 7){
        return 4;
    }
}

function CreateAvatar(props){
    let result = determineColor(props.habits)
    let colors = ['#46e7fc', '#fcf546', '#fc9a46', '#f11010', 'linear-gradient(240deg, rgb(255,87,87) 0%, rgb(62, 136, 255) 100%)']
    return(
        <div style={{'width': '35px', 'height': '35px', 'borderRadius': '50%', 'backgroundColor': colors[result], 'background': colors[result]}}>

        </div>
    )
    

}

export {determineColor, CreateAvatar}
