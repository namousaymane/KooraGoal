import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ImageBackground
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

// Contextes existants
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

// Composants
import RotatingLogo from '../components/RotatingLogo';

const { width } = Dimensions.get('window');

// --- COMPOSANTS UI ---

// 1. Carte Hero (Match Center)
const ModernCard = ({ title, subtitle, icon, onPress, theme, height = 160, backgroundImage }) => {
  const CardContent = () => (
    <View style={styles.cardInner}>
      <View style={styles.cardTextContainer}>
        <View style={styles.iconCircle}>
          {icon}
        </View>
        <View>
          <Text style={[styles.cardTitle, { color: '#FFF' }]}>{title}</Text>
          <Text style={[styles.cardSubtitle, { color: 'rgba(255,255,255,0.8)' }]}>{subtitle}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.card,
        { 
          backgroundColor: theme.card, 
          height: height,
          shadowColor: theme.text,
        }
      ]}
    >
      {backgroundImage ? (
        <ImageBackground source={{ uri: backgroundImage }} style={styles.imageBackground} imageStyle={{ borderRadius: 24 }}>
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.85)']}
            style={styles.gradientOverlay}
          >
            <CardContent />
          </LinearGradient>
        </ImageBackground>
      ) : (
        <View style={[styles.cardNoImage, { backgroundColor: theme.card }]}>
           <CardContent /> 
        </View>
      )}
    </TouchableOpacity>
  );
};

// 2. Carte Info (News)
const InfoCard = ({ title, subtitle, icon, theme, onPress }) => (
    <TouchableOpacity 
        style={[styles.infoCard, { backgroundColor: theme.card }]} 
        onPress={onPress}
        activeOpacity={0.8}
    >
        <View style={styles.infoContent}>
            <View style={[styles.infoIconBox, { backgroundColor: theme.background }]}>
                {icon}
            </View>
            <View style={{ flex: 1 }}>
                <Text style={[styles.infoTitle, { color: theme.text }]}>{title}</Text>
                <Text style={[styles.infoSub, { color: theme.textSecondary }]}>{subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
        </View>
    </TouchableOpacity>
);

// 3. Bouton Carré (Grille)
const SquareButton = ({ title, icon, color, theme, onPress }) => (
  <TouchableOpacity 
    style={[styles.squareBtn, { backgroundColor: theme.card }]} 
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={[styles.squareIconContainer, { backgroundColor: color + '20' }]}> 
       {/* Ajoute transparence hex '20' */}
      {React.cloneElement(icon, { color: color })}
    </View>
    <Text style={[styles.squareTitle, { color: theme.text }]}>{title}</Text>
  </TouchableOpacity>
);

export default function HomeScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { t, language } = useLanguage();
  
  // Données utilisateur (Statique pour l'instant car pas d'AuthContext)
  const userName = "Champion"; 
  const welcomeText = language === 'fr' ? "Bienvenue," : "Welcome,";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: theme.textSecondary }]}>
             {welcomeText}
          </Text>
          <Text style={[styles.userName, { color: theme.text }]}>
             {userName} 👋
          </Text>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        
        {/* MATCH CENTER (HERO IMAGE) */}
        <Text style={[styles.sectionLabel, { color: theme.text }]}>Match Center</Text>
        <ModernCard
          title={t('live_matches') || "Live Matches"} 
          subtitle={t('upcoming_matches') || "Upcoming Matches"}
          theme={theme}
          height={200}
          // Image de stade sombre et pro
          backgroundImage="https://images.unsplash.com/photo-1522778119026-d647f0565c6a?q=80&w=2070&auto=format&fit=crop"
          icon={<Ionicons name="football" size={30} color="#FFF" />}
          onPress={() => navigation.navigate('Matches')}
        />

        <View style={styles.spacer} />

        {/* NEWS SECTION */}
        <Text style={[styles.sectionLabel, { color: theme.text }]}>{t('nav_news') || "News"}</Text>
        <InfoCard
          title={t('cat_latest') || "Latest"} 
          subtitle={t('search_news') || "Read the news"}
          theme={theme}
          icon={<MaterialCommunityIcons name="newspaper-variant-outline" size={24} color={theme.primary} />}
          onPress={() => navigation.navigate('News')}
        />

        <View style={styles.spacer} />

        {/* EXPLORER GRID */}
        <Text style={[styles.sectionLabel, { color: theme.text }]}>Explorer</Text>
        <View style={styles.gridContainer}>
          <SquareButton 
            title={t('cat_leagues') || "Leagues"} 
            theme={theme} 
            color="#FFD700" 
            icon={<Ionicons name="trophy" size={24} />} 
            onPress={() => console.log('Ligues')}
          />
          <SquareButton 
            title={t('nav_favorites') || "Favorites"} 
            theme={theme} 
            color="#FF6B6B" 
            icon={<Ionicons name="heart" size={24} />} 
            onPress={() => navigation.navigate('Favorites')}
          />
          <SquareButton 
            title={t('cat_transfers') || "Transfers"} 
            theme={theme} 
            color="#4ECDC4"
            icon={<Ionicons name="swap-horizontal" size={24} />} 
            onPress={() => console.log('Transferts')}
          />
          <SquareButton 
            title={t('nav_profile') || "Profile"} 
            theme={theme} 
            color="#A06CD5" // Violet
            icon={<Ionicons name="person" size={24} />} 
            onPress={() => navigation.navigate('ProfileTab')}
          />
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
    padding: 20,
    paddingBottom: 40,
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    marginTop: 10,
    paddingHorizontal: 10, // Petit padding latéral pour aligner avec le reste si besoin
  },
  greeting: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  userName: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  logoContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 8,
    borderRadius: 50,
  },

  // Section Styles
  sectionLabel: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
    marginLeft: 4,
  },
  spacer: {
    height: 30,
  },

  // Hero Card Styles
  card: {
    width: '100%',
    borderRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  imageBackground: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    flex: 1,
    borderRadius: 24,
    justifyContent: 'flex-end',
    padding: 20,
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  cardNoImage: {
    padding: 20, 
    justifyContent: 'flex-end', 
    height: '100%', 
    borderRadius: 24
  },

  // Info Card Styles
  infoCard: {
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  infoSub: {
    fontSize: 13,
  },

  // Grid Styles
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  squareBtn: {
    width: (width - 40 - 15) / 2, // Largeur dynamique (Ecran - Padding - Gap) / 2
    height: 100,
    borderRadius: 20,
    padding: 15,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  squareIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  squareTitle: {
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 4,
  },
});