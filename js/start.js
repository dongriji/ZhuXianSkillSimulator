$(function(){
	var skillControl= new skillController();
	var zaohuaControl =  new zhaoHuaController();
	var fengshenControl = new fengShenControllor();	
	var dealURL = new DealURL();
	var inputControl = new inputController(skillControl,zaohuaControl,fengshenControl,dealURL);
	
	$('html,body' ).animate({scrollTop:0},0);
    //初始化面板
	skillControl.initView();
	zaohuaControl.initView();
	fengshenControl.initView();
	inputControl.initView();
	

    //分析URL
    var result = dealURL.analyseURL(); 
    //alert(result); 
    if(result==2){ //url中带有参数   
    	$('html').css('overflow','hidden');
		var $modal = '<div id="container"><div id="progress_bar" class="ui-progress-bar ui-container"> <div class="ui-progress" style="width: 79%;"> <span class="ui-label" style="display:none;">loading <b class="value">79%</b></span></div> </div></div>';
			$(this).overlay({
			effect: 'fade',
			opacity: 0.8,
			closeOnClick: false,
			onShow: function() {
				$('body').append($modal);
				$('#progress_bar .ui-progress .ui-label').hide();
				$('#progress_bar .ui-progress').css('width', '7%');
				  inputControl.setParam(); 
					var cur_pesonlevel = parseInt($("#personLevel").val()); //人物等级        	   
					var cur_fengshenlevel = parseInt($("#fengshenLevel").val());//封神等级              
					var cur_skill = parseInt($("#curSkill").text()); //剩余技能
					var cur_tianshu = parseInt($("#curTianshu").text()); //剩余天书
					var cur_yuanshen = parseInt($("#curYuanshen").text()); //剩余元神修为 
					var cur_zaohua = parseInt($("#curZaohua").text()); //造化值  
				  $('#progress_bar .ui-progress').animateProgress(20, function() {
						skillControl.setParam(cur_skill,cur_tianshu,cur_pesonlevel);
						$(this).animateProgress(35, function() {
						$(this).animateProgress(50, function() {
						   zaohuaControl.setParam(cur_zaohua,cur_pesonlevel); 
						  $(this).animateProgress(65, function() {
						  $(this).animateProgress(75, function() {
							  fengshenControl.setParam(cur_pesonlevel,cur_fengshenlevel,cur_yuanshen);
							  setTimeout(function() {
								$('#progress_bar .ui-progress').animateProgress(100, function() {
								 $('#container').remove();
								 $('html').css('overflow','scroll');
								 $('body').css('overflow','auto');
								 $('.overlay').remove();
								});
							  }, 2000);						
						});
						});
						});
					});
						
				  });
				
				}
			})   	
    }
    // else if(result==0){
    	// alert("出错了");
    // }else{
    	// alert("OK");
    // }

});