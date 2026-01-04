import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { bibleApi } from '../api/bibleApi';

const Books = ({ navigation }) => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = books.filter(book =>
        book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.abbreviation.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBooks(filtered);
    } else {
      setFilteredBooks(books);
    }
  }, [searchQuery, books]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await bibleApi.getAllBooks();
      setBooks(data.books || []);
      setFilteredBooks(data.books || []);
    } catch (error) {
      console.error('Error fetching books:', error);
      alert('Failed to load books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderBookItem = ({ item }) => (
    <TouchableOpacity
      style={styles.bookItem}
      onPress={() => navigation.navigate('Chapters', {
        bookId: item.abbreviation,
        bookName: item.name,
        chapters: item.chapters
      })}
    >
      <View style={styles.bookContent}>
        <Text style={styles.bookName}>{item.name}</Text>
        <Text style={styles.bookAbbreviation}>{item.abbreviation}</Text>
        <Text style={styles.bookChapters}>Chapters: {item.chapters}</Text>
      </View>
      <Text style={styles.arrow}>→</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4A6FA5" />
        <Text style={styles.loadingText}>Loading Books...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Holy Bible</Text>
        <Text style={styles.headerSubtitle}>Select a Book</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search books..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#888"
        />
      </View>

      <FlatList
        data={filteredBooks}
        renderItem={renderBookItem}
        keyExtractor={(item) => item.abbreviation}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
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
    backgroundColor: '#4A6FA5',
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  searchContainer: {
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
  searchInput: {
    fontSize: 16,
    color: '#333',
  },
  listContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  bookItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    marginBottom: 10,
    padding: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  bookContent: {
    flex: 1,
  },
  bookName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  bookAbbreviation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  bookChapters: {
    fontSize: 12,
    color: '#4A6FA5',
  },
  arrow: {
    fontSize: 20,
    color: '#4A6FA5',
    fontWeight: 'bold',
  },
});

export default Books;
