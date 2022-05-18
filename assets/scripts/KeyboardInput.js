var keys = new Array();

window.addEventListener("keydown", function(event)
{
    keys[event.code] = true;
}, false);

window.addEventListener("keyup", function(event)
{
    keys[event.code] = false;
}, false);