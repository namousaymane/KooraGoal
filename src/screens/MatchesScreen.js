import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, LayoutAnimation, Platform, UIManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../theme/colors';
import MatchCard from '../components/MatchCard';

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

const DATES = [
  { day: 'Sam', date: '28 Oct' },
  { day: 'Dim', date: '29 Oct' },
  { day: 'Lun', date: '30 Oct' },
  { day: 'Auj', date: '31 Oct', active: true },
  { day: 'Mer', date: '01 Nov' },
  { day: 'Jeu', date: '02 Nov' },
  { day: 'Ven', date: '03 Nov' },
];

// --- 2. NOUVEAU COMPOSANT : LE GROUPE DE LIGUE (Header + Liste) ---
const LeagueGroup = ({ item }) => {
  const [collapsed, setCollapsed] = useState(false); // Ouvert par défaut

  const toggleCollapse = () => {
    // Animation fluide native
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCollapsed(!collapsed);
  };

  return (
    <View style={styles.leagueCardContainer}>
      {/* HEADER CLIQUABLE */}
      <TouchableOpacity onPress={toggleCollapse} style={styles.sectionHeader} activeOpacity={0.7}>
        <View style={styles.sectionHeaderLeft}>
          <Image source={{ uri: item.logo }} style={styles.leagueLogo} />
          <Text style={styles.sectionTitle}>{item.title}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.data.length}</Text>
          </View>
        </View>
        <Ionicons 
          name={collapsed ? "chevron-down" : "chevron-up"} 
          size={20} 
          color={THEME.textSecondary} 
        />
      </TouchableOpacity>

      {/* CONTENU (Liste des matchs) - Caché si collapsed est true */}
      {!collapsed && (
        <View style={styles.matchesList}>
          {item.data.map((match) => (
            <View key={match.id} style={styles.matchWrapper}>
               {/* On désactive le style "Card" par défaut de MatchCard ici pour éviter le look "boite dans une boite" si nécessaire,
                   mais pour l'instant on garde le style par défaut qui est très bien. */}
               <MatchCard match={match} onPress={() => {}} />
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default function MatchesScreen() {
  const [groupedMatches, setGroupedMatches] = useState([]);

  useEffect(() => {
    const grouped = Object.values(MOCK_MATCHES.reduce((acc, match) => {
      if (!acc[match.league.id]) {
        acc[match.league.id] = {
          id: match.league.id, // Important pour la FlatList key
          title: match.league.name,
          logo: match.league.logo,
          data: []
        };
      }
      acc[match.league.id].data.push(match);
      return acc;
    }, {}));

    setGroupedMatches(grouped);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
      {/* TOP BAR */}
      <View style={styles.topBar}>
        <View style={styles.logoContainer}>
           <Ionicons name="football" size={24} color={THEME.primary} />
           <Text style={styles.appTitle}>KOORAGOAL!</Text>
        </View>
        <View style={styles.iconsContainer}>
          <TouchableOpacity style={styles.iconBtn}><Ionicons name="search" size={22} color="#FFF" /></TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}><Ionicons name="trophy-outline" size={22} color="#FFF" /></TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}><Ionicons name="calendar-outline" size={22} color="#FFF" /></TouchableOpacity>
        </View>
      </View>

      {/* CALENDAR SLIDER */}
      <View style={styles.calendarContainer}>
        <FlatList
          horizontal
          data={DATES}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.day}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={[styles.dateItem, item.active && styles.dateItemActive]}>
              <Text style={[styles.dateDay, item.active && styles.dateTextActive]}>{item.day}</Text>
              <Text style={[styles.dateNum, item.active && styles.dateTextActive]}>{item.date}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* LISTE PRINCIPALE DES LIGUES */}
      <FlatList
        data={groupedMatches}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <LeagueGroup item={item} />}
        contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  
  // Styles Top Bar & Calendar (Inchangés)
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10 },
  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  appTitle: { color: THEME.text, fontSize: 20, fontWeight: '900', marginLeft: 8, fontStyle: 'italic', letterSpacing: -0.5 },
  iconsContainer: { flexDirection: 'row' },
  iconBtn: { marginLeft: 16 },
  
  calendarContainer: { paddingVertical: 15 },
  dateItem: { backgroundColor: '#1E1E1E', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 16, marginRight: 10, alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  dateItemActive: { backgroundColor: THEME.primary, borderColor: THEME.primary },
  dateDay: { color: THEME.textSecondary, fontSize: 12, marginBottom: 4 },
  dateNum: { color: THEME.text, fontWeight: 'bold', fontSize: 14 },
  dateTextActive: { color: '#000', fontWeight: 'bold' },

  // --- NOUVEAUX STYLES POUR LE GROUPEMENT ---
  
  // L'encadré principal autour de la ligue
  leagueCardContainer: {
    backgroundColor: '#151515', // Un poil plus clair que le fond noir
    borderRadius: 20,
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#2A2A2A',
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
  sectionTitle: { color: THEME.text, fontSize: 17, fontWeight: 'bold', marginRight: 10 },
  badge: { backgroundColor: '#333', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { color: THEME.primary, fontSize: 11, fontWeight: 'bold' },

  // Liste des matchs à l'intérieur
  matchesList: {
    marginTop: 5,
  },
  matchWrapper: {
    marginBottom: 4, // Petit espace entre les cartes de match
  }
});