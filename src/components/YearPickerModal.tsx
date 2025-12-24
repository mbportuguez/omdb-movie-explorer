import React, { useMemo } from 'react';
import { FlatList, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { APP_CONSTANTS } from '../constants/app';

type YearPickerModalProps = {
  visible: boolean;
  selectedYear: string;
  onClose: () => void;
  onSelectYear: (year: string) => void;
  onClearYear: () => void;
};

const generateYears = (): string[] => {
  const currentYear = new Date().getFullYear();
  const yearList: string[] = [];
  for (let y = currentYear; y >= APP_CONSTANTS.YEAR.START_YEAR; y--) {
    yearList.push(String(y));
  }
  return yearList;
};

export default function YearPickerModal({
  visible,
  selectedYear,
  onClose,
  onSelectYear,
  onClearYear,
}: YearPickerModalProps) {
  const years = useMemo(() => generateYears(), []);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Year</Text>
            <Pressable onPress={onClose}>
              <Icon name="close" size={24} color="#888" />
            </Pressable>
          </View>
          <FlatList
            data={years}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  onSelectYear(item);
                  onClose();
                }}
                style={[styles.yearOption, selectedYear === item && styles.yearOptionSelected]}
              >
                <Text
                  style={[
                    styles.yearOptionText,
                    selectedYear === item && styles.yearOptionTextSelected,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            )}
            initialNumToRender={20}
            maxToRenderPerBatch={20}
          />
          <Pressable onPress={onClearYear} style={styles.clearYearButton}>
            <Text style={styles.clearYearText}>Clear</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#2a2a2a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3a',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  yearOption: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3a',
  },
  yearOptionSelected: {
    backgroundColor: '#3a3a3a',
  },
  yearOptionText: {
    fontSize: 16,
    color: '#fff',
  },
  yearOptionTextSelected: {
    fontWeight: '600',
    color: '#ff6b35',
  },
  clearYearButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#3a3a3a',
    alignItems: 'center',
  },
  clearYearText: {
    fontSize: 16,
    color: '#ff6b35',
    fontWeight: '500',
  },
});

