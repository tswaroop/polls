$(function(){

	state = 'punjab'

	// Globals
	var candidate_party_color = {
		'rahul gandhi': '#007DD8',
		'narendra modi': '#C77900',
		'mayawati': '#D62CA8',
		'others': '#9C9C9C',
		'arvind kejriwal': ''
	}
	var bottom_color = {
		'rahul gandhi': '#121869',
		'narendra modi': '#A93700',
		'arvind kejriwal': ' #3D6C1A',
		'mayawati': '#D62CA8'
	}

/*	var top_left_color = {
		'rahul gandhi': 'rgba(0,125,216,0.71)',
		'narendra modi': 'rgba(199,121,0,0.71)'
	}

	var bottom_left_color = {
		'rahul gandhi': 'rgba(13,52,136,0.81)',
		'narendra modi': 'rgba(199,121,0,0.81)'
	}

	var head_color = {
		'rahul gandhi': 'rgba(81,183,255,0.71)',
		'narendra modi': 'rgba(255,197,106,0.71)'
	}*/

	var json_file_for_state = {
		'uttar pradesh': 'up_ac_map.json',
		'punjab': 'punjab_ac_map.json'
	}

	var widths_and_heights_bars = {
		'uttar pradesh individual_candidate': [280, 430],
		'punjab individual_candidate': [280, 430],
		'uttar pradesh multiple_candidates': [800, 100],
		'punjab multiple_candidates': [800, 100], // width is given to height and height to width
	}

	var widths_and_heights_tiles = {
		'uttar pradesh individual_candidate': [400, 500],
		'punjab individual_candidate': [400, 500],
		'uttar pradesh multiple_candidates': [450, 550],
		'punjab multiple_candidates': [300, 380], // width is given to height and height to width
	}

	function get_config(this_, i, tile_or_bar, data){
		var cur_id = this_.attr("id");
		var name_of_person = cur_id.split(tile_or_bar+'_')[1].replace('_', ' ').toLowerCase();
		var person_data = _.filter(data, function(obj){ return obj.Name.toLowerCase() == name_of_person.toLowerCase(); })[0];
		var left_or_right = 'left'; //i%2 == 0 ? 'left' : 'right';
		var config = {
			"Name" : name_of_person,
			"selector" : '#'+cur_id,
			"left_or_right" : left_or_right,
/*			"width": "100",
			"height": "100",*/
			"tile_or_bar": tile_or_bar,
			"data": person_data
		}
		return config
	}

	function load_template(selector, data, state, individual_or_multiple){
		if (individual_or_multiple == 'individual_candidate'){
			var template_id = '#individual_template'
		}
		else{
			var template_id = state == 'uttar pradesh' ? '#two_person_template' : '#three_person_template'
		}
		$(selector).html('');
		if (template_id == '#two_person_template'){
			$(selector).html(_.templateFromURL('snippets.html', template_id)(
				{
					'candidates_data': data //.slice(0, 2)
				}
			))
			/*$(selector).append(_.templateFromURL('snippets.html', template_id)(
				{
					'candidates_data': data.slice(2, 4)
				}
			))*/
		}
		else{
			$(selector).html(_.templateFromURL('snippets.html', template_id)(
				{
					'candidates_data': data
				}
			))
		}
	}
	function draw_tiles(selector, data, state, individual_or_multiple){
		/*var width = state == 'up' ? 450 : 300;
		var height = state == 'up' ? 550 : 300;*/
		var width = widths_and_heights_tiles[state+' '+individual_or_multiple][0];
		var height = widths_and_heights_tiles[state+' '+individual_or_multiple][1];
		$(selector).each(function(i, e){
			var config_ = get_config($(this), i, 'tile', data)
			var name_of_person = config_.Name;
			config_.top_color = candidate_party_color[name_of_person];
			config_.bottom_color = bottom_color[name_of_person];
			/*config_.top_left_color = top_left_color[name_of_person];
			config_.bottom_left_color = bottom_left_color[name_of_person];
			config_.head_color = head_color[name_of_person];*/
			config_.svg_width = width;
			if (state == 'punjab' && individual_or_multiple == 'multiple_candidates'){
				config_.svg_height = '350';
			}
			if (individual_or_multiple == 'individual_candidate')
				config_.svg_height = '450';
			config_.left_or_right = state == 'up' ? config_.left_or_right : 'left'
			config_.individual_or_multiple = individual_or_multiple
			config_.state = state;
			draw_vertical_tile(config_);
			// data_ = _.filter(data, function(obj){ return obj.Name.toLowerCase() == name_of_person.toLowerCase(); })[0];
			// console.log(data_.Picture);
			// image_rectangle(config_.selector,'ABC',data.Picture,400,400)
		});
	}
	function draw_bars(selector, data, state, individual_or_multiple){
		$(selector).each(function(i, e){
			var config_ = get_config($(this), i, 'bar', data)
			var name_of_person = config_.Name;
			// config_.head_color = head_color[name_of_person];
			config_.top_color = "#404040";
			config_.bottom_color = candidate_party_color[name_of_person];
/*			config_.top_left_color = "#242424";
			config_.bottom_left_color = top_left_color[name_of_person]*/
			config_.width = widths_and_heights_bars[state+' '+individual_or_multiple][0]
			config_.height = widths_and_heights_bars[state+' '+individual_or_multiple][1]
			config_.state = state;
			config_.individual_or_multiple = individual_or_multiple;
			if (state == 'punjab' && individual_or_multiple == 'multiple_candidates'){
				draw_3d_horizontal_bar(config_);
			}
			else{
				config_.head_color = "#6F6F6F";
				draw_3d_vertical_bar(config_)
			}
		});
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
	function generate_search_string(args, new_k_v){
		var newUrl = '';

		if ((_.keys(args)).indexOf(_.keys(new_k_v)[0]) >= 0){
			// Replacing existing values for existing key
			if (['phases', 'regions'].indexOf((_.keys(new_k_v)[0])) < 0){
				args[_.keys(new_k_v)[0]] = new_k_v[_.keys(new_k_v)[0]];
			}
			else{
				args[_.keys(new_k_v)[0]] = new_k_v[_.keys(new_k_v)[0]];
			}
			new_k_v = {};
		}

		if (_.keys(args).length != 0){
			_.each(_.keys(args), function(e,i){
				if (i == 0){
					newUrl = newUrl + '?'+e+'='+args[e];
				}
				else{
					newUrl = newUrl + '&'+e+'='+args[e];
				}
			})
			newUrl = _.keys(new_k_v)[0] != undefined ?newUrl + '&'+_.keys(new_k_v)[0]+'='+_.values(new_k_v)[0] : newUrl
		}
		else{
			newUrl = '?'+_.keys(new_k_v)[0]+'='+_.values(new_k_v)[0]
		}
		return newUrl
	}

	function updateUrlParameter(param, value) {
		var args = get_args();
		var new_ele = {}
		new_ele[param] = value;
		newUrl = generate_search_string(args, new_ele);
        /*const regExp = new RegExp(param + "(.+?)(&|$)", "g");
        const newUrl = window.location.href.replace(regExp, param + "=" + value + "$2");*/
        window.history.pushState("", "", newUrl);
    }

	function load_header(){
		d3.json('../data/eng_hindi_map.json', function(data){
		    hindi_words_mapping = data
		    
		    var all_states = [
		      'uttar pradesh',
		      // 'uttarakhand',
		      'punjab',
/*		      'goa',
		      'manipur'*/
		    ]

		    var all_years = [
		      // '2009',
		      // '2012',
		      '2017'
		    ]

		    var parsed_url = G.url.parse(location.href)
		    var lang = parsed_url.searchKey.lang || null
		    var state = parsed_url.searchKey.state.replace('-',' ') || 'uttar pradesh'
		    var year = parsed_url.searchKey.year || '2017'
		    var constituency = parsed_url.searchKey.constituency || null

		    // all_states.splice(all_states.indexOf(state),1)
		    all_states = _.filter(all_states, function(obj){ return obj != state.toLowerCase(); });
		    // all_years.splice(all_years.indexOf(year),1)

		    $("#header").html(_.templateFromURL('snippets.html','#header-template')({
		      data: {
		        states: all_states,
		        years: all_years
		      }
		    }))

		    if(lang && lang.toUpperCase() == 'HIN'){
		      $("#title").css("margin-left", "calc(50% - 75px)");
		    }

		    // if(state && year && checkValidity(state,year)){
		      $(".dropdown span:first").text(state.toUpperCase())
		      $(".dropdown span:last").text(year)
		    // }

            $('#otherstates p').on('click', function(){
                var state1 = $(this).text();
                // window.history.replaceState(null, null, "/roti/?state="+state1)
                updateUrlParameter('state', state1);
                var dropdown_elements = _.filter(all_states, function(state){ return state != state1.toLowerCase() })
				$('#candidate_comparison').show();
				$('#individual_candidate_container').hide();
				$('#candidate_comparison').html('');
				updateUrlParameter('phases', []);
				updateUrlParameter('regions', []);
                default_load();
            })

		    // displayFilters($(".dropdown span:first").text().toLowerCase())
		    $('.refresh').on('click', function(){
		    	var args = get_args();
				var state = args.state.toLowerCase()
		    	d3.json('/refresh_roti_data?state='+state, function(data){
		    		default_load();
					bind_clicks();
		    	})
		    })
	    })
	}

	function load_map_filters(data){
		var args = get_args();
		var prev_selections = {}
		prev_selections['Phases'] = args.phases.split(',');
		prev_selections['Regions'] = args.regions.split(',');
		$('#map_filters').html(_.templateFromURL('snippets.html', '#map_filters')(
			{
				'data': data,
				'prev_selections': prev_selections
			}
		))
	}
	
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

	function get_args(){
		var args = G.url.parse(location.href).searchKey;
        return args;
	}

	function change_layout_of_container(state){
		if (state != 'punjab'){
			$('#candidate_comparison_container .col-lg-1').css('display', 'none');
			$('#candidate_comparison_container .col-lg-10').removeClass('col-lg-10').addClass('col-lg-12')
		}
		else{
			$('#candidate_comparison_container .col-lg-1').css('display', 'block');
			$('#candidate_comparison_container .col-lg-12').removeClass('col-lg-12').addClass('col-lg-10')	
		}
	}

	function default_load(){
		var args = get_args();
		var state = args.state.toLowerCase();
		$('body').attr("class", state.replace(' ', '_')+" multiple");
		// var state = state_name_mapping[args.state.toLowerCase()]

        // Change layout based on state
        change_layout_of_container(state);

		// Start of D3 Json Request
		d3.json('/get_candidates_data?state='+state, function(error, data){
			var data = data["data"];
			load_header();
			load_template("#candidate_comparison", data, state, 'multiple_candidates');
			draw_tiles('#candidate_comparison [id^="tile_"]', data, state, 'multiple_candidates');
			draw_bars('#candidate_comparison [id^="bar_"]', data, state, 'multiple_candidates');
			/*var color_of_highlighter = $('.leading_container .highlight_encloser svg rect').attr("fill");*/
			/*$('.leading_container .highlight_encloser').css('border', '13px solid '+color_of_highlighter);*/
			bind_clicks();

		}) // End of D3 Json Request
	}
	function redraw_map(phases, regions, name_of_person){
		var args = get_args();
		var state = args.state.toLowerCase();
		var json_filename = json_file_for_state[state]

		d3.json("/get_map_filtered_data?phases="+phases+"&regions="+regions+'&state='+state+'&name_of_person='+name_of_person, function(data){
	    	var const_data = data["data"]["0"]["const_data"];
	    	leaflet_roti.render('../geojson/'+json_filename, null, const_data, map_click_event);
		})
	}


	function map_click_event(ele){
		var args = get_args();
		var state = args.state.toLowerCase();
		var clickeded_area = ele.target.options.data.area.toUpperCase();
		if(ele.target.options.fillColor != '#858585'){
		      popUp(state, clickeded_area);
		      $('.roti_main').css('display', 'none');
		      $('#const_body').css('display', 'block');
		}

		// $('#modal_container').html($('iframe').contents()[0].body.innerHTML)
/*        $.get("/constituencyPop?ac_name=BEHAT", function(data, error){
            	console.log(data.responseText, "&&&&&&&&&&&7", data, error);
            	$('#modal_window .modal-body').html(String(data));
				$('#modal_window').modal('show', {backdrop: 'static'});
            });
        console.log("After modal window");*/

	}
	function load_individual_candidate_data(name_of_person, callfrom){
		var args = get_args();
		var state = args.state.toLowerCase();
		var phases = args.phases;
		var regions = args.regions;
		if (callfrom == 'clear_map_filters'){
			phases = [];
			regions = [];
			updateUrlParameter('phases', []);
			updateUrlParameter('regions', []);
		}
		$('body').attr("class", state.replace(' ', '_')+" individual")
		var json_filename = json_file_for_state[state]
		$("#header").addClass("header");
		// $('#filter-state').addClass('hide_dropdown_header')
		d3.json('/get_individual_data?state='+state+'&name_of_person='+name_of_person+"&phases="+phases+"&regions="+regions, function(error, data){
			var individual_data = data["data"];
			$('#candidate_comparison').hide();
			$('#individual_candidate_container').show();
			// Loading Map
	        leaflet_roti.render('../geojson/'+json_filename, null, data["data"]["0"]["const_data"], map_click_event);
			load_map_filters(data["data"]["0"]["phases_regions_data"]);
			/*load_template('#individual_candidate', individual_data, state, 'individual_candidate')
			draw_tiles('#individual_candidate_container [id^="tile_"]', individual_data, state, 'individual_candidate');*/
			// $('[id^="bar_"]').each(function(){$(this).css("height:100px;width:400px;")});
	        // leaflet.render('../geojson/up_ac_map.json', 'BEHAT', null, null);

			load_template('#individual_candidate', individual_data, state, 'individual_candidate')
			draw_tiles('#individual_candidate_container [id^="tile_"]', individual_data, state, 'individual_candidate');
			draw_bars('#individual_candidate_container [id^="bar_"]', individual_data, state, 'individual_candidate');
			bind_clicks();
			$('#individual_candidate [id^="tile_"]').on('click', function(){
				var cur_id = $(this).attr("id");
				var name_of_person = cur_id.split('tile_')[1].replace('_', ' ').toLowerCase();
				$('#individual_candidate_container').hide();
				// default_load();
				$('body').attr("class", state.replace(' ', '_')+" multiple");
				$('#candidate_comparison').show();
				$("#header").removeClass("header");
				// $('#filter-state').removeClass('hide_dropdown_header')
			})
		})
	}

	function bind_clicks(){
		$('#candidate_comparison [id^="tile_"] svg').on('click', function(){
			var cur_id = $(this).parent().attr("id");
			var name_of_person = cur_id.split('tile_')[1].replace('_', ' ').toLowerCase();
			load_individual_candidate_data(name_of_person, undefined);
		})

		$('#map_filters button').on('click', function(){
			if (! $(this).hasClass("active"))
				$(this).addClass("active")
			else
				$(this).removeClass("active")
			var phases = [];
			var regions = [];
			var name_of_person = $('#individual_candidate [id^="tile_"]').attr("id").split('tile_')[1].replace('_', ' ').toLowerCase();
			$('#map_filters .phases button[class$=active]').each(function(i, e){phases.push(e.innerHTML)});
			$('#map_filters .regions button[class$=active]').each(function(i, e){regions.push(e.innerHTML)});
			updateUrlParameter('phases', phases);
			updateUrlParameter('regions', regions);
			updateUrlParameter('name_of_person', name_of_person);
			// if ($(this).attr("id") != 'clear_map_filters')
				// redraw_map(phases, regions, name_of_person);
				load_individual_candidate_data(name_of_person, $(this).attr("id"));
			// else
				// load_individual_candidate_data(name_of_person);
		})

		// $('#otherstates p').on('click', function(){
  //         	var args = G.url.parse(location.href).searchKey;
  //         	console.log(args, "---------");
		// 	default_load(state_name_mapping[$(this).text().toLowerCase()]);
		// })
	}
	load_header();
	default_load();
	bind_clicks();
})