import React from 'react';
import './App.css';
import { Button } from 'evergreen-ui';
import Layout from './components/layout';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import All from './pages/all';
import Dashboard from './pages/dashboard';
import MyForm from './components/form';
import axios from 'axios';
import Habits from './pages/habits'


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      default: [{ name: 'Loading...', text: 'Loading...' }],
      habits: [],
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
      priorities: [{name: 'Learn Fractions'}, {name:'Solving World Hunger'}, {name:'Be a better person'}],
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
    console.log(this.state.test)

    let date = new Date()
    date = date.getDate()

    events.habit.map((item, index) => {
      if ((events.habit.some(el => el.name === item.name))) {
        this.setState(state => {
          return { habits: [...state.habits, {name:item.name, done:[{checked: 0, date: date}]}] }
        })
      }
    })

  }

  addData = (text, type) => {
    console.log(text)
    let test = this.state.test
    test.habit.push({name: text, type: type})
    this.setState({
      test: test
    })
  }

  checkHabit = (text, value) => {
    this.state.test.habit.map((item, index) => {
      // if (item.done.length() === 0){
      //   this.setState(state => {
      //     let temp = [...state.habits]
      //     temp.done = [[0, date]]
      //     return { habits: temp }
      //   })
      // } 

    })
  }

  changeData = (data, updatedValue, deleteTrue) => {

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
                addedData={this.state.addedData} 
                changeData={this.changeData}/>
            )} />
            <Route path="/test" component={MyForm} />
            <Route path="/habits" render={(props) => (
              <Habits habits={this.state.habits}/>
            )} />

          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
