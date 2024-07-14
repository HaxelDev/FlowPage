package modules;

class IO {
    public static function readLine():String {
        return js.Browser.window.prompt("Enter input:");
    }

    public static function print(value:String):Void {
        var outputDiv = js.Browser.document.getElementById('output');
        if (outputDiv != null) {
            outputDiv.innerHTML += value;
        }
    }

    public static function println(value:String):Void {
        print(value + "<br>");
    }
}
