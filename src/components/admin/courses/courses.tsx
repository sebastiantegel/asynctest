import React from 'react';
import './courses.css';
import { IUserService } from './../../../services/user.service';
import courseService, { ICourseDto, ICourseService } from './../../../services/course.service';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import UserService from './../../../services/user.service';

export interface IAdminState {
    isAdmin: boolean;
    loading: boolean;

    courses: ICourseDto[];
}

export interface IAdminProps {
}

class AdminCourses extends React.Component<IAdminProps, IAdminState> {
    private _courseService: ICourseService;
    private _userService: IUserService;

    constructor(props: IAdminProps) {
        super(props);

        this.state= {
            isAdmin: false,
            courses: [],
            loading: true
        }

        this._courseService = new courseService();
        this._userService = new UserService();
    }

    componentDidMount() {
        this._userService.isAdmin()
            .then(() => {
                this.setState({
                    isAdmin: true
                }, () => {
                    this.getCourses()
                });
            })
            .catch(() => {
                window.location.href = "/";
            });
    }

    getCourses() {
        this._courseService.getAll()
            .then(courses => {
                this.setState({
                    courses: courses,
                    loading: false
                });
            });
    }

    render() {
        let courses: JSX.Element[] = [];

        this.state.courses.forEach(course => {
            courses.push(
                <li key={course.id}>
                    {course.name}
                </li>
            );
        });

        let loader: JSX.Element = (<div></div>);
        if(this.state.loading) {
            loader = (
                <div className="row">
                    <div className="col">
                        <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
                    </div>
                </div>
            )
        }

        return(
            <div className="default-container container-fluid">
                <div className="row justify-content-center">
                    <div className="col-4">
                        <h1>Kurser</h1>
                        <Link to="/admin/courses/add">Lägg till</Link>
                        {loader}
                        <ul>
                            {courses}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default AdminCourses;