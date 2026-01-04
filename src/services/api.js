import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = process.env.API_KEY
const API_HOST = 'v3.football.api-sports.io'; 
const BASE_URL = 'https://v3.football.api-sports.io';

// Configuration Axios
const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': API_HOST,
    },
    timeout: 10000, // 10 secondes max
});

// --- SYSTÈME DE CACHE INTELLIGENT ---
// checkCache vérifie si on a une donnée sauvegardée valide
const checkCache = async (key, ttlInSeconds) => {
    try {
        const cached = await AsyncStorage.getItem(key);
        if (!cached) return null;

        const { data, timestamp } = JSON.parse(cached);
        const now = Date.now();
        const age = (now - timestamp) / 1000;

        if (age < ttlInSeconds) {
            return data;
        } else {
            // Cache expiré, on nettoie
            await AsyncStorage.removeItem(key);
            return null;
        }
    } catch (e) {
        return null;
    }
};

// setCache sauvegarde la donnée avec l'heure actuelle
const setCache = async (key, data) => {
    try {
        const payload = JSON.stringify({ data, timestamp: Date.now() });
        await AsyncStorage.setItem(key, payload);
    } catch (e) {
        console.error("Cache Error", e);
    }
};

// Fonction générique de fetch avec cache
const fetchFromApi = async (endpoint, params = {}, ttl = 300) => {
    // Créer une clé unique pour le cache basée sur l'endpoint et les params
    const queryString = new URLSearchParams(params).toString();
    const cacheKey = `${endpoint}?${queryString}`;

    // 1. Vérifier le cache
    const cachedData = await checkCache(cacheKey, ttl);
    if (cachedData) return cachedData;

    // 2. Si pas de cache, appel API
    try {
        console.log(`🔵 API Call: ${endpoint}`, params);
        const response = await apiClient.get(endpoint, { params });
        
        const data = response.data.response;
        
        // 3. Sauvegarder dans le cache si la réponse est valide
        if (data) {
            await setCache(cacheKey, data);
            return data;
        }
        return [];
    } catch (error) {
        console.error(`🔴 Error fetching ${endpoint}:`, error.response?.data || error.message);
        return []; // Retourne un tableau vide en cas d'erreur pour ne pas crash l'app
    }
};

// --- FONCTIONS EXPORTÉES ---

