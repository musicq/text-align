import {describe, it, expect} from 'vitest'
import {alignText} from '../src'

describe('alignText', () => {
  it('should align mixed Chinese and English text', () => {
    const input = ['Hello 世界', 'Hi', 'Hello World 世']

    const expected = [
      'Hello 世界\u2007\u2007\u2007\u2007\u2007\u2007',
      'Hi\u2007\u2007\u2007\u2007\u2007\u2007\u2007\u2007\u2007\u2007\u2001\u2001',
      'Hello World 世\u2001',
    ]

    expect(alignText(input)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const input = ['', 'Hello', '世界']
    const expected = [
      '\u2007\u2007\u2007\u2007\u2007\u2001\u2001',
      'Hello\u2001\u2001',
      '世界\u2007\u2007\u2007\u2007\u2007',
    ]
    expect(alignText(input)).toEqual(expected)
  })

  it('should handle pure English text', () => {
    const input = ['Hello', 'Hi', 'Hello World']
    const expected = [
      'Hello\u2007\u2007\u2007\u2007\u2007\u2007',
      'Hi\u2007\u2007\u2007\u2007\u2007\u2007\u2007\u2007\u2007',
      'Hello World',
    ]
    expect(alignText(input)).toEqual(expected)
  })

  it('should handle pure Chinese text', () => {
    const input = ['世界', '你好', '世界你好']
    const expected = ['世界\u2001\u2001', '你好\u2001\u2001', '世界你好']
    expect(alignText(input)).toEqual(expected)
  })

  it('should handle Japanese text', () => {
    const input = ['こんにちは', 'ありがとう', 'さようなら世界']
    const expected = [
      'こんにちは\u2001\u2001',
      'ありがとう\u2001\u2001',
      'さようなら世界',
    ]
    expect(alignText(input)).toEqual(expected)
  })

  it('should handle Korean text', () => {
    const input = ['안녕하세요', '감사합니다', '안녕히 가세요']
    const expected = [
      '안녕하세요\u2007\u2001',
      '감사합니다\u2007\u2001',
      '안녕히 가세요',
    ]
    expect(alignText(input)).toEqual(expected)
  })

  it('should handle mixed language text', () => {
    const input = ['Hello 世界', 'こんにちは', '안녕하세요 World']
    const expected = [
      'Hello 世界\u2001\u2001\u2001',
      'こんにちは\u2007\u2007\u2007\u2007\u2007\u2007',
      '안녕하세요 World',
    ]
    expect(alignText(input)).toEqual(expected)
  })

  it('should handle custom paddingMap', () => {
    const input = ['Hello 世界', 'Hi', 'Hello World 世']
    const customPaddingMap = {
      en: {
        test: /^[a-zA-Z0-9]$/,
        placeholder: '\u0020',
      },
      cjk: {
        test: (char: string) => /\p{Script=Han}/u.test(char),
        placeholder: '\u3000',
      },
    }

    const expected = [
      'Hello 世界' + '\u2007' + '\u0020'.repeat(5),
      'Hi' + '\u2007'.repeat(2) + '\u0020'.repeat(8) + '\u3000'.repeat(2),
      'Hello World 世' + '\u3000',
    ]

    expect(alignText(input, customPaddingMap)).toEqual(expected)
  })

  it('should handle partial custom paddingMap', () => {
    const input = ['Hello 世界', 'Hi', 'Hello World 世']
    const customPaddingMap = {
      '@@fallback': '\u2002',
      cjk: {
        test: (char: string) => /\p{Script=Han}/u.test(char),
        placeholder: '\u3000',
      },
    }

    const expected = [
      'Hello 世界' + '\u2002'.repeat(6),
      'Hi' + '\u2002'.repeat(10) + '\u3000'.repeat(2),
      'Hello World 世' + '\u3000',
    ]

    expect(alignText(input, customPaddingMap)).toEqual(expected)
  })
})
