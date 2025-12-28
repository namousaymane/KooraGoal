import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { THEME } from '../theme/colors';
import Input from '../components/Input';
import { Ionicons } from '@expo/vector-icons';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // --- Gestion Email / Password ---
  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      let message = "Une erreur est survenue.";
      if (error.code === 'auth/invalid-credential') message = "Identifiants incorrects.";
      else if (error.code === 'auth/email-already-in-use') message = "Email déjà utilisé.";
      else if (error.code === 'auth/weak-password') message = "Mot de passe trop court.";
      Alert.alert('Oups !', message);
    } finally {
      setLoading(false);
    }
  };

  // --- Mock Gestion Social Auth ---
  const handleGoogleLogin = () => {
    Alert.alert("Info", "Bouton factice");
  };

  const handleAppleLogin = () => {
    Alert.alert("Info", "Bouton factice");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* HEADER */}
          <View style={styles.header}>
            <Ionicons name="football" size={40} color={THEME.text} />
            <Text style={styles.title}>KOORAGOAL!</Text>
          </View>

          {/* TOGGLE */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity 
              style={[styles.toggleBtn, !isLogin && styles.toggleActive]} 
              onPress={() => setIsLogin(false)}>
              <Text style={[styles.toggleText, !isLogin && styles.toggleTextActive]}>S'inscrire</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.toggleBtn, isLogin && styles.toggleActive]} 
              onPress={() => setIsLogin(true)}>
              <Text style={[styles.toggleText, isLogin && styles.toggleTextActive]}>Se connecter</Text>
            </TouchableOpacity>
          </View>

          {/* FORMULAIRE CLASSIQUE */}
          <View style={styles.form}>
            <Input 
              icon="mail-outline" 
              placeholder="Email" 
              value={email} 
              onChangeText={setEmail} 
            />
            <Input 
              icon="lock-closed-outline" 
              placeholder="Mot de passe" 
              isPassword={true} // Active l'option "œil"
              value={password} 
              onChangeText={setPassword} 
            />
            
            <TouchableOpacity style={styles.mainButton} onPress={handleAuth} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.mainButtonText}>
                  {isLogin ? 'Se connecter' : "S'inscrire"}
                </Text>
              )}
            </TouchableOpacity>

            {isLogin && (
              <TouchableOpacity style={styles.forgotBtn}>
                <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* SÉPARATEUR */}
          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>Ou continuer avec</Text>
            <View style={styles.line} />
          </View>

          {/* BOUTONS SOCIAUX */}
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
              <Ionicons name="logo-google" size={24} color="#FFF" />
              <Text style={styles.socialText}>Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton} onPress={handleAppleLogin}>
              <Ionicons name="logo-apple" size={24} color="#FFF" />
              <Text style={styles.socialText}>Apple</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background },
  scrollContent: { padding: 24, justifyContent: 'center', minHeight: '100%' },
  
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 40 },
  title: { fontSize: 28, fontWeight: '900', color: THEME.text, marginLeft: 10, fontStyle: 'italic' },
  
  // Toggle
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 4,
    marginBottom: 30,
  },
  toggleBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
  toggleActive: { backgroundColor: THEME.primary },
  toggleText: { color: THEME.textSecondary, fontWeight: '600' },
  toggleTextActive: { color: '#000', fontWeight: 'bold' },

  // Form
  form: { marginTop: 10 },
  mainButton: {
    backgroundColor: THEME.primary,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  mainButtonText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
  forgotBtn: { alignItems: 'center', marginTop: 20 },
  forgotText: { color: THEME.primary, fontSize: 14 },

  // Socials
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  line: { flex: 1, height: 1, backgroundColor: '#333' },
  dividerText: { color: THEME.textSecondary, marginHorizontal: 10, fontSize: 12 },

  socialContainer: { gap: 12 }, // Gap fonctionne sur les RN récents
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333',
    height: 50,
    borderRadius: 12,
    marginBottom: 10
  },
  socialText: {
    color: '#FFF',
    fontWeight: '600',
    marginLeft: 10,
  }
});