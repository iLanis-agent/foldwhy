(function (root) {
  'use strict';
  // "Same text?" at six strictness levels. Normalization uses String.prototype.normalize (UAX #15). Case folding is approximated.
  function fold(s) {   // approximation of Unicode full case folding, one code point at a time (so final sigma context cannot interfere)
    return Array.from(s).map(function (c) { return c === '\u0131' ? c : c === '\u1e9e' ? 'ss' : c.toUpperCase().toLowerCase(); }).join('');
  }
  var LEVELS = [
    { id: 'exact', name: 'Exact code points', f: function (s) { return s; }, why: 'Same sequence of code points.' },
    { id: 'nfc', name: 'Canonical (NFC)', f: function (s) { return s.normalize('NFC'); }, why: 'Canonically equivalent: same character encoded differently (é as one code point or e + U+0301; Kelvin sign K and Angstrom sign Å also count).' },
    { id: 'nfkc', name: 'Compatibility (NFKC)', f: function (s) { return s.normalize('NFKC'); }, why: 'Compatibility equivalent: same abstract character in a different form (ﬁ ligature, full-width letters, superscripts, circled digits).' },
    { id: 'fold', name: 'Case-insensitive (NFC + case folding)', f: function (s) { return fold(s.normalize('NFC')).normalize('NFC'); }, why: 'Equal after case folding (ß = ss, ς = σ, İ is not i).' },
    { id: 'nfkcfold', name: 'Loosest (NFKC + case folding)', f: function (s) { return fold(s.normalize('NFKC')).normalize('NFKC'); }, why: 'Equal only when both compatibility forms and case are ignored.' }
  ];
  function cps(s) { return Array.from(s).map(function (c) { return 'U+' + c.codePointAt(0).toString(16).toUpperCase().padStart(4, '0'); }); }
  function graphemes(s) { return typeof Intl !== 'undefined' && Intl.Segmenter ? Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(s)).length : null; }
  function compare(a, b) {
    var first = null, rows = LEVELS.map(function (L) { var x = L.f(a), y = L.f(b), eq = x === y; if (eq && first === null) first = L.id; return { id: L.id, name: L.name, equal: eq, a: x, b: y, why: L.why }; });
    return { first: first, rows: rows };
  }
  function stats(s) { return { utf16: s.length, codePoints: Array.from(s).length, graphemes: graphemes(s), nfcLen: s.normalize('NFC').length, nfdLen: s.normalize('NFD').length, upper: s.toUpperCase(), lower: s.toLowerCase(), fold: fold(s), upperChangesLength: s.toUpperCase().length !== s.length }; }
  var api = { LEVELS: LEVELS, compare: compare, stats: stats, cps: cps, fold: fold };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.FoldWhy = api;
})(typeof window !== 'undefined' ? window : this);
