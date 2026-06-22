import { MaterialCommunityIcons } from '@expo/vector-icons'
import React from 'react'
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native'

type SectionHeaderProps = {
  title: string
  subtitle?: string
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
    </View>
  )
}

type TagChipProps = {
  label: string
  active?: boolean
}

export function TagChip({ label, active = false }: TagChipProps) {
  return (
    <View style={[styles.chip, active ? styles.activeChip : styles.inactiveChip]}>
      <Text style={[styles.chipText, active ? styles.activeChipText : styles.inactiveChipText]}>{label}</Text>
    </View>
  )
}

type ButtonProps = {
  label: string
  icon?: string
  onPress?: () => void
  variant?: 'primary' | 'secondary'
  style?: ViewStyle
}

export function ActionButton({ label, icon, onPress, variant = 'primary', style }: ButtonProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.button, variant === 'secondary' ? styles.secondaryButton : styles.primaryButton, pressed && styles.buttonPressed, style]}>
      <Text style={[styles.buttonText, variant === 'secondary' ? styles.secondaryButtonText : styles.primaryButtonText]}>{label}</Text>
      {icon ? <MaterialCommunityIcons name={icon as any} size={18} color={variant === 'secondary' ? '#065F46' : '#FFFFFF'} style={styles.buttonIcon} /> : null}
    </Pressable>
  )
}

export function InfoStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoStat}>
      <Text style={styles.infoValue}>{value}</Text>
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  sectionHeader: {
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  sectionTitle: {
    color: '#064E3B',
    fontSize: 20,
    fontWeight: '900',
  },
  sectionSubtitle: {
    color: '#166534',
    fontSize: 12,
  },
  chip: {
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 10,
    marginBottom: 10,
  },
  activeChip: {
    backgroundColor: '#064E3B',
  },
  inactiveChip: {
    backgroundColor: '#F5FDF7',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  activeChipText: {
    color: '#FFFFFF',
  },
  inactiveChipText: {
    color: '#0F766E',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  primaryButton: {
    backgroundColor: '#10B981',
  },
  secondaryButton: {
    backgroundColor: '#EAF7EE',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '800',
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#065F46',
  },
  buttonIcon: {
    marginLeft: 8,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  infoStat: {
    backgroundColor: '#F5FBF7',
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    minWidth: 96,
    marginRight: 10,
  },
  infoValue: {
    color: '#064E3B',
    fontSize: 16,
    fontWeight: '900',
  },
  infoLabel: {
    color: '#14532D',
    fontSize: 11,
    marginTop: 6,
    textAlign: 'center',
  },
})
