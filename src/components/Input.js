import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../theme/colors';

export default function Input({ 
  icon, 
  placeholder, 
  value, 
  onChangeText, 
  isPassword = false // Par défaut, ce n'est pas un mot de passe
}) {
  // État local pour gérer la visibilité du mot de passe
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Icône à gauche (Mail, Cadenas...) */}
      <Ionicons name={icon} size={20} color={THEME.textSecondary} style={styles.icon} />
      
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={THEME.textSecondary}
        value={value}
        onChangeText={onChangeText}
        // Si c'est un mot de passe ET qu'on ne veut pas le voir -> secureTextEntry est true
        secureTextEntry={isPassword && !isPasswordVisible}
        autoCapitalize="none"
      />

      {/* Si c'est un champ mot de passe, on affiche l'œil à droite */}
      {isPassword && (
        <TouchableOpacity 
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={isPasswordVisible ? 'eye-off' : 'eye'} // Change l'icône
            size={20}
            color={THEME.textSecondary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E', // Gris foncé
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
    height: 56,
  },
  icon: { marginLeft: 16, marginRight: 12 },
  input: { flex: 1, color: THEME.text, fontSize: 16 },
  eyeIcon: { padding: 10, marginRight: 6 },
});