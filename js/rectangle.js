function rectangle_3d(width,height,Votes,pname,lead,Diff,status)
{
  var div = d3.select(document.createElement('div'));
  var svg = div.append('svg').attr("width","100%").attr("viewBox","0 6 350 80").attr("preserveAspectRatio", "xMinYMin slice").attr("class", "cond-count");
  var rect3d = svg.append('g').attr("width","100%").attr("transform", "translate (50,50)");

  var rh = height, rw = width, ang=45;
  if(lead == 0)
  {
  var parsed_url = G.url.parse(location.href)
  var lang = parsed_url.searchKey.lang || null
  if(lang == 'HIN'){
    rect3d.append("rect")
    .attr("class", "forwar")
    .attr("x", 110)
    .attr("y", -30)
    .attr("width", 110+Diff.toString().length*10)
    .attr("height", 23)
    .attr("style","fill:grey;")
    if(status == "WON"){
      svg.append("text")
      .attr("x",167)
      .attr("y",40)
      .attr("style","font-size:20px;fill:white;")
      .text(d3.format(",.0f")(Diff)+" वोट से जीत");
    }
    else{
      svg.append("text")
      .attr("x",167)
      .attr("y",40)
      .attr("style","font-size:20px;fill:white;")
      .text(d3.format(",.0f")(Diff)+" वोट से आगे");
    }
  }else{
    rect3d.append("rect")
    .attr("class", "forwar")
    .attr("x", 130)
    .attr("y", -30)
    .attr("width", 92+Diff.toString().length*10)
    .attr("height", 23)
    .attr("style","fill:grey;")
    if(status == "WON"){
      svg.append("text")
      .attr("x",187)
      .attr("y",40)
      .attr("style","font-size:20px;fill:white;")
      .text("Won by "+d3.format(",.0f")(Diff));
    }
    else{
      svg.append("text")
      .attr("x",187)
      .attr("y",40)
      .attr("style","font-size:20px;fill:white;")
      .text("Lead by "+d3.format(",.0f")(Diff));
    }
  }

    
  }
  svg.append("text")
    .attr("x",40)
    .attr("y",40)
    .attr("class","text_const")
    .attr("value",Votes)
    .attr("style","font-size:30px")
    .text(0);
  
  var color1 = partyColors_pname[pname.trim()] || "#6A503A";
  rect3d.append("rect")
    .attr("class", "forward")
    .attr("x", -5)
    .attr("y", 2)
    .attr("width", rw)
    .attr("height", rh)
    .attr("style","fill:"+color1+";opacity:0.7;")
    ;
    
    rect3d.append("rect")
    .attr("class", "top")
    .attr("x", -2)
    .attr("y", 2)
    .attr("width", rw)
    .attr("height", 7)
    .attr ("transform", "translate ("+(-12)+","+(-7)+") skewX("+ang+")")
    .attr("style","fill:"+color1+";opacity:0.5;")
    ;
    
    rect3d.append("rect")
    .attr("class", "side")
     .attr("x", 0)
    .attr("y", 2)
    .attr("width", 7)
    .attr("height", rh)
    .attr ("transform", "translate ("+(-12)+","+(-7)+") skewY("+ang+")")
    .attr("style","fill:"+color1+";opacity:1;");
    //console.log(svg.transition);
    return div.html();
}
function rectangle(pname,cname,i)
{
  var div = d3.select(document.createElement('div'))

  var svg = div.append('svg')
                .attr("id","rectangle_box_shadow")
                .attr("width","110%").attr("viewBox","0 6 350 80")
                .attr("preserveAspectRatio", "xMinYMin slice");
  // var rect3d = svg
  var pname = pname || 'default'
  var rh = "50%", rw = "80%";
  var path = party_alliance_mapping[pname.trim()] || "img/parties/default.jpg"
  path = "/"+path
  var color = partyColors_pname[pname.trim()] || "#D8D8D8";
  svg
  .append("svg:image")
  .attr("id","imge")
  .attr("x",0)
  .attr("y",6)
  .attr("width","20%")
  .attr("height","100%")
  .attr("xlink:href", path)

  // $.get("/img/parties/"+pname+".png")
  // .done(function(d) {
  //   console.log(d)
  //   path = "/img/parties/"+pname+".png";

  //   debugger;
  // })
  

  svg.append("rect")
    .attr("class", "forward1")
    .attr("x", 70)
    .attr("y", 6)
    .attr("width", rw)
    .attr("height", rh)
    ;

  svg.append("rect")
    .attr("class", "back")
    .attr("x", 70)
    .attr("y", 46)
    .attr("width", rw)
    .attr("height", rh);

  svg.append("text")
    .attr("x",80)
    .attr("y",37)
    .attr("style","font-size:27px;fill:white")
    .text(((cname.split(" ")[0] || "")+" "+(cname.split(" ")[1] || "")).toUpperCase());

  svg.append("text")
    .attr("x",80)
    .attr("y",76)
    .text(mask_to_hindi(pname))
    .attr("style","font-size:27px;fill:"+color);
  return div.html();
}

