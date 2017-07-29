// ============== Old Code =======================

function draw_vertical_tile(config){
    var left_or_right = config.left_or_right
    var selector = config.selector
    var top_color = config.top_color
    var bottom_color = config.bottom_color
    var top_left_color = config.top_left_color
    var bottom_left_color = config.bottom_left_color
    var tile_or_bar = config.tile_or_bar
    var text_color = config.text_color || "#FFFFFF";

    var head_color = config.head_color;
    var data = config.data;
    var text_to_display = tile_or_bar == 'tile' ? titleCase(data.Name) : data.Leading+'/'+data.Campaigned;
    var text_font_size = tile_or_bar == 'tile' ? "70px" : "60px";

    var percentage_text_font_size = "70px"
    var percentage_text_to_display = data.Percentage + '%' || '';

    var width = config.width || 550;
    var height = config.height || 550;

    var svg_width = config.svg_width || 550;
    var svg_height = config.svg_height || 950;

    // View Box is set a width and height of 550 for tile
    var svg_viewBox = tile_or_bar == 'tile' ? "-30 120 550 350" : "-30 -30 "+svg_width+" "+svg_height

/*    // Scales
    var y_scale = d3.scaleLinear().domain([0,50]).range([0, svg_height])

    var g_x_pos = 0;
    if (tile_or_bar != 'tile'){
        if (left_or_right == 'left'){
            g_x_pos = 30
        }
        else{
            g_x_pos = -30
        }
    }
    else{
        g_x_pos = 0
    }
    var g_y_pos = tile_or_bar == 'tile' ? 0 : svg_height - y_scale(data.Percentage)

    var g_translate = "translate("+g_x_pos+","+g_y_pos+")"

    // Adjustments
    var height =  tile_or_bar == 'tile' ? height : y_scale(data.Percentage)


    var top_left_tile_config = {}
    var bottom_left_tile_config = {}
    var head_tile_config = {}

    var tile_width = width-90;
    var image_height = height-90;
    var tile_height = parseInt(height / 1.66);
    var left_width = parseInt(width / 13.5);
    var bottom_height = parseInt(height / 4);
    var top_height = parseInt(height / 11);
    var bottom_tile_y = parseInt(height / 1.6) - 3;
    var bottom_left_tile_y = parseInt(height / 2.1);
    var bottom_left_translate_y = parseInt(height / 18);
    var bottom_right_translate_y = parseInt(height / 6);
    var top_left_height = parseInt(height / 1.65);
    var text_y_pos = parseInt(height / 1.28);
    var head_tile_left = parseInt(height / 9.3);

    // Adjustments
    head_tile_left = tile_or_bar == 'tile' ? head_tile_left : 30
    top_height = tile_or_bar == 'tile' ? top_height : 20
    left_width = tile_or_bar == 'tile' ? left_width : 20

    // Config
    top_left_tile_config.x = "10";
    top_left_tile_config.y = "10";

    bottom_left_tile_config.x = "10";
    bottom_left_tile_config.y = bottom_left_tile_y;

    head_tile_config.x = "10";
    head_tile_config.y = "10";

    if (left_or_right == 'left'){
        if (tile_or_bar == 'bar'){
            top_left_tile_config.translate = "translate(-"+left_width+", -"+(top_height+10)+") skewY(45)";
        }
        else{
            top_left_tile_config.translate = "translate(-"+left_width+", -"+top_height+") skewY(45)";
        }
        bottom_left_tile_config.translate = "translate(-"+left_width+", "+bottom_left_translate_y+") skewY(45)";
        head_tile_config.translate = "translate(-"+head_tile_left+", -"+top_height+") skewX(45)";
    }
    else {
        top_left_tile_config.translate = "translate("+tile_width+", 10) skewY(-45)";
        bottom_left_tile_config.translate = "translate("+tile_width+", "+bottom_right_translate_y+") skewY(-45)";
        head_tile_config.translate = "translate("+head_tile_left+", -"+top_height+") skewX(-45)";
    }*/

    var tile = d3.select(selector)
    tile.html('');

    var svg = tile.append("svg")
                .attr("width", "150%")
                .attr("height", svg_height)
                // .attr("preserveAspectRatio", "xMinYMin slice")
                .attr("viewBox", "-30 -70 550 1000")
                .attr("class", left_or_right+' '+config.state+' '+config.individual_or_multiple)
                .attr("preserveAspectRatio", "xMinYMin meet")
                .append("g")
                .attr("transform", "translate(20,0)")

/*    if (tile_or_bar == 'bar'){
        var percentage_text = svg.append("text")
                .attr("x", left_width)
                .attr("y", "-30")
                .attr("fill", "#242424")
                .attr("font-size", percentage_text_font_size)
                .text(percentage_text_to_display)
    } */
    if (config.state == 'uttar pradesh' && config.individual_or_multiple == 'multiple_candidates'){
        var width_top_tile = "100%"
        var width_bottom_tile = "100%"
        var width_image = "90%"
        var height_image = "720px"
    }
    else{
        var width_top_tile = "91%"
        var width_bottom_tile = "91%"
        var width_image = "90%"
        var height_image = "720px"
    }
    var top_tile = svg.append("rect")
                        .attr("x", "10")
                        .attr("y", "10")
                        .attr("width", width_top_tile)
                        .attr("height", "600px")
                        .attr("fill", top_color)

     if (tile_or_bar == 'tile'){
        var person_image = svg.append("image")
                            .attr("x", 10)
                            .attr("y", 0)
                            .attr("width", width_image)
                            .attr("height", height_image)
                            .attr("xlink:href", data.Picture)
    }
    if (config.state == 'uttar pradesh' && config.individual_or_multiple == 'multiple_candidates'){
        var text_rect = svg.append("rect")
                        .attr("x", "-40")
                        .attr("y", "710px")
                        .attr("width", "101%")
                        .attr("height", "250px")
                        .attr("fill", "#747474")
    }

    var bottom_tile = svg.append("rect")
                        .attr("x", 10)
                        .attr("y", "610px")
                        .attr("width", width_bottom_tile)
                        .attr("height", "150px")
                        .attr("fill", bottom_color)
                        // .attr("fill-opacity", "0.4")
                        // .attr("transform", "skewY(45)")

    var head_tile = svg.append("rect")
                        .attr("x", 13)
                        .attr("y", -11)
                        .attr("width", "91%")
                        .attr("height", "50px")
                        .attr("fill", top_color)
                        .attr("transform", "translate(-40, -30) skewX(45)")
                        .attr("fill-opacity", "0.6")

    var top_left_tile = svg.append("rect")
                        .attr("x", "-39")
                        .attr("y", "-2")
                        .attr("width", "9%")
                        .attr("height", "600px")
                        .attr("fill", top_color)
                        .attr("transform", "skewY(45)")
                        .attr("fill-opacity", "0.71")
    

    var text = svg.append("text")
                .attr("x", 40)
                .attr("y", "700")
                .attr("fill", "#FFF")
                .attr("font-size", "70px")
                .text(text_to_display)
    
    var bottom_left_tile = svg.append("rect")
                        .attr("x", "-39")
                        .attr("y", "600px")
                        .attr("width", "9%")
                        .attr("height", "150px")
                        .attr("fill", bottom_color)
                        .attr("transform", "skewY(45)")
                        // .attr("style", "opacity:0.5;")
                        // .attr("fill-opacity", "0.71")

    if (config.state == 'uttar pradesh' && config.individual_or_multiple == 'multiple_candidates'){
        var percentage_text = svg.append("text")
                    .attr("x", "125")
                    .attr("y", "900")
                    .attr("fill", partyColors[data['AllianceName']])
                    .attr("font-size", "70px")
                    .text(percentage_text_to_display)
                    .attr("class", "tile_bottom");
    }

}

