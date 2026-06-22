import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as DocumentPicker from 'expo-document-picker'
import React, { useEffect, useRef } from 'react'
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native'

export type SelectedFile = {
  uri: string
  name: string
  mimeType?: string | null
  size?: number | null
}

type UploadCardProps = {
  label: string
  file: SelectedFile | null
  onFileSelected: (file: SelectedFile | null) => void
  required?: boolean
  showValidation?: boolean
  warningText?: string
  description?: string
}

const ACCEPTED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

export function UploadCard({
  label,
  file,
  onFileSelected,
  required = false,
  showValidation = false,
  warningText,
  description = 'Tap upload to pick a document from your device.',
}: UploadCardProps) {
  const pop = useRef(new Animated.Value(1)).current

  useEffect(() => {
    if (!file) {
      return
    }

    Animated.sequence([
      Animated.spring(pop, { toValue: 1.03, useNativeDriver: true, friction: 5, tension: 120 }),
      Animated.spring(pop, { toValue: 1, useNativeDriver: true, friction: 5, tension: 120 }),
    ]).start()
  }, [file, pop])

  async function handlePickFile() {
    const result = await DocumentPicker.getDocumentAsync({
      type: ACCEPTED_TYPES,
      copyToCacheDirectory: true,
      multiple: false,
    })

    if (result.canceled) {
      return
    }

    const selectedAsset = result.assets?.[0]
    if (!selectedAsset) {
      return
    }

    onFileSelected({
      uri: selectedAsset.uri,
      name: selectedAsset.name ?? label,
      mimeType: selectedAsset.mimeType ?? null,
      size: selectedAsset.size ?? null,
    })
  }

  const hasFile = Boolean(file)
  const showError = showValidation && required && !hasFile

  return (
    <Animated.View
      style={[
        styles.card,
        hasFile && styles.cardUploaded,
        showError && styles.cardError,
        { transform: [{ scale: pop }] },
      ]}
    >
      <View style={styles.headerRow}>
        <View style={[styles.iconWrap, hasFile && styles.iconWrapUploaded]}>
          <MaterialCommunityIcons name={hasFile ? 'check-circle' : 'file-document'} size={20} color="#ffffff" />
        </View>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>{label}</Text>
          <Text style={styles.subtitle}>{description}</Text>
        </View>
        {hasFile ? (
          <View style={styles.badge}>
            <MaterialCommunityIcons name="check-circle" size={14} color="#10b981" />
            <Text style={styles.badgeText}>Uploaded</Text>
          </View>
        ) : (
          <View style={styles.pill}>
            <Text style={styles.pillText}>{required ? 'Required' : 'Optional'}</Text>
          </View>
        )}
      </View>

      <View style={styles.body}>
        {hasFile ? (
          <>
            <Text style={styles.fileLabel}>Selected file</Text>
            <Text style={styles.fileName} numberOfLines={1}>
              {file?.name}
            </Text>
          </>
        ) : (
          <View>
            <Text style={styles.placeholderTitle}>No file selected yet</Text>
            <Text style={styles.placeholderText}>PDF, JPG, PNG, or DOC files are supported.</Text>
          </View>
        )}
      </View>

      {showError ? <Text style={styles.warningText}>{warningText ?? 'Upload required to continue.'}</Text> : null}

      <View style={styles.footerRow}>
        <Pressable style={styles.uploadButton} onPress={handlePickFile}>
          <MaterialCommunityIcons name="cloud-upload" size={17} color="#ffffff" />
          <Text style={styles.uploadButtonText}>{hasFile ? 'Re-upload' : 'Upload'}</Text>
        </Pressable>
        <Text style={styles.acceptedText}>Accepted: PDF, JPG, PNG, DOC</Text>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#cfe8d5',
    borderStyle: 'dashed',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
    gap: 14,
  },
  cardUploaded: {
    borderColor: '#10b981',
    backgroundColor: '#f0fbf5',
  },
  cardError: {
    borderColor: '#ef4444',
    backgroundColor: '#fff7f7',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapUploaded: {
    backgroundColor: '#059669',
  },
  titleWrap: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0f5132',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 17,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#dcfce7',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#059669',
  },
  pill: {
    backgroundColor: '#edf9f1',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0f5132',
  },
  body: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2efe5',
  },
  fileLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    color: '#6b7280',
    fontWeight: '800',
  },
  fileName: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: '900',
    color: '#0f5132',
  },
  placeholderTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0f5132',
  },
  placeholderText: {
    marginTop: 4,
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 17,
  },
  warningText: {
    color: '#b91c1c',
    fontSize: 12,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    flexWrap: 'wrap',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#10b981',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 14,
  },
  uploadButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
  },
  acceptedText: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '600',
  },
})
