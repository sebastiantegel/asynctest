import React from 'react';
import './NewUser.css';
import { IUserDto, IUserService } from './../../services/user.service';
import UserService from './../../services/user.service';

interface INewUserState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;

  showSuccess: boolean;
  errorMessage: string;
}

class NewUser extends React.Component<{}, INewUserState> {
  private _userService: IUserService;

  constructor(props: any) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      showSuccess: false,
      errorMessage: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this._userService = new UserService();
  }

  handleInputChange(event: any) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    
    this.setState({
      [name]: value
    } as any);
  }

  handleSubmit(e: any) {
    e.preventDefault();

    let userDto: IUserDto = {
      id: 0,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      password: this.state.password
    };

    this._userService.register(userDto)
      .then(() => {
        this.setState({
          showSuccess: true
        });
      })
      .catch((error: any) => {
        this.setState({
          errorMessage: error.response.data.message
        });
      });
   }

  render() {
    let alert: JSX.Element = (<div></div>);
    if(this.state.errorMessage !== '') {
      alert = (<div className="alert alert-danger" role="alert">{this.state.errorMessage}</div>);
    }

    if(this.state.showSuccess) {
      alert = (<div className="alert alert-success" role="alert">Ditt konto har skapats</div>);
    }

    return (
      <div className="App">
        <header className="default-container container-fluid">
          {alert}
          <form onSubmit={this.handleSubmit} className="form-group">
            <div className="row">
              <div className="col">
                <input type="text" className="form-control" name="firstName" onChange={this.handleInputChange} placeholder="Förnamn" />
              </div>
              <div className="col">
                <input type="text" className="form-control" name="lastName" onChange={this.handleInputChange} placeholder="Efternamn" />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <input type="email" className="form-control" name="email" onChange={this.handleInputChange} placeholder="E-post" />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <input type="password" className="form-control" name="password" onChange={this.handleInputChange} placeholder="Lösenord" />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <button type="submit" className="btn btn-primary">Skicka</button>
              </div>
            </div>
          </form>
        </header>
      </div>
    );
  }
}

export default NewUser;
