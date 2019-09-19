import React from 'react';
import './Login.css';

class Logout extends React.Component {
    componentDidMount() {
        localStorage.removeItem('user');
        window.location.href = "/";
    }

    render() {
        return (
            <div className="App">
            <header className="App-header container-fluid">
                <div className="alert alert-success">
                    Du är nu utloggad
                </div>
            </header>
            </div>
        );
    }
}

export default Logout;