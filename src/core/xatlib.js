'use strict';

module.exports.CleanText = CleanText
module.exports.searchreplace = searchreplace
module.exports.xInt = xInt
module.exports.XMLOrder = XMLOrder
module.exports.WordIsLink = WordIsLink
module.exports.CleanTextNoXat = CleanText;

function CleanText(_arg1, _arg2){
            var _local4;
            var _local5;
            var _local6;
            _arg1 = String(_arg1);
            var _local3 = "";
            _local4 = 0;
            while (_local4 < _arg1.length) {
                _local5 = _arg1.charCodeAt(_local4);
                _local6 = _arg1.charAt(_local4);
                if (_local5 < 32){
                } else {
                    if (_local6 == "<"){
                    } else {
                        if (_local6 == ">"){
                        } else {
                            if (_local6 == "\""){
                            } else {
                                if (_local6 == "'"){
                                } else {
                                    if (_local6 == ","){
                                    } else {
                                        if (_local6 == " "){
                                            if (_arg2 != 1){
                                                _local3 = (_local3 + "_");
                                            };
                                        } else {
                                            _local3 = (_local3 + _local6);
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
                _local4++;
            };
            return (_local3);
        }
        
        
    
function xInt(num) {        
    var num = parseInt(String(num))
    if (isNaN(num)){
        return 0
    }
    return num
}
        
module.exports.xatlinks = function xatlinks(_arg1) {
            var _local2 = new Array(64);
            var _local3 = 0;
            while (_local3 < 26) {
                _local2[_local3] = String.fromCharCode((_local3 + 65));
                _local3++;
            };
            _local3 = 26;
            while (_local3 < 52) {
                _local2[_local3] = String.fromCharCode((_local3 + 71));
                _local3++;
            };
            _local3 = 52;
            while (_local3 < 62) {
                _local2[_local3] = String.fromCharCode((_local3 - 4));
                _local3++;
            };
            _local2[62] = "+";
            _local2[63] = "/";
            var _local4 = new Array();
            var _local5 = new Array();
            _local3 = 0;
            while (_local3 < _arg1.length) {
                _local4[_local3] = _arg1.charCodeAt(_local3);
                _local3++;
            };
            _local3 = 0;
            while (_local3 < _local4.length) {
                switch ((_local3 % 3)){
                    case 0:
                        _local5.push(_local2[((_local4[_local3] & 252) >> 2)]);
                        break;
                    case 1:
                        _local5.push(_local2[(((_local4[(_local3 - 1)] & 3) << 4) | ((_local4[_local3] & 240) >> 4))]);
                        break;
                    case 2:
                        _local5.push(_local2[(((_local4[(_local3 - 1)] & 15) << 2) | ((_local4[_local3] & 192) >> 6))]);
                        _local5.push(_local2[(_local4[_local3] & 63)]);
                        break;
                };
                _local3++;
            };
            if ((_local3 % 3) == 1){
                _local5.push(_local2[((_local4[(_local3 - 1)] & 3) << 4)]);
            } else {
                if ((_local3 % 3) == 2){
                    _local5.push(_local2[((_local4[(_local3 - 1)] & 15) << 2)]);
                };
            };
            _local3 = _local5.length;
            while ((_local3 % 4) != 0) {
                _local5.push("=");
                _local3++;
            };
            var _local6 = new String("http://linkvalidator.net/warn.php?p=");
            _local3 = 0;
            while (_local3 < _local5.length) {
                _local6 = (_local6 + _local5[_local3]);
                _local3++;
            };
            return (_local6);
        }        

function searchreplace(_arg1, _arg2, _arg3, _arg4){
            var _local6;
            var _local7;
            var _local8;
            var _local9;
            var _local5 = 0;
            while (_local5 < _arg3.length) {
                _local6 = _arg3;
                if (_arg4 != 1){
                    _local6 = _arg3.toLowerCase();
                };
                _local7 = _local6.indexOf(_arg1, _local5);
                if (_local7 == -1){
                    break;
                };
                _local8 = _arg3.substr(0, _local7);
                _local9 = _arg3.substr((_local7 + _arg1.length), _arg3.length);
                _arg3 = ((_local8 + _arg2) + _local9);
                _local5 = (_local8.length + _arg2.length);
            };
            return (_arg3);
        }
function XMLOrder(_arg1, _arg2) {
        var _local4;
        var _local5;
        var child = Object.keys(_arg1)[0];
        var _local3 = "<" + child.toString() + " ";
        for (_local4 in _arg2) {
            if (_arg1[child].attributes[_arg2[_local4]] != undefined){
                _local5 = _arg1[child].attributes[_arg2[_local4]].toString();
                if (_arg2[_local4] != "sn"){
                    _local5 = searchreplace("&", "&amp;", _local5);
                    _local5 = searchreplace("'", "&apos;", _local5);
                    _local5 = searchreplace("<", "&lt;", _local5);
                    _local5 = searchreplace(">", "&gt;", _local5);
                };
                 _local5 = searchreplace("\"", "&quot;", _local5);
                _local3 = (_local3 + (((_arg2[_local4] + "=\"") + _local5) + "\" "));
            };
        };
        _local3 = (_local3 + "/>");
        return (_local3);
    }
    

function WordIsLink(_arg1) {
            var _local6;
            if (_arg1.indexOf(".") < 0){
                return (undefined);
            };
            var _local2 = _arg1.toLowerCase();
            if (_local2.indexOf("http://") >= 0){
                return (_arg1);
            };
            var _local3;
            var _local4 = 2;
            if (_local2.indexOf("www.") >= 0){
                _local3 = true;
            };
            var _local5 = _local2.indexOf("/");
            if (_local5 == -1){
                _local5 = _local2.length;
            };
            var _local7 = 0;
            while (_local7 < _local5) {
                _local6 = _local2.charCodeAt(_local7);
                if ((((((_local6 < 48)) || ((_local6 > 57)))) && (!((_local6 == 46))))){
                    _local4 = 0;
                    break;
                };
                _local7++;
            };
            if (_local2.charAt((_local5 - 1)) == "."){
                _local4 = 2;
            };
            if (_local2.charAt((_local5 - 2)) == "."){
                _local4 = 2;
            };
            if (_local2.charAt((_local5 - 3)) == "."){
                _local4++;
            };
            if (_local2.charAt((_local5 - 4)) == "."){
                _local4++;
            };
            if (_local2.charAt((_local5 - 5)) == "."){
                _local4++;
            };
            if (_local4 == 1){
                _local3 = true;
            };
            if (_local3){
                return (("http://" + CleanText(_arg1)));
            };
            return (undefined);
        }
        

        
