const DefaultPaddingMap = {
  en: '\u2007',
  cjk: '\u2001',
}

function isCJK(char: string) {
  const cjkRanges = [
    // Chinese (Hanzi) ranges
    [0x4e00, 0x9fff], // CJK Unified Ideographs
    [0x3400, 0x4dbf], // CJK Unified Ideographs Extension A
    [0x20000, 0x2a6df], // CJK Unified Ideographs Extension B
    [0x2a700, 0x2b73f], // CJK Unified Ideographs Extension C
    [0x2b740, 0x2b81f], // CJK Unified Ideographs Extension D
    [0x2b820, 0x2ceaf], // CJK Unified Ideographs Extension E
    [0xf900, 0xfaff], // CJK Compatibility Ideographs
    [0x2f800, 0x2fa1f], // CJK Compatibility Ideographs Supplement

    // Japanese ranges
    [0x3040, 0x309f], // Hiragana
    [0x30a0, 0x30ff], // Katakana
    [0x31f0, 0x31ff], // Katakana Phonetic Extensions

    // Korean ranges
    [0xac00, 0xd7a3], // Hangul Syllables
    [0x1100, 0x11ff], // Hangul Jamo
    [0x3130, 0x318f], // Hangul Compatibility Jamo
  ]

  const charCode = char.codePointAt(0)!

  return cjkRanges.some(([start, end]) => charCode >= start && charCode <= end)
}

function countChars(str: string): [number, number] {
  let enCount = 0
  let cjkCount = 0

  for (const char of str) {
    if (isCJK(char)) cjkCount++
    else enCount++
  }

  return [enCount, cjkCount]
}

function findMaxCounts(counts: [number, number][]): [number, number] {
  let maxEn = 0
  let maxCjk = 0

  for (const [en, cjk] of counts) {
    maxEn = Math.max(maxEn, en)
    maxCjk = Math.max(maxCjk, cjk)
  }

  return [maxEn, maxCjk]
}

/**
 * Aligns an array of strings by adding spaces to each string so that all strings have the same number of English and Chinese characters.
 *
 * @param {string[]} strings - An array of strings to be aligned.
 * @param {Record<string, string>} paddingMap - A map of padding characters for English and Chinese characters.
 * @returns {string[]} - An array of aligned strings with added spaces.
 */
export function alignText(
  strings: string[],
  paddingMap: Record<'en' | 'cjk', string> = DefaultPaddingMap
): string[] {
  const counts = strings.map(str => countChars(str))
  const [maxEn, maxCjk] = findMaxCounts(counts)

  return strings.map((str, index) => {
    const [enCount, cjkCount] = counts[index]
    const enDiff = maxEn - enCount
    const cjkDiff = maxCjk - cjkCount

    return str + paddingMap.en.repeat(enDiff) + paddingMap.cjk.repeat(cjkDiff)
  })
}
