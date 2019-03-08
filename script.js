$("#downloadVideo").click(function() {
    var postUrl = $("#postUrl").val();

    $.ajaxSetup({
        scriptCharset: "utf-8", //maybe "ISO-8859-1"
        contentType: "application/json; charset=utf-8"
    });
    if (postUrl == "")
        $("#message").html("Please Enter the URL");
    else
        $("#message").html("Searching Video........");

    $.ajax({
        type: 'POST',
        url: "https://whateverorigin.herokuapp.com/get?url=" + encodeURIComponent(postUrl) + "&callback=?",
        data: {
            'patientID': 1
        },
        dataType: 'json',
        success: function(data) {
            var content = data.contents;
            var startIndex = content.search('<meta property="og:video" content=');
            var endIndex = content.indexOf('/>', startIndex);
            var videoUrl = content.slice(startIndex, endIndex + 2)
            var metaObject = $.parseHTML(videoUrl);
            if (!!metaObject && metaObject.length > 0) {
                //Video Found, Download
                $("#message").html("Downloading...");
                downloadFile(metaObject[0].content, "Video.mp4", "video/mp4");
            } else {
                if (data.status.http_code === 404) {
                    //Post Not Found
                    $("#message").html("Invalid URL / Not Found");
                } else {
                    //Video is private
                    $("#message").html("Post is private");
                }
            }
        },
        error: function() {
            $("#message").html("Invalid URL");
        }
    });
});


function downloadFile(data, filename, type) {
    var file = new Blob([data], {
        type: "video/mp4"
    });
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}