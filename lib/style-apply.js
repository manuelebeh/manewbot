function apply(charMap, text) {
  let result = "";
  for (let char of text.split("")) {
    if (charMap[char] !== undefined) {
      result += charMap[char];
    } else if (charMap[char.toLowerCase()] !== undefined) {
      result += charMap[char.toLowerCase()];
    } else {
      result += char;
    }
  }
  return result;
}
function list(sampleText, styles) {
  let styleKeys = Object.keys(styles).filter(key => key.length < 3);
  let output = "\n*Style disponible:*\n\n";
  styleKeys.forEach((styleKey, index) => {
    output += index + 1 + ". " + apply(styles[styleKey], sampleText) + "\n";
  });
  return output;
}

module.exports = { apply, list };
