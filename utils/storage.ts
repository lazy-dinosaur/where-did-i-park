import AsyncStorage from "@react-native-async-storage/async-storage";
import { LocationObject } from "expo-location";

export const storeData = async (data: {
  key: string;
  value: string | { [k: string]: string } | LocationObject | string[];
}) => {
  let value;
  if (typeof data.value !== "object") {
    value = data.value;
  } else {
    value = JSON.stringify(data.value);
  }
  try {
    await AsyncStorage.setItem(data.key, value);
    return { ok: true };
  } catch (e) {
    console.error("Error saving data", e);
  }
};

export const getData = async (key: string) => {
  const value = await AsyncStorage.getItem(key);
  if (value) {
    try {
      return JSON.parse(value);
    } catch (e) {
      console.warn("Error parsing data", e);
      return value;
    }
  } else {
    console.warn("No data found for key", key);
  }
};
