import React from 'react';
import UserService, { IUserService, IUserDto } from '../../../services/user.service';
import courseService, { ICourseService, ICourseDto } from '../../../services/course.service';

export interface ISetUserState {
    isAdmin: boolean;

    users: IUserDto[];
    usersInCourse: IUserDto[];
}

export interface ISetUserProps {
    course: ICourseDto;

    updateUsers(users: IUserDto[]): void;
}

class SetUsers extends React.Component<ISetUserProps, ISetUserState> {
    private _userService: IUserService;
    private _courseService: ICourseService;

    constructor(props: ISetUserProps) {
        super(props);

        this.state= {
            isAdmin: false,
            users: [],
            usersInCourse: []
        }

        this._userService = new UserService();
        this._courseService = new courseService();
    }

    async componentDidMount() {
        await this.checkIsAdmin();

        this.getUsers();
        this.getUsersByCourse(this.props.course.id);
    }

    async checkIsAdmin() {
        let isUserAdmin = await this._userService.isAdmin();
        if(!isUserAdmin)
            this.sendUserToRoot();
        
        this.setState({
            isAdmin: isUserAdmin
        });
    }

    async getUsers() {
        let users = await this._userService.getAll();

        this.setState({
            users: users
        });
    }

    async getUsersByCourse(courseId: number) {
        let users = await this._courseService.getUsers(courseId);

        let allUsers = this.state.users;
        users.forEach((user: IUserDto) => {
            for(let i = 0; i < allUsers.length; i++) {
                if(user.id === allUsers[i].id)
                    allUsers.splice(i, 1);
            }
        });

        this.setState({
            usersInCourse: users,
            users: allUsers
        });
    }

    sendUserToRoot() {
        window.location.href = "/";
    }

    addUser(userId: number) {
        let users = this.state.users;
        
        let courseUsers = this.state.usersInCourse;
        let userToAdd = this.state.users.find(u => u.id === userId);

        if(userToAdd) {
            courseUsers.push(userToAdd);
        }

        for(let i = 0; i < users.length; i++) {
            if(users[i].id === userId)
                users.splice(i, 1);
        }

        this.setState({
            users: users,
            usersInCourse: courseUsers
        });
    }

    removeUser(userId: number) {
        let users = this.state.users;
        let courseUsers = this.state.usersInCourse;

        let userToRemove = this.state.usersInCourse.find(u => u.id === userId);

        if(userToRemove) {
            users.push(userToRemove);
        }

        for(let i = 0; i < courseUsers.length; i++) {
            if(courseUsers[i].id === userId)
                courseUsers.splice(i, 1);
        }

        this.setState({
            users: users,
            usersInCourse: courseUsers
        });
    }

    saveUsers() {
        this.props.updateUsers(this.state.usersInCourse);
    }

    render() {
        let users: JSX.Element[] = [];
        users = this.state.users.map((user: IUserDto) => {
            return (<div key={user.id} className="" onClick={this.addUser.bind(this, user.id)}>{user.firstName} {user.lastName} ({user.email}) </div>)
        });

        let usersInCourse: JSX.Element[] = [];
        usersInCourse = this.state.usersInCourse.map((user: IUserDto) => {
            return (<div key={user.id} className="" onClick={this.removeUser.bind(this, user.id)}>{user.firstName} {user.lastName} ({user.email}) </div>)
        });

        return(
            <div className="default-container container-fluid">
                <div className="row justify-content-center">
                    <div className="col-6">
                        <span className='course-title'>
                            Vald kurs: {this.props.course.name}
                        </span>
                    </div>
                </div>

                <div className="row">
                    <div className="col-6">
                        {users}
                    </div>
                    <div className="col-6">
                        {usersInCourse}
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <button className="btn btn-primary" onClick={this.saveUsers.bind(this)}>Spara</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default SetUsers;