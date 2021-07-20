'use strict'

import React from 'react';
import './App.css';
import Layout from './components/layout';
import { Route, Switch, withRouter } from 'react-router-dom';
import All from './pages/all';
import Dashboard from './pages/dashboard';
import MyForm from './components/form';
import Habits from './pages/habits'
import Cues from './pages/cues';
import Signup from './auth/Signup';
import Login from './auth/Login';
import { defaultSessionContext, sessionContext } from './auth/sessionContext'
import jwt from 'jsonwebtoken';
import makeRequest from './api/makeRequest';
import config from './config';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      default: [{ name: 'Loading...', text: 'Loading...' }],
      loading: true,
      habits: [],
      todos: [],
      // DON'T HARDCODE THIS
      cues: [],
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
    const user = this.state.session.user
    if (user === null) {
      this.props.history.push('/login')
    }
    else {
      this.fetchData()
    }
    console.log('mount')

  }

  async fetchData() {
    try {
      let data = (await makeRequest(`${config.api_domain}users/${this.state.session.user}/events`,
        'get', {}, this.state.session.jwt)).data
      for (let key in data) {
        // CHANGE TO SINGULAR
        this.setState({ [`${key}s`]: data[key] })
      }

      this.state.habits.map(async (item, index) => {
        const habitHistoryUrl = `${config.api_domain}events/${item._id}/history`
        let data = (await makeRequest(habitHistoryUrl, 'get', {}, this.state.session.jwt)).data
        let habits = this.state.habits
        habits[index] = { ...habits[index], completion: data }
        this.setState({ habits: habits })
      })
      this.setState({ loading: false })
    } catch (err) {
    }

  }


  addData = async (text, type, link) => {
    if (type === "Habit") {
      let data = { user: this.state.session.user, name: text, type: "habit" }
      // let habits = this.state.habits
      // habits.push(data)
      // this.setState({ habits: habits })
      const url = 'http://localhost:8080/events/'
      await makeRequest(url, 'post', data, this.state.session.jwt)
      await this.fetchData()
    }

    if (type === "Todo") {
      let data = { user: this.state.session.user, name: text, type: "todo" }
      // let todos = this.state.todos
      // todos.push(data)
      // this.setState(todos)

      const url = 'http://localhost:8080/events/'
      await makeRequest(url, 'post', data, this.state.session.jwt)
      await this.fetchData()
    }

    //if its a cue
    else {
      // let data = { habitId: habitId, resourceUrl: text, name: type }
      let data = { user: this.state.session.user, name: text, type: type, args: { resourceURL: link } }
      const url = 'http://localhost:8080/events/'
      await makeRequest(url, 'post', data, this.state.session.jwt)
      await this.fetchData()

      let cues = this.state.cues
      cues.push(data)
      this.setState(cues)
    }

  }


  //checkbox of habit
  checkHabit = async (value, index) => {
    let habits = this.state.habits
    const url = `http://localhost:8080/events/${this.state.habits[index]._id}/history`
    habits[index].completion[0] = value
    await makeRequest(url, 'put', { 0: value }, this.state.session.jwt)
    this.setState({ habits: habits })
  }

  changeData = async (updatedValue, index, deleteTrue, type) => {
    if (deleteTrue === true) {
      if (type === "Habit") {
        let habits = this.state.habits
        let id = habits[index]._id
        const url = `http://localhost:8080/events/${id}`
        await makeRequest(url, 'delete', {}, this.state.session.jwt)
        habits.splice(index, 1)
        this.setState({ habits: habits })
      }
      if (type === "Todo") {
        let todos = this.state.todos
        let id = todos[index]._id
        const url = `http://localhost:8080/events/${id}`
        await makeRequest(url, 'delete', {}, this.state.session.jwt)
        todos.splice(index, 1)
        this.setState({ todos: todos })
      }
      if (type === "Cue") {
        let cues = this.state.cues
        let id = cues[index]._id
        const url = `http://localhost:8080/events/${id}`
        await makeRequest(url, 'delete', {}, this.state.session.jwt)
        cues.splice(index, 1)
        this.setState({ cues: cues })
      }
    }
    else {
      if (type === "Habit") {
        let habits = this.state.habits
        let id = habits[index]._id
        const url = `http://localhost:8080/events/${id}`
        await makeRequest(url, 'put', { name: updatedValue }, this.state.session.jwt)
        habits[index].name = updatedValue
        this.setState({ habits: habits })
      }
      if (type === "Todo") {
        let todos = this.state.todos
        let id = todos[index]._id
        const url = `http://localhost:8080/events/${id}`
        await makeRequest(url, 'put', { name: updatedValue }, this.state.session.jwt)
        todos[index].name = updatedValue
        this.setState({ todos: todos })
      }
      if (type === "Cue") {
        let cues = this.state.cues
        let id = cues[index]._id
        const url = `http://localhost:8080/events/${id}`
        await makeRequest(url, 'put', updatedValue, this.state.session.jwt)
        for (let key in updatedValue) {
          cues[index][key] = updatedValue[key]
        }
        this.setState({ cues: cues })
      }

    }
  }

  async componentWillUnmount() {
    //place url post here for state of addedHabits
  }

  handleLogin = async token => {
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
        await this.fetchData()
        this.props.history.push('/')
      }
    }
  }

  handleLogout = () => {
    this.setState({ session: defaultSessionContext })
    this.props.history.push('/login')
  }

  render() {
    return (
      <sessionContext.Provider value={this.state.session}>
        <div className="App">

          <Switch>
            <Route path="/" exact render={(props) => {
              return (
                <>
                  <Dashboard habits={!this.state.loading ? this.state.habits : this.state.default}
                    cues={this.state.cues} handleLogout={this.handleLogout} generateCue={this.generateRandomCue}
                  />
                </>
              )
            }} />
            <Route path="/editor" render={(props) => {
              return (
                <>
                  <Layout name="🗺 THE PLAN" handleLogout={this.handleLogout}>
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
            <Route path="/habits" render={(props) => (
              <>
                <Layout name="🗺 THE LITTLE THINGS" handleLogout={this.handleLogout}>
                </Layout>
                <Habits habits={this.state.habits} checkHabit={this.checkHabit} />
              </>
            )} />
            <Route path="/signup">
              <Layout name="🗺 THE BEGINNING">
              </Layout>
              <Signup handleLogin={this.handleLogin} />
            </Route>
            <Route path="/login">
              <Layout name="THE LOGIN">
              </Layout>
              <Login handleLogin={this.handleLogin} />
            </Route>

            <Route path="/cues" render={(props) => (
              <>
                <Layout name="🗺 THE TRIGGERS" handleLogout={this.handleLogout}>
                </Layout>
                <Cues habits={!this.state.loading ? this.state.habits : this.state.default}
                  cues={this.state.cues}
                  addData={this.addData}
                  changeData={this.changeData}
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
