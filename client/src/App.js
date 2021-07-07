import React from 'react';
import './App.css';
import { Button } from 'evergreen-ui';
import Layout from './components/layout';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import All from './pages/all';
import Dashboard from './pages/dashboard';
import MyForm from './components/form';
import axios from 'axios';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      default: [{ name: 'Loading...', text: 'Loading...' }],
      // habits: [
      //   { name: 'Mediatation', done: [1, 1, 0], description: "Sit Down, Think, and Be Mindful" },
      //   { name: 'Workout', done: [0, 0, 0, 1], description: "Look Good = Feel Good" },
      //   { name: 'Journaling', description: "Become Aware of the Little Things" },
      // ],
      addedHabits: [],
      todos: [
        { text: 'Pick up groceries', done: 1 },
        { text: 'Buy Google', done: 0 },
        { text: 'Solve World Hunger', done: 0 }
      ],
      weeklyGoals: [
        { text: 'Pick up groceries', done: 1 },
        { text: 'Buy Google', done: 0 },
        { text: 'Solve World Hunger', done: 0 }
      ],
      priorities: ['Learn Fractions', 'Solving World Hunger', 'Be a better person'],
      test: null,
    })
  }

  // config = { headers: { "Access-Control-Allow-Origin": "*" } }
  // async componentDidMount() {
  //   this.setState({
  //     habitsTest: await ((await fetch('http://localhost:8080/users/events/mars', this.config)).json())
  //   });
  //   console.log(this.state.habitsTest)
  // }

  // async componentDidMount(){
  //   const data = await axios.get('http://localhost:8080/users/events/mars').then(res => {
  //     return res.data
  //   })
  //   this.setState({
  //     test: await data
  //   })
  //   console.log(this.state.test.habit)
  // }

  async componentDidMount() {
    const url = 'http://localhost:8080/user/mars'
    const response = await fetch(url)
    const data = await response.json()
    let events = data.events
    this.setState({ test: events })

  }

  addHabit = (text) => {
    console.log(text)
    console.log(this.state.addedHabits)
    this.setState(state => {
      return { addedHabits: [...state.addedHabits, { name: text }] }
    })
  }

  async componentWillUnmount() {
    //place url post here for state of addedHabits
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Layout name="🗺 THE PLAN">
          </Layout>
          <Switch>
            <Route path="/" exact component={Dashboard} />
            <Route path="/editor" render={(props) => (
              <All habits={this.state.test ? this.state.test.habit : this.state.default}
                todos={this.state.todos} weeklyGoals={this.state.weeklyGoals}
                priorities={this.state.priorities} isAuthed={true}
                addHabit={this.addHabit}
                addedHabits={this.state.addedHabits} />
              // <All habits={this.state.habits} todos={this.state.todos} weeklyGoals={this.state.weeklyGoals} priorities={this.state.priorities} isAuthed={true} addHabit={this.addHabit}/>
            )} />
            <Route path="/test" component={MyForm} />

          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
