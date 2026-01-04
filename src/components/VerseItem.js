import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const VerseItem = ({ verse, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.verseContainer, isSelected && styles.selectedVerse]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.verseHeader}>
        <Text style={styles.verseNumber}>{verse.verse}</Text>
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <Text style={styles.selectedIcon}>✓</Text>
          </View>
        )}
      </View>
      <Text style={styles.verseText}>{verse.text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  verseContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedVerse: {
    borderColor: '#4A6FA5',
    backgroundColor: '#F0F7FF',
    elevation: 4,
  },
  verseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  verseNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A6FA5',
    backgroundColor: '#E8F0FE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    overflow: 'hidden',
  },
  selectedIndicator: {
    backgroundColor: '#4A6FA5',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIcon: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  verseText: {
    fontSize: 18,
    lineHeight: 28,
    color: '#333',
    textAlign: 'left',
  },
});

export default VerseItem;