// ============== Old Code Ends Here =============

function draw_3d_horizontal_bar(config){

    var left_or_right = config.left_or_right
    var selector = config.selector
    var top_color = config.top_color
    var bottom_color = config.bottom_color
    var top_left_color = config.top_left_color
    var bottom_left_color = config.bottom_left_color
    var tile_or_bar = config.tile_or_bar
    var text_color = config.text_color || "#FFFFFF";
    var text_size = config.text_size || "40px";

    var head_color = config.head_color;

    var width = config.width
    var width_unmod = config.width
    var height = config.height
    var height_unmod = config.height
    var selector = config.selector
    var data = config.data
    var text = data.Leading+'/'+data.Campaigned;
    var max_val = config.state == 'uttar pradesh' ? 403 : 117
    var margin = {
        'left': (width*5)/100,
        'right': (width*5)/100,
        'top': (width*5)/100,
        'bottom': (width*5)/100
    }
    var padding = {
        'left': 30,
        'right': 30,
        'top': 30,
        'bottom': 30
    }

    var modified_width = width - (margin.left + margin.right)
    var modified_height = height //- (margin.top + margin.bottom)

    var g = d3.select(selector).append("svg")
                    .attr("width", modified_width)
                    .attr("height", modified_height)
                    .attr("viewBox", "-30 0 "+modified_width+" "+modified_height)
                    .attr("preserveAspectRatio", "xMinYMin meet")
                    .append("g")

    var x_scale = d3.scaleLinear().domain([0, max_val]).range([0, (width*80)/100])
    // var left_width_scale = d3.scaleLinear().domain([0, height]).range([0, 20])

    // height is modified as all the elements height should be based on the calculated height
    /*var width_bar = x_scale(data.Percentage)
    var left_width = (width_bar * 20) / 100*/
    var left_width = x_scale(data.Leading)
    var bottom_width = x_scale(data.Campaigned)
    bottom_width = bottom_width + left_width > (width*80)/100 ? bottom_width - left_width : bottom_width;

    var head_tile = g.append("rect")
                    .attr("width", 10)
                    .attr("height", 49)
                    .attr("x", 20)
                    .attr("y", 0)
                    .attr("transform", "skewY(45)")
                    .style("fill", bottom_color)
                    .attr("fill-opacity", "0.51")

    var party_color_tile = g.append("rect")
                        .attr("width", left_width)
                        .attr("height", 50)
                        .attr("x", padding.left)
                        .attr("y", padding.top)
                        .style("fill", bottom_color)

    var bottom_tile = g.append("rect")
                    .attr("width", bottom_width)
                    .attr("height", 50)
                    .attr("x", left_width+padding.left)
                    .attr("y", padding.top)
                    .style("fill", top_color)

    var party_color_left_tile = g.append("rect")
                    .attr("width", left_width)
                    .attr("height", 10)
                    .attr("x", 0)
                    .attr("y", 20)
                    .attr("transform", "skewX(45)")
                    .style("fill", bottom_color)
                    .attr("fill-opacity", "0.71")

    var bottom_left_tile = g.append("rect")
                    .attr("width", bottom_width)
                    .attr("height", 10)
                    .attr("x", left_width)
                    .attr("y", 20)
                    .attr("transform", "skewX(45)")
                    .style("fill", top_color)
                    .attr("fill-opacity", "0.71")

    var party_tile_text = g.append('text')
                            .attr("x", 45)
                            .attr("y", 70)
                            .attr("fill", text_color)
                            .attr("font-size", text_size)
                            .text(text)

}

