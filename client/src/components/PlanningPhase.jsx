import PropTypes from "prop-types";

function PlanningPhase({game}) {
    return(<>
        <h2>Planning Phase</h2>
        <p>Get from <b>{game.startStation.name}</b> to <b>{game.destinationStation.name}</b></p>
        <p>{game.durationSeconds} seconds - {game.availableConnections.length} connections available</p>
        <img src="/img/map-noConnections.svg" alt="Stations map" style={{maxWidth:'100%'}}/>
    </>);
}

PlanningPhase.propTypes = {game: PropTypes.func.isRequired};

export default PlanningPhase;