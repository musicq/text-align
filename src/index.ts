const FallbackKey = '@@fallback' as const
const FallbackPlaceholder = '\u2007'

type PaddingRule = {
  test: RegExp | ((char: string) => boolean) | typeof FallbackKey
  placeholder: string
}

const DefaultPaddingMap: Record<string, PaddingRule> = {
  cjk: {
    test: (char: string) => isCJK(char),
    placeholder: '\u2001',
  },
  [FallbackKey]: {
    test: FallbackKey,
    placeholder: FallbackPlaceholder,
  },
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

function countChars(
  str: string,
  rules: Record<string, PaddingRule>
): Record<string, number> {
  const counts: Record<string, number> = {
    [FallbackKey]: 0,
  }

  Object.keys(rules).forEach(key => (counts[key] = 0))

  for (const char of str) {
    let matched = false
    for (const [key, rule] of Object.entries(rules)) {
      if (key === FallbackKey || rule.test === FallbackKey) {
        continue
      }

      if (
        typeof rule.test === 'function' ? rule.test(char) : rule.test.test(char)
      ) {
        counts[key]++
        matched = true
        break
      }
    }

    if (!matched) {
      counts[FallbackKey]++
    }
  }

  return counts
}

function findMaxCounts(
  counts: Record<string, number>[]
): Record<string, number> {
  const maxCounts: Record<string, number> = {}

  for (const count of counts) {
    Object.keys(count).forEach(key => {
      maxCounts[key] = Math.max(maxCounts[key] || 0, count[key])
    })
  }

  return maxCounts
}

/**
 * Aligns an array of strings by adding spaces to each string so that all strings have the same number of English and Chinese characters.
 *
 * @param {string[]} strings - An array of strings to be aligned.
 * @param {Record<string, PaddingRule | string>} paddingMap - A map of padding rules for different character types.
 * @returns {string[]} - An array of aligned strings with added spaces.
 */
export function alignText(
  strings: string[],
  paddingMap: Record<string, PaddingRule | string> = DefaultPaddingMap
): string[] {
  const normalizedPaddingMap: Record<string, PaddingRule> = {}

  for (const [key, value] of Object.entries(paddingMap)) {
    if (typeof value === 'string') {
      if (!DefaultPaddingMap[key]) {
        continue
      }

      normalizedPaddingMap[key] = {
        test: DefaultPaddingMap[key]?.test,
        placeholder: value,
      }
      continue
    }

    normalizedPaddingMap[key] = value
  }

  normalizedPaddingMap[FallbackKey] ??= {
    test: FallbackKey,
    placeholder: FallbackPlaceholder,
  }

  const counts = strings.map(str => countChars(str, normalizedPaddingMap))
  const maxCounts = findMaxCounts(counts)

  return strings.map((str, index) => {
    const currentCounts = counts[index]
    let result = str

    for (const [key, count] of Object.entries(maxCounts)) {
      const diff = count - currentCounts[key]
      result += normalizedPaddingMap[key].placeholder.repeat(diff)
    }

    return result
  })
}
