type WordItem = {
  _id?: string;
  word: string;
  word_hint: string;
  unknown_word: boolean;
  letters: string[];
  additional_words: string[];
  hidden_words: string[];
  order?: number;
};

type PartItem = {
  _id?: string;
  sentence: string;
  sentence_hint: string;
  sentence_display: string;
  words: WordItem[];
  order?: number;
};

export function normalizeStageDataInEdit(parts: PartItem[]): PartItem[] {
  return parts.map((part, partIndex) => {

    const normalizedWords = part.words.map((wordItem, wordIndex) => {
      const normalizedItem: WordItem = {
        ...wordItem,
      };
      if(!wordItem.word_hint){
        normalizedItem.word_hint = ""
      }
      if(!wordItem.letters){
        normalizedItem.letters = []
      }
      if(!wordItem.additional_words){
        normalizedItem.additional_words = []
      }
      if(!wordItem.hidden_words){
        normalizedItem.hidden_words = []
      }
      return normalizedItem;
    });

    const normalizedPart: PartItem = {
      ...part,
      words: normalizedWords,
    };

    if(!part.sentence_hint){
      normalizedPart.sentence_hint = ""
    }
    if(!part.sentence_display){
      normalizedPart.sentence_display = ""
    }

    return normalizedPart;
  });
}