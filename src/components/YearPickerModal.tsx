import React, { useMemo } from 'react';
import { FlatList, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { APP_CONSTANTS } from '../constants/app';
import { useAppColors } from '../hooks/useAppColors';

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
  const colors = useAppColors();
  const years = useMemo(() => generateYears(), []);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.BACKGROUND.SECONDARY }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.BACKGROUND.TERTIARY }]}>
            <Text style={[styles.modalTitle, { color: colors.TEXT.PRIMARY }]}>Select Year</Text>
            <Pressable onPress={onClose}>
              <Icon name="close" size={24} color={colors.TEXT.TERTIARY} />
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
                style={[
                  styles.yearOption,
                  { borderBottomColor: colors.BACKGROUND.TERTIARY },
                  selectedYear === item && { backgroundColor: colors.BACKGROUND.TERTIARY },
                ]}
              >
                <Text
                  style={[
                    styles.yearOptionText,
                    { color: colors.TEXT.PRIMARY },
                    selectedYear === item && { fontWeight: '600', color: colors.ACCENT },
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            )}
            initialNumToRender={20}
            maxToRenderPerBatch={20}
          />
          <Pressable onPress={onClearYear} style={[styles.clearYearButton, { borderTopColor: colors.BACKGROUND.TERTIARY }]}>
            <Text style={[styles.clearYearText, { color: colors.ACCENT }]}>Clear</Text>
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
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  yearOption: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  yearOptionText: {
    fontSize: 16,
  },
  clearYearButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  clearYearText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

