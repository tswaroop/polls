
var all_states = [
  'uttar pradesh',
  'uttarakhand',
  'punjab',
  'goa',
  'manipur'
]

var all_years = [
  '2009',
  '2012',
  '2014'
]

var hindi_words_mapping;

function mask_to_hindi(english_phrase) {
  var parsed_url = G.url.parse(location.href)
  var lang = parsed_url.searchKey.lang || null

  if(lang && lang.toUpperCase() == 'HIN'){
    var hindi_phrase = hindi_words_mapping[english_phrase.toUpperCase()];
    return hindi_phrase || english_phrase
  }else{
    return english_phrase
  }

}

// console.log(mask_to_hindi("SC"))

var parsed_url = G.url.parse(location.href)
var lang = parsed_url.searchKey.lang || null
var state = parsed_url.searchKey.state.replace('-',' ') || 'uttar pradesh'
var year = parsed_url.searchKey.year || '2017'
var constituency = parsed_url.searchKey.constituency || null

all_states.splice(all_states.indexOf(state),1)
all_years.splice(all_years.indexOf(year),1)
d3.json('/data/eng_hindi_map.json', function(data){
  hindi_words_mapping = data
  $("#header").html(_.templateFromURL('strike-rate/snippets.html','#header-template')({
  data: {
    states: all_states,
    years: all_years
  }
}))
})


if(lang && lang.toUpperCase() == 'HIN'){
  $("#title").css("margin-left", "calc(50% - 75px)");
}

if(state && year && checkValidity(state,year)){
  $(".dropdown span:first").text(state.toUpperCase())
  $(".dropdown span:last").text(year)
}

    // displayFilters($(".dropdown span:first").text().toLowerCase())
function displayConstituency(data){
  $("#filters").hide()
  $("#constituency").show();
  $("#constituency").html(
    _.templateFromURL('snippets.html', '#constituency-template')({data: data})
  )
}

function checkValidity(state,year){
  var flag = true;

  if(!_.includes(['uttar pradesh','punjab','goa','uttarakhand','manipur'], state.toLowerCase())){
    flag = false
  }

  if(!_.includes(['2012','2009','2014'], year)){
    flag = false
  }

  return flag;

}