function rectangle_3d_modf(width, height, color, data, max_val, val)
{
  var div = d3.select(document.createElement('g')).append("g");
  var rect3d = div

  var rh = height, rw = width, ang = 45;

    if(max_val){
      rw = val * rw / max_val
    }

  rect3d.append("rect")
    .attr("class", "forward_")
    .attr("x", -5)
    .attr("y", 2)
    .attr("width", rw)
    .attr("height", rh)
    .attr("style","fill:"+color)
    .style("fill-opacity", 0.8);

    rect3d.append("rect")
    .attr("class", "top_")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", rw)
    .attr("height", 12)
    .attr ("transform", "translate ("+(-16)+","+(-9)+") skewX("+ang+")")
    .attr("style", "fill:" + color)
    .style("fill-opacity", 0.4);

    rect3d.append("rect")
    .attr("class", "side_")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 12)
    .attr("height", rh)
    .attr ("transform", "translate ("+(-16)+","+(-9)+") skewY("+ang+")")
    .attr("style","fill:"+ color)
    .style("fill-opacity", 1);

  var part_txt = 34, y_pos = 70, stat_w = 250
  var currResolution = window.innerWidth;

  if (currResolution <= 1366){
      part_txt = 20
      y_pos = 40
      stat_w = 160
  }


if(Object.keys(data).length>0){

  rect3d.selectAll("rect_text").data([1])
    .enter()
    .append("rect")
    .each(function(d){
      var sel = d3.select(this)

      var stat_w = 250, rx = 5, ry = 5, op = 0.5;

      if(d == 2) stat_w = 10, rx = 0, ry = 0, op = 0.5;
      sel.attr("class", "rect-stats")
        .attr("x", rw - 5)
        .attr("y", 2)
        .attr("width", 1.4 * rw)
        .attr("height", rh)
        .attr("rx", rx)
        .attr("ry", ry)
        .style("fill", "#000")
        .style("fill-opacity", op)
    })

  var part_txt = 34, y_pos = 70
  var currResolution = window.innerWidth;
  if (currResolution <= 1366){
      part_txt = 30
      y_pos = 60
  }

  if (currResolution<=3273 && currResolution>2100){
      part_txt = 30
      y_pos = 60
  }

  rect3d.selectAll("party_text")
    .data([1, 2])
    .enter()
    .append("text")
    .each(function(d){
      var sel = d3.select(this)

      var disp_text = data.Seats, f_size = (2 * part_txt) + "px", class_num = "class_num"
      if(d == 2){
          y_pos = (2 * y_pos) - 15, f_size = part_txt + "px", disp_text = data.Name
          class_num = ''
        }

      sel.attr("class", "text-stats " + class_num)
        .attr("x", rw + 15)
        .attr("y", y_pos)
        .style("fill", "#fff")
        .style("font-size", f_size)
        .text(mask_to_hindi(disp_text))
    })

    rect3d.append("image")
      .attr("xlink:href", partyKeyImages[data.Name] || partyKeyImages['default'])
      .attr("height", rh)
      .attr("width", rw)
      .attr("x", -5)
      .attr("y", 2)

  }

  return div.html();
}