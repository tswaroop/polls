$(function(){

	$("#landing-div").html(_.templateFromURL('snippets.html', '#landing-div-template')({}))

	$("body").on("click", ".btn-landing", function(){

		var state = $(this).text().toLowerCase().replace(' ','-')
		var parsed_url = G.url.parse(location.href)
 		var lang = parsed_url.searchKey.lang || null

  	if(lang && lang.toUpperCase() == 'HIN'){
  		window.location = '/maps?lang=HIN&state=' + state + '&year=2012' 
		}else{
			window.location = '/maps?state=' + state + '&year=2012' 
		}

	})

})

function mask_to_hindi(english_phrase) {

	var hindi_words_mapping = {
		"ELECTION ANALYTICS CENTRE": "इलेक्शन सेंटर"
	}

  var parsed_url = G.url.parse(location.href)
  var lang = parsed_url.searchKey.lang || null

  if(lang && lang.toUpperCase() == 'HIN'){
    var hindi_phrase = hindi_words_mapping[english_phrase.toUpperCase()];
    return hindi_phrase || english_phrase
  }else{
    return english_phrase
  }

}
