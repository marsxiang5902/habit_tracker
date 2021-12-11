import React from 'react';
import './App.css';
import { Route, Switch, withRouter } from 'react-router-dom';
import Editor from './pages/Editor';
import { Dashboard } from './pages/Dashboard';
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
import Forms from './pages/Forms';
import Accountability from './pages/Accountability';
import AuthRoute from './routes/AuthRoute';
import FullStory from 'react-fullstory';
import amplitude from 'amplitude-js';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      context: defaultAppContext
    })
  }

  async componentDidMount() {
    const user = this.state.context.session.user
    console.log('mount')
  }

  setContext = context => { this.setState({ context }) }
  getContext = () => this.state.context

  handleLogin = async token => {
    if (token) {
      let decoded = jwt.decode(token)
      if ('user' in decoded && 'perms' in decoded) {
        let context = await fetchData(decoded.user, token)
        this.setContext(context)

        this.unsubscribeToNotifications = subscribeToNotifications(context.session.preferences.dayStartTime, () => (
          getAllEvents(this.state.context)
        ), () => { this.props.history.push('/app/') })
        this.props.history.push('/app/')
      }
    }
  }

  handleLogout = () => {
    this.unsubscribeToNotifications()
    this.setState({ context: defaultAppContext })
    if (localStorage.getItem('jwt')) {
      localStorage.removeItem('jwt')
    }
    this.props.history.push('/app/login')
  }

  render() {
    const fullstory_id = '16S35F'
    // amplitude.getInstance().logEvent('test5')
    return (
      <appContext.Provider value={{ ...this.state.context, setContext: this.setContext, getContext: this.getContext }}>
        <div className="App">
          <FullStory org={this.fullstory_id} />
          <Switch>
            <AuthRoute path="/app" exact render={(props) => {
              return (
                <Dashboard handleLogout={this.handleLogout} />
              )
            }} />
            <AuthRoute path="/app/editor" render={(props) => {
              return (
                <Editor handleLogout={this.handleLogout} setContext={this.setContext} />
              )
            }} />
            <AuthRoute path="/app/habits" render={(props) => (
              <Habits setContext={this.setContext} handleLogout={this.handleLogout} />
            )} />
            <AuthRoute path="/app/user" render={(props) => (
              <User setContext={this.setContext} handleLogout={this.handleLogout} />
            )} />
            <AuthRoute path="/app/accountability" render={(props) => (
              <Accountability setContext={this.setContext} handleLogout={this.handleLogout} />
            )} />
            <AuthRoute path="/app/data" render={(props) => (
              <DataRoom setContext={this.setContext} handleLogout={this.handleLogout} />
            )} />

            <Route path="/app/signup">
              <Signup handleLogin={this.handleLogin} />
            </Route>
            <Route path="/app/login">
              <Login handleLogin={this.handleLogin} />
            </Route>
          </Switch>
        </div>
      </appContext.Provider>
    );
  }
}
export default withRouter(App);
