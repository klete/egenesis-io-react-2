import React from 'react';
import Enzyme, { configure, shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';


Enzyme.configure({
    adapter: new Adapter()
});


let storage = {};

const localStorageMock = {
    getItem: jest.fn(item => {
        return storage[item]
    }),
    setItem: jest.fn((item, value) => storage[item] = JSON.stringify(value)),
    removeItem: jest.fn(item => delete storage[item]),
    clear: jest.fn(storage = {})
};

global.localStorage = localStorageMock;

global.React = React;
global.shallow = shallow;
global.mount = mount;
global.render = render;

