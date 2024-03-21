
///---Observing dom element insertion of gdsdk__advertisement,
 


var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        console.log(mutation.addedNodes);
        if (mutation.type === 'childList') {
              console.log('A child node has been added or removed.'+mutation);           
			  if(mutation.addedNodes[0].id=='gdsdk__advertisement'){
				// Later, you can stop observing
	            // Later, you can stop observing
				observer.disconnect();   
				init_gd_bug_handler();
			  }
        }
     
    });
});

var config_gd = {
    attributes: true,
    childList: true,
    characterData: true
};

observer.observe(document.body, config_gd);
var gd_bug_targetNode;
var gd_alternate=0; //call this once

var  gd_callback;
var gd_observer;
///---runtime div adding 
function init_gd_bug_handler(){
	gd_bug_targetNode = document.querySelector('#gdsdk__advertisement');
	gd_callback = mutations => {  
  mutations.forEach(mutation => {
    
     if (mutation.type === 'attributes') {
     
	// gd_bug_targetNode.getAttribute("visibility")
	if(document.querySelector('#gdsdk__advertisement').style.visibility=='visible'){
	console.log("attYawer");
	//toogle_iframes_gd_bug();
	}else{
	console.log("attYawer_else");
	console.log("att");
	  setTimeout(() => {console.log("helloe2");toogle_iframes_gd_bug();}, 3000);
      setTimeout(() => {console.log("helloe2_jq");jq_div_overlay();}, 100);
	  /*
	  setTimeout(() => {console.log("helloe2_jq");jq_div_overlay();}, 200);
		setTimeout(() => {console.log("helloe2_jq");jq_div_overlay();}, 300);
		setTimeout(() => {console.log("helloe2_jq");jq_div_overlay();}, 400);
		setTimeout(() => {console.log("helloe2_jq");jq_div_overlay();}, 500);
		setTimeout(() => {console.log("helloe2_jq");jq_div_overlay();}, 1500);
		setTimeout(() => {console.log("helloe2_jq");jq_div_overlay();}, 2000);
		//setTimeout(() => {console.log("helloe2_jq");jq_div_overlay();}, 1000);
		*/
	}
      
    }
  });
}

gd_observer = new MutationObserver(gd_callback);
gd_observer.observe(gd_bug_targetNode, gd_bug_config);
}

function toogle_iframes_gd_bug(){

	var gd_bug_iframes = document.querySelectorAll('iframe[allowtransparency="true"]');
	
	
	//matches[0].insertAfter (matches[1])

	if(gd_alternate==0){
		gd_bug_iframes[0].remove();
	gd_bug_iframes[1].after(gd_bug_iframes[0]);
	gd_alternate=1;
	console.log("in zero"+gd_bug_iframes.length);
	}else{
		gd_bug_iframes[1].remove();
	gd_bug_iframes[0].after(gd_bug_iframes[1]);
	gd_alternate=0;
	
	console.log("in one"+gd_bug_iframes.length);
	}
}
 function jq_div_overlay(){
 $('html').append('<div id="createdParagraphhh">the new guy</div>');
 $("#createdParagraphhh").html("Click to resumeClick to resumeClick to resumeClick to resumeClick to resume/nClick to resumeClick to resumeClick to resumeClick to resumeClick to resumeClick to resume/nClick to resumeClick to resumeClick to resumeClick to resumeClick to resumeClick to resume/nClick to resumeClick to resumeClick to resumeClick to resumeClick to resumeClick to resumeClick to resume/nClick to resumeClick to resumeClick to resumeClick to resumeClick to resumeClick to resumeClick to resumeClick to resumeClick to resume/nClick to resumeClick to resumeClick to resumeClick to resumeClick to resumeClick to resumeClick to resumeClick to resume/nClick to resumeClick to resumeClick to resumeClick to resumeClick to resumeClick to resume/nClick to resumeClick to resumeClick to resumeClick to resumeClick to resumeClick to resumeClick to resume/");

		 $('#createdParagraphhh').css({
		 "font-size": "20px",
		  "text-align": "center",
		 "position": "absolute",
		"left": "50%",
		"top": "50%",
		"width": "100vw",
		"height": "100vh",
		"backgroundColor": "#232e2042",
             "z-index": "2147483647",
			 "opacity":"0.05",
		"transform": "translate(-50%, -50%)"});
		//black working
		
        $("#createdParagraphhh").on("tap",function(){
          $(this).remove();
            console.log("removedtap");
        });
         $( "#createdParagraphhh" ).click(function() {
		  $( "#createdParagraphhh" ).remove();
		  console.log("removed");
		});
        $('#createdParagraphhh').on({ 'touchstart' : function(){ 
			console.log("dd");
			//$("div[id=createdParagraphhh]").remove();
			//$(this).remove(); 
			//console.log("ee");
			// setTimeout(function(){console.log("wtf");$( "#createdParagraphhh" ).remove();}, 1000);
		} });
 }
    
const gd_bug_config = {
  attributes: true, 
  childList: true, 
  characterData: true
};
 function gd_bug_myFunction() {
  console.log('Hello');
  toogle_iframes_gd_bug();
}
