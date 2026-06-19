import {Container, Navbar} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { LoginButton, LogoutButton } from './Auth.jsx';

function NavHeader({user, logout}) {
    return(
        <Navbar bg = 'primary'>
            <Container>
                <Navbar.Brand>Last race</Navbar.Brand>
                <div className="d-flex align-items-center gap-3">
                    {user && <Navbar.Text className='text-light'>Logged in as {user.username}</Navbar.Text>}
                    {user ? <LogoutButton logout={logout} /> : <LoginButton/>}
                </div>
            </Container> 
        </Navbar>
    );
}

NavHeader.propTypes = {
    user: PropTypes.object,
    logout: PropTypes.func.isRequired
};

export default NavHeader;