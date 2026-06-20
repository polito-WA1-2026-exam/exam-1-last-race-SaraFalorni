import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { ListGroup, Button } from "react-bootstrap";

function ExecutionPhase({result, onDone}) {
    const [revealedSteps, setRevealedSteps] = useState(0);//counter for number of connection - events pairs showed
    const steps = result.stepsTaken;

    useEffect(() => {
        if(revealedSteps >= steps.length) 
            return;
        const timeoutId = setTimeout(() => setRevealedSteps((oldRevSteps) => oldRevSteps+1),1500);
        return () => clearTimeout(timeoutId); //clean up
    }, [revealedSteps, steps.length]);

    const allRevealed = revealedSteps >= steps.length;

    return(<>
        <h2>Execution Phase</h2>
        <p>Starting coins <b>{result.initialCoins}</b></p>
        <ListGroup>
            {steps.slice(0, revealedSteps).map((step, index) => {
                return (
                    <ListGroup.Item key={step.connectionId}>
                        Step {index+1} on {step.line} line: <b>{step.event.name}{'  '}</b>
                        {step.event.effect > 0 ? '+' : ''}{step.event.effect}{' '}
                        <b>{step.coinsAfterStep} coins</b>
                    </ListGroup.Item>
                );
            })}
        </ListGroup>
        {allRevealed && <Button className="mt-3" onClick={onDone}> See result summary</Button>}
    </>);
}

ExecutionPhase.propTypes = {
    result: PropTypes.object.isRequired,
    onDone: PropTypes.func.isRequired

};

export default ExecutionPhase;
