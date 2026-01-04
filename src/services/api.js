import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
const API_HOST = 'v3.football.api-sports.io';
const BASE_URL = 'https://v3.football.api-sports.io';

// Configuration Axios
const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'x-rapidapi-key': API_KEY, 
        'x-rapidapi-host': API_HOST,
    },
    timeout: 10000, // 10sec
});

// Cache systeme 
const checkCache = async (key, ttlInSeconds) => {
    try {
        const cached = await AsyncStorage.getItem(key);
        if (!cached) return null;

        const { data, timestamp } = JSON.parse(cached);
        const now = Date.now();
        const age = (now - timestamp) / 1000;

        if (age < ttlInSeconds) {
            console.log(`Recuperation cache ${key}`);
            return data;
        } else {
            await AsyncStorage.removeItem(key);
            return null;
        }
    } catch (e) {
        return null;
    }
};

const setCache = async (key, data) => {
    try {
        const payload = JSON.stringify({ data, timestamp: Date.now() });
        await AsyncStorage.setItem(key, payload);
    } catch (e) {
        console.error("Erreur du cache", e);
    }
};

// Fetch avec usage de cache pour economiser l'api
const fetchFromApi = async (endpoint, params = {}, ttl = 300) => {
    const queryString = new URLSearchParams(params).toString();
    const cacheKey = `${endpoint}?${queryString}`;

    // Verification du cache
    const cachedData = await checkCache(cacheKey, ttl);
    if (cachedData) return cachedData;

    // pas de cache =  fetch API
    try {
        console.log(`Appel API: ${endpoint}`, params);
        const response = await apiClient.get(endpoint, { params });
        
        const data = response.data.response;
        
        if (data) {
            await setCache(cacheKey, data);
            return data;
        }
        return [];
    } catch (error) {
        console.error(`Erreur ${endpoint}:`, error.response?.data || error.message);
        return [];
    }
};



export const getLiveMatches = async () => {
    const data = await fetchFromApi('fixtures', { live: 'all' }, 60);
    return data.map(match => ({
        id: match.fixture.id.toString(),
        homeTeam: match.teams.home.name,
        awayTeam: match.teams.away.name,
        score: `${match.goals.home ?? 0} - ${match.goals.away ?? 0}`,
        time: `${match.fixture.status.elapsed}'`,
        status: 'Live',
        league: match.league.name,
        homeLogo: match.teams.home.logo,
        awayLogo: match.teams.away.logo,
        leagueLogo: match.league.logo
    }));
};

export const getMatchesByDate = async (date) => {
    const today = new Date().toISOString().split('T')[0];
    const isToday = date === today;
    const ttl = isToday ? 60 : 3600; 

    const data = await fetchFromApi('fixtures', { date: date }, ttl);

    return data.map(match => ({
        id: match.fixture.id.toString(),
        league: { 
            id: match.league.id, 
            name: match.league.name, 
            logo: match.league.logo 
        },
        teams: { 
            home: { name: match.teams.home.name, logo: match.teams.home.logo }, 
            away: { name: match.teams.away.name, logo: match.teams.away.logo } 
        },
        goals: { 
            home: match.goals.home, 
            away: match.goals.away 
        },
        fixture: { 
            status: { short: match.fixture.status.short, elapsed: match.fixture.status.elapsed }, 
            date: match.fixture.date 
        }
    }));
};

export const getUpcomingMatches = async () => {
    const data = await fetchFromApi('fixtures', { next: '20' }, 1800);
    return data.map(match => {
        const date = new Date(match.fixture.date);
        const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return {
            id: match.fixture.id.toString(),
            homeTeam: match.teams.home.name,
            awayTeam: match.teams.away.name,
            time: timeString,
            status: 'Upcoming',
            league: match.league.name,
            homeLogo: match.teams.home.logo,
            awayLogo: match.teams.away.logo,
            leagueLogo: match.league.logo
        };
    });
};


export const getTeamDetails = async (teamId) => {
    const teamData = await fetchFromApi('teams', { id: teamId }, 86400);
    const squadData = await fetchFromApi('players/squad', { team: teamId }, 86400);

    if (!teamData[0]) return null;

    const team = teamData[0].team;
    const venue = teamData[0].venue;
    const squadRaw = squadData[0]?.players || [];

    const groupedSquad = [
        { title: 'Goalkeepers', data: squadRaw.filter(p => p.position === 'Goalkeeper') },
        { title: 'Defenders', data: squadRaw.filter(p => p.position === 'Defender') },
        { title: 'Midfielders', data: squadRaw.filter(p => p.position === 'Midfielder') },
        { title: 'Forwards', data: squadRaw.filter(p => p.position === 'Attacker') },
    ].map(section => ({
        ...section,
        data: section.data.map(p => ({
            id: p.id.toString(),
            name: p.name,
            number: p.number || '-',
            image: p.photo,
            rating: '-' 
        }))
    }));

    return {
        id: team.id.toString(),
        name: team.name,
        country: team.country,
        logo: team.logo,
        stadium: venue.name,
        squad: groupedSquad
    };
};