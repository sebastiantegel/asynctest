import React from 'react';
import './Home.css';

import courseService, { ICourseDto, ICourseService } from './../../services/course.service';
import { Redirect } from 'react-router';

interface IHomeState {
  courses: ICourseDto[];

  selectedCourseId: number;

  errorMessage: string;
}

class Home extends React.Component<{}, IHomeState> {
  private _courseService: ICourseService;

  constructor(props: any) {
    super(props);

    this.state = {
      courses: [],
      errorMessage: '',
      selectedCourseId: 0
    };

    this.handleChange = this.handleChange.bind(this);
    this._courseService = new courseService();
  }

  componentDidMount() {
    if(localStorage.getItem('user')) {
      this._courseService.getByUser()
        .then((result: any) => {
          this.setState({
            courses: result
          });
        })
        .catch((error: any) => {
          console.log(error);
          this.setState({
            errorMessage: error.response.data.message
          });
        });
    }
  }

  handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({
      selectedCourseId: parseInt(e.target.value)
    });
  }

  render() {
    if(this.state.selectedCourseId > 0) {
      let dashboardUrl = "/dashboard/" + this.state.selectedCourseId;
      return (<Redirect to={dashboardUrl}></Redirect>);
    }

    let alert: JSX.Element = (<div></div>);
    if(this.state.errorMessage !== '') {
      alert = (
        <div className="alert alert-danger">{this.state.errorMessage}</div>
      );
    }

    let select: JSX.Element = (<div></div>);
    if(localStorage.getItem('user')) {
      select = (
        <p>
          <select className="form-control" onChange={this.handleChange}>
            <option key='-1' value='-1'>Välj kurs</option>
            {this.state.courses.map((course: ICourseDto) => {
              return (
                <option key={course.id} value={course.id}>{course.name}</option>
              );
            })}
          </select>
        </p>
      );
    }

    return (
      <div className="App">
        <header className="default-container container-fluid">
          <div className="row justify-content-center">
            <div className="col-4">
              <p>Välkommen till bokningslistan</p>
              {alert}
              {select}
            </div>
            </div>
        </header>
      </div>
    );
  }
}

export default Home;