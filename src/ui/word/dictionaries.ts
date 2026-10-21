// Port of ExternalDictionary (EnglishReader/Services/AppSettings.swift) with Polish dictionaries (specs/002-polish/idea.md).
import type { ExternalDictionaryID } from '../../core/storage/settings.ts'

const info: Record<ExternalDictionaryID, { title: string; subtitle: string }> = {
  wikislownik: { title: 'Wikisłownik', subtitle: 'польський словник з відмінюванням і прикладами' },
  sjp: { title: 'SJP PWN', subtitle: 'тлумачний словник польської мови' },
  wiktionary: { title: 'Wiktionary', subtitle: 'таблиці відмінювання й дієвідмінювання (англійською)' },
  glosbe: { title: 'Glosbe', subtitle: 'словник і приклади, польська → українська' },
  google: { title: 'Google Перекладач', subtitle: 'машинний переклад, польська → українська' },
  deepl: { title: 'DeepL', subtitle: 'машинний переклад, польська → українська' },
  reverso: { title: 'Reverso Context', subtitle: 'приклади в контексті, польська → англійська' },
  forvo: { title: 'Forvo', subtitle: 'вимова носіями мови' },
}

export const dictionaryInfo = (id: ExternalDictionaryID): { title: string; subtitle: string } => info[id]

/** Percent-encoding with an allowed set like Foundation's CharacterSet-based encoding. */
function encode(text: string, keep: string): string {
  return encodeURIComponent(text).replace(/%(2[1-9A-F]|3[A-F]|40|5B|5D)/gi, (match) => {
    const char = decodeURIComponent(match)
    return keep.includes(char) ? char : match
  })
}

// .urlPathAllowed minus "/?#" (word path component)
const SEGMENT_ALLOWED = "!$&'()*+,;=:@"
// URLComponents.queryItems keeps .urlQueryAllowed except & = (and leaves + as is)
const QUERY_ALLOWED = "!$'()*+,;:@/?"

function query(base: string, items: [string, string][]): string {
  return base + '?' + items.map(([name, value]) => `${encode(name, QUERY_ALLOWED)}=${encode(value, QUERY_ALLOWED)}`).join('&')
}

/** The dictionary's page for a word or phrase; null for an empty term. */
export function dictionaryURL(id: ExternalDictionaryID, term: string): string | null {
  const trimmed = term.trim()
  if (!trimmed) return null
  const path = encode(trimmed, SEGMENT_ALLOWED)
  const wiki = encode(trimmed.replaceAll(' ', '_'), SEGMENT_ALLOWED)
  switch (id) {
    case 'wikislownik': return 'https://pl.wiktionary.org/wiki/' + wiki
    case 'sjp': return 'https://sjp.pwn.pl/szukaj/' + path + '.html'
    case 'wiktionary': return 'https://en.wiktionary.org/wiki/' + wiki + '#Polish'
    case 'glosbe': return 'https://glosbe.com/pl/uk/' + path
    case 'google': return query('https://translate.google.com/', [['sl', 'pl'], ['tl', 'uk'], ['text', trimmed], ['op', 'translate']])
    case 'deepl': return 'https://www.deepl.com/translator#pl/uk/' + path
    case 'reverso': return 'https://context.reverso.net/translation/polish-english/' + path
    case 'forvo': return 'https://forvo.com/word/' + path + '/#pl'
  }
}

/** Opens the page in a new window; an installed PWA shows it in the system Safari view (V-02). */
export function openDictionary(id: ExternalDictionaryID, term: string): void {
  const url = dictionaryURL(id, term)
  if (url) window.open(url, '_blank', 'noopener,noreferrer')
}
