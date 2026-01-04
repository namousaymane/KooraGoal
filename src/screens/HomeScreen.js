import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
    ImageBackground
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native'; 
import { useTheme } from '../theme/ThemeContext';
import { auth } from '../services/firebaseConfig'; 

const { width } = Dimensions.get('window');

// Mock pour le test
const MOCK_LIVE_MATCHES = [
    { id: '1', home: 'PSG', away: 'OM', score: '2 - 1', time: '72\'', league: 'Ligue 1', homeLogo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/8/86/Paris_Saint-Germain_Logo.svg/1024px-Paris_Saint-Germain_Logo.svg.png', awayLogo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/4/43/Logo_Olympique_de_Marseille.svg/1200px-Logo_Olympique_de_Marseille.svg.png' },
    { id: '2', home: 'Man City', away: 'Arsenal', score: '0 - 0', time: '15\'', league: 'Premier League', homeLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/1200px-Manchester_City_FC_badge.svg.png', awayLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Arsenal_FC.svg/1200px-Arsenal_FC.svg.png' },
];

export default function HomeScreen({ navigation }) {
    const { theme, isDarkMode } = useTheme();
    
    const [userData, setUserData] = useState({
        displayName: '',
        photoURL: null,
    });

    useFocusEffect(
        useCallback(() => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                setUserData({
                    displayName: currentUser.displayName || 'Utilisateur',
                    photoURL: currentUser.photoURL,
                });
            }
        }, [])
    );

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <View style={{flex: 1, marginRight: 10}}>
                <Text style={[styles.greetingName, { color: theme.text }]} numberOfLines={1}>
                    Bonjour {userData.displayName} 👋
                </Text>
            </View>
            
            <TouchableOpacity 
                style={[styles.profileButton, { backgroundColor: theme.card }]}
                onPress={() => navigation.navigate('Profile')} 
            >
                {userData.photoURL ? (
                    <Image 
                        source={{ uri: userData.photoURL }} 
                        style={styles.headerAvatar} 
                    />
                ) : (
                    <Ionicons name="person" size={20} color={theme.primary} />
                )}
            </TouchableOpacity>
        </View>
    );

    const renderLiveMatchCard = (item) => (
        <TouchableOpacity key={item.id} style={[styles.liveCard, { backgroundColor: theme.card }]} activeOpacity={0.9}>
            <View style={styles.liveHeader}>
                <View style={styles.liveBadge}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveText}>LIVE</Text>
                </View>
                <Text style={[styles.leagueName, { color: theme.textSecondary }]}>{item.league}</Text>
            </View>

            <View style={styles.scoreContainer}>
                <View style={styles.teamContainer}>
                    <Image source={{ uri: item.homeLogo }} style={styles.teamLogo} resizeMode="contain" />
                    <Text style={[styles.teamName, { color: theme.text }]}>{item.home}</Text>
                </View>

                <View style={styles.scoreBoard}>
                    <Text style={[styles.scoreText, { color: theme.text }]}>{item.score}</Text>
                    <Text style={[styles.matchTime, { color: theme.primary }]}>{item.time}</Text>
                </View>

                <View style={styles.teamContainer}>
                    <Image source={{ uri: item.awayLogo }} style={styles.teamLogo} resizeMode="contain" />
                    <Text style={[styles.teamName, { color: theme.text }]}>{item.away}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderSectionTitle = (title, icon) => (
        <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
            {icon && <MaterialCommunityIcons name={icon} size={20} color={theme.primary} />}
        </View>
    );

    const renderMyTeamCard = () => (
        <TouchableOpacity style={[styles.myTeamCard, { backgroundColor: theme.primary }]} activeOpacity={0.9}>
            <ImageBackground 
                source={{uri: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=2070&auto=format&fit=crop'}} 
                style={styles.myTeamBackground}
                imageStyle={{ borderRadius: 16, opacity: 0.3 }}
            >
                <View style={styles.myTeamContent}>
                    <View>
                        <Text style={styles.nextMatchLabel}>Prochain match</Text>
                        <Text style={styles.nextMatchVs}>Real Madrid vs PSG</Text>
                        <Text style={styles.nextMatchDate}>Demain, 21:00</Text>
                    </View>
                    <View style={styles.bellButton}>
                        <Ionicons name="notifications-outline" size={20} color="#FFF" />
                    </View>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
            <StatusBar style={isDarkMode ? "light" : "dark"} />
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {renderHeader()}

                {renderSectionTitle("Matchs en direct", "fire")}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                    {MOCK_LIVE_MATCHES.map(renderLiveMatchCard)}
                </ScrollView>

                {renderSectionTitle("Mon Équipe", "shield-account")}
                {renderMyTeamCard()}

                <View style={styles.quickMenuContainer}>
                    {[
                        { label: 'Classement', icon: 'trophy-outline', color: '#FFB302' },
                        { label: 'Calendrier', icon: 'calendar-outline', color: '#4CD964' },
                        { label: 'Stats', icon: 'bar-chart-outline', color: '#5856D6' },
                        { label: 'Vidéos', icon: 'videocam-outline', color: '#FF2D55' },
                    ].map((menu, index) => (
                        <TouchableOpacity 
                            key={index} 
                            style={[styles.menuItem, { backgroundColor: theme.card, borderColor: isDarkMode ? '#333' : '#E5E5EA' }]}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: menu.color + '20' }]}>
                                <Ionicons name={menu.icon} size={24} color={menu.color} />
                            </View>
                            <Text style={[styles.menuText, { color: theme.text }]}>{menu.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
 
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 10,
  },
  greetingSub: {
    fontSize: 14,
    marginBottom: 4,
  },
  greetingName: {
    fontSize: 24,
    fontWeight: '800', 
  },
  profileButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 0, 
    overflow: 'hidden',
  },
  headerAvatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  
  // TITRES DE SECTION
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 15,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  // LIVE CARDS
  horizontalScroll: {
    paddingLeft: 20,
    marginBottom: 20,
  },
  liveCard: {
    width: width * 0.75,
    padding: 16,
    borderRadius: 16,
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  liveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFF',
    marginRight: 6,
  },
  liveText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  leagueName: {
    fontSize: 12,
    fontWeight: '600',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamContainer: {
    alignItems: 'center',
    width: '30%',
  },
  teamLogo: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  teamName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  scoreBoard: {
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  matchTime: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },

  // MY TEAM CARD
  myTeamCard: {
    marginHorizontal: 20,
    height: 120,
    borderRadius: 16,
    marginBottom: 25,
    overflow: 'hidden',
  },
  myTeamBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  myTeamContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  nextMatchLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  nextMatchVs: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  nextMatchDate: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  bellButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // QUICK MENU
  quickMenuContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  menuItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  menuText: {
    fontWeight: '600',
    fontSize: 14,
  },
});