type WordItem = {
  word: string;
  word_hint: string;
  unknown_word: boolean;
  letters: string[];
  additional_words: string[];
  order?: number;
};

type PartItem = {
  sentence: string;
  sentence_hint: string;
  words: WordItem[];
  order?: number;
};

export function normalizeStageData(parts: PartItem[]): PartItem[] {
  return parts.map((part, partIndex) => {
    const normalizedWords = part.words.map((wordItem, wordIndex) => {
      const normalizedItem = {
        ...wordItem,
        order: wordIndex + 1,
      };

      if (!wordItem.unknown_word) {
        normalizedItem.letters = [];
        normalizedItem.additional_words = [];
      }

      return normalizedItem;
    });

    return {
      ...part,
      order: partIndex + 1,
      words: normalizedWords,
    };
  });
}