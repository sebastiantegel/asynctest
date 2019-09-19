import React from 'react';
import '../testSetup';
import { shallow, mount } from 'enzyme';
import ConnectUser from '../components/admin/connect/connectUsers';
import { ICourseDto } from '../services/course.service';
import SetUsers from '../components/admin/connect/setUsers';

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

const mockisAdmin = jest.fn().mockImplementation(() => {
    return Promise.resolve(true);
});
jest.mock('./../services/user.service.ts', () => {
    return jest.fn().mockImplementation(() => {
        return {
            isAdmin: mockisAdmin
        }
    });
});

const mockgetAll = jest.fn().mockImplementation(() => {
    return Promise.resolve<ICourseDto[]>(mockCourses);
});
const mockgetById = jest.fn().mockImplementation((i: number) => {
    return Promise.resolve(mockCourses.find(c => c.id == i));
});
jest.mock('./../services/course.service.ts', () => {
    return jest.fn().mockImplementation(() => {
        return {
            getAll: mockgetAll,
            getById: mockgetById
        }
    })
})

describe('Connect users tests', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    })

    it('should render without crashing', () => {
        shallow(<ConnectUser />);
    });

    it('should load courses', async() => {
        let wrapper = mount<ConnectUser>(<ConnectUser />);

        await wrapper.instance().componentDidMount();
        wrapper.update();

        expect(wrapper.state('isAdmin')).toEqual(true);
        expect(wrapper.state('courses').length).toBe(2);
    });

    it('should show the setusers component when course is selected', async() => {
        let wrapper = shallow<ConnectUser>(<ConnectUser />);

        await wrapper.instance().componentDidMount();
        wrapper.update();

        expect(wrapper.state('isAdmin')).toEqual(true);
        expect(wrapper.state('courses').length).toBe(2);

        const event = {
            target: {
              value: '1',
            }
          } as React.ChangeEvent<HTMLSelectElement>;

        await wrapper.instance().courseSelected(event);
        wrapper.update();

        expect(wrapper.find(SetUsers)).toHaveLength(1);
    });

    it('should NOT show the setusers component when course is not selected', async() => {
        let wrapper = shallow<ConnectUser>(<ConnectUser />);

        await wrapper.instance().componentDidMount();
        wrapper.update();

        expect(wrapper.state('isAdmin')).toEqual(true);
        expect(wrapper.state('courses').length).toBe(2);

        expect(wrapper.find(SetUsers)).toHaveLength(0);
    });
});