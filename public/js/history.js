$(document).ready(function() {
	$.ajax({
            url: 'http://ec2-34-210-237-255.us-west-2.compute.amazonaws.com/game_history',
            type: 'get',
            dataType: 'json',

			error:function(err){
				console.log("fail:"+err.status);
			},
            success: function(result) {
				console.log("Data in history****"+result);
		        var data = $.parseJSON(result);
				console.log("parsed data:"+data);
				console.log("data.count"+data.count);
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