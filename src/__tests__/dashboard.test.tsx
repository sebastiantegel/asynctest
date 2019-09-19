
import React from "react";
import '../testSetup';
import { shallow, mount } from "enzyme";
import Dashboard, { IDashboardProps } from "../components/helpitems/dashboard";
import moment from 'moment';
import { ICourseDto } from "../services/course.service";
import { IHelpItemDto } from "../services/helpItem.service";

let helpItems: IHelpItemDto[] = [
    { 
        id: 1, 
        user: {
            id: 1,
            firstName: 'Sebastian',
            lastName: 'Tegel',
            email: 'sebastian.tegel@gmail.com',
            password: ''
        },
        course: {
            id: 1,
            name: 'Javascript'
        },
        where: 'Travolta',
        date: moment(),
        comment: 'Testing'
    },
    { 
        id: 2, 
        user: {
            id: 2,
            firstName: 'Hanna',
            lastName: 'Tegel',
            email: 'hannat@kth.se',
            password: ''
        },
        course: {
            id: 1,
            name: 'Javascript'
        },
        where: 'Madonna',
        date: moment(),
        comment: 'Testing away'
    }
]

const mockgetById = jest.fn().mockImplementation(() => {
    return Promise.resolve<ICourseDto>({
        id: 1,
        name: 'Javascript'
    });
});
const mockgetByCourse = jest.fn();
const mockcreate = jest.fn();
const mockdelete = jest.fn();

jest.mock('./../services/course.service.ts',
    () => {
    return jest.fn().mockImplementation(() => {
        return {
            getById: mockgetById
        }
    })
});

jest.mock('./../services/helpItem.service.ts', 
    () => {
    return jest.fn().mockImplementation(() => {
        return {
            getByCourse: mockgetByCourse,
            create: mockcreate,
            _delete: mockdelete
        }
    });
});

describe('Dashboard tests', () => {
    let props: IDashboardProps;

    beforeAll(() => {
        mockgetById.mockClear();
    
    });

    beforeEach(() => {
        props = {
            courseId: 1,
            match: {
                params: {
                    courseId: 1
                }
            }
        }
    });

    it('should render without crashing', async () => {        
        shallow<Dashboard>(<Dashboard {...props} />);
    });

    it('should set courseId', async () => {        
        mockgetById.mockImplementation(() => {
            return Promise.resolve<ICourseDto>({
                id: props.courseId,
                name: 'Javascript'
            });
        });
        
        let wrapper = mount<Dashboard>(<Dashboard {...props} />);
        await wrapper.instance().componentDidMount();
        wrapper.update();

        expect(wrapper.state().course.id).toBe(props.courseId);
    });

    it('should set helpItems', async () => {
        mockgetById.mockImplementation(() => {
            return Promise.resolve<ICourseDto>({
                id: props.courseId,
                name: 'Javascript'
            })
        });

        mockgetByCourse.mockImplementation(() => {
            return Promise.resolve(
                helpItems)
        });

        let wrapper = mount<Dashboard>(<Dashboard {...props} />);
        await wrapper.instance().componentDidMount();
        wrapper.update();

        expect(wrapper.state().helpItems).toHaveLength(2);
    });

    it('should add an item', async() => {
        mockgetById.mockImplementation(() => {
            return Promise.resolve<ICourseDto>({
                id: props.courseId,
                name: 'Javascript'
            })
        });

        mockgetByCourse.mockImplementation(() => {
            return Promise.resolve(
                helpItems)
        });

        mockcreate.mockImplementation(() => {
            return Promise.resolve<IHelpItemDto>({
                id: 17,
                where: 'In the void',
                comment: 'Created by test',
                user: {
                    id: 1,
                    firstName: 'Sebastian',
                    lastName: 'Tegel',
                    email: 'sebastian.tegel@gmail.com',
                    password: ''
                },
                date: moment(),
                course: {
                    id: 1,
                    name: 'Javascript'
                }
            });
        });

        let wrapper = mount<Dashboard>(<Dashboard {...props} />);
        await wrapper.instance().componentDidMount();
        wrapper.update();

        expect(wrapper.state('helpItems').length).toBe(2);

        await wrapper.instance().addItem({
            where: 'In the void',
            comment: 'Added by test'
        });
        wrapper.update();

        expect(wrapper.state('helpItems').length).toBe(3);
        expect(wrapper.state('helpItems')[2].where).toEqual('In the void');
    });

    it('should remove an item', async() => {
        mockgetById.mockImplementation(() => {
            return Promise.resolve<ICourseDto>({
                id: props.courseId,
                name: 'Javascript'
            })
        });

        mockgetByCourse.mockImplementation(() => {
            return Promise.resolve(
                helpItems)
        });

        mockdelete.mockImplementation((i: number) => {
            for(let i = 0; i < helpItems.length; i++) {
                if(helpItems[i].id === i)
                    helpItems.splice(i, 1);
            }
        });

        let wrapper = mount<Dashboard>(<Dashboard {...props} />);
        await wrapper.instance().componentDidMount();
        wrapper.update();

        expect(wrapper.state('helpItems').length).toBe(2);

        await wrapper.instance().removeItem(1);
        wrapper.update();

        expect(wrapper.state('helpItems').length).toBe(1);
        expect(wrapper.state('helpItems')).not.toContain({id: 1});
    });
});