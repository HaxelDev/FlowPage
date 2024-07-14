package logs;

class Logger {
  static public function log(message:Dynamic) {
    var outputDiv = js.Browser.document.getElementById('output');
    outputDiv.innerHTML += message + '<br>';
    Console.log(message);
  }
}
