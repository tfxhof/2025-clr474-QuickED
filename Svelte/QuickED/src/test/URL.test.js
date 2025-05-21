import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { generateURL , readURLParameters} from '$lib/URLfunctions';

describe('generateURL', () => {
    const originalLocation = 'TestQuickEDgenerateURL';

    it('Normal strings', () => {
      const url = generateURL('hello', 'world', originalLocation);
      expect(url).toBe('TestQuickEDgenerateURL/?base=hello&final=world');
    });

    it('Special characters', () => {
      const url = generateURL('hello world!', 'foo&bar', originalLocation);
      expect(url).toBe('TestQuickEDgenerateURL/?base=hello%20world!&final=foo%26bar');
    });

    it('Empty strings', () => {
      const url = generateURL('', '', originalLocation);
      expect(url).toBe('TestQuickEDgenerateURL/?base=&final=');
    });

    it('Unicode characters', () => {
      const url = generateURL('áéí', '你好', originalLocation);
      expect(url).toBe('TestQuickEDgenerateURL/?base=%C3%A1%C3%A9%C3%AD&final=%E4%BD%A0%E5%A5%BD');
    });

    it('Line breaks', () => {
      const url = generateURL('line1\nline2', 'final\ntext', originalLocation);
      expect(url).toBe('TestQuickEDgenerateURL/?base=line1%0Aline2&final=final%0Atext');
    });

    it('Long text', () => {
      const base = 'a'.repeat(400);
      const final = 'b'.repeat(600);
      const url = generateURL(base, final, originalLocation);
      expect(url).toBe(`TestQuickEDgenerateURL/?base=${'a'.repeat(400)}&final=${'b'.repeat(600)}`);
    });

    it('Base only', () => {
      const url = generateURL('base only', '', originalLocation);
      expect(url).toBe('TestQuickEDgenerateURL/?base=base%20only&final=');
    });
    it('Final only', () => {
      const url = generateURL('', 'final only', originalLocation);
      expect(url).toBe('TestQuickEDgenerateURL/?base=&final=final%20only');
    });

    it('Symbols and spaces', () => {
      const url = generateURL('!@# $%^', '&*()_+', originalLocation);
      expect(url).toBe('TestQuickEDgenerateURL/?base=!%40%23%20%24%25%5E&final=%26*()_%2B');
    });

    it('Surrogate pairs (emoji)', () => {
      const url = generateURL('😀', '🚀', originalLocation);
      expect(url).toBe('TestQuickEDgenerateURL/?base=%F0%9F%98%80&final=%F0%9F%9A%80');
    });
    
})  ;


describe('readURLParameters', () => {
    const originalLocation = 'https:/TestQuickEDreadURLParameters/';
    it('Both base and final parameters', () => {
      let searchLocation = '?base=hello&final=world';
      expect(readURLParameters(searchLocation)).toEqual({ baseT: 'hello', finalT: 'world' });
    });

    it('Decode special characters', () => {
      let searchLocation = '?base=hello%20world!&final=foo%26bar';
      expect(readURLParameters(searchLocation)).toEqual({ baseT: 'hello world!', finalT: 'foo&bar' });
    });

    it('Empty parameters', () => {
      let searchLocation = '?base=&final=';
      expect(readURLParameters(searchLocation)).toEqual({ baseT: '', finalT: '' });
    });

    it('Decode unicode characters', () => {
      let searchLocation = '?base=%C3%A1%C3%A9%C3%AD&final=%E4%BD%A0%E5%A5%BD';
      expect(readURLParameters(searchLocation)).toEqual({ baseT: 'áéí', finalT: '你好' });
    });

    it('Decode line breaks', () => {
      let searchLocation = '?base=line1%0Aline2&final=final%0Atext';
      expect(readURLParameters(searchLocation)).toEqual({ baseT: 'line1\nline2', finalT: 'final\ntext' });
    });

    it('Handle only base parameter', () => {
      let searchLocation = '?base=base%20only';
      expect(readURLParameters(searchLocation)).toEqual({ baseT: 'base only', finalT: '' });
    });

    it('Handle only final parameter', () => {
      let searchLocation = '?final=final%20only';
      expect(readURLParameters(searchLocation)).toEqual({ baseT: '', finalT: 'final only' });
    });

    it('Handle no parameters', () => {
      let searchLocation = '';
      expect(readURLParameters(searchLocation)).toEqual({ baseT: '', finalT: '' });
    });

    it('Decode surrogate pairs (emoji)', () => {
      let searchLocation = '?base=%F0%9F%98%80&final=%F0%9F%9A%80';
      expect(readURLParameters(searchLocation)).toEqual({ baseT: '😀', finalT: '🚀' });
    });

    it('Handles missing question mark', () => {
      let searchLocation = 'base=abc&final=xyz';
      expect(readURLParameters(searchLocation)).toEqual({ baseT: 'abc', finalT: 'xyz' });
    });

    it('Handles malformed URL', () => {
      let searchLocation = '?base=abc&final=xyz&extra=123';
      expect(readURLParameters(searchLocation)).toEqual({ baseT: 'abc', finalT: 'xyz' });
    });

})
