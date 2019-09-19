import React from 'react';
import './additem.css';
import { IAddPartialDto } from './dashboard';

interface IAddItemProps {
    addItem(newItem: IAddPartialDto): void;
}

export interface IAddItemState {
    where: string;
    comment: string;
}

class AddItem extends React.Component<IAddItemProps, IAddItemState> {
    constructor(props: IAddItemProps) {
        super(props);

        this.state = {
            where: '',
            comment: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event: any) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        } as any);
    }

    handleSubmit(event: any) {
        event.preventDefault();

        this.props.addItem(this.state);
    }

    render() {        
        
        return (
            <div className="container">
                <form onSubmit={this.handleSubmit}>
                    <div className="row justify-content-center">
                        <div className="col-12 col-sm-6 col-md-4">
                            <input type="text" name="where" className="form-control" placeholder="Var" onChange={this.handleChange} />
                        </div>
                        <div className="col-12 col-sm-6 col-md-4">
                            <input type="text" name="comment" className="form-control" placeholder="Kommentar" onChange={this.handleChange} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <button type="submit" className="btn btn-primary">Spara</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default AddItem;