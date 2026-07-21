import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PostType } from '@/lib/types';
import { theme } from '@/lib/theme';

export interface SearchHeaderProps {
  searchText: string;
  filterType: PostType | 'All';
  onSearchChange: (text: string) => void;
  onFilterTypeChange: (type: PostType | 'All') => void;
}

export function SearchHeader({
  searchText,
  filterType,
  onSearchChange,
  onFilterTypeChange,
}: SearchHeaderProps) {
  return (
    <View style={styles.searchHeader}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={16} color={theme.colors.primary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search pickup location..."
          placeholderTextColor="#94a3b8"
          value={searchText}
          onChangeText={onSearchChange}
        />
        {searchText ? (
          <TouchableOpacity onPress={() => onSearchChange('')} style={styles.clearSearchButton}>
            <Ionicons name="close-circle" size={16} color="#94a3b8" />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.filterTabs}>
        {(['All', 'ItemAvailable', 'PickupRequest'] as const).map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => onFilterTypeChange(t)}
            style={[styles.filterTab, filterType === t ? styles.filterTabActive : null]}
          >
            <Text style={[styles.filterTabText, filterType === t ? styles.filterTabTextActive : null]}>
              {t === 'All' ? 'All Jobs' : t === 'ItemAvailable' ? 'Available' : 'ASAP'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchHeader: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.foreground,
    paddingVertical: 0,
  },
  clearSearchButton: {
    padding: 2,
  },
  filterTabs: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterTabActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.foreground,
  },
  filterTabTextActive: {
    color: '#ffffff',
  },
});
