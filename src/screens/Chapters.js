import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { bibleApi } from '../api/bibleApi';

const Chapters = ({ route, navigation }) => {
  const { bookId, bookName, chapters } = route.params;
  const [loading, setLoading] = useState(false);
  const [bookData, setBookData] = useState(null);

  useEffect(() => {
    fetchBookData();
  }, []);

  const fetchBookData = async () => {
    try {
      setLoading(true);
      const data = await bibleApi.getBook(bookId);
      setBookData(data);
    } catch (error) {
      console.error('Error fetching book data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateChapterNumbers = () => {
    return Array.from({ length: chapters }, (_, i) => i + 1);
  };

  const handleChapterPress = (chapterNumber) => {
    navigation.navigate('Verses', {
      bookId,
      bookName,
      chapter: chapterNumber,
    });
  };

  const renderChapterItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chapterItem}
      onPress={() => handleChapterPress(item)}
    >
      <Text style={styles.chapterNumber}>{item}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4A6FA5" />
        <Text style={styles.loadingText}>Loading...</Text>
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
          <Text style={styles.headerTitle}>{bookName}</Text>
          <Text style={styles.headerSubtitle}>{chapters} Chapters</Text>
        </View>
      </View>

      <View style={styles.bookInfo}>
        {bookData && (
          <>
            <Text style={styles.testament}>
              {bookData.testament === 'OT' ? 'Old Testament' : 'New Testament'}
            </Text>
            {bookData.genre && (
              <Text style={styles.genre}>Genre: {bookData.genre}</Text>
            )}
          </>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.chaptersContainer}>
        <Text style={styles.selectChapter}>Select a Chapter</Text>
        
        <FlatList
          data={generateChapterNumbers()}
          renderItem={renderChapterItem}
          keyExtractor={(item) => item.toString()}
          numColumns={5}
          scrollEnabled={false}
          contentContainerStyle={styles.gridContainer}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');
const itemSize = (width - 60) / 5;

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
  bookInfo: {
    padding: 15,
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  testament: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  genre: {
    fontSize: 14,
    color: '#666',
  },
  chaptersContainer: {
    padding: 20,
  },
  selectChapter: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  gridContainer: {
    alignItems: 'center',
  },
  chapterItem: {
    width: itemSize,
    height: itemSize,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 5,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  chapterNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A6FA5',
  },
});

export default Chapters;
