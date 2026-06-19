import {Button, Alert} from 'react-bootstrap';
import PropTypes from 'prop-types';

function SummaryPhase({result, onNewGame}) {
    return(<>
        <h2>Result</h2>
        {result.valid ? <p>destination reached, score: <b>{result.finalScore}</b> coins</p> 
         : <Alert variant="warning">Invalid or incomplete route : {result.reason}, score: 0 coins</Alert>}
        <Button onClick={onNewGame}> Start new game</Button>
    </>);
}

SummaryPhase.propTypes = {
    result: PropTypes.object.isRequired,
    onNewGame: PropTypes.func.isRequired
};

export default SummaryPhase;