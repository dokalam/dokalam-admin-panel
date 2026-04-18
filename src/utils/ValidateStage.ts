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

export function validateStage(parts: PartItem[]): { status: number; message: string } {
  if(parts.length == 0) {
    return {
      status: 401,
      message: "هیچ محتوایی ایجاد نشده است",
    };
  }
  const sentenceSet = new Set<string>();
  for (let i = 0; i < parts.length; i++) {
    const currentSentence = parts[i].sentence?.trim() ?? "";
    if (sentenceSet.has(currentSentence)) {
      return {
        status: 401,
        message: `جمله‌ی شماره ${i + 1} تکراری است و قبلاً در یکی از جمله‌ها استفاده شده.`,
      };
    }
    sentenceSet.add(currentSentence);
  }
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];

    // شرط ۴: بررسی وجود جمله و تعداد کلمات
    if (!part.sentence || typeof part.sentence !== "string" || part.sentence.trim().length === 0) {
      return {
        status: 401,
        message: `در جمله شماره ${i + 1} جمله وارد نشده است.`,
      };
    }

    if (part.sentence !== part.sentence.trim()) {
      return {
        status: 401,
        message: `در جمله شماره ${i + 1}، جمله دارای فاصله‌ی اضافی در ابتدا یا انتها است.`,
      };
    }

    if (!Array.isArray(part.words) || part.words.length < 2) {
      return {
        status: 401,
        message: `در جمله شماره ${i + 1} تعداد کلمات کمتر از ۲ عدد است.`,
      };
    }


    for (let j = 0; j < part.words.length; j++) {
      const w = part.words[j];
      
      if (w.word !== w.word.trim()) {
        return {
          status: 401,
          message: `در جمله شماره ${i + 1}، کلمه شماره ${j + 1} دارای فاصله‌ی اضافی در ابتدا یا انتها است.`,
        };
      }
    }
    // شرط ۱: بررسی تطابق sentence با کلمات
    const joinedWords = part.words.map((w) => w.word).join(" ").trim();
    if (joinedWords !== part.sentence.trim()) {
      return {
        status: 401,
        message: `در جمله شماره ${i + 1} جمله با کلمات آن مطابقت ندارد.`,
      };
    }

    let hasWordWithAtLeastTwoLetters = false;

    for (let j = 0; j < part.words.length; j++) {
      const wordItem = part.words[j];

      // شرط ۲: کلمه باید طولش حداقل ۲ کاراکتر باشد
      if (wordItem.word.trim().length < 2) {
        return {
          status: 401,
          message: `در جمله شماره ${i + 1}، کلمه شماره ${j + 1} خیلی کوتاه است.`,
        };
      }

      // شرط ۳: اگر unknown_word بود باید حداقل ۲ حرف باشد
      if (wordItem.unknown_word && wordItem.word.trim().length < 2) {
        return {
          status: 401,
          message: `در جمله شماره ${i + 1}، کلمه‌ی نامشخص شماره ${j + 1} باید حداقل ۲ حرف داشته باشد.`,
        };
      }

      if (wordItem.unknown_word) {
        if (wordItem.word.includes(" ")) {
          return {
            status: 401,
            message: `در جمله شماره ${i + 1}، کلمه‌ی ناشناخته "${wordItem.word}" نباید دارای فاصله باشد.`,
          };
        }
      }

      // بررسی وجود حداقل یک کلمه‌ی با حداقل ۲ حرف
      if (wordItem.word.trim().length >= 2) {
        hasWordWithAtLeastTwoLetters = true;
      }

      // شرط ۵: اگر unknown_word بود، باید letters کافی برای ساخت همه کلمات داشته باشد
      if (wordItem.unknown_word) {
        const availableLetters = [...wordItem.letters];
        const canMakeWord = (target: string) => {
          const normalize = (target: string): string => {
              return target.replace(/آ/g, "ا");
          };
          const normalTarget = normalize(target)
          const temp = [...availableLetters];
          for (const ch of normalTarget) {
            const idx = temp.indexOf(ch);
            if (idx === -1) return false;
            temp.splice(idx, 1);
          }
          return true;
        };

        if (!canMakeWord(wordItem.word)) {
          return {
            status: 401,
            message: `در جمله شماره ${i + 1}، حروف ارائه‌شده برای کلمه نامشخص "${wordItem.word}" کافی نیست.`,
          };
        }

        for (const additional of wordItem.additional_words) {
          if (additional !== additional.trim()) {
            return {
              status: 401,
              message: `در جمله شماره ${i + 1}، کلمه اضافه "${additional}" در کلمه‌ی "${wordItem.word}" دارای فاصله‌ی اضافی در ابتدا یا انتها است.`,
            };
          }
          if (additional.includes(" ")) {
            return {
              status: 401,
              message: `در جمله شماره ${i + 1}، کلمه اضافه "${additional}" در کلمه‌ی "${wordItem.word}" نباید دارای فاصله در وسط کلمه باشد.`,
            };
          }
          if (!canMakeWord(additional)) {
            return {
              status: 401,
              message: `در جمله شماره ${i + 1}، حروف برای ساخت کلمه اضافه "${additional}" در "${wordItem.word}" کافی نیست.`,
            };
          }
        }

        for (const hidden of wordItem.hidden_words) {
          if (hidden !== hidden.trim()) {
            return {
              status: 401,
              message: `در جمله شماره ${i + 1}، کلمه پنهان "${hidden}" در کلمه‌ی "${wordItem.word}" دارای فاصله‌ی اضافی در ابتدا یا انتها است.`,
            };
          }
          if (hidden.includes(" ")) {
            return {
              status: 401,
              message: `در جمله شماره ${i + 1}، کلمه پنهان "${hidden}" در کلمه‌ی "${wordItem.word}" نباید دارای فاصله در وسط کلمه باشد.`,
            };
          }
          if (!canMakeWord(hidden)) {
            return {
              status: 401,
              message: `در جمله شماره ${i + 1}، حروف برای ساخت کلمه پنهان "${hidden}" در "${wordItem.word}" کافی نیست.`,
            };
          }
        }
      }
    }

    if (!hasWordWithAtLeastTwoLetters) {
      return {
        status: 401,
        message: `در جمله شماره ${i + 1} هیچ کلمه‌ای با حداقل ۲ حرف وجود ندارد.`,
      };
    }
  }

  return {
    status: 200,
    message: "محتوا کامل می‌باشد",
  };
}