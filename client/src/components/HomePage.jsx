import PropTypes from 'prop-types';
import {Button} from 'react-bootstrap';
import {useNavigate} from 'react-router';

function HomePage({user}) {
    const navigate = useNavigate();
    return(<>
        <h1>HomePage Last Race</h1>
        <p>Game instructions: TO ADD</p>
        {user && <Button onClick={() => navigate('/game')}>Play!</Button>}
    </>);
};

HomePage.propTypes = {
    user: PropTypes.object
};

export default HomePage;