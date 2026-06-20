import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";

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
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Step </th>
                    <th>Connection</th>
                    <th>Event</th>
                    <th>Effect</th>
                    <th>Coins</th>
                </tr>
            </thead>
            <tbody>
                {steps.slice(0, revealedSteps).map((step, index) => {
                    return (
                        <tr key={step.connectionId}>
                            <td>{index+1}</td>
                            <td>from {step.fromStationName} to {step.toStationName} on {step.line} line</td>
                            <td>{step.event.name}</td>
                            <td>{step.event.effect > 0 ? '+' : ''}{step.event.effect}{' '}</td>
                            <td>{step.coinsAfterStep} </td>
                        </tr>
                    );
                })}
            </tbody>
        </Table>
        {allRevealed && <Button className="mt-3" onClick={onDone}> See result summary</Button>}
    </>);
}

ExecutionPhase.propTypes = {
    result: PropTypes.object.isRequired,
    onDone: PropTypes.func.isRequired

};

export default ExecutionPhase;
