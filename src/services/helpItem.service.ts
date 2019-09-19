import { authHeader } from '../helpers/authHeader';
import axios from 'axios';
import moment from 'moment';
import { IUserDto } from './user.service';
import { ICourseDto } from './course.service';
import { IAddItemDto } from '../components/helpitems/dashboard';
import { apiUrl } from '../helpers/apis';

export interface IHelpItemDto {
    id: number;
    user: IUserDto;
    course: ICourseDto;
    where: string;
    date: moment.Moment;
    comment: string;
}

export interface IHelpItemService {
    getAll(): Promise<IHelpItemDto[]>;
    getByCourse(courseId: number) : Promise<IHelpItemDto[]>;
    getByUser(): Promise<IHelpItemDto[]>
    create(helpItem: IAddItemDto): Promise<IHelpItemDto>;
    update(helpItem: IHelpItemDto): Promise<IHelpItemDto>;
    _delete(id: number): Promise<any>;
}

export default class helpItemService implements IHelpItemService {

    getAll(): Promise<IHelpItemDto[]> {
        const requestOptions = {
            withCredentials: true,
            headers: authHeader()
        };
    
        return axios.get(`${apiUrl}/helplist`, requestOptions).then(this.handleResponse);
    }
    
    getByCourse(courseId: number) : Promise<IHelpItemDto[]> {
        const requestOptions = {
            headers: authHeader()
        };
    
        return axios.get(`${apiUrl}/helplist/${courseId}`, requestOptions).then(this.handleResponse).catch(this.handleError);
    }
    
    getByUser(): Promise<IHelpItemDto[]> {
        const requestOptions = {
            withCredentials: true,
            headers: authHeader()
        };
    
        let userId = JSON.parse(localStorage.getItem('user') || '{}').Id;
    
        return axios.get(`${apiUrl}/helplist/${userId}`, requestOptions).then(this.handleResponse);
    }
    
    create(helpItem: IAddItemDto): Promise<IHelpItemDto> {
        const requestOptions = {
            headers: { ...authHeader(), 'Content-Type': 'application/json' }
        };
    
        return axios.post<IHelpItemDto>(`${apiUrl}/helplist/`, JSON.stringify(helpItem), requestOptions).then(this.handleResponse);
    }
    
    update(helpItem: IHelpItemDto): Promise<IHelpItemDto> {
        const requestOptions = {
            headers: { ...authHeader(), 'Content-Type': 'application/json' }
        };
    
        return axios.put(`${apiUrl}/helplist/${helpItem.id}`, JSON.stringify(helpItem), requestOptions).then(this.handleResponse);;
    }
    
    // prefixed function name with underscore because delete is a reserved word in javascript
    _delete(id: number): Promise<any> {
        const requestOptions = {
            headers: authHeader()
        };
    
        return axios.delete(`${apiUrl}/helplist/${id}`, requestOptions).then(this.handleResponse);
    }
    
    handleResponse(response: any) {
        if (response.statusText.toLowerCase() !== 'ok') {
             const error = (response.data && response.data.message) || response.statusText;
             return Promise.reject(error);
        }
        return response.data;
    }
    
    handleError(response: any) {
       return response;
    }

}