// 1. MATCHS EN DIRECT
export const getLiveMatches = async () => {
    // TTL court : 60 secondes
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

// 2. MATCHS PAR DATE (Pour ton calendrier dynamique)
export const getMatchesByDate = async (date) => {
    // TTL moyen : 1 heure (les scores finaux ne changent plus, les futurs changent peu)
    const data = await fetchFromApi('fixtures', { date: date }, 3600);

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

// 3. PROCHAINS MATCHS (Général)
export const getUpcomingMatches = async () => {
    // Prochains 10 matchs intéressants (on filtre souvent par ligue importante sinon on a des matchs obscurs)
    // Astuce: On demande les 20 prochains pour avoir du choix
    const data = await fetchFromApi('fixtures', { next: '20' }, 1800); // 30 min cache

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

// 4. DÉTAILS D'UNE ÉQUIPE
export const getTeamDetails = async (teamId) => {
    // Double appel : Info équipe + Squad
    // TTL Long : 24 heures (86400 sec)
    
    // Appel 1: Infos
    const teamData = await fetchFromApi('teams', { id: teamId }, 86400);
    // Appel 2: Effectif (Squad)
    const squadData = await fetchFromApi('players/squad', { team: teamId }, 86400);

    if (!teamData[0]) return null;

    const team = teamData[0].team;
    const venue = teamData[0].venue;
    const squadRaw = squadData[0]?.players || [];

    // On transforme le squad API en format "Sections" pour ta FlatList
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
            rating: '-' // L'API squad ne donne pas la note moyenne, il faudrait un autre appel lourd
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

// 5. DÉTAILS DU MATCH
export const getMatchDetails = async (matchId) => {
    const data = await fetchFromApi('fixtures', { id: matchId }, 300); // 5 min cache
    if (!data[0]) return null;
    const match = data[0];

    return {
        id: match.fixture.id.toString(),
        homeTeam: { name: match.teams.home.name, logo: match.teams.home.logo },
        awayTeam: { name: match.teams.away.name, logo: match.teams.away.logo },
        score: `${match.goals.home ?? 0} - ${match.goals.away ?? 0}`,
        time: match.fixture.status.elapsed ? `${match.fixture.status.elapsed}'` : match.fixture.status.short,
        status: match.fixture.status.short, // 'FT', 'NS', '1H'...
        league: `${match.league.name} • ${match.league.season}`
    };
};

// 6. STATISTIQUES DU MATCH
export const getMatchStats = async (matchId) => {
    const data = await fetchFromApi('fixtures/statistics', { fixture: matchId }, 300);
    
    // L'API renvoie un tableau de 2 objets (un pour chaque équipe)
    if (data.length < 2) return [];

    const team1Stats = data[0].statistics;
    const team2Stats = data[1].statistics;

    // On fusionne pour ton format UI
    // Note: On suppose que l'ordre des stats est le même
    return team1Stats.map((stat, index) => {
        const val1 = stat.value === null ? 0 : stat.value;
        const val2 = team2Stats[index].value === null ? 0 : team2Stats[index].value;
        
        // Calcul simple pour les barres de progression (total = 100%)
        let total = 0;
        let homeRatio = 0.5;
        let awayRatio = 0.5;

        // Gestion spécifique pour la possession (déjà en %)
        if (stat.type.includes('Possession')) {
             homeRatio = parseFloat(val1) / 100;
             awayRatio = parseFloat(val2) / 100;
        } else if (typeof val1 === 'number' && typeof val2 === 'number') {
            total = val1 + val2;
            if (total > 0) {
                homeRatio = val1 / total;
                awayRatio = val2 / total;
            }
        }

        return {
            label: stat.type,
            home: val1.toString(),
            away: val2.toString(),
            homeValue: homeRatio,
            awayValue: awayRatio
        };
    });
};

// 7. HEAD TO HEAD (H2H)
export const getH2H = async (team1Id, team2Id) => {
    const h2hString = `${team1Id}-${team2Id}`;
    const data = await fetchFromApi('fixtures/headtohead', { h2h: h2hString, last: 10 }, 86400);

    return data.map(match => ({
        id: match.fixture.id.toString(),
        home: match.teams.home.name,
        away: match.teams.away.name,
        score: `${match.goals.home} - ${match.goals.away}`,
        date: new Date(match.fixture.date).toLocaleDateString(),
        league: match.league.name
    }));
};


// ⚠️ NEWS : L'API FOOTBALL NE DONNE PAS DE NEWS.
// On garde ton mock ici pour ne pas casser la page News.
export const getNews = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: '1',
                    title: 'Mbappe to Real Madrid: The saga finally concludes.',
                    image: 'https://images.unsplash.com/photo-1544366981-43d8d59eeba9?w=600&auto=format&fit=crop&q=60',
                    source: 'Marca',
                    time: '10 min ago',
                    category: 'Transfers',
                    isFeatured: true
                },
                {
                    id: '2',
                    title: 'Champions League: City faces Madrid in potential classic.',
                    image: 'https://images.unsplash.com/photo-1722812748989-b2e0a4f59355?w=600&auto=format&fit=crop&q=60',
                    source: 'UEFA',
                    time: '30 min ago',
                    category: 'Latest',
                    isFeatured: true
                },
                // ... Tu peux garder tes autres mocks ici
            ]);
        }, 500);
    });
};

export const getFollowedItems = async () => {
    // Tu pourrais implémenter ça avec AsyncStorage pour stocker les favoris de l'utilisateur
    // Pour l'instant on garde ton mock
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                teams: [
                    { id: '541', name: 'Real Madrid', country: 'Spain', logo: 'https://media.api-sports.io/football/teams/541.png' },
                    { id: '50', name: 'Man City', country: 'England', logo: 'https://media.api-sports.io/football/teams/50.png' }
                ],
                players: []
            })
        }, 500);
    })
}