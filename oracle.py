import json, sys, unicodedata as u
def nfc(s): return u.normalize('NFC', s)
def lv(s):
    return {
      'exact': s, 'nfc': nfc(s), 'nfkc': u.normalize('NFKC', s),
      'fold': nfc(nfc(s).casefold()),
      'nfkcfold': u.normalize('NFKC', u.normalize('NFKC', s).casefold()),
      'upper': s.upper(), 'lower': s.lower(),
    }
out = []
for s in json.load(sys.stdin):
    out.append(lv(s))
json.dump(out, sys.stdout, ensure_ascii=False)
