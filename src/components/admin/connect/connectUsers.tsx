import React from 'react';
import UserService, { IUserService, IUserDto } from '../../../services/user.service';
import courseService, { ICourseService, ICourseDto } from '../../../services/course.service';
import SetUsers from './setUsers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export interface IConnectUserState {
    isAdmin: boolean;
    courses: ICourseDto[];
    selectedCourse: ICourseDto;

    saved: boolean;
    loading: boolean;
}

export interface IConnectUserProps {
}

class ConnectUser extends React.Component<IConnectUserProps, IConnectUserState> {
    private _userService: IUserService;
    private _courseService: ICourseService;

    constructor(props: IConnectUserProps) {
        super(props);

        this.state= {
            isAdmin: false,
            courses: [],
            selectedCourse: {id: 0, name: ''},
            saved: false,
            loading: true
        }

        this._userService = new UserService();
        this._courseService = new courseService();
    }

    async componentDidMount() {
        await this.checkIsAdmin();

        let courses = await this._courseService.getAll();

        this.setState({
            courses: courses,
            loading: false
        });
    }

    async checkIsAdmin() {
        let isUserAdmin = await this._userService.isAdmin();
        if(!isUserAdmin)
            this.sendUserToRoot();
        
        this.setState({
            isAdmin: isUserAdmin
        });
    }

    sendUserToRoot() {
        window.location.href = "/";
    }

    async courseSelected(event: React.ChangeEvent<HTMLSelectElement>) {
        this.setState({
            loading: true
        });

        let selectedCourseId = parseInt(event.target.value);

        this.setState({
            selectedCourse: await this._courseService.getById(selectedCourseId),
            loading: false
        });
    }

    async updateUsers(users: IUserDto[]) {
        let result = await this._courseService.UpdateUsers(this.state.selectedCourse, users);

        if(result) {
            this.setState({
                loading: false,
                selectedCourse: {
                    id: 0,
                    name: ''
                }
            });
        }
    }

    render() {
        let loading: JSX.Element = (<div></div>);
        if(this.state.loading) {
            loading = (
                <div>
                    <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
                </div>
            );
        }

        let options: JSX.Element[] = [];
        options.push(<option key="0" value="0">Välj kurs</option>);
        let coursesOptions = this.state.courses.map((course: ICourseDto) => {
            return (<option key={course.id} value={course.id}>{course.name}</option>);
        });
        options = options.concat(coursesOptions);

        if(this.state.selectedCourse.id > 0) {
            return (
                <React.Fragment>
                    {loading}
                    <SetUsers course={this.state.selectedCourse} updateUsers={this.updateUsers.bind(this)} />
                </React.Fragment>
            );
        }
        else {
            return(
                <React.Fragment>
                    {loading}
                    <div className="default-container container-fluid">
                        <div className="row justify-content-center">
                            <div className="col-6">
                                Välj kurs
                                <select onChange={this.courseSelected.bind(this)} className="form-control">
                                    {options}
                                </select>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            );
        }
    }
}

export default ConnectUser;