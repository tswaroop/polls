var partyColors = {
 'CONG': '#12D6FF',
 'SAD': '#FEF391',
 'BJP': '#FFB200',
 'AAP': '#FF4933',
 'SP': '#11ff00',
 'CONG': '#1796ff',
 'OTH': '#c9c9c9',
 'PRJA': '#11ff00',
 'BSP': '#FF19B6',
 "OTHERS":"#FFFFFF"
}
//small 3d rectangle function
function rectangle_3d(div_id,width,height,Votes,pname,lead,Diff)
{
  var div = d3.select('#'+div_id);
  d3.select("#"+div_id+"_rect").remove();
  var svg = div.append('svg').attr("id",div_id+"_rect").attr("width","100%").attr("viewBox","0 0 350 80");
  var rect3d = svg.append('g').attr("width","100%").attr("transform", "translate (50,50)");

  var rh = height, rw = width, ang=45;
  if(lead == 0)
  {
    svg.append("text")
    .attr("x",200)
    .attr("y",40)
    .attr("style","font-size:20px")
    .text("Lead by "+d3.format(",.0f")(Diff));
  }
  svg.append("text")
    .attr("x",40)
    .attr("y",40)
    .attr("style","font-size:30px")
    .text(d3.format(",.0f")(Votes));

  var color = partyColors[pname] || "grey"
  rect3d.append("rect")
    .attr("class", "forward")
    .attr("x", -5)
    .attr("y", 2)
    .attr("width", 0)
    .transition().duration(1000)
    .attr("width", rw)
    .attr("height", rh)
    .attr("style","fill:"+color+";opacity:0.7;")
    ;
    
    rect3d.append("rect")
    .attr("class", "top")
    .attr("x", -2)
    .attr("y", 2)
    .attr("width", 0)
    .transition().duration(1000)
    .attr("width", rw)
    .attr("height", 7)
    .attr ("transform", "translate ("+(-12)+","+(-7)+") skewX("+ang+")")
    .attr("style","fill:"+color+";opacity:0.5;")
    ;
    
    rect3d.append("rect")
    .attr("class", "side")
     .attr("x", 0)
    .attr("y", 2)
    .attr("width", 0)
    .transition().duration(1000)
    .attr("width", 7)
    .attr("height", rh)
    .attr ("transform", "translate ("+(-12)+","+(-7)+") skewY("+ang+")")
    .attr("style","fill:"+color+";opacity:1;");

}
function rectangle(div_id,pname,cname)
{
  var div = d3.select('#'+div_id);
  d3.select("#"+div_id+"_rect_1d").remove();
  var svg = div.append('svg').attr("id",div_id+"_rect_1d")
                .attr("width","110%").attr("viewBox","0 0 350 100");
  var rect3d = svg
  var pname = pname || 'default'
  var rh = "35%", rw = "90%";

  var color = partyColors[pname] || "#D8D8D8"
  $.get("/img/parties/"+pname+".png")
  .done(function() { 
    rect3d
    .append("svg:image")
    .attr("x",-88)
    .attr("y",30)
    .attr("width","70%")
    .attr("height","70%")
    .attr("xlink:href","/img/parties/"+pname+".png")
  }).fail(function() { 
    rect3d
    .append("svg:image")
    .attr("x",-88)
    .attr("y",30)
    .attr("width","70%")
    .attr("height","70%")
    .attr("xlink:href","/img/parties/default.png")
  })

  

  rect3d.append("rect")
    .attr("class", "forward1")
    .attr("x", 70)
    .attr("y", 30)
    .attr("width", rw)
    .attr("height", rh)
    ;

  rect3d.append("rect")
    .attr("class", "back")
    .attr("x", 70)
    .attr("y", 65)
    .attr("width", rw)
    .attr("height", rh);

  svg.append("text")
    .attr("x",73)
    .attr("y",55)
    .attr("style","font-size:25px;fill:white")
    .text((cname.split(" ")[0]+" "+(cname.split(" ")[1] || "")).toUpperCase());

  svg.append("text")
    .attr("x",73)
    .attr("y",93)
    .text(pname)
    .attr("style","font-size:25px;fill:"+color);
}

