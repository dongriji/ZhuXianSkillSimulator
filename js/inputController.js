/*
 isfly 是否飞升
 isfengshen 是否封神
 isrelate 是否开启关联
 personLevel 人物等级
 fengShenLevel 封神等级
 yuanshenCount 元神数
 zaohuaCount 造化数

 startBun 开始加点
 clearBun 清空加点
 curPersonLevel 当前等级
 curFengshenLevel当前封神等级
 curSkill  剩余门派技能点
 curTianshu 剩余天书点
 curYuanshen 剩余元神修
 curZaohua  剩余造化值
 */
inputController = function(s_controller,z_controller,f_controller,dealURL){
	var skill_count = 0;
	var tianshu_count = 0;
	var person_level = 0;
	var	fengshen_level = 0;
	var zaohua_count = 0;		
	var	yuanshen_count = 0;
	//初始化输入视图
	this.initView = function() {
		reset();//初始化面板		
		bindControl();//绑定相应输入控制		
	}
	
	//url解析后，设置参数
	this.setParam = function() {
		//url解析成功后会设置输入面板的相关数据
		$(".skill input").attr("disabled", true);
		//锁定所有输入

		$("#clearBun").css({
			"cursor" : "pointer"
		}).bind("click", clearClick);
		//绑定清除加点按钮的单击操作
		
		$("#shareBun").css({
            "cursor" : "pointer"
        }).bind("click", copyPoint);
        //绑定清除加点按钮的单击操作

		$("#startBun").css({
			"cursor" : "default"
		}).unbind("click");
		//解除开始加点按钮的单击操作
	}
	
	//按开始按钮，本模块的相关操作
	function start() {
		$(".skill input").attr("disabled", true);//锁定所有输入		

		$("#clearBun").css({
			"cursor" : "pointer"
		}).bind("click", clearClick);//绑定清除加点按钮的单击操作
		
		$("#shareBun").css({
            "cursor" : "pointer"
        }).bind("click", copyPoint);//绑定分享加点按钮的单击操作 		

		$("#startBun").css({
			"cursor" : "default"
		}).unbind("click");//解除开始加点按钮的单击操作
		

		var p_level = $("#personLevel").val();
		var is_fly = $("#isfly").attr("checked");
		var f_level = $("#fengshenLevel").val();

		var y_count = $("#yuanshenCount").val();
		var z_count = $("#zaohuaCount").val();

		if(is_fly)
			is_fly = true;
		//把复选框的checked,undefined 转为相应的true和false
		else
			is_fly = false;

		calculate(is_fly, p_level, f_level);
		//进行计算操作,并设定结果

		$("#curZaohua").text(z_count);
		//剩余造化值
		$("#curYuanshen").text(y_count);
		//剩余元神修
		zaohua_count = z_count;		
		yuanshen_count = y_count;
		fengshen_level = f_level;
	}

	//初始化输入面板
	function reset() {
		$(".skill input").attr("disabled", false);

		$("#personLevel").val(170);//初始人物等级为170		
		$("#isfly").attr("checked", false);//是否飞升设为可用未选		
		$("#isfengshen").attr("checked", false).attr("disabled", true);//是否封神设为不可用未选		
		$("#fengshenLevel").val(0).attr("disabled", true);//初始封神等级为0且不可用		
		$("#yuanshenCount").val(0);
		$("#zaohuaCount").val(0);

		//初始化计算结果
		$("#curPersonLevel").text("170级");
		$("#curFengshenLevel").text("0级");
		$("#curSkill").text(0);
		$("#curTianshu").text(0);
		$("#curYuanshen").text(0);
		$("#curZaohua").text(0);

		$("#clearBun").css({
			"cursor" : "default",
			"text-decoration" : "none"
		}).unbind("click");
		
	    $("#shareBun").css({
            "cursor" : "default",
            "text-decoration" : "none"
        }).unbind("click");

		$("#startBun").css({
			"cursor" : "pointer",
			"text-decoration" : "none"
		}).click(startClick);
	}

	//绑定输入控制操作
	function bindControl() {
		//人物等级输入控制
		$("#personLevel").keypress(function(event) {//只能输入数字
			var keyCode = event.which;
			if(keyCode == 0 || keyCode == 8 || (keyCode >= 48 && keyCode <= 57))
				return true;
			else
				return false;
		}).focus(function() {//关闭输入法
			this.style.imeMode = 'disabled';
		}).blur(function() {//失去焦点是检查数据
			$("#isfly").attr("checked", false);	//默认不飞升
			$("#isfengshen").attr("disabled", true).attr("checked", false);	//默认不可封神
			$("#fengshenLevel").attr("disabled", true).val(0);

			if(isNaN($(this).val())) {
				$(this).val(170);//输入非数值则置为170
			} else {
				var num = new Number($(this).val());
				if(num <= 1) {//人物等级必须大于0
					$(this).val(1);
				} else if(num > 170) {//人物等级必须不大于170
					$(this).val(170);
				} else {
					$(this).val(num);//去除前面多余的零
				}
			}
		});
		//选择飞升操作
		$("#isfly").click(function() {
			$("#isfengshen").attr("disabled", true).attr("checked", false);	//默认不可封神
			$("#fengshenLevel").attr("disabled", true).val(0);
			if($(this).attr("checked")) {//设置为飞升
			    $("#zaohuaCount").val(30033000);
				var num = new Number($("#personLevel").val());
				if(num < 15) {//飞升后，人物等级必须大于等于15
					$("#personLevel").val(15);
				} else if(num >= 120) {//飞升等级达到120后才可以封神
					$("#isfengshen").attr("disabled", false);
				}
			}//否则，设置为未飞升

		});
		//设置是否封神操作
		$("#isfengshen").click(function() {
			$("#fengshenLevel").attr("disabled", true).val(0);
			if($(this).attr("checked")) {//设置为封神
			    $("#yuanshenCount").val(200000000);
				$("#fengshenLevel").attr("disabled", false);
			}//否则，设置为未封神
		});
		inputOnlyNum("#fengshenLevel", 0, 81, 0);	//封神等级输入控制
		inputOnlyNum("#yuanshenCount", 0, 1000000000, 0);	//元神数输入控制
		inputOnlyNum("#zaohuaCount", 0, 1000000000, 0);//造化数输入控制
	}

	//单击开始加点按钮操作
	function startClick() {
		start();//本模块的开始操作
		//---------------------------------------------
		//添加其他模块的开始操作				
		s_controller.start(skill_count,tianshu_count,person_level);
		z_controller.start(zaohua_count,person_level);
		f_controller.start(person_level,fengshen_level,yuanshen_count);	
	}

	//单击清空加点按钮操作
	function clearClick() {
		reset();
		//初始化输入面板
		//---------------------------------------------
		//添加其他模块的重置操作
		s_controller.reset();
		z_controller.reset();
		f_controller.reset();	
	}

	//计算技能点和仙缘点，前置条件是已经经过条件检查
	//isFly是否飞升，level人物等级,封神等级
	function calculate(isFly, personLevel, fengShenLevel) {
		var skillCount;
		//技能点
		var deityCount;
		//仙缘点

		if(isFly) {//飞升
			skillCount = resource[personLevel]["flyYes"][0] + deity[fengShenLevel][0];
			deityCount = resource[personLevel]["flyYes"][1] + deity[fengShenLevel][1];
		} else {//不飞升
			skillCount = resource[personLevel]["flyNo"][0] + deity[fengShenLevel][0];
			deityCount = resource[personLevel]["flyNo"][1] + deity[fengShenLevel][1];
		}

		//输出计算结果
		$("#curPersonLevel").text(personLevel + "级");
		$("#curFengshenLevel").text(fengShenLevel + "级");
		$("#curSkill").text(skillCount);
		$("#curTianshu").text(deityCount);
		//设置属性			
		skill_count = skillCount;;
	    tianshu_count = deityCount;
	    person_level = personLevel;	 
	}

	//控制输入只能为数字	obj控制对象，def默认值，max最大值，min最小值
	function inputOnlyNum(obj, def, max, min) {
		$(obj).keypress(function(event) {//只能输入数字
			var keyCode = event.which;
			if(keyCode == 0 || keyCode == 8 || (keyCode >= 48 && keyCode <= 57))
				return true;
			else
				return false;
		}).focus(function() {//关闭输入法
			this.style.imeMode = 'disabled';
		}).blur(function() {//失去焦点是检查数据
			if(isNaN($(this).val())) {
				$(this).val(def);
				//输入非数值则置为0
			} else {
				var num = new Number($(this).val());
				if(num <= min) {//人物等级必须大于0
					$(this).val(min);
				} else if(num > max) {//人物等级必须不大于170
					$(this).val(max);
				} else {
					$(this).val(num);
					//去除前面多余的零
				}
			}
		});
	}
	
	function copyPoint(){	    
	    var newurl = dealURL.createURL();
	    //alert(newurl);
        var result = dealURL.copyURL(newurl); //将获取的新url复制到剪贴板   
        if(result==1){ //这里需要提供更加人性化的提示
           alert("复制加点地址成功，可CTRL+V分享给好友！感谢您对新版模拟器的支持！");          
        }
    }

}