import flow.Lexer;
import flow.Parser;
import flow.Program;
import logs.*;

using StringTools;

class Main {
    static function main() {
        js.Browser.window.addEventListener('load', function(_) {
            var button = js.Browser.document.querySelector('.btn-run');
            if (button != null) {
                button.addEventListener('click', function(event) {
                    runFlowScript();
                });
            } else {
                Flow.error.report("Button element with class 'btn-run' not found");
            }
        });
    }

    static function runFlowScript():Void {
        try {
            var codeElement:js.html.Element = cast js.Browser.document.getElementById('code');
            if (codeElement != null && Std.is(codeElement, js.html.TextAreaElement)) {
                var codeInput:js.html.TextAreaElement = cast codeElement;
                var code = codeInput.value.trim();
                var outputDiv = js.Browser.document.getElementById('output');
                outputDiv.innerHTML = '';
    
                var tokens:Array<Token> = flow.Lexer.tokenize(code);
                var parser = new flow.Parser(tokens);
                var program:flow.Program = parser.parse();
                for (statement in program.statements) {
                    statement.execute();
                }
            } else {
                Flow.error.report("Element 'code' not found or not a TextAreaElement", false);
            }
        } catch (error:Dynamic) {
            Flow.error.report("Error executing Flow script: " + Std.string(error));
        }
    }
}
