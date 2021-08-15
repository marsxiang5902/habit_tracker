import { Line } from 'react-chartjs-2'
import '../static/page.css'
import { Dropdown } from 'react-bootstrap'
import { DisplayHabit, HabitObject } from './HabitList'

function SideBar(props) {
    let habitObj = HabitObject(props.habits)
    return (
        <div>
            <DisplayHabit checked={habitObj.value} onChange={habitObj.edit} />
            <Dropdown>
                <Dropdown.Toggle id="dropdown-autoclose-true">
                    Y-Axis Variable
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item href="#">Menu Item</Dropdown.Item>
                    <Dropdown.Item href="#">Menu Item</Dropdown.Item>
                    <Dropdown.Item href="#">Menu Item</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <Dropdown>
                <Dropdown.Toggle id="dropdown-autoclose-true">
                    X-Axis Variable
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item href="#">Menu Item</Dropdown.Item>
                    <Dropdown.Item href="#">Menu Item</Dropdown.Item>
                    <Dropdown.Item href="#">Menu Item</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    )
}

function LineChart(props) {
    return (
        <div className="wrapper">
            <div className="data-grid">
                <div className="data-chart">
                    <Line
                        data={{
                            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                            datasets: [{
                                label: '# of Days',
                                data: [12, 19, 3, 5, 2, 3],
                                backgroundColor: [
                                    'rgba(255, 99, 132, 0.2)',
                                    'rgba(54, 162, 235, 0.2)',
                                    'rgba(255, 206, 86, 0.2)',
                                    'rgba(75, 192, 192, 0.2)',
                                    'rgba(153, 102, 255, 0.2)',
                                    'rgba(255, 159, 64, 0.2)'
                                ],
                                borderColor: [
                                    'rgba(255, 99, 132, 1)',
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(255, 206, 86, 1)',
                                    'rgba(75, 192, 192, 1)',
                                    'rgba(153, 102, 255, 1)',
                                    'rgba(255, 159, 64, 1)'
                                ],
                                borderWidth: 1
                            }]
                        }}
                        height={40}
                        width={80}
                    // options={{ maintainAspectRatio: false }}
                    >
                    </Line>
                </div>
                <SideBar habits={props.habits} />
            </div>
        </div>
    )
}

export { LineChart }