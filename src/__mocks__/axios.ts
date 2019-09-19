export default {
    get: jest.fn(() => Promise.resolve({ data: {}, statusText: 'OK' }))
};