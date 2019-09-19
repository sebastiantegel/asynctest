import React from "react";
import '../testSetup';
import { shallow } from "enzyme";
import Admin from "../components/admin/admin";

const mockisAdmin = jest.fn().mockImplementation(() => {
    return Promise.resolve(false);
});
jest.mock('./../services/user.service.ts', () => {
    return jest.fn().mockImplementation(() => {
        return {
            isAdmin: mockisAdmin
        }
    });
});

describe('Admin tests', () => {
    it('should render without crashing', () => {
        shallow(<Admin />);
    });

    it('should send the user to root url', async () => {
        let spy = jest.spyOn(Admin.prototype, 'sendUserToRoot');

        let wrapper = await shallow<Admin>(<Admin />);

        wrapper.instance().setState({
            isAdmin: true
        });
        wrapper.update();

        await wrapper.instance().checkIsAdmin();

        expect(spy).toHaveBeenCalled();
    });
});