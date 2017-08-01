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
  });
  
  $("#publish_sign_up").click(function() {
    var startTime = $("#datetimeStart").val();
    var endTime = $("#datetimeEnd").val();
    console.log(startTime);
    $("#publish_success").innerHTML="发布成功!";
    $.post("/add_publish_game", {
      startTime : startTime,
      endTime : endTime
    }, function(data, status) {
    });
  });
});

function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null)
    return unescape(r[2]);
  return null;
}
