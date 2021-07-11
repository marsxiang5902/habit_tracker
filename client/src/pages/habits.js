import React, {useEffect} from 'react';
import { Checkbox } from 'evergreen-ui';

function Habits(props){

    return(
        <>
            {props.habits.map((item, index) => {
                        return (
                            <div className="habit-card">
                                <Checkbox
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