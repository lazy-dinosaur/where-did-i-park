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

export default function MemoComponent() {
  const [memo, setMemo] = useState<string[]>([]);
  const [adding, setAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

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
              placeholderTextColor="#adb5bd"
              style={styles.editInput}
              multiline
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
            <Text style={styles.addIcon}>+</Text>
          </Pressable>
        ))}

      {adding && (
        <TextInput
          placeholder="메모를 입력하세요"
          placeholderTextColor="#adb5bd"
          onSubmitEditing={(e) => {
            handleAddMemo(e.nativeEvent.text);
          }}
          onBlur={() => setAdding(false)}
          autoFocus
          multiline
          style={styles.addInput}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e3f2fd",
    maxWidth: 200,
  },
  memoText: {
    fontSize: 15,
    color: "#2c3e50",
    lineHeight: 20,
    fontWeight: "500",
  },
  editInput: {
    backgroundColor: "#f8f9ff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    minWidth: 120,
    maxWidth: 200,
    fontSize: 15,
    color: "#2c3e50",
    borderWidth: 2,
    borderColor: "#007AFF",
    shadowColor: "#007AFF",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    fontWeight: "500",
  },
  addButtonFirst: {
    backgroundColor: "#e3f2fd",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#007AFF",
    borderStyle: "dashed",
    shadowColor: "#007AFF",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addIconFirst: {
    fontSize: 18,
    marginRight: 8,
  },
  addTextFirst: {
    fontSize: 15,
    color: "#007AFF",
    fontWeight: "600",
  },
  addButton: {
    backgroundColor: "#007AFF",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  addIcon: {
    fontSize: 24,
    color: "white",
    fontWeight: "300",
    lineHeight: 24,
  },
  addInput: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    minWidth: 120,
    maxWidth: 200,
    fontSize: 15,
    color: "#2c3e50",
    borderWidth: 2,
    borderColor: "#007AFF",
    shadowColor: "#007AFF",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    fontWeight: "500",
  },
});
