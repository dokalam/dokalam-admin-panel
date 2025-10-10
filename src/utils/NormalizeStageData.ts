type WordItem = {
  word: string;
  word_hint: string;
  unknown_word: boolean;
  letters: string[];
  additional_words: string[];
  hidden_words: string[];
  order?: number;
};

type PartItem = {
  sentence: string;
  sentence_hint: string;
  sentence_display: string;
  words: WordItem[];
  order?: number;
};

export function normalizeStageData(parts: PartItem[]): PartItem[] {
  return parts.map((part, partIndex) => {
    const normalizedWords = part.words.map((wordItem, wordIndex) => {
      const normalizedItem: WordItem = {
        ...wordItem,
        order: wordIndex + 1,
      };

      // پاک‌سازی letters و additional_words برای کلمات ناشناخته=false
      if (!wordItem.unknown_word) {
        normalizedItem.letters = [];
        normalizedItem.additional_words = [];
        normalizedItem.hidden_words = [];
      }

      // اگر word_hint خالی یا کمتر از ۳ کاراکتر واقعی بود → undefined
      if (!wordItem.word_hint || wordItem.word_hint.trim().length < 3) {
        normalizedItem.word_hint = undefined as any;
      }

      return normalizedItem;
    });

    const normalizedPart: PartItem = {
      ...part,
      order: partIndex + 1,
      words: normalizedWords,
    };

    // اگر sentence_hint خالی یا کمتر از ۳ کاراکتر واقعی بود → undefined
    if (!part.sentence_hint || part.sentence_hint.trim().length < 3) {
      normalizedPart.sentence_hint = undefined as any;
    }

    // اگر sentence_display خالی یا کمتر از ۳ کاراکتر واقعی بود → undefined
    if (!part.sentence_display || part.sentence_display.trim().length < 3) {
      normalizedPart.sentence_display = undefined as any;
    }

    return normalizedPart;
  });
}