var total_cand = {'uttar pradesh':403,'punjab':117,'uttarakhand':70,'manipur':60,'goa':40}

var partyColors = {
 'CONG': '#12D6FF',
 'SAD': '#FEF391',
 'BJP': '#FFB200',
 'AAP': '#FF4933',
 'SAD+BJP': '#ff9f00',
 'AAP': '#0C9753',
 'SP': '#11ff00',
 'CONG': '#1796ff',
 'OTH': '#c9c9c9',
 'SP+CONG': '#11ff00',
 'PRJA': '#11ff00',
 'BSP': '#FF19B6',
 'BJP+': '#FFB200',
 'BJP+SAD': '#FF9F00',
 'SAD+BJP': '#FF9F00',
 'SAD + BJP': '#FF9F00',
 'CONG+SP': '#11FF00',
 'SP+CONG': '#0C9753',
 'SP + CONG': '#11FF00',
 "OTH":"brown",
 'PRAJ':"blue",
 'AAP+':'#11FF00'
}
$("body")
     .on("mouseover", ".dropdown", function(){
       $(".dropdown-content").removeClass('none')
     })
     .on("mouseout", ".dropdown", function(){
       $(".dropdown-content").addClass('none')
     })

var linechart;


// $(function(){

	function initilize()
	{
	linechart = new Linechart('#linechartContainer','x', true,{'left': 50, 'right': 50, 'top': 100, 'bottom': 0})
	linechart = linechart.createSkeleton()
	}
	
	var curr_url = G.url.parse(location.href)
	var states = curr_url.searchKey.state.replace('-',' ') || 'uttar pradesh'

	initilize()
	strike_state(states)

	$(document).on("click", ".refresh", function(){
	var curr_url = G.url.parse(location.href)
	var states = curr_url.searchKey.state.replace('-',' ') || 'uttar pradesh'
	var hindi = curr_url.searchList.lang
 	if(hindi == undefined)
	{window.history.pushState('page2', 'Title', '/strike?state='+states);}
	else{window.history.pushState('page2', 'Title', '/strike?state='+states+'&lang='+hindi[0])}
	linechart.resetSelector('.remove', true)._element.remove()
	strike_state(states)
	})

	function strike_state(states)
	{
		d3.json("/strikelive?state="+states,function(data1){

		var curr_url = G.url.parse(location.href)
		var states = curr_url.searchKey.state.replace('-',' ') || 'uttar pradesh'
		var party_url= curr_url.searchList.party
		line_chart_sample_data = _.map(data1, function(d){
			d.x = moment(d.x, 'X').toDate()
			return d
		})

		line_chart_sample_data = data_filter(line_chart_sample_data)

		var party_filtered = []
		_.forEach(party_url, function(d){ return party_filtered.push(d.replace(' ','+'))})

		// party_filter(states);
		function party_filter(parties_all)
		{
		 parties_all = Object.keys(parties_all)
		 d3.json('/data/eng_hindi_map.json', function(data){
  			hindi_words_mapping = data
		 	$('#party_filter').html(_.templateFromURL('strike-rate/snippets.html','#party-filt')({data:parties_all}))
			})
		 $('#donut-filt').html(_.templateFromURL('strike-rate/snippets.html','#donut-filter')({data:parties_all}))
		} 

		 // filter donut data from sample line chart data
		function donut_filter_data(line_chart_sample_data,states)
		{
			var donut_data = []

			var check = _(line_chart_sample_data).reduce(function(acc, obj) {
			_(obj).each(function(value, key) 
			{
			 if(key!='x'){
				acc[key] = (acc[key] ? acc[key] : 0) + value
			 }
			});
			return acc;
			}, {});
			var result = _.fromPairs(_.sortBy(_.toPairs(check), function(a){return a[1]}).reverse())
			party_filter(result)
			_.each(result, function(val, party){
			var _temp_array = new Object();
			var _temp_total = total_cand[states]
			if (_temp_total == undefined){
			 _temp_total = 403
			}
			_temp_array[party] = [val, _temp_total];
			_temp_array['colr'] = partyColors[party];
			// _temp_array['total'] = all_state[st][party]
			donut_data.push(_temp_array)
			})
			return donut_data
		}

		render_donut(donut_filter_data(line_chart_sample_data.slice(-1),states))
		
		//calling dount function
		function render_donut(donut_data){
		
		_.forEach(_.range(4),function(i){
			var donut = new Donut('#donutContainer'+i,{'left': 50, 'right': 25, 'top': 50, 'bottom': 0})
			donut.createSkeleton().render(donut_data.slice(i,i+1))
			})
		}
		linechart.render(line_chart_sample_data)	
				
		})
	}
