function countChars(str: string): [number, number] {
  let enCount = 0
  let cnCount = 0

  for (const char of str) {
    if (/[\u4E00-\u9FA5]/.test(char)) {
      cnCount++
    } else {
      enCount++
    }
  }

  return [enCount, cnCount]
}

function findMaxCounts(counts: [number, number][]): [number, number] {
  const maxEn = Math.max(...counts.map(([en]) => en))
  const maxCn = Math.max(...counts.map(([, cn]) => cn))
  return [maxEn, maxCn]
}

/**
 * Aligns an array of strings by adding spaces to each string so that all strings have the same number of English and Chinese characters.
 *
 * @param {string[]} strings - An array of strings to be aligned.
 * @returns {string[]} - An array of aligned strings with added spaces.
 */
export function alignText(strings: string[]): string[] {
  const counts = strings.map(str => countChars(str))
  const [maxEn, maxCn] = findMaxCounts(counts)

  return strings.map((str, index) => {
    const [enCount, cnCount] = counts[index]
    const enDiff = maxEn - enCount
    const cnDiff = maxCn - cnCount

    return (
      str +
      // en space
      '\u2007'.repeat(enDiff) +
      // cn space
      '\u2001'.repeat(cnDiff)
    )
  })
}
