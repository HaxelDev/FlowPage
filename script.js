(function ($global) { "use strict";
var $estr = function() { return js_Boot.__string_rec(this,''); },$hxEnums = $hxEnums || {},$_;
function $extend(from, fields) {
	var proto = Object.create(from);
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var EReg = function(r,opt) {
	this.r = new RegExp(r,opt.split("u").join(""));
};
EReg.__name__ = true;
EReg.prototype = {
	match: function(s) {
		if(this.r.global) {
			this.r.lastIndex = 0;
		}
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,matched: function(n) {
		if(this.r.m != null && n >= 0 && n < this.r.m.length) {
			return this.r.m[n];
		} else {
			throw haxe_Exception.thrown("EReg::matched");
		}
	}
	,matchedPos: function() {
		if(this.r.m == null) {
			throw haxe_Exception.thrown("No string matched");
		}
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,matchSub: function(s,pos,len) {
		if(len == null) {
			len = -1;
		}
		if(this.r.global) {
			this.r.lastIndex = pos;
			this.r.m = this.r.exec(len < 0 ? s : HxOverrides.substr(s,0,pos + len));
			var b = this.r.m != null;
			if(b) {
				this.r.s = s;
			}
			return b;
		} else {
			var b = this.match(len < 0 ? HxOverrides.substr(s,pos,null) : HxOverrides.substr(s,pos,len));
			if(b) {
				this.r.s = s;
				this.r.m.index += pos;
			}
			return b;
		}
	}
	,map: function(s,f) {
		var offset = 0;
		var buf_b = "";
		while(true) {
			if(offset >= s.length) {
				break;
			} else if(!this.matchSub(s,offset)) {
				buf_b += Std.string(HxOverrides.substr(s,offset,null));
				break;
			}
			var p = this.matchedPos();
			buf_b += Std.string(HxOverrides.substr(s,offset,p.pos - offset));
			buf_b += Std.string(f(this));
			if(p.len == 0) {
				buf_b += Std.string(HxOverrides.substr(s,p.pos,1));
				offset = p.pos + 1;
			} else {
				offset = p.pos + p.len;
			}
			if(!this.r.global) {
				break;
			}
		}
		if(!this.r.global && offset > 0 && offset < s.length) {
			buf_b += Std.string(HxOverrides.substr(s,offset,null));
		}
		return buf_b;
	}
	,__class__: EReg
};
var Console = function() { };
Console.__name__ = true;
Console.printlnFormatted = function(s,outputStream) {
	if(outputStream == null) {
		outputStream = 0;
	}
	if(s == null) {
		s = "";
	}
	Console.printFormatted(s + "\n",outputStream);
};
Console.println = function(s,outputStream) {
	if(outputStream == null) {
		outputStream = 0;
	}
	if(s == null) {
		s = "";
	}
	Console.print(s + "\n",outputStream);
};
Console.format = function(s,formatMode) {
	s += "<//>";
	var activeFormatFlagStack = [];
	var groupedProceedingTags = [];
	var browserFormatArguments = [];
	var result = Console.formatTagPattern.map(s,function(e) {
		var escaped = e.matched(1) != null;
		if(escaped) {
			return e.matched(0);
		}
		var open = e.matched(2) == null;
		var tags = e.matched(3).split(",");
		if(!open && tags.length == 1) {
			if(tags[0] == "") {
				var last = activeFormatFlagStack[activeFormatFlagStack.length - 1];
				var i = activeFormatFlagStack.indexOf(last);
				if(i != -1) {
					var proceedingTags = groupedProceedingTags[i];
					activeFormatFlagStack.splice(i - proceedingTags,proceedingTags + 1);
					groupedProceedingTags.splice(i - proceedingTags,proceedingTags + 1);
				}
			} else if(FormatFlag.fromString(tags[0]) == "reset") {
				activeFormatFlagStack = [];
				groupedProceedingTags = [];
			} else {
				var flag = FormatFlag.fromString(tags[0]);
				if(flag != null) {
					var i = activeFormatFlagStack.indexOf(flag);
					if(i != -1) {
						var proceedingTags = groupedProceedingTags[i];
						activeFormatFlagStack.splice(i - proceedingTags,proceedingTags + 1);
						groupedProceedingTags.splice(i - proceedingTags,proceedingTags + 1);
					}
				}
			}
		} else {
			var proceedingTags = 0;
			var _g = 0;
			while(_g < tags.length) {
				var tag = tags[_g];
				++_g;
				var flag = FormatFlag.fromString(tag);
				if(flag == null) {
					return e.matched(0);
				}
				if(open) {
					activeFormatFlagStack.push(flag);
					groupedProceedingTags.push(proceedingTags);
					++proceedingTags;
				} else {
					var i = activeFormatFlagStack.indexOf(flag);
					if(i != -1) {
						var proceedingTags1 = groupedProceedingTags[i];
						activeFormatFlagStack.splice(i - proceedingTags1,proceedingTags1 + 1);
						groupedProceedingTags.splice(i - proceedingTags1,proceedingTags1 + 1);
					}
				}
			}
		}
		switch(formatMode) {
		case 0:
			if(open) {
				if(activeFormatFlagStack.length > 0) {
					var lastFlagCount = groupedProceedingTags[groupedProceedingTags.length - 1] + 1;
					var asciiFormatString = "";
					var _g = 0;
					var _g1 = lastFlagCount;
					while(_g < _g1) {
						var i = _g++;
						var idx = groupedProceedingTags.length - 1 - i;
						asciiFormatString += Console.getAsciiFormat(activeFormatFlagStack[idx]);
					}
					return asciiFormatString;
				} else {
					return "";
				}
			} else {
				var result = Console.getAsciiFormat("reset");
				var result1 = new Array(activeFormatFlagStack.length);
				var _g = 0;
				var _g1 = activeFormatFlagStack.length;
				while(_g < _g1) {
					var i = _g++;
					result1[i] = Console.getAsciiFormat(activeFormatFlagStack[i]);
				}
				var _g = [];
				var _g1 = 0;
				var _g2 = result1;
				while(_g1 < _g2.length) {
					var v = _g2[_g1];
					++_g1;
					if(v != null) {
						_g.push(v);
					}
				}
				return result + _g.join("");
			}
			break;
		case 1:
			var browserFormatArguments1 = browserFormatArguments;
			var result = new Array(activeFormatFlagStack.length);
			var _g = 0;
			var _g1 = activeFormatFlagStack.length;
			while(_g < _g1) {
				var i = _g++;
				result[i] = Console.getBrowserFormat(activeFormatFlagStack[i]);
			}
			var _g = [];
			var _g1 = 0;
			var _g2 = result;
			while(_g1 < _g2.length) {
				var v = _g2[_g1];
				++_g1;
				if(v != null) {
					_g.push(v);
				}
			}
			browserFormatArguments1.push(_g.join(";"));
			return "%c";
		case 2:
			return "";
		}
	});
	return { formatted : result, browserFormatArguments : browserFormatArguments};
};
Console.stripFormatting = function(s) {
	return Console.format(s,2).formatted;
};
Console.printFormatted = function(s,outputStream) {
	if(outputStream == null) {
		outputStream = 0;
	}
	if(s == null) {
		s = "";
	}
	var result = Console.format(s,Console.formatMode);
	if(Console.formatMode == 1) {
		var logArgs = [result.formatted].concat(result.browserFormatArguments);
		switch(outputStream) {
		case 1:
			console.warn.apply(console, logArgs);
			break;
		case 2:
			console.error.apply(console, logArgs);
			break;
		case 0:case 3:
			console.log.apply(console, logArgs);
			break;
		}
		return;
	}
	Console.print(result.formatted,outputStream);
};
Console.print = function(s,outputStream) {
	if(outputStream == null) {
		outputStream = 0;
	}
	if(s == null) {
		s = "";
	}
	if(Console.printIntercept != null) {
		var allowDefaultPrint = Console.printIntercept(s,outputStream);
		if(!allowDefaultPrint) {
			return;
		}
	}
	switch(outputStream) {
	case 1:
		console.warn(s);
		break;
	case 2:
		console.error(s);
		break;
	case 0:case 3:
		console.log(s);
		break;
	}
};
Console.getAsciiFormat = function(flag) {
	if(flag.charAt(0) == "#") {
		var hex = HxOverrides.substr(flag,1,null);
		var r = Std.parseInt("0x" + HxOverrides.substr(hex,0,2));
		var g = Std.parseInt("0x" + HxOverrides.substr(hex,2,2));
		var b = Std.parseInt("0x" + HxOverrides.substr(hex,4,2));
		return "\x1B[38;5;" + Console.rgbToAscii256(r,g,b) + "m";
	}
	if(HxOverrides.substr(flag,0,3) == "bg#") {
		var hex = HxOverrides.substr(flag,3,null);
		var r = Std.parseInt("0x" + HxOverrides.substr(hex,0,2));
		var g = Std.parseInt("0x" + HxOverrides.substr(hex,2,2));
		var b = Std.parseInt("0x" + HxOverrides.substr(hex,4,2));
		return "\x1B[48;5;" + Console.rgbToAscii256(r,g,b) + "m";
	}
	switch(flag) {
	case "bg_black":
		return "\x1B[48;5;" + 0 + "m";
	case "bg_blue":
		return "\x1B[48;5;" + 4 + "m";
	case "bg_cyan":
		return "\x1B[48;5;" + 6 + "m";
	case "bg_green":
		return "\x1B[48;5;" + 2 + "m";
	case "bg_light_black":
		return "\x1B[48;5;" + 8 + "m";
	case "bg_light_blue":
		return "\x1B[48;5;" + 12 + "m";
	case "bg_light_cyan":
		return "\x1B[48;5;" + 14 + "m";
	case "bg_light_green":
		return "\x1B[48;5;" + 10 + "m";
	case "bg_light_magenta":
		return "\x1B[48;5;" + 13 + "m";
	case "bg_light_red":
		return "\x1B[48;5;" + 9 + "m";
	case "bg_light_white":
		return "\x1B[48;5;" + 15 + "m";
	case "bg_light_yellow":
		return "\x1B[48;5;" + 11 + "m";
	case "bg_magenta":
		return "\x1B[48;5;" + 5 + "m";
	case "bg_red":
		return "\x1B[48;5;" + 1 + "m";
	case "bg_white":
		return "\x1B[48;5;" + 7 + "m";
	case "bg_yellow":
		return "\x1B[48;5;" + 3 + "m";
	case "black":
		return "\x1B[38;5;" + 0 + "m";
	case "blink":
		return "\x1B[5m";
	case "blue":
		return "\x1B[38;5;" + 4 + "m";
	case "bold":
		return "\x1B[1m";
	case "cyan":
		return "\x1B[38;5;" + 6 + "m";
	case "dim":
		return "\x1B[2m";
	case "green":
		return "\x1B[38;5;" + 2 + "m";
	case "hidden":
		return "\x1B[8m";
	case "invert":
		return "\x1B[7m";
	case "italic":
		return "\x1B[3m";
	case "light_black":
		return "\x1B[38;5;" + 8 + "m";
	case "light_blue":
		return "\x1B[38;5;" + 12 + "m";
	case "light_cyan":
		return "\x1B[38;5;" + 14 + "m";
	case "light_green":
		return "\x1B[38;5;" + 10 + "m";
	case "light_magenta":
		return "\x1B[38;5;" + 13 + "m";
	case "light_red":
		return "\x1B[38;5;" + 9 + "m";
	case "light_white":
		return "\x1B[38;5;" + 15 + "m";
	case "light_yellow":
		return "\x1B[38;5;" + 11 + "m";
	case "magenta":
		return "\x1B[38;5;" + 5 + "m";
	case "red":
		return "\x1B[38;5;" + 1 + "m";
	case "reset":
		return "\x1B[m";
	case "underline":
		return "\x1B[4m";
	case "white":
		return "\x1B[38;5;" + 7 + "m";
	case "yellow":
		return "\x1B[38;5;" + 3 + "m";
	default:
		return "";
	}
};
Console.rgbToAscii256 = function(r,g,b) {
	var nearIdx = function(c,set) {
		var delta = Infinity;
		var index = -1;
		var _g = 0;
		var _g1 = set.length;
		while(_g < _g1) {
			var i = _g++;
			var d = Math.abs(c - set[i]);
			if(d < delta) {
				delta = d;
				index = i;
			}
		}
		return index;
	};
	var colorSteps = [0,95,135,175,215,255];
	var ir = nearIdx(r,colorSteps);
	var ig = nearIdx(g,colorSteps);
	var ib = nearIdx(b,colorSteps);
	var ier = Math.abs(r - colorSteps[ir]);
	var ieg = Math.abs(g - colorSteps[ig]);
	var ieb = Math.abs(b - colorSteps[ib]);
	var averageColorError = ier + ieg + ieb;
	var jr = Math.round((r - 8) / 10);
	var jg = Math.round((g - 8) / 10);
	var jb = Math.round((b - 8) / 10);
	var jer = Math.abs(r - Math.max(Math.min(jr * 10 + 8,238),8));
	var jeg = Math.abs(g - Math.max(Math.min(jg * 10 + 8,238),8));
	var jeb = Math.abs(b - Math.max(Math.min(jb * 10 + 8,238),8));
	var averageGrayError = jer + jeg + jeb;
	if(averageGrayError < averageColorError && r == g && g == b) {
		var grayIndex = jr + 232;
		return grayIndex;
	} else {
		var colorIndex = 16 + ir * 36 + ig * 6 + ib;
		return colorIndex;
	}
};
Console.getBrowserFormat = function(flag) {
	if(flag.charAt(0) == "#") {
		return "color: " + flag;
	}
	if(HxOverrides.substr(flag,0,3) == "bg#") {
		return "background-color: " + HxOverrides.substr(flag,2,null);
	}
	if(flag.charAt(0) == "{") {
		return HxOverrides.substr(flag,1,flag.length - 2);
	}
	switch(flag) {
	case "bg_black":
		return "background-color: black";
	case "bg_blue":
		return "background-color: blue";
	case "bg_cyan":
		return "background-color: cyan";
	case "bg_green":
		return "background-color: green";
	case "bg_light_black":
		return "background-color: gray";
	case "bg_light_blue":
		return "background-color: lightBlue";
	case "bg_light_cyan":
		return "background-color: lightCyan";
	case "bg_light_green":
		return "background-color: lightGreen";
	case "bg_light_magenta":
		return "background-color: lightPink";
	case "bg_light_red":
		return "background-color: salmon";
	case "bg_light_white":
		return "background-color: white";
	case "bg_light_yellow":
		return "background-color: lightYellow";
	case "bg_magenta":
		return "background-color: magenta";
	case "bg_red":
		return "background-color: red";
	case "bg_white":
		return "background-color: whiteSmoke";
	case "bg_yellow":
		return "background-color: gold";
	case "black":
		return "color: black";
	case "blink":
		return "text-decoration: blink";
	case "blue":
		return "color: blue";
	case "bold":
		return "font-weight: bold";
	case "cyan":
		return "color: cyan";
	case "dim":
		return "color: gray";
	case "green":
		return "color: green";
	case "hidden":
		return "visibility: hidden; color: white";
	case "invert":
		return "-webkit-filter: invert(100%); filter: invert(100%)";
	case "italic":
		return "font-style: italic";
	case "light_black":
		return "color: gray";
	case "light_blue":
		return "color: lightBlue";
	case "light_cyan":
		return "color: lightCyan";
	case "light_green":
		return "color: lightGreen";
	case "light_magenta":
		return "color: lightPink";
	case "light_red":
		return "color: salmon";
	case "light_white":
		return "color: white";
	case "light_yellow":
		return "color: #ffed88";
	case "magenta":
		return "color: magenta";
	case "red":
		return "color: red";
	case "reset":
		return "";
	case "underline":
		return "text-decoration: underline";
	case "white":
		return "color: whiteSmoke";
	case "yellow":
		return "color: #f5ba00";
	default:
		return "";
	}
};
Console.determineConsoleFormatMode = function() {
	var hasWindowObject = typeof(window) != "undefined";
	if(hasWindowObject) {
		return 1;
	} else {
		var isTTY = (typeof process !== "undefined") && (process?.stdout?.isTTY === true);
		if(isTTY) {
			return 0;
		}
	}
	return 2;
};
var FormatFlag = {};
FormatFlag.fromString = function(str) {
	str = str.toLowerCase();
	if(str.charAt(0) == "#" || HxOverrides.substr(str,0,3) == "bg#") {
		var hIdx = str.indexOf("#");
		var hex = HxOverrides.substr(str,hIdx + 1,null);
		if(hex.length == 3) {
			var a = hex.split("");
			hex = [a[0],a[0],a[1],a[1],a[2],a[2]].join("");
		}
		if(new EReg("[^0-9a-f]","i").match(hex) || hex.length < 6) {
			return "";
		}
		var normalized = str.substring(0,hIdx) + "#" + hex;
		return normalized;
	}
	switch(str) {
	case "!":
		return "invert";
	case "/":
		return "reset";
	case "b":
		return "bold";
	case "bg_gray":
		return "bg_light_black";
	case "gray":
		return "light_black";
	case "i":
		return "italic";
	case "u":
		return "underline";
	default:
		return str;
	}
};
var logs_Error = function() {
};
logs_Error.__name__ = true;
logs_Error.getInstance = function() {
	if(logs_Error.instance == null) {
		logs_Error.instance = new logs_Error();
	}
	return logs_Error.instance;
};
logs_Error.prototype = {
	report: function(message,exitOnReport) {
		if(exitOnReport == null) {
			exitOnReport = true;
		}
		var errorMessage = "<span style=\"color: red; font-weight: bold;\">Error! | " + Std.string(message) + "</span>";
		var s = Console.errorPrefix + ("" + ("<red,u>Error! | " + Std.string(message) + "</>"));
		var outputStream = 2;
		if(outputStream == null) {
			outputStream = 0;
		}
		if(s == null) {
			s = "";
		}
		Console.printFormatted(s + "\n",outputStream);
		var outputDiv = window.document.getElementById("output");
		outputDiv.innerHTML += errorMessage + "<br>";
		this.lastErrorMessage = errorMessage;
		if(exitOnReport) {
			window.close();
		}
	}
	,__class__: logs_Error
};
var Flow = function() { };
Flow.__name__ = true;
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) {
		return undefined;
	}
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(len == null) {
		len = s.length;
	} else if(len < 0) {
		if(pos == 0) {
			len = s.length + len;
		} else {
			return "";
		}
	}
	return s.substr(pos,len);
};
HxOverrides.now = function() {
	return Date.now();
};
var Main = function() { };
Main.__name__ = true;
Main.main = function() {
	window.addEventListener("load",function(_) {
		var button = window.document.querySelector(".btn-run");
		if(button != null) {
			button.addEventListener("click",function(event) {
				Main.runFlowScript();
			});
		} else {
			Flow.error.report("Button element with class 'btn-run' not found");
		}
	});
};
Main.runFlowScript = function() {
	try {
		var codeElement = window.document.getElementById("code");
		if(codeElement != null && ((codeElement) instanceof HTMLTextAreaElement)) {
			var codeInput = codeElement;
			var code = StringTools.trim(codeInput.value);
			var outputDiv = window.document.getElementById("output");
			outputDiv.innerHTML = "";
			var tokens = flow_Lexer.tokenize(code);
			var parser = new flow_Parser(tokens);
			var program = parser.parse();
			var _g = 0;
			var _g1 = program.statements;
			while(_g < _g1.length) {
				var statement = _g1[_g];
				++_g;
				statement.execute();
			}
		} else {
			Flow.error.report("Element 'code' not found or not a TextAreaElement",false);
		}
	} catch( _g ) {
		var error = haxe_Exception.caught(_g).unwrap();
		Flow.error.report("Error executing Flow script: " + Std.string(error));
	}
};
Math.__name__ = true;
var Reflect = function() { };
Reflect.__name__ = true;
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( _g ) {
		return null;
	}
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) {
			a.push(f);
		}
		}
	}
	return a;
};
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std.parseInt = function(x) {
	if(x != null) {
		var _g = 0;
		var _g1 = x.length;
		while(_g < _g1) {
			var i = _g++;
			var c = x.charCodeAt(i);
			if(c <= 8 || c >= 14 && c != 32 && c != 45) {
				var nc = x.charCodeAt(i + 1);
				var v = parseInt(x,nc == 120 || nc == 88 ? 16 : 10);
				if(isNaN(v)) {
					return null;
				} else {
					return v;
				}
			}
		}
	}
	return null;
};
Std.random = function(x) {
	if(x <= 0) {
		return 0;
	} else {
		return Math.floor(Math.random() * x);
	}
};
var StringTools = function() { };
StringTools.__name__ = true;
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	if(!(c > 8 && c < 14)) {
		return c == 32;
	} else {
		return true;
	}
};
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) ++r;
	if(r > 0) {
		return HxOverrides.substr(s,r,l - r);
	} else {
		return s;
	}
};
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) ++r;
	if(r > 0) {
		return HxOverrides.substr(s,0,l - r);
	} else {
		return s;
	}
};
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
};
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
};
var ValueType = $hxEnums["ValueType"] = { __ename__:true,__constructs__:null
	,TNull: {_hx_name:"TNull",_hx_index:0,__enum__:"ValueType",toString:$estr}
	,TInt: {_hx_name:"TInt",_hx_index:1,__enum__:"ValueType",toString:$estr}
	,TFloat: {_hx_name:"TFloat",_hx_index:2,__enum__:"ValueType",toString:$estr}
	,TBool: {_hx_name:"TBool",_hx_index:3,__enum__:"ValueType",toString:$estr}
	,TObject: {_hx_name:"TObject",_hx_index:4,__enum__:"ValueType",toString:$estr}
	,TFunction: {_hx_name:"TFunction",_hx_index:5,__enum__:"ValueType",toString:$estr}
	,TClass: ($_=function(c) { return {_hx_index:6,c:c,__enum__:"ValueType",toString:$estr}; },$_._hx_name="TClass",$_.__params__ = ["c"],$_)
	,TEnum: ($_=function(e) { return {_hx_index:7,e:e,__enum__:"ValueType",toString:$estr}; },$_._hx_name="TEnum",$_.__params__ = ["e"],$_)
	,TUnknown: {_hx_name:"TUnknown",_hx_index:8,__enum__:"ValueType",toString:$estr}
};
ValueType.__constructs__ = [ValueType.TNull,ValueType.TInt,ValueType.TFloat,ValueType.TBool,ValueType.TObject,ValueType.TFunction,ValueType.TClass,ValueType.TEnum,ValueType.TUnknown];
var Type = function() { };
Type.__name__ = true;
Type.typeof = function(v) {
	switch(typeof(v)) {
	case "boolean":
		return ValueType.TBool;
	case "function":
		if(v.__name__ || v.__ename__) {
			return ValueType.TObject;
		}
		return ValueType.TFunction;
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) {
			return ValueType.TInt;
		}
		return ValueType.TFloat;
	case "object":
		if(v == null) {
			return ValueType.TNull;
		}
		var e = v.__enum__;
		if(e != null) {
			return ValueType.TEnum($hxEnums[e]);
		}
		var c = js_Boot.getClass(v);
		if(c != null) {
			return ValueType.TClass(c);
		}
		return ValueType.TObject;
	case "string":
		return ValueType.TClass(String);
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
};
var flow_Lexer = function() { };
flow_Lexer.__name__ = true;
flow_Lexer.tokenize = function(code) {
	var tokens = [];
	var currentToken = "";
	var inString = false;
	var i = 0;
	while(i < code.length) {
		var char = code.charAt(i);
		if(char == "\"" || char == "'") {
			if(inString) {
				if(currentToken.length > 0 && currentToken.charAt(currentToken.length - 1) == "\\") {
					currentToken = currentToken.substring(0,currentToken.length - 1) + char;
				} else {
					tokens.push(new flow_Token(flow_TokenType.STRING,currentToken));
					currentToken = "";
				}
				inString = false;
			} else {
				inString = true;
			}
			++i;
			continue;
		} else if(inString) {
			currentToken += char;
			++i;
			continue;
		} else if(char == "/" && i + 1 < code.length && code.charAt(i + 1) == "/") {
			while(i < code.length && code.charAt(i) != "\n") ++i;
			continue;
		} else if(flow_Lexer.isAlpha(char) || char == "_") {
			currentToken += char;
		} else if(flow_Lexer.isNumeric(char)) {
			currentToken += char;
		} else if(char == "(" || char == ")" || char == "{" || char == "}" || char == "[" || char == "]" || char == "," || char == ":" || char == "+" || char == "-" || char == "*" || char == "/" || char == "=" || char == ">" || char == "<" || char == ";" || char == "." || char == "!") {
			if(currentToken.length > 0) {
				tokens.push(flow_Lexer.getToken(currentToken));
				currentToken = "";
			}
			var symbol = char;
			if(char == "=") {
				if(i + 1 < code.length && (code.charAt(i + 1) == "=" || code.charAt(i + 1) == ">" || code.charAt(i + 1) == "<")) {
					symbol += code.charAt(i + 1);
					++i;
				}
			}
			tokens.push(new flow_Token(flow_Lexer.getSymbolType(symbol),symbol));
		} else if(currentToken.length > 0) {
			tokens.push(flow_Lexer.getToken(currentToken));
			currentToken = "";
		}
		++i;
	}
	if(currentToken.length > 0) {
		tokens.push(flow_Lexer.getToken(currentToken));
	}
	return tokens;
};
flow_Lexer.getToken = function(token) {
	switch(token) {
	case "!=":
		return new flow_Token(flow_TokenType.BANG_EQUAL,token);
	case "*":
		return new flow_Token(flow_TokenType.MULTIPLY,token);
	case "/":
		return new flow_Token(flow_TokenType.DIVIDE,token);
	case ";":
		return new flow_Token(flow_TokenType.SEMICOLON,token);
	case "<":
		return new flow_Token(flow_TokenType.LESS,token);
	case "<<":
		return new flow_Token(flow_TokenType.LEFT_SHIFT,token);
	case "<=":
		return new flow_Token(flow_TokenType.LESS_EQUAL,token);
	case "=":
		return new flow_Token(flow_TokenType.EQUAL,token);
	case "==":
		return new flow_Token(flow_TokenType.EQUAL_EQUAL,token);
	case ">":
		return new flow_Token(flow_TokenType.GREATER,token);
	case ">=":
		return new flow_Token(flow_TokenType.GREATER_EQUAL,token);
	case ">>":
		return new flow_Token(flow_TokenType.RIGHT_SHIFT,token);
	case "File":
		return new flow_Token(flow_TokenType.FILE,token);
	case "IO":
		return new flow_Token(flow_TokenType.IO,token);
	case "Json":
		return new flow_Token(flow_TokenType.JSON,token);
	case "Random":
		return new flow_Token(flow_TokenType.RANDOM,token);
	case "System":
		return new flow_Token(flow_TokenType.SYSTEM,token);
	case "and":
		return new flow_Token(flow_TokenType.AND,token);
	case "call":
		return new flow_Token(flow_TokenType.KEYWORD,token);
	case "else":
		return new flow_Token(flow_TokenType.KEYWORD,token);
	case "false":
		return new flow_Token(flow_TokenType.FALSE,token);
	case "for":
		return new flow_Token(flow_TokenType.KEYWORD,token);
	case "func":
		return new flow_Token(flow_TokenType.KEYWORD,token);
	case "if":
		return new flow_Token(flow_TokenType.KEYWORD,token);
	case "in":
		return new flow_Token(flow_TokenType.IN,token);
	case "let":
		return new flow_Token(flow_TokenType.KEYWORD,token);
	case "or":
		return new flow_Token(flow_TokenType.OR,token);
	case "print":
		return new flow_Token(flow_TokenType.KEYWORD,token);
	case "range":
		return new flow_Token(flow_TokenType.RANGE,token);
	case "return":
		return new flow_Token(flow_TokenType.KEYWORD,token);
	case "true":
		return new flow_Token(flow_TokenType.TRUE,token);
	case "while":
		return new flow_Token(flow_TokenType.KEYWORD,token);
	default:
		if(flow_Lexer.isNumeric(token)) {
			return new flow_Token(flow_TokenType.NUMBER,token);
		} else {
			return new flow_Token(flow_TokenType.IDENTIFIER,token);
		}
	}
};
flow_Lexer.getSymbolType = function(char) {
	switch(char) {
	case "!=":
		return flow_TokenType.BANG_EQUAL;
	case "(":
		return flow_TokenType.LPAREN;
	case ")":
		return flow_TokenType.RPAREN;
	case "*":
		return flow_TokenType.MULTIPLY;
	case "+":
		return flow_TokenType.PLUS;
	case ",":
		return flow_TokenType.COMMA;
	case "-":
		return flow_TokenType.MINUS;
	case "/":
		return flow_TokenType.DIVIDE;
	case ":":
		return flow_TokenType.COLON;
	case ";":
		return flow_TokenType.SEMICOLON;
	case "<":
		return flow_TokenType.LESS;
	case "<=":
		return flow_TokenType.LESS_EQUAL;
	case "=":
		return flow_TokenType.EQUAL;
	case "==":
		return flow_TokenType.EQUAL_EQUAL;
	case ">":
		return flow_TokenType.GREATER;
	case ">=":
		return flow_TokenType.GREATER_EQUAL;
	case "[":
		return flow_TokenType.LBRACKET;
	case "]":
		return flow_TokenType.RBRACKET;
	case "{":
		return flow_TokenType.LBRACE;
	case "}":
		return flow_TokenType.RBRACE;
	default:
		return flow_TokenType.SYMBOL;
	}
};
flow_Lexer.isAlpha = function(char) {
	var code = HxOverrides.cca(char,0);
	if(!(code >= 65 && code <= 90)) {
		if(code >= 97) {
			return code <= 122;
		} else {
			return false;
		}
	} else {
		return true;
	}
};
flow_Lexer.isNumeric = function(char) {
	if(Std.parseInt(char) == null) {
		return char == ".";
	} else {
		return true;
	}
};
var flow_Token = function(type,value) {
	this.type = type;
	this.value = value;
};
flow_Token.__name__ = true;
flow_Token.prototype = {
	__class__: flow_Token
};
var flow_TokenType = $hxEnums["flow.TokenType"] = { __ename__:true,__constructs__:null
	,KEYWORD: {_hx_name:"KEYWORD",_hx_index:0,__enum__:"flow.TokenType",toString:$estr}
	,SYMBOL: {_hx_name:"SYMBOL",_hx_index:1,__enum__:"flow.TokenType",toString:$estr}
	,STRING: {_hx_name:"STRING",_hx_index:2,__enum__:"flow.TokenType",toString:$estr}
	,LPAREN: {_hx_name:"LPAREN",_hx_index:3,__enum__:"flow.TokenType",toString:$estr}
	,RPAREN: {_hx_name:"RPAREN",_hx_index:4,__enum__:"flow.TokenType",toString:$estr}
	,LBRACE: {_hx_name:"LBRACE",_hx_index:5,__enum__:"flow.TokenType",toString:$estr}
	,RBRACE: {_hx_name:"RBRACE",_hx_index:6,__enum__:"flow.TokenType",toString:$estr}
	,LBRACKET: {_hx_name:"LBRACKET",_hx_index:7,__enum__:"flow.TokenType",toString:$estr}
	,RBRACKET: {_hx_name:"RBRACKET",_hx_index:8,__enum__:"flow.TokenType",toString:$estr}
	,COMMA: {_hx_name:"COMMA",_hx_index:9,__enum__:"flow.TokenType",toString:$estr}
	,DOT: {_hx_name:"DOT",_hx_index:10,__enum__:"flow.TokenType",toString:$estr}
	,COLON: {_hx_name:"COLON",_hx_index:11,__enum__:"flow.TokenType",toString:$estr}
	,PLUS: {_hx_name:"PLUS",_hx_index:12,__enum__:"flow.TokenType",toString:$estr}
	,MINUS: {_hx_name:"MINUS",_hx_index:13,__enum__:"flow.TokenType",toString:$estr}
	,MULTIPLY: {_hx_name:"MULTIPLY",_hx_index:14,__enum__:"flow.TokenType",toString:$estr}
	,DIVIDE: {_hx_name:"DIVIDE",_hx_index:15,__enum__:"flow.TokenType",toString:$estr}
	,EQUAL: {_hx_name:"EQUAL",_hx_index:16,__enum__:"flow.TokenType",toString:$estr}
	,IDENTIFIER: {_hx_name:"IDENTIFIER",_hx_index:17,__enum__:"flow.TokenType",toString:$estr}
	,NUMBER: {_hx_name:"NUMBER",_hx_index:18,__enum__:"flow.TokenType",toString:$estr}
	,BANG: {_hx_name:"BANG",_hx_index:19,__enum__:"flow.TokenType",toString:$estr}
	,EQUAL_EQUAL: {_hx_name:"EQUAL_EQUAL",_hx_index:20,__enum__:"flow.TokenType",toString:$estr}
	,BANG_EQUAL: {_hx_name:"BANG_EQUAL",_hx_index:21,__enum__:"flow.TokenType",toString:$estr}
	,GREATER: {_hx_name:"GREATER",_hx_index:22,__enum__:"flow.TokenType",toString:$estr}
	,GREATER_EQUAL: {_hx_name:"GREATER_EQUAL",_hx_index:23,__enum__:"flow.TokenType",toString:$estr}
	,LESS: {_hx_name:"LESS",_hx_index:24,__enum__:"flow.TokenType",toString:$estr}
	,LESS_EQUAL: {_hx_name:"LESS_EQUAL",_hx_index:25,__enum__:"flow.TokenType",toString:$estr}
	,SEMICOLON: {_hx_name:"SEMICOLON",_hx_index:26,__enum__:"flow.TokenType",toString:$estr}
	,TRUE: {_hx_name:"TRUE",_hx_index:27,__enum__:"flow.TokenType",toString:$estr}
	,FALSE: {_hx_name:"FALSE",_hx_index:28,__enum__:"flow.TokenType",toString:$estr}
	,AND: {_hx_name:"AND",_hx_index:29,__enum__:"flow.TokenType",toString:$estr}
	,OR: {_hx_name:"OR",_hx_index:30,__enum__:"flow.TokenType",toString:$estr}
	,IN: {_hx_name:"IN",_hx_index:31,__enum__:"flow.TokenType",toString:$estr}
	,RANGE: {_hx_name:"RANGE",_hx_index:32,__enum__:"flow.TokenType",toString:$estr}
	,LEFT_SHIFT: {_hx_name:"LEFT_SHIFT",_hx_index:33,__enum__:"flow.TokenType",toString:$estr}
	,RIGHT_SHIFT: {_hx_name:"RIGHT_SHIFT",_hx_index:34,__enum__:"flow.TokenType",toString:$estr}
	,IO: {_hx_name:"IO",_hx_index:35,__enum__:"flow.TokenType",toString:$estr}
	,RANDOM: {_hx_name:"RANDOM",_hx_index:36,__enum__:"flow.TokenType",toString:$estr}
	,SYSTEM: {_hx_name:"SYSTEM",_hx_index:37,__enum__:"flow.TokenType",toString:$estr}
	,FILE: {_hx_name:"FILE",_hx_index:38,__enum__:"flow.TokenType",toString:$estr}
	,JSON: {_hx_name:"JSON",_hx_index:39,__enum__:"flow.TokenType",toString:$estr}
};
flow_TokenType.__constructs__ = [flow_TokenType.KEYWORD,flow_TokenType.SYMBOL,flow_TokenType.STRING,flow_TokenType.LPAREN,flow_TokenType.RPAREN,flow_TokenType.LBRACE,flow_TokenType.RBRACE,flow_TokenType.LBRACKET,flow_TokenType.RBRACKET,flow_TokenType.COMMA,flow_TokenType.DOT,flow_TokenType.COLON,flow_TokenType.PLUS,flow_TokenType.MINUS,flow_TokenType.MULTIPLY,flow_TokenType.DIVIDE,flow_TokenType.EQUAL,flow_TokenType.IDENTIFIER,flow_TokenType.NUMBER,flow_TokenType.BANG,flow_TokenType.EQUAL_EQUAL,flow_TokenType.BANG_EQUAL,flow_TokenType.GREATER,flow_TokenType.GREATER_EQUAL,flow_TokenType.LESS,flow_TokenType.LESS_EQUAL,flow_TokenType.SEMICOLON,flow_TokenType.TRUE,flow_TokenType.FALSE,flow_TokenType.AND,flow_TokenType.OR,flow_TokenType.IN,flow_TokenType.RANGE,flow_TokenType.LEFT_SHIFT,flow_TokenType.RIGHT_SHIFT,flow_TokenType.IO,flow_TokenType.RANDOM,flow_TokenType.SYSTEM,flow_TokenType.FILE,flow_TokenType.JSON];
var flow_Parser = function(tokens) {
	this.tokens = tokens;
	this.currentTokenIndex = 0;
};
flow_Parser.__name__ = true;
flow_Parser.prototype = {
	parse: function() {
		var statements = [];
		while(!this.isAtEnd()) {
			var statement = this.parseStatement();
			statements.push(statement);
		}
		return new flow_Program(statements);
	}
	,parseStatement: function() {
		var firstTokenType = this.peek().type;
		if(firstTokenType == flow_TokenType.KEYWORD) {
			var keyword = this.advance().value;
			if(keyword == "print") {
				return this.parsePrintStatement();
			} else if(keyword == "let") {
				return this.parseLetStatement();
			} else if(keyword == "if") {
				return this.parseIfStatement();
			} else if(keyword == "while") {
				return this.parseWhileStatement();
			} else if(keyword == "for") {
				return this.parseForStatement();
			} else if(keyword == "func") {
				return this.parseFuncStatement();
			} else if(keyword == "call") {
				return this.parseCallStatement();
			} else if(keyword == "return") {
				return this.parseReturnStatement();
			} else {
				Flow.error.report("Unknown keyword: " + keyword);
				return null;
			}
		} else if(firstTokenType == flow_TokenType.IO) {
			return this.parseIOStatement();
		} else if(firstTokenType == flow_TokenType.RANDOM) {
			return this.parseRandomStatement();
		} else if(firstTokenType == flow_TokenType.SYSTEM) {
			return this.parseSystemStatement();
		} else if(firstTokenType == flow_TokenType.FILE) {
			return this.parseFileStatement();
		} else if(firstTokenType == flow_TokenType.JSON) {
			return this.parseJsonStatement();
		} else if(firstTokenType == flow_TokenType.IDENTIFIER) {
			return this.parseLetStatement();
		} else {
			Flow.error.report("Unexpected token: " + this.peek().value);
			return null;
		}
	}
	,parseLetStatement: function() {
		var nameToken = this.consume(flow_TokenType.IDENTIFIER,"Expected variable name after 'let'");
		var name = nameToken.value;
		this.consume(flow_TokenType.EQUAL,"Expected '=' after variable name");
		var initializer;
		if(this.check(flow_TokenType.LBRACKET)) {
			initializer = this.parseArrayLiteral();
		} else if(this.check(flow_TokenType.LBRACE)) {
			initializer = this.parseObjectLiteral();
		} else {
			initializer = this.parseExpression();
		}
		return new flow_LetStatement(name,initializer);
	}
	,parseArrayLiteral: function() {
		this.consume(flow_TokenType.LBRACKET,"Expected '[' to start array literal");
		var elements = [];
		while(!this.check(flow_TokenType.RBRACKET) && !this.isAtEnd()) {
			var element = this.parseExpression();
			elements.push(element);
			if(this.match([flow_TokenType.COMMA])) {
				if(this.check(flow_TokenType.RBRACKET)) {
					break;
				}
			}
		}
		this.consume(flow_TokenType.RBRACKET,"Expected ']' after array literal");
		return new flow_ArrayLiteralExpression(elements);
	}
	,parseObjectLiteral: function() {
		var properties = new haxe_ds_StringMap();
		this.consume(flow_TokenType.LBRACE,"Expected '{' to start object literal");
		while(!this.check(flow_TokenType.RBRACE)) {
			var key = this.consume(flow_TokenType.IDENTIFIER,"Expected property name");
			this.consume(flow_TokenType.COLON,"Expected ':' after property name");
			if(this.check(flow_TokenType.LBRACKET)) {
				var elements = [];
				this.consume(flow_TokenType.LBRACKET,"Expected '[' for array property");
				while(!this.check(flow_TokenType.RBRACKET) && !this.isAtEnd()) {
					var element = this.parseExpression();
					elements.push(element);
					if(this.match([flow_TokenType.COMMA])) {
						if(this.check(flow_TokenType.RBRACKET)) {
							break;
						}
					}
				}
				this.consume(flow_TokenType.RBRACKET,"Expected ']' after array property");
				var k = key.value;
				var v = new flow_ArrayLiteralExpression(elements);
				properties.h[k] = v;
			} else {
				var value = this.parseExpression();
				properties.h[key.value] = value;
			}
			var tmp = this.match([flow_TokenType.COMMA]);
		}
		this.consume(flow_TokenType.RBRACE,"Expected '}' after object literal");
		return new flow_ObjectExpression(properties);
	}
	,parsePrintStatement: function() {
		this.consume(flow_TokenType.LPAREN,"Expected '(' after 'print'");
		var expression = this.parseExpression();
		this.consume(flow_TokenType.RPAREN,"Expected ')' after expression");
		return new flow_PrintStatement(expression);
	}
	,parseIfStatement: function() {
		var condition = this.parseExpression();
		var thenBranch = this.parseBlock();
		var elseBranch = null;
		if(this.match([flow_TokenType.KEYWORD])) {
			var keyword = this.previous().value;
			if(keyword == "else") {
				if(this.peek().type == flow_TokenType.KEYWORD && this.peek().value == "if") {
					this.advance();
					elseBranch = this.parseIfStatement();
				} else {
					elseBranch = this.parseBlock();
				}
			}
		}
		return new flow_IfStatement(condition,thenBranch,elseBranch);
	}
	,parseWhileStatement: function() {
		var condition = this.parseExpression();
		var body = this.parseBlock();
		return new flow_WhileStatement(condition,body);
	}
	,parseForStatement: function() {
		var variableToken = this.consume(flow_TokenType.IDENTIFIER,"Expected identifier after 'for'");
		var variableName = variableToken.value;
		this.consume(flow_TokenType.IN,"Expected 'in' after identifier");
		var iterableExpression;
		if(this.match([flow_TokenType.RANGE])) {
			this.consume(flow_TokenType.LPAREN,"Expected '(' after 'range'");
			var startExpr = this.parseExpression();
			var tmp = this.match([flow_TokenType.COMMA]);
			var endExpr = this.parseExpression();
			this.consume(flow_TokenType.RPAREN,"Expected ')' after range expression");
			iterableExpression = new flow_RangeExpression(startExpr,endExpr);
		} else {
			iterableExpression = this.parseExpression();
		}
		var body = this.parseBlock();
		return new flow_ForStatement(variableName,iterableExpression,body);
	}
	,parseFuncStatement: function() {
		var nameToken = this.consume(flow_TokenType.IDENTIFIER,"Expected function name after 'func'");
		var name = nameToken.value;
		this.consume(flow_TokenType.LPAREN,"Expected '(' after function name");
		var parameters = [];
		while(!this.check(flow_TokenType.RPAREN)) {
			var parameterToken = this.consume(flow_TokenType.IDENTIFIER,"Expected parameter name");
			parameters.push(parameterToken.value);
			var tmp = this.match([flow_TokenType.COMMA]);
		}
		this.consume(flow_TokenType.RPAREN,"Expected ')' after parameters");
		var body = this.parseBlock();
		return new flow_FuncStatement(name,parameters,body);
	}
	,parseCallStatement: function() {
		var nameToken = this.consume(flow_TokenType.IDENTIFIER,"Expected function name after 'call'");
		var name = nameToken.value;
		var $arguments = [];
		this.consume(flow_TokenType.LPAREN,"Expected '(' after function name");
		while(!this.check(flow_TokenType.RPAREN)) {
			$arguments.push(this.parseExpression());
			var tmp = this.match([flow_TokenType.COMMA]);
		}
		this.consume(flow_TokenType.RPAREN,"Expected ')' after arguments");
		return new flow_CallStatement(name,$arguments);
	}
	,parseReturnStatement: function() {
		var expression = this.parseExpression();
		return new flow_ReturnStatement(expression);
	}
	,parseIOStatement: function() {
		var ioToken = this.advance();
		if(ioToken.type != flow_TokenType.IO) {
			Flow.error.report("Expected 'IO' keyword");
			return null;
		}
		var lparenToken = this.advance();
		if(lparenToken.type != flow_TokenType.LPAREN) {
			Flow.error.report("Expected '('");
			return null;
		}
		var rparenToken = this.advance();
		if(rparenToken.type != flow_TokenType.RPAREN) {
			Flow.error.report("Expected ')'");
			return null;
		}
		var methodNameToken = this.advance();
		var methodName = methodNameToken.value;
		if(methodName == ".readLine") {
			this.consume(flow_TokenType.LPAREN,"Expected '(' after 'readLine'");
			this.consume(flow_TokenType.RPAREN,"Expected ')' after 'readLine'");
			return new flow_IOStatement("readLine");
		} else if(methodName == ".print") {
			this.consume(flow_TokenType.LPAREN,"Expected '(' after 'print'");
			var expression = this.parseExpression();
			this.consume(flow_TokenType.RPAREN,"Expected ')' after expression");
			return new flow_IOStatement("print",[expression]);
		} else if(methodName == ".println") {
			this.consume(flow_TokenType.LPAREN,"Expected '(' after 'println'");
			var expression = this.parseExpression();
			this.consume(flow_TokenType.RPAREN,"Expected ')' after expression");
			return new flow_IOStatement("println",[expression]);
		} else {
			Flow.error.report("Unknown IO method: " + methodName);
			return null;
		}
	}
	,parseRandomStatement: function() {
		var randomToken = this.advance();
		if(randomToken.type != flow_TokenType.RANDOM) {
			Flow.error.report("Expected 'Random' keyword");
			return null;
		}
		var lparenToken = this.advance();
		if(lparenToken.type != flow_TokenType.LPAREN) {
			Flow.error.report("Expected '('");
			return null;
		}
		var rparenToken = this.advance();
		if(rparenToken.type != flow_TokenType.RPAREN) {
			Flow.error.report("Expected ')'");
			return null;
		}
		var methodNameToken = this.advance();
		var methodName = methodNameToken.value;
		if(methodName == ".nextInt") {
			var lparenToken = this.advance();
			if(lparenToken.type != flow_TokenType.LPAREN) {
				Flow.error.report("Expected '(' after 'nextInt'");
				return null;
			}
			var minExpr = this.parseExpression();
			var commaToken = this.advance();
			if(commaToken.type != flow_TokenType.COMMA) {
				Flow.error.report("Expected ',' after min value");
				return null;
			}
			var maxExpr = this.parseExpression();
			var rparenToken = this.advance();
			if(rparenToken.type != flow_TokenType.RPAREN) {
				Flow.error.report("Expected ')' after max value");
				return null;
			}
			return new flow_RandomStatement(methodName,[minExpr,maxExpr]);
		} else {
			Flow.error.report("Unknown Random method: " + methodName);
			return null;
		}
	}
	,parseSystemStatement: function() {
		var systemToken = this.advance();
		if(systemToken.type != flow_TokenType.SYSTEM) {
			Flow.error.report("Expected 'System' keyword");
			return null;
		}
		var lparenToken = this.advance();
		if(lparenToken.type != flow_TokenType.LPAREN) {
			Flow.error.report("Expected '('");
			return null;
		}
		var rparenToken = this.advance();
		if(rparenToken.type != flow_TokenType.RPAREN) {
			Flow.error.report("Expected ')'");
			return null;
		}
		var methodNameToken = this.advance();
		var methodName = methodNameToken.value;
		if(methodName == ".currentDate") {
			this.consume(flow_TokenType.LPAREN,"Expected '(' after 'Date'");
			this.consume(flow_TokenType.RPAREN,"Expected ')' after 'Date'");
			return new flow_SystemStatement("currentDate");
		} else if(methodName == ".exit") {
			this.consume(flow_TokenType.LPAREN,"Expected '(' after 'exit'");
			this.consume(flow_TokenType.RPAREN,"Expected ')' after 'exit'");
			return new flow_SystemStatement("exit");
		} else if(methodName == ".println") {
			this.consume(flow_TokenType.LPAREN,"Expected '(' after 'println'");
			var expression = this.parseExpression();
			this.consume(flow_TokenType.RPAREN,"Expected ')' after expression");
			return new flow_SystemStatement("println",[expression]);
		} else {
			Flow.error.report("Unknown System method: " + methodName);
			return null;
		}
	}
	,parseFileStatement: function() {
		var fileToken = this.advance();
		if(fileToken.type != flow_TokenType.FILE) {
			Flow.error.report("Expected 'File' keyword");
			return null;
		}
		var lparenToken = this.advance();
		if(lparenToken.type != flow_TokenType.LPAREN) {
			Flow.error.report("Expected '('");
			return null;
		}
		var rparenToken = this.advance();
		if(rparenToken.type != flow_TokenType.RPAREN) {
			Flow.error.report("Expected ')'");
			return null;
		}
		var methodNameToken = this.advance();
		var methodName = methodNameToken.value;
		if(methodName == ".readFile") {
			this.consume(flow_TokenType.LPAREN,"Expected '(' after 'readFile'");
			var filePath = this.parseExpression();
			this.consume(flow_TokenType.RPAREN,"Expected ')' after file path expression");
			return new flow_FileStatement("readFile",[filePath]);
		} else if(methodName == ".writeFile") {
			this.consume(flow_TokenType.LPAREN,"Expected '(' after 'writeFile'");
			var filePath = this.parseExpression();
			this.consume(flow_TokenType.COMMA,"Expected ',' after file path expression");
			var content = this.parseExpression();
			this.consume(flow_TokenType.RPAREN,"Expected ')' after content expression");
			return new flow_FileStatement("writeFile",[filePath,content]);
		} else if(methodName == ".exists") {
			this.consume(flow_TokenType.LPAREN,"Expected '(' after 'exists'");
			var filePath = this.parseExpression();
			this.consume(flow_TokenType.RPAREN,"Expected ')' after file path expression");
			return new flow_FileStatement("exists",[filePath]);
		} else {
			Flow.error.report("Unknown File method: " + methodName);
			return null;
		}
	}
	,parseJsonStatement: function() {
		var jsonToken = this.advance();
		if(jsonToken.type != flow_TokenType.JSON) {
			Flow.error.report("Expected 'Json' keyword");
			return null;
		}
		var lparenToken = this.advance();
		if(lparenToken.type != flow_TokenType.LPAREN) {
			Flow.error.report("Expected '('");
			return null;
		}
		var rparenToken = this.advance();
		if(rparenToken.type != flow_TokenType.RPAREN) {
			Flow.error.report("Expected ')'");
			return null;
		}
		var methodNameToken = this.advance();
		var methodName = methodNameToken.value;
		if(methodName == ".parse") {
			this.consume(flow_TokenType.LPAREN,"Expected '(' after 'parse'");
			var expression = this.parseExpression();
			this.consume(flow_TokenType.RPAREN,"Expected ')' after expression");
			return new flow_JsonStatement("parse",[expression]);
		} else if(methodName == ".stringify") {
			this.consume(flow_TokenType.LPAREN,"Expected '(' after 'stringify'");
			var expression = this.parseExpression();
			this.consume(flow_TokenType.RPAREN,"Expected ')' after expression");
			return new flow_JsonStatement("stringify",[expression]);
		} else if(methodName == ".isValid") {
			this.consume(flow_TokenType.LPAREN,"Expected '(' after 'isValid'");
			var expression = this.parseExpression();
			this.consume(flow_TokenType.RPAREN,"Expected ')' after expression");
			return new flow_JsonStatement("isValid",[expression]);
		} else {
			Flow.error.report("Unknown Json method: " + methodName);
			return null;
		}
	}
	,parseBlock: function() {
		if(this.match([flow_TokenType.LBRACE])) {
			var statements = [];
			while(!this.check(flow_TokenType.RBRACE) && !this.isAtEnd()) statements.push(this.parseStatement());
			this.consume(flow_TokenType.RBRACE,"Expected '}' after block");
			return new flow_BlockStatement(statements);
		} else {
			var statement = this.parseStatement();
			return new flow_BlockStatement([statement]);
		}
	}
	,parseExpression: function() {
		return this.parseLogicalAnd();
	}
	,parseLogicalAnd: function() {
		var expr = this.parseEquality();
		while(this.match([flow_TokenType.AND])) {
			var opera = this.previous().value;
			var right = this.parseEquality();
			expr = new flow_BinaryExpression(expr,opera,right);
		}
		return expr;
	}
	,parseLogicalOr: function() {
		var expr = this.parseLogicalAnd();
		while(this.match([flow_TokenType.OR])) {
			var opera = this.previous().value;
			var right = this.parseLogicalAnd();
			expr = new flow_BinaryExpression(expr,opera,right);
		}
		return expr;
	}
	,parseEquality: function() {
		var expr = this.parseComparison();
		while(this.match([flow_TokenType.EQUAL_EQUAL,flow_TokenType.BANG_EQUAL])) {
			var opera = this.previous().value;
			var right = this.parseComparison();
			expr = new flow_BinaryExpression(expr,opera,right);
		}
		return expr;
	}
	,parseComparison: function() {
		var expr = this.parseTerm();
		while(this.match([flow_TokenType.GREATER,flow_TokenType.GREATER_EQUAL,flow_TokenType.LESS,flow_TokenType.LESS_EQUAL])) {
			var opera = this.previous().value;
			var right = this.parseTerm();
			expr = new flow_BinaryExpression(expr,opera,right);
		}
		return expr;
	}
	,parseTerm: function() {
		var expr = this.parseFactor();
		while(this.match([flow_TokenType.PLUS,flow_TokenType.MINUS,flow_TokenType.MULTIPLY,flow_TokenType.DIVIDE])) {
			var opera = this.previous().value;
			var right = this.parseFactor();
			expr = new flow_BinaryExpression(expr,opera,right);
		}
		return expr;
	}
	,parseFactor: function() {
		if(this.match([flow_TokenType.NUMBER])) {
			var value = this.previous().value;
			if(value.indexOf(".") != -1) {
				return new flow_LiteralExpression(parseFloat(value));
			} else {
				return new flow_LiteralExpression(Std.parseInt(value));
			}
		} else if(this.match([flow_TokenType.STRING])) {
			return new flow_LiteralExpression(this.previous().value);
		} else if(this.match([flow_TokenType.IO])) {
			this.consume(flow_TokenType.LPAREN,"Expected '('");
			this.consume(flow_TokenType.RPAREN,"Expected ')'");
			return this.parseIOExpression();
		} else if(this.match([flow_TokenType.RANDOM])) {
			this.consume(flow_TokenType.LPAREN,"Expected '('");
			this.consume(flow_TokenType.RPAREN,"Expected ')'");
			return this.parseRandomExpression();
		} else if(this.match([flow_TokenType.SYSTEM])) {
			this.consume(flow_TokenType.LPAREN,"Expected '('");
			this.consume(flow_TokenType.RPAREN,"Expected ')'");
			return this.parseSystemExpression();
		} else if(this.match([flow_TokenType.FILE])) {
			this.consume(flow_TokenType.LPAREN,"Expected '('");
			this.consume(flow_TokenType.RPAREN,"Expected ')'");
			return this.parseFileExpression();
		} else if(this.match([flow_TokenType.JSON])) {
			this.consume(flow_TokenType.LPAREN,"Expected '('");
			this.consume(flow_TokenType.RPAREN,"Expected ')'");
			return this.parseJsonExpression();
		} else if(this.match([flow_TokenType.IDENTIFIER])) {
			if(this.peek().type == flow_TokenType.LPAREN) {
				return this.parseCallExpression();
			} else if(this.peek().type == flow_TokenType.LBRACKET) {
				return this.parseArrayAccess();
			} else {
				return this.parsePropertyAccess();
			}
		} else if(this.match([flow_TokenType.TRUE])) {
			return new flow_LiteralExpression(true);
		} else if(this.match([flow_TokenType.FALSE])) {
			return new flow_LiteralExpression(false);
		} else if(this.match([flow_TokenType.LPAREN])) {
			var expr = this.parseExpression();
			this.consume(flow_TokenType.RPAREN,"Expected ')' after expression");
			return expr;
		} else {
			Flow.error.report("Unexpected token: " + this.peek().value);
			return null;
		}
	}
	,parseIOExpression: function() {
		var methodNameToken = this.advance();
		var methodName = methodNameToken.value;
		if(methodName == ".readLine") {
			this.consume(flow_TokenType.LPAREN,"Expected '(' after 'readLine'");
			this.consume(flow_TokenType.RPAREN,"Expected ')' after 'readLine'");
			return new flow_IOExpression("readLine");
		} else if(methodName == ".print") {
			this.consume(flow_TokenType.LPAREN,"Expected '(' after 'print'");
			var expression = this.parseExpression();
			this.consume(flow_TokenType.RPAREN,"Expected ')' after expression");
			return new flow_IOExpression("print",[expression]);
		} else if(methodName == ".println") {
			this.consume(flow_TokenType.LPAREN,"Expected '(' after 'println'");
			var expression = this.parseExpression();
			this.consume(flow_TokenType.RPAREN,"Expected ')' after expression");
			return new flow_IOExpression("println",[expression]);
		} else {
			Flow.error.report("Unknown IO method: " + methodName);
			return null;
		}
	}
	,parseRandomExpression: function() {
		var methodNameToken = this.advance();
		var methodName = methodNameToken.value;
		if(methodName == ".nextInt") {
			var lparenToken = this.advance();
			if(lparenToken.type != flow_TokenType.LPAREN) {
				Flow.error.report("Expected '(' after 'nextInt'");
				return null;
			}
			var minExpr = this.parseExpression();
			var commaToken = this.advance();
			if(commaToken.type != flow_TokenType.COMMA) {
				Flow.error.report("Expected ',' after min value");
				return null;
			}
			var maxExpr = this.parseExpression();
			var rparenToken = this.advance();
			if(rparenToken.type != flow_TokenType.RPAREN) {
				Flow.error.report("Expected ')' after max value");
				return null;
			}
			return new flow_RandomExpression(methodName,[minExpr,maxExpr]);
		} else {
			Flow.error.report("Unknown Random method: " + methodName);
			return null;
		}
	}
	,parseSystemExpression: function() {
		var methodNameToken = this.advance();
		var methodName = methodNameToken.value;
		if(methodName == ".currentDate") {
			this.consume(flow_TokenType.LPAREN,"Expected '(' after 'Date'");
			this.consume(flow_TokenType.RPAREN,"Expected ')' after 'Date'");
			return new flow_SystemExpression("currentDate");
		} else if(methodName == ".exit") {
			this.consume(flow_TokenType.LPAREN,"Expected '(' after 'exit'");
			this.consume(flow_TokenType.RPAREN,"Expected ')' after 'exit'");
			return new flow_SystemExpression("exit");
		} else if(methodName == ".println") {
			this.consume(flow_TokenType.LPAREN,"Expected '(' after 'println'");
			var expression = this.parseExpression();
			this.consume(flow_TokenType.RPAREN,"Expected ')' after expression");
			return new flow_SystemExpression("println",[expression]);
		} else {
			Flow.error.report("Unknown System method: " + methodName);
			return null;
		}
	}
	,parseFileExpression: function() {
		var methodNameToken = this.advance();
		var methodName = methodNameToken.value;
		if(methodName == ".readFile") {
			this.consume(flow_TokenType.LPAREN,"Expected '(' after 'readFile'");
			var filePath = this.parseExpression();
			this.consume(flow_TokenType.RPAREN,"Expected ')' after file path expression");
			return new flow_FileExpression("readFile",[filePath]);
		} else if(methodName == ".writeFile") {
			this.consume(flow_TokenType.LPAREN,"Expected '(' after 'writeFile'");
			var filePath = this.parseExpression();
			this.consume(flow_TokenType.COMMA,"Expected ',' after file path expression");
			var content = this.parseExpression();
			this.consume(flow_TokenType.RPAREN,"Expected ')' after content expression");
			return new flow_FileExpression("writeFile",[filePath,content]);
		} else if(methodName == ".exists") {
			this.consume(flow_TokenType.LPAREN,"Expected '(' after 'exists'");
			var filePath = this.parseExpression();
			this.consume(flow_TokenType.RPAREN,"Expected ')' after file path expression");
			return new flow_FileExpression("exists",[filePath]);
		} else {
			Flow.error.report("Unknown File method: " + methodName);
			return null;
		}
	}
	,parseJsonExpression: function() {
		var methodNameToken = this.advance();
		var methodName = methodNameToken.value;
		if(methodName == ".parse") {
			this.consume(flow_TokenType.LPAREN,"Expected '(' after 'parse'");
			var expression = this.parseExpression();
			this.consume(flow_TokenType.RPAREN,"Expected ')' after expression");
			return new flow_JsonExpression("parse",[expression]);
		} else if(methodName == ".stringify") {
			this.consume(flow_TokenType.LPAREN,"Expected '(' after 'stringify'");
			var expression = this.parseExpression();
			this.consume(flow_TokenType.RPAREN,"Expected ')' after expression");
			return new flow_JsonExpression("stringify",[expression]);
		} else if(methodName == ".isValid") {
			this.consume(flow_TokenType.LPAREN,"Expected '(' after 'isValid'");
			var expression = this.parseExpression();
			this.consume(flow_TokenType.RPAREN,"Expected ')' after expression");
			return new flow_JsonExpression("isValid",[expression]);
		} else {
			Flow.error.report("Unknown Json method: " + methodName);
			return null;
		}
	}
	,parseCallExpression: function() {
		var nameToken = this.previous();
		var name = nameToken.value;
		var $arguments = [];
		this.consume(flow_TokenType.LPAREN,"Expected '(' after function name");
		while(!this.check(flow_TokenType.RPAREN)) {
			$arguments.push(this.parseExpression());
			var tmp = this.match([flow_TokenType.COMMA]);
		}
		this.consume(flow_TokenType.RPAREN,"Expected ')' after arguments");
		return new flow_CallExpression(name,$arguments);
	}
	,parsePropertyAccess: function() {
		var obj = new flow_VariableExpression(this.previous().value);
		while(this.match([flow_TokenType.DOT])) {
			var property = this.consume(flow_TokenType.IDENTIFIER,"Expected property name");
			obj = new flow_PropertyAccessExpression(obj,property.value);
		}
		return obj;
	}
	,parseArrayAccess: function() {
		var expr = new flow_VariableExpression(this.previous().value);
		this.consume(flow_TokenType.LBRACKET,"Expected '[' after array name");
		var index = this.parseExpression();
		this.consume(flow_TokenType.RBRACKET,"Expected ']' after array index");
		return new flow_ArrayAccessExpression(expr,index);
	}
	,advance: function() {
		this.currentTokenIndex++;
		return this.previous();
	}
	,isAtEnd: function() {
		return this.currentTokenIndex >= this.tokens.length;
	}
	,previous: function() {
		return this.tokens[this.currentTokenIndex - 1];
	}
	,peek: function() {
		return this.tokens[this.currentTokenIndex];
	}
	,match: function(tokenTypes) {
		var _g = 0;
		while(_g < tokenTypes.length) {
			var tokenType = tokenTypes[_g];
			++_g;
			if(this.check(tokenType)) {
				this.advance();
				return true;
			}
		}
		return false;
	}
	,check: function(tokenType) {
		if(this.isAtEnd()) {
			return false;
		}
		return this.peek().type == tokenType;
	}
	,consume: function(tokenType,message) {
		if(!this.check(tokenType)) {
			Flow.error.report(message);
		}
		return this.advance();
	}
	,__class__: flow_Parser
};
var flow_Program = function(statements) {
	this.statements = statements;
};
flow_Program.__name__ = true;
flow_Program.prototype = {
	execute: function() {
		var _g = 0;
		var _g1 = this.statements;
		while(_g < _g1.length) {
			var statement = _g1[_g];
			++_g;
			statement.execute();
		}
	}
	,__class__: flow_Program
};
var flow_Statement = function() { };
flow_Statement.__name__ = true;
flow_Statement.prototype = {
	execute: function() {
	}
	,__class__: flow_Statement
};
var flow_PrintStatement = function(expression) {
	this.expression = expression;
};
flow_PrintStatement.__name__ = true;
flow_PrintStatement.__super__ = flow_Statement;
flow_PrintStatement.prototype = $extend(flow_Statement.prototype,{
	execute: function() {
		var value = this.expression.evaluate();
		var lines = value.split("\n");
		var _g = 0;
		while(_g < lines.length) {
			var line = lines[_g];
			++_g;
			logs_Logger.log(line);
		}
	}
	,__class__: flow_PrintStatement
});
var flow_LetStatement = function(name,initializer) {
	this.name = name;
	this.initializer = initializer;
};
flow_LetStatement.__name__ = true;
flow_LetStatement.__super__ = flow_Statement;
flow_LetStatement.prototype = $extend(flow_Statement.prototype,{
	execute: function() {
		flow_Environment.define(this.name,this.initializer.evaluate());
	}
	,__class__: flow_LetStatement
});
var flow_Expression = function() { };
flow_Expression.__name__ = true;
flow_Expression.prototype = {
	evaluate: function() {
		return null;
	}
	,__class__: flow_Expression
};
var flow_VariableExpression = function(name) {
	this.name = name;
};
flow_VariableExpression.__name__ = true;
flow_VariableExpression.__super__ = flow_Expression;
flow_VariableExpression.prototype = $extend(flow_Expression.prototype,{
	evaluate: function() {
		return flow_Environment.get(this.name);
	}
	,__class__: flow_VariableExpression
});
var flow_Environment = function() { };
flow_Environment.__name__ = true;
flow_Environment.define = function(name,value) {
	flow_Environment.values.h[name] = value;
};
flow_Environment.get = function(name) {
	var parts = name.split(".");
	var obj = flow_Environment.values.h[parts[0]];
	if(obj == null) {
		Flow.error.report("Undefined variable: " + parts[0]);
		return null;
	}
	var _g = 1;
	var _g1 = parts.length;
	while(_g < _g1) {
		var i = _g++;
		if(obj == null) {
			Flow.error.report("Undefined property: " + parts[i - 1]);
			return null;
		}
		if(Object.prototype.hasOwnProperty.call(obj,parts[i])) {
			obj = Reflect.field(obj,parts[i]);
		} else {
			Flow.error.report("Undefined property: " + parts[i]);
			return null;
		}
	}
	return obj;
};
flow_Environment.defineFunction = function(name,value) {
	flow_Environment.functions.h[name] = value;
};
flow_Environment.getFunction = function(name) {
	if(!Object.prototype.hasOwnProperty.call(flow_Environment.functions.h,name)) {
		Flow.error.report("Undefined function: " + name);
	}
	return flow_Environment.functions.h[name];
};
flow_Environment.callFunction = function(name,$arguments,context) {
	var func;
	if(context != null) {
		func = Reflect.field(context,name);
		if(func == null) {
			Flow.error.report("Undefined method: " + name);
			return;
		}
	} else {
		func = flow_Environment.functions.h[name];
		if(!Object.prototype.hasOwnProperty.call(flow_Environment.functions.h,name)) {
			Flow.error.report("Undefined function: " + name);
			return;
		}
	}
	if(func.parameters.length != $arguments.length) {
		Flow.error.report("Incorrect number of arguments for function: " + name);
		return;
	}
	var oldValues = haxe_ds_StringMap.createCopy(flow_Environment.values.h);
	var _g = 0;
	var _g1 = func.parameters.length;
	while(_g < _g1) {
		var i = _g++;
		flow_Environment.values.h[func.parameters[i]] = $arguments[i];
	}
	func.body.execute();
	flow_Environment.values = oldValues;
};
flow_Environment.defineModule = function(name,module) {
	flow_Environment.modules.h[name] = module;
};
flow_Environment.getModule = function(name) {
	if(!Object.prototype.hasOwnProperty.call(flow_Environment.modules.h,name)) {
		Flow.error.report("Undefined module: " + name);
	}
	return flow_Environment.modules.h[name];
};
var flow_LiteralExpression = function(value) {
	this.value = value;
};
flow_LiteralExpression.__name__ = true;
flow_LiteralExpression.__super__ = flow_Expression;
flow_LiteralExpression.prototype = $extend(flow_Expression.prototype,{
	evaluate: function() {
		return this.value;
	}
	,__class__: flow_LiteralExpression
});
var flow_BinaryExpression = function(left,opera,right) {
	this.left = left;
	this.opera = opera;
	this.right = right;
};
flow_BinaryExpression.__name__ = true;
flow_BinaryExpression.__super__ = flow_Expression;
flow_BinaryExpression.prototype = $extend(flow_Expression.prototype,{
	evaluate: function() {
		var leftValue = this.left.evaluate();
		var rightValue = this.right.evaluate();
		var leftIsFloat = typeof(leftValue) == "number";
		var rightIsFloat = typeof(rightValue) == "number";
		if(!leftIsFloat) {
			leftValue = js_Boot.__cast(leftValue , Float);
		}
		if(!rightIsFloat) {
			rightValue = js_Boot.__cast(rightValue , Float);
		}
		switch(this.opera) {
		case "!=":
			return leftValue != rightValue;
		case "*":
			return leftValue * rightValue;
		case "+":
			return leftValue + rightValue;
		case "-":
			return leftValue - rightValue;
		case "/":
			return Math.floor(leftValue / rightValue);
		case "<":
			return leftValue < rightValue;
		case "<=":
			return leftValue <= rightValue;
		case "==":
			return leftValue == rightValue;
		case ">":
			return leftValue > rightValue;
		case ">=":
			return leftValue >= rightValue;
		case "and":
			if(leftValue != 0) {
				return rightValue != 0;
			} else {
				return false;
			}
			break;
		case "or":
			if(leftValue == 0) {
				return rightValue != 0;
			} else {
				return true;
			}
			break;
		default:
			Flow.error.report("Unknown operator: " + this.opera);
			return null;
		}
	}
	,__class__: flow_BinaryExpression
});
var flow_UnaryExpression = function(opera,right) {
	this.opera = opera;
	this.right = right;
};
flow_UnaryExpression.__name__ = true;
flow_UnaryExpression.__super__ = flow_Expression;
flow_UnaryExpression.prototype = $extend(flow_Expression.prototype,{
	evaluate: function() {
		var value = this.right.evaluate();
		switch(this.opera) {
		case "!":
			if(typeof(value) == "boolean") {
				return !value;
			} else {
				Flow.error.report("Logical NOT (!) operator can only be applied to boolean values.");
				return null;
			}
			break;
		case "-":
			return -value;
		default:
			Flow.error.report("Unknown unary operator: " + this.opera);
			return null;
		}
	}
	,__class__: flow_UnaryExpression
});
var flow_IfStatement = function(condition,thenBranch,elseBranch) {
	this.condition = condition;
	this.thenBranch = thenBranch;
	this.elseBranch = elseBranch;
};
flow_IfStatement.__name__ = true;
flow_IfStatement.__super__ = flow_Statement;
flow_IfStatement.prototype = $extend(flow_Statement.prototype,{
	execute: function() {
		if(this.condition.evaluate()) {
			this.thenBranch.execute();
		} else if(this.elseBranch != null) {
			this.elseBranch.execute();
		}
	}
	,__class__: flow_IfStatement
});
var flow_ElseStatement = function(body) {
	this.body = body;
};
flow_ElseStatement.__name__ = true;
flow_ElseStatement.__super__ = flow_Statement;
flow_ElseStatement.prototype = $extend(flow_Statement.prototype,{
	execute: function() {
		this.body.execute();
	}
	,__class__: flow_ElseStatement
});
var flow_BlockStatement = function(statements) {
	this.statements = statements;
};
flow_BlockStatement.__name__ = true;
flow_BlockStatement.__super__ = flow_Statement;
flow_BlockStatement.prototype = $extend(flow_Statement.prototype,{
	execute: function() {
		var _g = 0;
		var _g1 = this.statements;
		while(_g < _g1.length) {
			var statement = _g1[_g];
			++_g;
			statement.execute();
		}
	}
	,__class__: flow_BlockStatement
});
var flow_WhileStatement = function(condition,body) {
	this.condition = condition;
	this.body = body;
};
flow_WhileStatement.__name__ = true;
flow_WhileStatement.__super__ = flow_Statement;
flow_WhileStatement.prototype = $extend(flow_Statement.prototype,{
	execute: function() {
		while(this.condition.evaluate()) this.body.execute();
	}
	,__class__: flow_WhileStatement
});
var flow_ForStatement = function(variableName,iterableExpression,body) {
	this.variableName = variableName;
	this.iterableExpression = iterableExpression;
	this.body = body;
};
flow_ForStatement.__name__ = true;
flow_ForStatement.__super__ = flow_Statement;
flow_ForStatement.prototype = $extend(flow_Statement.prototype,{
	execute: function() {
		var iterable = this.iterableExpression.evaluate();
		if(iterable == null) {
			Flow.error.report("Iterable expression evaluates to null");
			return;
		}
		var item = $getIterator(iterable);
		while(item.hasNext()) {
			var item1 = item.next();
			flow_Environment.define(this.variableName,item1);
			this.body.execute();
		}
	}
	,__class__: flow_ForStatement
});
var flow_RangeExpression = function(start,end) {
	this.start = start;
	this.end = end;
};
flow_RangeExpression.__name__ = true;
flow_RangeExpression.__super__ = flow_Expression;
flow_RangeExpression.prototype = $extend(flow_Expression.prototype,{
	evaluate: function() {
		var startValue = this.start.evaluate();
		var endValue = this.end.evaluate();
		if(!(typeof(startValue) == "number" && ((startValue | 0) === startValue)) || !(typeof(endValue) == "number" && ((endValue | 0) === endValue))) {
			Flow.error.report("Range start or end value is not a valid integer");
			return null;
		}
		return new flow_RangeIterable(js_Boot.__cast(startValue , Int),js_Boot.__cast(endValue , Int));
	}
	,__class__: flow_RangeExpression
});
var flow_RangeIterable = function(start,end) {
	this.start = start;
	this.end = end;
};
flow_RangeIterable.__name__ = true;
flow_RangeIterable.prototype = {
	iterator: function() {
		var _gthis = this;
		var current = this.start;
		return { hasNext : function() {
			return current <= _gthis.end;
		}, next : function() {
			current += 1;
			return current - 1;
		}};
	}
	,__class__: flow_RangeIterable
};
var flow_ArrayLiteralExpression = function(elements) {
	this.elements = elements;
};
flow_ArrayLiteralExpression.__name__ = true;
flow_ArrayLiteralExpression.__super__ = flow_Expression;
flow_ArrayLiteralExpression.prototype = $extend(flow_Expression.prototype,{
	evaluate: function() {
		var result = [];
		var _g = 0;
		var _g1 = this.elements;
		while(_g < _g1.length) {
			var element = _g1[_g];
			++_g;
			result.push(element.evaluate());
		}
		return result;
	}
	,__class__: flow_ArrayLiteralExpression
});
var flow_FuncStatement = function(name,parameters,body) {
	this.name = name;
	this.parameters = parameters;
	this.body = body;
};
flow_FuncStatement.__name__ = true;
flow_FuncStatement.__super__ = flow_Statement;
flow_FuncStatement.prototype = $extend(flow_Statement.prototype,{
	execute: function() {
		var func = new flow_Function(this.name,this.parameters,this.body);
		flow_Environment.defineFunction(this.name,func);
	}
	,__class__: flow_FuncStatement
});
var flow_CallStatement = function(name,$arguments) {
	this.name = name;
	this.arguments = $arguments;
};
flow_CallStatement.__name__ = true;
flow_CallStatement.__super__ = flow_Statement;
flow_CallStatement.prototype = $extend(flow_Statement.prototype,{
	execute: function() {
		var func = flow_Environment.getFunction(this.name);
		if(func == null) {
			Flow.error.report("Unknown function: " + this.name);
			return;
		}
		var args = [];
		var _g = 0;
		var _g1 = this.arguments;
		while(_g < _g1.length) {
			var arg = _g1[_g];
			++_g;
			args.push(arg.evaluate());
		}
		func.execute(args);
	}
	,__class__: flow_CallStatement
});
var flow_Function = function(name,parameters,body) {
	this.name = name;
	this.parameters = parameters;
	this.body = body;
};
flow_Function.__name__ = true;
flow_Function.prototype = {
	execute: function(args) {
		var oldValues = haxe_ds_StringMap.createCopy(flow_Environment.values.h);
		var _g = 0;
		var _g1 = this.parameters.length;
		while(_g < _g1) {
			var i = _g++;
			flow_Environment.define(this.parameters[i],args[i]);
		}
		try {
			this.body.execute();
			flow_Environment.values = haxe_ds_StringMap.createCopy(oldValues.h);
			return null;
		} catch( _g ) {
			var _g1 = haxe_Exception.caught(_g);
			if(((_g1) instanceof flow_ReturnValue)) {
				var e = _g1;
				flow_Environment.values = haxe_ds_StringMap.createCopy(oldValues.h);
				return e.value;
			} else {
				throw _g;
			}
		}
	}
	,__class__: flow_Function
};
var flow_CallExpression = function(name,$arguments) {
	this.name = name;
	this.arguments = $arguments;
};
flow_CallExpression.__name__ = true;
flow_CallExpression.__super__ = flow_Expression;
flow_CallExpression.prototype = $extend(flow_Expression.prototype,{
	evaluate: function() {
		var func = flow_Environment.getFunction(this.name);
		if(func == null) {
			Flow.error.report("Undefined function: " + this.name);
			return null;
		}
		var args = [];
		var _g = 0;
		var _g1 = this.arguments;
		while(_g < _g1.length) {
			var arg = _g1[_g];
			++_g;
			args.push(arg.evaluate());
		}
		try {
			return func.execute(args);
		} catch( _g ) {
			var _g1 = haxe_Exception.caught(_g);
			if(((_g1) instanceof flow_ReturnValue)) {
				var e = _g1;
				return e.value;
			} else {
				throw _g;
			}
		}
	}
	,__class__: flow_CallExpression
});
var flow_ReturnStatement = function(expression) {
	this.expression = expression;
};
flow_ReturnStatement.__name__ = true;
flow_ReturnStatement.__super__ = flow_Statement;
flow_ReturnStatement.prototype = $extend(flow_Statement.prototype,{
	execute: function() {
		throw new flow_ReturnValue(this.expression.evaluate());
	}
	,__class__: flow_ReturnStatement
});
var haxe_Exception = function(message,previous,native) {
	Error.call(this,message);
	this.message = message;
	this.__previousException = previous;
	this.__nativeException = native != null ? native : this;
};
haxe_Exception.__name__ = true;
haxe_Exception.caught = function(value) {
	if(((value) instanceof haxe_Exception)) {
		return value;
	} else if(((value) instanceof Error)) {
		return new haxe_Exception(value.message,null,value);
	} else {
		return new haxe_ValueException(value,null,value);
	}
};
haxe_Exception.thrown = function(value) {
	if(((value) instanceof haxe_Exception)) {
		return value.get_native();
	} else if(((value) instanceof Error)) {
		return value;
	} else {
		var e = new haxe_ValueException(value);
		return e;
	}
};
haxe_Exception.__super__ = Error;
haxe_Exception.prototype = $extend(Error.prototype,{
	unwrap: function() {
		return this.__nativeException;
	}
	,toString: function() {
		return this.get_message();
	}
	,get_message: function() {
		return this.message;
	}
	,get_native: function() {
		return this.__nativeException;
	}
	,__class__: haxe_Exception
});
var flow_ReturnValue = function(value) {
	this.value = value;
	haxe_Exception.call(this,"");
};
flow_ReturnValue.__name__ = true;
flow_ReturnValue.__super__ = haxe_Exception;
flow_ReturnValue.prototype = $extend(haxe_Exception.prototype,{
	__class__: flow_ReturnValue
});
var flow_ObjectExpression = function(properties) {
	this.properties = properties;
};
flow_ObjectExpression.__name__ = true;
flow_ObjectExpression.__super__ = flow_Expression;
flow_ObjectExpression.prototype = $extend(flow_Expression.prototype,{
	evaluate: function() {
		var obj = { };
		var h = this.properties.h;
		var key_h = h;
		var key_keys = Object.keys(h);
		var key_length = key_keys.length;
		var key_current = 0;
		while(key_current < key_length) {
			var key = key_keys[key_current++];
			obj[key] = this.properties.h[key].evaluate();
		}
		return obj;
	}
	,__class__: flow_ObjectExpression
});
var flow_PropertyAccessExpression = function(obj,property) {
	this.obj = obj;
	this.property = property;
};
flow_PropertyAccessExpression.__name__ = true;
flow_PropertyAccessExpression.__super__ = flow_Expression;
flow_PropertyAccessExpression.prototype = $extend(flow_Expression.prototype,{
	evaluate: function() {
		var objValue = this.obj.evaluate();
		if(objValue != null && Object.prototype.hasOwnProperty.call(objValue,this.property)) {
			return Reflect.field(objValue,this.property);
		} else {
			Flow.error.report("Property '" + this.property + "' does not exist on object");
			return null;
		}
	}
	,__class__: flow_PropertyAccessExpression
});
var flow_ArrayAccessExpression = function(array,index) {
	this.array = array;
	this.index = index;
};
flow_ArrayAccessExpression.__name__ = true;
flow_ArrayAccessExpression.__super__ = flow_Expression;
flow_ArrayAccessExpression.prototype = $extend(flow_Expression.prototype,{
	evaluate: function() {
		var arrayValue = this.array.evaluate();
		var indexValue = this.index.evaluate();
		if(arrayValue == null) {
			Flow.error.report("Cannot access element of null array");
			return null;
		}
		if(indexValue < 0 || indexValue >= arrayValue.length) {
			Flow.error.report("Index out of bounds: " + indexValue);
			return null;
		}
		return arrayValue[indexValue];
	}
	,__class__: flow_ArrayAccessExpression
});
var flow_IOExpression = function(methodName,$arguments) {
	this.methodName = methodName;
	this.arguments = $arguments != null ? $arguments : [];
};
flow_IOExpression.__name__ = true;
flow_IOExpression.__super__ = flow_Expression;
flow_IOExpression.prototype = $extend(flow_Expression.prototype,{
	evaluate: function() {
		var evaluatedArguments = [];
		var _g = 0;
		var _g1 = this.arguments;
		while(_g < _g1.length) {
			var argument = _g1[_g];
			++_g;
			evaluatedArguments.push(argument.evaluate());
		}
		switch(this.methodName) {
		case "print":
			modules_IO.print(evaluatedArguments.join(" "));
			return null;
		case "println":
			modules_IO.println(evaluatedArguments.join(" "));
			return null;
		case "readLine":
			return modules_IO.readLine();
		}
		return null;
	}
	,__class__: flow_IOExpression
});
var flow_IOStatement = function(methodName,$arguments) {
	this.methodName = methodName;
	this.arguments = $arguments != null ? $arguments : [];
};
flow_IOStatement.__name__ = true;
flow_IOStatement.__super__ = flow_Statement;
flow_IOStatement.prototype = $extend(flow_Statement.prototype,{
	execute: function() {
		var evaluatedArguments = [];
		var _g = 0;
		var _g1 = this.arguments;
		while(_g < _g1.length) {
			var argument = _g1[_g];
			++_g;
			evaluatedArguments.push(argument.evaluate());
		}
		switch(this.methodName) {
		case "print":
			modules_IO.print(evaluatedArguments.join(" "));
			break;
		case "println":
			modules_IO.println(evaluatedArguments.join(" "));
			break;
		case "readLine":
			modules_IO.readLine();
			break;
		}
	}
	,__class__: flow_IOStatement
});
var flow_RandomExpression = function(methodName,$arguments) {
	this.methodName = methodName;
	this.arguments = $arguments;
};
flow_RandomExpression.__name__ = true;
flow_RandomExpression.__super__ = flow_Expression;
flow_RandomExpression.prototype = $extend(flow_Expression.prototype,{
	evaluate: function() {
		var min = this.arguments[0].evaluate();
		var max = this.arguments[1].evaluate();
		return modules_Random.nextInt(min,max);
	}
	,__class__: flow_RandomExpression
});
var flow_RandomStatement = function(methodName,$arguments) {
	this.methodName = methodName;
	this.arguments = $arguments;
};
flow_RandomStatement.__name__ = true;
flow_RandomStatement.__super__ = flow_Statement;
flow_RandomStatement.prototype = $extend(flow_Statement.prototype,{
	execute: function() {
		var min = this.arguments[0].evaluate();
		var max = this.arguments[1].evaluate();
		modules_Random.nextInt(min,max);
	}
	,__class__: flow_RandomStatement
});
var flow_SystemExpression = function(methodName,$arguments) {
	this.methodName = methodName;
	this.arguments = $arguments != null ? $arguments : [];
};
flow_SystemExpression.__name__ = true;
flow_SystemExpression.__super__ = flow_Expression;
flow_SystemExpression.prototype = $extend(flow_Expression.prototype,{
	evaluate: function() {
		var evaluatedArguments = [];
		var _g = 0;
		var _g1 = this.arguments;
		while(_g < _g1.length) {
			var argument = _g1[_g];
			++_g;
			evaluatedArguments.push(argument.evaluate());
		}
		switch(this.methodName) {
		case "currentDate":
			return modules_System.currentDate();
		case "exit":
			modules_System.exit();
			return null;
		case "println":
			modules_System.println(evaluatedArguments.join(" "));
			return null;
		}
		return null;
	}
	,__class__: flow_SystemExpression
});
var flow_SystemStatement = function(methodName,$arguments) {
	this.methodName = methodName;
	this.arguments = $arguments != null ? $arguments : [];
};
flow_SystemStatement.__name__ = true;
flow_SystemStatement.__super__ = flow_Statement;
flow_SystemStatement.prototype = $extend(flow_Statement.prototype,{
	execute: function() {
		var evaluatedArguments = [];
		var _g = 0;
		var _g1 = this.arguments;
		while(_g < _g1.length) {
			var argument = _g1[_g];
			++_g;
			evaluatedArguments.push(argument.evaluate());
		}
		switch(this.methodName) {
		case "currentDate":
			modules_System.currentDate();
			break;
		case "exit":
			modules_System.exit();
			break;
		case "println":
			modules_System.println(evaluatedArguments.join(" "));
			break;
		}
	}
	,__class__: flow_SystemStatement
});
var flow_FileExpression = function(methodName,$arguments) {
	this.methodName = methodName;
	this.arguments = $arguments != null ? $arguments : [];
};
flow_FileExpression.__name__ = true;
flow_FileExpression.__super__ = flow_Expression;
flow_FileExpression.prototype = $extend(flow_Expression.prototype,{
	evaluate: function() {
		var evaluatedArguments = [];
		var _g = 0;
		var _g1 = this.arguments;
		while(_g < _g1.length) {
			var argument = _g1[_g];
			++_g;
			evaluatedArguments.push(argument.evaluate());
		}
		switch(this.methodName) {
		case "exists":
			return modules_File.exists(evaluatedArguments[0]);
		case "readFile":
			return modules_File.readFile(evaluatedArguments[0]);
		case "writeFile":
			modules_File.writeFile(evaluatedArguments[0],evaluatedArguments[1]);
			return null;
		}
		return null;
	}
	,__class__: flow_FileExpression
});
var flow_FileStatement = function(methodName,$arguments) {
	this.methodName = methodName;
	this.arguments = $arguments != null ? $arguments : [];
};
flow_FileStatement.__name__ = true;
flow_FileStatement.__super__ = flow_Statement;
flow_FileStatement.prototype = $extend(flow_Statement.prototype,{
	execute: function() {
		var evaluatedArguments = [];
		var _g = 0;
		var _g1 = this.arguments;
		while(_g < _g1.length) {
			var argument = _g1[_g];
			++_g;
			evaluatedArguments.push(argument.evaluate());
		}
		switch(this.methodName) {
		case "exists":
			modules_File.exists(evaluatedArguments[0]);
			break;
		case "readFile":
			modules_File.readFile(evaluatedArguments[0]);
			break;
		case "writeFile":
			modules_File.writeFile(evaluatedArguments[0],evaluatedArguments[1]);
			break;
		}
	}
	,__class__: flow_FileStatement
});
var flow_JsonExpression = function(methodName,$arguments) {
	this.methodName = methodName;
	this.arguments = $arguments != null ? $arguments : [];
};
flow_JsonExpression.__name__ = true;
flow_JsonExpression.__super__ = flow_Expression;
flow_JsonExpression.prototype = $extend(flow_Expression.prototype,{
	evaluate: function() {
		var evaluatedArguments = [];
		var _g = 0;
		var _g1 = this.arguments;
		while(_g < _g1.length) {
			var argument = _g1[_g];
			++_g;
			evaluatedArguments.push(argument.evaluate());
		}
		switch(this.methodName) {
		case "isValid":
			return modules_Json.isValid(evaluatedArguments[0]);
		case "parse":
			return modules_Json.parse(evaluatedArguments[0]);
		case "stringify":
			return modules_Json.stringify(evaluatedArguments[0]);
		}
		return null;
	}
	,__class__: flow_JsonExpression
});
var flow_JsonStatement = function(methodName,$arguments) {
	this.methodName = methodName;
	this.arguments = $arguments != null ? $arguments : [];
};
flow_JsonStatement.__name__ = true;
flow_JsonStatement.__super__ = flow_Statement;
flow_JsonStatement.prototype = $extend(flow_Statement.prototype,{
	execute: function() {
		var evaluatedArguments = [];
		var _g = 0;
		var _g1 = this.arguments;
		while(_g < _g1.length) {
			var argument = _g1[_g];
			++_g;
			evaluatedArguments.push(argument.evaluate());
		}
		switch(this.methodName) {
		case "isValid":
			modules_Json.isValid(evaluatedArguments[0]);
			break;
		case "parse":
			modules_Json.parse(evaluatedArguments[0]);
			break;
		case "stringify":
			modules_Json.stringify(evaluatedArguments[0]);
			break;
		}
	}
	,__class__: flow_JsonStatement
});
var haxe_IMap = function() { };
haxe_IMap.__name__ = true;
haxe_IMap.__isInterface__ = true;
var haxe_ValueException = function(value,previous,native) {
	haxe_Exception.call(this,String(value),previous,native);
	this.value = value;
};
haxe_ValueException.__name__ = true;
haxe_ValueException.__super__ = haxe_Exception;
haxe_ValueException.prototype = $extend(haxe_Exception.prototype,{
	unwrap: function() {
		return this.value;
	}
	,__class__: haxe_ValueException
});
var haxe_ds_StringMap = function() {
	this.h = Object.create(null);
};
haxe_ds_StringMap.__name__ = true;
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
haxe_ds_StringMap.createCopy = function(h) {
	var copy = new haxe_ds_StringMap();
	for (var key in h) copy.h[key] = h[key];
	return copy;
};
haxe_ds_StringMap.prototype = {
	__class__: haxe_ds_StringMap
};
var haxe_exceptions_PosException = function(message,previous,pos) {
	haxe_Exception.call(this,message,previous);
	if(pos == null) {
		this.posInfos = { fileName : "(unknown)", lineNumber : 0, className : "(unknown)", methodName : "(unknown)"};
	} else {
		this.posInfos = pos;
	}
};
haxe_exceptions_PosException.__name__ = true;
haxe_exceptions_PosException.__super__ = haxe_Exception;
haxe_exceptions_PosException.prototype = $extend(haxe_Exception.prototype,{
	toString: function() {
		return "" + haxe_Exception.prototype.toString.call(this) + " in " + this.posInfos.className + "." + this.posInfos.methodName + " at " + this.posInfos.fileName + ":" + this.posInfos.lineNumber;
	}
	,__class__: haxe_exceptions_PosException
});
var haxe_exceptions_NotImplementedException = function(message,previous,pos) {
	if(message == null) {
		message = "Not implemented";
	}
	haxe_exceptions_PosException.call(this,message,previous,pos);
};
haxe_exceptions_NotImplementedException.__name__ = true;
haxe_exceptions_NotImplementedException.__super__ = haxe_exceptions_PosException;
haxe_exceptions_NotImplementedException.prototype = $extend(haxe_exceptions_PosException.prototype,{
	__class__: haxe_exceptions_NotImplementedException
});
var haxe_iterators_ArrayIterator = function(array) {
	this.current = 0;
	this.array = array;
};
haxe_iterators_ArrayIterator.__name__ = true;
haxe_iterators_ArrayIterator.prototype = {
	hasNext: function() {
		return this.current < this.array.length;
	}
	,next: function() {
		return this.array[this.current++];
	}
	,__class__: haxe_iterators_ArrayIterator
};
var js_Boot = function() { };
js_Boot.__name__ = true;
js_Boot.getClass = function(o) {
	if(o == null) {
		return null;
	} else if(((o) instanceof Array)) {
		return Array;
	} else {
		var cl = o.__class__;
		if(cl != null) {
			return cl;
		}
		var name = js_Boot.__nativeClassName(o);
		if(name != null) {
			return js_Boot.__resolveNativeClass(name);
		}
		return null;
	}
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) {
		return "null";
	}
	if(s.length >= 5) {
		return "<...>";
	}
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) {
		t = "object";
	}
	switch(t) {
	case "function":
		return "<function>";
	case "object":
		if(o.__enum__) {
			var e = $hxEnums[o.__enum__];
			var con = e.__constructs__[o._hx_index];
			var n = con._hx_name;
			if(con.__params__) {
				s = s + "\t";
				return n + "(" + ((function($this) {
					var $r;
					var _g = [];
					{
						var _g1 = 0;
						var _g2 = con.__params__;
						while(true) {
							if(!(_g1 < _g2.length)) {
								break;
							}
							var p = _g2[_g1];
							_g1 = _g1 + 1;
							_g.push(js_Boot.__string_rec(o[p],s));
						}
					}
					$r = _g;
					return $r;
				}(this))).join(",") + ")";
			} else {
				return n;
			}
		}
		if(((o) instanceof Array)) {
			var str = "[";
			s += "\t";
			var _g = 0;
			var _g1 = o.length;
			while(_g < _g1) {
				var i = _g++;
				str += (i > 0 ? "," : "") + js_Boot.__string_rec(o[i],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( _g ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") {
				return s2;
			}
		}
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		var k = null;
		for( k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) {
			str += ", \n";
		}
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "string":
		return o;
	default:
		return String(o);
	}
};
js_Boot.__interfLoop = function(cc,cl) {
	if(cc == null) {
		return false;
	}
	if(cc == cl) {
		return true;
	}
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g = 0;
		var _g1 = intf.length;
		while(_g < _g1) {
			var i = _g++;
			var i1 = intf[i];
			if(i1 == cl || js_Boot.__interfLoop(i1,cl)) {
				return true;
			}
		}
	}
	return js_Boot.__interfLoop(cc.__super__,cl);
};
js_Boot.__instanceof = function(o,cl) {
	if(cl == null) {
		return false;
	}
	switch(cl) {
	case Array:
		return ((o) instanceof Array);
	case Bool:
		return typeof(o) == "boolean";
	case Dynamic:
		return o != null;
	case Float:
		return typeof(o) == "number";
	case Int:
		if(typeof(o) == "number") {
			return ((o | 0) === o);
		} else {
			return false;
		}
		break;
	case String:
		return typeof(o) == "string";
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(js_Boot.__downcastCheck(o,cl)) {
					return true;
				}
			} else if(typeof(cl) == "object" && js_Boot.__isNativeObj(cl)) {
				if(((o) instanceof cl)) {
					return true;
				}
			}
		} else {
			return false;
		}
		if(cl == Class ? o.__name__ != null : false) {
			return true;
		}
		if(cl == Enum ? o.__ename__ != null : false) {
			return true;
		}
		return o.__enum__ != null ? $hxEnums[o.__enum__] == cl : false;
	}
};
js_Boot.__downcastCheck = function(o,cl) {
	if(!((o) instanceof cl)) {
		if(cl.__isInterface__) {
			return js_Boot.__interfLoop(js_Boot.getClass(o),cl);
		} else {
			return false;
		}
	} else {
		return true;
	}
};
js_Boot.__cast = function(o,t) {
	if(o == null || js_Boot.__instanceof(o,t)) {
		return o;
	} else {
		throw haxe_Exception.thrown("Cannot cast " + Std.string(o) + " to " + Std.string(t));
	}
};
js_Boot.__nativeClassName = function(o) {
	var name = js_Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") {
		return null;
	}
	return name;
};
js_Boot.__isNativeObj = function(o) {
	return js_Boot.__nativeClassName(o) != null;
};
js_Boot.__resolveNativeClass = function(name) {
	return $global[name];
};
var logs_Logger = function() { };
logs_Logger.__name__ = true;
logs_Logger.log = function(message) {
	var outputDiv = window.document.getElementById("output");
	outputDiv.innerHTML += Std.string(message) + "<br>";
	var s = Console.logPrefix + ("" + Std.string(message));
	var outputStream = 0;
	if(outputStream == null) {
		outputStream = 0;
	}
	if(s == null) {
		s = "";
	}
	Console.printFormatted(s + "\n",outputStream);
};
var modules_File = function() { };
modules_File.__name__ = true;
modules_File.readFile = function(filePath) {
	return null;
};
modules_File.writeFile = function(filePath,content) {
};
modules_File.exists = function(filePath) {
	return null;
};
var modules_IO = function() { };
modules_IO.__name__ = true;
modules_IO.readLine = function() {
	return window.prompt("Enter input:");
};
modules_IO.print = function(value) {
	var outputDiv = window.document.getElementById("output");
	if(outputDiv != null) {
		outputDiv.innerHTML += value;
	}
};
modules_IO.println = function(value) {
	modules_IO.print(value + "<br>");
};
var modules_Json = function() { };
modules_Json.__name__ = true;
modules_Json.parse = function(jsonString) {
	try {
		var lexer = new modules_json_Lexer(jsonString);
		var parser = new modules_json_Parser(lexer);
		return parser.parse();
	} catch( _g ) {
		var e = haxe_Exception.caught(_g).unwrap();
		Flow.error.report("Parsing error: " + Std.string(e.toString()));
		return null;
	}
};
modules_Json.stringify = function(data) {
	return modules_Json.stringifyValue(data);
};
modules_Json.isValid = function(jsonString) {
	try {
		var lexer = new modules_json_Lexer(jsonString);
		new modules_json_Parser(lexer).parse();
		return true;
	} catch( _g ) {
		return false;
	}
};
modules_Json.stringifyValue = function(value) {
	var _g = Type.typeof(value);
	switch(_g._hx_index) {
	case 0:
		return "null";
	case 1:case 2:
		return Std.string(value);
	case 4:
		var objFields = [];
		var _g1 = 0;
		var _g2 = Reflect.fields(value);
		while(_g1 < _g2.length) {
			var field = _g2[_g1];
			++_g1;
			var key = field;
			var fieldValue = Reflect.field(value,field);
			objFields.push(modules_Json.quoteString(key) + ":" + modules_Json.stringifyValue(fieldValue));
		}
		return "{" + objFields.join(",") + "}";
	case 6:
		switch(_g.c) {
		case Array:
			return "[" + Std.string(value.map(modules_Json.stringifyValue).join(",")) + "]";
		case String:
			return modules_Json.quoteString(value);
		default:
			return "null";
		}
		break;
	default:
		return "null";
	}
};
modules_Json.quoteString = function(s) {
	return "\"" + StringTools.replace(s,"\"","\\\"") + "\"";
};
var modules_Random = function() { };
modules_Random.__name__ = true;
modules_Random.nextInt = function(min,max) {
	return min + Std.random(max - min + 1);
};
var modules_System = function() { };
modules_System.__name__ = true;
modules_System.currentDate = function() {
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();
	return year + "-" + modules_System.pad(month) + "-" + modules_System.pad(day) + " " + modules_System.pad(hours) + ":" + modules_System.pad(minutes) + ":" + modules_System.pad(seconds);
};
modules_System.pad = function(number) {
	if(number < 10) {
		return "0" + number;
	} else if(number == null) {
		return "null";
	} else {
		return "" + number;
	}
};
modules_System.exit = function() {
	window.close();
};
modules_System.println = function(value) {
	var outputDiv = window.document.getElementById("output");
	if(outputDiv != null) {
		outputDiv.innerHTML += value;
	}
};
var modules_json_Lexer = function(input) {
	this.input = input;
	this.position = 0;
	this.currentChar = null;
	this.readNextChar();
};
modules_json_Lexer.__name__ = true;
modules_json_Lexer.prototype = {
	readNextChar: function() {
		if(this.position < this.input.length) {
			this.currentChar = this.input.charAt(this.position);
			this.position++;
		} else {
			this.currentChar = null;
		}
	}
	,getNextToken: function() {
		while(this.currentChar != null) {
			var _g = this.currentChar;
			if(_g == null) {
				if(this.isDigit(this.currentChar)) {
					return this.readNumber();
				} else if(this.isAlpha(this.currentChar)) {
					return this.readIdentifier();
				} else {
					Flow.error.report("Unexpected character: " + this.currentChar);
					return new modules_json_Token(modules_json_TokenType.EOF,"");
				}
			} else {
				switch(_g) {
				case "\t":
					break;
				case "\n":
					break;
				case "\r":
					this.readNextChar();
					continue;
				case " ":
					break;
				case "\"":
					return this.readString();
				case ",":
					this.readNextChar();
					return new modules_json_Token(modules_json_TokenType.COMMA,",");
				case ":":
					this.readNextChar();
					return new modules_json_Token(modules_json_TokenType.COLON,":");
				case "[":
					this.readNextChar();
					return new modules_json_Token(modules_json_TokenType.LEFT_BRACKET,"[");
				case "]":
					this.readNextChar();
					return new modules_json_Token(modules_json_TokenType.RIGHT_BRACKET,"]");
				case "{":
					this.readNextChar();
					return new modules_json_Token(modules_json_TokenType.LEFT_BRACE,"{");
				case "}":
					this.readNextChar();
					return new modules_json_Token(modules_json_TokenType.RIGHT_BRACE,"}");
				default:
					if(this.isDigit(this.currentChar)) {
						return this.readNumber();
					} else if(this.isAlpha(this.currentChar)) {
						return this.readIdentifier();
					} else {
						Flow.error.report("Unexpected character: " + this.currentChar);
						return new modules_json_Token(modules_json_TokenType.EOF,"");
					}
				}
			}
		}
		return new modules_json_Token(modules_json_TokenType.EOF,"");
	}
	,readString: function() {
		try {
			var result = "";
			this.readNextChar();
			while(this.currentChar != null && this.currentChar != "\"") {
				result += this.currentChar;
				this.readNextChar();
			}
			this.readNextChar();
			return new modules_json_Token(modules_json_TokenType.STRING,result);
		} catch( _g ) {
			var e = haxe_Exception.caught(_g).unwrap();
			Flow.error.report("Error reading string: " + Std.string(e.toString()));
			return new modules_json_Token(modules_json_TokenType.EOF,"");
		}
	}
	,readNumber: function() {
		try {
			var result = "";
			while(this.currentChar != null && (this.isDigit(this.currentChar) || this.currentChar == ".")) {
				result += this.currentChar;
				this.readNextChar();
			}
			return new modules_json_Token(modules_json_TokenType.NUMBER,result);
		} catch( _g ) {
			var e = haxe_Exception.caught(_g).unwrap();
			Flow.error.report("Error reading number: " + Std.string(e.toString()));
			return new modules_json_Token(modules_json_TokenType.EOF,"");
		}
	}
	,readIdentifier: function() {
		try {
			var result = "";
			while(this.currentChar != null && this.isAlphaNumeric(this.currentChar)) {
				result += this.currentChar;
				this.readNextChar();
			}
			return new modules_json_Token(modules_json_TokenType.IDENTIFIER,result);
		} catch( _g ) {
			var e = haxe_Exception.caught(_g).unwrap();
			Flow.error.report("Error reading identifier: " + Std.string(e.toString()));
			return new modules_json_Token(modules_json_TokenType.EOF,"");
		}
	}
	,isDigit: function(char) {
		if(char >= "0") {
			return char <= "9";
		} else {
			return false;
		}
	}
	,isAlpha: function(char) {
		if(!(char >= "a" && char <= "z")) {
			if(char >= "A") {
				return char <= "Z";
			} else {
				return false;
			}
		} else {
			return true;
		}
	}
	,isAlphaNumeric: function(char) {
		if(!this.isAlpha(char)) {
			return this.isDigit(char);
		} else {
			return true;
		}
	}
	,__class__: modules_json_Lexer
};
var modules_json_Token = function(type,value) {
	this.type = type;
	this.value = value;
};
modules_json_Token.__name__ = true;
modules_json_Token.prototype = {
	__class__: modules_json_Token
};
var modules_json_TokenType = $hxEnums["modules.json.TokenType"] = { __ename__:true,__constructs__:null
	,LEFT_BRACE: {_hx_name:"LEFT_BRACE",_hx_index:0,__enum__:"modules.json.TokenType",toString:$estr}
	,RIGHT_BRACE: {_hx_name:"RIGHT_BRACE",_hx_index:1,__enum__:"modules.json.TokenType",toString:$estr}
	,LEFT_BRACKET: {_hx_name:"LEFT_BRACKET",_hx_index:2,__enum__:"modules.json.TokenType",toString:$estr}
	,RIGHT_BRACKET: {_hx_name:"RIGHT_BRACKET",_hx_index:3,__enum__:"modules.json.TokenType",toString:$estr}
	,COMMA: {_hx_name:"COMMA",_hx_index:4,__enum__:"modules.json.TokenType",toString:$estr}
	,COLON: {_hx_name:"COLON",_hx_index:5,__enum__:"modules.json.TokenType",toString:$estr}
	,STRING: {_hx_name:"STRING",_hx_index:6,__enum__:"modules.json.TokenType",toString:$estr}
	,NUMBER: {_hx_name:"NUMBER",_hx_index:7,__enum__:"modules.json.TokenType",toString:$estr}
	,IDENTIFIER: {_hx_name:"IDENTIFIER",_hx_index:8,__enum__:"modules.json.TokenType",toString:$estr}
	,EOF: {_hx_name:"EOF",_hx_index:9,__enum__:"modules.json.TokenType",toString:$estr}
};
modules_json_TokenType.__constructs__ = [modules_json_TokenType.LEFT_BRACE,modules_json_TokenType.RIGHT_BRACE,modules_json_TokenType.LEFT_BRACKET,modules_json_TokenType.RIGHT_BRACKET,modules_json_TokenType.COMMA,modules_json_TokenType.COLON,modules_json_TokenType.STRING,modules_json_TokenType.NUMBER,modules_json_TokenType.IDENTIFIER,modules_json_TokenType.EOF];
var modules_json_Parser = function(lexer) {
	this.lexer = lexer;
	this.currentToken = lexer.getNextToken();
};
modules_json_Parser.__name__ = true;
modules_json_Parser.prototype = {
	parse: function() {
		try {
			return this.parseValue();
		} catch( _g ) {
			var e = haxe_Exception.caught(_g).unwrap();
			Flow.error.report("Error parsing JSON: " + Std.string(e.toString()));
			return null;
		}
	}
	,parseValue: function() {
		switch(this.currentToken.type._hx_index) {
		case 0:
			return this.parseObject();
		case 2:
			return this.parseArray();
		case 6:
			var str = this.currentToken.value;
			this.currentToken = this.lexer.getNextToken();
			return str;
		case 7:
			var num = parseFloat(this.currentToken.value);
			this.currentToken = this.lexer.getNextToken();
			return num;
		case 8:
			var ident = this.currentToken.value;
			this.currentToken = this.lexer.getNextToken();
			return ident;
		default:
			Flow.error.report("Unexpected token: " + Std.string(this.currentToken.type));
			return null;
		}
	}
	,parseObject: function() {
		try {
			var obj = { };
			this.currentToken = this.lexer.getNextToken();
			while(this.currentToken.type != modules_json_TokenType.RIGHT_BRACE) {
				var key = this.parseString();
				this.expect(modules_json_TokenType.COLON);
				var value = this.parseValue();
				obj[key] = value;
				if(this.currentToken.type == modules_json_TokenType.COMMA) {
					this.currentToken = this.lexer.getNextToken();
				}
			}
			this.currentToken = this.lexer.getNextToken();
			return obj;
		} catch( _g ) {
			var e = haxe_Exception.caught(_g).unwrap();
			Flow.error.report("Error parsing object: " + Std.string(e.toString()));
			return null;
		}
	}
	,parseArray: function() {
		try {
			var arr = [];
			this.currentToken = this.lexer.getNextToken();
			while(this.currentToken.type != modules_json_TokenType.RIGHT_BRACKET) {
				arr.push(this.parseValue());
				if(this.currentToken.type == modules_json_TokenType.COMMA) {
					this.currentToken = this.lexer.getNextToken();
				}
			}
			this.currentToken = this.lexer.getNextToken();
			return arr;
		} catch( _g ) {
			var e = haxe_Exception.caught(_g).unwrap();
			Flow.error.report("Error parsing array: " + Std.string(e.toString()));
			return null;
		}
	}
	,parseString: function() {
		try {
			if(this.currentToken.type != modules_json_TokenType.STRING) {
				Flow.error.report("Expected string, got " + Std.string(this.currentToken.type));
				return null;
			}
			var str = this.currentToken.value;
			this.currentToken = this.lexer.getNextToken();
			return str;
		} catch( _g ) {
			var e = haxe_Exception.caught(_g).unwrap();
			Flow.error.report("Error parsing string: " + Std.string(e.toString()));
			return null;
		}
	}
	,expect: function(type) {
		try {
			if(this.currentToken.type != type) {
				Flow.error.report("Expected " + Std.string(type) + ", got " + Std.string(this.currentToken.type));
				return;
			}
			this.currentToken = this.lexer.getNextToken();
		} catch( _g ) {
			var e = haxe_Exception.caught(_g).unwrap();
			Flow.error.report("Error expecting token: " + Std.string(e.toString()));
		}
	}
	,__class__: modules_json_Parser
};
function $getIterator(o) { if( o instanceof Array ) return new haxe_iterators_ArrayIterator(o); else return o.iterator(); }
if(typeof(performance) != "undefined" ? typeof(performance.now) == "function" : false) {
	HxOverrides.now = performance.now.bind(performance);
}
String.prototype.__class__ = String;
String.__name__ = true;
Array.__name__ = true;
Date.prototype.__class__ = Date;
Date.__name__ = "Date";
var Int = { };
var Dynamic = { };
var Float = Number;
var Bool = Boolean;
var Class = { };
var Enum = { };
js_Boot.__toStr = ({ }).toString;
Console.formatMode = Console.determineConsoleFormatMode();
Console.logPrefix = "<b,gray>><//> ";
Console.warnPrefix = "<b,yellow>><//> ";
Console.errorPrefix = "<b,red>></b> ";
Console.successPrefix = "<b,light_green>><//> ";
Console.debugPrefix = "<b,magenta>><//> ";
Console.argSeparator = " ";
Console.unicodeCompatibilityMode = 0;
Console.unicodeCompatibilityEnabled = false;
Console.formatTagPattern = new EReg("(\\\\)?<(/)?([^><{}\\s]*|{[^}<>]*})>","g");
FormatFlag.RESET = "reset";
FormatFlag.BOLD = "bold";
FormatFlag.ITALIC = "italic";
FormatFlag.DIM = "dim";
FormatFlag.UNDERLINE = "underline";
FormatFlag.BLINK = "blink";
FormatFlag.INVERT = "invert";
FormatFlag.HIDDEN = "hidden";
FormatFlag.BLACK = "black";
FormatFlag.RED = "red";
FormatFlag.GREEN = "green";
FormatFlag.YELLOW = "yellow";
FormatFlag.BLUE = "blue";
FormatFlag.MAGENTA = "magenta";
FormatFlag.CYAN = "cyan";
FormatFlag.WHITE = "white";
FormatFlag.LIGHT_BLACK = "light_black";
FormatFlag.LIGHT_RED = "light_red";
FormatFlag.LIGHT_GREEN = "light_green";
FormatFlag.LIGHT_YELLOW = "light_yellow";
FormatFlag.LIGHT_BLUE = "light_blue";
FormatFlag.LIGHT_MAGENTA = "light_magenta";
FormatFlag.LIGHT_CYAN = "light_cyan";
FormatFlag.LIGHT_WHITE = "light_white";
FormatFlag.BG_BLACK = "bg_black";
FormatFlag.BG_RED = "bg_red";
FormatFlag.BG_GREEN = "bg_green";
FormatFlag.BG_YELLOW = "bg_yellow";
FormatFlag.BG_BLUE = "bg_blue";
FormatFlag.BG_MAGENTA = "bg_magenta";
FormatFlag.BG_CYAN = "bg_cyan";
FormatFlag.BG_WHITE = "bg_white";
FormatFlag.BG_LIGHT_BLACK = "bg_light_black";
FormatFlag.BG_LIGHT_RED = "bg_light_red";
FormatFlag.BG_LIGHT_GREEN = "bg_light_green";
FormatFlag.BG_LIGHT_YELLOW = "bg_light_yellow";
FormatFlag.BG_LIGHT_BLUE = "bg_light_blue";
FormatFlag.BG_LIGHT_MAGENTA = "bg_light_magenta";
FormatFlag.BG_LIGHT_CYAN = "bg_light_cyan";
FormatFlag.BG_LIGHT_WHITE = "bg_light_white";
Flow.error = logs_Error.getInstance();
flow_Environment.values = new haxe_ds_StringMap();
flow_Environment.functions = new haxe_ds_StringMap();
flow_Environment.modules = new haxe_ds_StringMap();
Main.main();
})(typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);
