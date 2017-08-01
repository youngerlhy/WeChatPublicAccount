/**
 * Simplified Chinese translation for bootstrap-datetimepicker
 * Yuan Cheung <advanimal@gmail.com>
 */
;(function($){
	$.fn.datetimepicker.dates['zh-CN'] = {
			days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
			daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
			daysMin:  ["日", "一", "二", "三", "四", "五", "六", "日"],
			months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
			monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
			today: "今天",
			suffix: [],
			meridiem: ["上午", "下午"]
	};
}(jQuery));

    $("#datetimeStart").datetimepicker({
        format: 'yyyy-mm-dd hh:ii',//显示格式
        minView:'hour',//设置最小视图显示到小时
		maxView:'year',
        language: 'zh-CN',//显示中文
		autoclose: true,//选中自动关闭
		todayBtn: true,//显示今日按钮
		todayHighlight: true,//今日高亮显示
        startDate:new Date()
    }).on("click",function(){
        $("#datetimeStart").datetimepicker("setEndDate",$("#datetimeEnd").val())
    });
    $("#datetimeEnd").datetimepicker({
        format: 'yyyy-mm-dd hh:ii',//显示格式
        minView:'hour',//设置最小视图显示到小时
		maxView:'year',
        language: 'zh-CN',//显示中文
		autoclose: true,//选中自动关闭
		todayBtn: true,//显示今日按钮
		todayHighlight: true,//今日高亮显示
        startDate:new Date()
    }).on("click",function(){
        $("#datetimeEnd").datetimepicker("setStartDate",$("#datetimeStart").val())
    });