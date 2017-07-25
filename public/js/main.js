/**
 * main js
 */

$(document).ready(function() {
	$("#sign_up").attr('style',"display:block;");
	$("#whether_have_car").attr('style',"display:none;");
	$("#next_time_txt").attr('style',"display:none;");
	$("#car_seat").attr('style',"display:none;");
	$("#sign_up_successful").attr('style',"display:none;");
		
	
    $("#confirm_sign_up").click(function(){
        $("#sign_up").attr('style',"display:none;");
		$("#whether_have_car").attr('style',"display:block;");
    });
	
	$("#next_time").click(function(){
        $("#sign_up").attr('style',"display:none;");
		$("#whether_have_car").attr('style',"display:none;");
		$("#next_time_txt").attr('style',"display:block;");
    });

	$("#have_car").click(function(){
        $("#sign_up").attr('style',"display:none;");
		$("#whether_have_car").attr('style',"display:none;");
		$("#car_seat").attr('style',"display:block;");
    });

	$("#finish_sign_up").click(function(){
        $("#sign_up").attr('style',"display:none;");
		$("#whether_have_car").attr('style',"display:none;");
		$("#next_time_txt").attr('style',"display:none;");
		$("#car_seat").attr('style',"display:none;");
		$("#sign_up_successful").attr('style',"display:block;");
    });
	
	$("#not_have_car").click(function(){
        $("#sign_up").attr('style',"display:none;");
		$("#whether_have_car").attr('style',"display:none;");
		$("#next_time_txt").attr('style',"display:none;");
		$("#car_seat").attr('style',"display:none;");
		$("#sign_up_successful").attr('style',"display:block;");
    });	
});