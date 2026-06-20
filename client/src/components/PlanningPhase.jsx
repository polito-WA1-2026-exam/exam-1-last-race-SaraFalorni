import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import {Button, ListGroup, Row, Col} from 'react-bootstrap';

function PlanningPhase({game, onSubmit}) {
    const [selected, setSelected] = useState([]); //list of chosen connections
    const [timeLeft, setTimeLeft] = useState(game.durationSeconds); //seconds

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimeLeft((oldTime) => (oldTime <= 1 ? 0 : oldTime-1));
        }, 1000);
        return () => clearInterval(intervalId); //clean up
    }, []);

    useEffect(() => {
        if(timeLeft === 0)
            onSubmit(selected);
    }, [timeLeft]);



    const selectConnection = (connectionId) => {
            setSelected((oldSelected) => {
            //if already included it's removed, if not included it's added to previous list
            return oldSelected.includes(connectionId) ? oldSelected.filter((id) => id !== connectionId) : [...oldSelected, connectionId] 
        });
    };

    return(<>
        <h2>Planning Phase</h2>
        <p>Get from <b>{game.startStation.name}</b> to <b>{game.destinationStation.name}</b></p>
        <p>Time left: <b>{timeLeft}</b> seconds</p>
        <img src="/img/map-noConnections.svg" alt="Stations map" style={{maxWidth:'100%'}}/>

        <Row className="mt-3">
            <Col md={6}>
                <h5>Available connections</h5>
                <ListGroup>
                    {game.availableConnections.map( (connection) => {
                        const position = selected.indexOf(connection.connectionId); //if not selected it's -1
                        const isSelected = position !== -1;
                        return(
                            <ListGroup.Item key={connection.connectionId} action active={isSelected} onClick={() => selectConnection(connection.connectionId)}>
                                {connection.station1Name} - {connection.station2Name}
                                {isSelected && <span className="float-end">#{position+1}</span>}
                            </ListGroup.Item>
                        );
                    })}
                </ListGroup>
            </Col>
            <Col md={6}>
                <h5>Selected connections,({selected.length} segments)</h5>
                <ListGroup>
                    {selected.map((id, index) => {
                        const connection = game.availableConnections.find((x) => x.connectionId === id);
                        return (
                            <ListGroup.Item key={id}>
                                {index + 1}. {connection.station1Name} - {connection.station2Name}
                            </ListGroup.Item>
                        );
                    })}
                </ListGroup>
                <Button className="mt-3" onClick={() => onSubmit(selected)} disabled={selected.length === 0}>
                    Submit route
                </Button>
            </Col>
        </Row>
    </>);
}

PlanningPhase.propTypes = {
    game: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired

};

export default PlanningPhase;