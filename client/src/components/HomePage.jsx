import PropTypes from 'prop-types';
import {Button} from 'react-bootstrap';
import {useNavigate} from 'react-router';

function HomePage({user}) {
    const navigate = useNavigate();
    return(<>
        <h1>Last Race</h1>
        <p>
            Plan and run a route across the network before time runs out!
            Every game starts with 20 coins.
        </p>
        <h5>How to play</h5>
        <ol>
            <li>In <b>Setup</b>, study the network map and its lines.</li>
            <li>In <b>Planning</b> you get a random start and destination station and 90 seconds.
                The map now hides the lines — rebuild it in your head and pick the connections between stations, in order,
                from the list to form a route from start to destination.</li>
            <li>In <b>Execution</b>, each segment triggers a random event that adds or removes coins.</li>
            <li>In the <b>Result</b>, your remaining coins are your score. An invalid or incomplete
                route scores 0. Reach the destination with as many coins as possible!</li>
        </ol>
        {user && <img src="/img/map-withConnections.svg" alt="Network map" style={{maxWidth:'100%'}}/>}
        {user && <Button onClick={() => navigate('/game')}>Play!</Button>}
    </>);
};

HomePage.propTypes = {
    user: PropTypes.object
};

export default HomePage;