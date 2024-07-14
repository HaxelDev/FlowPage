package logs;

class Error {
  private static var instance:Error;
  private var lastErrorMessage:String;

  private function new() {}

  public static function getInstance():Error {
    if (instance == null) {
      instance = new Error();
    }
    return instance;
  }

  public function report(message:Dynamic, exitOnReport:Bool = true):Void {
    var errorMessage = '<span style="color: red; font-weight: bold;">Error! | ' + Std.string(message) + '</span>';
    Console.error('<red,u>Error! | $message</>');

    var outputDiv = js.Browser.document.getElementById('output');
    outputDiv.innerHTML += errorMessage + '<br>';
    lastErrorMessage = errorMessage;

    if (exitOnReport) {
      js.Browser.window.close();
    }
  }
}
