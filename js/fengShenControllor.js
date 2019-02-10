/**
 * @author Administrator
 */

(function(){
	
	fengShenControllor = function(){}
	
	//人物等级
	var your_level = 0;
	//人物封神等级
	var your_fengShen_level = 0;
	//单阵营模式_最先选择的阵营,0-->道术,1-->佛法,2-->魔劫,3-->未选定阵营
	//var first_select_camp = 3;
	
	//是否关闭多阵营模式，即开启单阵营模式，在单阵营模式下，元神点数只能加一个阵营;在多阵营模式下，每个阵营维护各自的一份元神点数。
	//var close_multi_camp = true;
	//是否打开关联
	var open_relate_fengShen = false;
	
	//人物元神修为
	var basicSoul_count_remain = 0;
	//var basicSoul_count_bak = 0;
	//人物元神修为副本
	//var basicSoulArray = {'basicSoul_count_0':'', 'basicSoul_count_1':'', 'basicSoul_count_2':'basicSoul_count_mo'};
	
	var controllorForFengShen = fengShenControllor.prototype;
	
	//规范化_界面初始化
	controllorForFengShen.initView = function(){
		
		controllorForFengShen.init_daoShu();
		controllorForFengShen.init_foFa();
		controllorForFengShen.init_moJie();
		
		//隐藏加减号
		controllorForFengShen.close_inc_dec_sign();
		
		//是否打开关联
		open_relate_fengShen = $("#isrelate").is(":checked");
		$("#isrelate").click(function(){
			open_relate_fengShen = $(this).is(":checked");
		})
		
		//显示说明卡数据
		controllorForFengShen.show_declare_card();
		//点击加减号的处理方法
		controllorForFengShen.click_sign_handle();
	}
	
	controllorForFengShen.setParam = function(given_level, given_fengShen_level, given_basicSoul_remain){
		
		//为人物等级，封神等级，元神修为初始化
		your_level = given_level;
		your_fengShen_level = given_fengShen_level;
		
		//basicSoul_count_bak = given_basicSoul;
		basicSoul_count_remain = given_basicSoul_remain;
		// for(var fengShenCamp = 0; fengShenCamp < 3; fengShenCamp++){
			// for(var i in fengshen[fengShenCamp]){
				// for(var j = 0; j < fengshen[fengShenCamp][i].add; j++){
					// basicSoul_count += parseInt(matchReplace(fengshen[fengShenCamp][i].costPoint,j));
				// }
			// }
		// }
		
		//显示加减号
		controllorForFengShen.show_inc_dec_sign();
		
		//显示数据...
		controllorForFengShen.show_changedData_by_camp(0);
		controllorForFengShen.show_changedData_by_camp(1);
		controllorForFengShen.show_changedData_by_camp(2);
		
		
	}
	
	controllorForFengShen.start = function(given_level, given_fengShen_level, given_basicSoul_remain){
		
		your_level = given_level;
		your_fengShen_level = given_fengShen_level;
		basicSoul_count_remain = given_basicSoul_remain;
		//basicSoul_count_bak = given_basicSoul_remain;
		//显示加减号
		controllorForFengShen.show_inc_dec_sign();
		
	}
	
	controllorForFengShen.reset = function(){
		
		//隐藏加减号
		controllorForFengShen.close_inc_dec_sign();
		for(var fengShenCamp = 0; fengShenCamp < 3; fengShenCamp++){
			for(var i in fengshen[fengShenCamp]){
				fengshen[fengShenCamp][i].add = 0;
				$("b[key=fengShenImg_"+fengShenCamp+"_"+i+"]").text(0);
			}
		}
		
	}
	
	
	
	
	//初始化道术界面
	controllorForFengShen.init_daoShu = function(){
		
		var html = share_init(0);

		$("div[key='fengShen_daoShu']").html(html);
	}
	//初始化佛法界面
	controllorForFengShen.init_foFa = function(){
		
		var html = share_init(2);

		$("div[key='fengShen_foFa']").html(html);
	}
	//初始化魔劫界面
	controllorForFengShen.init_moJie = function(){
		
		var html = share_init(1);

		$("div[key='fengShen_moJie']").html(html);
	}
	
	
	//显示说明卡数据,参数open_relate_fengShen为是否打开关联显示
	controllorForFengShen.show_declare_card = function(){
		
		var x = 10;  
		var y = 20;
		var fengshenSelector = "div[key^=fengShenImg_]";
		var tmp_img_alt;
		$(fengshenSelector).mouseover(function(e){
			
			tmp_img_alt = $(this).find("img").attr("alt");
			$(this).find("img").attr("alt","");
			
			//根据点击id得到相关数据
			//var fengshenData = "封神数据";//$(this).attr("id");
			var fengShenKey = $(this).attr("key");
			var camp = fengShenKey.split("_")[1];//阵营
			var num = fengShenKey.split("_")[2];//顺序
			var fengshen_show_data = "<div class='skillOrBookData'>查无数据<\/div>";
			
			//如果打开关联，则显示关联数据
			x = 10;
			if(fengshen[camp][num] != null){
				
				var tmp_bl = true;
				
				if(fengshen[camp][num].relate == null || fengshen[camp][num].relate == ""){
					tmp_bl = false;
				}
				
				if(tmp_bl && open_relate_fengShen){
					var tmp_given_add = fengshen[camp][num].add;
					x = 0 - 300;
					//common_show_err(e,parseFengShenJson(fengshen[0][num], tmp_given_add));
					fengshen_show_data = "<div class='skillOrBookData'>道术：" + parseFengShenJson(fengshen[0][num], tmp_given_add) + "<\/div>" +
											"<div class='skillOrBookData'>佛法：" + parseFengShenJson(fengshen[1][num], tmp_given_add) + "<\/div>" +
											"<div class='skillOrBookData'>魔劫：" + parseFengShenJson(fengshen[2][num], tmp_given_add) + "<\/div>" ;
				}else{
					fengshen_show_data = "<div class='skillOrBookData'>" + parseFengShenJson(fengshen[camp][num]) + "<\/div>";
				}
			}
			//创建数据显示div元素
			var fengshenDataDiv = "<div id='fengshenDataDiv'>" + fengshen_show_data + "<\/div>";
			
			//追加到文档中
			$("body").append(fengshenDataDiv);
			
			//显示
			if(x == 10){
				$("#fengshenDataDiv").css({
					"width": 200 + "px"
				})
			}
			$("#fengshenDataDiv").css({
				"top": (e.pageY + y) + "px",
				"left": (e.pageX + x) + "px"
			}).show("fast").find(".skillOrBookData").show("1000");
			
		}).mouseout(function(){
			$(this).find("img").attr("alt",tmp_img_alt);
			$("#fengshenDataDiv").remove();//移除
			
		}).mousemove(function(e){
			
			$("#fengshenDataDiv").css({
				"top": (e.pageY + y) + "px",
				"left": (e.pageX + x) + "px"//跟随光标移动
			})
		});
	}
	
	//隐藏加减号
	controllorForFengShen.close_inc_dec_sign = function(){
		$("b[key^='fengShenImg_']").siblings("span").hide();
		//不透明样式
		controllorForFengShen.opacity_true();
	}
	
	
	//加减号显示
	controllorForFengShen.show_inc_dec_sign = function(){
		controllorForFengShen.opacity_false();
		// if(first_select_camp != 3){
			// controllorForFengShen.opacity_true();
			// controllorForFengShen.opacity_false(first_select_camp);
		// }
		
		//从fengShenData中取得相应数据，初始化各阶数
		var fengShengData_initSelector = "b[key^='fengShenImg_']";
		var $items = $(fengShengData_initSelector);

		for(var i = 0; i < $items.length; i++){
			
			var $temp = $items.eq(i);
			
			var fengShen_initId = $temp.attr("key");
			//alert(fengShen_initId);
			var fengShen_camp = fengShen_initId.split("_")[1];
			var fengShen_num = fengShen_initId.split("_")[2];
			//var fengShen_camp_num = parseCamp(fengShen_camp)
			//alert(fengShen_camp_num + "," + fengShen_num);
			if(fengshen[fengShen_camp][fengShen_num] != null){
				var fengShen_add = parseInt(fengshen[fengShen_camp][fengShen_num].add);
				//判断+号是否显示，默认不显示
				if(fengShen_add < parseInt(fengshen[fengShen_camp][fengShen_num].max)){
					
					$temp.siblings("span.inc").show();
				}
				//判断-号是否显示
				if(fengShen_add > 0){
					//-号不显示
					$temp.siblings("span.dec").show();
				}
			}
		}
	}
	
	//选项卡被选择时应显示的元神值,当要求能支持多阵营时再取消注释
	var fengShen_soul_remain_selector = "#curYuanshen";//封神剩余元神定位选择器
	// controllorForFengShen.show_cur_camp_basicSoul_remain = function(){
		// $("li[key^='fengShen_title_']").mouseover(function(){
			// //得到阵营(0,1,2)中的一个
			// //var title_camp = $(this).attr("key").split("_")[2];
			// //得到对应元神值
			// //var title_soul = basicSoulArray['basicSoul_count_' + title];
			// //显示对应元神值
			// //$(fengShen_soul_remain_selector).text(basicSoulArray['basicSoul_count_' + title_camp]);
		// })
	// }
	
	
	//点击加减号的处理方法
	controllorForFengShen.click_sign_handle = function(){
		
		var fengshenIncreaseSelector = "div.fs span.inc";//封神加号选择器
		var fengshenDecreaseSelector = "div.fs span.dec";//封神减号选择器
		
		//点击加号的处理方法
		$(fengshenIncreaseSelector).click(inc_event);
		
		//点击减号的处理方法
		$(fengshenDecreaseSelector).click(dec_event);
	
	}
	
	//返回当前进入的阵营、剩余元神
	// controllorForFengShen.getCamp = function(){
		// return first_select_camp;
	// }
	
	//----------------------辅助方法--------------------
	//不透明样式_真
	controllorForFengShen.opacity_true = function(camp){
		var tmp_true_selector = "div[key^='fengShenImg_']";
		if(camp != null){
			tmp_true_selector = "div[key^='fengShenImg_'"+camp+"]"
		}
		$(tmp_true_selector).css({
			'filter': 'Alpha(opacity=50)',
			'-moz-opacity':'.1',
			'opacity':'0.5'
		});
	}
	//不透明样式_假
	controllorForFengShen.opacity_false = function(camp){
		var tmp_false_selector = "div[key^='fengShenImg_']";
		if(camp != null){
			tmp_false_selector = "div[key^='fengShenImg_"+camp+"']";
			//alert(camp);
		}
		$(tmp_false_selector).css({
			'filter': 'Alpha(opacity=100)',
			'-moz-opacity':'.1',
			'opacity':'1'
		});
	}
	
	controllorForFengShen.show_changedData_by_camp = function (camp){
		//var data_length = fengshen[camp].length
		for(var i in fengshen[camp]){
			$("b[key=fengShenImg_"+camp+"_"+i+"]").text(fengshen[camp][i].add);
		}
	}
	
	
	//共通的初始化方法
	function share_init(fengShen_camp){
		
		var html = "";
		//<div class="fs fs01"><div><img alt="" src="i/icon_skill.jpg" /><b>1</b><span class="dec"></span><span class="inc"></span></div></div>
	//	for(var i = 1; i <= imgTotalNum; i++){
		for(var i in fengshen[fengShen_camp]){	
			var imgId = "fengShenImg_" + fengShen_camp + "_" + i;
			var fengShen_img_name = getFengShenAttrById(imgId, 'name');
			var fengShen_img_src = getFengShenAttrById(imgId, 'img');
			// if(path == ''){
				// path = "newblue.gif";
			// }
			//图片源暂定，可能随时需要修改
			//var fengShen_img_src = "image/fengshen/" + i + ".jpg";
			//var fengShen_img_add = getFengShenAttrById(imgId, 'add');
			
			var tmpNum = i;
			if(i < 10){
				tmpNum = "0" + i;
			}
			html += "<div class='fs fs" + tmpNum + "'><div ><div key='" + imgId + "' style='width:42px;height:40px;padding-top:0px;margin:0px auto'><img alt='" + fengShen_img_name + 
					"' src='" + fengShen_img_src + "' /></div><b key='" + imgId + "'>" + 0 + 
					"</b><span class='dec'></span><span class='inc'></span></div></div>"
		}
		return html;
	}
	//通过标志id得到属性
	function getFengShenAttrById(id, attr){
		
		var fengShen_camp_num = id.split("_")[1];
		var fengShen_num = id.split("_")[2];
		var tempData = fengshen[fengShen_camp_num][fengShen_num];
		if(typeof(tempData) == 'undefined'){
			return "";
		}
		
		var attr_value = fengshen[fengShen_camp_num][fengShen_num][attr];
		
		if(typeof(attr_value) == 'undefined'){
			attr_value = "";
		}
		return attr_value;
	}
	
	//加号事件
	var inc_event = function(e){
			//得到标志id
			var fengShenDataId = $(this).siblings("b").attr("key");//key值形式： "fengShenImg_" + fengShen_camp + "_" + fengShen_num
			var fengShenData_camp = fengShenDataId.split("_")[1];//解析得到阵营
			// if(close_multi_camp && first_select_camp != 3){
				// if(first_select_camp != fengShenData_camp){
					// common_show_err(e, "单阵营模式，无法跨阵营加点!请先将已锁定的阵营已加点数还原");
					// return;
				// }
			// }
			
			var fengShenData_num = fengShenDataId.split("_")[2];//解析得到顺序号
			var thisFengShenData = fengshen[fengShenData_camp][fengShenData_num];
			if(thisFengShenData == null){
				common_show_err(e, "查无相应数据");//实际上，若thisFengShenData为空，则没有显示加减号，因为不会进入到此语句，可删除
			}else{
				
				//查询消耗元神值
				var consume_count = matchReplace(thisFengShenData.costPoint,thisFengShenData.add);
	
				//alert(consume_count);
				if(typeof(consume_count) == 'undefined'){
					common_show_err(e,"数据未开放");
					return;
				}
				consume_count = parseInt(consume_count);
				if(isNaN(consume_count)){
					common_show_err(e, "消耗元神数据解析错误，请检查数据源");
					return;
				}
				
				//判断当前元神修为值是否够消耗//不够消耗，伤不起 return ;
				if(basicSoul_count_remain < consume_count){
					common_show_err(e, "元神修为不足！");
					return;
				}
				
				//查询是否满足学习条件
				var level_limit = thisFengShenData.studyCondition.match(/{.*?}/g);//解析出有关学习条件的数组，形式如：[{1, 2, 3,...},{1, 2, 3,...}]
				//alert(level_limit);
				var study_level_limit = parseInt(matchReplace(level_limit[0],thisFengShenData.add));//人物等级需满足的下限
				var study_fengShen_level_limit = parseInt(matchReplace(level_limit[1],thisFengShenData.add));//人物元神等级需满足的下限
				//
				if(isNaN(study_level_limit) || isNaN(study_fengShen_level_limit)){
					common_show_err(e, "学习条件的数据解析错误，请检查数据源");
					return;
				}
				
				//人物等级或元神等级不足
				if(your_level < study_level_limit || your_fengShen_level < study_fengShen_level_limit){
					
					common_show_err(e, "人物等级或元神等级不足！");
					return;
				}
				
				//够消耗并且未达到最大阶，扣除。
				if((thisFengShenData.add = parseInt(thisFengShenData.add)) < parseInt(thisFengShenData.max)){
					//add+1
					thisFengShenData.add += 1;
					//显示+1
					$(this).siblings("b").text(thisFengShenData.add);
					//+、-号显示
					if(thisFengShenData.add > 0){
						//-号显示
						$(this).siblings("span").show();
					}
					if(thisFengShenData.add >= thisFengShenData.max){
						$(this).hide();
					}
					//扣除元神
					basicSoul_count_remain -= consume_count;
					//显示
					$(fengShen_soul_remain_selector).text(basicSoul_count_remain);
				}
			}
		}

	var dec_event = function(e){
			//值显示
			var fengShenDataId = $(this).siblings("b").attr("key");//key值形式： "fengShenImg_" + fengShen_camp + "_" + fengShen_num
			var fengShenData_camp = fengShenDataId.split("_")[1];
			//单阵营模式,实际上，在此模式下，被封锁的阵营-号不显示，故可不加以判断
			// if(close_multi_camp && first_select_camp != "never"){
				// if(first_select_camp != fengShenData_camp){
					// alert("单阵营模式，无法跨阵营加点!");
					// return;
				// }
			// }
			var fengShenData_num = fengShenDataId.split("_")[2];
			var thisFengShenData = fengshen[fengShenData_camp][fengShenData_num];
			if(thisFengShenData == null){
				common_show_err(e, "查无相应数据");//实际上，若thisFengShenData为空，则没有显示加减号，因为不会进入到此语句，可删除
			}else{
				if(thisFengShenData.add > 0){
					
					//查询应增加的元神点数
					var consume_count = matchReplace(thisFengShenData.costPoint,--thisFengShenData.add);
					
					consume_count = parseInt(consume_count);
					if(isNaN(consume_count)){
						common_show_err(e, "元神数据解析错误，请检查数据源");
						return;
					}
					
					//add-1
					//thisFengShenData.add -= 1;
					//显示-1
					$(this).siblings("b").text(thisFengShenData.add);
					//+、-号显示
					if(thisFengShenData.add < thisFengShenData.max){
						
						$(this).siblings("span").show();
					}
					if(thisFengShenData.add <= 0){
						//-号显示
						$(this).hide();
					}
					
					//增加元神
					basicSoul_count_remain += consume_count;
				//	var basicSoul_attr = "basicSoul_count_" + fengShenData_camp;
				//	basicSoulArray[basicSoul_attr] += parseInt(consume_count);
					//显示
					$(fengShen_soul_remain_selector).text(basicSoul_count_remain);
					
					//if(basicSoul_count_bak == basicSoul_count){//还原状态
						//first_select_camp = 3;
						//never_enter = true;
						//array_copy_value(basicSoulArray, basicSoul_count);
						//不透明
						//controllorForFengShen.opacity_false();
					//}
				}
			}
		}
		
	
	//解析封神数据
	function parseFengShenJson(fengShenJson, given_add){
		
		if(fengShenJson == null || fengShenJson == undefined ){
			return "";
		}
		//alert(fengShenJson.add);
		var add = fengShenJson.add;
		if(given_add != null && given_add >= 0){
			add = given_add;
		}
		var temp_type2 = fengShenJson['type2']
		var temp_name = ""
		if(temp_type2 == "仙"){
			temp_name = "<font color='#aaffff'>" + fengShenJson['name'] + "</font>"
		}
		else if(temp_type2 == "魔"){
			temp_name = "<font color='#aa32ff'>" + fengShenJson['name'] + "</font>"
		}
		else{
			temp_name = "<font color='#eeee00'>" + fengShenJson['name'] + "</font>"
		}
		var firstLine = ""
		var temp_firstLine = temp_name + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + "<font color='#ffcb4a'>" + add + "/" + 20 + "</font>";
		var temp_br = "<br />";
		var temp_blank1 = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
		var temp_blank2 = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
		var temp_skillType = fengShenJson['skillType'];
		var temp_castTime = fengShenJson['castTime'];
		if(temp_skillType == "" && temp_castTime == ""){
			firstLine = temp_firstLine + temp_br;
			}
		    else if(temp_skillType == "" && temp_castTime != "")
			{
			     firstLine = temp_firstLine + temp_blank2 + temp_castTime + temp_br;
			}
			else if(temp_skillType != "" && temp_castTime == "")
			{
			     firstLine = temp_firstLine + temp_blank2 + temp_skillType + temp_br;
			}
			else if(temp_skillType == null && temp_castTime == null)
			{
			     firstLine = temp_firstLine + temp_br;
			}
			else
			{
				firstLine = temp_firstLine + temp_blank1 + temp_skillType + temp_blank1 + temp_castTime + temp_br;
			}
		//fengShenJson['max']
		var secondLine = "";
		var temp_secondLine = matchReplace(fengShenJson['common'],add)
		if(temp_secondLine == ""){
			secondLine = fengShenJson['common'] + "<br />";
			}
			else
			{
				secondLine = temp_secondLine + "<br />";
			}
		var airCostL = "";
		var thirdLine = "";
		if(add > 0){
			var tmp_airCostL = matchReplace(fengShenJson['airCost'],add - 1);
			if(tmp_airCostL != ""){
				airCostL = "<br />消耗真气：" + tmp_airCostL;
			}
			thirdLine =  "<br />" + matchReplace(fengShenJson['declare'],add - 1) + "<br />";
			var tmp_text2 = matchReplace(fengShenJson['ylCost'],add - 1);
			if(tmp_text2 != ""){
				thirdLine = "<br />消耗元力：" + tmp_text2 + thirdLine;
			}
		}	
		var fourthLine = "";
		var airCostN = "";
		var fifthLine = "";
		var sixthLine = "";
		var sevenLine = "";
		if(add < fengShenJson['max']){
			fourthLine = "<br />下一阶：<br />";
			var tmp_airCostN = matchReplace(fengShenJson['airCost'],add);
			if(tmp_airCostN != ""){
				airCostN = "<br />消耗真气：" + tmp_airCostN;
			}
			fifthLine =  "<br />" + matchReplace(fengShenJson['declare'],add) + "<br />";
			sixthLine = "学习条件：<br />";
			sevenLine = matchReplace(fengShenJson['studyCondition'],add) + "<br />消耗元神修为 " + matchReplace(fengShenJson['costPoint'],add) + "点";
			var tmp_text = matchReplace(fengShenJson['ylCost'],add);
			if(tmp_text != ""){
				fifthLine = "<br />消耗元力：" + tmp_text + fifthLine;
			}
			//"<br />真气消耗：" + matchReplace(fengShenJson['airCost'],add) + "<br />";
			//"<br />元神消耗：" + matchReplace(fengShenJson['soulCost'],add)
			//+ "<br />元力消耗：" + matchReplace(fengShenJson['basicPowerCost'],add) + "<br />真气消耗：" + matchReplace(fengShenJson['airCost'],add);
		}
		return firstLine + secondLine + airCostL + thirdLine + fourthLine + airCostN + fifthLine + sixthLine + sevenLine;
	}
	
	//用于技能或天书详细说明中将形式为{1,1,1,1,1}的数据替换为当前阶数(var add)对应数据。

/*	function matchReplace(data,add){
	    var value = data.match(/{.*?}/g);
		for(var i = 0; i < value.length; i++){
			value[i] = value[i].substring(1,value[i].length-1);
			var val = value[i].split(',');
			data = data.replace(/{.*?}/,val[add]);
		}
		return data;
	}*/
	
})($);
