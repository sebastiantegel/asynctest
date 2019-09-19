import React from 'react';
import './helpitem.css';
import { IHelpItemDto } from '../../services/helpItem.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

interface IDashboardProps {
    helpItems: IHelpItemDto[];

    removeItem(id: number): void;

    isAdmin: boolean;
}

class HelpItems extends React.Component<IDashboardProps, {}> {
    constructor(props: IDashboardProps) {
        super(props);

        this.removeHelpItem = this.removeHelpItem.bind(this);
    }

    removeHelpItem(id: number) {
        this.props.removeItem(id);
    }

    render() {
        let items: JSX.Element[] = [];
        
        this.props.helpItems.map((item: IHelpItemDto, index: number) => {
            if(item.user.id === JSON.parse(localStorage.getItem('user') || '{}').id || this.props.isAdmin) {
                items.push(
                    <div className='helpitem row' key={item.id}>
                        <div className="col-1">{index + 1}. </div>
                        <div className="col-3">{item.user.firstName} {item.user.lastName}</div>
                        <div className="col-3">{item.where}</div>
                        <div className="col-3">{item.comment}</div>
                        <div className="col-2 remove" onClick={this.removeHelpItem.bind(this, item.id)}><FontAwesomeIcon icon={faTrashAlt} /></div>
                    </div>
                );   
            }
            else {
                items.push(
                    <div className='helpitem row' key={item.id}>
                        <div className="col-1">{index + 1}. </div>
                        <div className="col-3">{item.user.firstName} {item.user.lastName}</div>
                        {/* <div className="col-3">{item.where}</div>
                        <div className="col-3">{item.comment}</div> */}
                    </div>
                );
            }
        });

        return (
            <div className="container">
                {items}
            </div>
        );
    }
}

export default HelpItems;