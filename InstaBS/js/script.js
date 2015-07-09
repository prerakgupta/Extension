$(document).ready(function(){

  var final_os="", final_selection="", final_device="";
  var dataDesktop = {};
  var dataMobile = {};

  $("#done").click(function(){
      var final_url = $("#url").val();
      if (final_os===""){
        showError("Please select an OS first.");
      }
      else if (final_selection==="") {
        showError("Please select a device/browser also.");
      }
      else if (final_url==="") {
        final_url = "www.google.com";
      }
      else{
        $("#error").hide();
        var url = "https://www.browserstack.com/start#";
        if(final_device==="desktop"){
          var temp_os = final_os.split("-");
          var temp_browser = final_selection.split("-");
          url = url +"os=" +temp_os[0].replace(/ /g, "+") +"&os_version=" +temp_os[1].replace(/ /g, "+") +"&browser=" +temp_browser[0].replace(/ /g, "+") +"&browser_version=" +temp_browser[1].replace(/ /g, "+");
          url = url + "&scale_to_fit=true&url="+final_url+"&resolution=1920x1080&speed=1&start=true";
        }
        else if (final_device==="mobile") {
          var temp_devise = final_selection.split("-");
          url = url +"os=" +final_os +"&os_version=" +temp_devise[1].replace(/ /g, "+") +"&device=" +temp_devise[0].replace(/ /g, "+");
          url = url + "&zoom_to_fit=true&full_screen=true&url=" + final_url + "&speed=1";
          console.log(url);
        }
        window.open(url, "_blank");
      }
  });

  $("#show_mobile").click(function(){
    $("#desktop").hide();
    $("#mobile").show();
  });

  $("#show_desktop").click(function(){
    $("#desktop").show();
    $("#mobile").hide();
  });

  $("#desktop_browser li").live('click',  function(){
    final_selection = $(this).text();
    $("#current_desk_browser").text(final_selection);
  });

  $("#mobile_device li").live('click', function(){
    final_selection = $(this).text();
    $("#current_mobile_device").text(final_selection);
  });

  $.ajax({
  //headers: {'Access-Control-Allow-Origin': '*'},
  //crossDomain: true,
  //jsonp: "callback",
  //dataType: "jsonp",
    url: "https://www.browserstack.com/list-of-browsers-and-platforms.json?product=live",
    type: "GET",
    success: function(response){
      console.log("Loaded the complete data.");
      getDesktopData(response);
      getMobileData(response);
    }
  });

 function getDesktopData(response){
    $("#desktop_os").empty();
    jQuery.each(response.desktop, function(key, value){
      var os = JSON.stringify(value.os + "-" + value.os_version);
      os = os.replace(/\"/g, "");
      dataDesktop[os] = [];
      jQuery.each(value.browsers, function(k, v){
         dataDesktop[os].push((JSON.stringify(v.browser +"-" + v.browser_version)).replace(/\"/g, ""));
      });
      $("#desktop_os").append("<li><a href='#'>"+ os +"</a></li>");
    });

    $('#desktop_os li').on('click', function(){
      final_os = $(this).text();
      final_device = "desktop";
      $("#current_desk_os").text(final_os);
      $("#desktop_browser").empty();
      $("#current_desk_browser").text("Browser");
      final_selection = "";
      setSecondSelection(final_os, "desktop_browser", dataDesktop);
    });
  }

  function getMobileData(response){
    $("#mobile_os").empty();
    jQuery.each(response.mobile, function(key, value){
      var os = JSON.stringify(value.os);
      os = os.replace(/\"/g,"");
      dataMobile[os] = [];
      jQuery.each(value.devices, function(k, v){
         dataMobile[os].push((JSON.stringify(v.display_name + "-" + v.os_version )).replace(/\"/g, ""));
         });
      $("#mobile_os").append("<li><a href = '#'>" + os + "</a></li>");
    });
    $('#mobile_os li').on('click', function(){
      final_os = $(this).text();
      final_device = "mobile";
      $("#current_mobile_os").text(final_os);
      $("#mobile_device").empty();
      $("#current_mobile_device").text("Device");
      final_selection = "";
      setSecondSelection(final_os, "mobile_device", dataMobile);
    });
  }

  function setSecondSelection( val, selector, obj){
    $("#"+selector).empty();
    jQuery.each(obj[val], function(key, value){
      $("#"+selector).append("<li ><a href='#' class='selection' >"+ value + "</a></li>");
    });
  }

  function showError(val){
    $("#error").empty();
    $("#error").append(val);
    $("#error").show();
    $("#error").delay(3000).fadeOut('slow');
  }

});
