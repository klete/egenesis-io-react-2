import SignInBar from './SignInBar';
import SignInForm from '../SignInForm/SignInForm';
import { Link } from 'react-router-dom';



describe('<SignInBar />', () => {

    let wrapper;
    const mockFn = jest.fn();

    beforeEach(() => {
        wrapper = shallow(<SignInBar loginHandler={mockFn} />);
    });

    it('should render a <SignInForm /> element', () => {        
        expect(wrapper.find(SignInForm)).toHaveLength(1);
    });

    it('should render two <Link /> elements', () => {        
        expect(wrapper.find(Link)).toHaveLength(2);
    });

});