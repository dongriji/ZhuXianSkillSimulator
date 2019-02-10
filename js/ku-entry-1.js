//测试频道aion
$(function() {
	var KU_ENTRY_CACHE = {};
	var gameName = "";
	getEntryInfo = function(){
		if (KU_ENTRY_CACHE.urlId) {
			displayKuEntry(KU_ENTRY_CACHE);
			return
		}
		gameName = encodeURIComponent(encodeURIComponent($('#ku_channelname').text()));
		var url = "http://ku.duowan.com/actt.do?m=znxh&type=get&gameName=" + gameName + "&jsoncallback=?";
		$.getJSON(url, function(json) {
			if (json.code == '0') {
				KU_ENTRY_CACHE = json.data;
				displayKuEntry(json.data);
			}
		});
	},
	displayKuEntry = function(data) {
		var num = data.num;
		var url = data.urlId;
		url = url + "?ku_znxh";
		$('#kuNoRank').attr("style", "display:block");
		$('#kuLikeNum').text(num);
		$('#txtKuIndexUrl').val(url);
		$('#game-entrance .game-info').attr("style", "display:block");
	},
	$('#game-entrance .btn-live').hover(function() {
		if (KU_ENTRY_CACHE.urlId) {
			displayKuEntry(KU_ENTRY_CACHE);
			return;
		}
		getEntryInfo();
	},function(){
		$('#game-entrance .game-info').attr("style", "display:none");
	}),
	$("#kuUrlId").bind("click",function(){
		var w = 574,h=338;
		var l = (screen.width - w) / 2; 
        var t = (screen.height - h) / 2; 
		window.open('http://ku.duowan.com/znxh/like.html?gameName=' + gameName,'','height=338,width=574,top=' + t + ',left=' + l + ',toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no');
		return false;
	});
});