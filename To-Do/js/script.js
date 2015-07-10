$(document).ready(function(){

  var shown = false;
  //window.localStorage.clear();
  if(localStorage.getItem("index")===null){
    localStorage.setItem("index", "1");
    localStorage.setItem("done_count", "0");
    localStorage.setItem("todo_count", "0");
  }
  else{
    update("ss");
    addAllItems();
  }

  $("#message").append("Click on an added task to mark as done");
  $("#message").delay(5000).fadeOut("slow");

  $("#input").keypress(function(event) {
    if (event.which == 13) {
        event.preventDefault();
        $("#add").click();
    }
  });

  $("#to_do_list").sortable();
  $("#done_list").sortable();

  $("#add").click(function(){
    var val = $("#input").val();
    if (val !== ""){
      $("#input").val("");
      update("add");
      var index = parseInt(localStorage.getItem("index"));
      $("#input").attr('placeholder', 'Is there more to do today?');
      localStorage.setItem(index.toString(), val);
      localStorage.setItem("index", (index+1).toString());
      addItem(index);
     }
    else {
      alert("You really have nothing to do??");
    }
  });

  $(".items").live('click', function(){
    var parent = $(this).parent().attr("id");
    if (parent==="to_do_list"){
      value = $(this).html();
      id = $(this).attr("id");
      $(this).html("");
      $(this).html("<strike>" + value + "</strike>");
      $(this).delay(500).fadeOut('slow');
      $("#done_list").append("<div class='items' draggable='true' id="+id+">" + value + "</div>");
      localStorage.setItem(id.toString(), (value+"_hide"));
      update("swap");
    }
    else if (parent==="done_list") {
        var index = $(this).attr("id")
        $(this).hide("fast");
        update("remove");
        localStorage.removeItem(index.toString());
    }
  });

  $("#trash").click(function(){
    if(!shown){
      $("#message").empty();
      $("#message").append("Click on task to remove it permanently");
      $("#message").show();
      $("#message").delay(5000).fadeOut("slow");
      shown = true;
    }
    $("#to_do_list").hide();
    $("#done_list").show("fast");
  });
  $("#show_to_do").click(function(){
    $("#done_list").hide();
    $("#to_do_list").show("fast");
  });

  function update(type){
    var todo_count = parseInt(localStorage.getItem("todo_count"));
    var done_count = parseInt(localStorage.getItem("done_count"));
    if(type==="add"){
      todo_count += 1;
    }
    else if (type=="swap") {
        todo_count -= 1;
        done_count += 1;
    }
    else if(type==="remove"){
      done_count -= 1;
    }
    localStorage.setItem("todo_count", todo_count.toString());
    localStorage.setItem("done_count", done_count.toString());
    $("#trash").find(".badge").html(done_count);
    $("#show_to_do").find(".badge").html(todo_count);
  }

  function addItem(index){
    $("#to_do_list").append("<div class='items' draggable='true' id="+index+">" +localStorage.getItem(index.toString()) +"</div>");
  }
  function addAllItems(){
    console.log("Adding items from previous session");
    var index = parseInt(localStorage.getItem("index"));
    for(var i=1; i<=index; i+=1){
      if(localStorage.getItem(i.toString())!==null){
        if(!localStorage.getItem(i.toString()).includes("_hide"))
          $("#to_do_list").append("<div class='items' draggable='true' id="+ i +" >" + localStorage.getItem(i.toString()) + "</div>");
        else
          $("#done_list").append("<div class='items' draggable='true' id="+ i +" >" + localStorage.getItem(i.toString()).split("_")[0] + "</div>");
       }
    }
  }

});
