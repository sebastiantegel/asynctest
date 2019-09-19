import { authHeader } from '../helpers/authHeader';
import axios from 'axios';
import { IUserDto } from './user.service';
import { apiUrl } from '../helpers/apis';

export interface ICourseDto {
    id: number;
    name: string;
}

export interface ICourseService {
    getAll(): Promise<ICourseDto[]>;
    getById(id: number): Promise<ICourseDto>;
    getByUser() : Promise<ICourseDto[]>;
    getUsers(courseId: number) : Promise<IUserDto[]>;
    create(course: ICourseDto): Promise<ICourseDto>;
    update(course: ICourseDto): Promise<any>;
    UpdateUsers(course: ICourseDto, users: IUserDto[]): Promise<boolean>;
    _delete(id: number): Promise<any>;
}

export default class courseService implements ICourseService {

    getAll() : Promise<ICourseDto[]> {
        const requestOptions = {
            withCredentials: true,
            headers: authHeader()
        };
    
        return axios.get(`${apiUrl}/courses`, requestOptions).then(this.handleResponse).catch(this.handleError);
    }
    
    getById(id: number): Promise<ICourseDto> {
        const requestOptions = {
            headers: authHeader()
        };
    
        console.log("Making real call");
    
        return axios.get(`${apiUrl}/courses/${id}`, requestOptions).then(this.handleResponse).catch(this.handleError);
    }
    
    getByUser() {
        const requestOptions = {
            withCredentials: true,
            headers: authHeader()
        };
    
        let userId = JSON.parse(localStorage.getItem('user') || '{}').id;
    
        return axios.get(`${apiUrl}/courses/getbyuser/${userId}`, requestOptions).then(this.handleResponse);
    }

    getUsers(courseId: number) : Promise<IUserDto[]> {
        const requestOptions = {
            withCredentials: true,
            headers: authHeader()
        };
        
        return axios.get(`${apiUrl}/courses/getusers/${courseId}`, requestOptions).then(this.handleResponse);
    }
    
    create(course: ICourseDto) {
        const requestOptions = {
            headers: { ...authHeader(), 'Content-Type': 'application/json' }
        };
    
        return axios.post(`${apiUrl}/courses/`, JSON.stringify(course), requestOptions).then(this.handleResponse);
    }
    
    update(course: ICourseDto) {
        const requestOptions = {
            headers: { ...authHeader(), 'Content-Type': 'application/json' }
        };
    
        return axios.put(`${apiUrl}/courses/${course.id}`, JSON.stringify(course), requestOptions).then(this.handleResponse);
    }

    UpdateUsers(course: ICourseDto, users: IUserDto[]): Promise<boolean> {
        const requestOptions = {
            headers: { 
                ...authHeader(), 
                'Content-Type': 'application/json'
            }
        };
    
        return axios.put(`${apiUrl}/courses/${course.id}/update`, JSON.stringify(users), requestOptions).then(this.handleResponse);
    }
    
    // prefixed function name with underscore because delete is a reserved word in javascript
    _delete(id: number) {
        const requestOptions = {
            headers: authHeader()
        };
    
        return axios.delete(`${apiUrl}/courses/${id}`, requestOptions).then(this.handleResponse);
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
