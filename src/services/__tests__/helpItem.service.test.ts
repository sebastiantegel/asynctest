import moment from 'moment';
import axios from '../../__mocks__/axios';
import helpItemService from '../helpItem.service';

it('should get help items', async () => {
    axios.get.mockImplementationOnce(() => {
        return Promise.resolve({
            statusText: 'OK',
            data: [
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
            
            })
        }
    );

    let service = await new helpItemService().getByCourse(1);

    expect(service).toHaveLength(2);
});