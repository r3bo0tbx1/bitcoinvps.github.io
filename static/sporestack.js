/* Original code portions released into the public domain. (all except for marked sections) */
/* VERY alpha, likely to change a lot. */

var sporestack_baseurl = "https://api.sporestack.com";


function random_machine_id() {
    /* From https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript */
    function dec2hex (dec) {
        return ('0' + dec.toString(16)).substr(-2)
    }

    function generateId (len) {
        var arr = new Uint8Array((len || 40) / 2)
        window.crypto.getRandomValues(arr)
        return Array.from(arr, dec2hex).join('')
    }

    return generateId(64);

}

function is_undefined(argument) {
    return (typeof(argument)==='undefined');
}

function launch(callback,
                error_callback,
                options = {},
                endpoint = sporestack_baseurl) {

    if (is_undefined(options['disk'])) options['disk'] = 5;
    if (is_undefined(options['cores'])) options['cores'] = 1;
    if (is_undefined(options['memory'])) options['memory'] = 1;
    if (is_undefined(options['bandwidth'])) options['bandwidth'] = 1;
    if (is_undefined(options['ipv4'])) options['ipv4'] = "/32";
    if (is_undefined(options['ipv6'])) options['ipv6'] = "/128";
    /* This just lets me know how many people are using the CLI vs the browser to launch servers for a general metric. */
    /* Kind of an ugly hack, can be disabled if you want. */
    if (is_undefined(options['organization'])) options['organization'] = "bitcoinvps";

    var request = new XMLHttpRequest();
    var url = endpoint + "/v2/launch"
    request.open("post", url, true);
    request.setRequestHeader("Content-type", "application/json");
    /* https://stackoverflow.com/questions/29023509/handling-error-messages-when-retrieving-a-blob-via-ajax */
    var handler = function() {
        if (request.readyState == 2) {
            if (request.status == 200) {
                 request.responseType = "json";
            } else {
                 request.responseType = "text";
            }
        } else if (request.readyState == 4 ) {
            var status_first_digit = Math.floor(request.status / 100);
            if (status_first_digit == 2) {
                callback(request.response);
            } else if (status_first_digit == 4) {
                error_callback(request.responseText);
            } else {
                console.log("Retrying...");
                return setTimeout(function () { launch(callback, error_callback, options, endpoint); }, 5000);
            }
        }
    }
    request.onreadystatechange = handler;
   request.send(JSON.stringify(options));
}

function topup(callback,
               error_callback,
               options = {},
               endpoint = sporestack_baseurl) {

    var request = new XMLHttpRequest();
    var url = endpoint + "/v2/topup"
    request.open("post", url, true);
    request.setRequestHeader("Content-type", "application/json");
    /* https://stackoverflow.com/questions/29023509/handling-error-messages-when-retrieving-a-blob-via-ajax */
    var handler = function() {
        if (request.readyState == 2) {
            if (request.status == 200) {
                 request.responseType = "json";
            } else {
                 request.responseType = "text";
            }
        } else if (request.readyState == 4 ) {
            var status_first_digit = Math.floor(request.status / 100);
            if (status_first_digit == 2) {
                callback(request.response);
            } else if (status_first_digit == 4) {
                error_callback(request.responseText);
            } else {
                console.log("Retrying...");
                return setTimeout(function () { topup(callback, error_callback, options, endpoint); }, 5000);
            }
        }
    }
    request.onreadystatechange = handler;
   request.send(JSON.stringify(options));
}
