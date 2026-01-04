import React, { useState, useEffect, useRef } from 'react';
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

// --- 1. MOCK DATA (Note: J'ai changé les dates pour qu'elles correspondent à "Aujourd'hui" pour le test) ---
const TODAY_ISO = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
const MOCK_MATCHES = [
  {
    id: '1',
    league: { id: 39, name: 'Premier League', logo: 'https://media.api-sports.io/football/leagues/39.png' },
    teams: { home: { name: 'Man United', logo: 'https://media.api-sports.io/football/teams/33.png' }, away: { name: 'Man City', logo: 'https://media.api-sports.io/football/teams/50.png' } },
    goals: { home: 0, away: 0 },
    fixture: { status: { short: 'NS' }, date: TODAY_ISO } // Match d'aujourd'hui
  },
  {
    id: '2',
    league: { id: 39, name: 'Premier League', logo: 'https://media.api-sports.io/football/leagues/39.png' },
    teams: { home: { name: 'Arsenal', logo: 'https://media.api-sports.io/football/teams/42.png' }, away: { name: 'Chelsea', logo: 'https://media.api-sports.io/football/teams/49.png' } },
    goals: { home: 2, away: 1 },
    fixture: { status: { short: 'FT' }, date: '2023-10-25' } // Match passé
  },
  {
    id: '3',
    league: { id: 2, name: 'Champions League', logo: 'https://media.api-sports.io/football/leagues/2.png' },
    teams: { home: { name: 'Real Madrid', logo: 'https://media.api-sports.io/football/teams/541.png' }, away: { name: 'Napoli', logo: 'https://media.api-sports.io/football/teams/492.png' } },
    goals: { home: 1, away: 1 },
    fixture: { status: { short: '2H', elapsed: 78 }, date: TODAY_ISO } // Match d'aujourd'hui
  },
];

