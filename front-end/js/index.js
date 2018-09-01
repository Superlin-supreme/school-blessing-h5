window.onload = function(){
	//打开页面时未登录,星光动画未在进行
	var user_login_status = false;
	var current_user_name;
	var current_user_major;
	var current_user_blessing;
	var can_play = true;
	var Change_IP = "192.168.0.114:8080";
	//保存key信息
	var key_msg;
	//是否第一次获取最新评论
	var first_get_newblessing = true;

	var current_page = 1;
	var can_addblessing = true;
	//初始有剩余的祝福
	var have_blessing_left = true;

	var blessing_allNum;
	var blessing_page;
	var last_blessing_index;

	var latest_current_page = 1;

	// var latest_current_index = 0;
	// var last_page_index;

//一进来就获取评论总数开始加载祝福
get_blessing_allNum();

//进去页面刷新首页评论
// function first_newblessing(){
// 	if(blessing_allNum % 10 != 0){
// 		blessing_page_2 = parseInt(blessing_allNum / 10) + 1;
// 		last_page_index = blessing_allNum % 10 - 1;
// 	}else{
// 		blessing_page_2 = blessing_allNum / 10;
// 		last_page_index = 9;
// 	}
// 	// console.log(blessing_allNum);
// 	// console.log(blessing_page_2);
// 	// console.log(last_page_index);
// 	// console.log(last_blessing_index);
// 	// console.log(blessing_page);
// 	// get_latest_blessing();
// }

//10秒刷新首页评论
// var refresh = setInterval(function(){
// 	get_latest_blessing();
// },3000);

$("#latest_blessing").slideDown(500);

var scroll_distance = $('body').height()*0.5;
var scroll_all_distance = 0;
var have_more = true;
// console.log(scroll_distance);
// begin_scroll();
function begin_scroll(){
	scroll_box();
	setInterval(scroll_box, 20000);
}	

function scroll_box(){
	$(".little_box").animate({
	// transform: "translateY(-10%)"
		top: "-="+ scroll_distance +"px"
	}, {
		duration: 20000,
		specialEasing: {
      	top: 'linear'
    }, 
    	complete: function(){
    		if(have_more){
    			get_latest_blessing();
    			scroll_all_distance += scroll_distance;   			
    		}else{
    			scroll_all_distance += scroll_distance; 
    			if($('.little_box').height() <= scroll_all_distance){
    				$('.little_box').css("top","0px");
    				scroll_all_distance = 0;
    			}
    		}   			
    	}
	});

}

//高度写死，防止手机键盘弹出破坏布局
$('body').height($('body')[0].clientHeight);
$('.page').height($('body')[0].clientHeight);
$('.hongbao_box').height($('body')[0].clientHeight * 0.3548);
$('#login_btn').height($('#login_box').height() * 0.13);
$('#blessing_send_btn').height($('#blessing_box').height() * 0.13);
$('.input').height($('#login_box').height() * 0.11);
$('textarea').height($('#blessing_box').height() * 0.504);

// function isWeixinBrowser() {  
//              var ua = navigator.userAgent.toLowerCase();  
//            var result = (/micromessenger/.test(ua)) ? true : false;
//              if (result) {
//                  console.log('你正在访问微信浏览器');
//              }
//              else {
//                  console.log('你访问的不是微信浏览器');
//              }
//              return result;
//         } 
// isWeixinBrowser();

//翻页效果
document.getElementById("arrow").addEventListener("click", function(event){
	$("#page_1").attr("class", "page_1_out");
	$("#page_2").attr("class", "page_2_in");
	$("#page_2").css("display", "block");
	setTimeout(function(){
		$("#page_1").css({
			"display": "none",
			"transform": "translateY(-100%)",
			"opacity": "1",
		});
		$("#page_2").css("transform", "translateY(-100%)");
	},500);
}, false);

document.getElementById("arrow_down").addEventListener("click", function(event){
	$("#page_1").attr("class", "page_1_in");
	$("#page_2").attr("class", "page_2_out");
	$("#page_1").css("display", "block");
	setTimeout(function(){
		$("#page_2").css({
			"display": "none",
			"transform": "translateY(100%)",
			"opacity": "1",
		});
		$("#page_1").css("transform", "translateY(0%)");
	},500);
}, false);

//禁止和允许页面滚动
// document.body.addEventListener('touchmove',bodyScroll,false);
// document.body.removeEventListener('touchmove',bodyScroll,false);
function bodyScroll(event){  
    event.preventDefault();  
}

var music_mp3 = document.getElementById("music_mp3");

document.body.addEventListener('touchstart',auto_play_mp3,false);

music_mp3.play();
//自动播放音乐
function auto_play_mp3(){
	music_mp3.play();
	document.body.removeEventListener('touchstart',auto_play_mp3,false);
}

//控制音乐播放
$(".music_play").on("click",function(){
	if (music_mp3.paused) {
		music_mp3.play();
		$(".music_play").css("opacity","1");
	}else{
		music_mp3.pause();
		$(".music_play").css("opacity","0");
	}
});

//弹出登录框
function popup_login_box(){
	setTimeout(function(){
		$("#mask").fadeIn();
		$('#login_box').fadeIn();
		document.body.addEventListener('touchmove',bodyScroll,false);
	},300);
}

//弹出用户第几个点亮的框
function popup_num_box(){
	setTimeout(function(){
		$("#mask").fadeIn();
		$('#num_box').fadeIn();
		document.body.addEventListener('touchmove',bodyScroll,false);
	},300);
}

//弹出祝福框
function popup_blessing_box(){
	if(can_play){
		setTimeout(function(){
			$("#mask").fadeIn();
			$('#blessing_box').fadeIn();
			document.body.addEventListener('touchmove',bodyScroll,false);
		},300);
	}
}

//关闭弹出框
function close_box(){
	$("#mask").fadeOut();
	$('.popup_box').fadeOut();
	//清空input，textarea的内容
	setTimeout(function(){
		$('input').val(""); 
		$('textarea').val(""); 
	},400);	
	document.body.removeEventListener('touchmove',bodyScroll,false); 
}

var mask = document.getElementById("mask");
//点击遮罩层关闭弹出框
mask.addEventListener("click", close_box, false);

$("input").focus(function(){
	mask.removeEventListener("click", close_box, false); 
});

$("input").blur(function(){
	setTimeout(function(){
		mask.addEventListener("click", close_box, false);	
	},500);
});

//执行css星光动画
function play_star_light(){
	$("#star_rise").css("display", "block");
	$("#circle1").attr("class", "star_circle1 circle1_play");
	$("#circle2").attr("class", "star_circle2 circle2_play");
	$("#circle3").attr("class", "star_circle3 circle3_play");
	$("#light").attr("class", "star_light light_play");
	$("#star_rise").attr("class", "rising");
	$(".motto_2").attr("class", "motto_2 motto motto_play");
	setTimeout(function(){
		$("#star_rise").css("display", "none");
		$("#circle1").attr("class", "show star_circle1 ");
		$("#circle2").attr("class", "star_circle2 show");
		$("#circle3").attr("class", "star_circle3 show");
		$("#light").attr("class", "star_light show");
		$("#star_rise").attr("class", "");
		$(".motto_2").attr("class", "motto_2 show");
	},3000);
}

//点击点亮校徽按钮
$("#btn_1").on("click", function(){
	//检查用户是否登录
	if(user_login_status){
		if (can_play) {
			can_play = false;
			play_star_light();
			setTimeout(function(){
				//获取用户第几个点亮
				$.ajax({ 
		  	 		type: "POST", 	
					url: "http://"+Change_IP+"/share/public/index.php/number",
					data: {
						"key" : key_msg
					},
					dataType: "json",
					success: function(data){
						if (data.code == 200) { 
							//写入第几个弹出显示第几个登陆的框
							$("#num_box_num_in").html(data.msg);
							popup_num_box();
							can_play = true;
						} else {
							// alert("出现错误：" + data.msg);
						}  
					},
					error: function(jqXHR){     
					   // alert("发生错误：" + jqXHR.status); 	   
					},     
				});
			},3000);
		}
	}
	else{
		popup_login_box();
	}
});

//点击发送祝福按钮
$("#btn_2").on("click", function(){
	//检查用户是否登录
	if(user_login_status){
		popup_blessing_box();
	}
	else{
		popup_login_box();
	}
});

//点击确定发送祝福按钮
$("#blessing_send_btn").on("click", function(){
	if($("#blessing_send_content").val() == 0){
		alert("亲，请输入内容！");
	}
	else if($("#blessing_send_content").val().length > 100){
		alert("亲，内容过多哦！");
	}
	else{
		current_user_blessing = $("#blessing_send_content").val();
		//发送祝福内容到后台,直接插到后面第二页
		$.ajax({ 
		    type: "POST", 	
			url: "http://"+Change_IP+"/share/public/index.php/send",
			data: {
				"comment" : $("#blessing_send_content").val(),
				"key" : key_msg,
			},
			dataType: "json",
			success: function(data){
				if (data.code == 200) { 					
					//将祝福直接插到第二页
					var newbox = $('<div>').addClass('user_blessing').prependTo($(".blessing_box_2"));
					var newspan1 = $('<span>').addClass('user_major').appendTo(newbox).html(current_user_major);
					var newspan2 = $('<span>').addClass('user_name').appendTo(newbox).html("（");
					var newspan3 = $('<span>').addClass('user_name').appendTo(newbox).html(current_user_name);
					var newspan4 = $('<span>').addClass('user_name').appendTo(newbox).html("）");
					var newspan5 = $('<span>').addClass('blessing_content').appendTo(newbox).html(":");
					var newspan6 = $('<span>').addClass('blessing_content').appendTo(newbox).html(current_user_blessing);
					var newspan7 = $('<span>').addClass('blessing_time').appendTo(newbox).html("刚刚");
					newbox.fadeIn(1500);
					close_box();
					$("#arrow").click();
				} else {
					// alert("出现错误：" + data.msg);
				}  
			},
			error: function(jqXHR){     
			   // alert("发生错误：" + jqXHR.status);  
			},     
		});
	}
});

//点击登录按钮
$("#login_btn").on("click", function(){
	if($("#user_class").val() == 0){
		alert("亲，请输入专业班级！");
	}
	else if($("#user_name").val() == 0){
		alert("亲，请输入名字！");
	}
	else if($("#user_name").val().length >= 10){
		alert("亲，名字好像有点长哦！");
	}
	else if($("#user_class").val().length >= 10){
		alert("亲，专业简称就可以了哦！");
	}
	else{
		if($("#user_name").val() == "罗钰"){
			alert("猪皮狗");
		}
		current_user_name = $("#user_name").val();
		current_user_major = $("#user_class").val();
		//发送登录信息
		$.ajax({ 
		    type: "POST", 	
			url: "http://"+Change_IP+"/share/public/index.php/login",
			data: {
				"username" : $("#user_name").val(),
				"major" : $("#user_class").val(),
			},
			dataType: "json",
			success: function(data){
				if (data.code == 200) { 
					//登录成功提醒关闭弹窗
					// alert("登录" + data.msg);
					user_login_status = true;
					key_msg = data.msg;
					close_box();
				} else {
					// alert("出现错误：" + data.msg);
				}  
			},
			error: function(jqXHR){     
			   // alert("发生错误：" + jqXHR.status); 	   
			},     
		});
	}
});

//按钮触摸hover
$('button').on("touchstart", function(){
	$(this).css("background","rgb(154,8,7)");
});
$('button').on("touchend", function(){
	$(this).css("background","rgb(190,25,24)");
});


//获取当前评论总数并加载
function get_blessing_allNum(){
	$.ajax({ 
		type: "GET", 	
		url: "http://"+Change_IP+"/share/public/index.php/count",
		dataType: "json",
		success: function(data) {
			if (data.code == 200) {
				blessing_allNum = data.msg;
				if(blessing_allNum % 10 != 0){
					blessing_page = parseInt(blessing_allNum / 10) + 1;
					last_blessing_index = blessing_allNum % 10 - 1;
				}else{
					blessing_page = blessing_allNum / 10;
					last_blessing_index = 9;
				}
				addblessing();
				get_latest_blessing();
			} else {
				// alert("出现错误：" + data.msg);
			}  
		},
		error: function(jqXHR){     
			   // alert("发生错误：" + jqXHR.status);  
		},     
	});
}

//旧版刷新评论
				// if(first_get_newblessing){
				// 	$("#latest_blessing").hide(500);					
				// 	setTimeout(function(){
				// 		write_latest_blessing(data, latest_current_index);
				// 		$("#latest_blessing").show(500);	
				// 	}, 500);
				// 	// console.log("shuaxin");
				// 	// console.log(latest_current_page);
				// 	// console.log(latest_current_index);									
				// }else{
				// 	write_latest_blessing(data, latest_current_index);
				// 	$("#latest_blessing").show(500);
				// 	first_get_newblessing = true;

				// 	// console.log("first_in");
				// 	// console.log(latest_current_page);
				// 	// console.log(latest_current_index);
				// }

//刷新首页评论
function get_latest_blessing(){
	$.ajax({ 
		type: "POST", 	
		url: "http://"+Change_IP+"/share/public/index.php/show",
		data: {
				"page": latest_current_page,
				"size": "10"
		},
		dataType: "json",
		success: function(data) {
			if (data.code == 200) {
				var j;
				if(latest_current_page < blessing_page){
					j=10;
				}else{
					j=last_blessing_index;
				}
				//加载评论
				for(i=0;i<j;i++){
					// console.log(latest_current_page);
					// console.log(i);
					var newbox = $('<div>').addClass('blessing_list').appendTo($(".little_box"));
					var newspan1 = $('<span>').addClass('user_major').appendTo(newbox).html(data.msg[i].major);
					var newspan2 = $('<span>').addClass('user_name').appendTo(newbox).html("（");
					var newspan3 = $('<span>').addClass('user_name').appendTo(newbox).html(data.msg[i].name);
					var newspan4 = $('<span>').addClass('user_name').appendTo(newbox).html("）");
					var newspan5 = $('<span>').addClass('blessing_content').appendTo(newbox).html(":");
					var newspan6 = $('<span>').addClass('blessing_content').appendTo(newbox).html(data.msg[i].value);
					var newspan7 = $('<div>').addClass('box_time').appendTo(newbox).html(data.msg[i].time);
				}			
				//判断是否最后一页
				if(latest_current_page == blessing_page){
					latest_current_page = 1;
					have_more = false;
				}else{
					latest_current_page++;
				}
				if(first_get_newblessing){
					first_get_newblessing = false;					
					begin_scroll();
				}
			} else {
				// alert("出现错误：" + data.msg);
			}  
		},
		error: function(jqXHR){     
			   // alert("发生错误：" + jqXHR.status);  
		},     
	});
}

//判断评论滚到底部
$(".blessing_box").scroll(function(){
    var sTop = $(this).scrollTop();
　　　　var clientHeight = $(window).height();
　　　　var offsetHeight = $(".blessing_box_2").height();
	if(sTop + clientHeight >= offsetHeight && can_addblessing == true){
		console.log("can addblessing");
		can_addblessing = false;		
		// 请求更多评论
		if(have_blessing_left){
			console.log("have blessing left");
			addblessing();			
		}else{
			no_blessing();
		}

　　}
}); 


function addblessing(){
	// if(have_blessing_left){
		$.ajax({ 
			type: "POST", 	
			url: "http://"+Change_IP+"/share/public/index.php/show",
			data: {
				"page": current_page,
				"size":"10"
			},
			dataType: "json",
			success: function(data) {
				if (data.code == 200) {
						console.log("addblessing");
						var j;
						if(current_page < blessing_page){
							j=10;
						}else{
							j=last_blessing_index;
						}
						//加载评论
						for(i=0;i<j;i++){
							console.log(current_page);
							console.log(i);
							var newbox = $('<div>').addClass('user_blessing').appendTo($(".blessing_box_2"));
							var newspan1 = $('<span>').addClass('user_major').appendTo(newbox).html(data.msg[i].major);
							var newspan2 = $('<span>').addClass('user_name').appendTo(newbox).html("（");
							var newspan3 = $('<span>').addClass('user_name').appendTo(newbox).html(data.msg[i].name);
							var newspan4 = $('<span>').addClass('user_name').appendTo(newbox).html("）");
							var newspan5 = $('<span>').addClass('blessing_content').appendTo(newbox).html(":");
							var newspan6 = $('<span>').addClass('blessing_content').appendTo(newbox).html(data.msg[i].value);
							var newspan7 = $('<span>').addClass('blessing_time').appendTo(newbox).html(data.msg[i].time);
							newbox.fadeIn(1500);
						}
						current_page++;
						if(current_page > blessing_page){
							have_blessing_left = false;
							// no_blessing();
						}
						can_addblessing = true;
					} else {
						//重新加载
						addblessing();
						// alert("出现错误：" + data.msg);
					}  
				},
				error: function(jqXHR){  
					//重新加载
					addblessing();					
					// alert("发生错误：" + jqXHR.status);  
				},     
			});
	// }else{
	// 	no_blessing();
	// }
}

function no_blessing(){
	$(".loading_icon").css("display","none");
	$(".nomore_box").css("display","block");	
}

}
