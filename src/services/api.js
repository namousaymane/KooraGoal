const API_KEY = 'c89a4874b0mshcb3b8b0fe04af49p1b7f25jsn90ef24f845e1';
const API_HOST = 'football-api-7.p.rapidapi.com';
const BASE_URL = 'https://football-api-7.p.rapidapi.com/api/v3';

const fetchFromApi = async (endpoint, params = {}) => {
    try {
        const url = new URL(`${BASE_URL}/${endpoint}`);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'x-rapidapi-key': API_KEY,
                'x-rapidapi-host': API_HOST,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        return json.response;
    } catch (error) {
        console.error('API Request Error:', error);
        return [];
    }
};

export const getLiveMatches = async () => {
    try {
        // Fetch all live matches
        const data = await fetchFromApi('fixtures', { live: 'all' });

        // Map to app format
        return data.map(match => ({
            id: match.fixture.id.toString(),
            homeTeam: match.teams.home.name,
            awayTeam: match.teams.away.name,
            score: `${match.goals.home} - ${match.goals.away}`,
            time: `${match.fixture.status.elapsed}'`,
            status: 'Live',
            league: match.league.name,
            homeLogo: match.teams.home.logo,
            awayLogo: match.teams.away.logo,
            leagueLogo: match.league.logo
        }));
    } catch (error) {
        console.error('getLiveMatches Error:', error);
        return [];
    }
};

export const getUpcomingMatches = async () => {
    try {
        // Fetch next 10 matches relative to current time
        const data = await fetchFromApi('fixtures', { next: '20' });

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
    } catch (error) {
        console.error('getUpcomingMatches Error:', error);
        return [];
    }
};

