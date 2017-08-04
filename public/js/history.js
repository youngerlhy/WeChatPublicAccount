$(document).ready(function() {
	alert("ready");
	$.ajax({
            url: 'http://ec2-34-210-237-255.us-west-2.compute.amazonaws.com/game_history',
            type: 'get',
            dataType: 'json',

			error:function(err){
				alert("fail:"+err.status);
			},
            success: function(result) {
				console.log("Data in history****"+result);
		        var data = $.parseJSON(result);
				alert("parsed data:"+data);
				alert("data.count"+data.count);
				var total_game_num = data.count;
				var your_game_num = data.userGamesNum;
				if(total_game_num==0){
					total_game_num=1;
				}
				$("#total_game_num").text(total_game_num+"次");
				$("#your_game_num").text(your_game_num+"次");
				$("#your_game_progress").attr('style',"width:"+(your_game_num/total_game_num*100)+"%");
            }
     });
});