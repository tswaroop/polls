$(function(){

	var currZoomLevel = (window.outerWidth - 8) / window.innerWidth;
	var currResolution = window.innerWidth;

	$('body')

		.on("click", "#title", function(){
			var parsed_url = G.url.parse(location.href)
		    var lang = parsed_url.searchKey.lang || null

		  	if(lang && lang.toUpperCase() == 'HIN'){
		  		window.location.href = '/?lang=HIN'
		  	}else{
				window.location.href = '/'
			}
		})

		.on("mouseover", ".dropdown", function(){
			$(".dropdown-content").removeClass('none')
		})

		.on("mouseout", ".dropdown", function(){
			$(".dropdown-content").addClass('none')
		})

		.on("click", ".dropdown-content p", function(){

			if($(this).attr('data-type') == 'state'){
				var tmp = $(".dropdown span:first").text()
				$(".dropdown span:first").text($(this).text())
				filters = []
			}else{
				var tmp = $(".dropdown span:last").text()
				$(".dropdown span:last").text($(this).text())
			}

			$(this).text(tmp)
			$(".dropdown-content").addClass('none')

			displayFilters($(".dropdown span:first").text().toLowerCase())
            $("#constituency").hide();
            $("#filters").show();

	        /*d3.csv('data/' + state_name_mapping[$(".dropdown span:first").text().toLowerCase()] + '_candidates.csv', function(curr_candidates){
				draw(
					$(".dropdown span:first").text().toLowerCase(),
					$(".dropdown span:last").text(),
					curr_candidates,
					filters
				)
			})*/
		})

		.on("click", ".btn-filter-type", function(){
            $("#constituency").hide();
            $("#filters").show();

			if($(this).hasClass('btn-filter-active')){
				$(this).removeClass('btn-filter-active')
			}else{
				$(this).addClass('btn-filter-active')
			}
			filterMap()
		})

		.on("click", ".btn-filter-remove", function(){
            $("#constituency").hide();
            $("#filters").show();
			var coltype = _.invert(category_mapping)[$(this).attr('data-column')]
			var colval = $.trim($(this).text().split('|')[0])

			if(coltype == 'population'){
				$(".filter-types[data-attr='population']").each(function(i, filter){
					if($(filter).text().split(' ')[0].toUpperCase() == colval.toUpperCase()){
						$(filter).next().removeClass('btn-filter-active')
					}
				})
			}else{
				$(".btn-filter-type:containsIgnoreCase('" + colval + "')").removeClass('btn-filter-active')
			}

			filterMap()
		})

		.on("click", ".btn-filter-clearall", function(){
			$(".btn-filter-type").removeClass('btn-filter-active')
			filters = []
			displayFilters($(".dropdown span:first").text().toLowerCase())
			/*d3.csv('data/' + state_name_mapping[$(".dropdown span:first").text().toLowerCase()] + '_candidates.csv', function(curr_candidates){
				draw(
					$(".dropdown span:first").text().toLowerCase(),
					$(".dropdown span:last").text(),
					curr_candidates,
					filters
				)
			})*/
		})

		.on("click", ".close-info", function(){
            // circles.forEach(function(circle){ circle.setStyle({ fillColor: currResolution > 1366 ? 'url(' + circle.options.data.color + ')' : circle.options.data.color }) })
            // topoLayer.eachLayer(function(layer) { 
            // 	if(layer.options.fillColor == 'black'){
            // 		layer.setStyle({ fillColor: layer.options.data.color }) 	
            // 	}
            // })
            d3.csv('data/' + state_name_mapping[$(".dropdown span:first").text().toLowerCase()] + '_candidates.csv', function(curr_candidates){
				draw(
					$(".dropdown span:first").text().toLowerCase(),
					$(".dropdown span:last").text(),
					curr_candidates,
					filters
				)
			})
            var parsed_url = G.url.parse(location.href)
            parsed_url.update({constituency: null})
            window.history.pushState('page2', '', parsed_url.protocol + '://' + parsed_url.origin + parsed_url.pathname + '?' + parsed_url.search);
            $("#constituency").hide();
            $("#filters").show();
        })

        .on("click", "#eac-submitBtn", function(){
            $("#constituency").hide();
            $("#filters").show();
            var constVal = $("#constFilter").val()
            filters = [{column: 'AC_NAME', type: 'eq', value: constVal}]

            d3.csv('data/' + state_name_mapping[$(".dropdown span:first").text().toLowerCase()] + '_candidates.csv', function(curr_candidates){
				draw(
					$(".dropdown span:first").text().toLowerCase(),
					$(".dropdown span:last").text(),
					curr_candidates,
					filters
				)
			})
        })
})

function displayFilters(state){
	d3.json('js/config.json', function(config){
		var index = _.findIndex(config.config, function(d){ return d.state == state})
		var entities = config.config[index].entities
		var parties = config.config[index].parties
		var party_other_status;

		parties = _.map(parties, function(party){
			return {
				name: party,
				status: 'inactive'
			}
		})

		_.each(filters, function(filter){
			var entity_index = _.findIndex(entities, function(d){ return d.type == _.invert(category_mapping)[filter.column] })
			var party_index = _.findIndex(parties, function(d){ return d.name.toUpperCase() == filter.value })
			if(filter.value == 'OTH'){
				party_index = parties.length
			}
			if(entity_index > -1){
				var entity = entities[entity_index]
				if(entity.type == 'population'){
					var value_index = 0
				}else{
					var value_index = _.findIndex(entity.filters, function(d){ return d.name.toUpperCase() == filter.value })	
				}
				entities[entity_index].filters[value_index].status = 'active'
			}
			if(party_index > -1){
				if(party_index == parties.length){
					party_other_status = 'active'
				}else{
					parties[party_index].status = 'active'	
				}			
			}
		})

		var filterData = {
			entities: entities,
			filters: filters
		}

		var year = $(".dropdown span:last").text()

		if(year != '2012'){
			filterData.entities = _.filter(filterData.entities, function(d){ return d.type != 'margin'})
		}

/*		$("#filters").html(
			_.templateFromURL('snippets.html', '#filter-template')({filterData: filterData})
		)*/

		/*map.removeControl(legend)*/

		var partiesData = {
			parties: parties,
			status: party_other_status
		}

/*		legend = new L.partyLegend({
			position: 'topleft',
			innerHTML: _.templateFromURL('snippets.html', '#legend-template')({partiesData: partiesData})
		})*/

		// legend.addTo(map)

	})
}

function filterMap(){

	var existing_filters = []

	$(".btn-filter-type.btn-filter-active").each(function(i, filter){
		var filterColumn = category_mapping[$(filter).parent().find('.filter-types').attr('data-attr')] || 'PARTY'
		var filterValue = $(filter).text().toUpperCase().split(' - ')[0]

		filterValue = $.trim(filterValue);

		if(filterColumn == 'RELSTATUS'){
			filterValue = $(filter).parent().find('.filter-types').text().split(' ')[0].toUpperCase()
		}

		existing_filters.push({column: filterColumn, value: filterValue, type: 'eq'})
	})

	filters = existing_filters

	d3.csv('data/' + state_name_mapping[$(".dropdown span:first").text().toLowerCase()] + '_candidates.csv', function(curr_candidates){
		displayFilters($(".dropdown span:first").text().toLowerCase())

		draw(
			$(".dropdown span:first").text().toLowerCase(),
			$(".dropdown span:last").text(),
			curr_candidates,
			filters
		)		
	})

}

$.expr[':'].containsIgnoreCase = function (n, i, m) {
    return jQuery(n).text().toUpperCase() === m[3].toUpperCase();
};