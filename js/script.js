const variableMap = {
  "_0x5c8dx1": "$menu",
  "_0x5c8dx2": "$wsmenucontent",
  "_0x5c8dx3": "openMenu",
  "_0x5c8dx4": "closeMenu"
};

document.addEventListener('DOMContentLoaded', main);

function main() {
  var obfuscatedCode   = document.querySelector('#source-code').value;
  var deobfuscatedCode = decode(obfuscatedCode);

  let editor = ace.edit("ace-editor");
  editor.setTheme("ace/theme/github");
  editor.session.setMode("ace/mode/javascript");
  editor.setValue(deobfuscatedCode);
  editor.clearSelection();

// Beautify the code...
  editor.getSession().setValue(js_beautify(editor.getValue(), {
    indent_size: 2
  }));
}

function decode(script) {
  var decoded = parseAscii(script);
  decoded = replaceWithStrings(decoded, parseStringArray(decoded));
  decoded = replaceVariables(decoded.substring(decoded.indexOf('\n') + 1), variableMap);
  decoded = bracketToDotNotation(decoded);
  return decoded;
}

function parseAscii(input) {
  return input.replace(/\\x([0-9A-F]{2})/g, (g, g1) => {
    return String.fromCharCode(parseInt(g1, 16));
  });
}

function parseStringArray(input) {
  return input.substring(input.indexOf('["') + 2, input.indexOf('"];')).split(/"\s*,\s*"/g);
}

function replaceWithStrings(input, arr) {
  return input.replace(/_0x[0-9a-f]+\[(\d+)\]/g, (m, m1) => {
    return `"${escapeQuotes(arr[parseInt(m1, 10)])}"`;
  });
}

function escapeQuotes(input) {
  return input.replace(/"/g, "\\\"");
}

function replaceVariables(input, variableMap) {
  return Object.keys(variableMap).reduce((decoded, key) => {
    return decoded.replace(new RegExp('\\b' + key + '\\b', 'g'), () => {
      return variableMap[key];
    });
  }, input);
}

function bracketToDotNotation(input) {
  return input.replace(/\["(\w+)"\]/g, '.$1');
}