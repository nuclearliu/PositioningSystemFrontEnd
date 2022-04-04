// JavaScript Document

//var gps = [114.429, 30.515];
//var lnglats;
//AMap.convertFrom(gps, 'gps', function (status, result) {
//	if (result.info === 'ok') {
//		var lnglats = result.locations; // Array.<LngLat>
//		var map = new AMap.Map('container', {
//			zoom: 18,//级别
//			center: lnglats[0],//中心点坐标
//			resizeEnable: true,
//		});
//  }
//});

// Draw the map

var ip = "10.13.49.107";

var map = new AMap.Map('container', {
	zoom: 18,//级别
	zooms: [2, 30],
	center: [114.434507,30.51268],//中心点坐标
	resizeEnable: true,
}).on("complete", function() {
	AMap.plugin(['AMap.ToolBar', 'AMap.Scale'],function(){//异步加载插件
		var toolbar = new AMap.ToolBar({
			position: "LT",
			locate: true,
		});
		map.addControl(toolbar);
		var scale = new AMap.Scale({
			position: "LB"
		});
		map.addControl(scale);
	});
});

var timer = window.setInterval(function(){ //接受之后再请求
	getLatestLocation()
},1000);
var marker = new AMap.Marker();

//var imageLayer = new AMap.ImageLayer({
//    bounds: new AMap.Bounds(
//		
//	),
//    url: 'images/map.jpg', // 图片 Url
//    zIndex:2,
//    zooms: [10, 30] // 设置可见级别，[最小级别，最大级别]
//});
//map.add(imageLayer);

function $(Nid) {
	return document.getElementById(Nid);
}

function putAPin(map, coordinates){
	removeAPin(map)
	marker = new AMap.Marker({
		position: coordinates, //[114.436507,30.51218],
		// icon: "mark.png",
		// offset: new AMap.Pixel(-20, -62),
		title: 'current'
	});
	marker.on('click', function() {goIndoors()});
	map.add(marker);

}

function removeAPin(map){
	map.remove(marker);
}

function goIndoors() {
	document.getElementById("cover").style.zIndex = 401;
	document.getElementById("indoors").style.zIndex = 402;
}

function goOutdoors() {
	document.getElementById("cover").style.zIndex = 1;
	document.getElementById("indoors").style.zIndex = 2;
}

function httpGet(url, isSync, action) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
	  action(this);
	}
	};
	xhttp.open("GET", url, isSync); // synchronize
	xhttp.send();
}

function getLatestLocation() {
	
	httpGet("http://" + ip + ":8755/gpsOrigin/latest", true, function(xhttp) {
		//var lnglat;
		console.log(xhttp.responseText);
		// gps = [parseFloat(xhttp.responseText.split(" ")[0]), parseFloat(xhttp.responseText.split(" ")[1])];
		latestLocationObj =  JSON.parse(xhttp.responseText);
		gps = [latestLocationObj.longitude, latestLocationObj.latitude]
		console.log(gps);
//		$("locationText").innerHTML = "[" + lnglat.join(",") + "]";
		//console.log(gps);
		AMap.convertFrom(gps, 'gps', function (status, result) {
            if (result.info === 'ok') {
				map.remove(marker);
                var lnglat = result.locations[0]; // Array.<LngLat>
                console.log(lnglat);
				document.getElementById("Lnglat").innerHTML = lnglat.toString();
                marker = new AMap.Marker({
					position: lnglat,//new AMap.LngLat(lnglat[0], lnglat[1]),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
					// icon: "mark.png",
					// offset: new AMap.Pixel(-20, -62),
					title: 'current'
				});
				marker.on('click', function() {goIndoors()});
                map.add(marker);
            }
		});
		
		
	});
//	console.log("[" + lng.toString() + "," + lat.toString() + "]");
}

window.onload = function() {
//	console.log("load");
}