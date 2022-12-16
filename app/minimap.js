import "./css/style.css";
"use strict";

//SameSite Error Handle
document.cookie = "safeCookie1=foo; SameSite=Lax";
document.cookie = "crossCookie=bar; SameSite=None; Secure";

// ssomlee 2022.12.14 minimap 기본 vworld 연동
const vworld_key = '0FBD6C52-3316-3CDE-A277-4EE6D00A2795';

var map; //맵 변수 선언 : 지도 객체
var mapLayer; //맵 레이어 선언 : 지도 그림(타일) 설정
var mapOverlay; //맵 오버레이 선언 : 지도 위에 팝업 옵션을 사용할 때
var mapView; //맵 뷰 선언 : 보여지는 지도 부분 설정
var hover=null; //마우스 이벤트에 사용될 변수

function init(){
	mapLayer = new ol.layer.Tile({ //타일 생성
			title : 'Vworld Map', //이름
			visible : true, //보여짐 여부
			type : 'midnight', //지도 종류(일반) ---(야간(midnight), 위성(satellite) 등)
			source : new ol.source.XYZ({ //vworld api 사용
				url : `http://api.vworld.kr/req/wmts/1.0.0/${vworld_key}/midnight/{z}/{y}/{x}.png`
			})
	});

	mapView =  new ol.View({ //뷰 생성
			projection : 'EPSG:3857', //좌표계 설정 (EPSG:3857은 구글에서 사용하는 좌표계) 
			center : new ol.geom.Point([ 128.5, 36.1 ]) //처음 중앙에 보여질 경도, 위도 
					.transform('EPSG:4326', 'EPSG:3857') //GPS 좌표계 -> 구글 좌표계
					.getCoordinates(), //포인트의 좌표를 리턴함
			zoom : 9 //초기지도 zoom의 정도값
	     });
	map = new ol.Map({ //맵 생성	
			target : 'vMap', //html 요소 id 값
			layers : [mapLayer], //레이어
			//overlays: [mapOverlay], //오버레이
			view : mapView //뷰
		 });
}

init();


///*	//oskim 2022.12.14 openlayer 사용, 미니맵에 항로 그리기
var points = [ [128.37, 36.17], [128.51, 36.17], [128.51, 35.91] ];

for (var i = 0; i < points.length; i++) {
    points[i] = ol.proj.transform(points[i], 'EPSG:4326', 'EPSG:3857');
}

var featureLine = new ol.Feature({
    geometry: new ol.geom.LineString(points)
});

var vectorLine = new ol.source.Vector({});
vectorLine.addFeature(featureLine);

var vectorLineLayer = new ol.layer.Vector({
    source: vectorLine,
    style: new ol.style.Style({
        fill: new ol.style.Fill({ color: '#00FF00', weight: 4 }),
        stroke: new ol.style.Stroke({ color: '#00FF00', width: 2 })
    })
});

map.addLayer(vectorLineLayer);
//*/