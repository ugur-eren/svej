const DeepParseJson = (json: string): Record<string | number | symbol, unknown> | null => {
  try {
    const parsed = JSON.parse(json);

    if (parsed && typeof parsed === 'object') {
      Object.keys(parsed).forEach((key) => {
        if (parsed[key] && typeof parsed[key] === 'string') {
          const deepParsed = DeepParseJson(parsed[key]);

          parsed[key] = deepParsed || parsed[key];
        }
      });
    }

    return parsed;
  } catch (e) {
    return null;
  }
};

export default DeepParseJson;
