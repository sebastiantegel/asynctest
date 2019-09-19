import React from 'react';
import '../../../../testSetup';
import { shallow, mount } from 'enzyme';
import { ICourseDto } from './../../../../services/course.service';
import SetUsers from './../../../../components/admin/connect/setUsers';
import { IUserDto } from '../../../../services/user.service';

const mockCourses: ICourseDto[] = [
    {
        id: 1,
        name: 'Javascript'
    },
    {
        id: 2,
        name: 'C#'
    }
];

let mockUsers: IUserDto[] = [];
let mockusersInCourse: IUserDto[] = [];

const mockisAdmin = jest.fn().mockImplementation(() => {
    return Promise.resolve(true);
});
const mockgetAllUsers = jest.fn().mockImplementation(() => {
    return Promise.resolve<IUserDto[]>(mockUsers);
});
jest.mock('./../../../../services/user.service.ts', () => {
    return jest.fn().mockImplementation(() => {
        return {
            isAdmin: mockisAdmin,
            getAll: mockgetAllUsers
        }
    });
});

const mockgetAll = jest.fn().mockImplementation(() => {
    return Promise.resolve<ICourseDto[]>(mockCourses);
});
const mockgetById = jest.fn().mockImplementation((i: number) => {
    return Promise.resolve(mockCourses.find(c => c.id == i));
});
const mockcourseUsers = jest.fn().mockImplementation(() => {
    return Promise.resolve(mockusersInCourse);
});
jest.mock('./../../../../services/course.service.ts', () => {
    return jest.fn().mockImplementation(() => {
        return {
            getAll: mockgetAll,
            getById: mockgetById,
            getUsers: mockcourseUsers
        }
    })
})

describe('Connect users tests', () => {
    const props = {
        course: mockCourses[0],
        updateUsers: jest.fn()
    };

    beforeEach(() => {        
        mockUsers = [{
            id: 1,
            firstName: 'Sebastian',
            lastName: 'Tegel',
            email: 'sebastian.tegel@gmail.com',
            password: ''
        },
        {
            id: 2,
            firstName: 'Hanna',
            lastName: 'Tegel',
            email: 'hannat@kth.se',
            password: ''
        },
        {
            id: 3,
            firstName: 'Test',
            lastName: 'Person',
            email: 'test.person@gmail.com',
            password: ''
        },
        {
            id: 4,
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'jane.doe@gmail.com',
            password: ''
        }];

        mockusersInCourse = [];
    });

    it('should render without crashing', () => {
        shallow(<SetUsers {...props} />);
    });

    it('should show a list of users', async() => {
        let wrapper = mount<SetUsers>(<SetUsers {...props} />);

        await wrapper.instance().componentDidMount();
        wrapper.update();

        expect(wrapper.state('isAdmin')).toBeTruthy();
        expect(wrapper.state('users').length).toBeGreaterThan(0);
    });

    it('should show the course name', async() => {
        let wrapper = shallow<SetUsers>(<SetUsers {...props} />);

        await wrapper.instance().componentDidMount();

        expect(wrapper.find('.course-title').text()).toEqual("Vald kurs: " + mockCourses[0].name);
    });

    it('should add user to course', async() => {
        let wrapper = mount<SetUsers>(<SetUsers {...props} />);

        await wrapper.instance().componentDidMount();
        wrapper.update();

        let numberOfUsers = wrapper.state('users').length;

        wrapper.instance().addUser(mockUsers[1].id);
        wrapper.update();
        
        expect(wrapper.state('users').length).toBe(numberOfUsers - 1);
        expect(wrapper.state('usersInCourse').length).toBe(1);
    });

    it('should remove user from course', async() => {
        let wrapper = mount<SetUsers>(<SetUsers {...props} />);

        await wrapper.instance().componentDidMount();
        wrapper.update();

        wrapper.instance().addUser(mockUsers[1].id);
        wrapper.update();

        expect(wrapper.state('usersInCourse').length).toBeGreaterThan(0);

        let numberOfUsersInCourse = wrapper.state('usersInCourse').length;

        wrapper.instance().removeUser(wrapper.state('usersInCourse')[0].id);
        wrapper.update();
        
        expect(wrapper.state('usersInCourse').length).toBe(numberOfUsersInCourse - 1);
        expect(wrapper.state('users').length).toBe(4);
    });

    it('should not contains user doubles', async() => {
        mockcourseUsers.mockImplementation(() => {
            return Promise.resolve([
                {
                    id: 2,
                    firstName: 'Hanna',
                    lastName: 'Tegel',
                    email: 'hannat@kth.se',
                    password: ''
                },
                {
                    id: 3,
                    firstName: 'Test',
                    lastName: 'Person',
                    email: 'test.person@gmail.com',
                    password: ''
                }
            ]);
        });

        let wrapper = mount<SetUsers>(<SetUsers {...props} />);

        await wrapper.instance().componentDidMount();
        wrapper.update();

        expect(wrapper.state('isAdmin')).toBeTruthy();
        
        expect(wrapper.state('users').length).toBe(2);
        expect(wrapper.state('usersInCourse').length).toBe(2);
    });
});