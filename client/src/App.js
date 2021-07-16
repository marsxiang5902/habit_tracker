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
import Cues from './pages/cues';
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
      cues: [
        { habitId: "60e89e88f7486f49781951aa", link: "https://i.ytimg.com/vi/uwMGMEYYFZw/maxresdefault.jpg", type: "image" },
        { habitId: "60e892b8855b3f1b0c44dc5a", link: "https://api.memegen.link/images/custom/_/my_background.png?background=https://deadline.com/wp-content/uploads/2016/12/walt-disney-studios.png", type: "image" },
        { habitId: "60e892bf855b3f1b0c44dc5b", link: "https://soundcloud.com/seratostudio/doms-demise?in=seratostudio/sets/concert-hall-vol-1", type: "music" },
        { habitId: "60e89e88f7486f49781951aa", link: "https://open.spotify.com/track/2zQl59dZMzwhrmeSBEgiXY?si=db6cc9af8b4d4bce", type: "music" },
        { habitId: "60e89e88f7486f49781951aa", link: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/662143949&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true", type: "music" },
      ],
      name: "",
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
    const url = 'http://localhost:8080/users/mars'
    const response = await fetch(url)
    const data = await response.json()
    let events = data.data.eventLists

    events.habit.map(async (item, index) => {
      const habitUrl = `http://localhost:8080/events/${item}`
      const habitResponse = await fetch(habitUrl)
      const habitData = await habitResponse.json()
      const habitHistoryUrl = `http://localhost:8080/events/${item}/history`
      const habitHistoryResponse = await fetch(habitHistoryUrl)
      const habitHistoryData = await habitHistoryResponse.json()
      let habits = this.state.habits
      let temp = { ...habitData.data, completion: habitHistoryData.data }
      habits.push(temp)
      this.setState({ habits: habits, loading: false })
      console.log(habitData)
    })

    events.todo.map(async (item, index) => {
      const todoUrl = `http://localhost:8080/events/${item}`
      const todoResponse = await fetch(todoUrl)
      const todoData = await todoResponse.json()
      let todos = this.state.todos
      todos.push(todoData.data)
      this.setState({ todos: todos, loading: false })
    })

    console.log(this.state.habits)


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

  addData = async (text, type, habitId) => {
    if (type === "Habit") {
      let habits = this.state.habits
      habits.push({ user: 'mars', name: text, type: "habit", completion: [false] })
      this.setState({ habits: habits })

    }

    if (type === "Todo") {
      let data = { user: "mars", name: text, type: "todo" }
      let todos = this.state.todos
      todos.push(data)
      this.setState(todos)

      const url = 'http://localhost:8080/events/'
      await fetch(url, {
        method: "POST",
        body: JSON.stringify(data)
      })
    }

    //if its a cue
    else {
      let data = { habitId: habitId, link: text, type: type }
      let cues = this.state.cues
      cues.push(data)
      this.setState(cues)
    }

  }


  //checkbox of habit
  checkHabit = (value, index) => {
    let habits = this.state.habits
    habits[index].completion[0] = value
    this.setState({ habits: habits })
  }

  changeData = (updatedValue, index, deleteTrue, type) => {
    if (deleteTrue === true) {
      if (type === "Habit") {
        let habits = this.state.habits
        habits.splice(index, 1)
        this.setState({ habits: habits })
      }
      if (type === "Todo") {
        let todos = this.state.todos
        todos.splice(index, 1)
        this.setState({ todos: todos })
      }
    }
    else {
      if (type === "Habit") {
        let habits = this.state.habits
        habits[index].name = updatedValue
        this.setState({ habits: habits })
      }
      if (type === "Todo") {
        let todos = this.state.todos
        todos[index].name = updatedValue
        this.setState({ todos: todos })
      }

    }
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

          <Switch>
            <Route path="/" exact component={Dashboard} />
            <Route path="/editor" render={(props) => {
              return (
                <>
                  <Layout name="🗺 THE PLAN">
                  </Layout>
                  <All habits={!this.state.loading ? this.state.habits : this.state.default}
                    cues={this.state.cues}
                    todos={!this.state.loading ? this.state.todos : this.state.default}
                    weeklyGoals={this.state.weeklyGoals}
                    priorities={this.state.priorities} isAuthed={true}
                    addData={this.addData}
                    addedData={this.state.addedData}
                    changeData={this.changeData} />
                </>
              )
            }} />
            <Route path="/test" component={MyForm} />
            <Route path="/habits" render={(props) => (
              <>
                <Layout name="🗺 THE LITTLE THINGS">
                </Layout>
                <Habits habits={this.state.habits} checkHabit={this.checkHabit} />
              </>
            )} />
            <Route path="/signup">
              <Signup handleLogin={this.handleLogin} />
            </Route>
            <Route path="/login">
              <Login handleLogin={this.handleLogin} />
            </Route>

            <Route path="/cues" render={(props) => (
              <>
                <Layout name="🗺 THE TRIGGERS">
                </Layout>
                <Cues habits={!this.state.loading ? this.state.habits : this.state.default}
                  cues={this.state.cues}
                  addData={this.addData}
                />
              </>
            )} />


          </Switch>
        </div>
      </sessionContext.Provider>
    );
  }
}
export default withRouter(App);