export const getNews = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: '1',
                    title: 'Mbappe to Real Madrid: The saga finally concludes with a historic deal.',
                    image: 'https://images.unsplash.com/photo-1544366981-43d8d59eeba9?w=600&auto=format&fit=crop&q=60', // User Link
                    source: 'Marca',
                    time: '10 min ago',
                    category: 'Transfers',
                    isFeatured: true
                },
                {
                    id: '2',
                    title: 'Champions League Draw: City faces Madrid in potential classic.',
                    image: 'https://images.unsplash.com/photo-1722812748989-b2e0a4f59355?w=600&auto=format&fit=crop&q=60', // User Link
                    source: 'UEFA',
                    time: '30 min ago',
                    category: 'Latest',
                    isFeatured: true
                },
                {
                    id: '3',
                    title: 'Premier League Title Race: Arsenal, Liverpool, and City separated by 1 point.',
                    image: 'https://images.unsplash.com/photo-1602453870769-970391ee6fc1?w=600&auto=format&fit=crop&q=60', // User Link
                    source: 'BBC Sport',
                    time: '1 hour ago',
                    category: 'Premier League'
                },
                {
                    id: '4',
                    title: 'Messi Magic in Miami: Another last-minute freekick winner.',
                    image: 'https://images.unsplash.com/photo-1544366981-43d8d59eeba9?w=600&auto=format&fit=crop&q=60', // Reusing User Link 1
                    source: 'ESPN',
                    time: '2 hours ago',
                    category: 'MLS'
                },
                {
                    id: '5',
                    title: 'Xabi Alonso decides to stay at Leverkusen despite Liverpool interest.',
                    image: 'https://images.unsplash.com/photo-1722812748989-b2e0a4f59355?w=600&auto=format&fit=crop&q=60', // Reusing User Link 2
                    source: 'Sky Sports',
                    time: '3 hours ago',
                    category: 'Transfers'
                },
                {
                    id: '6',
                    title: 'Injury Update: De Bruyne out for 4 weeks with hamstring issue.',
                    image: 'https://images.unsplash.com/photo-1602453870769-970391ee6fc1?w=600&auto=format&fit=crop&q=60', // Reusing User Link 3
                    source: 'Man City',
                    time: '4 hours ago',
                    category: 'Injuries'
                },
                {
                    id: '7',
                    title: 'Barcelona financial woes continue: Needs new levers for summer window.',
                    image: 'https://images.unsplash.com/photo-1544366981-43d8d59eeba9?w=600&auto=format&fit=crop&q=60',
                    source: 'Sport',
                    time: '5 hours ago',
                    category: 'La Liga'
                },
                {
                    id: '8',
                    title: 'Serie A: Inter Milan extends lead at the top with crucial derby win.',
                    image: 'https://images.unsplash.com/photo-1722812748989-b2e0a4f59355?w=600&auto=format&fit=crop&q=60',
                    source: 'Gazzetta',
                    time: '6 hours ago',
                    category: 'Serie A'
                },
                {
                    id: '9',
                    title: 'Bellingham\'s impact at Real Madrid analyzed: Better than Zidane?',
                    image: 'https://images.unsplash.com/photo-1602453870769-970391ee6fc1?w=600&auto=format&fit=crop&q=60',
                    source: 'The Athletic',
                    time: 'Yesterday',
                    category: 'Analysis',
                    isFeatured: true
                },
                {
                    id: '10',
                    title: 'Harry Kane breaks another Bundesliga scoring record.',
                    image: 'https://images.unsplash.com/photo-1544366981-43d8d59eeba9?w=600&auto=format&fit=crop&q=60',
                    source: 'Bild',
                    time: 'Yesterday',
                    category: 'Bundesliga'
                },
                {
                    id: '11',
                    title: 'Mourinho sacked by Roma: "The Special One" leaves the capital.',
                    image: 'https://images.unsplash.com/photo-1722812748989-b2e0a4f59355?w=600&auto=format&fit=crop&q=60',
                    source: 'Roma Press',
                    time: 'Yesterday',
                    category: 'Serie A'
                },
                {
                    id: '12',
                    title: 'AFCON 2024: Ivory Coast reaches the final in dramatic fashion.',
                    image: 'https://images.unsplash.com/photo-1602453870769-970391ee6fc1?w=600&auto=format&fit=crop&q=60',
                    source: 'CAF',
                    time: '2 days ago',
                    category: 'International'
                },
                {
                    id: '13',
                    title: 'New Format for 2025 Club World Cup announced by FIFA.',
                    image: 'https://images.unsplash.com/photo-1544366981-43d8d59eeba9?w=600&auto=format&fit=crop&q=60',
                    source: 'FIFA',
                    time: '2 days ago',
                    category: 'FIFA'
                },
                {
                    id: '14',
                    title: 'Manchester United takeover complete: Ratcliffe era begins.',
                    image: 'https://images.unsplash.com/photo-1722812748989-b2e0a4f59355?w=600&auto=format&fit=crop&q=60',
                    source: 'Reuters',
                    time: '3 days ago',
                    category: 'Business'
                },
                {
                    id: '15',
                    title: 'Salah returns to Liverpool training ahead of schedule.',
                    image: 'https://images.unsplash.com/photo-1602453870769-970391ee6fc1?w=600&auto=format&fit=crop&q=60',
                    source: 'Liverpool Echo',
                    time: '3 days ago',
                    category: 'Premier League'
                },
                {
                    id: '16',
                    title: 'Wonderkid Endrick scores again for Palmeiras before Real Madrid move.',
                    image: 'https://images.unsplash.com/photo-1544366981-43d8d59eeba9?w=600&auto=format&fit=crop&q=60',
                    source: 'Globo',
                    time: '4 days ago',
                    category: 'Transfers'
                },
                {
                    id: '17',
                    title: 'Women\'s World Cup impact: Record attendance across leagues.',
                    image: 'https://images.unsplash.com/photo-1722812748989-b2e0a4f59355?w=600&auto=format&fit=crop&q=60',
                    source: 'Guardian',
                    time: '4 days ago',
                    category: 'Women\'s Football'
                },
                {
                    id: '18',
                    title: 'Varane announces retirement from international football.',
                    image: 'https://images.unsplash.com/photo-1602453870769-970391ee6fc1?w=600&auto=format&fit=crop&q=60',
                    source: 'L\'Equipe',
                    time: '5 days ago',
                    category: 'International'
                },
                {
                    id: '19',
                    title: 'Top 10 Kits of the 23/24 Season Ranked.',
                    image: 'https://images.unsplash.com/photo-1544366981-43d8d59eeba9?w=600&auto=format&fit=crop&q=60',
                    source: 'Versus',
                    time: '5 days ago',
                    category: 'Lifestyle'
                },
                {
                    id: '20',
                    title: 'Tactical Analysis: How Girona is shocking La Liga.',
                    image: 'https://images.unsplash.com/photo-1722812748989-b2e0a4f59355?w=600&auto=format&fit=crop&q=60',
                    source: 'Tifo',
                    time: '1 week ago',
                    category: 'Analysis'
                }
            ]);
        }, 500);
    })
}

