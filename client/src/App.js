'use strict'

import React from 'react';
import './App.css';
import { Button } from 'evergreen-ui';
import Layout from './components/layout';
import { Route, Switch, withRouter } from 'react-router-dom';
import All from './pages/all';
import Dashboard from './pages/dashboard';
import MyForm from './components/form';
import axios from 'axios';
import Habits from './pages/habits'
import Signup from './auth/Signup';
import Login from './auth/Login';
import { defaultSessionContext, sessionContext } from './auth/sessionContext'
import jwt from 'jsonwebtoken';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      default: [{ name: 'Loading...', text: 'Loading...' }],
      loading: true,
      habits: [],
      todos: [],
      weeklyGoals: [
        { name: 'Pick up groceries', done: 1 },
        { name: 'Buy Google', done: 0 },
        { name: 'Solve World Hunger', done: 0 }
      ],
      priorities: [{ name: 'Learn Fractions' }, { name: 'Solving World Hunger' }, { name: 'Be a better person' }],
      test: null,
      session: defaultSessionContext
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
    return;
    const url = 'http://localhost:8080/users/mars'
    const response = await fetch(url)
    const data = await response.json()
    let events = data.data.eventLists
    this.setState({ test: events })
    console.log(this.state.test)

    events.habit.map(async (item, index) => {
      const habitUrl = `http://localhost:8080/events/${item}`
      const habitResponse = await fetch(habitUrl)
      const habitData = await habitResponse.json()
      let habits = this.state.habits
      habits.push(habitData.data)
      this.setState({ habits: habits, loading: false })
    })

    events.todo.map(async (item, index) => {
      const todoUrl = `http://localhost:8080/events/${item}`
      const todoResponse = await fetch(todoUrl)
      const todoData = await todoResponse.json()
      let todos = this.state.todos
      todos.push(todoData.data)
      this.setState({ todos: todos, loading: false })
    })

    // let date = new Date()
    // date = date.getDate()

    // events.habit.map((item, index) => {
    //   if ((events.habit.some(el => el.name === item.name))) {
    //     this.setState(state => {
    //       return { habits: [...state.habits, {name:item.name, done:[{checked: 0, date: date}]}] }
    //     })
    //   }
    // })

  }

  addData = async (text, type) => {
    if (type === "Habit") {
      let habits = this.state.habits
      habits.push({ user: 'mars', name: text, type: "habit" })
      this.setState({ habits: habits })
    }

    if (type === "Todo") {
      let data = { user: "mars", name: text, type: "todo" }
      let todos = this.state.todos
      todos.push(data)
      this.setState(todos)

      const url = 'http://localhost:8080/events/'
      const post = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data)
      })
    }

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

  handleLogin = token => {
    if (token) {
      let decoded = jwt.decode(token)
      if ('user' in decoded && 'perms' in decoded) {
        this.setState({
          session: {
            isAuthed: true,
            jwt: token,
            user: decoded.user,
            perms: decoded.perms
          }
        })
        this.props.history.push('/')
      }
    }
  }

  handleLogout = () => {
    console.log('here')
    this.setState({ session: defaultSessionContext })
    this.props.history.push('/')
  }

  render() {
    return (
      <sessionContext.Provider value={this.state.session}>
        <div className="App">
          <Layout name="🗺 THE PLAN" handleLogout={this.handleLogout} />
          <Switch>
            <Route path="/" exact component={Dashboard} />
            <Route path="/editor" render={(props) => (
              <All habits={!this.state.loading ? this.state.habits : this.state.default}
                todos={!this.state.loading ? this.state.todos : this.state.default}
                weeklyGoals={this.state.weeklyGoals}
                priorities={this.state.priorities} isAuthed={true}
                addData={this.addData}
                addedData={this.state.addedData}
                changeData={this.changeData} />
            )} />
            <Route path="/test" component={MyForm} />
            <Route path="/habits" render={(props) => (
              <Habits habits={this.state.habits} />
            )} />
            <Route path="/signup">
              <Signup handleLogin={this.handleLogin} />
            </Route>
            <Route path="/login">
              <Login handleLogin={this.handleLogin} />
            </Route>

          </Switch>
        </div>
      </sessionContext.Provider>
    );
  }
}
export default withRouter(App);
