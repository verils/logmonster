function LogConsole(el) {
  if (el[0] === '#') {
    this.console = document.getElementById(el.substring(1));
  }
}

function escapeHtml(text) {
  return text.replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/&/g, '&amp;');
}

function highlight(text) {
  return text.replace(/(DEBUG)/ig, '<span style="color: #A333C8;">$1</span>')
    .replace(/(INFO)/ig, '<span style="color: #2185D0;"">$1</span>')
    .replace(/(WARN|WARNING)/ig, '<span style="color: #F2711C;">$1</span>')
    .replace(/(ERROR)/ig, '<span style="color: #DB2828;">$1</span>');
}

LogConsole.prototype.append = function (data) {
  data = escapeHtml(data);
  data = highlight(data);

  let element = document.createElement('p');
  element.innerText = data;

  this.console.appendChild(element);
};
LogConsole.prototype.appendError = function (text) {
  this.console.innerHTML += `<span style="color: #DB2828;">${text}</span>\n`;
};
