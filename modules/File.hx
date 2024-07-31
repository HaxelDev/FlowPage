package modules;

class File {
    public static function readFile(filePath:String):String {
        var content = js.Browser.window.localStorage.getItem(filePath);
        return content != null ? content : "";
    }

    public static function writeFile(filePath:String, content:String):Void {
        js.Browser.window.localStorage.setItem(filePath, content);
    }

    public static function exists(filePath:String):Bool {
        return js.Browser.window.localStorage.getItem(filePath) != null;
    }
}
