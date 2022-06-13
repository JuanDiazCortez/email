function arrayBufferToBase64(buffer) {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

let array = [
  37, 80, 68, 70, 45, 49, 46, 53, 10, 37, 167, 227, 241, 241, 10, 50, 32, 48,
  32, 111, 98, 106, 10, 60, 60, 10, 47, 84, 121, 112, 101, 32, 47, 67, 97, 116,
  97, 108, 111, 103, 10, 47, 80, 97, 103, 101, 115, 32, 52, 32, 48, 32, 82, 10,
  47, 65, 99, 114, 111, 70, 111, 114, 109, 32, 53, 32, 48, 32, 82, 10, 47, 86,
  101, 114, 115, 105, 111, 110, 32, 47, 49, 35, 50, 69, 53, 10, 62, 62, 10, 101,
  110, 100, 111, 98, 106, 10, 49, 49, 32, 48,
];

console.log(arrayBufferToBase64(array));
