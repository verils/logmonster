function LogConsole(el) {
  if (el[0] === '#') {
    this.console = document.getElementById(el.substring(1));
  }
  this.buffer = '';
}
LogConsole.prototype.append = function(text) {
  text = text.replace(/(DEBUG)/ig, '<span style="color: #A333C8;">$1</span>');
  text = text.replace(/(INFO)/ig, '<span style="color: #2185D0;"">$1</span>');
  text = text.replace(/(WARN|WARNING)/ig, '<span style="color: #F2711C;">$1</span>');
  text = text.replace(/(ERROR)/ig, '<span style="color: #DB2828;">$1</span>');
  this.buffer += text;
  this.console.innerHTML = this.buffer;
}
LogConsole.prototype.length = function() {
  return this.buffer.length;
}
