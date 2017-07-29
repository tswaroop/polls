function load_temp() {
	var args = G.url.parse(location.href).searchKey;
	var lang = args.lang;
	var state1 = args.state;
	console.log(state1, "-----");
	var selected_state = state1 == 'up' ? 'Uttar Pradesh' : 'Punjab';
	var other_state = state1 == 'up' ? 'Punjab' : 'Uttar Pradesh'
	var htm = _.template($('#candidate_header_punjab').html())({
		'selected_state': selected_state,
		'other_state': other_state
	});

	$('#header').html(htm);
}

d3.json('../data/eng_hindi_map.json', function(error, data) {

	var hindi_words_mapping = data;

	/*Returns Hindi Phrase equivalent to English Phrase.*/
	function mask_to_hindi1(english_phrase) {

		var parsed_url = G.url.parse(location.href)
		var lang = parsed_url.searchKey.lang || null

		if (lang && lang.toUpperCase() == 'HIN') {
			var hindi_phrase = hindi_words_mapping[english_phrase.toUpperCase()];
			return hindi_phrase || english_phrase
		} else {
			return english_phrase
		}

	}

	load_temp()

	var leaflet = new Map("mapContainer")
		// var regions = []
		// var phases = []

	var party_colors = {
		"narendra modi": '#FFB200',
		"rahul gandhi": '#007DD8',
		"arvind kejriwal": '#00B68D',
		'mayawati': '#FF19B6',
		'akhilesh yadav': '#0C9753'
	}

	$(function() {

		var cand_img = {
			'rahul gandhi': '/img/party_candidate_images/RAHUL_GANDHI.png',
			'narendra modi': '/img/party_candidate_images/Narendra Modi-Transparent.png',
			'mayawati': '/img/party_candidate_images/MAYAWATI.png',
			'akhilesh yadav': '/img/party_candidate_images/AKHILESH_YADAV.png',
			'arvind kejriwal': '/img/party_candidate_images/ARVIND_KEJRIWAL.png'
		}

		var ribbon_colors = {
			"narendra modi": '#A93700',
			"rahul gandhi": '#121869',
			"arvind kejriwal": '#00B68D',
			'mayawati': '#D62CA8',
			'akhilesh yadav': '#0C9753'
		}

		// var state = getState().toUpperCase()

		/*$("#header").html(_.templateFromURL('/roti/snippets.html', '#header-template')({
			data: {
				curr_state: state == 'UP' ? 'UTTAR PRADESH' : 'PUNJAB',
				other_state: state == 'UP' ? 'PUNJAB' : 'UTTAR PRADESH'
			}
		}))*/

		var data = []

		d3.json('/roti/js/config.json', function(filterData) {
			filterData = filterData.config
			filterData = filterData[_.findIndex(filterData, function(d) {
				return d.state == getState()
			})]
			$("#mapFilters").html(_.templateFromURL('/roti/snippets.html', '#map-filter-template')({
				filterData: filterData
			}))
		})

		var cand = getCandidate()

		$("#candidatePic").html(
			_.templateFromURL('/roti/snippets.html', '#image-3d-template')({
				data: {
					name: _.map(cand.split(' '), _.capitalize).join(' '),
					img: cand_img[cand],
					partyColor: party_colors[cand],
					partyBorderColor: ribbon_colors[cand]
				}
			})
		)

		d3.json('/data/roti/' + getState() + '?phases=&regions=&name_of_person=' + getCandidate(), function(data) {
			draw(data)
		})


		$("body")
			.on("click", "#clickableMap", function() {
				var args = G.url.parse(location.href).searchKey;
				var lang = args.lang;
				if (lang != undefined) {
					window.location.href = '/roti/' + getState().toLowerCase() + '?lang=' + lang;
				} else {
					window.location.href = '/roti/' + getState().toLowerCase();
				}
			})

		.on("click", ".dropdown p", function() {
			var state = $(this).text()
			var args = G.url.parse(location.href).searchKey;
			var lang = args.lang;
			if (state == 'PUNJAB') {
				var url_redirect = lang == undefined ? '/roti/punjab' : '/roti/punjab' + '?lang=' + lang
				window.location.href = url_redirect
			} else if (state == 'UTTAR PRADESH') {
				var url_redirect = lang == undefined ? '/roti/up' : '/roti/up' + '?lang=' + lang
				window.location.href = '/roti/up'
			} else {

			}
		})

		.on("click", ".btn-filter-clearall", function() {
			d3.json('/data/roti/' + getState() + '?phases=&regions=&name_of_person=' + getCandidate(), function(data) {
				draw(data)
			})
		})

		.on("click", ".refresh", function() {
			var regions = []
			var phases = []

			if (getState() == 'up') {
				$(".btn-filter-regions.btn-filter-active").each(function(i, active) {
					regions.push($(active).attr("data-val"));
				})

				$(".btn-filter-phases.btn-filter-active").each(function(i, active) {
					phases.push($(active).attr("data-val"))
				})

				d3.json('/data/roti/' + getState() + '?phases=' + _.uniq(phases).join(',') + '&regions=' + _.uniq(regions).join(',') + '&name_of_person=' + getCandidate(), function(data) {
					draw(data)
				})
			} else if (getState() == 'punjab') {

				$(".btn-filter-regions.btn-filter-active").each(function(i, active) {
					regions.push($(active).attr("data-val"))
				})

				d3.json('/data/roti/' + getState() + '?regions=' + _.uniq(regions).join(',') + '&name_of_person=' + getCandidate(), function(data) {
					draw(data)
				})
			} else {
				d3.json('/data/roti/' + getState() + '?phases=&regions=&name_of_person=' + getCandidate(), function(data) {
					draw(data)
				})
			}
		})


		.on("click", ".btn-filter", function() {
			if ($(this).hasClass('btn-filter-active')) {
				// regions = _.uniq(regions)
				// regions.splice(regions.indexOf($(this).text()), 1)
				// if(getState() == 'up'){
				// 	phases = _.uniq(phases)
				// 	phases.splice(phases.indexOf($(this).text()), 1)					
				// }
				$(this).removeClass('btn-filter-active')
			} else {
				$(this).addClass('btn-filter-active')
			}

			var regions = []
			var phases = []

			if (getState() == 'up') {
				$(".btn-filter-regions.btn-filter-active").each(function(i, active) {
					regions.push($(active).attr("data-val"))
				})

				$(".btn-filter-phases.btn-filter-active").each(function(i, active) {
					phases.push($(active).attr("data-val"))
				})

				d3.json('/data/roti/' + getState() + '?phases=' + _.uniq(phases).join(',') + '&regions=' + _.uniq(regions).join(',') + '&name_of_person=' + getCandidate(), function(data) {
					draw(data)
				})
			} else if (getState() == 'punjab') {

				$(".btn-filter-regions.btn-filter-active").each(function(i, active) {
					regions.push($(active).attr("data-val"))
				})

				d3.json('/data/roti/' + getState() + '?regions=' + _.uniq(regions).join(',') + '&name_of_person=' + getCandidate(), function(data) {
					draw(data)
				})
			} else {
				d3.json('/data/roti/' + getState() + '?phases=&regions=&name_of_person=' + getCandidate(), function(data) {
					draw(data)
				})
			}
		})

		.on('click', '#title', function() {
			var args = G.url.parse(location.href).searchKey;
			var lang = args.lang;
			if (lang != undefined) {
				window.location.href = "/countinghome" + '?lang=' + lang;
			} else {
				window.location.href = "/countinghome";
			}
		})

		.on('click', '.glyphicon-remove', function() {
			$('.roti_main').css('display', 'block');
			$('#const_body').css('display', 'none');
		})

		.on('click', '.glyphicon-refresh', function() {
			popUp(const_module.getStateName(), const_module.getAcName())
		})
	})

	/*function mask_to_hindi(word) {
		return word;
	}*/

	function draw(data) {
		var map_mapping = {
			up: 'uttar pradesh',
			punjab: 'punjab'
		}
		leaflet.render('/geojson/' + getState() + '_ac_map.json', {}, data.const_data, function(d) {
			popUp(map_mapping[getState()], d.target.options.data.area.toUpperCase())
			$('.roti_main').css('display', 'none');
			$('#const_body').css('display', 'block');
		})

		if (data.Campaigned == 0) {
			$("#candidateBar").html('No Campaigns Found')
		} else {
			$("#candidateBar").html('')
			var sample_data = [{
				x: data.Leading,
				type: 'main'
			}, {
				x: data.Campaigned - data.Leading,
				type: 'sec'
			}]
			var cand = getCandidate()
			var bar = new StackedBar('#candidateBar', {
				main: party_colors[cand],
				sec: party_colors[cand],
				back: party_colors[cand]
			}, {
				left: 0,
				right: 0,
				top: 0,
				bottom: 0
			})
			$('#candidateBar svg').attr("viewBox", "0 0 933 200");
			setTimeout(function() {
				bar.render(sample_data, 'x', 1)
			}, 1000)
		}

		$("#candidateNumbers").html(
			_.templateFromURL('/roti/snippets.html', '#individual_template')({
				data: data
			})
		)

		var animatedNumbers = d3.select('#candidateAnimatedNumbers')

		animatedNumbers.selectAll('*').remove()

		var animatedText = animatedNumbers.append('text')
		animatedText.append('tspan')
			.attr('x', $(".col-md-9").width() / 2)
			.attr('y', $(".col-md-9").height() / 2)
			.style('font-size', "100px")
			.style('color', party_colors[cand])
			.attr('text-anchor', 'middle')
			.text(0)
			.transition()
			.duration(3000)
			.tween('text', function(d) {
				var interpolation = d3.interpolateNumber(0, data.Leading)
				var that = d3.select(this)
				return function(t) {
					return that.text(d3.format(".0f")(interpolation(t)))
				}
			})

		animatedText.append('tspan')
			.attr('dx', 30)
			.style('font-size', "100px")
			.attr('text-anchor', 'middle')
			.text(' / ' + data.Campaigned)

		animatedText.append('tspan')
			.attr('dx', 125)
			.style('font-size', "50px")
			.attr('text-anchor', 'middle')
			.text(0)
			.transition()
			.duration(3000)
			.tween('text', function(d) {
				var interpolation = d3.interpolateNumber(0, (data.Leading/data.Campaigned) * 100)
				var that = d3.select(this)
				return function(t) {
					return that.text('           (' + d3.format(".0f")(interpolation(t)) + '%)')
				}
			})

	}

	function getState() {
		var curr_url = G.url.parse(location.href)
		return curr_url.searchKey.state || 'up'
	}

	function getCandidate() {
		var curr_url = G.url.parse(location.href)
		return curr_url.searchKey.candidate.toLowerCase()
	}

})