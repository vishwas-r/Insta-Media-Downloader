$("#getMedia").click(getMedia);
var render = document.querySelector("#media");

function createMedia(data, type) {
	var media = document.createElement(type);
	media.id = "instagramMedia";
	media.src = data.content;
	media.setAttribute("class", "");
	media.width = $(render).width();
	
	if (type === "video") {
		media.controls = true;
		media.autoplay = true;		
	} 
	render.innerHTML = "";
	var downloadMsg = document.createElement("p");
	downloadMsg.setAttribute("class", "bg-success text-info");
	downloadMsg.innerText = "Right Click on the Media below to get Save Option!";

	render.appendChild(downloadMsg);
	render.appendChild(media);
}

function getMedia() {
	var url = $("#postUrl").val();
	if (url) {
		$.get(url, function (data) {
			render.innerHTML = data;
			var mediaWaitTimer = setTimeout(function () {
				var video = document.querySelector('meta[property="og:video"]');
				if (video) {
					createMedia(video, "video");
				} else {
					var img = document.querySelector('meta[property="og:image"]');
					if (img) {
						createMedia(img, "img");
					} else {
						document.body.innerHTML = body;
						alert("Error extracting Instagram image / video.");
					};
				}
				clearTimeout(mediaWaitTimer);
			}, 200);

		});

	} else {
		document.querySelector("#media").setAttribute("placeholder", "Invalid Address, Please Enter Proper Insagram Link");

	}
}