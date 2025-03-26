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
})