// --- COMPOSANT LEAGUE GROUP (Inchangé) ---
const LeagueGroup = ({ item, theme, isDarkMode }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCollapsed(!collapsed);
  };

  return (
    <View style={[styles.leagueCardContainer, { backgroundColor: theme.card, borderColor: isDarkMode ? '#2A2A2A' : '#E5E5EA' }]}>
      <TouchableOpacity onPress={toggleCollapse} style={styles.sectionHeader} activeOpacity={0.7}>
        <View style={styles.sectionHeaderLeft}>
          <Image source={{ uri: item.logo }} style={styles.leagueLogo} />
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{item.title}</Text>
          <View style={[styles.badge, { backgroundColor: isDarkMode ? '#333' : '#F2F2F7' }]}>
            <Text style={[styles.badgeText, { color: theme.primary }]}>{item.data.length}</Text>
          </View>
        </View>
        <Ionicons name={collapsed ? "chevron-down" : "chevron-up"} size={20} color={theme.textSecondary} />
      </TouchableOpacity>
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
  const { t, language } = useLanguage(); // language sert pour le formatage des dates
  
  const [groupedMatches, setGroupedMatches] = useState([]);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // 1. État pour la date sélectionnée (par défaut : aujourd'hui YYYY-MM-DD)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [calendarDates, setCalendarDates] = useState([]);
  const flatListRef = useRef(null);

  // 2. Génération dynamique des dates
  useEffect(() => {
    const generateDates = () => {
      const dates = [];
      // On génère par exemple 3 jours avant et 7 jours après
      for (let i = -3; i <= 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        
        const isoDate = d.toISOString().split('T')[0];
        
        // Formatage pour l'affichage (ex: "Lun", "30 Oct")
        // Utilisation de Intl.DateTimeFormat pour supporter FR/EN automatiquement
        const dayName = new Intl.DateTimeFormat(language === 'fr' ? 'fr-FR' : 'en-US', { weekday: 'short' }).format(d);
        const dayNum = new Intl.DateTimeFormat(language === 'fr' ? 'fr-FR' : 'en-US', { day: '2-digit', month: 'short' }).format(d);
        
        // Vérifier si c'est aujourd'hui pour afficher "Auj" ou "Today"
        const isToday = i === 0;
        const displayDay = isToday ? t('today') : dayName.charAt(0).toUpperCase() + dayName.slice(1);

        dates.push({
          fullDate: isoDate, // Pour la logique (API)
          displayDay: displayDay, // Pour l'affichage (Jeu, Ven, Auj)
          displayDate: dayNum, // Pour l'affichage (31 Oct)
          isToday: isToday
        });
      }
      return dates;
    };

    setCalendarDates(generateDates());
  }, [language, t]); // Recalcule si la langue change

  // 3. Scroll automatique vers "Aujourd'hui" au chargement
  useEffect(() => {
    if (calendarDates.length > 0 && flatListRef.current) {
        // Index 3 correspond à "Aujourd'hui" car on commence la boucle à -3
        setTimeout(() => {
            flatListRef.current.scrollToIndex({ index: 3, animated: true, viewPosition: 0.5 });
        }, 500);
    }
  }, [calendarDates]);

  // 4. Filtrage des matchs
  useEffect(() => {
    const filteredMatches = MOCK_MATCHES.filter(match => {
      // Filtre Recherche
      const lowQuery = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || (
        match.teams.home.name.toLowerCase().includes(lowQuery) ||
        match.teams.away.name.toLowerCase().includes(lowQuery) ||
        match.league.name.toLowerCase().includes(lowQuery)
      );

      // Filtre Date
      // Note: match.fixture.date doit être au format YYYY-MM-DD ou ISO
      const matchDate = match.fixture.date.split('T')[0]; 
      const matchesDate = matchDate === selectedDate;

      return matchesSearch && matchesDate;
    });

    // Groupement par ligue
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
  }, [searchQuery, selectedDate]); // Déclenche quand la date ou la recherche change

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
            onPress={() => alert(t('calendar_coming_soon'))}
          >
            <Ionicons name="calendar-outline" size={22} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* SEARCH BAR */}
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

      {/* DYNAMIC CALENDAR SLIDER */}
      <View style={styles.calendarContainer}>
        <FlatList
          ref={flatListRef}
          horizontal
          data={calendarDates}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.fullDate}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          getItemLayout={(data, index) => (
            { length: 70, offset: 70 * index, index } // Aide pour le scrollToIndex (largeur approx de l'item + margin)
          )}
          renderItem={({ item }) => {
            const isActive = item.fullDate === selectedDate;
            return (
              <TouchableOpacity 
                style={[
                  styles.dateItem,
                  { backgroundColor: theme.card, borderColor: isDarkMode ? '#333' : '#E5E5EA' },
                  isActive && { backgroundColor: theme.primary, borderColor: theme.primary }
                ]}
                onPress={() => setSelectedDate(item.fullDate)}
              >
                <Text style={[
                    styles.dateDay, 
                    { color: theme.textSecondary }, 
                    isActive && styles.dateTextActive
                ]}>
                    {item.displayDay}
                </Text>
                <Text style={[
                    styles.dateNum, 
                    { color: theme.text }, 
                    isActive && styles.dateTextActive
                ]}>
                    {item.displayDate}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* MATCH LIST OR EMPTY STATE */}
      <FlatList
        data={groupedMatches}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <LeagueGroup item={item} theme={theme} isDarkMode={isDarkMode} />}
        contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Text style={{color: theme.textSecondary, textAlign: 'center', marginTop: 50}}>
                    Aucun match pour cette date
                </Text>
            </View>
        }
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  // ... (Garde tes styles existants, ils sont bons)
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10 },
  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  iconsContainer: { flexDirection: 'row' },
  iconBtn: { marginLeft: 16 },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 10,
    borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16 },
  
  // Styles Calendrier
  calendarContainer: { paddingVertical: 15 },
  dateItem: { 
    borderRadius: 12, 
    paddingVertical: 10, 
    width: 60, // Fixer la largeur aide pour le scrollToIndex
    marginRight: 10, 
    alignItems: 'center', 
    borderWidth: 1 
  },
  dateDay: { fontSize: 11, marginBottom: 4, textTransform: 'capitalize' },
  dateNum: { fontWeight: 'bold', fontSize: 13 },
  dateTextActive: { color: '#FFF', fontWeight: 'bold' }, // Blanc sur fond primaire

  // Styles League & Match (inchangés)
  leagueCardContainer: { borderRadius: 20, marginBottom: 20, padding: 10, borderWidth: 1, overflow: 'hidden' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 10, marginBottom: 5 },
  sectionHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  leagueLogo: { width: 28, height: 28, marginRight: 12, borderRadius: 14, backgroundColor: '#fff' },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', marginRight: 10 },
  badge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontSize: 11, fontWeight: 'bold' },
  matchesList: { marginTop: 5 },
  matchWrapper: { marginBottom: 4 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center' }
});