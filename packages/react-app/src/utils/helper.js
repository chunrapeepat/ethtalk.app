import md5 from "md5";

export const hashURL = url => {
  return md5(url);
};

export const displayAddress = address => {
  let displayAddress = address.substr(0, 6);
  displayAddress += "..." + address.substr(-4);
  return displayAddress;
};

export const copyToClipboard = txt => {
  var m = document;
  txt = m.createTextNode(txt);
  var w = window;
  var b = m.body;
  b.appendChild(txt);
  if (b.createTextRange) {
    var d = b.createTextRange();
    d.moveToElementText(txt);
    d.select();
    m.execCommand("copy");
  } else {
    var d = m.createRange();
    var g = w.getSelection;
    d.selectNodeContents(txt);
    g().removeAllRanges();
    g().addRange(d);
    m.execCommand("copy");
    g().removeAllRanges();
  }
  txt.remove();
};
