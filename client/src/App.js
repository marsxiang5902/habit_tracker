import React from 'react';
import './App.css';
import Layout from './components/layout';
import { Route, Switch, withRouter } from 'react-router-dom';
import All from './pages/all';
import Dashboard from './pages/dashboard';
import Habits from './pages/habits'
import Cues from './pages/cues';
import Signup from './auth/Signup';
import Login from './auth/Login';
import { defaultAppContext, appContext } from './context/appContext'
import jwt from 'jsonwebtoken';
import makeRequest from './api/makeRequest';
import FetchData from './api/fetchData';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      context: defaultAppContext
    })
  }

  async componentDidMount() {
    // console.log(await makeRequest(`users/adam/events`))
    const user = this.state.context.session.user
    if (user === null) {
      this.props.history.push('/login')
    }
    console.log('mount')
  }

  setContext = (value) => {
    this.setState({
      context: value
    })
  }


  handleLogin = async token => {
    if (token) {
      let decoded = jwt.decode(token)
      if ('user' in decoded && 'perms' in decoded) {
        let session = {
          isAuthed: true,
          jwt: token,
          user: decoded.user,
          perms: decoded.perms
        }
        let timedEvents = await FetchData(session)
        this.setState({
          context: {
            session: session,
            timedEvents: timedEvents
          }
        })
        this.props.history.push('/')
      }
    }
  }

  handleLogout = () => {
    this.setState({ context: defaultAppContext })
    this.props.history.push('/login')
  }

  render(){
    return (
      // <appContext.Provider value={[this.state.context, this.setContext]}>
      <appContext.Provider value={this.state.context}>
        <div className="App">
          <Switch>
            <Route path="/" exact render={(props) => {
              return (
                  <Dashboard handleLogout={this.handleLogout} generateCue={this.generateRandomCue}/>
              )
            }} />
            <Route path="/editor" render={(props) => {
              return (
                  <All handleLogout={this.handleLogout} setContext={this.setContext}/>
              )
            }} />
            <Route path="/habits" render={(props) => (
                <Habits setContext={this.setContext} handleLogout={this.handleLogout}/>
            )} />
            <Route path="/signup">
              <Signup handleLogin={this.handleLogin} />
            </Route>
            <Route path="/login">
              <Login handleLogin={this.handleLogin} />
            </Route>

            <Route path="/cues" render={(props) => (
                <Cues setContext={this.setContext} handleLogout={this.handleLogout}/>
            )} />

          </Switch>
        </div>
      </appContext.Provider>
    );
  }
}
export default withRouter(App);
