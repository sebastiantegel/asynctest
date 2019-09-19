import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import NewUser from './components/users/NewUser';
import NotFound from './components/NotFound';
import Home from './components/home/Home';
import Login from './components/login/Login';

import { IUserDto, IUserService } from './services/user.service';
import Logout from './components/login/Logout';
import Dashboard from './components/helpitems/dashboard';
import AddItem from './components/helpitems/additem';
import Admin from './components/admin/admin';
import AdminCourses from './components/admin/courses/courses';
import AdminAddCourses from './components/admin/courses/addcourse';
import AdminDashboard from './components/admin/helpitems/dashboard';
import ChooseCourse from './components/admin/helpitems/choosecourse';
import ConnectUser from './components/admin/connect/connectUsers';
import UserService from './services/user.service';

interface IAppState {
  isAdmin: boolean;
}

class App extends React.Component<{}, IAppState> {
  private _userService: IUserService;

  constructor(props: any) {
    super(props);

    this.state = {
      isAdmin: false
    };

    this.setLoggedIn = this.setLoggedIn.bind(this);

    this._userService = new UserService();
  }

  componentDidMount() {
    this.checkAdmin();
  }

  async checkAdmin() {
    let result = await this._userService.isAdmin();
    
    this.setState({
      isAdmin: result
    });
  }

  async setLoggedIn(){
    await this.checkAdmin();
  }

  render () {

    let login: JSX.Element = (
    <li className="nav-item">
      <Link className="nav-link" to="/login">Logga in</Link>
    </li>);

    let userName = '';
    if(localStorage.getItem('user')) {
      let user: IUserDto = JSON.parse(localStorage.getItem('user') || '{}');

      userName = "Inloggad: " + user.firstName + " " + user.lastName;

      login = (
        <li className="nav-item">
          <Link className="nav-link" to="/logout">Logga ut</Link>
        </li>
      );
    }

    let admin: JSX.Element = (<div></div>);
    if(this.state.isAdmin) {
      admin = (
        <span className="nav-text">
          <Link className="nav-link" to="/admin">Admin</Link>
        </span>
      );
    }

    return (
      <div className="App">
        <Router>
          <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
              {/* <a className="navbar-brand" href="#">Hjälplistan</a> */}
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>

              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                  <li className="nav-item active">
                    <Link className="nav-link" to="/">Hem <span className="sr-only">(current)</span></Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/user">Skapa användare</Link>
                  </li>
                  {login}
                </ul>
                {admin}
                <span className='nav-text'>{userName}</span>
              </div>
            </nav>

            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/user/" component={NewUser} />
              <Route path="/login/" render={(props) => <Login {...props} setLoggedIn={this.setLoggedIn} /> } />
              <Route path="/dashboard/:courseId" component={Dashboard} />
              <Route path="/addItem/:courseId" component={AddItem} />
              
              <Route path="/admin/" exact component={Admin} />
              <Route path="/admin/courses" exact component={AdminCourses} />
              <Route path="/admin/courses/add" component={AdminAddCourses} />
              <Route path="/admin/choosecourse" component={ChooseCourse} />
              <Route path="/admin/dashboard/:courseId" exact component={AdminDashboard} />
              <Route path="/admin/users/" exact component={ConnectUser} />

              <Route path="/logout/" component={Logout} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </Router>
      </div>
    );
              }
}

export default App;
