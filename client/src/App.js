import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css'; 
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'; 
import themeFile from './util/theme';
import jwtDecode from 'jwt-decode';
import AuthRoute from './util/AuthRoute';
import NoAuthRoute from './util/NoAuthRoute';
//Redux
import { Provider } from 'react-redux';
import store from './redux/store';
import { SET_AUTENTIFICATED } from './redux/types';
import { logoutUser, getUserData } from './redux/actions/userActions';

//Components

import Navbar from './components/layout/Navbar';

//Pages
import home from './pages/home'; 
import login from './pages/login';
import signup from './pages/signup';
import user from './pages/user';
import profile from './pages/profile';
import seepost from './pages/seepost';
import messages from './pages/messages';
import users from './pages/users';
import companies from './pages/companies';
import invites from './pages/invites';
import shop from './pages/shop';
import axios from 'axios';

const theme = createMuiTheme (themeFile);

const token = localStorage.FBIdToken;

if(token){
  const decodedToken = jwtDecode(token);
  if((decodedToken.exp * 1000) < Date.now()){
    store.dispatch(logoutUser());
    window.location.href = '/login';
  }
  else {
    store.dispatch({ type: SET_AUTENTIFICATED});
    axios.defaults.headers.common['Authorization'] = token;
    store.dispatch(getUserData());
  }
}
else 
{
  if(window.location.pathname === '/') {
    window.location.href = '/login';
  }
}

const NoMatch = ({ location }) => (
  <div>
    <h3>No match for <code>{location.pathname}</code></h3>
  </div>
)

export class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
        <Router>
        <Navbar />
          <div className="container">
          <Switch>
            <NoAuthRoute exact path="/" component={home}/>
            <NoAuthRoute exact path="/home" component={home}/>
            <AuthRoute exact path="/login" component={login}/>
            <AuthRoute exact path="/signup" component={signup}/> 
            <NoAuthRoute exact path="/users/:userNickName" component={user}/>
            <NoAuthRoute exact path="/profile" component={profile}/>
            <NoAuthRoute exact path="/posts/:postId" component={seepost}/>
            <NoAuthRoute exact path="/messages/t/:conversationId" component={messages}/>
            <NoAuthRoute exact path="/messages" component={messages}/>
            <NoAuthRoute exact path="/users" component={users}/>
            <NoAuthRoute exact path="/companies" component={companies}/>
            <NoAuthRoute exact path="/invites" component={invites}/>
            <NoAuthRoute exact path="/shop" component={shop}/>
            <Route component={NoMatch} />
          </Switch>
          </div>
        </Router>
        </Provider>
      </MuiThemeProvider>
    );
  }
}

export default App