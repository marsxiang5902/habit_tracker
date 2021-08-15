import React from 'react';
import './App.css';
import { Route, Switch, withRouter } from 'react-router-dom';
import Editor from './pages/Editor';
import Dashboard from './pages/Dashboard';
import Habits from './pages/Habits'
import Triggers from './pages/Triggers';
import Signup from './auth/Signup';
import Login from './auth/Login';
import { defaultAppContext, appContext } from './context/appContext'
import jwt from 'jsonwebtoken';
import fetchData from './api/fetchData';
import makeRequest from './api/makeRequest';
import User from './pages/User';
import subscribeToNotifications from './notifications/notify';
import { getAllEvents } from './lib/locateEvents';
import DataRoom from './pages/Dataroom';
import Stacks from './pages/Stacks';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      context: defaultAppContext
    })
  }

  async componentDidMount() {
    const user = this.state.context.session.user
    if (user === null) {
      this.props.history.push('/login')
    }
    console.log('mount')
  }

  setContext = context => { this.setState({ context }) }
  getContext = () => this.state.context

  handleLogin = async token => {
    if (token) {
      let decoded = jwt.decode(token)
      if ('user' in decoded && 'perms' in decoded) {

        let userRecord = (await makeRequest(`users/${decoded.user}`, 'get', {}, token)).data
        let session = {
          isAuthed: true,
          jwt: token,
          ...userRecord
        }

        let timedEvents = await fetchData(session)
        this.setState({
          context: {
            session: session,
            timedEvents: timedEvents,
          }
        })

        this.unsubscribeToNotifications = subscribeToNotifications(userRecord.dayStartTime, () => (
          getAllEvents(this.state.context)
        ), () => { this.props.history.push('/') })
        this.props.history.push('/')
      }
    }
  }

  handleLogout = () => {
    this.unsubscribeToNotifications()
    this.setState({ context: defaultAppContext })
    this.props.history.push('/login')
  }

  render() {
    return (
      // <appContext.Provider value={[this.state.context, this.setContext]}>
      <appContext.Provider value={{ ...this.state.context, setContext: this.setContext, getContext: this.getContext }}>
        <div className="App">
          <Switch>
            <Route path="/" exact render={(props) => {
              return (
                <Dashboard handleLogout={this.handleLogout} />
              )
            }} />
            <Route path="/editor" render={(props) => {
              return (
                <Editor handleLogout={this.handleLogout} setContext={this.setContext} />
              )
            }} />
            <Route path="/habits" render={(props) => (
              <Habits setContext={this.setContext} handleLogout={this.handleLogout} />
            )} />
            <Route path="/triggers" render={(props) => (
              <Triggers setContext={this.setContext} handleLogout={this.handleLogout} />
            )} />
            <Route path="/stacks" render={(props) => (
              <Stacks handleLogout={this.handleLogout} />
            )} />
            <Route path="/user" render={(props) => (
              <User setContext={this.setContext} handleLogout={this.handleLogout} />
            )} />
            <Route path="/data" render={(props) => (
              <DataRoom setContext={this.setContext} handleLogout={this.handleLogout} />
            )} />

            <Route path="/signup">
              <Signup handleLogin={this.handleLogin} />
            </Route>
            <Route path="/login">
              <Login handleLogin={this.handleLogin} />
            </Route>


          </Switch>
        </div>
      </appContext.Provider>
    );
  }
}
export default withRouter(App);
