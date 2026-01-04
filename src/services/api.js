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
                // --- LATEST / FEATURED ---
                {
                    id: '1',
                    title: 'Mbappe to Real Madrid: The saga finally concludes with a historic deal.',
                    image: 'https://images.unsplash.com/flagged/photo-1559559403-a902f2a17eea?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                    source: 'Marca',
                    time: '10 min ago',
                    category: 'Transfers',
                    isFeatured: true
                },
                {
                    id: '2',
                    title: 'Champions League Draw: City faces Madrid in potential classic.',
                    image: 'https://unsplash.com/photos/mY2ZHBU6GRk/download?force=true&w=640',
                    source: 'UEFA',
                    time: '30 min ago',
                    category: 'Latest',
                    isFeatured: true
                },
                {
                    id: '3',
                    title: 'Lionel Messi scores stunning free-kick for Inter Miami.',
                    image: 'https://unsplash.com/photos/TsYzva0e2pQ/download?force=true&w=640',
                    source: 'ESPN',
                    time: '1 hour ago',
                    category: 'MLS'
                },

                // --- TRANSFERS ---
                {
                    id: '4',
                    title: 'Liverpool eyes Bayern Munich star Kimmich for midfield revamp.',
                    image: 'https://unsplash.com/photos/1yLt0422fYQ/download?force=true&w=640',
                    source: 'The Athletic',
                    time: '2 hours ago',
                    category: 'Transfers'
                },
                {
                    id: '505',
                    title: 'Osimhen release clause revealed: Premier League clubs on alert.',
                    image: 'https://unsplash.com/photos/dx3KwpxCiJw/download?force=true&w=640',
                    source: 'Sky Italia',
                    time: '3 hours ago',
                    category: 'Transfers'
                },
                {
                    id: '6',
                    title: 'Xabi Alonso stays at Leverkusen: "My job is not done here".',
                    image: 'https://unsplash.com/photos/ZItxALG5_pk/download?force=true&w=640',
                    source: 'Bild',
                    time: '4 hours ago',
                    category: 'Transfers'
                },
                {
                    id: '7',
                    title: 'Neymar return to Santos gathering pace.',
                    image: 'https://unsplash.com/photos/rCD5ZCCcIZU/download?force=true&w=640',
                    source: 'Globo Esporte',
                    time: '5 hours ago',
                    category: 'Transfers'
                },

                // --- PREMIER LEAGUE ---
                {
                    id: '8',
                    title: 'Arsenal 3-1 Liverpool: Gunners blow title race wide open.',
                    image: 'https://unsplash.com/photos/9y1bFevkShQ/download?force=true&w=640',
                    source: 'BBC Sport',
                    time: '6 hours ago',
                    category: 'Premier League'
                },
                {
                    id: '9',
                    title: 'Man Utd injury crisis deepens: Martinez out for 8 weeks.',
                    image: 'https://unsplash.com/photos/a5HB3E0B01g/download?force=true&w=640',
                    source: 'Daily Mail',
                    time: '7 hours ago',
                    category: 'Premier League'
                },
                {
                    id: '10',
                    title: 'Postecoglou: "We will never stop attacking".',
                    image: 'https://unsplash.com/photos/lASP347IMvE/download?force=true&w=640',
                    source: 'Sky Sports',
                    time: 'Yesterday',
                    category: 'Premier League'
                },

                // --- LA LIGA ---
                {
                    id: '11',
                    title: 'Barcelona financial report: Laporta confirms profit.',
                    image: 'https://unsplash.com/photos/yQIsrc3VnM8/download?force=true&w=640',
                    source: 'Mundo Deportivo',
                    time: 'Yesterday',
                    category: 'La Liga'
                },
                {
                    id: '12',
                    title: 'Bellingham equals Ronaldo\'s start at Real Madrid.',
                    image: 'https://unsplash.com/photos/Nlpn996Yksg/download?force=true&w=640',
                    source: 'Marca',
                    time: 'Yesterday',
                    category: 'La Liga'
                },
                {
                    id: '13',
                    title: 'Griezmann extends contract with Atletico until 2026.',
                    image: 'https://unsplash.com/photos/DAbf22aOuUQ/download?force=true&w=640',
                    source: 'AS',
                    time: '2 days ago',
                    category: 'La Liga'
                },

                // --- SERIE A ---
                {
                    id: '14',
                    title: 'Inter Milan thrash Milan 5-1 in the Derby della Madonnina.',
                    image: 'https://images.pexels.com/photos/61143/pexels-photo-61143.jpeg', // User Pexels (Stadium)
                    source: 'Gazzetta',
                    time: '2 days ago',
                    category: 'Serie A'
                },
                {
                    id: '15',
                    title: 'Vlahovic back in goals as Juventus beat Lazio.',
                    image: 'https://images.pexels.com/photos/159555/soccer-football-athlete-player-159555.jpeg', // User Pexels (Player)
                    source: 'Tuttosport',
                    time: '3 days ago',
                    category: 'Serie A'
                },

                // --- BUNDESLIGA ---
                {
                    id: '16',
                    title: 'Harry Kane hat-trick hero again for Bayern.',
                    image: 'https://images.pexels.com/photos/159555/soccer-football-athlete-player-159555.jpeg', // User Pexels (Player)
                    source: 'Kicker',
                    time: '3 days ago',
                    category: 'Bundesliga'
                },
                {
                    id: '17',
                    title: 'Leverkusen remains unbeaten: 33 games and counting.',
                    image: 'https://images.pexels.com/photos/61143/pexels-photo-61143.jpeg', // User Pexels (Stadium)
                    source: 'DW Sports',
                    time: '3 days ago',
                    category: 'Bundesliga'
                },

                // --- LIGUE 1 ---
                {
                    id: '505', // Changed from 5 to 55 to avoid duplicate key error
                    title: 'Osimhen release clause revealed: Premier League clubs on alert.',
                    image: 'https://images.unsplash.com/photo-IorqsMssQH0?w=800&auto=format&fit=crop&q=60', // User Unsplash (Blue/Grey Ball)
                    source: 'Sky Italia',
                    time: '3 hours ago',
                    category: 'Transfers'
                },

                // --- VARIOUS / ANALYSIS ---
                {
                    id: '19',
                    title: 'The Evolution of the False Nine: A Tactical Analysis.',
                    image: 'https://images.pexels.com/photos/1657332/pexels-photo-1657332.jpeg', // Field/Sky
                    source: 'Tifo Football',
                    time: '5 days ago',
                    category: 'Analysis'
                },
                {
                    id: '20',
                    title: 'Xavi\'s tactical masterclass against Atletico Madrid.',
                    image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&auto=format&fit=crop&q=60', // Detailed tactical board
                    source: 'The Athletic',
                    time: '1 week ago',
                    category: 'Analysis'
                },
                {
                    id: '21',
                    title: 'Why the new offside rule could change football forever.',
                    image: 'https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=800&auto=format&fit=crop&q=60', // Referee/Flag
                    source: 'FIFA.com',
                    time: '1 week ago',
                    category: 'Analysis'
                },
                {
                    id: '22',
                    title: 'Top 10 wonderkids to watch in 2024.',
                    image: 'https://images.pexels.com/photos/1657332/pexels-photo-1657332.jpeg', // Field/Sky
                    source: 'Goal.com',
                    time: '2 weeks ago',
                    category: 'Analysis'
                },

                // --- OTHER / MIXED ---
                {
                    id: '23',
                    title: 'Adidas reveals new ball for Euro 2024.',
                    image: 'https://images.unsplash.com/photo-OgqWLzWRSaI?w=800&auto=format&fit=crop&q=60', // User Unsplash (White/Blue Ball)
                    source: 'Hypebeast',
                    time: '6 days ago',
                    category: 'Gear'
                },
                {
                    id: '24',
                    title: 'Cristiano Ronaldo reaches 900 career goals.',
                    image: 'https://images.pexels.com/photos/1657328/pexels-photo-1657328.jpeg', // User Pexels (Group/Celebration)
                    source: 'Al Nassr',
                    time: '1 day ago',
                    category: 'Records'
                },
                {
                    id: '25',
                    title: 'Official: USA to host 2025 Club World Cup.',
                    image: 'https://images.pexels.com/photos/1657332/pexels-photo-1657332.jpeg', // User Pexels (Field/Stadium)
                    source: 'FIFA',
                    time: '3 days ago',
                    category: 'World Cup'
                },
                {
                    id: '26',
                    title: 'De Gea in talks with Saudi clubs.',
                    image: 'https://images.pexels.com/photos/1657328/pexels-photo-1657328.jpeg', // User Pexels (Player)
                    source: 'Fabrizio Romano',
                    time: '2 hours ago',
                    category: 'Transfers'
                },
                {
                    id: '27',
                    title: 'Napoli appoints Calzona as new manager.',
                    image: 'https://images.pexels.com/photos/1657328/pexels-photo-1657328.jpeg', // User Pexels (Manager/Team)
                    source: 'Football Italia',
                    time: '5 hours ago',
                    category: 'Serie A'
                },
                {
                    id: '28',
                    title: 'Brighton posts record profit for 22/23 season.',
                    image: 'https://images.pexels.com/photos/1657332/pexels-photo-1657332.jpeg', // User Pexels (General/Field)
                    source: 'BBC Sport',
                    time: '1 day ago',
                    category: 'Premier League'
                },
                {
                    id: '29',
                    title: 'Weverton saves crucial penalty for Palmeiras.',
                    image: 'https://images.pexels.com/photos/159555/soccer-football-athlete-player-159555.jpeg', // User Pexels (Player)
                    source: 'Globo',
                    time: '2 weeks ago',
                    category: 'Brasileirao'
                },
                {
                    id: '30',
                    title: 'Endrick visits Real Madrid training ground.',
                    image: 'https://images.pexels.com/photos/61143/pexels-photo-61143.jpeg', // User Pexels (Stadium)
                    source: 'Marca',
                    time: '2 weeks ago',
                    category: 'La Liga'
                },
                {
                    id: '31',
                    title: 'Marseille crisis: Gattuso leaves.',
                    image: 'https://images.pexels.com/photos/61143/pexels-photo-61143.jpeg', // User Pexels (Stadium)
                    source: 'L\'Equipe',
                    time: '2 weeks ago',
                    category: 'Ligue 1'
                },
                {
                    id: '32',
                    title: 'Haaland: "I want to win everything with City".',
                    image: 'https://images.pexels.com/photos/159555/soccer-football-athlete-player-159555.jpeg', // User Pexels (Player)
                    source: 'BBC',
                    time: '2 weeks ago',
                    category: 'Premier League'
                },
                {
                    id: '33',
                    title: 'Liverpool youngsters shine in Carabao Cup final.',
                    image: 'https://images.pexels.com/photos/61143/pexels-photo-61143.jpeg', // User Pexels (Stadium)
                    source: 'Anfield Watch',
                    time: '3 weeks ago',
                    category: 'Premier League'
                },
                {
                    id: '34',
                    title: 'Rooney sacked by Birmingham City.',
                    image: 'https://images.pexels.com/photos/61143/pexels-photo-61143.jpeg', // User Pexels (Stadium)
                    source: 'Sky Sports',
                    time: '3 weeks ago',
                    category: 'Championship'
                },
                {
                    id: '35',
                    title: 'Benzema denies rumors of leaving Al Ittihad.',
                    image: 'https://images.pexels.com/photos/159555/soccer-football-athlete-player-159555.jpeg', // User Pexels (Player)
                    source: 'Saudi Gazette',
                    time: '3 weeks ago',
                    category: 'Saudi Pro League'
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
                            { id: '5005', name: 'Jude Bellingham', number: '5', rating: '9.8', image: 'https://media.api-sports.io/football/players/157209.png' },
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
