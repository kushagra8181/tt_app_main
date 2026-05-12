import apiCall from "./api";

const API_BASE_URL = 'http://localhost:7000/v1/tournaments/api';

export const tournamentApi = async () => {
    const response = await apiCall('tournaments/api/get', 'GET');    
    return response;
};

export const createTournamentApi = async (payload: {
    name: string;
    description: string;
    location: string;
    status: string;
    start_time: string;
    end_time: string;
    start_date: string;
    end_date: string;
    registration_end_date: string;
    type: string;
    total_rounds: number;
}) => {
    const response = await apiCall('tournaments/api/create', 'POST', payload);
    return response;
};

export const getTournamentById = async (id: string) => {
    const response = await apiCall(`tournaments/api/get/${id}`, 'GET');    
    return response;
}