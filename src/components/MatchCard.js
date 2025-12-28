import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { THEME } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export default function MatchCard({ match, onPress }) {
  const { teams, goals, fixture, league } = match;
  const isLive = fixture.status.short === '1H' || fixture.status.short === '2H' || fixture.status.short === 'HT';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      
      {/* Header de la carte (Ligue & Temps) */}
      <View style={styles.header}>
        <View style={styles.leagueContainer}>
          {league.logo && <Image source={{ uri: league.logo }} style={styles.leagueIcon} />}
          <Text style={styles.leagueName} numberOfLines={1}>{league.name}</Text>
        </View>
        
        {/* Badge Live ou Heure */}
        <View style={[styles.statusBadge, isLive && styles.liveBadge]}>
          <Text style={[styles.statusText, isLive && styles.liveText]}>
            {isLive ? `${fixture.status.elapsed}'` : fixture.status.short}
          </Text>
        </View>
      </View>

      {/* Les Équipes et le Score */}
      <View style={styles.matchContent}>
        
        {/* Équipe Domicile */}
        <View style={styles.teamContainer}>
          <Image source={{ uri: teams.home.logo }} style={styles.logo} resizeMode="contain" />
          <Text style={styles.teamName} numberOfLines={1}>{teams.home.name}</Text>
        </View>

        {/* Score Central */}
        <View style={styles.scoreContainer}>
          <Text style={styles.score}>
            {goals.home ?? 0} - {goals.away ?? 0}
          </Text>
          {isLive && <View style={styles.liveDot} />}
        </View>

        {/* Équipe Extérieur */}
        <View style={styles.teamContainer}>
          <Image source={{ uri: teams.away.logo }} style={styles.logo} resizeMode="contain" />
          <Text style={styles.teamName} numberOfLines={1}>{teams.away.name}</Text>
        </View>

      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    alignItems: 'center',
  },
  leagueContainer: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  leagueIcon: { width: 20, height: 20, marginRight: 8, borderRadius: 10, backgroundColor: '#fff' },
  leagueName: { color: THEME.textSecondary, fontSize: 12, fontWeight: '600' },
  
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#2C2C2E',
  },
  liveBadge: { backgroundColor: 'rgba(204, 255, 0, 0.2)' }, // Vert transparent
  statusText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  liveText: { color: THEME.primary },

  matchContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  
  teamContainer: { alignItems: 'center', width: '30%' },
  logo: { width: 40, height: 40, marginBottom: 8 },
  teamName: { color: THEME.text, fontSize: 12, fontWeight: '500', textAlign: 'center' },
  
  scoreContainer: { alignItems: 'center', width: '30%' },
  score: { fontSize: 28, fontWeight: '900', color: THEME.text, fontVariant: ['tabular-nums'] },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: THEME.error, marginTop: 4 },
});