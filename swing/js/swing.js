swing_module = function(){

    var main_data = {};
    var parties = [];
    var hindi_words_mapping = {};
    var leaflet = new Map('mapContainer');
    /*Reduces the elements opacity if previous opacity is 1 and vice versa.*/
    function toggleOpacity(element){
      if(element.css('opacity') == 1){
        element.css('opacity' , 0.2);
        return;
      }
      element.css('opacity' , 1); return;
    }

    /*Renders Header*/
    function render_header(){
        $("#header").html(_.templateFromURL('swing-snippets.html','#header-template')({
        data: {
          states: _.keys(state_name_mapping),
          title: "GAMECHANGERS"
        }
        }));
    }


    function render_modal(d) {
      var state = G.url.parse(window.location.href).searchKey.state;
      state = state ? state : 'uttar pradesh';      
      popUp(state, d.target.options.data.area.toUpperCase());
      // $('#parent_container').css('display', 'none');
      $(window).scrollTop(0);
      $('#header').css('display', 'none');
      $('#const_body').css('display', 'block');

    }

    /*Renders the Parties Lead, Trail info buttons, driven with data.*/
    function render_swing_btns(data, clicked_btn, hasClass){

        $("#swing_buttons")
        .html(_.templateFromURL('swing-snippets.html','#swing_buttons_template')({
        data: data, clicked_btn: hasClass? '' : clicked_btn, parties: parties
        }));

    }

    function get_main_data(){
      return main_data;
    }

    /*Counts Leading and Trailing Seats for each party.*/
    function get_lead_trail_data(filter){
        var data = main_data;
        
        if(filter){
          var const_name = _.uniq(_.map(_.filter(data, filter), 'ConstName'));
          data = _.filter(data, function(x){
                return const_name.indexOf(x.ConstName) >= 0;
                return x.ConstName.indexOf(const_name) >= 0;
                })
            
        } 
        var d = [];
        var party_grp = _.groupBy(data, function(d){
        return d.Party;
        });

        if(parties.length > 0){
            _.forEach(parties, function(party){
                var counts = _.countBy(party_grp[party], 'CandiStatus');
                counts['Party'] = party;
                d.push(counts);
            });
        }
        else{
            _.mapKeys(party_grp, function(v, k){
            var counts = _.countBy(v, 'CandiStatus');
            counts['Party'] = k;
            d.push(counts);
        });            
        }
        return d;
    }


    function get_map_data(filter){
        var const_color_dict = {};

        _.map(_.filter(main_data, filter),
          function(d){ 
            const_color_dict[d.ConstName.toUpperCase()] = partyColors[d.Party];
        });

        return const_color_dict;

    }

    /*Returns Hindi Phrase equivalent to English Phrase.*/
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
    

    function get_lead_margin(margin1, margin2){
      if(margin1 == margin2){
          var cnt = _.countBy(main_data, function(d){ return d.Margin < margin1 && d.CandiStatus == 'WON' })[true];
          return [cnt, cnt];
      }
      return [_.countBy(main_data, function(d){ return d.Margin < margin1 && d.CandiStatus == 'WON' })[true],
      _.countBy(main_data, function(d){ return d.Margin < margin2 && d.CandiStatus == 'WON' })[true]]

    }

    /*Fetches data from Server..*/
    function get_data(refresh=false){
      var state = G.url.parse(window.location.href).searchKey.state;
      state = state ? state : 'uttar pradesh';
      url = "?state="+state;
      url = refresh ? url+"&refresh=1" : url;
      var lang = G.url.parse(window.location.href).searchKey.lang || 'ENG';

        d3.json('/swing_data'+url, function(result){
            data = JSON.parse(result['data']);
            parties = result['parties'];
            hindi_words_mapping = result['hindi_mapping'];
            render_header();
            main_data = [];

            var c1 = lang.toUpperCase() == 'HIN' ? 'total-txt-hin' : '';
            var c2 = lang.toUpperCase() == 'HIN' ? 'lead-margin-txt-hin' : 'disp-txt';

            $('#total-txt')
            .attr('class', c1)
            .text(mask_to_hindi('Total'));

            $('#lead-margin-txt')
            .attr('class', c2)
            .text(mask_to_hindi('Lead Margin'));

            _.flatMap(_.groupBy(data, 'ConstName'), function(d){
              var x = 0;
              if(d.length == 1){
                x = 100 * Math.abs(d[0].Votes)/d[0].ValidVotes;
                d[0]['Margin'] = x;
                main_data.push(d[0]);
                main_data.push(d[0]);
              }
              else{
               x = 100 * Math.abs(d[0].Votes - d[1].Votes)/d[0].ValidVotes; 
              d[0]['Margin'] = x;
              d[1]['Margin'] = x;
              main_data.push(d[0]);
              main_data.push( d[1]);
              }
            });
            var lead_trail_data = get_lead_trail_data(function(d){ return d.Margin < 1; });
            // parties = _.map(lead_trail_data, 'Party');
            render_swing_btns(lead_trail_data);

            leaflet.render('/geojson/'+state_file_mapping[state.toLowerCase()], {}, get_map_data(
              function(d){ return d.CandiStatus == 'WON' && d.Margin < 1; }
              ), render_modal);
            
            var margins = get_lead_margin(1, 2);
            $('#less_one_btn').addClass('clicked');
            $('#less_two_btn').removeClass('clicked');
            $('#less_one_txt').text(margins[0] ? margins[0] : 0);
            $('#less_two_txt').text(total_seats[state.toUpperCase()]);

        });
    }

    return {
        data: main_data,
        get_data: get_data,
        render_swing_btns: render_swing_btns,
        render_header: render_header,
        mask_to_hindi: mask_to_hindi,
        toggleOpacity: toggleOpacity,
        get_lead_trail_data: get_lead_trail_data,
        get_main_data: get_main_data,
        get_map_data: get_map_data,
        leaflet : leaflet,
        get_lead_margin : get_lead_margin,
        render_modal: render_modal
    }

}();





