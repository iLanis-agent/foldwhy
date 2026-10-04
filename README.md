# FoldWhy
Compare two strings at five strictness levels (exact, NFC, NFKC, case folded, NFKC + case folded) and see where they become equal.
Static client-side app. Open `app.html`.
Source: Unicode UAX #15 (https://unicode.org/reports/tr15/) fetched; section 1.1 on canonical vs compatibility equivalence read directly (page cut at about 50 KB). Normalization is the browser's String.normalize.
Tests: `node test-engine.js` compares NFC, NFKC, case folding, upper and lower case against Python 3.10 `unicodedata` / `str.casefold` (`oracle.py`) on 6000 random strings built from a hand-picked pool of 66 characters and sequences (ligatures, Kelvin, Angstrom, Greek sigma forms, dotted and dotless i, sharp s, Hangul jamo, Devanagari nukta): 42000 comparisons, 0 mismatches.
Case folding is approximate: per code point upper-then-lower, with U+0131 kept and U+1E9E mapped to "ss". This matched Python's casefold only on that pool. Python 3.10 has Unicode 13 and Node 22 has Unicode 17, so characters added since 13 are untested. Locale-specific rules (Turkish) are not applied.
