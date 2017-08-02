/**
 * main js
 */

$(document).ready(function() {
  $("#sign_up").attr('style', "display:block;");
  $("#whether_have_car").attr('style', "display:none;");
  $("#next_time_txt").attr('style', "display:none;");
  $("#car_seat").attr('style', "display:none;");
  $("#sign_up_successful").attr('style', "display:none;");

  $("#confirm_sign_up").click(function() {
    $("#sign_up").attr('style', "display:none;");
    $("#whether_have_car").attr('style', "display:block;");
  });

  $("#next_time").click(function() {
    $("#sign_up").attr('style', "display:none;");
    $("#whether_have_car").attr('style', "display:none;");
    $("#next_time_txt").attr('style', "display:block;");
  });

  $("#have_car").click(function() {
    $("#sign_up").attr('style', "display:none;");
    $("#whether_have_car").attr('style', "display:none;");
    $("#car_seat").attr('style', "display:block;");
  });

  $("#finish_sign_up").click(function() {
    $("#sign_up").attr('style', "display:none;");
    $("#whether_have_car").attr('style', "display:none;");
    $("#next_time_txt").attr('style', "display:none;");
    $("#car_seat").attr('style', "display:none;");
    $("#sign_up_successful").attr('style', "display:block;");
    var num = $("#seat").val();
    $.post("/insert_data", {
      nickname : getQueryString("nickname"),
      imageurl : getQueryString("headimgurl"),
      seatnum : num
    }, function(data, status) {
    });
  });

  $("#not_have_car").click(function() {
    $("#sign_up").attr('style', "display:none;");
    $("#whether_have_car").attr('style', "display:none;");
    $("#next_time_txt").attr('style', "display:none;");
    $("#car_seat").attr('style', "display:none;");
    $("#sign_up_successful").attr('style', "display:block;");
    $.post("/insert_data", {
      nickname : getQueryString("nickname"),
      imageurl : getQueryString("headimgurl"),
      seatnum : 0
    }, function(data, status) {
    });
  });
  
  $("#confirm_cancel").click(function() {
   $("#cancel_sign_up_successful").attr('style', "display:block;");
   $("#cancel_sign_up").attr('style',"display:none;"); 
   $.post("/delete_data", {
      nickname : getQueryString("nickname"),
    }, function(data, status) {
    });
  });
  
  $("#publish_sign_up").click(function() {
    var startTime = $("#datetimeStart").val();
    var endTime = $("#datetimeEnd").val();
    console.log(startTime);
    $.post("/add_publish_game", {
      startTime : startTime,
      endTime : endTime
    }, function(data, status) {
    });
    $("#publish_sign_up_div").attr('style', "display:none;");
    $("#publish_success").attr('style', "display:block;");
  });

  $("close_out_game_confirm").click(function() {
    var startTime = $("#datetimeStart").val();
    var endTime = $("#datetimeEnd").val();
    $.post("/close_out_game_confirm", {
      startTime : startTime,
      endTime : endTime
    }, function(data, status) {
    });
    $("#close_out_game_div").attr('style', "display:none;");
    $("#close_out_game").attr('style', "display:block;");
  });

  $("close_out_game_cancel").click(function() {

  });
});

function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null)
    return unescape(r[2]);
  return null;
}
