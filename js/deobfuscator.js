class Deobfuscator {
  constructor(options = {}) {
    this.variableMap = options.variableMap;
    this.stringArray = [];
    this.deobfuscatedCode = null;
  }

  deobfuscate(code) {
    return this._chain(code)
        ._parseAscii()
        ._parseAndRemoveStringArray()
        ._lookupAndReplaceStrings()
        ._replaceVariables()
        ._bracketToDotNotation();
  }

  setVariableMap(variableMap) {
    this.variableMap = variableMap;
    return this;
  }

  get() {
    if (this.deobfuscatedCode == null) {
      throw Error("No code was deobfuscated!");
    }
    return this.deobfuscatedCode;
  }

  _chain(code) {
    this.deobfuscatedCode = code;
    return this;
  }

  _parseAscii() {
    this.deobfuscatedCode = this.deobfuscatedCode.replace(/\\x([0-9A-F]{2})/g, (g, g1) => {
      return String.fromCharCode(parseInt(g1, 16));
    });
    return this;
  }

  _parseAndRemoveStringArray() {
    this.stringArray = this.deobfuscatedCode.substring(this.deobfuscatedCode.indexOf('["') + 2, this.deobfuscatedCode.indexOf('"];')).split(/"\s*,\s*"/g);
    this.deobfuscatedCode = this.deobfuscatedCode.substr(this.deobfuscatedCode.indexOf('\n') + 1);
    return this;
  }

  _lookupAndReplaceStrings() {
    this.deobfuscatedCode = this.deobfuscatedCode.replace(/_0x[0-9a-f]+\[(\d+)\]/g, (m, m1) => {
      return `"${this._escapeQuotes(this.stringArray[parseInt(m1, 10)])}"`;
    });
    return this;
  }

  _replaceVariables(input) {
    this.deobfuscatedCode = Object.keys(this.variableMap).reduce((decoded, key) => {
      return decoded.replace(new RegExp('\\b' + key + '\\b', 'g'), () => {
        return this.variableMap[key];
      });
    }, this.deobfuscatedCode);
    return this;
  }

  _bracketToDotNotation() {
    this.deobfuscatedCode = this.deobfuscatedCode.replace(/\[["'](\w+)["']\]/g, '.$1');
    return this;
  }

  _escapeQuotes(str) {
    return str.replace(/"/g, "\\\"");
  }
}