export const getFollowedItems = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                teams: [
                    { id: '1', name: 'Real Madrid', country: 'Spain', logo: 'https://media.api-sports.io/football/teams/541.png' },
                    { id: '2', name: 'Man City', country: 'England', logo: 'https://media.api-sports.io/football/teams/50.png' }
                ],
                players: [
                    { id: '1', name: 'Jude Bellingham', team: 'Real Madrid', image: 'https://media.api-sports.io/football/players/157209.png' },
                    { id: '2', name: 'Erling Haaland', team: 'Man City', image: 'https://media.api-sports.io/football/players/1100.png' }
                ]
            })
        }, 500);
    })
}

export const getTeamDetails = async (teamId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: teamId,
                name: 'Real Madrid',
                country: 'Spain',
                logo: 'https://media.api-sports.io/football/teams/541.png',
                squad: [
                    {
                        title: 'Goalkeepers',
                        data: [
                            { id: '1', name: 'Thibaut Courtois', number: '1', rating: '9.1', image: 'https://media.api-sports.io/football/players/44.png' },
                            { id: '13', name: 'Andriy Lunin', number: '13', rating: '7.5', image: 'https://media.api-sports.io/football/players/30409.png' },
                        ]
                    },
                    {
                        title: 'Defenders',
                        data: [
                            { id: '4', name: 'David Alaba', number: '4', rating: '8.5', image: 'https://media.api-sports.io/football/players/738.png' },
                            { id: '3', name: 'Éder Militão', number: '3', rating: '8.2', image: 'https://media.api-sports.io/football/players/50125.png' },
                            { id: '2', name: 'Dani Carvajal', number: '2', rating: '7.9', image: 'https://media.api-sports.io/football/players/748.png' },
                        ]
                    },
                    {
                        title: 'Midfielders',
                        data: [
                            { id: '5', name: 'Jude Bellingham', number: '5', rating: '9.8', image: 'https://media.api-sports.io/football/players/157209.png' },
                            { id: '8', name: 'Toni Kroos', number: '8', rating: '8.9', image: 'https://media.api-sports.io/football/players/756.png' },
                            { id: '10', name: 'Luka Modrić', number: '10', rating: '8.7', image: 'https://media.api-sports.io/football/players/757.png' },
                        ]
                    },
                    {
                        title: 'Forwards',
                        data: [
                            { id: '7', name: 'Vinícius Júnior', number: '7', rating: '9.2', image: 'https://media.api-sports.io/football/players/50130.png' },
                            { id: '11', name: 'Rodrygo', number: '11', rating: '8.6', image: 'https://media.api-sports.io/football/players/60338.png' },
                        ]
                    }
                ]
            });
        }, 500);
    });
};

export const getMatchDetails = async (matchId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: matchId,
                homeTeam: { name: 'Real Madrid', logo: 'https://media.api-sports.io/football/teams/541.png' },
                awayTeam: { name: 'Barcelona', logo: 'https://media.api-sports.io/football/teams/529.png' },
                score: '2 - 1',
                time: "74'",
                status: 'Live',
                league: 'La Liga • 2023/24'
            });
        }, 500);
    });
};

export const getMatchStats = async (matchId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { label: 'Ball Possession', home: '55%', away: '45%', homeValue: 0.55, awayValue: 0.45 },
                { label: 'Total Shots', home: '12', away: '8', homeValue: 12, awayValue: 8 },
                { label: 'Shots on Target', home: '5', away: '3', homeValue: 5, awayValue: 3 },
                { label: 'Corner Kicks', home: '7', away: '2', homeValue: 7, awayValue: 2 },
                { label: 'Offsides', home: '2', away: '4', homeValue: 2, awayValue: 4 },
                { label: 'Fouls', home: '10', away: '12', homeValue: 10, awayValue: 12 },
                { label: 'Yellow Cards', home: '1', away: '3', homeValue: 1, awayValue: 3 },
            ]);
        }, 500);
    });
};

export const getH2H = async (team1, team2) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 'h1', home: 'Barcelona', away: 'Real Madrid', score: '2 - 1', date: '19 Mar 23', league: 'La Liga' },
                { id: 'h2', home: 'Real Madrid', away: 'Barcelona', score: '3 - 1', date: '16 Oct 22', league: 'La Liga' },
                { id: 'h3', home: 'Real Madrid', away: 'Barcelona', score: '0 - 1', date: '02 Mar 23', league: 'Copa' },
                { id: 'h4', home: 'Real Madrid', away: 'Barcelona', score: '0 - 4', date: '20 Mar 22', league: 'La Liga' },
            ]);
        }, 500);
    });
};
