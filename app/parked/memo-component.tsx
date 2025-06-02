import { getData, storeData } from "@/utils/storage";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  Alert,
  StyleSheet,
} from "react-native";
import { useTheme } from "@/hooks/use-theme";
import { LinearGradient } from "expo-linear-gradient";

export default function MemoComponent() {
  const [memo, setMemo] = useState<string[]>([]);
  const [adding, setAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const { colors, isDark } = useTheme();

  useEffect(() => {
    (async () =>
      await getData("memo").then((res) => {
        if (res && res.length > 0) {
          setMemo(res);
        } else {
          setMemo([]);
        }
      }))();
  }, []);

  useEffect(() => {
    console.log(memo);
  }, [memo]);

  const saveMemo = async (newMemo: string[]) => {
    await storeData({ key: "memo", value: newMemo });
  };

  const handleDelete = (index: number) => {
    const newMemo = memo.filter((_, i) => i !== index);
    setMemo(newMemo);
    saveMemo(newMemo);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditText(memo[index]);
  };

  const saveEdit = () => {
    if (editText.trim() !== "" && editingIndex !== null) {
      const newMemo = [...memo];
      newMemo[editingIndex] = editText.trim();
      setMemo(newMemo);
      saveMemo(newMemo);
    }
    setEditingIndex(null);
    setEditText("");
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditText("");
  };

  const handleAddMemo = (newMemoText: string) => {
    if (newMemoText.trim() !== "") {
      const newMemo = [...memo, newMemoText.trim()];
      setMemo(newMemo);
      saveMemo(newMemo);
      setAdding(false);
    } else {
      setAdding(false);
    }
  };

  const styles = createStyles(colors, isDark);

  return (
    <View style={styles.container}>
      {memo.map((t, i) => (
        <View key={i} style={styles.memoWrapper}>
          {editingIndex === i ? (
            <TextInput
              value={editText}
              onChangeText={setEditText}
              onSubmitEditing={saveEdit}
              onBlur={cancelEdit}
              autoFocus
              placeholder="메모를 수정하세요"
              placeholderTextColor={colors.placeholder}
              style={styles.editInput}
            />
          ) : (
            <Pressable
              onLongPress={() => {
                Alert.alert("메모 편집", `"${t}"`, [
                  { text: "취소", style: "cancel" },
                  { text: "수정", onPress: () => handleEdit(i) },
                  {
                    text: "삭제",
                    style: "destructive",
                    onPress: () => handleDelete(i),
                  },
                ]);
              }}
              style={styles.memoItem}
            >
              <Text style={styles.memoText}>{t}</Text>
            </Pressable>
          )}
        </View>
      ))}

      {!adding &&
        (memo.length < 1 ? (
          <Pressable
            onPress={() => {
              setAdding(true);
            }}
            style={styles.addButtonFirst}
          >
            <Text style={styles.addIconFirst}>📝</Text>
            <Text style={styles.addTextFirst}>눌러서 메모 추가</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => {
              setAdding(true);
            }}
            style={styles.addButton}
          >
            <LinearGradient
              colors={
                isDark
                  ? ["#007AFF", "#0056CC", "#003D99"]
                  : ["#007AFF", "#0064FF", "#0080FF"]
              }
              style={styles.gradientAddButton}
            >
              <Text style={styles.addIcon}>+</Text>
            </LinearGradient>
          </Pressable>
        ))}

      {adding && (
        <TextInput
          placeholder="메모를 입력하세요"
          placeholderTextColor={colors.placeholder}
          onSubmitEditing={(e) => {
            handleAddMemo(e.nativeEvent.text);
          }}
          onBlur={() => setAdding(false)}
          autoFocus
          style={styles.addInput}
        />
      )}
    </View>
  );
}

const createStyles = (colors: any, isDark: boolean) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      paddingBottom: 20,
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
      alignItems: "flex-start",
    },
    memoWrapper: {
      maxWidth: "100%",
    },
    memoItem: {
      backgroundColor: colors.memoBackground,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 20,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.border,
      maxWidth: 200,
    },
    memoText: {
      fontSize: 15,
      color: colors.text,
      lineHeight: 20,
      fontWeight: "500",
    },
    editInput: {
      backgroundColor: colors.memoEditBackground,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 20,
      minWidth: 120,
      maxWidth: 200,
      fontSize: 15,
      color: colors.text,
      borderWidth: 2,
      borderColor: colors.borderInput,
      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: isDark ? 0.4 : 0.2,
      shadowRadius: 4,
      elevation: 4,
      fontWeight: "500",
    },
    addButtonFirst: {
      backgroundColor: colors.addButtonDashed,
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderRadius: 20,
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 2,
      borderColor: colors.primary,
      borderStyle: "dashed",
      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    addIconFirst: {
      fontSize: 18,
      marginRight: 8,
    },
    addTextFirst: {
      fontSize: 15,
      color: colors.primary,
      fontWeight: "600",
    },
    addButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: isDark ? 0.5 : 0.3,
      shadowRadius: 6,
      elevation: 5,
    },
    gradientAddButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: "center",
      alignItems: "center",
    },
    addIcon: {
      fontSize: 24,
      color: "white",
      fontWeight: "300",
      lineHeight: 24,
    },
    addInput: {
      backgroundColor: colors.memoBackground,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 20,
      minWidth: 120,
      maxWidth: 200,
      fontSize: 15,
      color: colors.text,
      borderWidth: 2,
      borderColor: colors.borderInput,
      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: isDark ? 0.4 : 0.2,
      shadowRadius: 4,
      elevation: 4,
      fontWeight: "500",
    },
  });