function draw_3d_vertical_bar(config){

    var left_or_right = config.left_or_right
    var selector = config.selector
    var top_color = config.top_color
    var bottom_color = config.bottom_color
    var top_left_color = config.top_left_color
    var bottom_left_color = config.bottom_left_color
    var tile_or_bar = config.tile_or_bar
    var text_color = config.text_color || "#FFFFFF";
    var text_size = "25px";

    var head_color = config.head_color;

    var width = config.width
    var width_unmod = config.width
    var height = config.height
    var height_unmod = config.height
    var selector = config.selector
    var data = config.data
    var text = data.Leading+'/'+data.Campaigned;
    var max_val = config.state == 'uttar pradesh' ? 404 : 117;
    var margin = {
        'left': (width*5)/100,
        'right': (width*5)/100,
        'top': (width*5)/100,
        'bottom': (width*5)/100
    }
    var padding = {
        'left': 30,
        'right': 30,
        'top': 12,
        'bottom': 30
    }

    var modified_width = width - (margin.left + margin.right)
    var modified_height = height - (margin.top + margin.bottom)

    var y_scale = d3.scaleLinear().domain([0,max_val]).range([0, (height*80)/100])
    // var left_width_scale = d3.scaleLinear().domain([0, height]).range([0, 20])

    // height is modified as all the elements height should be based on the calculated height
    var bottom_height = y_scale(data.Leading)//(bar_height * 20) / 100
    var top_height = y_scale(data.Campaigned)//(bar_height * 80) / 100 //height - bottom_height
    top_height = top_height + bottom_height > (height*80)/100 ? top_height - bottom_height : top_height
    var bar_height = bottom_height + top_height
    var head_tile_height = 19

    var svg = d3.select(selector).append("svg")
                    .attr("width", modified_width)
                    .attr("height", height + padding.top + margin.top)
                    .attr("viewBox", "-30 0 "+modified_width+" "+(height + padding.top + margin.top))
                    .attr("preserveAspectRatio", "xMinYMin meet")
    var g_text = svg.append("g")
            .attr("transform", "translate(0 "+(height-bar_height)+")")

    var g_text_ = g_text.append("text")
                    .attr("x", 20)
                    .attr("y", 0)
                    .attr("font-size", text_size)
                    .attr("class", "vertical_bar_percentage")
                    .text(data.Percentage + '%')

    var g = svg.append("g")
                    .attr("transform", "translate(0 "+(height-bar_height)+")")


    var head_tile = g.append("rect")
                    .attr("width", 90)
                    .attr("height", head_tile_height)
                    .attr("x", 0)
                    .attr("y", padding.top)
                    .attr("transform", "skewX(45)")
                    .style("fill", top_color)
                    .attr("fill-opacity", "0.71")

    var top_tile = g.append("rect")
                        .attr("width", 90)
                        .attr("height", top_height)
                        .attr("x", padding.left)
                        .attr("y", padding.top+head_tile_height)
                        .style("fill", top_color)

    var bottom_tile = g.append("rect")
                    .attr("width", 90)
                    .attr("height", bottom_height)
                    .attr("x", padding.left)
                    .attr("y", top_height+head_tile_height)
                    .style("fill", bottom_color)

    var bottom_left_tile = g.append("rect")
                    .attr("width", head_tile_height)
                    .attr("height", bottom_height)
                    .attr("x", 11)
                    .attr("y", top_height-padding.top)
                    .attr("transform", "skewY(45)")
                    .style("fill", bottom_color)
                    .attr("fill-opacity", "0.71")

    var top_left_tile = g.append("rect")
                    .attr("width", head_tile_height)
                    .attr("height", top_height - margin.top + 2)
                    .attr("x", 11)
                    .attr("y", 0)
                    .attr("transform", "skewY(45)")
                    .style("fill", top_color)
                    .attr("fill-opacity", "0.71")

    var party_tile_text = g.append('text')
                            .attr("x", 35)
                            .attr("y", (top_height+bottom_height))
                            .attr("fill", text_color)
                            .attr("font-size", text_size)
                            .text(text)

}

