_.mixin({templateFromURL: function (url, selector) {
  var templateHtml = "";
  selector = selector || null;
  $.ajax({
      url: url,
      method: "GET",
      async: false,
      success: function(data) {
          if(selector){
            templateHtml =  _.unescape($(data).filter(selector).html());
          }else{
            templateHtml =  _.unescape(data);
          }


      }
  });

  return _.template(templateHtml);
}});