import React, {useEffect, useState} from 'react';
import '../static/page.css'

function Habits(props) {
    return(
        <>
            {props.habits.map((item, index) => {
                console.log(item)
                    return (
                        <div className="habit-card" key={index}>
                            <input type="checkbox" className="checkbox"
                                checked={item.completion[0]}
                                onChange={e => (props.checkHabit(e.target.checked, index))}>
                            </input>
                            
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