function image_rectangle(img_div,key_position,img_src,width,height){
    console.log(img_src ,"---------------")
  var svg = d3.select(img_div).append('svg').attr("width",width).attr("height",height);
  var rect3d = svg.append('g')
      .attr("transform", "translate (20,30)")
  ;
  var rh = 240, rw = 240, ang=45;
  rect3d.append("rect")
    .attr("class", "forward")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", rw)
    .attr("height", rh)
    .style("fill","#C9C9C9");
    
    rect3d.append("rect")
    .attr("class", "top")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", rw)
    .attr("height", 17)
    .attr ("transform", "translate ("+(-17)+","+(-17)+") skewX("+ang+")")
    .style("fill","#C9C9C9");
    
    rect3d.append("rect")
    .attr("class", "side")
     .attr("x", 0)
    .attr("y", 0)
    .attr("width", 17)
    .attr("height", rh)
    .attr ("transform", "translate ("+(-17)+","+(-17)+") skewY("+ang+")")
    .style("fill","#6F6F6F");;
    var im = rect3d.append("image").attr('x',0)
     .attr('y',0)
     .attr('width', 240)
     .attr('height', 240)
     .attr("xlink:href",img_src)
    gg = svg.append("g")
    gg.append("rect")
      .attr("x","20")
      .attr("y","201")
      .attr("width",240)
      .attr("height",68)
       // .append("animate").attr("attributeType","XML").attr("attributeName","fill").attr("values","gray;black;gray;black")
       //              .attr("dur","1.5s")
       //              .attr("repeatCount","indefinite")
      .style("fill","black")
      .style("opacity","0.71449393")
    gg.append("text").attr("x",64)
      .attr("y",250)
      .text(function(){
            if(key_position == 0){
              return "LEADING"
            }else{
              return "TRAILING"
            }
      })
     .attr("class",function(){
              if(key_position==0){
                return "lead_cls"
              }else{
                return "trail_cls"
              }
      })
}