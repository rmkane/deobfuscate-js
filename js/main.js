/* global ace */
const deobfuscator = new Deobfuscator();
let editor = null;

function main() {
  initializeEditor();
  syncTheme(); // Synchronize Theme
  attachEventHandlers();
  triggerEvent('.ui-button-deobfuscate', 'click');
}

function buttonAction(e) {
  let rawObfuscatedCode = document.querySelector('.input-code').value.trim();
  let rawVariableMap = document.querySelector('.input-map').value.trim();

  if (rawObfuscatedCode.length === 0 || rawVariableMap.length === 0) {
    alert("Error: Invalid parameter count!");
    return;
  }

  let variableMap = {};
  try {
    variableMap = JSON.parse(rawVariableMap);
  } catch (e) {
    alert("Warning: Invalid variable map, ignoring map until it's valid.");
  }

  let deobfuscatedCode = deobfuscator.setVariableMap(variableMap).deobfuscate(rawObfuscatedCode).get();

  // Beautify the code...
  editor.getSession().setValue(js_beautify(deobfuscatedCode, {
    indent_size: 2
  }));
}

function initializeEditor() {
  editor = ace.edit("ace-editor");
  editor.setTheme("ace/theme/monokai");
  editor.session.setMode("ace/mode/javascript");
}

function attachEventHandlers() {
  document.querySelector('.ui-button-deobfuscate').addEventListener('click', buttonAction);
}

function syncTheme() {
  syncElementStyles(['.input-code', '.input-map'], '.ace_editor', ['backgroundColor', 'borderColor', 'color']);
}