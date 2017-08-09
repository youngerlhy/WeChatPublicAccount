$(document).ready(function() {
	alert("ready");
	$.ajax({
		url:'http://ec2-34-210-237-255.us-west-2.compute.amazonaws.com/game_history',
		type:'get',
		dataType:'json',

			error:function(err){
				alert("fail:"+err.status);
			},
			success: function(data) {
				console.log("Data in history****"+data);
				var result=$.parseJSON(data);
				alert("parsed data:"+result);
				alert("data.count"+result.count);
				var total_game_num = result.count;
				var your_game_num = result.userGamesNum;
				if(total_game_num==0){
					total_game_num=1;
				}
				$("#total_game_num").text(total_game_num+"次");
				$("#your_game_num").text(your_game_num+"次");
				$("#your_game_progress").attr('style',"width:"+(your_game_num/total_game_num*100)+"%");
			}
	});
});