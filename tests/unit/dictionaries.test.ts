import { describe, expect, it } from 'vitest'
import { allDictionaries, dictionaryOrder, enabledDictionaries, resetAllSettings, setDictionaryEnabled, settings } from '../../src/core/storage/settings.ts'
import { dictionaryInfo, dictionaryURL } from '../../src/ui/word/dictionaries.ts'

// Ported from ServiceTests.testExternalDictionaryURLs with the Polish dictionary set (specs/002-polish).
describe('external dictionaries', () => {
  it('builds Polish dictionary URLs with the same encoding rules', () => {
    expect(dictionaryURL('wikislownik', 'dać spokój')).toBe('https://pl.wiktionary.org/wiki/da%C4%87_spok%C3%B3j')
    expect(dictionaryURL('sjp', 'książka')).toBe('https://sjp.pwn.pl/szukaj/ksi%C4%85%C5%BCka.html')
    expect(dictionaryURL('wiktionary', 'kot')).toBe('https://en.wiktionary.org/wiki/kot#Polish')
    expect(dictionaryURL('glosbe', 'a/b')).toBe('https://glosbe.com/pl/uk/a%2Fb')
    expect(dictionaryURL('google', 'dać spokój')).toBe('https://translate.google.com/?sl=pl&tl=uk&text=da%C4%87%20spok%C3%B3j&op=translate')
    expect(dictionaryURL('deepl', 'kot')).toBe('https://www.deepl.com/translator#pl/uk/kot')
    expect(dictionaryURL('reverso', 'dać spokój')).toBe('https://context.reverso.net/translation/polish-english/da%C4%87%20spok%C3%B3j')
    expect(dictionaryURL('forvo', 'kot')).toBe('https://forvo.com/word/kot/#pl')
    for (const id of allDictionaries) {
      const url = new URL(dictionaryURL(id, 'cześć')!)
      expect(url.protocol, id).toBe('https:')
      expect(url.host, id).not.toBe('')
      expect(dictionaryInfo(id).title).not.toBe('')
    }
    expect(dictionaryURL('sjp', '  ')).toBeNull()
  })

  it('keeps order and enabled set (testDictionaryOrderAndEnabledSetPersist)', () => {
    resetAllSettings()
    expect(enabledDictionaries()).toEqual(['wikislownik', 'sjp', 'wiktionary', 'glosbe', 'google', 'deepl'])
    settings.dictionaryOrder.value = 'forvo,wikislownik'
    expect(dictionaryOrder().slice(0, 2)).toEqual(['forvo', 'wikislownik'])
    expect(dictionaryOrder()).toHaveLength(allDictionaries.length)
    setDictionaryEnabled('forvo', true)
    setDictionaryEnabled('sjp', false)
    expect(enabledDictionaries()[0]).toBe('forvo')
    expect(enabledDictionaries()).not.toContain('sjp')
    expect(localStorage.getItem('pr.enabledDictionaries')).toContain('forvo')
    resetAllSettings()
  })
})
