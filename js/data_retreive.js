var hindi_words_mapping;
d3.json('/data/eng_hindi_map.json', function(data){
   hindi_words_mapping = data
})

function mask_to_hindi(english_phrase) {

  var parsed_url = G.url.parse(location.href)
  var lang = parsed_url.searchKey.lang || null
  if(lang == 'HIN'){
  	english_phrase = english_phrase.toString()
    var hindi_phrase = hindi_words_mapping[english_phrase.toUpperCase()];
    return hindi_phrase || english_phrase
  }else{
    return english_phrase
  }

}


const_module = function(){
	var ac_name;
	var state_name;

	function setAcName(acname){
		ac_name = acname;
	}

	function setStateName(statename){
		state_name = statename;
	}

	function getAcName(){
		return ac_name;
	}

	function getStateName(){
		return state_name;
	}



	return{
		getAcName : getAcName,
		setAcName : setAcName,
		getStateName : getStateName,
		setStateName : setStateName
	}
}();

var dict = {
    "CAMPIERGANJ":"CAIMPIYARGANJ",
    "HARDWAR RURAL":"HARIDWAR RURAL"
}

var dict_map = {
    "CAMPIERGANJ":"CAIMPIYARGANJ"
}
var dict_mapping={
	"HARIDWAR RURAL":"HARDWAR RURAL"
}

function popUp(state,ac_name){
				ac_name = dict_mapping[ac_name] || ac_name
				d3.json('/constPop_data?state='+state+"&ac_name="+ac_name, function(all_the_data){
					var name = dict[ac_name] || ac_name
					var map_dict = dict_map[ac_name] || ac_name
					const_module.setAcName(name);
					const_module.setStateName(state);
					$("#const_body").html(_.templateFromURL('/snippets_popup.html','#const_temp')({data:all_the_data}))
					var leaflet = new Map('ac_map')
					var json_map = state_file_mapping[state.toLowerCase()]
					
					var color_const = partyColors_pname[all_the_data.cdata[0].party] || "#AF8969"
					var val_bubble = state_bubble_mapping[state.toLowerCase()]
					leaflet.render('/geojson/'+json_map, {name:map_dict,size:val_bubble,color:color_const}, {},function(){})
					function_translation()
					function_animation()
					//$("#cand_5 #rectangle_box_shadow").animate({ border-color : 'green' }, 1000) 
			})
		}

function function_translation(){
				for (var i = 1; i <= 4; i++) {
					var wid = $("#cand_"+i+" .forward").attr("width")
					$("#cand_"+i+" .top,#cand_"+i+" .forward").attr("width",0)
					$("#cand_"+i+" .top,#cand_"+i+" .forward").animate({"width":wid},1000)
				}
			}

function function_animation(){
		$('.text_const').each(function () {
	    $(this).prop('Counter',0).animate({
	        Counter: $(this).attr("value")
	    }, {
	        duration: 4000,
	        easing: 'swing',
	        step: function (now) {
	            $(this).text(Number(Math.ceil(now)).toLocaleString('en'));
	        }
	    });
	});
}


// run()
// function run(){
// 	$(function(){
// 		d3.csv('data/ELECA_CANDMAST.csv', function(all_the_data){
// 			var result = all_the_data.filter(function(obj) {
// 	  				return obj.CNAME == ac_name;
// 			});

// 			result.sort(function(a,b) {
// 	    		return  b.VOTES - a.VOTES;
// 			});
// 			var Diff = result[0].VOTES - result[1].VOTES
// 		    for (var i = 0; i < 4; i++) {
// 		    	var x = (result[i].VOTES*80)/(result[0].VOTES)
// 		    	// rectangle_3d("cand_"+(i+1),""+x+"%","30%",result[i].VOTES,result[i].ABBR,i,Diff)
// 				//rectangle("cand_"+(4+i+1),result[i].ABBR,result[i].CANDINAME)
// 		    }
// 	    })
// 	})
// }
// 	$(function(){
// 		d3.csv('data/ELECA_CANDMAST.csv', function(all_the_data){
// 			var result = all_the_data.filter(function(obj) {
// 	  				return obj.CNAME == ac_name;
// 			});

// 			result.sort(function(a,b) {
// 	    		return  b.VOTES - a.VOTES;
// 			});
// 		    var Diff = result[0].VOTES - result[1].VOTES
// 		    //rectangle_big_3d("prev_winner","90%","60%",Diff,result[0].VOTES,result[0].ABBR,result[0].CANDINAME)
// 	    })
// 	})

// 	$(function(){
// 		d3.csv('data/data_csv.csv', function(ac_details){

// 			var result = ac_details.filter(function(obj) {
// 	  				return obj["AC_NAME"] == ac_detail;
// 			});
// 			// console.log(result[0]["AC_NAME"])
// 			// console.log(result[].REGION,result.GEOSTATUS,65,result.PHASE,25)
// 		// ac_Details(result[0].REGION,result[0].GEOSTATUS,65,result[0].PHASE,25)
// 	    })
// 	})