// })
function data_filter(line_chart_sample_data){
	var temp = []
	var data = []
	_.forEach(line_chart_sample_data,function(d){
		if(d.x.getHours() >= 8  && d.x.getHours() <=16)
		{data.push(d);
		}
	})
	if( data[data.length-1].x.getHours() < 10){
	temp = _.filter(data, function(d) { return (parseInt((moment(d.x).format('mm'))) % 15 == 0)})
 	}
 	else if(data[data.length-1].x.getHours() < 14){
	temp = _.filter(data, function(d) {  return (parseInt((moment(d.x).format('mm'))) % 30 == 0)})
 	}
	else if(data[data.length-1].x.getHours() <= 16){
	temp = _.filter(data, function(d) {  return (parseInt((moment(d.x).format('mm'))) % 60 == 0)})
 	}
 	if(data[data.length-1].x.getHours() != 16)
 	{
 		if (_.indexOf(temp,_.last(data)) == -1)
 	 	{
 	 		temp.push(_.last(data))
 	 	}
 	 }
 	temp = _.uniqBy(temp, function(d){ return moment(d.x).unix(); })

 	// remove intitial 8:00 am data to avoid image in the linechart
 	// if(temp.length > 1){
	 // 	if(moment(temp[0].x).format('hh:mm') == moment(temp[1].x).format('hh:mm'))
	 // 	{
	 // 		temp.shift();
	 // 	}}
 	return temp
}
//donut click event and functinality
$(document).on('click', '.hilighter', function(){
 	var curr_url = G.url.parse(location.href)
	var states = curr_url.searchKey.state.replace('-',' ') || 'uttar pradesh'
	var check_clicked = $(this).attr('data-clicked')
	 
	if(check_clicked===undefined){check_clicked=0}
	if(parseInt(check_clicked)===0){
	 // $(this).attr('data-clicked', 1)
	 $('.hilighter[data-highlight=\"'+ $(this).attr('data-highlight')+ '\"]').attr('data-clicked', 1)
	 
	}
	if(parseInt(check_clicked)===1){
	 // $(this).attr('data-clicked', 0)
	 $('.hilighter[data-highlight=\"'+ $(this).attr('data-highlight').trim() + '\"]').attr('data-clicked', 0)
	}
	var select_data = $('.hilighter[data-clicked=1]');
	clicked()
	if(select_data.length ==0 || select_data.length == $('.hilighter').length){
	 window.history.pushState('page2', 'Title', '/strike?state='+states);
	}
})

//url filter
$(window).load(function() { 
	var curr_url = G.url.parse(location.href)
	var states = curr_url.searchKey.state.replace('-',' ') || 'uttar pradesh'
	var party_url = curr_url.searchList.party
	_.forEach(party_url,function(d){
		$('.hilighter[data-highlight=\"'+ encodeURIComponent(d) + '\"]').attr('data-clicked',1)
	})
	var select_data = $('.hilighter[data-clicked=1]');
	clicked()
})

//click event operations
function clicked()
{
	select_data = $('.hilighter[data-clicked=1]');
	if(select_data.length == 2)
	{
	 $('#linechartContainerSVG image[data-highligh=\"' + $(select_data).attr('data-highlight') + '\"]').not(':first').not(':last').css('opacity', 1)
	 $('#linechartContainerSVG text[data-highligh=\"' + $(select_data).attr('data-highlight') + '\"]').not(':first').not(':last').css('opacity', 1)
	}
	else{
	 $("#linechartContainerSVG image[ptype=abcd],#linechartContainerSVG text[ptype=abcd]").css('opacity',0)
	}
	if(select_data.length ==0 || select_data.length == $('.hilighter').length){
	 $('.hilighter[data-clicked=1]').removeAttr("data-clicked");
	 $('.hilighter,.filter-buttons p,path[ttype=abcd],#linechartContainerSVG image[dtype=abcd]').css('opacity', 1)
	 $("#linechartContainerSVG image[ptype=abcd],#linechartContainerSVG text[ptype=abcd]").css('opacity',0)
	}
	else{
	 $('.hilighter,path[ttype=abcd],.filter-buttons p,#linechartContainerSVG image[dtype=abcd]').css('opacity', 0.1)
	 select_data.css('opacity', 1)
	 _.each(select_data, function(e){
		$('g[data-highlight=\"' + $(e).attr('data-highlight') + '\"]').css('opacity', 1)
		$('path[data-highlight=\"' + $(e).attr('data-highlight') + '\"]').css('opacity', 1)
		$('p[data-highlight=\"'+ $(e).attr('data-highlight').trim() +'\"]').css('opacity', 1)
		$('#linechartContainerSVG image[data-highlight=\"' + $(e).attr('data-highlight') + '\"]').css('opacity', 1)
	 })
	}
}

//drop-down filter
$(document).on("click", ".dropdown-content p", function(){
 selected_state =$(this).text().toLowerCase()
 if($(this).attr('data-type') == 'state'){
	var tmp = $(".dropdown span:first").text()
	$(".dropdown span:first").text($(this).text())
 }else{
	var tmp = $(".dropdown span:last").text()
	$(".dropdown span:last").text($(this).text())
 }
 $(".dropdown-content").addClass('none')
 $(this).text(tmp)
 var curr_url = G.url.parse(location.href)
 var hindi = curr_url.searchList.lang
 if(hindi == undefined)
 {window.history.pushState('page2', 'Title', '/strike?state='+selected_state);}
else{window.history.pushState('page2', 'Title', '/strike?state='+selected_state+'&lang='+hindi[0])}
 initilize()
 strike_state(selected_state)
})

//header click
$('#header').on('click', '#title', function(){
 var parsed_url = G.url.parse(location.href)
 var lang = parsed_url.searchKey.lang || null
 if(lang == "HIN"){
     window.location.href = "/countinghome?lang=HIN";
   }
 else{
   window.location.href = "/countinghome";
 }
});