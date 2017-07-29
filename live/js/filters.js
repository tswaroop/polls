$(function(){

	var currZoomLevel = (window.outerWidth - 8) / window.innerWidth;
	var currResolution = window.innerWidth;

	$('body')
		.on("click", ".show-rest", function(e){
			d3.selectAll(".hide_tr")
				.each(function(e){
					var sel = d3.select(this)
					var display = 'none'
					var curr_disp = sel.style("display")
					if (curr_disp == 'none') display = "table-row"
					sel.style("display", "none")
						.transition().duration(1000).ease(d3.easeLinear)
					.style("display", display)
				})
		})
		.on("click", ".live-refresh", function(e){
			e.preventDefault();
			e.stopPropagation();
			var parsed_url = G.url.parse(location.href).searchList
			var state = parsed_url['state'][0].replace('-', ' ')
			draw(state, 2017, "refresh")
		})
		.on("click", ".btn-filter-clearall", function(e){
			e.preventDefault();
			e.stopPropagation();

			// var state = $("#filter-state span:first").text().toLowerCase()
			var parsed_url = G.url.parse(location.href).searchList
			var state = (parsed_url['state']  || ['uttar pradesh'])[0].replace('-', ' ')
			var default_url = '?state=' + state
			var lang = parsed_url['lang']
			if(lang) default_url = default_url + '&lang=' + lang;

			history.pushState({}, '', default_url);
			draw(state, 2017)
		})

		.on("click", "#searchRow", function(e){
			e.preventDefault();
			e.stopPropagation();
			$("#constFilter").focus()
		})

		.on("click", "#title", function(){
			var parsed_url = G.url.parse(location.href)
		    var lang = parsed_url.searchKey.lang || null

		  	if(lang && lang.toUpperCase() == 'HIN'){
		  		window.location.href = '/countinghome?lang=HIN'
		  	}else{
				window.location.href = '/countinghome'
			}
		})

		.on("mouseover", ".dropdown", function(){
			$(".dropdown-content").removeClass('none')
		})

		.on("mouseout", ".dropdown", function(){
			$(".dropdown-content").addClass('none')
		})

		.on("click", ".dropdown-content p", function(e){
			var parsed_url = G.url.parse(location.href)
		  	var lang = parsed_url.searchKey.lang

			if($(this).attr('data-type') == 'state'){
				var tmp = $(".dropdown span:first").text()
				$(".dropdown span:first").text($(this).text())
				filters = []
				$(this).text(tmp)

				sections_ = sections.slice(1)
				d3.select('#filter-section span').text(sections[0]['name'])
				d3.selectAll('#filter-section p').each(function(ele, i){
					var sel = d3.select(this)
					sel.text(sections[i + 1]['name'])
				})

			}
			if($(this).attr('data-type') == 'section'){
				e.preventDefault();
				e.stopPropagation();
				var text = $(this).text()
				var hash_id = ''
				var rem_sel = []
				d3.select('#filter-section span').text(text)
				_.each(sections, function(sec, i){
					if(sec['name'] == text) {
						hash_id = sec['id']
					}
					else{
						rem_sel.push(sec)
					}
				})
				d3.selectAll('#filter-section p').each(function(ele, i){
					var sel = d3.select(this)
					sel.text(rem_sel[i]['name'])
				})
				$.fn.scrollView = function () {
				    return this.each(function () {
				        $('html, body').animate({
				            scrollTop: $(this).offset().top - 100
				        }, 1000);
				    });
				}
				$('#'+hash_id).scrollView();
				// window.location.hash = hash_id
				// var tmp = $("#filter-section span:first").text()
				// $("#filter-section span:first").text($(this).text())
				// $(this).text(tmp)
				$(".dropdown-content").addClass('none')
				return false
			}
			$(".dropdown-content").addClass('none')

			var state = $("#filter-state span:first").text().toLowerCase()
			var default_url = '?state=' + state.replace(' ', '-')
			if(lang) default_url = default_url + '&lang=' + lang;
			history.pushState({}, '', default_url);
			displayFilters(state)
      $("#constituency").hide();
      $("#filters").show();
			draw(
					state,
					2017
				)
			$(window).scrollTop(0);
		})

    .on("click", "#downloadPNG", function(){
	      var current_url = G.url.parse(location.href);
	      var domain_url = current_url.protocol + '://' + current_url.hostname
	      window.open(domain_url + ':8000' + '?delay=2000&width=' + window.innerWidth + '&height=' + window.innerHeight + '&file=screenshot.png' + '&url=' + encodeURIComponent(location.href), '_blank');
	    })
})

function displayFilters(state){
	var q = G.url.parse(location.href).searchList
	d3.json('live/js/config.json', function(config){
		var index = _.findIndex(config.config, function(d){ return d.state == state})
		var entities = config.config[index].entities
		var all_filtrs = []
		var filter_applied = []

		_.each(entities, function(v){
			var slug_param = rmslug(v.type)
			var temp_res = {}

			if(q[slug_param]){
				var q_filters = q[slug_param]
				temp_res['type'] = v.type
				temp_res['name'] = v.name
				filter_applied.push(slug_param)
				var labels = []

				_.each(v.filters, function(filter){
					if(q_filters.indexOf(filter.value || filter.name) > -1){
						filter['status'] = 'active'
						labels.push(filter.name)
					}
				})
				temp_res['labels'] = labels
				all_filtrs.push(temp_res)
			}
		})

		var applied_filters = []
		_.each(q, function(val, key) {
    	if (!key.match(/^(state|year)$/)) {
      	applied_filters.push(key)
    	}
  	})


		var filterData = {
			entities: entities,
			filters: applied_filters,
			filter_legend: all_filtrs,
		}

		// var year = $(".dropdown span:last").text()

		// if(year != '2012'){
		// 	filterData.entities = _.filter(filterData.entities, function(d){ return d.type != 'margin'})
		// }

		$("#filters").html(
			_.templateFromURL('live/snippets.html', '#filter-template')({filterData: filterData})
		)

		map.removeControl(legend)
		map.removeControl(exportLegend)

		exportLegend = new L.partyLegend({
			position: 'topright',
			innerHTML: "<button class='btn btn-filter-type' id='downloadPNG'>Export</button>"
		})

		legend.addTo(map)
		exportLegend.addTo(map)

	})
}


$.expr[':'].containsIgnoreCase = function (n, i, m) {
    return jQuery(n).text().toUpperCase() === m[3].toUpperCase();
};
