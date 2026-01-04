import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Share,
} from 'react-native';
import { bibleApi } from '../api/bibleApi';
import VerseItem from '../components/VerseItem';

const Verses = ({ route, navigation }) => {
  const { bookId, bookName, chapter } = route.params;
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chapterData, setChapterData] = useState(null);
  const [selectedVerses, setSelectedVerses] = useState(new Set());

  useEffect(() => {
    fetchChapter();
  }, []);

  const fetchChapter = async () => {
    try {
      setLoading(true);
      const data = await bibleApi.getChapter(bookId, chapter);
      setChapterData(data);
      setVerses(data.verses || []);
    } catch (error) {
      console.error('Error fetching chapter:', error);
      alert('Failed to load chapter. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVersePress = (verseNumber) => {
    const newSelected = new Set(selectedVerses);
    if (newSelected.has(verseNumber)) {
      newSelected.delete(verseNumber);
    } else {
      newSelected.add(verseNumber);
    }
    setSelectedVerses(newSelected);
  };

  const handleShare = async () => {
    if (selectedVerses.size === 0) return;

    const selected = Array.from(selectedVerses).sort((a, b) => a - b);
    let verseRange = '';
    
    if (selected.length === 1) {
      verseRange = `verse ${selected[0]}`;
    } else {
      // Group consecutive verses
      const ranges = [];
      let start = selected[0];
      let end = selected[0];
      
      for (let i = 1; i < selected.length; i++) {
        if (selected[i] === end + 1) {
          end = selected[i];
        } else {
          ranges.push(start === end ? `${start}` : `${start}-${end}`);
          start = selected[i];
          end = selected[i];
        }
      }
      ranges.push(start === end ? `${start}` : `${start}-${end}`);
      verseRange = `verses ${ranges.join(', ')}`;
    }

    const reference = `${bookName} ${chapter}:${verseRange}`;
    const text = verses
      .filter(v => selectedVerses.has(v.verse))
      .map(v => `${v.verse}. ${v.text}`)
      .join('\n');

    const shareContent = `${reference}\n\n${text}`;

    try {
      await Share.share({
        message: shareContent,
        title: 'Bible Verse',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleClearSelection = () => {
    setSelectedVerses(new Set());
  };

  const renderVerseItem = ({ item }) => (
    <VerseItem
      verse={item}
      isSelected={selectedVerses.has(item.verse)}
      onPress={() => handleVersePress(item.verse)}
    />
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4A6FA5" />
        <Text style={styles.loadingText}>Loading Chapter...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{bookName} {chapter}</Text>
          {chapterData && (
            <Text style={styles.headerSubtitle}>
              {chapterData.reference}
            </Text>
          )}
        </View>
      </View>

      {selectedVerses.size > 0 && (
        <View style={styles.selectionToolbar}>
          <Text style={styles.selectionCount}>
            {selectedVerses.size} verse{selectedVerses.size > 1 ? 's' : ''} selected
          </Text>
          <View style={styles.toolbarButtons}>
            <TouchableOpacity
              style={styles.toolbarButton}
              onPress={handleClearSelection}
            >
              <Text style={styles.toolbarButtonText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toolbarButton, styles.shareButton]}
              onPress={handleShare}
            >
              <Text style={[styles.toolbarButtonText, styles.shareButtonText]}>
                Share
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FlatList
        data={verses}
        renderItem={renderVerseItem}
        keyExtractor={(item) => item.verse.toString()}
        contentContainerStyle={styles.versesContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          chapterData && (
            <View style={styles.chapterInfo}>
              <Text style={styles.translation}>
                Translation: {chapterData.translation_name}
              </Text>
              {chapterData.translation_note && (
                <Text style={styles.translationNote}>
                  {chapterData.translation_note}
                </Text>
              )}
            </View>
          )
        }
        ListFooterComponent={<View style={styles.footer} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A6FA5',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
  selectionToolbar: {
    backgroundColor: '#2E8B57',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 10,
    elevation: 3,
  },
  selectionCount: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  toolbarButtons: {
    flexDirection: 'row',
  },
  toolbarButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginLeft: 10,
  },
  shareButton: {
    backgroundColor: 'white',
  },
  toolbarButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  shareButtonText: {
    color: '#2E8B57',
  },
  chapterInfo: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  translation: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  translationNote: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  versesContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  footer: {
    height: 50,
  },
});

export default Verses;
