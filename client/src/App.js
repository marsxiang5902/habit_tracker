'use strict'

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
      addedData: [],
      todos: [
        { name: 'Pick up groceries', done: 1 },
        { name: 'Buy Google', done: 0 },
        { name: 'Solve World Hunger', done: 0 }
      ],
      weeklyGoals: [
        { name: 'Pick up groceries', done: 1 },
        { name: 'Buy Google', done: 0 },
        { name: 'Solve World Hunger', done: 0 }
      ],
      priorities: [{ name: 'Learn Fractions' }, { name: 'Solving World Hunger' }, { name: 'Be a better person' }],
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
    const url = 'http://localhost:8080/users/mars'
    const response = await fetch(url)
    const data = await response.json()
    let events = data.events
    this.setState({ test: events })

  }

  addData = (text, type) => {
    console.log(text)
    this.setState(state => {
      return { addedData: [...state.addedData, { name: text, type: type }] }
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
                todos={this.state.test ? this.state.test.todo : this.state.default}
                weeklyGoals={this.state.weeklyGoals}
                priorities={this.state.priorities} isAuthed={true}
                addData={this.addData}
                addedData={this.state.addedData} />
            )} />
            <Route path="/test" component={MyForm} />

          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