function rectangle_big_3d(div_id,width,height,diff,Votes,pname,cname)
{
  var div = d3.select('#'+div_id);
  var svg = div.append('svg').attr("id",div_id+"_rect").attr("width","80%").attr("viewBox","0 0 350 160");
  var rect3d = svg.append('g').attr("width","100%").attr("transform", "translate (50,50)");

  var rh = height, rw = width, ang=45;

  rect3d.append("rect")
    .attr("class", "forward")
    .attr("x", -30)
    .attr("y", -20)
    .attr("width", rw)
    .attr("height", rh)
    ;
    
    rect3d.append("rect")
    .attr("class", "top")
    .attr("x", -5)
    .attr("y", -20)
    .attr("width", rw)
    .attr("height", 7)
    .attr ("transform", "translate ("+(-12)+","+(-7)+") skewX("+ang+")")
    ;
    
    rect3d.append("rect")
    .attr("class", "side")
     .attr("x", -25)
    .attr("y", 5)
    .attr("width", 7)
    .attr("height", rh)
    .attr ("transform", "translate ("+(-12)+","+(-7)+") skewY("+ang+")")

    var rh1 = "12.5%", rw1 = "45%";


  $.get("/img/parties/"+pname+".png")
  .done(function() { 
    svg
    .append("svg:image")
    .attr("x",50)
    .attr("y",60)
    .attr("width","15%")
    .attr("height","25%")
    .attr("xlink:href","/img/parties/"+pname+".png")
  }).fail(function() { 
    svg
    .append("svg:image")
    .attr("x",50)
    .attr("y",60)
    .attr("width","15%")
    .attr("height","25%")
    .attr("xlink:href","/img/parties/default.png")
  })

  svg.append("rect")
    .attr("class", "forward1")
    .attr("x", 97)
    .attr("y", 60)
    .attr("width", rw1)
    .attr("height", rh1)
    ;

  svg.append("rect")
    .attr("class", "back")
    .attr("x", 97)
    .attr("y", 80)
    .attr("width", rw1)
    .attr("height", rh1);

  svg.append("text")
    .attr("x",99)
    .attr("y",75)
    .attr("style","font-size:13px;fill:white")
    .text((cname.split(" ")[0]+" "+(cname.split(" ")[1] || "")).toUpperCase());

  svg.append("text")
    .attr("x",60)
    .attr("y",55)
    .attr("style","font-size:20px;fill:black")
    .text("2012 Result");

  svg.append("text")
    .attr("x",60)
    .attr("y",115)
    .attr("style","font-size:14px;fill:black")
    .text("Won By "+d3.format(",.0f")(diff)+" Votes");

  svg.append("text")
    .attr("x",260)
    .attr("y",75)
    .attr("style","font-size:14px;fill:black")
    .text(d3.format(",.0f")(Votes));

  svg.append("text")
    .attr("x",99)
    .attr("y",95)
    .attr("style","font-size:10px")
    .text(pname)
    .attr("style","fill:"+partyColors[pname]);
}
function nav_bar()
{
  var div = d3.select('#ac_name');
  var svg = div.append('svg')
                .attr("width","100%").attr("height","70px");
  // var rect3d = svg
  // var pname = pname || 'default'
  // var rh = "35%", rw = "90%";
  svg.append("text")
    .attr("x",20)
    .attr("y",70)
    .attr("style","font-size:90px;fill:black")
    .text(ac_name.toUpperCase());

  // svg
  //   .append("svg:image")
  //   .attr("x",500)
  //   .attr("y",0)
  //   .attr("width","4%")
  //   .attr("height","50%")
  //   .attr("xlink:href","/img/Star.png")

  svg
    .append("svg:image")
    .attr("x",1750)
    .attr("y",0)
    .attr("width","4%")
    .attr("height","70%")
    .attr("xlink:href","/img/Refresh.png")
    .on("click", function() {
        run()
    });
  svg
    .append("svg:image")
    .attr("x",1850)
    .attr("y",0)
    .attr("width","4%")
    .attr("height","70%")
    .attr("xlink:href","/img/cross.png")
}

function ac_Details(region,geoStatus,voting,phase,muslim)
{
  $('#region_id').text(region);
  $('#geo_status').text(geoStatus);
  $('#voting').text(voting)
  $('#phase_id').text("Phase "+phase)
  $('#muslim_id').text(muslim+"+")
}