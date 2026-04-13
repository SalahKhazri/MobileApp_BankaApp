// src/screens/RegisterScreen.js
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { Button, Input } from '../components';
import { colors, spacing, radius } from '../utils/theme';

export default function RegisterScreen({ navigation }) {
  const { signUp } = useAuth();
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.fullName) e.fullName = 'Nom obligatoire';
    if (!form.email) e.email = 'Email obligatoire';
    if (!form.phone) e.phone = 'Téléphone obligatoire';
    if (!form.password || form.password.length < 6) e.password = 'Au moins 6 caractères';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Les mots de passe ne correspondent pas';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const { confirmPassword, ...data } = form;
      await signUp(data);
    } catch (err) {
      Alert.alert('Erreur', err.message);
    } finally {
      setLoading(false);
    }
  };

  const set = (key) => (v) => setForm({ ...form, [key]: v });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {/* Back */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.title}>Créer un compte</Text>
        <Text style={styles.subtitle}>Rejoignez Banka et gérez vos finances facilement.</Text>

        <View style={styles.formCard}>
          <Input
            label="Nom complet"
            placeholder="Youssef Alami"
            value={form.fullName}
            onChangeText={set('fullName')}
            error={errors.fullName}
          />
          <Input
            label="Email"
            placeholder="votre@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={set('email')}
            error={errors.email}
          />
          <Input
            label="Téléphone"
            placeholder="+212600000000"
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={set('phone')}
            error={errors.phone}
          />
          <View style={styles.pwdWrap}>
            <Input
              label="Mot de passe"
              placeholder="••••••••"
              secureTextEntry={!showPwd}
              value={form.password}
              onChangeText={set('password')}
              error={errors.password}
            />
            <TouchableOpacity
              onPress={() => setShowPwd(!showPwd)}
              style={styles.eyeBtn}
            >
              <Ionicons
                name={showPwd ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          </View>
          <Input
            label="Confirmer le mot de passe"
            placeholder="••••••••"
            secureTextEntry={!showPwd}
            value={form.confirmPassword}
            onChangeText={set('confirmPassword')}
            error={errors.confirmPassword}
          />

          <Button title="Créer mon compte" onPress={handleRegister} loading={loading} />

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginLinkText}>
              Déjà un compte ?{' '}
              <Text style={{ color: colors.primary }}>Se connecter</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
    paddingBottom: spacing.xl,
  },
  backBtn: {
    marginBottom: spacing.lg,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: spacing.lg,
  },
  formCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pwdWrap: {
    position: 'relative',
  },
  eyeBtn: {
    position: 'absolute',
    right: 14,
    top: 36,
  },
  loginLink: {
    marginTop: spacing.md,
    alignItems: 'center',
  },
  loginLinkText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});