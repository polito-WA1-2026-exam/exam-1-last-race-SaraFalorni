import {Button} from 'react-bootstrap';
import PropTypes from 'prop-types';

function SetupPhase({onReady}) {
    return(<>
        <h2>Setup</h2>
        <p>Study the map, when ready click the button and start the game!</p>
        <img src="/img/map-withConnections.svg" alt="Network map" style={{maxWidth:'100%'}}/>
        <div className='mt-3'>
            <Button onClick={onReady}>Start game</Button>
        </div>
    </>);
}

SetupPhase.propTypes = {onReady: PropTypes.func.isRequired};

export default SetupPhase;