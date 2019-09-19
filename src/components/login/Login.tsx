import React from 'react';
import './Login.css';
import { IUserService } from './../../services/user.service';
import { Redirect } from 'react-router';
import UserService from './../../services/user.service';

// const axios = require("axios");

interface ILoginState {
    email: string;
    password: string;

    errorMessage: string;
    loggedIn: boolean;
}

interface ILoginProps {
    setLoggedIn(): void;
}

class Login extends React.Component<ILoginProps, ILoginState> {
    private _userService: IUserService;

    constructor(props: any) {
        super(props);

        this.state = {
            email: '',
            password: '',

            errorMessage: '',
            loggedIn: false
        };

        this.login = this.login.bind(this);
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

    login(e: any) {
        e.preventDefault();

        this._userService.login(this.state.email, this.state.password)
            .then(() => {
                this.setState({
                    loggedIn: true
                });
            })
            .catch((error: any) => {
                console.log(error);

                this.setState({
                    errorMessage: error.response.data.message
                });
            });
    }

    render() {
        if(this.state.loggedIn) {
            this.props.setLoggedIn();
            return (<Redirect to="/"></Redirect>);
        }

        let alert: JSX.Element = (<div></div>);
        if(this.state.errorMessage !== '') {
            alert = (<div className="alert alert-danger">{this.state.errorMessage}</div>);
        }

        return (
            <div className="App">
                <header className="default-container container-fluid">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-4">
                        {alert}
                            <form className="form-group" onSubmit={this.login}>
                                <input type="text" className="form-control" name="email" onChange={this.handleInputChange} />
                                <input type="password" className="form-control" name="password" onChange={this.handleInputChange} />

                                <button className="btn btn-primary">Logga in</button>
                            </form>
                        </div>
                    </div>
                </header>
            </div>
        );
    }
}

export default Login;