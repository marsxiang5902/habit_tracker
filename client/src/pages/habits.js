import React, {useEffect, useState} from 'react';
import { Checkbox } from 'evergreen-ui';
import '../static/page.css'

function Habits(props){


    return(
        <>
            {props.habits.map((item, index) => {
                    return (
                        <div className="habit-card" key={index}>
                            <Checkbox
                                checked={item.completion[0]}
                                onChange={e => (props.checkHabit(e.target.checked, index))}
                            />
                            <div className="habit">
                                <h5 style={{marginBottom: "0px"}}>{item.name}</h5>
                            </div>
                        </div>
                    );
            })}
        </>
    )
}

export default Habits;