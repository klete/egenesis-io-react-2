
import Home from './Home';
import SignInBar from './components/SignInBar/SignInBar';
import { Link } from 'react-router-dom';


describe('<Home />', () => {

    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<Home />);
    });

    it('should render a <SignInBar /> element', () => {        
        expect(wrapper.find(SignInBar)).toHaveLength(1);
    });

});