import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Storage {
  static async set(key: string, value: string): Promise<boolean> {
    try {
      await AsyncStorage.setItem(key, value);
      return true;
    } catch (e) {
      return false;
    }
  }

  static async setMultiple(values: Record<string, string>): Promise<boolean> {
    const newValues: [string, string][] = Object.keys(values).map((key) => {
      return [key, values[key]];
    });

    try {
      await AsyncStorage.multiSet(newValues);
      return true;
    } catch (e) {
      return false;
    }
  }

  static async get(key: string, defaultValue?: string): Promise<false | string> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        return value;
      }

      if (defaultValue) {
        const isOk = await Storage.set(key, defaultValue);
        return isOk ? defaultValue : false;
      }

      return false;
    } catch (e) {
      return false;
    }
  }

  static async getMultiple(
    keys: string[],
    defaultValues?: Record<string, string>,
  ): Promise<false | Record<string, string>> {
    try {
      const values = await AsyncStorage.multiGet(keys);

      const returnValues: Record<string, string> = {};
      const emptyKeys: string[] = [];

      values.forEach((item) => {
        const [key, value] = item;

        if (!value) emptyKeys.push(key);

        returnValues[key] = value || '';
      });

      if (defaultValues && Object.keys(defaultValues).length > 0) {
        const emptyValues: Record<string, string> = {};

        emptyKeys.forEach((key) => {
          if (defaultValues[key]) emptyValues[key] = defaultValues[key];
        });

        const isOk = await Storage.setMultiple(emptyValues);
        if (isOk) {
          return {...returnValues, ...emptyValues};
        }

        return false;
      }

      return returnValues;
    } catch (e) {
      return false;
    }
  }

  static async remove(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (e) {
      return false;
    }
  }

  static async clearAll(): Promise<boolean> {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (e) {
      return false;
    }
  }
}
