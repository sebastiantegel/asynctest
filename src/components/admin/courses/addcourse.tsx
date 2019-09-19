import React from 'react';
import './courses.css';
import courseService, { ICourseService } from './../../../services/course.service';
import { Redirect } from 'react-router';

export interface IAdminState {
    name: string;
    saved: boolean;

    nameValid: boolean;
    formValid: boolean;
    isNew: boolean;
}

export interface IAdminProps {
}

class AdminAddCourses extends React.Component<IAdminProps, IAdminState> {
    private _courseService: ICourseService;

    constructor(props: IAdminProps) {
        super(props);

        this.state= {
            name: '',
            nameValid: true,
            formValid: false,
            isNew: true,
            saved: false
        };

        this._courseService = new courseService();
    }

    componentDidMount() {
        
    }

    saveCourse(e: any) {
        e.preventDefault();

        console.log("Saving course");

        this._courseService.create({
            name: this.state.name,
            id: 0
        }).then(() => {
            this.setState({
                saved: true
            });
            
        });
    }

    handleChange = (e: any) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value, isNew: false} as any, 
            () => { this.validateField(name, value) });
    }

    validateField = (fieldName: string, value: string) => {
        let nameValid = this.state.nameValid;
      
        switch(fieldName) {
          case 'name':
            nameValid = value !== '';
            break;
          default:
            break;
        }

        this.setState({nameValid: nameValid,
                      }, this.validateForm);
      }
      
      validateForm() {
        this.setState({formValid: this.state.nameValid});
      }

    render() {
        if(this.state.saved) {
            return (<Redirect to="/admin/courses"></Redirect>);
        }

        return(
            <div className="default-container container-fluid">
                <div className="row justify-content-center">
                    <div className="col-4">
                        <form onSubmit={this.saveCourse.bind(this)} className="form-group">
                            <input type="text" name="name" placeholder="Kursnamn" className={this.state.isNew ? 'form-control' : this.state.nameValid ? "form-control is-valid" : "form-control is-invalid"} onChange={this.handleChange} />
                            <button className="btn btn-primary" type="submit" disabled={!this.state.formValid}>Spara</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default AdminAddCourses;