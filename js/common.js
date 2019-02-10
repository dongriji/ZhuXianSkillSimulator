function common_show_err(e, message){

	//创建数据显示div元素
	var errMessageDataDiv = "<div id='errMessageDataDiv'><div class='skillOrBookData'>" + message + "<\/div><\/div>";
	
	//追加到文档中
	$("body").append(errMessageDataDiv);
	
	$("#errMessageDataDiv").css({
		"top": (e.pageY - 3) + "px",
		"left": (e.pageX - 3) + "px"
	}).show(200)
	.find(".skillOrBookData").css({"text-align":"center","padding":"10px"})
	.show(200).mousemove(function(){
		$("#errMessageDataDiv").remove();
	})
	// .fadeIn("fast").fadeOut(2000,function(){
		// $("#errMessageDataDiv").remove();
	// })

}
$.fn.animateProgress = function(progress, callback) {    
    return this.each(function() {
      $(this).animate({
        width: progress+'%'
      }, {
        duration: 2000, 
        
        // swing or linear
        easing: 'swing',

        // this gets called every step of the animation, and updates the label
        step: function( progress ){
          var labelEl = $('.ui-label', this),
              valueEl = $('.value', labelEl);
          
          if (Math.ceil(progress) < 20 && $('.ui-label', this).is(":visible")) {
            labelEl.hide();
          }else{
            if (labelEl.is(":hidden")) {
              labelEl.fadeIn();
            };
          }
          if (Math.ceil(progress) == 100) {
            labelEl.text('Done');
            setTimeout(function() {
              labelEl.fadeOut();
            }, 1000);
          }else{
            valueEl.text(Math.ceil(progress) + '%');
          }
        },
        complete: function(scope, i, elem) {
          if (callback) {
            callback.call(this, i, elem );
          };
        }
      });
    });
  };
function timeBar(){
		var $modal = '<div id="container"><div id="progress_bar" class="ui-progress-bar ui-container"> <div class="ui-progress" style="width: 79%;"> <span class="ui-label" style="display:none;">loading <b class="value">79%</b></span></div> </div></div>';
		$(this).overlay({
		effect: 'fade',
		opacity: 0.8,
		closeOnClick: false,
		onShow: function() {
			$('body').append($modal);
			$('#progress_bar .ui-progress .ui-label').hide();

			  $('#progress_bar .ui-progress').css('width', '7%');
			  $('#progress_bar .ui-progress').animateProgress(43, function() {
				$(this).animateProgress(79, function() {
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
			
			}
		})
	}