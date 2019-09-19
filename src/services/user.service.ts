import { authHeader } from '../helpers/authHeader';
import axios from 'axios';
import { apiUrl } from '../helpers/apis';

export interface IUserDto {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface IUserService {
    getAll(): Promise<IUserDto[]>;
    getById(id: number): Promise<IUserDto>;
    register(user: IUserDto): Promise<IUserDto>;
    update(user: IUserDto): Promise<IUserDto>;
    isAdmin(): Promise<boolean>;
    _delete(id: number): Promise<any>;

    login(email: string, password: string): Promise<any>;
}

export default class UserService implements IUserService {
    camelCaseReviver(key: any, value: any) {
        if (value && typeof value === 'object') {
            for (var k in value) {
                if (/^[A-Z]/.test(k) && Object.hasOwnProperty.call(value, k)) {
                    value[k.charAt(0).toLowerCase() + k.substring(1)] = value[k];
                    delete value[k];
                }
            }
        }
        return value;
    }
    
    login(email: string, password: string) {
        const requestOptions = {
            headers: { 'Content-Type': 'application/json' }
        };
    
        return axios.post(`${apiUrl}/users/authenticate`, JSON.stringify({ email, password }), requestOptions)
            .then(this.handleResponse)
            .then((user: IUserDto) => {
                console.log(user);
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user, this.camelCaseReviver));
                
                return user;
            });
    }
    
    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('user');
        window.location.href = "/";
    }
    
    getAll(): Promise<IUserDto[]> {
        const requestOptions = {
            withCredentials: true,
            headers: authHeader()
        };
    
        return axios.get(`${apiUrl}/users`, requestOptions).then(this.handleResponse);
    }
    
    getById(id: number): Promise<IUserDto> {
        const requestOptions = {
            headers: authHeader()
        };
    
        return axios.get(`${apiUrl}/users/${id}`, requestOptions).then(this.handleResponse);
    }
    
    register(user: IUserDto): Promise<IUserDto> {
        const requestOptions = {
            headers: { 'Content-Type': 'application/json' }
        };

        return axios.post(`${apiUrl}/users/register`, JSON.stringify(user), requestOptions).then(this.handleResponse);
    }
    
    update(user: IUserDto): Promise<IUserDto> {
        const requestOptions = {
            headers: { ...authHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        };
    
        return axios.put(`${apiUrl}/users/${user.id}`, requestOptions).then(this.handleResponse);;
    }
    
    isAdmin(): Promise<boolean> {
        const requestOptions = {
            headers: authHeader()
        };
    
        return axios.get(`${apiUrl}/users/isadmin`, requestOptions)
            .then(this.handleResponse)
            .catch(this.handleError);
    }
    
    // prefixed function name with underscore because delete is a reserved word in javascript
    _delete(id: number): Promise<any> {
        const requestOptions = {
            headers: authHeader()
        };
    
        return axios.delete(`${apiUrl}/users/${id}`, requestOptions).then(this.handleResponse);
    }
    
    handleResponse(response: any) {
        if (response.statusText.toLowerCase() !== 'ok') {
            if (response.status === 401) {
                 this.logout();
                 window.location.reload(true);
             }
    
             const error = (response.data && response.data.message) || response.statusText;
             return Promise.reject(error);
        }
    
        return response.data;
    }
    
    handleError(response: any) {
        console.log("Error in userService: ", response);
        return false;
    }
}