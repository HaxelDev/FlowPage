package modules;

using StringTools;

class IO {
    public static function readLine(prompt:String):String {
        var input = js.Browser.window.prompt(prompt, "");
        return input != null ? input.trim() : "";
    }

    public static function print(value:String):Void {
        var outputDiv = js.Browser.document.getElementById('output');
        if (outputDiv != null) {
            outputDiv.innerHTML += value;
        } else {
            Flow.error.report("Element with id 'output' not found.");
        }
    }

    public static function println(value:String):Void {
        var outputDiv = js.Browser.document.getElementById('output');
        if (outputDiv != null) {
            outputDiv.innerHTML += value + "<br>";
        } else {
            Flow.error.report("Element with id 'output' not found.");
        }
    }

    public static function writeByte(value:Int):Void {
        throw "writeByte is not supported in a JavaScript/HTML context.";
    }
}
