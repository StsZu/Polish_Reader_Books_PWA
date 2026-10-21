import { describe, expect, it } from 'vitest'
import { makeBook, normalizeWhitespace, sentences, words } from '../../src/core/model/segmenter.ts'

describe('TextSegmenter', () => {
  // ImportTests.testSentenceSegmentation
  it('розбиває на речення й склеює репліки з малої літери', () => {
    expect(sentences('Mr. Holmes sat down. "Is it you?" he asked!  Yes —   it was.'))
      .toEqual(['Mr. Holmes sat down.', '"Is it you?" he asked!', 'Yes — it was.'])
  })

  it('не розриває речення після скорочень та ініціалів', () => {
    expect(sentences('I met Mr. Sherlock Holmes and Dr. Watson. It was late.'))
      .toEqual(['I met Mr. Sherlock Holmes and Dr. Watson.', 'It was late.'])
    expect(sentences('A. Writer wrote it, e.g. a lot. Then he left.'))
      .toEqual(['A. Writer wrote it, e.g. a lot.', 'Then he left.'])
    expect(sentences('He lived at No. 7 Baker Street. "No." She left.'))
      .toEqual(['He lived at No. 7 Baker Street.', '"No."', 'She left.'])
    expect(sentences('It was I. Nobody else.')).toEqual(['It was I.', 'Nobody else.'])
  })

  it('приклеює фрагменти без літер до попереднього речення', () => {
    expect(sentences('He stopped. — . Then went on.')).toEqual(['He stopped. — .', 'Then went on.'])
  })

  // ImportTests.testWordRangesSkipPunctuation
  it('слова без розділових знаків, апостроф усередині слова', () => {
    const list = words("Don't stop, Watson.")
    expect(list).toContain('Watson')
    expect(list).toContain("Don't")
    expect(list).not.toContain(',')
    expect(list).not.toContain('.')
    expect(words("the men's motives")).toEqual(['the', "men's", 'motives'])
  })

  it('нормалізує пробіли, NBSP і мʼякі переноси', () => {
    expect(normalizeWhitespace('  a b­c \n\t d ')).toBe('a bc d')
  })

  it('makeBook: заголовок — одне речення, порожні розділи пропускаються', () => {
    const book = makeBook({
      title: 'T', author: 'A', chapters: [
        { title: 'Empty', blocks: [{ kind: 'text', text: '   ' }] },
        { title: 'One', blocks: [{ kind: 'heading', text: 'One. Two.' }, { kind: 'text', text: 'First. Second.' }] },
      ],
    }, 'md', 'ID')
    expect(book.chapters).toHaveLength(1)
    expect(book.chapters[0].paragraphs[0]).toEqual({ kind: 'heading', sentences: ['One. Two.'] })
    expect(book.chapters[0].paragraphs[1].sentences).toEqual(['First.', 'Second.'])
  })
})

// Polish Reader (specs/002-polish): Polish abbreviations, initials and dialogue.
describe('польське розбиття на речення', () => {
  it('не розриває після польських скорочень та ініціалів', () => {
    expect(sentences('Mieszkał przy ul. Długiej obok kościoła św. Jana. Potem wyjechał.'))
      .toEqual(['Mieszkał przy ul. Długiej obok kościoła św. Jana.', 'Potem wyjechał.'])
    expect(sentences('Wykład prowadził prof. Nowak, a pisał o tym J. Horain. Było późno.'))
      .toEqual(['Wykład prowadził prof. Nowak, a pisał o tym J. Horain.', 'Było późno.'])
    expect(sentences('Kupił różne owoce, np. Jabłka i gruszki.')).toEqual(['Kupił różne owoce, np. Jabłka i gruszki.'])
  })

  it('розриває після скорочень, що зазвичай закінчують речення', () => {
    expect(sentences('Zabrał książki, zeszyty itd. Potem wyszedł.')).toEqual(['Zabrał książki, zeszyty itd.', 'Potem wyszedł.'])
    expect(sentences('Stało się to w 1830 r. Polacy walczyli długo.')).toEqual(['Stało się to w 1830 r.', 'Polacy walczyli długo.'])
  })

  it('репліки з тире й «nr» перед числом', () => {
    expect(sentences('— Skąd jesteście? — Jestem Polak.')).toEqual(['— Skąd jesteście?', '— Jestem Polak.'])
    expect(sentences('— Tułałem się — odpowiedział.')).toEqual(['— Tułałem się — odpowiedział.'])
    expect(sentences('Mieszkam w domu nr. 7 przy rynku.')).toEqual(['Mieszkam w domu nr. 7 przy rynku.'])
  })

  it('слова з польськими літерами — цілі', () => {
    expect(words('Zażółć gęślą jaźń, ćma!')).toEqual(['Zażółć', 'gęślą', 'jaźń', 'ćma'])
  })
})
