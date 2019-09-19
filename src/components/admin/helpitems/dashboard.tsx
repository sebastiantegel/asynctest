import React from 'react';
import './dashboard.css';
import { IUserService } from '../../../services/user.service';
import courseService, { ICourseDto, ICourseService  } from '../../../services/course.service';
import helpItemService, { IHelpItemDto, IHelpItemService } from '../../../services/helpItem.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HelpItems from '../../helpitems/helpitem';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import UserService from '../../../services/user.service';

interface IAdminDashboardState {
    course: ICourseDto;
    loading: boolean;

    helpItems: IHelpItemDto[];

    isAdmin: boolean;
}

interface IAdminDashboardProps {
    courseId: number;

    match: any;
}

class AdminDashboard extends React.Component<IAdminDashboardProps, IAdminDashboardState> {
    private _courseService: ICourseService;
    private _helpItemService: IHelpItemService; 
    private _userService: IUserService;
    private _timer: any;

    constructor(props: IAdminDashboardProps) {
        super(props);

        this.state = {
            course: {
                id: 0,
                name: ''
            },
            helpItems: [],
            loading: true,
            isAdmin: false
        };

        this.removeItem = this.removeItem.bind(this);

        this._courseService = new courseService();
        this._helpItemService = new helpItemService();
        this._userService = new UserService();
    }

    componentDidMount() {
        this._userService.isAdmin()
        .then(() => {
            this.setState({
                isAdmin: true
            }, () => {
                this._courseService.getById(this.props.match.params.courseId)
                .then((courseResult: ICourseDto) => {
                    this._helpItemService.getByCourse(this.props.match.params.courseId)
                    .then((result: IHelpItemDto[]) => {
                        this.setState({
                            helpItems: result,
                            course: courseResult,
                            loading: false
                        });
                    });
                });
            });
        })
        .catch(() => {
            window.location.href = "/";
        });

        this._timer = setInterval(() => this.getDashboard(), 10000);
    }

    componentWillUnmount() {
        clearInterval(this._timer);
        this._timer = null;
    }

    async getHelpItems(): Promise<IHelpItemDto[]> {
        let result: IHelpItemDto[] = await this._helpItemService.getByCourse(this.props.match.params.courseId);

        return result;
    }

    getDashboard() {
        this.getHelpItems();
    }

    removeItem(id: number) {
        this._helpItemService._delete(id);

        let items = this.state.helpItems;
        for(let i = 0; i < this.state.helpItems.length; i++) {
            if(this.state.helpItems[i].id === id) {
                items.splice(i, 1);
                break;
            }
        }

        this.setState({
            helpItems: items
        });
    }

    render() {
        let loader: JSX.Element = (<div></div>);
        if(this.state.loading) {
            loader = (
                <div className="row">
                    <div className="col">
                        <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
                    </div>
                </div>
            );
        }

        return (
            <div className="App">
            <header className="default-container container-fluid">
                <div className="row">
                    <div className="col">
                        <h1>Hjälplista för kurs: {this.state.course.name}</h1>
                    </div>
                </div>
                {loader}
                <HelpItems helpItems={this.state.helpItems} removeItem={this.removeItem} isAdmin={this.state.isAdmin} />
            </header>
            </div>
        );
    }
}

export default AdminDashboard;