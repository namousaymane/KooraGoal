export const MOCK_LIVE_MATCHES = [
    {
        id: '1',
        homeTeam: 'Man City',
        awayTeam: 'Liverpool',
        score: '2 - 1',
        time: '75\'',
        status: 'Live',
        league: 'Premier League',
        homeLogo: 'https://media.api-sports.io/football/teams/50.png',
        awayLogo: 'https://media.api-sports.io/football/teams/40.png',
        leagueLogo: 'https://media.api-sports.io/football/leagues/39.png'
    },
    {
        id: '2',
        homeTeam: 'Real Madrid',
        awayTeam: 'Barcelona',
        score: '0 - 0',
        time: '15\'',
        status: 'Live',
        league: 'La Liga',
        homeLogo: 'https://media.api-sports.io/football/teams/541.png',
        awayLogo: 'https://media.api-sports.io/football/teams/529.png',
        leagueLogo: 'https://media.api-sports.io/football/leagues/140.png'
    }
];

export const MOCK_UPCOMING_MATCHES = [
    {
        id: '3',
        homeTeam: 'Arsenal',
        awayTeam: 'Chelsea',
        time: '20:00',
        status: 'Upcoming',
        league: 'Premier League',
        homeLogo: 'https://media.api-sports.io/football/teams/42.png',
        awayLogo: 'https://media.api-sports.io/football/teams/49.png',
        leagueLogo: 'https://media.api-sports.io/football/leagues/39.png'
    },
    {
        id: '4',
        homeTeam: 'Juventus',
        awayTeam: 'AC Milan',
        time: '20:45',
        status: 'Upcoming',
        league: 'Serie A',
        homeLogo: 'https://media.api-sports.io/football/teams/496.png',
        awayLogo: 'https://media.api-sports.io/football/teams/489.png',
        leagueLogo: 'https://media.api-sports.io/football/leagues/135.png'
    }
];

export const MOCK_MATCHES_BY_DATE = [
    {
        id: '5',
        league: { id: 39, name: 'Premier League', logo: 'https://media.api-sports.io/football/leagues/39.png' },
        teams: { home: { name: 'Man United', logo: 'https://media.api-sports.io/football/teams/33.png' }, away: { name: 'Spurs', logo: 'https://media.api-sports.io/football/teams/47.png' } },
        goals: { home: 1, away: 1 },
        fixture: { status: { short: 'FT', elapsed: 90 }, date: new Date().toISOString() }
    },
    {
        id: '6',
        league: { id: 61, name: 'Ligue 1', logo: 'https://media.api-sports.io/football/leagues/61.png' },
        teams: { home: { name: 'PSG', logo: 'https://media.api-sports.io/football/teams/85.png' }, away: { name: 'Marseille', logo: 'https://media.api-sports.io/football/teams/81.png' } },
        goals: { home: 3, away: 0 },
        fixture: { status: { short: 'FT', elapsed: 90 }, date: new Date().toISOString() }
    }
];
