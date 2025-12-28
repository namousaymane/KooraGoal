import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { THEME } from '../theme/colors';

export default function ProfileScreen() {
  const user = auth.currentUser;

  // Fonction de déconnexion
  const handleLogout = async () => {
    Alert.alert(
      "Déconnexion",
      "Es-tu sûr de vouloir te déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Se déconnecter", 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
            } catch (error) {
              Alert.alert("Erreur", "Impossible de se déconnecter.");
            }
          }
        }
      ]
    );
  };

  const MenuItem = ({ icon, label, value, isDestructive, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuItemLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={20} color={isDestructive ? THEME.error : THEME.primary} />
        </View>
        <Text style={[styles.menuItemLabel, isDestructive && { color: THEME.error }]}>
          {label}
        </Text>
      </View>
      <View style={styles.menuItemRight}>
        {value && <Text style={styles.menuItemValue}>{value}</Text>}
        <Ionicons name="chevron-forward" size={20} color={THEME.textSecondary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* EN-TÊTE PROFIL */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>MON COMPTE</Text>
          <View style={styles.profileCard}>
            <Image 
              source={{ uri: 'https://i.pravatar.cc/150?img=68' }} // Image aléatoire stylée
              style={styles.avatar} 
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Salut, Fan de Foot !</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="pencil" size={16} color={THEME.background} />
            </TouchableOpacity>
          </View>
        </View>

        {/* SECTION GÉNÉRALE */}
        <View style={styles.section}>
          <MenuItem icon="notifications-outline" label="Notifications" onPress={() => {}} />
          <MenuItem icon="settings-outline" label="Paramètres" onPress={() => {}} />
          <MenuItem icon="document-text-outline" label="Conditions d'utilisation" onPress={() => {}} />
          <MenuItem icon="shield-checkmark-outline" label="Politique de confidentialité" onPress={() => {}} />
        </View>

        {/* BOUTON DÉCONNEXION */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background },
  content: { padding: 20 },

  // Header
  header: { marginBottom: 30 },
  headerTitle: { color: THEME.text, fontSize: 14, fontWeight: 'bold', marginBottom: 16, opacity: 0.5 },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  userInfo: { flex: 1 },
  userName: { color: THEME.text, fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  userEmail: { color: THEME.textSecondary, fontSize: 13 },
  editButton: {
    backgroundColor: THEME.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Sections
  section: { marginBottom: 25 },
  sectionTitle: { color: THEME.textSecondary, fontSize: 14, marginBottom: 10, marginLeft: 5 },
  
  // Menu Item
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E1E1E',
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: 12 
  },
  menuItemLabel: { color: THEME.text, fontSize: 15, fontWeight: '500' },
  menuItemRight: { flexDirection: 'row', alignItems: 'center' },
  menuItemValue: { color: THEME.textSecondary, marginRight: 8, fontSize: 14 },

  // Logout Button
  logoutButton: {
    borderWidth: 1,
    borderColor: THEME.error,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  logoutText: { color: THEME.error, fontWeight: 'bold', fontSize: 16 },
});