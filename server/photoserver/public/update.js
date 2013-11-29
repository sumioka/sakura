var remoteData =[];
var newData = [];

$(function ()
{

    // this function will run each 1000 ms until stopped with clearInterval()
    var interval = setInterval(function ()
    {
        $.ajax(
        {
	    url: "http://localhost:3000/",
	    cache: false,

            success: function (json)
            {
				if(json.modified){
					remoteData.push(json.data);
					newData = json.data;
					updatefunc();
				}
					
				

            },

            error: function ()
            {
                // on error, stop execution
                clearInterval(interval);
            }
        });
    }, 1000);
});


function onUpdate(){

	$("#my1").append("updated<br/>");

}