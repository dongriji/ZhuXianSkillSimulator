/**
 * @author Administrator
 * 技能选择器： #center .cell
 * 天书选择器： #right .cell
 */

 	var skillSelector = "div[skill_img_selector^='skill_']";
	var bookSelector = "div[book_img_selector^='tianshu_']";
	var ZDtimer = "";
	var BDtimer = "";
$(document).ready(function(){
	
	//技能关联天书高亮函数
	$(skillSelector).click(function(){				
		
		//若高亮，清除高亮
		if($(this).is(".ZDhighlight") || $(this).is(".BDhighlight")){
			//清空所有高亮
			removeHighLight();

		}else{//若不高亮,则设置高亮

			//清空所有高亮
			removeHighLight();
			//得到点击图标，设置高亮,id形式：skill_0_0
			var SkillId = $(this).attr("skill_img_selector");
			$(this).addClass("ZDhighlight");
			ZDtimer = window.setInterval("ZDfaguang()",500);
			
			//根据id查关联
			var floor = SkillId.split("_")[1];//重数
			var num = SkillId.split("_")[2];//顺序
	
			//由此得到关联天书id数组
			var bookIds = skill2tianshu[floor][num];
			//关联天书设置高亮
			if(bookIds != null){
				for(var i = 0; i < bookIds.length; i++){
					$("div[book_img_selector=tianshu_"+bookIds[i]+"]").addClass("BDhighlight");
				}
				BDtimer = window.setInterval("BDfaguang()",500);
			}
		}
	});
	
	//天书关联技能高亮函数
	$(bookSelector).click(function(){//设置高亮				
		
		//若高亮，清除高亮		
		if($(this).is(".ZDhighlight") || $(this).is(".BDhighlight")){
			
			//清空所有高亮
			removeHighLight();

		}else{//若不高亮,则设置高亮

			//清空所有高亮
			removeHighLight();
			
			//得到点击图标，设置高亮,id形式：book_0_0
			var bookId = $(this).attr("book_img_selector");
			$(this).addClass("ZDhighlight");
			ZDtimer = window.setInterval("ZDfaguang()",500);
			
			//根据id查关联
			var floor = bookId.split("_")[1];//重数
			var num = bookId.split("_")[2];//顺序
			//由此得到关联天书id数组
			var skillIds = tianshu2skill[floor][num];
			//关联天书设置高亮
			if(skillIds != null){
				for(var i = 0; i < skillIds.length; i++){
					$("div[skill_img_selector=skill_"+skillIds[i]+"]").addClass("BDhighlight");
				}
				BDtimer = window.setInterval("BDfaguang()",500);
			}
		}
	});
	
	
	//技能关联天书显示关联数据
	var x = 10;  
	var y = 20;
	var img_alt;//临时存img的alt
	$(skillSelector).mouseover(function(e){
		
		$(this).css({"cursor": "pointer"});
		
		img_alt = $(this).find("img").attr("alt");
		$(this).find("img").attr("alt","");
		
		//得到当前状态技能数据
		//var skillData = "当前技能数据";//根据this id到json中获取数据
		var skillId = $(this).attr("skill_img_selector");
		var floor = skillId.split("_")[1];//重数
		var num = skillId.split("_")[2];//顺序
		
		var skillData = "<div class='skillOrBookData'>" + parseSkillJson(skill[floor][num]) + "<\/div>";
		
		//得到关联天书数据
		//var bookData = "关联天书数据";
		var bookIds = skill2tianshu[floor][num];
		var bookJson = "";
		var bookData = "";
		for(var i = 0; i < bookIds.length; i++){
			var bookFloor = bookIds[i].split("_")[0];
			var bookNum = bookIds[i].split("_")[1];
			bookJson = tianshu[bookFloor][bookNum];
			if(bookJson != null){
				bookData += "<div class='skillOrBookData'>" + parseBookJson(bookJson) + "<\/div>";
			}
		}
		
		//创建技能与天书数据div元素
		var skillAndBookDataDiv = "<div id='skillAndBookDataDiv'>" + skillData + bookData + "<\/div>";
		
		//追加到文档
		$("body").append(skillAndBookDataDiv);
		//显示
		$("#skillAndBookDataDiv").css({
			"top": (e.pageY + y) + "px",
			"left": (e.pageX + x) + "px"//设置x和y坐标
		}).show("fast").find(".skillOrBookData").show("500");
		
	}).mouseout(function(){
		$(this).find("img").attr("alt",img_alt);
		$("#skillAndBookDataDiv").remove();//移除
		
	}).mousemove(function(e){
		
		$("#skillAndBookDataDiv").css({
			
			"top": (e.pageY + y) + "px",
			"left": (e.pageX + x) + "px"
		});
	});
	
	//显示天书数据
	$(bookSelector).mouseover(function(e){
		
		$(this).css({"cursor": "pointer"});
		
		img_alt = $(this).find("img").attr("alt");
		$(this).find("img").attr("alt","");
		
		//得到天书数据
		//var bookData = "天书数据";
		var bookId = $(this).attr("book_img_selector");
		var floor = bookId.split("_")[1];//重数
		var num = bookId.split("_")[2];//顺序
		
		var bookData = parseBookJson(tianshu[floor][num]);
		
		//创建技能与天书数据div元素
		var bookDataDiv = "<div id='bookDataDiv'><div class='skillOrBookData'>" + bookData + "<\/div><\/div>";
		//追加到文档
		$("body").append(bookDataDiv);
		//显示
		$("#bookDataDiv").css({
			"top": (e.pageY + y) + "px",
			"left": (e.pageX + x) + "px"//设置x和y坐标
		}).show("fast").find(".skillOrBookData").show("500");
		
	}).mouseout(function(){
		$(this).find("img").attr("alt",img_alt);
		$("#bookDataDiv").remove();//移除
		
	}).mousemove(function(e){
		
		$("#bookDataDiv").css({//移动
			
			"top": (e.pageY + y) + "px",
			"left": (e.pageX + x) + "px"
		});
	});
	


	
})

	//--------------------------辅助方法--------------------------------
	var color_i = 0;
	function ZDfaguang(){
		var change_color = '';
		if(color_i%2 == 0){
			change_color = "#800080";
		}else{
			change_color = "#ff0000";
		}
		$(".ZDhighlight").css({"border-color":change_color});
		color_i++;
	}
	
	var color_j = 0;
	function BDfaguang(){
		var change_color2 = '';
		if(color_j%2 == 0){
			change_color2 = "#33cccc";//"#00ffff"
		}else{
			change_color2 = "#00ff00";//"#ccffcc"
		}
		$(".BDhighlight").css({"border-color":change_color2});
		color_j++;
	}
	
	//清空所有高亮
	function removeHighLight(){

		
		clearInterval(ZDtimer);
		clearInterval(BDtimer);
		if($(".ZDhighlight").length > 0){
			$(".ZDhighlight").css({"border-color":""});
		}
		if($(".BDhighlight").length > 0){
			$(".BDhighlight").css({"border-color":""});
		}
		//解决发光看似延迟问题
		color_i = 0;
		color_j = 0;
		//i=0;j=0;
		//清空.skill_icon高亮
		//$(skillSelector).css({"border":"0px"}).removeClass("ZDhighlight").removeClass("BDhighlight");
		$(skillSelector).removeClass("ZDhighlight").removeClass("BDhighlight");
		//清空.book_icon高亮
		//$(bookSelector).css({"border":"0px"}).removeClass("ZDhighlight").removeClass("BDhighlight");
		$(bookSelector).removeClass("ZDhighlight").removeClass("BDhighlight");
		
	}
	
	//解析技能数据
	function parseSkillJson(skillJson){
	
		if(skillJson == null || skillJson == undefined ){
			return "";
		}
		var add = skillJson.add;
		var firstLine = skillJson['name'] + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color='#ffcb4a'>" + add + "/" + skillJson['max'] + "</font><br />";
		var temp_common = matchReplace(skillJson['common'],add)
		var secondLine = ""
		if(temp_common == ""){
			secondLine = skillJson['common'] + "<br />";
		}
		else if(temp_common != ""){
			secondLine = temp_common + "<br />";
		}
		var thirdLine = "";
		var aircostL = "";
		if(add > 0){
			thirdLine = matchReplace(skillJson['declare'],add - 1) + "<br />";
		}	
		var tmp_aircostl = matchReplace(skillJson['airCost'],add);
			if(tmp_aircostl != ""){
				if(skillJson['type1'] =='英招' ){
					aircostL = "<br />" + "<font color='#ff2222'>" + tmp_aircostl + "&nbsp;气血</font>" + "<br />";
				}else
				aircostL = "<br />" + "<font color='#11aaff'>" + tmp_aircostl + "&nbsp;真气</font>" + "<br />";
			}
			else if(tmp_aircostl == "" && add > 0){
				aircostL = "<br />";
			}
		var fourthLine = "";
		var fifthLine = "";
		var sixthLine = "";
		var sevenLine = "";
		var eightLine = "";
		var aircostN = "";
		if(add < skillJson['max']){
			fourthLine = "下一阶：<br />";
			fifthLine = "<br />";
			sixthLine =  matchReplace(skillJson['declare'],add) + "<br />";
			sevenLine = "学习条件：<br />";
			eightLine = matchReplace(skillJson['studyCondition'],add)+"<br />" ;
			if(skillJson['parentName'] != ""){
				eightLine += skillJson['parentName'] + "达到" + skillJson['parentLevel'] + "阶<br />";
			}
			eightLine += "需要技能点数" + matchReplace(skillJson['costPoint'],add) + "点<br />"; 
		
			var tmp_aircostn = matchReplace(skillJson['airCost'],add+1);
			if(tmp_aircostn != ""){
				if(skillJson['type1'] =='英招' ){
					aircostN = "<font color='#ff2222'>" + tmp_aircostn + "&nbsp;气血</font>" + "<br />";
				}else
				aircostN = "<font color='#11aaff'>" + tmp_aircostn + "&nbsp;真气</font>" + "<br />";
			}
		}		
		return firstLine + secondLine + aircostL + thirdLine + fifthLine + fourthLine + fifthLine + aircostN + sixthLine + sevenLine + eightLine; 
	}
	
	//解析天书数据
	function parseBookJson(bookJson){
		
		if(bookJson == null || bookJson == undefined ){
			return "";
		}
		var add = bookJson.add;
		var firstLine = bookJson['name'] + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + add + "/" + bookJson['max'] + "<br />";
		var secondLine = "";
		var temp_secondLine = bookJson['common'];
		if (temp_secondLine != ""){
			secondLine = bookJson['common'] + "<br />";
		}
		var airCostLTs = "";
		var temp_airCostL = matchReplace(bookJson['airCost'],add);
		if(temp_airCostL !=""){
			airCostLTs = "<br /><font color='#11aaff'>" + temp_airCostL + "&nbsp;真气</font>" + "<br />";
		}
		var thirdLine = "";
		if(add > 0){
			thirdLine = matchReplace(bookJson['declare'],add - 1) + "<br />";
		}
		var fourthLine = "";
		var fifthLine = "";
		var sixthLine = "";
		var sevenLine = "";	
        var airCostNTs = "";
		if(add < bookJson['max']){
			fourthLine = "<br />下一阶：<br /><br />";
			fifthLine =  matchReplace(bookJson['declare'],add) + "<br />";
			sixthLine = "学习条件：<br />";
			sevenLine = matchReplace(bookJson['studyCondition'],add)+"<br />" ;
			if(bookJson['parentName'] != ""){
				sevenLine += bookJson['parentName'] + "达到" + bookJson['parentLevel'] + "阶<br />";
			}
			sevenLine += "需要仙缘点数" + matchReplace(bookJson['costPoint'],add) + "点<br />"; 
			var temp_aircostNTs = matchReplace(bookJson['airCost'],add + 1);
			if(temp_aircostNTs !=""){
				airCostNTs = "<font color='#11aaff'>" + temp_aircostNTs + "&nbsp;真气</font>" + "<br />";
			}
		}
						
		return firstLine + secondLine + airCostLTs + thirdLine + fourthLine + airCostNTs + fifthLine + sixthLine + sevenLine;
		
	}
	
	//用于技能或天书详细说明中将形式为{1,1,1,1,1}的数据替换为当前阶数(var add)对应数据。
	function matchReplace(data,add){
		if(data == null || data.trim == ""){
			return "";
		}
		if(add == null || add.trim == ""){
			return "";
		}
	    var value = data.match(/{.*?}/g);
		//alert(value);
		if(value == null){
			return "";
		}
		for(var i = 0; i < value.length; i++){
			value[i] = value[i].substring(1,value[i].length-1);
			var val = value[i].split(',');
			//alert(val[add]);
			data = data.replace(/{.*?}/,val[add]);
		}
		return data;
	}