function rectangle_big_3d(width,height,diff,Votes,pname,cname)
{
  var div = d3.select(document.createElement('div'));
  var svg = div.append('svg').attr("width","80%").attr("viewBox","0 0 350 160").attr("preserveAspectRatio", "xMinYMin slice").attr("class", "cond-result");
  var rect3d = svg.append('g').attr("width","100%").attr("transform", "translate (50,50)");

  var rh = height, rw = width, ang=45;

  var path = party_alliance_mapping[pname.trim()] || "img/parties/default.jpg"
  path = "/"+path
  var color = partyColors_pname[pname.trim()] || "#D8D8D8";
  
  rect3d.append("rect")
    .attr("class", "forward_big")
    .attr("x", -30)
    .attr("y", -20)
    .attr("width", rw)
    .attr("height", rh)
    ;
    
    rect3d.append("rect")
    .attr("class", "top_big")
    .attr("x", -5)
    .attr("y", -20)
    .attr("width", rw)
    .attr("height", 7)
    .attr ("transform", "translate ("+(-12)+","+(-7)+") skewX("+ang+")")
    ;
    
    rect3d.append("rect")
    .attr("class", "side_big")
     .attr("x", -25)
    .attr("y", 5)
    .attr("width", 7)
    .attr("height", rh)
    .attr ("transform", "translate ("+(-12)+","+(-7)+") skewY("+ang+")")

    var rh1 = "12.5%", rw1 = "45%";


  
    svg
    .append("svg:image")
    .attr("x",55)
    .attr("y",60)
    .attr("width","12%")
    .attr("height","25%")
    .attr("xlink:href",path)

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
    .attr("x",103)
    .attr("y",77)
    .attr("style","font-size:16px;fill:white")
    .text(((cname.split(" ")[0] || "")+" "+(cname.split(" ")[1] || "")).toUpperCase());


  var parsed_url = G.url.parse(location.href)
  var lang = parsed_url.searchKey.lang || null
  if(lang == 'HIN'){
    svg.append("text")
    .attr("x",60)
    .attr("y",115)
    .attr("style","font-size:14px;fill:black")
    .text(d3.format(",.0f")(diff)+" वोट से जीत");

    svg.append("text")
    .attr("x",60)
    .attr("y",55)
    .attr("style","font-size:20px;fill:black")
    .text("2012 के नतीजे");
  }else{
    svg.append("text")
    .attr("x",60)
    .attr("y",115)
    .attr("style","font-size:14px;fill:black")
    .text("Won by "+d3.format(",.0f")(diff)+" Votes");

    svg.append("text")
    .attr("x",60)
    .attr("y",55)
    .attr("style","font-size:20px;fill:black")
    .text("2012 Result");
  }

  

  svg.append("text")
    .attr("x",260)
    .attr("y",75)
    .attr("style","font-size:14px;fill:black")
    .text(d3.format(",.0f")(Votes));

  svg.append("text")
    .attr("x",103)
    .attr("y",95)
    .attr("style","font-size:10px !important")
    .text(mask_to_hindi(pname))
    .attr("style","fill:"+color);

  return div.html();

}

function no_data_rect(lead){
  console.log(lead)
  var div = d3.select(document.createElement('div'));
  var svg = div.append('svg').attr("width","100%").attr("viewBox","0 0 350 80");
  if(lead==0){
    svg.append("text")
      .attr("x",40)
      .attr("y",60)
      .text("LEADING")
      .attr("style","fill:green;font-size:40px !important;");
  }
  return div.html()
}

// function ac_Details(region,geoStatus,voting,phase,muslim)
// {
//   $('#region_id').text(region);
//   $('#geo_status').text(geoStatus);
//   $('#voting').text(voting)
//   $('#phase_id').text("Phase "+phase)
//   $('#muslim_id').text(muslim+"+")
// }