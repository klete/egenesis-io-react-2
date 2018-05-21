import React from 'react';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({
    adapter: new Adapter()
})

test('trying to make sure that this works', () => {
    expect(1).toBe(1);
});