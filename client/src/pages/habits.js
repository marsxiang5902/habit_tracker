import React, {useEffect} from 'react';
import { Checkbox } from 'evergreen-ui';

function Habits(props){

    return(
        <>
            {props.habits.map((item, index) => {
                let done = item.done[(item.done.length) - 1]
                if (done == 0) {
                    done = false
                }
                else {
                    done = true
                }
                        return (
                            <div className="habit-card">
                                <Checkbox
                                    checked={done}
                                    // onChange={e => setChecked(e.target.checked)}
                                    />
                                    <div className="habit" key={index}>
                                        <h5 style={{marginBottom: "0px"}}>{item.name}</h5>
                                    </div>
                            </div>
                        );
            })}
        </>
    )
}

export default Habits;