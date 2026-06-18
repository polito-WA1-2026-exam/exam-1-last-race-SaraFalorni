import {Container, Navbar} from 'react-bootstrap';

function NavHeader() {
    return(
        <Navbar bg = 'primary'>
            <Container>
                <Navbar.Brand>Last race</Navbar.Brand>
            </Container> 
        </Navbar>
    );
}

export default NavHeader;