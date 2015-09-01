// .001 is the current js version
// this script assumes it is in the root web directory.
var js_file = "http://127.0.0.1:8080/test.001.js";
// vars to store where the file is loaded from.
var _mob_load_js = false;
var _mob_ajax_load_js = false;
var _server_load_js = false;

// if we have localStorage and the files exists there get it.
if(window.localStorage && window.localStorage[js_file]) {
    // eval the js file.
    try{
        window.eval(window.localStorage[js_file]);

        // successfully eval'ed the code, so 
        // we don't need to download it later.
    	_mob_load_js = true;
    } catch (e) { 
    	_mob_load_js = false; 
    }
}
else if (window.localStorage) {
    // We have localStorage, but no cached file, so we 
    // load the file via ajax, eval it and then store 
    // the file in localStorage

    // To remove previous versions, I remove all of our localStorage,
    // This is extreme if we store other vars there.
    window.localStorage.clear();
    // standard ajax request.
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            // eval the js
            try {
            	if(_mob_load_js){
            		window.eval(xhr.responseText);
            	}
                
                // successfully eval'ed the code, so 
                // we don't need to download it later.
            	_mob_ajax_load_js = true;
            } catch (e) { 
            	_mob_ajax_load_js = false; 
            }

	        try {
	            // store the js.
	            window.localStorage[js_file] = xhr.responseText;
	        } catch (e) {

	        }
        }
        else {
        	return;   
        }
    };
    xhr.open("GET",js_file,true);
    xhr.send();
}

// We haven't loaded the js yet, so we create a script 
// tag and get the script the old fashioned way
if (!_mob_load_js && !_mob_ajax_load_js) {
    var script=document.createElement("script");
    script.type="text/javascript";
    script.src=js_file;
    document.getElementById("sr_external_script").appendChild(script);
    _server_load_js = true;
    // add a note to the footer
    document.write('<div>loaded from server and not stored</div>');
}
else if (!_mob_load_js) {
    // add a note to the footer
    document.write('<div>loaded via ajax and stored in localStorage</div>');
}
else {
    // add a note to the footer
    document.write('<div>loaded from localStorage</div>');
}
