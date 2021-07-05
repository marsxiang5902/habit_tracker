import React from 'react';
import './App.css';
import { Button } from 'evergreen-ui';
import Layout from './components/layout';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import All from './pages/all';
import Dashboard from './pages/dashboard';
import MyForm from './components/form';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      habits: [
        { name: 'loading...' }
        // { name: 'Mediatation', done: [1, 1, 0], description: "Sit Down, Think, and Be Mindful" },
        // { name: 'Workout', done: [0, 0, 0, 1], description: "Look Good = Feel Good" },
        // { name: 'Journaling', description: "Become Aware of the Little Things" },
      ],
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
      priorities: ['Learn Fractions', 'Solving World Hunger', 'Be a better person']
    })
  }

  config = { headers: { "Access-Control-Allow-Origin": "*" } }
  async componentDidMount() {
    console.log("test")

    this.setState({
      habitsTest: await ((await fetch('http://localhost:8080/users/events/mars', this.config)).json())
    });
    console.log(this.state.habitsTest)
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
              <All habits={this.state.hasOwnProperty("habitsTest") ? this.state.habitsTest.habit : this.state.habits} todos={this.state.todos} weeklyGoals={this.state.weeklyGoals} priorities={this.state.priorities} isAuthed={true} />
            )} />
            <Route path="/test" component={MyForm} />

          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
