
/****************************
*以下是门派技能的操作函数，方法在完成代码的时候会有更改
*
*****************************/
(function(){
	zhaoHuaController = function(){}
	
	var z = zhaoHuaController.prototype;
	var zhaohuaCount = 0;    //造化总值
	var zhaohuaCost = 0;	//造化花费值
	var zhaohuaRemain = 0; //剩余造化值
	var level = 0;
	var choice = 3;   //造化选择加点
	var zhaohuaClass = new Array('daoshu','mojie','fofa');
	var zhaohuaCClass = new Array('ds ds','mj mj','ff ff');
	var open_relate_intro = false;
	z.getCamp = function(){
		return choice;
	}
	z.initView = function(){
		if(typeof(zhaohua_class) == 'object') zhaohuaClass = zhaohua_class;
		if(typeof(zhaohua_child_class) == 'object') zhaohuaCClass = zhaohua_child_class;
		open_relate_intro = $("#isrelate").is(":checked");
		$("#isrelate").click(function(){
			open_relate_intro = $(this).is(":checked");
		})
		zhaohuaCost = 0;
		if(typeof(zhaohua) == 'undefined' || typeof(zhaohuaTY) == 'undefined' || typeof(zhaohuaMP) == 'undefined') return false;
		z.initZaohua();
		z.showDeclareCard();
		z.initClick();
	}
	z.initZaohua = function(){
		var data = zhaohua;
		var tydata = zhaohuaTY;
		var mpdata = zhaohuaMP;
		var key;
		var childs;
		var html='';
		var html1 = '';
		var html2 = '';
		var style = 'style ="filter: Alpha(opacity=50);-moz-opacity:.1;opacity:0.5"';
		var dec = 'style="display:none;"';
		var inc = 'style="display:none;"';
		var zhclass = Array('daoshu-bd','fofa-bd','mojie-bd');
		var name = Array('zhaohua','tongyong','menpai');
		for(var n in data){
			html='';
			html1 = '';
			html2 = '';
			n = parseInt(n);
			for(var i in data[n]){
				data[n][i].add = 0;
				z.resolveCostPoint(data[n][i]);
				key = 'zhaohua_'+n+'_'+i;
				data[n][i]['look'] = 0;
				if(i<10) j='0'+i; else j=i;
				html +='<div class="'+zhaohuaCClass[n]+j+'" key="zhaohua_'+n+'_'+i+'" '+style+'><div>'+
					   '<div name="zaohua" key="zhaohuaImg_'+n+'_'+i+'" style="width:42px;height:40px;padding-top:0px;margin:0px auto">' + //增加样式style="width:42px;height:40px;padding-top:0px;margin:0px auto"
					   '<img  src="'+data[n][i].img+'" alt="'+data[n][i].name+'"/></div>'+
					   '<b>'+data[n][i].add+'</b>'+
					   '<span '+dec+'  class="dec" name="'+key+'_inc" key="'+key+'" ></span>'+
					   '<span '+inc+'  class="inc" name="'+key+'_dec" key="'+key+'" ></span></div></div>';
				if(typeof(zhaohua[n][i].childs) != 'undefined' && zhaohua[n][i].childs != ''){  //分解child
					childs = zhaohua[n][i].childs;
					zhaohua[n][i].childs = childs.split(',');
				}else{
					zhaohua[n][i].childs = new Array();
				}
				if(zhaohua[n][i].parentLevel == '') zhaohua[n][i].parentLevel =0;
				else zhaohua[n][i].parentLevel = parseInt(zhaohua[n][i].parentLevel);
				if(zhaohua[n][i].parent == '') zhaohua[n][i].parent =100;
				else zhaohua[n][i].parent = parseInt(zhaohua[n][i].parent);
			}
			for(var i in tydata[n]){
				tydata[n][i].add = 0;
				key = 'tongyong_'+n+'_'+i;
				if(i<10) j='0'+i; else j=i;
				html1 +='<div class="ty ty'+j+'" key="tongyong_'+n+'_'+i+'" '+style+'><div>'+
					   '<div name="tongyong" key="zhaohuaImg_'+n+'_'+i+'" style="width:42px;height:40px;padding-top:0px;margin:0px auto">' + 
					   '<img  src="'+tydata[n][i].img+'" alt="'+tydata[n][i].name+'"/></div>'+
					   '<b>'+tydata[n][i].add+'</b>'+
					   '<span '+dec+'  class="dec"  key="'+key+'" ></span>'+
					   '<span '+inc+'  class="inc" key="'+key+'" ></span></div></div>';
			}
			for(var i in mpdata[n]){
				
				mpdata[n][i].add = 0;
				key = 'menpai_'+n+'_'+i;
				if(i<10) j='0'+i; else j=i;
				html2 +='<div class="mp mp'+j+'" key="menpai_'+n+'_'+i+'" '+style+'><div>'+
						'<div name="menpai" key="zhaohuaImg_'+n+'_'+i+'" style="width:42px;height:40px;padding-top:0px;margin:0px auto">' + 
					   '<img  src="'+mpdata[n][i].img+'" alt="'+mpdata[n][i].name+'"/></div>'+
					   '<b>'+mpdata[n][i].add+'</b>'+
					   '<span '+dec+'  class="dec"  key="'+key+'" ></span>'+
					   '<span '+inc+'  class="inc" key="'+key+'" ></span></div></div>';
			}
			var _class = '.'+zhclass[n];
			$(_class).find('.'+zhaohuaClass[n]).html(html);
			$(_class).find('.tongyong').attr('name','tongyong_'+n);
			$(_class).find('.menpai').attr('name','menpai_'+n);
			$(_class).find('div.tongyong').html(html1);
			$(_class).find('div.menpai').html(html2);
			$('span[key=zhvalue]').html('剩余造化值:0');
		}
		$('.daoshu-bd').find('.daoshu').attr('name','zhaohua_0');
		$('.mojie-bd').find('.mojie').attr('name','zhaohua_2');
		$('.fofa-bd').find('.fofa').attr('name','zhaohua_1');

	}
	z.initClick = function(){
		$('.inc').click(function(e){
			var key = $(this).attr('key');
			if(key == null || key == '') return false;
			var str=key.split("_");
			if(str[0] == 'zhaohua' || str[0] == 'tongyong' || str[0] == 'menpai' ) z.add(e,key);
		});
		$('.dec').click(function(e){
			var key = $(this).attr('key');
			if(key == null || key == '') return false;
			var str=key.split("_");
			if(str[0] == 'zhaohua' || str[0] == 'tongyong' || str[0] == 'menpai' ) z.del(e,key);
		});
	}
	z.setParam = function(zaohua_remain,personLevel){
		if(typeof(zaohua_remain) != 'undefined')
			zhaohuaRemain = parseInt(zaohua_remain);
		else zhaohuaRemain = 0;
		if(typeof(personLevel) != 'undefined')
			level = parseInt(personLevel);
		else level = 0;
		if(typeof(zhaohua) != 'undefined' && typeof(zhaohuaTY) != 'undefined' && typeof(zhaohuaMP) != 'undefined'){
			z.setParamZaohua();
			z.setZaohuaTY();
			z.setZaohuaMP();
		}
		zhaohuaCount = zhaohuaRemain + zhaohuaCost;
		$('span[key=zhvalue]').html('消耗造化值:'+zhaohuaCost);
	}
	z.setParamZaohua = function(){
		var data = zhaohua; 
		var name = 'zhaohua';
		var key;
		for(var n in data){
			for(var i in data[n]){
				if(level == 0) return false;
				key = 'zhaohua_'+n+'_'+i;
				data[n][i].add = parseInt(data[n][i].add);
				if(data[n][i].add > 0){
					data[n][i]['look'] = 1;
					if(typeof(data[n][i]['costPoints']) != 'undefined'){
						for(var del=0;del<data[n][i].add;del++){
							zhaohuaCost = zhaohuaCost + parseInt(data[n][i]['costPoints'][del]);
						}
					}
					$('div[name='+name+'_'+n+']').find('div[key='+key+']').find('b').html(data[n][i].add);
					$('div[name='+name+'_'+n+']').find('div[key='+key+']').css('opacity','1');
					if(data[n][i].add == data[n][i].max){
						$('span.dec[key='+name+'_'+n+'_'+i+']').css('display','block');
						$('span.inc[key='+name+'_'+n+'_'+i+']').css('display','none');
					}else{
						$('span.dec[key='+name+'_'+n+'_'+i+']').css('display','block');
						$('span.inc[key='+name+'_'+n+'_'+i+']').css('display','block');
					}
					if(typeof(data[n][i].childs) !='undefined' && data[n][i].childs.length > 0){
						var childs = data[n][i].childs;
						var d;
						for(var k in childs){
							d = childs[k];
							if(data[n][d].add == 0 && data[n][d].parentLevel <= data[n][i].add ){
								key = 'zhaohua_'+n+'_'+d;
								$('div[name='+name+'_'+n+']').find('div[key='+key+']').css('opacity','1');
								$('span.inc[key='+name+'_'+n+'_'+d+']').css('display','block');
								data[n][d]['look'] = 1;
							}
						}
					}
				}
				else{
					if(data[n][i].parentName == ''){
						$('div[name='+name+'_'+n+']').find('div[key='+key+']').css('opacity','1');
						$('span.inc[key='+name+'_'+n+'_'+i+']').css('display','block');
						data[n][i]['look'] = 1;
					}
				}
			}
		}
	}
	z.setZaohuaTY = function(){
		var data = zhaohuaTY; 
		var name = 'tongyong';
		var key;
		// var n = choice;
		for(var n in data){
			for(var i in data[n]){
				if(level == 0) return false;
				key = 'tongyong_'+n+'_'+i;
				data[n][i].add = parseInt(data[n][i].add);
				if(data[n][i].add > 0){
					data[n][i]['look'] = 1;
					if(typeof(data[n][i]['costPoints']) != 'undefined'){
						for(var del=0;del<data[n][i].add;del++){
							zhaohuaCost = zhaohuaCost + parseInt(data[n][i]['costPoints'][del]);
						}
					}
					$('div[key='+key+']').find('b').html(data[n][i].add);
					$('div[key='+key+']').css('opacity','1');
					if(data[n][i].add == data[n][i].max){
						$('span.dec[key='+key+']').css('display','block');
						$('span.inc[key='+key+']').css('display','none');
					}else{
						$('span.dec[key='+key+']').css('display','block');
						$('span.inc[key='+key+']').css('display','block');
					}
				}
				else{
					data[n][i]['look'] = 1;
					$('div[key='+key+']').css('opacity','1');
					$('span.inc[key='+key+']').css('display','block');
				}
			}
		}
	}
	z.setZaohuaMP = function(){
		var data = zhaohuaMP; 
		var name = 'menpai_';
		var key;
		// var n = choice;
		for(var n in data){
			for(var i in data[n]){
				if(level == 0) return false;
				key = 'menpai_'+n+'_'+i;
				data[n][i].add = parseInt(data[n][i].add);
				if(data[n][i].add > 0){
					data[n][i]['look'] = 1;
					if(typeof(data[n][i]['costPoints']) != 'undefined'){
						for(var del=0;del<data[n][i].add;del++){
							zhaohuaCost = zhaohuaCost + parseInt(data[n][i]['costPoints'][del]);
						}
					}
					$('div[key='+key+']').find('b').html(data[n][i].add);
					$('div[key='+key+']').css('opacity','1');
					if(data[n][i].add == data[n][i].max){
						$('span.dec[key='+key+']').css('display','block');
						$('span.inc[key='+key+']').css('display','none');
					}else{
						$('span.dec[key='+key+']').css('display','block');
						$('span.inc[key='+key+']').css('display','block');
					}
				}
				else{
					data[n][i]['look'] = 1;
					$('div[key='+key+']').css('opacity','1');
					$('.inc[key='+key+']').css('display','block');
				}
			}
		}
	}
	
	
	z.start = function(zhaohua_count,personLevel){
		if(typeof(zhaohua_count) != 'undefined')
			zhaohuaCount = parseInt(zhaohua_count);
		else zhaohuaCount = 0;
		if(typeof(personLevel) != 'undefined')
			level = parseInt(personLevel);
		else level = 0;
		zhaohuaCost = 0;
		zhaohuaRemain = zhaohuaCount;
		if(zhaohuaCount > 0 && level > 0 && typeof(zhaohua) != 'undefined' && typeof(zhaohuaTY) != 'undefined' && typeof(zhaohuaMP) != 'undefined'){
			z.startZaohua();
		}
	}
	z.startZaohua = function(){
		var data = zhaohua;
		var name = '';
		var key = '';
		var classD = new Array('zhaohua','tongyong','menpai');
		for(var cd in classD){
			if(classD[cd] == 'zhaohua') data = zhaohua;
			if(classD[cd] == 'tongyong') data = zhaohuaTY;
			if(classD[cd] == 'menpai') data = zhaohuaMP;
			name = classD[cd];
			for(var n in data){
				for(var i in data[n]){
					if(classD[cd] != 'zhaohua'){
						key = classD[cd]+'_'+n+'_'+i;
						$('div[key='+key+']').css('opacity','1');
						$('span.inc[key='+key+']').css('display','block');
						data[n][i]['look'] = 1;
					}
					else if(data[n][i].parentName == ''){
						key = classD[cd]+'_'+n+'_'+i;
						$('div[key='+key+']').css('opacity','1');
						$('span.inc[key='+key+']').css('display','block');
						data[n][i]['look'] = 1;
					}
				}
			}
		}
	}
	z.reset = function(){
		zhaohuaCount = 0;
		level = 0;
		zhaohuaCost = 0;
		zhaohuaRemain = 0;
		if(typeof(zhaohua) != 'undefined' && typeof(zhaohuaTY) != 'undefined' && typeof(zhaohuaMP) != 'undefined'){
			z.resetZaohua();
		}
		$('span[key=zhvalue]').html('消耗造化值:0');
	}
	z.resetZaohua = function(){
		var name;
		var key;
		var classD = new Array('zhaohua','tongyong','menpai');
		var data;
		for(var cd in classD){
			if(classD[cd] == 'zhaohua') data = zhaohua;
			if(classD[cd] == 'tongyong') data = zhaohuaTY;
			if(classD[cd] == 'menpai') data = zhaohuaMP;
			name = classD[cd];
			for(var n in data){
				for(var i in data[n]){
				if(data[n][i]['look'] == 1){
						data[n][i]['look'] = 0;
						data[n][i].add = 0;
						key = classD[cd]+'_'+n+'_'+i;
						$('div[name='+name+'_'+n+']').find('div[key='+key+']').css('opacity','0.5');
						$('div[name='+name+'_'+n+']').find('div[key='+key+']').find('b').html('0');
						$('span.inc[key='+key+']').css('display','none');
						$('span.dec[key='+key+']').css('display','none');
					}
				}	
			}
		}	
	}
	
	/**********
	*add
	*author: xiaoyin
	**********/
	z.add = function(e,key){
		if(key != null && key != ''){
			var str=key.split("_");
			var data = Array();
			if(str[0] != null && str[0] !='') var name = str[0];
			else return false;
			if(str[0] == 'zhaohua') data =zhaohua;
			else if(str[0] == 'tongyong') data =zhaohuaTY;
			else if(str[0] == 'menpai') data =zhaohuaMP;
			else return false;
			var n = parseInt(str[1]);
			var i = parseInt(str[2]);
			var costpoint = 0;
			if(zhaohuaCost >= zhaohuaCount){
				common_show_err(e,'造化值不足');
				return false;
			}
			if(typeof(data[n][i]) != 'undefined' && data[n][i].add < parseInt(data[n][i].max) && z.isShow(str[0],n,i)){
				choice = n;
				var add = data[n][i].add;
				if(z.resolveStudyCondition(e,data[n][i])){
					if(!(costpoint=z.resolveCostPoint(data[n][i]))){
						common_show_err(e,'消耗造化值不对应');
						return false;
					}
					costpoint = parseInt(costpoint);
					zhaohuaCost = parseInt(zhaohuaCost);
					if((zhaohuaCost + costpoint)> zhaohuaCount){
						common_show_err(e,'造化值不足');
						return false;
					}
					zhaohuaCost = zhaohuaCost + costpoint;
					zhaohuaRemain = zhaohuaRemain - costpoint;
					data[n][i].add  = data[n][i].add+1;
					$('div[name='+name+'_'+n+']').find('div[key='+name+'_'+n+'_'+i+']').find('b').html(data[n][i].add);
					$('span[key=zhvalue]').html('消耗造化值:'+zhaohuaCost);
					$('#curZaohua').html(zhaohuaRemain);
					if(data[n][i].add >0){
						$('span.dec[key='+name+'_'+n+'_'+i+']').css('display','block');
					}
					if(data[n][i].add == data[n][i].max){
						$('span.inc[key='+name+'_'+n+'_'+i+']').css('display','none');
					}
				}
				
			}
			if(name == 'zhaohua'){
				if(typeof(data[n][i].childs) != 'undefined' && data[n][i].childs.length > 0){
					var childs = data[n][i].childs;
					var d = '';
					for(var k in childs){
						d = childs[k];
						if(data[n][d]['look'] == 0 && z.isShow(name,n,d)){
							$('div[name='+name+'_'+n+']').find('div[key='+name+'_'+n+'_'+d+']').css('opacity','1');
							$('span.inc[key='+name+'_'+n+'_'+d+']').css('display','block');
							data[n][d]['look'] = 1;
						}
					}
				}
			}
		}
	}
	/**********
	*del
	*author: xiaoyin
	**********/
	z.del = function(e,key){
		if(key != null && key != ''){
			var str=key.split("_");
			var data = Array();
			if(str[0] != null && str[0] !='') var name = str[0];
			else return false;
			if(str[0] == 'zhaohua') data =zhaohua;
			else if(str[0] == 'tongyong') data = zhaohuaTY;
			else if(str[0] == 'menpai') data =zhaohuaMP;
			else return false;
			var n = parseInt(str[1]);
			var i = parseInt(str[2]);
			var costpoint = 0;
			if(typeof(data[n][i]) != 'undefined' && data[n][i].add >0)	{
				data[n][i].add  = data[n][i].add-1; 
				if(!(costpoint=z.resolveCostPoint(data[n][i]))){
					common_show_err(e,'消耗造化值不对应');
					data[n][i].add  = data[n][i].add+1; 
					return false;
				}
				costpoint  = parseInt(costpoint);
				if(zhaohuaCost<costpoint){
					common_show_err(e,'消耗造化值不正确')
					data[n][i].add  = data[n][i].add+1; 
					return false;
				}
				zhaohuaCost = zhaohuaCost - costpoint;
				zhaohuaRemain = zhaohuaRemain + costpoint;
				if(zhaohuaCost == 0) choice = 3;
				var num = data[n][i].add;
				if(num==0) num='0';
				$('div[name='+name+'_'+n+']').find('div[key='+name+'_'+n+'_'+i+']').find('b').html(num);
				$('span[key=zhvalue]').html('消耗造化值:'+zhaohuaCost);
				$('#curZaohua').html(zhaohuaRemain);
				if(data[n][i].add == 0){
					$('span.dec[key='+name+'_'+n+'_'+i+']').css('display','none');
				}
				if(data[n][i].add < data[n][i].max){
					$('span.inc[key='+name+'_'+n+'_'+i+']').css('display','block');
				}
			}
			
			if(name == 'zhaohua'){
				if(typeof(data[n][i].childs) != 'undefined' && data[n][i].childs.length > 0){
					z.delChild(name,n,i);
				}
			}
		}
	}
	z.delChild = function(type,n,i){
		if(type == 'zhaohua') var data = zhaohua;
		else return false;
		var name = type;
		var childs = data[n][i].childs;
		var d;
		var del;
		for(var k in childs){
			d = childs[k];
			if(data[n][d].parentLevel > data[n][i].add){
				if(data[n][d].add>0){
					del = data[n][d].add;
					for(del;del > 0;del--){
						data[n][d].add--;
						costpoint= z.resolveCostPoint(data[n][d]);
						zhaohuaCost = zhaohuaCost - costpoint;
						zhaohuaRemain = zhaohuaRemain + costpoint;
					}
					data[n][d]['look'] = 0; 
					$('span[key=zhvalue]').html('消耗造化值:'+zhaohuaCost);
					$('#curZaohua').html(zhaohuaRemain);
					if(typeof(data[n][d].childs) != 'undefined' && data[n][d].childs.length > 0){
						z.delChild(type,n,d);
					}
				}
				else{
					data[n][d]['look'] = 0;
				}
				$('div[name='+name+'_'+n+']').find('div[key='+name+'_'+n+'_'+d+']').find('b').html('0');
				$('div[name='+name+'_'+n+']').find('div[key='+name+'_'+n+'_'+d+']').css('opacity','0.5');
				$('span[key='+name+'_'+n+'_'+d+']').css('display','none');
			}
		}
		return true;;
	}
	/**********
	*分解造化消耗值
	*author: xiaoyin
	**********/
	z.resolveCostPoint = function(data){
		if(typeof(data) != 'object' && typeof(data.costPoint) == 'undefined') return false;
		if(data.costPoint == '') return true;
		var add = parseInt(data.add);
		if(typeof(data.costPoints) != 'undefined'){
			if(typeof(data.costPoints[add]) =='undefined')return false;
			else return data.costPoints[add];
		}
		var value = data.costPoint.match(/{(([0-9.%]),?)+}/g);
		var costPoint = Array();
		if(value == null) return false;
		for(var k=0;k<value.length;k++){
			value[k] = value[k].split('{')[1];
			value[k] = value[k].split('}')[0];
			costPoint = value[k].split(',');
		}
		data.costPoints = costPoint;
		if(typeof(costPoint[add]) =='undefined')return false;
		else return parseInt(costPoint[add]);
	}
	/**********
	*判断学习等级是否达到
	*author: xiaoyin
	**********/
	z.resolveStudyCondition = function(e,data){
		if(typeof(data) != 'object')		return false;
		if(data.studyCondition == '') return true;
		 var value = data.studyCondition.match(/{(([0-9.%]+),?)+}/g);
		 var studyCondition = Array();
		 var add = parseInt(data.add);
		 if(value == null) return false;
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
	*说明卡
	*author: xiaoyin
	**********/
	z.zhaohuaDeclareAll = function(){
		
	}
	z.zhaohuaDeclare = function(n,i){
		
	}
	z.resolve = function(data,i){
		// data = zhaohua[0][4].declare;
		// i = zhaohua[0][4].add;
		if(typeof(data) == 'undefined' || typeof(i) != 'number') return false;
		if(data== '') return true;
		var value = data.match(/{(([0-9.%]+),?)+}/g);
		var rv = Array();
		for(var k=0;k<value.length;k++){
			value[k] = value[k].split('{')[1];
			value[k] = value[k].split('}')[0];
			rv[k] = value[k].split(',');
			data = data.replace(/{(([0-9.%]+),?)+}/,rv[k][i]);
		}
		return data;
	}
	/**********
	*造化选择
	*author: xiaoyin
	**********/
	z.zhaohuaClick = function(num){
		if(typeof(num) == 'undefined') return false;
		num = parseInt(num); 
		if(num>2) return false;
		$('#con_right').find('.cont[style!="display:none"]').attr('style','display:none');
		$('#con_right').find('.cont[name=zhaohua_'+num+']').attr('style','display:block');
	}
	
	z.showDeclareCard = function(){
		var x = 10;  
		var y = 20;
		var selector = "div[key^=zhaohuaImg_]";
		var camp = '';
		var num = '';
		var Key = '';
		var name = '';
		var data = Array();
		$(selector).mouseover(function(e){
			//根据点击id得到相关数据
			name = $(this).attr("name");
			Key = $(this).attr("key");
			camp = Key.split("_")[1];//阵营
			num = Key.split("_")[2];//顺序
			var show_data = "<div class='skillOrBookData'>查无数据<\/div>";
			//如果打开关联，则显示关联数据
			x = 10;
			if(name == 'zaohua'){ 
				data = zhaohua;
			}
			if(name == 'tongyong') data = zhaohuaTY;
			if(name == 'menpai') data = zhaohuaMP;
			if(data[camp][num] != null){
				if(open_relate_intro && name != 'zaohua'){
					var tmp_given_add = data[camp][num].add;
					x = 0 - 300;
					show_data = "<div class='skillOrBookData'>道术：" + z.parsedataJson(data[0][num], tmp_given_add) + "<\/div>" +
								"<div class='skillOrBookData'>佛法：" + z.parsedataJson(data[1][num], tmp_given_add) + "<\/div>" +
								"<div class='skillOrBookData'>魔劫：" + z.parsedataJson(data[2][num], tmp_given_add) + "<\/div>" ;
					
				}else{
					show_data = "<div class='skillOrBookData'>" + z.parsedataJson(data[camp][num]) + "<\/div>";
				}
			}
			//创建数据显示div元素
			var zhaohuaDiv = "<div id='zhaohuaDiv'>" + show_data + "<\/div>";
			//追加到文档中
			
			$("body").append(zhaohuaDiv);
			
			$('div[key='+Key+'] img').attr('alt','');
			//显示
			if(x == 10){
				$("#zhaohuaDiv").css({
					"width": 200 + "px"
				})
			}
			$("#zhaohuaDiv").css({
				"top": (e.pageY + y) + "px",
				"left": (e.pageX + x) + "px"
			}).show("fast").find(".skillOrBookData").show("1000");
			
		}).mouseout(function(){
			$('div[key='+Key+']').find('img').attr('alt',data[camp][num].name);
			$("#zhaohuaDiv").remove();//移除
			
		}).mousemove(function(e){
			
			$("#zhaohuaDiv").css({
				"top": (e.pageY + y) + "px",
				"left": (e.pageX + x) + "px"//跟随光标移动
			})
		});
	}
	
	/***************************辅助方法****************************/
	z.parsedataJson = function(dataJson, given_add){
		
		if(dataJson == null || dataJson == undefined ){
			return "";
		}
		var add = dataJson.add;
		if(given_add != null && given_add >= 0){
			add = given_add;
		}
		var firstLine = dataJson['name'] + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color='#ffcb4a'>" + add + "/" + parseInt(dataJson['max']) + "</font><br />";
		var secondLine = "";
		var temp_secondLine1 = z.matchReplace(dataJson['common'],add)
		if(temp_secondLine1 == ""){
			secondLine = dataJson['common'] + "<br />";
			}
			else
			{
				secondLine = temp_secondLine1 + "<br />";
			}
		var thirdLine = "";
		var airCostL = "";
		if(add > 0){
			thirdLine = z.matchReplace(dataJson['declare'],add - 1) + "<br />";
		}	
		var temp_airCostL = z.matchReplace(dataJson['airCost'],add)
		if(temp_airCostL != ""){
				airCostL = "<br /><font color='#11aaff'>" + temp_airCostL + "&nbsp;真气</font>" + "<br />" ;
			}
			else if(temp_airCostL == "" && add > 0){
				airCostL = "<br />";
			}
			
		var fourthLine = "";
		var fifthLine = "";
		var sixthLine = "";
		var sevenLine = "";
		var parentLine = '';
		var studyCondition = '';
		var costPoint = '';
		var airCostN = "";
		if(dataJson['parentName'] != ''){
			parentLine = dataJson['parentName']+'达到'+dataJson['parentLevel']+'阶<br />';
		}
		if(add < dataJson['max']){
			fourthLine = "<br />下一阶：<br /><br />";
			fifthLine =  z.matchReplace(dataJson['declare'],add) + "<br />";
			sixthLine = "学习条件：<br />";
			if(z.matchReplace(dataJson['studyCondition'],add) != '') studyCondition = z.matchReplace(dataJson['studyCondition'],add) + "<br />" ;
			if(z.matchReplace(dataJson['costPoint'],add) != '' && dataJson['type2'] == "仙"){
				costPoint = "消耗道心："+z.matchReplace(dataJson['costPoint'],add)+ "<br />" ;
			}
			else if(z.matchReplace(dataJson['costPoint'],add) != '' && dataJson['type2'] == "魔"){
				costPoint = "消耗魔性："+z.matchReplace(dataJson['costPoint'],add)+ "<br />" ;
			}
			else if(z.matchReplace(dataJson['costPoint'],add) != '' && dataJson['type2'] == "佛"){
				costPoint = "消耗佛缘："+z.matchReplace(dataJson['costPoint'],add)+ "<br />" ;
			}
			if(z.matchReplace(dataJson['airCost'],add + 1) != '') airCostN = "<font color='#11aaff'> " + z.matchReplace(dataJson['airCost'],add + 1) + "&nbsp;真气</font>" + "<br />" ;
			sevenLine = studyCondition
						+ parentLine
						+ costPoint;
		}
		return firstLine + secondLine + airCostL + thirdLine + fourthLine + airCostN + fifthLine + sixthLine + sevenLine;
		
	}
	z.matchReplace = function(data,add){
		var value = Array();
		value = data.match(/{.*?}/g);
		if(value == '' || value == null) return 0;

		for(var i = 0; i < value.length; i++){
			value[i] = value[i].substring(1,value[i].length-1);
			var val = value[i].split(',');
			data = data.replace(/{.*?}/,val[add]);
		}
		return data;
	}
	z.isShow = function(type,n,i){
		if(type == 'zhaohua')
			var data = zhaohua;
		if(type == 'tongyong') 
			return true;
		if(type == 'menpai')
			return true;
		var parentLevel=0;
		var j = 100;
		if(typeof(data[n][i]) != 'undefined'){
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
	z.isShowTY = function(n,i){
		var data = zhaohuaTY;
		var parentLevel=0;
		var j = 100;
		if(typeof(data[n][i]) != 'undefined'){
			if(data[n][i].parentName == '') return true;
			else{
				parentName = data[n][i].parentName;
				parentLevel = data[n][i].parentLevel;
				if(data[n][i].parent != 100) j = data[n][i].parent;
				else{
					for(var k in data[n]){
						if(zhaohua[n][k].name == parentName){
							j=k;break;
						}
					}
					if(j != 100){
						if(typeof(zhaohua[n][j]) == 'undefined'){   //考虑数据出错的时候
							j = 100;
							data[n][i].parentName = '';
							data[n][i].parentLevel = '';
						}
						else{
							data[n][i].parent = j;
							if(typeof(zhaohua[n][j].childTY) != 'undefined') zhaohua[n][j].childTY.push(i);
							else {
								zhaohua[n][j].childTY = [i];
							}
						}
					}
				}
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