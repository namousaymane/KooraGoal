import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, LayoutAnimation, Platform, UIManager, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import MatchCard from '../components/MatchCard';
import RotatingLogo from '../components/RotatingLogo';

// Activation de l'animation fluide sur Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- 1. MOCK DATA (Mêmes données) ---
const MOCK_MATCHES = [
  // PREMIER LEAGUE
  {
    id: '1',
    league: { id: 39, name: 'Premier League', logo: 'https://media.api-sports.io/football/leagues/39.png' },
    teams: { home: { name: 'Man United', logo: 'https://media.api-sports.io/football/teams/33.png' }, away: { name: 'Man City', logo: 'https://media.api-sports.io/football/teams/50.png' } },
    goals: { home: 0, away: 0 },
    fixture: { status: { short: 'NS' }, date: '2023-10-25' }
  },
  {
    id: '2',
    league: { id: 39, name: 'Premier League', logo: 'https://media.api-sports.io/football/leagues/39.png' },
    teams: { home: { name: 'Arsenal', logo: 'https://media.api-sports.io/football/teams/42.png' }, away: { name: 'Chelsea', logo: 'https://media.api-sports.io/football/teams/49.png' } },
    goals: { home: 2, away: 1 },
    fixture: { status: { short: 'FT' }, date: '2023-10-25' }
  },
  // CHAMPIONS LEAGUE
  {
    id: '3',
    league: { id: 2, name: 'Champions League', logo: 'https://media.api-sports.io/football/leagues/2.png' },
    teams: { home: { name: 'Real Madrid', logo: 'https://media.api-sports.io/football/teams/541.png' }, away: { name: 'Napoli', logo: 'https://media.api-sports.io/football/teams/492.png' } },
    goals: { home: 1, away: 1 },
    fixture: { status: { short: '2H', elapsed: 78 }, date: '2023-10-25' }
  },
  {
    id: '4',
    league: { id: 2, name: 'Champions League', logo: 'https://media.api-sports.io/football/leagues/2.png' },
    teams: { home: { name: 'Bayern', logo: 'https://media.api-sports.io/football/teams/21.png' }, away: { name: 'PSG', logo: 'https://media.api-sports.io/football/teams/85.png' } },
    goals: { home: 3, away: 0 },
    fixture: { status: { short: '1H', elapsed: 35 }, date: '2023-10-25' }
  },
  // LIGUE 1
  {
    id: '5',
    league: { id: 61, name: 'Ligue 1', logo: 'https://media.api-sports.io/football/leagues/61.png' },
    teams: { home: { name: 'Marseille', logo: 'https://media.api-sports.io/football/teams/81.png' }, away: { name: 'Lyon', logo: 'https://media.api-sports.io/football/teams/80.png' } },
    goals: { home: 0, away: 0 },
    fixture: { status: { short: 'NS' }, date: '2023-10-25' }
  }
];

