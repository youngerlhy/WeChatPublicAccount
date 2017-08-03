
	var total_game_num = arg1;
	var your_game_num = arg2;
	if(total_game_num==0){
		total_game_num=1;
	}
    $("#total_game_num").text(total_game_num+"次");
	$("#your_game_num").text(your_game_num+"次");
    $("#your_game_progress").attr('style',"width:"+(your_game_num/total_game_num*100)+"%");
};