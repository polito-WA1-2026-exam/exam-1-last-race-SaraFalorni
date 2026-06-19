import {useState} from 'react';
import {Alert} from 'react-bootstrap';
import API from '../API.js';
import SetupPhase from './SetupPhase.jsx';
import PlanningPhase from './PlanningPhase.jsx';
import SummaryPhase from './SummaryPhase.jsx';

function GamePage() {
    const [phase, setPhase] = useState('setup'); //phases are 'setup' 'planning' 'execution' 'summary'
    const [game, setGame] = useState(null);
    const [result, setResult] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const beginPlanningPhase = async () => {
        try {
            const game = await API.startGame();
            setGame(game);
            setPhase('planning');
        } catch(err) {
            setErrorMessage(err.error || err.message || "Couldn't start the game");
        }
    };

    const finishPlanningPhase = async (connectionIds) => {
        try {
            const result = await API.submitRoute(connectionIds);
            setResult(result);
            setPhase('summary');
        } catch(err) {
            setErrorMessage(err.error || err.message || "Couldn't submit the route");
        }
    };

    const newGame = () => {
        setGame(null);
        setResult(null);
        setErrorMessage('');
        setPhase('setup');
    }


    return( <>
        {errorMessage && (<Alert variant="danger" dismissible onClose={() => setErrorMessage('')}>{errorMessage}</Alert>)}
        {phase === 'setup' && <SetupPhase onReady={beginPlanningPhase}/>}
        {phase === 'planning' && <PlanningPhase game={game} onSubmit={finishPlanningPhase}/>}
        {phase === 'summary' && <SummaryPhase result={result} onNewGame={newGame}/>}
    </>);
}

export default GamePage;