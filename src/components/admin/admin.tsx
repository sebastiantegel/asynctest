import React from 'react';
import './admin.css';
import { IUserService } from './../../services/user.service';
import { Link } from 'react-router-dom';
import UserService from './../../services/user.service';

export interface IAdminState {
    isAdmin: boolean;
}

export interface IAdminProps {
}

class Admin extends React.Component<IAdminProps, IAdminState> {
    private _userService: IUserService;

    constructor(props: IAdminProps) {
        super(props);

        this.state= {
            isAdmin: false
        }

        this._userService = new UserService();
    }

    componentDidMount() {
        this.checkIsAdmin();
    }

    async checkIsAdmin() {
        let isUserAdmin = await this._userService.isAdmin();
        if(!isUserAdmin)
            this.sendUserToRoot();
    }

    sendUserToRoot() {
        window.location.href = "/";
    }

    render() {
        return(
            <div className="default-container container-fluid">
                <div className="row">
                    <div className="col-6">
                        <Link to="/admin/courses">Kurser</Link>
                    </div>
                    <div className="col-6">
                    <Link to="/admin/groups">Grupper</Link>
                    </div>
                </div>
                <div className="row">
                    <div className="col-6">
                        <Link to="/admin/choosecourse">Hjälplistor</Link>
                    </div>
                    <div className="col-6">
                        <Link to="/admin/users">Användare</Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default Admin;