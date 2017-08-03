
$(document).ready(function() {
	var total_game_num = ;
	var your_game_num = ;
	if(total_game_num==0){
		total_game_num=1;
	}
    $("#total_game_num").text(total_game_num+"´Î");
	$("#your_game_num").text(your_game_num+"´Î");
    $("#your_game_progress").attr('style',"width:"+(your_game_num/total_game_num*100)+"%");
});

