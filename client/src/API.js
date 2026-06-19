const SERVER_URL = 'http://localhost:3001/api';

const logIn = async (credentials) => {
    const response = await fetch(SERVER_URL + '/sessions', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',  //forward cookie 
        body: JSON.stringify(credentials)
    });
    return handleResponse(response);
};

const getUserInfo = async () => {
    const response = await fetch(SERVER_URL + '/sessions/current', {
        credentials: 'include' //forward cookie
    });
    return handleResponse(response);
};

const logOut = async() => {
    const response = await fetch(SERVER_URL + '/sessions/current', {
        method: 'DELETE',
        credentials: 'include' //forward cookie
    });
    return handleResponse(response);
}

const startGame = async () => {
    const response = await fetch(SERVER_URL + '/games', {
        method: 'POST',
        credentials: 'include'  //forward cookie
    });
    return handleResponse(response);
};

const submitRoute = async (connectionIds) => {
    const response = await fetch(SERVER_URL + '/games/current/route', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',  //forward cookie
        body: JSON.stringify({connectionIds})
    });
    return handleResponse(response);
};

const getRanking = async () => {
    const response = await fetch(SERVER_URL + '/ranking', {
        credentials: 'include',  //forward cookie
    });
    return handleResponse(response);
};

async function handleResponse(response) {
    const contentType = response.headers.get('Content-Type');
    const isJson = contentType && contentType.includes('application/json');
    
    if (response.ok) 
        return isJson ? await response.json() : null; // if body is empty return null
    
    if(isJson) 
        throw await response.json();
    else
        throw new Error(response.statusText || 'Request failed');
}

const API = {logIn, getUserInfo, logOut, startGame, submitRoute, getRanking};
export default API;