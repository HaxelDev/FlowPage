package modules;

class System {
    public static function currentDate(): String {
        var date = Date.now();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        return year + "-" + pad(month) + "-" + pad(day) + " " + pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);
    }

    private static function pad(number: Int): String {
        return number < 10 ? "0" + number : Std.string(number);
    }

    public static function openUrl (url:String) : Void {
        js.Browser.window.open(url, "_blank");
    }

    public static function exit(): Void {
        js.Browser.window.close();
    }

    public static function println(message: String): Void {
        var outputDiv = js.Browser.document.getElementById('output');
        if (outputDiv != null) {
            outputDiv.innerHTML += message + "<br>";
        } else {
            Flow.error.report("Element with id 'output' not found.");
        }
    }

    public static function sleep(milliseconds: Int): Void {
        throw "sleep is not supported in a JavaScript/HTML context.";
    }

    public static function command(cmd: String): Void {
        throw "command is not supported in a JavaScript/HTML context.";
    }

    public static function systemName(): String {
        throw "systemName is not supported in a JavaScript/HTML context.";
    }
}
