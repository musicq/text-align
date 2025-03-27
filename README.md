# text-align

A utility for aligning mixed English and CJK (Chinese, Japanese, Korean) text by
adding appropriate padding spaces.

## Features

- Supports mixed English and CJK text alignment
- Handles various CJK character ranges including:
  - Chinese (Hanzi)
  - Japanese (Hiragana, Katakana)
  - Korean (Hangul)
- Customizable padding characters
- Zero dependencies
- TypeScript support

## Installation

```bash
npm install text-aligner
```

## Usage

```ts
import {alignText} from 'text-aligner'

const strings = ['Hello 你好', 'Hi 早上好', 'Good morning 晚安']

const aligned = alignText(strings)
console.log(aligned)
// [
//   'Hello 你好\u2007\u2007\u2007\u2007\u2007\u2007\u2007\u2001',
//   'Hi 早上好\u2007\u2007\u2007\u2007\u2007\u2007\u2007\u2007\u2007\u2007',
//   'Good morning 晚安\u2001',
// ]
```

## API

### alignText

```ts
function alignText(
  strings: string[],
  paddingMap?: Record<string, PaddingRule | string>
): string[]

type PaddingRule = {
  test: RegExp | ((char: string) => boolean) | typeof FallbackKey
  placeholder: string
}
```

Aligns an array of strings by adding padding spaces to make all strings visually
aligned.

#### Parameters

- `strings`: Array of strings to be aligned
- `paddingMap` (optional): Custom padding characters
  - Default values:
    - CJK: `\u2001` (Em Quad)
    - Fallback: `\u2007` (Figure Space)

#### Returns

An array of aligned strings with appropriate padding spaces added.

## License

MIT
