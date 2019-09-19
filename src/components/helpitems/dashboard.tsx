import React from 'react';
import './dashboard.css';
import courseService, { ICourseService, ICourseDto } from './../../services/course.service';
import helpItemService, { IHelpItemDto, IHelpItemService } from '../../services/helpItem.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import HelpItems from './helpitem';
import { IUserDto } from '../../services/user.service';
import AddItem from './additem';
import moment from 'moment';

export interface IAddPartialDto {
    where: string;
    comment: string;
}

export interface IAddItemDto {
    courseId: number;
    where: string;
    comment: string;
    user: IUserDto;
    date: moment.Moment;
}

interface IDashboardState {
    course: ICourseDto;
    loading: boolean;

    currentUserHasBooking: boolean;

    helpItems: IHelpItemDto[];
}

export interface IDashboardProps {
    courseId: number;

    match: any;
}

class Dashboard extends React.Component<IDashboardProps, IDashboardState> {
    private timer: any;
    private _courseService: ICourseService;
    private _helpItemService: IHelpItemService;

    constructor(props: IDashboardProps) {
        super(props);

        this.state = {
            course: {
                id: 0,
                name: ''
            },
            helpItems: [],
            loading: true,
            currentUserHasBooking: false
        };

        this.removeItem = this.removeItem.bind(this);
        this.addItem = this.addItem.bind(this);

        this._courseService = new courseService();
        this._helpItemService = new helpItemService();
    }

    async componentDidMount() {
        let course = await this._courseService.getById(this.props.match.params.courseId);
        let helpItems = await this.getHelpItems() || [];

        let searchResult: IHelpItemDto[] = [];
        if(helpItems) {
            let currentUser: IUserDto = JSON.parse(localStorage.getItem('user') || '{}');
            searchResult = helpItems.filter(hi => hi.user.id === currentUser.id);
        }

        this.timer = setInterval(() => this.getDashboard(), 10000);
        
        this.setState({
            course: course,
            helpItems: helpItems,
            loading: false,
            currentUserHasBooking: searchResult.length > 0
        });
    }

    componentWillUnmount() {
        clearInterval(this.timer);
        this.timer = null;
    }

    async getHelpItems(): Promise<IHelpItemDto[]> {
        let result: IHelpItemDto[] = await this._helpItemService.getByCourse(this.props.match.params.courseId);

        return result;
    }

    getDashboard() {
        this.getHelpItems();
    }

    async removeItem(id: number) {
        await this._helpItemService._delete(id);

        let items = this.state.helpItems;
        for(let i = 0; i < this.state.helpItems.length; i++) {
            if(this.state.helpItems[i].id === id) {
                items.splice(i, 1);
                break;
            }
        }

        this.setState({
            helpItems: items,
            currentUserHasBooking: this.checkForBookings(items)
        });
    }

    async addItem(itemToAddPartial: IAddPartialDto) {
        let itemToAdd: IAddItemDto = {
            courseId: this.state.course.id,
            user: JSON.parse(localStorage.getItem('user') || '{}'),
            where: itemToAddPartial.where,
            comment: itemToAddPartial.comment,
            date: moment()
        };

        let helpItemCreated = await this._helpItemService.create(itemToAdd);

        let newItems = [...this.state.helpItems, helpItemCreated];

        this.setState({
            helpItems: newItems,
            currentUserHasBooking: this.checkForBookings(newItems)
        });
    }

    checkForBookings(items: IHelpItemDto[]): boolean {
        let currentUser: IUserDto = JSON.parse(localStorage.getItem('user') || '{}');
        let searchResult = items.filter(hi => hi.user.id === currentUser.id);

        return searchResult.length > 0;
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
            )
        }

        let newItem: JSX.Element = (<div></div>);
        if(!this.state.currentUserHasBooking) {
            newItem = (
                <AddItem addItem={this.addItem} />
            )
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
                {newItem}
                <HelpItems helpItems={this.state.helpItems} removeItem={this.removeItem} isAdmin={false} />
            </header>
            </div>
        );
    }
}

export default Dashboard;