// --- 2. NOUVEAU COMPOSANT : LE GROUPE DE LIGUE (Header + Liste) ---
const LeagueGroup = ({ item, theme, isDarkMode }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCollapsed(!collapsed);
  };

  return (
    <View style={[styles.leagueCardContainer, { backgroundColor: theme.card, borderColor: isDarkMode ? '#2A2A2A' : '#E5E5EA' }]}>
      {/* HEADER CLIQUABLE */}
      <TouchableOpacity onPress={toggleCollapse} style={styles.sectionHeader} activeOpacity={0.7}>
        <View style={styles.sectionHeaderLeft}>
          <Image source={{ uri: item.logo }} style={styles.leagueLogo} />
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{item.title}</Text>
          <View style={[styles.badge, { backgroundColor: isDarkMode ? '#333' : '#F2F2F7' }]}>
            <Text style={[styles.badgeText, { color: theme.primary }]}>{item.data.length}</Text>
          </View>
        </View>
        <Ionicons
          name={collapsed ? "chevron-down" : "chevron-up"}
          size={20}
          color={theme.textSecondary}
        />
      </TouchableOpacity>

      {/* CONTENU (Liste des matchs) - Caché si collapsed est true */}
      {!collapsed && (
        <View style={styles.matchesList}>
          {item.data.map((match) => (
            <View key={match.id} style={styles.matchWrapper}>
              <MatchCard match={match} onPress={() => { }} />
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default function MatchesScreen() {
  const { theme, isDarkMode } = useTheme();
  const { t } = useLanguage();
  const [groupedMatches, setGroupedMatches] = useState([]);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const DATES = [
    { day: 'Sat', date: '28 Oct' },
    { day: 'Sun', date: '29 Oct' },
    { day: 'Mon', date: '30 Oct' },
    { day: t('today'), date: '31 Oct', active: true },
    { day: 'Wed', date: '01 Nov' },
    { day: 'Thu', date: '02 Nov' },
    { day: 'Fri', date: '03 Nov' },
  ];

  useEffect(() => {
    // Basic filtering logic
    const filteredMatches = MOCK_MATCHES.filter(match => {
      if (!searchQuery) return true;
      const lowQuery = searchQuery.toLowerCase();
      return (
        match.teams.home.name.toLowerCase().includes(lowQuery) ||
        match.teams.away.name.toLowerCase().includes(lowQuery) ||
        match.league.name.toLowerCase().includes(lowQuery)
      );
    });

    const grouped = Object.values(filteredMatches.reduce((acc, match) => {
      if (!acc[match.league.id]) {
        acc[match.league.id] = {
          id: match.league.id,
          title: match.league.name,
          logo: match.league.logo,
          data: []
        };
      }
      acc[match.league.id].data.push(match);
      return acc;
    }, {}));

    setGroupedMatches(grouped);
  }, [searchQuery]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>

      {/* TOP BAR */}
      <View style={styles.topBar}>
        <View style={styles.logoContainer}>
          <RotatingLogo size={24} withText={true} />
        </View>
        <View style={styles.iconsContainer}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => setSearchVisible(!searchVisible)}
          >
            <Ionicons name="search" size={22} color={theme.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}><Ionicons name="trophy-outline" size={22} color={theme.text} /></TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => {
              // Placeholder for Calendar integration
              alert(t('calendar_coming_soon'));
            }}
          >
            <Ionicons name="calendar-outline" size={22} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* SEARCH BAR (Toggled) */}
      {searchVisible && (
        <View style={[styles.searchContainer, { backgroundColor: theme.card, borderColor: isDarkMode ? '#333' : '#E5E5EA' }]}>
          <Ionicons name="search" size={20} color={theme.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder={t('search_placeholder')}
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      )}

      {/* CALENDAR SLIDER */}
      <View style={styles.calendarContainer}>
        <FlatList
          horizontal
          data={DATES}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.day}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={[
              styles.dateItem,
              { backgroundColor: theme.card, borderColor: isDarkMode ? '#333' : '#E5E5EA' },
              item.active && { backgroundColor: theme.primary, borderColor: theme.primary }
            ]}>
              <Text style={[styles.dateDay, { color: theme.textSecondary }, item.active && styles.dateTextActive]}>{item.day}</Text>
              <Text style={[styles.dateNum, { color: theme.text }, item.active && styles.dateTextActive]}>{item.date}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* LISTE PRINCIPALE DES LIGUES */}
      <FlatList
        data={groupedMatches}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <LeagueGroup item={item} theme={theme} isDarkMode={isDarkMode} />}
        contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Styles Top Bar & Calendar (Inchangés)
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10 },
  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  appTitle: { fontSize: 20, fontWeight: '900', marginLeft: 8, fontStyle: 'italic', letterSpacing: -0.5 },
  iconsContainer: { flexDirection: 'row' },
  iconBtn: { marginLeft: 16 },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16 },

  calendarContainer: { paddingVertical: 15 },
  dateItem: { borderRadius: 12, paddingVertical: 10, paddingHorizontal: 16, marginRight: 10, alignItems: 'center', borderWidth: 1 },
  dateDay: { fontSize: 12, marginBottom: 4 },
  dateNum: { fontWeight: 'bold', fontSize: 14 },
  dateTextActive: { color: '#000', fontWeight: 'bold' },

  // --- NOUVEAUX STYLES POUR LE GROUPEMENT ---

  // L'encadré principal autour de la ligue
  leagueCardContainer: {
    borderRadius: 20,
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    overflow: 'hidden', // Pour que l'animation soit propre
  },

  // Header de la section
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 5,
  },
  sectionHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  leagueLogo: { width: 28, height: 28, marginRight: 12, borderRadius: 14, backgroundColor: '#fff' },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', marginRight: 10 },
  badge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontSize: 11, fontWeight: 'bold' },

  // Liste des matchs à l'intérieur
  matchesList: {
    marginTop: 5,
  },
  matchWrapper: {
    marginBottom: 4, // Petit espace entre les cartes de match
  }
});