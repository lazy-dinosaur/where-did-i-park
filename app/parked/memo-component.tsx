import { getData, storeData } from "@/utils/storage";
import { useEffect, useState } from "react";
import { View, Text, Pressable, TextInput, Alert } from "react-native";

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
    <View
      style={{
        padding: 10,
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
      }}
    >
      {memo.map((t, i) => (
        <View key={i}>
          {editingIndex === i ? (
            <TextInput
              value={editText}
              onChangeText={setEditText}
              onSubmitEditing={saveEdit}
              onBlur={cancelEdit}
              autoFocus
              placeholder="메모를 수정하세요"
              placeholderTextColor="#888"
              style={{
                padding: 10,
                backgroundColor: "#ddd",
                borderRadius: 10,
                minWidth: 100,
                borderWidth: 2,
                borderColor: "#007AFF",
              }}
            />
          ) : (
            <Pressable
              key={i}
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
              style={{
                padding: 10,
                backgroundColor: "#eee",
                borderRadius: 10,
              }}
            >
              <Text>{t}</Text>
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
            style={{ padding: 10, backgroundColor: "#eee", borderRadius: 10 }}
          >
            <Text>눌러서 메모 추가 +</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => {
              setAdding(true);
            }}
            style={{ padding: 10, backgroundColor: "#eee", borderRadius: 10 }}
          >
            <Text>+</Text>
          </Pressable>
        ))}

      {adding && (
        <TextInput
          placeholder="메모를 입력하세요"
          placeholderTextColor="#888"
          onSubmitEditing={(e) => {
            handleAddMemo(e.nativeEvent.text);
          }}
          onBlur={() => setAdding(false)}
          autoFocus
          style={{
            padding: 10,
            backgroundColor: "#eee",
            borderRadius: 10,
            minWidth: 100,
          }}
        />
      )}
    </View>
  );
}

