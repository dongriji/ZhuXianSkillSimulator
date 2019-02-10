
/****************************
*以下是门派技能的操作函数，方法在完成代码的时候会有更改
*
*****************************/
(function(){
	skillController = function(){}
	var skill_cost = new Array(0,0,0,0,0,0); //每一重的加点
	var deity_cost = new Array(0,0,0);
	var c = skillController.prototype;
	var sCost = 0;     //花费技能点
	var deityCost = 0; //花费仙缘点
	var skillCount = 0; //当前总技能点
	var skillRemain = 0;  //剩余
	var deityCount = 0;//当前仙缘点
	var deityRemail = 0;
	var level = 0; //当前人物等级
	var page = 0;  //当前页
	var open_relate_intro = false;
	var skill_no_parent = new Array();
	var skillNeed = new Array(0,32,24,24,24);
	var skillName = new Array('jiuli','jiuli2','jiuli2','jiuli2','jiuli3');
	var skillClass = new Array('jl jl','jl jl','jl jl','jl jl','jl jl');
	var tianshuClass = new Array('tianmai','zhanhun','xuequ');
	var tianshuChildClass = new Array('tm tm','zh zh','xq xq');
	var skillRightZD = new Array(49);  //主动右移
	var skillRightBD = new Array(14);  //被动右移
	var tianshuRight = new Array(7);   //天书右移

	c.initView = function(){
		sCost = 0;
		deityCost = 0;
		if(typeof(skill_name) == 'object') skillName = skill_name;
		if(typeof(skill_class) == 'object') skillClass= skill_class;
		if(typeof(tianshu_class[0]) != 'undefined') tianshuClass[0] = tianshu_class[0];
		if(typeof(tianshu_class[1]) != 'undefined') tianshuClass[1] = tianshu_class[1];
		if(typeof(tianshu_class[2]) != 'undefined') tianshuClass[2] = tianshu_class[2];
		if(typeof(tianshu_child_class[0]) != 'undefined') tianshuChildClass[0] = tianshu_child_class[0];
		if(typeof(tianshu_child_class[1]) != 'undefined') tianshuChildClass[1] = tianshu_child_class[1];
		if(typeof(tianshu_child_class[2]) != 'undefined') tianshuChildClass[2] = tianshu_child_class[2];
		if(typeof(skill_need) != 'undefined')skillNeed = skill_need;
		c.initViewSkill();
		c.initViewTianshu();
		c.showLeft();
		c.initClick();
	}
	c.initViewSkill = function(){
		if(typeof(skill) != 'undefined'){
			var html='';
			var style='';
			var dec = '';
			var inc = '';
			var opacity_open = 'style ="filter: Alpha(opacity=100);-moz-opacity:.1;opacity:1"';
			var opacity_close = 'style ="filter: Alpha(opacity=50);-moz-opacity:.1;opacity:0.5"';
			for(var n in skill){
				n = parseInt(n);
				if(n==0) html +='<div name="skill_'+n+'" class="'+skillName[n]+'" style="display:block">';
				else html +='<div name="skill_'+n+'" class="'+skillName[n]+'" style="display:none">';
				skill_no_parent[n] = new Array();
				for(var i in skill[n]){
					if(i<10) j='0'+i; else j=i;
					style = opacity_close;
					key = 'skill_'+n+'_'+i;
					dec  = 'name="'+key+'_dec"';
					inc  = 'name="'+key+'_inc"';
					skill[n][i].add = 0;
					skill[n][i]['look'] = 0;
					skill[n][i].rightshow = parseInt(skill[n][i].rightshow);
					skill[n][i].max = parseInt(skill[n][i].max);
					if(skill[n][i].rightshow == '1') skill[n][i].rightshow =1;
					else skill[n][i].rightshow = 0;
					if(skill[n][i].parent == '') skill[n][i].parent == 100;
					else skill[n][i].parent == parseInt(skill[n][i].parent);
					if(skill[n][i].parent == ''){
						skill_no_parent[n].push(i);
					}
					if(typeof(skill[n][i].childs) != 'undefined' && skill[n][i].childs != ''){  //分解child
						var childs = skill[n][i].childs;
						skill[n][i].childs = childs.split(',');
					}else{
						skill[n][i].childs = new Array();
					}
					if(skill[n][i].parentLevel == '') skill[n][i].parentLevel =0;
					else skill[n][i].parentLevel = parseInt(skill[n][i].parentLevel);
					
					html +='<div class="'+skillClass[n]+j+'" key="skill_'+n+'_'+i+'" '+style+'><div content='+key+'>'+
						   '<div skill_img_selector="'+key+'" style="width:42px;height:40px;padding-top:0px;margin:0px auto">' + 
						   '<img  src="'+skill[n][i].img+'" alt="'+skill[n][i].name+'"/></div>'+
						   '<b>'+skill[n][i].add+'</b>'+
						   '<span '+dec+'   key="'+key+'" ></span>'+
						   '<span '+inc+'   key="'+key+'" ></span></div></div>';
				}
				html +='</div>';
				
				
			}
			$('#con_left').html(html);
			$('div[key=jnvalue]').html('本重已加点：0');
		}
	}
	c.initViewTianshu = function(){
		if(typeof(tianshu) != 'undefined'){
			var html='';
			var style='';
			var dec = '';
			var inc = '';
			var opacity_open = 'style ="filter: Alpha(opacity=100);-moz-opacity:.1;opacity:1"';
			var opacity_close = 'style ="filter: Alpha(opacity=50);-moz-opacity:.1;opacity:0.5"';
			for(var n in tianshu){
				if(n==0) html +='<div name="tianshu_'+n+'" class="'+tianshuClass[n]+'">';
				else html +='<div name="tianshu_'+n+'" class="'+tianshuClass[n]+' hide">';
				for(var i in tianshu[n]){
					if(i<10) j='0'+i; else j=i;
					key = 'tianshu_'+n+'_'+i;
					style = opacity_close;
					dec  = 'name="'+key+'_dec"';
					inc  = 'name="'+key+'_inc"';
					tianshu[n][i].add = 0;
					tianshu[n][i]['look'] = 0;
					tianshu[n][i].max = parseInt(tianshu[n][i].max);
					if(tianshu[n][i].rightshow == '1') tianshu[n][i].rightshow =1;
					else tianshu[n][i].rightshow = 0;
					if(tianshu[n][i].parentLevel == '') tianshu[n][i].parentLevel =0;
					else tianshu[n][i].parentLevel = parseInt(tianshu[n][i].parentLevel);
					
					html +='<div class="'+tianshuChildClass[n]+j+'" key="tianshu_'+n+'_'+i+'" '+style+'><div>'+
						   '<div book_img_selector="'+key+'" style="width:42px;height:40px;padding-top:0px;margin:0px auto">' + 
						   '<img src="'+tianshu[n][i].img+'" alt="'+tianshu[n][i].name+'"/></div>'+			//'<img src="skill/'+tianshu[n][i].img+'" alt="'+tianshu[n][i].name+'"/>'+
						   '<b>'+tianshu[n][i].add+'</b>'+
						   '<span '+dec+' key="'+key+'" ></span>'+
						   '<span '+inc+' key="'+key+'" ></span></div></div>';
					if(typeof(tianshu[n][i].childs) != 'undefined' && tianshu[n][i].childs != ''){   //分解child
						var childs = tianshu[n][i].childs;
						tianshu[n][i].childs = childs.split(',');
					}else{
						tianshu[n][i].childs = new Array();
					}
				}
				html +='</div>';
				
				
			}
			$('#con_right').html(html);
			$('div[key=xyvalue]').html('本天书已加点：0');
		}
	}
	/**********
	*初始化页面方法
	*
	**********/
	c.initClick = function(){
		
		$('span.inc[name^=skill_]').live('click',function(e){
			var key = $(this).attr('key');
			c.addSkill(e,key);
		});
		
		$('span.inc[name^=tianshu_]').live('click',function(e){
			var key = $(this).attr('key');
			c.addTianshu(e,key);
		});
		$('span.dec[name^=skill_]').live('click',function(e){
			var key = $(this).attr('key');
			 c.delSkill(key);
		});
		$('span.dec[name^=tianshu_]').live('click',function(e){
			var key = $(this).attr('key');
			 c.delTianshu(key);
		});
		
		
		//上一页，下一页
		$('.btn-prev').click(function(){
			c.up();
		});
		$('.btn-next').bind('click',function(){
			c.down();
		});
		$('#tianshu li.hover').live('mousemove',function(e){
			var id = $('#tianshu li.hover').attr('id');
			var html = $('#tianshu li.hover').html();
			html = html.replace(/(^\s*)|(\s*$)/g, "");
			html = html+ '天书';
			$('#tianshu_name').html(html);
			if(id=='ts_one') $('div[key=xyvalue]').html('本天书已加点：'+deity_cost[0]);
			if(id=='ts_two') $('div[key=xyvalue]').html('本天书已加点：'+deity_cost[1]);
			if(id=='ts_three') $('div[key=xyvalue]').html('本天书已加点：'+deity_cost[2]);
		});
	}

	c.setParam = function(skill_remain,deity_remain,personLevel){
		skillRemain = parseInt(skill_remain);
		deityRemain = parseInt(deity_remain);
		level = parseInt(personLevel);
		skill_cost = new Array(0,0,0,0,0,0,0);
		sCost = 0;
		deityCost = 0;
		c.setParamSkill();
		c.setParamTianshu();
		skillCount = skillRemain + sCost;
		deityCount = deity_remain + deityCost;
		$('div[key=jnvalue]').html('本重已加点：'+skill_cost[0]);
		$('div[key=xyvalue]').html('本天书已加点：'+deity_cost[0]);
	}
	c.setParamSkill  = function(){
		if(typeof(skill) != 'undefined'){
			var data = skill; 
			var name = 'skill';
			var key;
			var close = 10;
			for(var n in data){
				if(n>0 && skill_cost[n-1]<skillNeed[n]) break;
				for(var i in data[n]){
					key = 'skill_'+n+'_'+i;
					data[n][i].add = parseInt(data[n][i].add);
					if(data[n][i].add > 0){
						skill_cost[n] = skill_cost[n] + data[n][i].add;
						sCost = sCost + data[n][i].add;
						data[n][i]['look'] = 1;
						if(data[n][i].rightshow == 1)c.rightShow('skill',n,i);
						$('div[name='+name+'_'+n+']').find('div[key='+key+']').find('b').html(data[n][i].add);
						$('div[name='+name+'_'+n+']').find('div[key='+key+']').css('opacity','1');
						
						if(data[n][i].add == data[n][i].max){	
							$('span[name='+key+'_dec]').addClass("dec");
							$('span[name='+key+'_inc]').removeClass("inc");
						}else{
							$('span[name='+key+'_dec]').addClass("dec");
							$('span[name='+key+'_inc]').addClass("inc");
						}
						if(data[n][i].type1 == '太昊' && c.resolveCostPoint(data[n][i])){
							$('span[name='+key+'_dec]').removeClass("dec");
							$('span[name='+key+'_inc]').removeClass("inc");
						}
						if(data[n][i].type1 == '青罗' && c.resolveCostPoint(data[n][i])){
							$('span[name='+key+'_dec]').removeClass("dec");
							$('span[name='+key+'_inc]').removeClass("inc");
						}
					
						if(typeof(data[n][i].childs) !='undefined' && data[n][i].childs.length > 0){
							var childs = data[n][i].childs;
							var d;
							for(var k in childs){
								d = childs[k];
								if(data[n][d].add == 0 && data[n][d].parentLevel <= data[n][i].add ){
									key = 'skill_'+n+'_'+d;
									$('div[name='+name+'_'+n+']').find('div[key='+key+']').css('opacity','1');
									$('span[name='+key+'_inc]').addClass("inc");
									data[n][d]['look'] = 1;
								}
							}
						}
					}
					else{
						if(data[n][i].parentName == ''){
							$('div[name='+name+'_'+n+']').find('div[key='+key+']').css('opacity','1');
							$('span[name='+key+'_inc]').addClass("inc");
							data[n][i]['look'] = 1;
						}
					}
				}
				
			}

			if(n<skillNeed.length-1){
				if(skill_cost[n] >= skillNeed[n+1]){
					var m = n+1;
					for(var k in data[m]){
						if(c.isShow(name,m,k)){
							key = name+'_'+m+'_'+k;
							$('div[name='+name+'_'+m+']').find('div[key='+name+'_'+m+'_'+k+']').css('opacity','1');
							$('span[name='+key+'_inc]').addClass("inc");
							data[m][k]['look'] = 1;
						}
					}
				}
			}
		}
	}
	c.setParamTianshu = function(){
		if(typeof(tianshu) != 'undefined'){
			var data = tianshu; 
			var name = 'tianshu';
			var key;
			if(level == 0) return false;
			for(var n in data){
				for(var i in data[n]){
					data[n][i].add = parseInt(data[n][i].add);
					key = 'tianshu_'+n+'_'+i;
					if(data[n][i].add > 0){
						deityCost = deityCost + data[n][i].add;
						deity_cost[n] = deity_cost[n] + data[n][i].add;
						data[n][i]['look'] = 1;
						if(data[n][i].rightshow == 1)c.rightShow('tianshu',n,i);
						$('div[name='+name+'_'+n+']').find('div[key='+key+']').find('b').html(data[n][i].add);
						$('div[name='+name+'_'+n+']').find('div[key='+key+']').css('opacity','1');
						if(data[n][i].add == data[n][i].max){
							$('span[name='+key+'_dec]').addClass("dec");
						}else{
							$('span[name='+key+'_dec]').addClass("dec");
							$('span[name='+key+'_inc]').addClass("inc");
						}
						if(typeof(data[n][i].childs) !='undefined' && data[n][i].childs.length > 0){
							var childs = data[n][i].childs;
							var d;
							for(var k in childs){
								d = childs[k];
								if(data[n][d].add == 0 && data[n][d].parentLevel <= data[n][i].add ){
									key = 'tianshu_'+n+'_'+d;
									$('div[name='+name+'_'+n+']').find('div[key='+key+']').css('opacity','1');
									$('span[name='+key+'_inc]').addClass('inc');
									data[n][d]['look'] = 1;
								}
							}
						}
					}
					else{
						if(data[n][i].parentName == ''){
							$('div[name='+name+'_'+n+']').find('div[key='+key+']').css('opacity','1');
							$('span[name='+key+'_inc]').addClass("inc");
							data[n][i]['look'] = 1;
						}
					}
				}
			}
		}
	}

	c.start  = function(skill_count,deity_count,personLevel){
		skillCount = parseInt(skill_count);
		deityCount = parseInt(deity_count);
		level = parseInt(personLevel);
		skill_cost = new Array(0,0,0,0,0,0,0);
		sCost = 0;
		deityCost = 0;
		skillRemain = skillCount;
		deityRemain = deityCount;
		c.startSkill();
		c.startTianshu();
	}
	c.startSkill = function(){
		if(level > 0 && skillCount> 0 && typeof(skill) != 'undefined'){
			var data = skill;
			var name = 'skill';
			var key;
			for(var i in data[0]){
				if(data[0][i].parentName == ''){
					key = 'skill_0_'+i;
					$('div[name='+name+'_'+'0]').find('div[key='+key+']').css('opacity','1');
					$('span[name='+key+'_inc]').addClass("inc");
					data[0][i]['look'] = 1;
				}
			}
		}
	}
	c.startTianshu = function(){
		if(level > 0 && skillCount> 0 && typeof(tianshu) != 'undefined'){
			var data = tianshu;
			var name = 'tianshu';
			var key = '';
			for(var n in data){
				for(var i in data[n]){
					if(data[n][i].parentName == ''){
						key = 'tianshu_'+n+'_'+i;
						$('div[name='+name+'_'+n+']').find('div[key='+key+']').css('opacity','1');
						$('span[name='+key+'_inc]').addClass("inc");
						data[n][i]['look'] = 1;
					}
				}
			}
		}
	}

	c.reset = function(){
		// skillCount = 0;
		// deityCount = 0;
		// level = 0;
		// sCost = 0;
		// deityCost = 0;
		// skillRemain = 0;
		// deityRemain = 0;
		c.resetSkill();
		c.resetTianshu();
	}
	c.resetSkill = function(){
		if(typeof(skill) != 'undefined'){
			var data = skill;
			var name = 'skill';
			var key;
			var close = 10;
			for(var n in data){
				if(n == close) break;
				if(skill_cost[n] == 0) close = n+1;
				for(var i in data[n]){
					if(data[n][i]['look'] == 1){
						data[n][i]['look'] = 0;
						skill_cost[n] = skill_cost[n] - data[n][i].add;
						data[n][i].add = 0;
						key = 'skill_'+n+'_'+i;
						
						$('div[name='+name+'_'+n+']').find('div[key='+key+']').css('opacity','0.5');
						$('div[name='+name+'_'+n+']').find('div[key='+key+']').find('b').html('0');
						$('span[name='+key+'_dec]').removeClass('dec');
						$('span[name='+key+'_inc]').removeClass('inc');
						c.rightClose('skill',n,i);
					}
				}
			}
		}
	}
	c.resetTianshu = function(){
		if(typeof(tianshu) != 'undefined'){
			var data = tianshu;
			var name = 'tianshu';
			var key;
			var close;
			for(var n in data){
				if(n == close) break;
				if(deity_cost[n] == 0) close = n+1;
				for(var i in data[n]){
					if(data[n][i]['look'] == 1){
						data[n][i]['look'] = 0;
						deityCost = deityCost - data[n][i].add;
						deity_cost[n] = deity_cost[n] - data[n][i].add;
						data[n][i].add = 0;
						
						key = 'tianshu_'+n+'_'+i;
						$('div[name='+name+'_'+n+']').find('div[key='+key+']').css('opacity','0.5');
						$('div[name='+name+'_'+n+']').find('div[key='+key+']').find('b').html('0');
						$('span[name='+key+'_dec]').removeClass("dec");
						$('span[name='+key+'_inc]').removeClass("inc");
						c.rightClose('tianshu',n,i);
					}
				}
			}
		}
	}

	c.addSkill = function(e,key){
		if(key != null && key != ''){
			str=key.split("_");
			if(str[0] != null && str[0] !='') var name = str[0];
			else return false;
			if(str[0] == 'skill')var  data = skill;
			else return false;
			var n = parseInt(str[1]);
			var i = parseInt(str[2]);
			if(sCost >= skillCount){
				common_show_err(e,'技能点不足');
				return false;
			}
			if(!c.isShow('skill',n,i)){
				return false;
			}
			var span_name = name+'_'+n+'_'+i;
			if(typeof(data[n][i]) != 'undefined' && data[n][i].add < parseInt(data[n][i].max))	{//&& c.isShow(name,n,i)去掉，让可加的时候页面才有加号
				var add = data[n][i].add;
				if(c.resolveStudyCondition(e,data[n][i])){
					skill_cost[n] = skill_cost[n]+1;
					sCost = sCost + 1;
					skillRemain = skillRemain-1;
					data[n][i].add  = data[n][i].add+1; 
					add = parseInt(data[n][i].add);
					$('#curSkill').html(skillRemain);
					$('div[name='+name+'_'+n+']').find('div[key='+name+'_'+n+'_'+i+']').find('b').html(add);
					$('div[key=jnvalue]').html('本重已加点：'+skill_cost[n]);
					data[n][i]['look'] = 1;
					c.rightShow('skill',n,i);
				}
				if(data[n][i].add >0){
					// $('span.dec[key='+name+'_'+n+'_'+i+']').css('display','block');
					$('span[name='+span_name+'_dec]').addClass("dec");
				}
			}
			if(data[n][i].add == parseInt(data[n][i].max)){
				// $('span.inc[key='+name+'_'+n+'_'+i+']').css('display','none');
				$('span[name='+span_name+'_inc]').removeClass("inc");
			}
			
			if(typeof(data[n][i].childs) != 'undefined' && data[n][i].childs.length > 0){
				var childs = data[n][i].childs;
				var d = '';
				for(var k in childs){
					d = childs[k];
					if(c.isShow(name,n,d)){
						if(data[n][d].type1=='太昊' && c.resolveCostPoint(data[n][d])){
							skill[n][d].costPoint = 0;
							// skill_cost[n] = skill_cost[n] + data[n][i].add - data[n][d].add;
							data[n][d].add = data[n][i].add;
							// $('div[key=jnvalue]').html('本重已加点：'+skill_cost[n]);
							$('div[name='+name+'_'+n+']').find('div[key='+name+'_'+n+'_'+d+']').find('b').html(data[n][d].add);
							$('div[name='+name+'_'+n+']').find('div[key='+name+'_'+n+'_'+d+']').css('opacity','1');
						}
						else if(data[n][d].type1=='青罗' && c.resolveCostPoint(data[n][d])){
							skill[n][d].costPoint = 0;
							// skill_cost[n] = skill_cost[n] + data[n][i].add - data[n][d].add;
							data[n][d].add = data[n][i].add;
							// $('div[key=jnvalue]').html('本重已加点：'+skill_cost[n]);
							$('div[name='+name+'_'+n+']').find('div[key='+name+'_'+n+'_'+d+']').find('b').html(data[n][d].add);
							$('div[name='+name+'_'+n+']').find('div[key='+name+'_'+n+'_'+d+']').css('opacity','1');
						}
						else if(data[n][d]['look'] == 0){
							$('div[name='+name+'_'+n+']').find('div[key='+name+'_'+n+'_'+d+']').css('opacity','1');
							// $('span.inc[key='+name+'_'+n+'_'+d+']').css('display','block');
							$('span[name='+name+'_'+n+'_'+d+'_inc]').addClass("inc");
						}
						data[n][d]['look'] = 1;
					}
				}
			}
			if(skill_cost[n] == skillNeed[n+1] || (skill[n][i].type1=='太昊' && skill_cost[n] > (skillNeed[n+1]+1))){
				var m = n+1;
				for(var k in data[m]){
					if(c.isShow(name,m,k)){
						$('div[name='+name+'_'+m+']').find('div[key='+name+'_'+m+'_'+k+']').css('opacity','1');
						// $('span.inc[key='+name+'_'+m+'_'+k+']').css('display','block');
						$('span[name='+name+'_'+m+'_'+k+'_inc]').addClass("inc");
						data[m][k]['look'] = 1;
					}
				}
			}
			if(skill_cost[n] == skillNeed[n+1] || (skill[n][i].type1=='青罗' && skill_cost[n] > (skillNeed[n+1]+1))){
				var m = n+1;
				for(var k in data[m]){
					if(c.isShow(name,m,k)){
						$('div[name='+name+'_'+m+']').find('div[key='+name+'_'+m+'_'+k+']').css('opacity','1');
						// $('span.inc[key='+name+'_'+m+'_'+k+']').css('display','block');
						$('span[name='+name+'_'+m+'_'+k+'_inc]').addClass("inc");
						data[m][k]['look'] = 1;
					}
				}
			}
		}
	}
	c.addTianshu = function(e,key){
		if(key != null && key != ''){
			var str=key.split("_");
			if(str[0] != null && str[0] !='' && str[0] == 'tianshu') {
				var name = str[0];
				var  data =tianshu;
			}
			else return false;
			var n = parseInt(str[1]);
			var i = parseInt(str[2]);
			if(deityCost >= deityCount){
				common_show_err(e,'仙缘点不足');
				return false;
			}
			if(typeof(data[n][i]) != 'undefined' && data[n][i].add < data[n][i].max)	{ //&& c.isShow(name,n,i) 
				var add = data[n][i].add;
				if(c.resolveStudyCondition(e,data[n][i])){
					deityCost = deityCost+1;
					deity_cost[n] = deity_cost[n] + 1;
					deityRemain = deityRemain - 1;
					data[n][i].add  = data[n][i].add+1; 
					$('#curTianshu').html(deityRemain);
					$('div[name='+name+'_'+n+']').find('div[key='+name+'_'+n+'_'+i+']').find('b').html(data[n][i].add);
					$('div[key=xyvalue]').html('本天书已加点：'+deity_cost[n]);
					c.rightShow('tianshu',n,i);
					data[n][i]['look'] = 1;
				}
				if(data[n][i].add >0){
					// $('span.dec[key='+name+'_'+n+'_'+i+']').css('display','block');
					$('span[name='+name+'_'+n+'_'+i+'_dec]').addClass("dec");
				}
				
			}
			if(data[n][i].add == data[n][i].max){
					// $('span.inc[key='+name+'_'+n+'_'+i+']').css('display','none');
					$('span[name='+name+'_'+n+'_'+i+'_inc]').removeClass("inc");
			}
			if(typeof(data[n][i].childs) != 'undefined' && data[n][i].childs.length > 0){
				var childs = data[n][i].childs;
				var d = '';
				for(var k in childs){
					d = childs[k];
					if(data[n][d]['look'] == 0 && c.isShow(name,n,d)){
						$('div[name='+name+'_'+n+']').find('div[key='+name+'_'+n+'_'+d+']').css('opacity','1');
						// $('span.inc[key='+name+'_'+n+'_'+d+']').css('display','block');
						$('span[name='+name+'_'+n+'_'+d+'_inc]').addClass("inc");
						data[n][d]['look'] = 1;
					}
				}
			}
		}
	}
	/**********
	*向右显示
	*
	**********/
	c.rightShow = function(type,n,k){
		if(type == 'skill'){ 
			var data = skill[n][k];
			if(data.auto == '主动') {var right = skillRightZD;var ul = 'zd';}
			else {
				if(data.auto == '被动'){var right = skillRightBD;var ul = 'bd';}
				else return true;
			}
		}
		else { if(type == 'tianshu'){ var data = tianshu[n][k]; var right = tianshuRight;var ul = 'ts';}
			   else return false;
		}
		if(typeof(data) == 'object'){
			if(data.add <=0 || data.rightshow == 0 ) return true;
			var skillkey = ''+n+'_'+k;
			var length = right.length;
			var add = 51;
			for(var i=0;i<length;i++){
				if(right[i] == skillkey){
					return true;
				}
			}
			for(var i=0;i<length;i++){
				if(right[i] == null || right[i] == ''){
					right[i] = skillkey;
					add = i;
					break;
				}
			}
			n = parseInt(n);
			if(add==51) return false;
			var key = 'li[key='+(add+1)+']';
			if(ul == 'zd'){
				skillRightZD[add] = skillkey;
				$('ul[key=zd]').find(key).html('<img alt="'+data.name+'" src="'+data.img+'" />');
			}
			if(ul == 'bd'){
				skillRightBD[add] = skillkey;
				$('ul[key=bd]').find(key).html('<img alt="'+data.name+'" src="'+data.img+'" />');
			}
			if(ul == 'ts'){
				tianshuRight[add] = skillkey;
				$('ul[key=ts]').find(key).html('<img alt="'+data.name+'" src="'+data.img+'" />');
			}
		}
	}
	/**********
	*向右关闭显示
	*
	**********/
	c.rightClose = function(type,n,k){
		if(type == 'skill'){ 
			var data = skill[n][k];
			if(data.auto == '主动') {var right = skillRightZD;var ul = 'zd';}
			else {
				if(data.auto == '被动'){var right = skillRightBD;var ul = 'bd';}
				else return true;
			}
		}
		else { if(type == 'tianshu'){ var data = tianshu[n][k]; var right = tianshuRight;var ul = 'ts';}
			   else return false;
		}
		if(data.add >0) return true;
		var k = ''+n+'_'+k;
		var length = right.length;
		var del = 50;
		for(var i=0;i<length;i++){
			if(right[i] == k){
				del = i;
				break;
			}
		}
		if(del==50) return false;
		var key = 'li[key='+(del+1)+']';
		if(ul == 'zd'){
			skillRightZD[del] = '';
			$('ul[key=zd]').find(key).html('');
		}
		if(ul == 'bd'){
			skillRightBD[del] = '';
			$('ul[key=bd]').find(key).html('');
		}
		if(ul == 'ts'){
			tianshuRight[del] = '';
			$('ul[key=ts]').find(key).html('');
		}
	}
	
	
	
	
	
	/**********
	*判断学习等级是否达到
	*author: xiaoyin
	**********/
	c.resolveStudyCondition = function(e,data){
		if(typeof(data) != 'object')		return false;
		if(data.studyCondition == '') return true;
		 var value = data.studyCondition.match(/{(([0-9.%]+),?)+}/g);
		 var studyCondition = Array();
		 var add = parseInt(data.add);
		 for(var k=0;k<value.length;k++){
			value[k] = value[k].split('{')[1];
			value[k] = value[k].split('}')[0];
			studyCondition = value[k].split(',');
		 }
		 var rlevel = parseInt(level);
		 studyCondition[add] = parseInt(studyCondition[add]);
		 if(studyCondition[add] > level){
			common_show_err(e,'学习等级未达到');
			return false;
		}
		 else return true;
	}
	/**********
	*判断消耗技能是否为0
	*author: xiaoyin
	**********/
	c.resolveCostPoint = function(data){
		if(typeof(data) != 'object')		return false;
		if(data.costPoint == 0) return true;
		 var value = data.costPoint.match(/{(([0-9.%]+),?)+}/g);
		 var costPoint = Array();
		 for(var k=0;k<value.length;k++){
			value[k] = value[k].split('{')[1];
			value[k] = value[k].split('}')[0];
			costPoint = value[k].split(',');
		 }
		 if(costPoint[0]==0)
			return true;
		else return false;
	}
	
	/**********
	*点击减键 param: skill_0_1
	*author: xiaoyin
	**********/
	c.delSkill = function(key){
		if(key != null && key != ''){
			var str=key.split("_");
			if(str[0] != null && str[0] !='' && str[0] == 'skill'){
				var name = str[0];
				var data = skill;
			} 
			else return false;
			var n = parseInt(str[1]);
			var i = parseInt(str[2]);
			if(typeof(data[n][i]) != 'undefined' && data[n][i].add >0)	{
				data[n][i].add  = data[n][i].add-1; 
				skill_cost[n] = skill_cost[n]-1;
				sCost = sCost-1;
				skillRemain = skillRemain + 1;
				var num = data[n][i].add;
				if(num==0) num='0';
				$('#curSkill').html(skillRemain);
				$('div[name='+name+'_'+n+']').find('div[key='+name+'_'+n+'_'+i+']').find('b').html(num);
				$('div[key=jnvalue]').html('本重已加点：'+skill_cost[n]);
				c.rightClose('skill',n,i);
				if(data[n][i].add == 0){
					data[n][i]['look'] = 0;
					// $('span.dec[key='+name+'_'+n+'_'+i+']').css('display','none');
					$('span[name='+name+'_'+n+'_'+i+'_dec]').removeClass("dec");
				}
				if(data[n][i].add < data[n][i].max){
					// $('span.inc[key='+name+'_'+n+'_'+i+']').css('display','block');
					$('span[name='+name+'_'+n+'_'+i+'_inc]').addClass("inc");
				}
			}
			
			if(typeof(data[n][i].childs) != 'undefined' && data[n][i].childs.length > 0){
				if(typeof(data[n][i].type1 == '太昊')){
					c.delChildTH(name,n,i);
				}
				c.delChild(name,n,i);
			}
			if(typeof(skillNeed[n+1]) != 'undefined'){
				var m = n+1;
				if(skill_cost[n] < skillNeed[n+1] && skill_cost[n+1]>0){
					c.delCont(name,n+1);
				}
/*
				var cont_child =  skill_no_parent[m][0];
				if(skill[m][cont_child]['look'] == 1){
					var k = '';
					var g = '';
					for(var cc in skill_no_parent[m]){
						g = skill_no_parent[m][cc];
						k = 'skill_'+m+'_'+g;
						$('div[name='+name+'_'+m+']').find('div[key='+k+']').css('opacity','0.5');
						$('span[name='+k+'_inc]').removeClass("inc");
						$('span[name='+k+'_dec]').removeClass("dec");
					}
				}
				*/
			}
		}
	}
	c.delTianshu = function(key){
		if(key != null && key != ''){
			var str=key.split("_");
			if(str[0] != null && str[0] !='') var name = str[0];
			else return false;
			if(str[0] == 'tianshu') var data =tianshu;
			else return false;
			var n = parseInt(str[1]);
			var i = parseInt(str[2]);
			if(typeof(data[n][i]) != 'undefined' && data[n][i].add >0)	{
				data[n][i].add  = data[n][i].add-1; 
				deityCost = deityCost-1;
				deity_cost[n] = deity_cost[n] - 1;
				deityRemain = deityRemain + 1;
				var num = data[n][i].add;
				if(num==0) num='0';
				$('#curTianshu').html(deityRemain);
				$('div[name='+name+'_'+n+']').find('div[key='+name+'_'+n+'_'+i+']').find('b').html(num);
				$('div[key=xyvalue]').html('本天书已加点：'+deity_cost[n]);
				c.rightClose('tianshu',n,i);
				if(data[n][i].add == 0){
					data[n][i]['look'] = 0;
					// $('span.dec[key='+name+'_'+n+'_'+i+']').css('display','none');
					$('span[name='+name+'_'+n+'_'+i+'_dec]').removeClass("dec");
				}
				if(data[n][i].add < data[n][i].max){
					// $('span.inc[key='+name+'_'+n+'_'+i+']').css('display','block');
					$('span[name='+name+'_'+n+'_'+i+'_inc]').addClass("inc");
				}
			}
			if(typeof(data[n][i].childs) != 'undefined' && data[n][i].childs.length > 0){
				c.delChild(name,n,i);
			}
		}
	}
	c.delChild = function(type,n,i){
		if(typeof(type) == 'undefined') return false;
		if(type == 'tianshu') var data = tianshu;
		else data = skill;
		var name = type;
		var childs = data[n][i].childs;
		var d = '';
		var key;
		
		for(var k in childs){
			d = childs[k];
			if(data[n][d].parentLevel > data[n][i].add){
				if(data[n][d].add>0){
					if(type == 'skill'){
						skill_cost[n] = skill_cost[n]-data[n][d].add;
						if(data[n][d].costPoint != 0){
							sCost = sCost - data[n][d].add;
							skillRemain = skillRemain + data[n][d].add;
							$('#curSkill').html(skillRemain);
						}
						if(page == n)$('div[key=jnvalue]').html('本重已加点：'+skill_cost[n]);
					}else{
						deityCost = deityCost-data[n][d].add;
						deity_cost[n] = deity_cost[n] - data[n][d].add;
						deityRemain = deityRemain + data[n][d].add;
						$('#curTianshu').html(deityRemain);
						$('div[key=xyvalue]').html('本天书已加点：'+deity_cost[n]);
					}
					data[n][d].add = 0;
					data[n][d]['look'] = 0; 
					c.rightClose(name,n,d);
					if(typeof(data[n][d].childs) != 'undefined' && data[n][d].childs.length > 0){
						c.delChild(type,n,d);
					}
				}
				else{
					data[n][d]['look'] = 0;
				}
				key = name+'_'+n+'_'+d;
				$('div[name='+name+'_'+n+']').find('div[key='+key+']').find('b').html('0');
				$('div[name='+name+'_'+n+']').find('div[key='+key+']').css('opacity','0.5');
				$('span[name='+key+'_inc]').removeClass("inc");
				$('span[name='+key+'_dec]').removeClass("dec");
			}
		}
		return true;;
	}
	c.delChildTH = function(type,n,i){
		if(type != 'skill') return false;
		data = skill;
		var name = type;
		var childs = data[n][i].childs;
		var d = '';
		var key;
		var del;
		for(var k in childs){
			d = childs[k];
			if(data[n][d]['look']==1 && data[n][d].costPoint == 0){
				del = data[n][d].add - data[n][i].add;
				// skill_cost[n] = skill_cost[n]-del;
				data[n][d].add = data[n][i].add;
				// if(page == n)$('div[key=jnvalue]').html('本重已加点：'+skill_cost[n]);
			}
			key = name+'_'+n+'_'+d;
			$('div[name='+name+'_'+n+']').find('div[key='+key+']').find('b').html(data[n][d].add);
		}
		return true;;
	}
	c.delCont = function(type,n){
		var data  = new Array();
		if(typeof(type) == 'undefined') return false;
		if(type == 'tianshu' && typeof(tianshu[n]) != 'undefined') data = tianshu;
		else{ 
			if(typeof(skill[n]) != 'undefined') data = skill;
			else return false;
		} 
		
		var name = type;
	
		for(var d in data[n]){
			if(data[n][d].look == 1 && data[n][d].parentName == ''){
				if(data[n][d].add > 0){
					skill_cost[n] = skill_cost[n] - data[n][d].add;
					sCost = sCost - data[n][d].add;
					skillRemain = skillRemain + data[n][d].add;
					data[n][d]['look'] = 0;
					data[n][d].add = 0;
					$('#curSkill').html(skillRemain);
					c.rightClose('skill',n,d);
					if(typeof(data[n][d].childs) != 'undefined' && data[n][d].childs.length > 0){
						c.delChild(name,n,d);
					}
				}
				else{
					data[n][d]['look'] = 0;
				}
				$('div[name='+name+'_'+n+']').find('div[key='+name+'_'+n+'_'+d+']').find('b').html('0');
				$('div[name='+name+'_'+n+']').find('div[key='+name+'_'+n+'_'+d+']').css('opacity','0.5');		
				// $('span[key='+name+'_'+n+'_'+d+']').css('display','none');
				$('span[name='+name+'_'+n+'_'+d+'_dec]').removeClass("dec");
				$('span[name='+name+'_'+n+'_'+d+'_inc]').removeClass("inc");
			}
		}
		if(typeof(skill_cost[n+1]) != 'undefined' && skill_cost[n+1]>0)
			c.delCont(type,n+1)
	}
	
	
	
	/**********
	*上一页
	*@params type
	**********/
	c.up = function(){
		if(typeof(type) == 'undefined' || type == null || type=='') type='skill';
		var old_name = type+"_"+page;
		var find = '.'+skillName[page]+'[name='+old_name+']';
		if(page<=0) page = skillNeed.length-1;
		else page = page-1;
		var name = skill[page][1].type1+skill[page][1].type2;
		$('h3#skill_name').html(name);
		$('#con_left').find(find).css('display','none');
		var new_name = type+"_"+page;
		find = '.'+skillName[page]+'[name='+new_name+']';
		$('#con_left').find(find).css('display','block');
		$('div[key=jnvalue]').html('本重已加点：'+skill_cost[page]);
	}

	
	/**********
	*下一页
	*@params type
	**********/
	c.down = function(){
		if(typeof(type) == 'undefined' || type == null || type=='') type='skill';
		
		var find = '.'+skillName[page]+'[style!="display:none"]';
		
		if(page >= skillNeed.length-1) page = 0;
		else page = page+1;
		var name = skill[page][1].type1+skill[page][1].type2;
		$('#con_left').find(find).hide();
		
		var new_name = type+"_"+page;
		find = '.'+skillName[page]+'[name='+new_name+']';
		$('#skill_name').html(name);
		$('#con_left').find(find).css('display','block');
		$('div[key=jnvalue]').html('本重已加点：'+skill_cost[page]);
	}

	c.showLeft = function(){
		var li_1 = '';
		var li_2 = '';
		var li_3 = '';
		for(var i=1;i<=49;i++){
			li_1 += '<li key="'+i+'"></li>';
			if(i<=14)
				li_2 += '<li key="'+i+'"></li>';
			if(i<=7)
				li_3 += '<li key="'+i+'"></li>';
		}
		$('ul[key=zd]').html(li_1);
		$('ul[key=bd]').html(li_2);
		$('ul[key=ts]').html(li_3);
	}
	
	/***************************辅助方法****************************/
	/**********
	*判断是否显示
	*author: xiaoyin
	**********/
	c.isShow = function(type,n,i){
		var data = new Array();
		if(type=='tianshu') data = tianshu;
		else {
			if(type == 'skill' && typeof(skillNeed[n]) != 'undefined') data = skill;
			else return false;
		}
		var parentLevel=0;
		var parentName ='';
		var j = 100;
		if(typeof(data[n][i]) != 'undefined'){
			if(type == 'skill' && n>0 && skillNeed[n] > skill_cost[n-1]) return false;
			if(data[n][i].parentName == '') return true;
			else{
				parentLevel = data[n][i].parentLevel;
				j = data[n][i].parent;
				if(j == 100) return true;
				var add = parseInt(data[n][j].add);
				if(add>= parentLevel) return true;
				else{ 
					return false;
				}
			}
		}
	}
	
	

	
})($);