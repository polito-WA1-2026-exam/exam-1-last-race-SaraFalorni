import { useState, useEffect } from "react";
import { Table, Alert } from "react-bootstrap";
import API from "../API.js";

function RankingPage() {
    const [ranking, setRanking] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                const ranking = await API.getRanking();
                setRanking(ranking);
            } catch(err) {
                setErrorMessage(err.error || err.message || "Couldn't load ranking");
            }
        };
        fetchRanking();
    }, []);

    return(<>
        <h1 className="pb-3">Ranking</h1>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Player</th>
                    <th>Best score</th>
                </tr>
            </thead>
            <tbody>
                {ranking.map((entry) => {
                    return (
                        <tr key={entry.position}>
                            <td>{entry.position}</td>
                            <td>{entry.username}</td>
                            <td>{entry.bestResult}</td>
                        </tr>
                    )
                })}
            </tbody>
        </Table>
    </>);
}

export default RankingPage;