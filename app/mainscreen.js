// ssomlee 2022.12.12 cesium 3D 추가
import { Ion, Viewer, createWorldTerrain, createOsmBuildings, Cartesian3, Math, JulianDate, Color, SampledPositionProperty, IonResource, PathGraphics, VelocityOrientationProperty, TimeIntervalCollection, TimeInterval, ClockRange, PolygonHierarchy, PolylineGlowMaterialProperty, Transforms, HeadingPitchRange} from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import "./css/style.css";

// Your access token can be found at: https://cesium.com/ion/tokens.
// This is the default access token
Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3NjJiNzBhNS00NTkyLTQzZGItODEwMS0zZmQyZjgxYTBjZTciLCJpZCI6MTE2OTEzLCJpYXQiOjE2Njk5NjM0NTl9.TUGuCk_09Z-GFtwsQuHfPppHlMR8KQiijqPF4f3CiOM';

// Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
const viewer = new Viewer('cesiumContainer', {
  selectionIndicator : false,
  navigationHelpButton : false,
  infoBox : false,
  navigationInstructionsInitiallyVisible : false,
  baseLayerPicker : true,
  shouldAnimate : true, 
  terrainProvider: createWorldTerrain()
});

// Add Cesium OSM Buildings, a global 3D buildings layer.
viewer.scene.primitives.add(createOsmBuildings());   

// // Fly the camera to San Francisco at the given longitude, latitude, and height.
// viewer.camera.flyTo({
//   destination : Cartesian3.fromDegrees(127.03, 37.4522, 400),
//   orientation : {
//     heading : Math.toRadians(0.0),
//     pitch : Math.toRadians(-15.0),
//   }
// });


  /* //초기 document 세팅 [Initialize the viewer clock:]
  	
	Assume the radar samples are 30 seconds apart, and calculate the entire flight duration based on that assumption.
	Get the start and stop date times of the flight, where the start is the known flight departure time (converted from PST 
	  to UTC) and the stop is the start plus the calculated duration. (Note that Cesium uses Julian dates. See 
	  https://simple.wikipedia.org/wiki/Julian_day.)
	Initialize the viewer's clock by setting its start and stop to the flight start and stop times we just calculated. 
	Also, set the viewer's current time to the start time and take the user to that time. 
  
  const timeStepInSeconds = 30;
  const totalSeconds = timeStepInSeconds * (flightData.length - 1);
  const start = JulianDate.fromIso8601("2020-03-09T23:10:00Z");
  const stop = JulianDate.addSeconds(start, totalSeconds, new JulianDate());
  viewer.clock.startTime = start.clone();
  viewer.clock.stopTime = stop.clone();
  viewer.clock.currentTime = start.clone();
  viewer.timeline.zoomTo(start, stop);
  // Speed up the playback speed 50x.
  viewer.clock.multiplier = 50;
  // Start playing the scene.
  viewer.clock.shouldAnimate = true;

  // The SampledPositionedProperty stores the position and timestamp for each sample along the radar sample series.
  const positionProperty = new SampledPositionProperty();
//*/

///*	//ssomlee 2022.12.15 비행 루트 재설정 및 시간 설정
let lon = 127.03653;
let lat = 37.46958;
// let height = 60;

let flightData = [];
for (let i=0; lon < 127.3; i += 0.001) {
    lon += i
    lat += i
    
    
    // 객체생성
    let flightdata = new Object();
    flightdata.longitude = lon;
    flightdata.latitude = lat;
    flightdata.height = 200;

    flightData.push(flightdata);
}


const timeStepInSeconds = 1;
const totalSeconds = timeStepInSeconds * (flightData.length - 1);
let start = JulianDate.now();
let stop = JulianDate.addSeconds(start, totalSeconds, new JulianDate());

// viewer 작동 시간 확인
viewer.clock.startTime = start.clone();
viewer.clock.stopTime = stop.clone();
viewer.clock.currentTime = start.clone();
viewer.clock.shouldAnimate = true;

// timeline start, stop 시간으로 세팅
viewer.timeline.zoomTo(start, stop);

// 항공기 비행 루트(추후 GPS) 설정
const positionProperty = new SampledPositionProperty();

  for (let i = 0; i < flightData.length; i++) {
	const dataPoint = flightData[i];

	// Declare the time for this individual sample and store it in a new JulianDate instance.
	const time = JulianDate.addSeconds(start, i * timeStepInSeconds, new JulianDate());
	const position = Cartesian3.fromDegrees(dataPoint.longitude, dataPoint.latitude, dataPoint.height);
	// Store the position along with its timestamp.
	// Here we add the positions all upfront, but these can be added at run-time as samples are received from a server.
	positionProperty.addSample(time, position);

	// 구분점 표시
	viewer.entities.add({
	  description: `Location: (${dataPoint.longitude}, ${dataPoint.latitude}, ${dataPoint.height})`,
	  position: position,
	  point: { 
      pixelSize: 8, 
      color: Color.TRANSPARENT,
      outlineColor : Color.YELLOW, 
      outlineWidth:3
    }
	});
  }
//*/  
  

// ssomlee 2022.12.13 드론 추가

// async function loadModel() {
// // Load the glTF model from Cesium ion.
// const airplaneUri = await IonResource.fromAssetId(1430196);
// const airplaneEntity = viewer.entities.add({
// 	availability: new TimeIntervalCollection([ new TimeInterval({ start: start, stop: stop }) ]),
// 	position: positionProperty,
// 	// Attach the 3D model instead of the green point.
// 	model: { 
//     uri: airplaneUri,
//     minimumPixelSize: 80 
//   },
// 	// Automatically compute the orientation from the position.
// 	orientation: new VelocityOrientationProperty(positionProperty),    
// 	// path: new PathGraphics({ width: 3 })
//   path: {
//     resolution : 1,
//     material : new PolylineGlowMaterialProperty({
//       glowPower : 0.1,
//       color : Color.white
//     }),
//     width : 10
//   }
// });

// viewer.trackedEntity = airplaneEntity;
// }

// loadModel();
//*/  

// ssomlee 2022.12.16 드론 entity 수정 
const airplaneEntity = viewer.entities.add({
  // 시뮬레이션의 interval 시간이 동일해지도록
	availability: new TimeIntervalCollection([ new TimeInterval({ start: start, stop: stop }) ]),

  position: positionProperty,

  // Automatically compute the orientation from the position.
	orientation: new VelocityOrientationProperty(positionProperty),   

	// Attach the 3D model instead of the green point.
	model: { 
    uri: './Assets/Icons/CesiumDrone.glb',
    minimumPixelSize: 70 
  },
	 
	// show the path as a white line in 1 sec increments
  path: {
    resolution : 1,
    material : new PolylineGlowMaterialProperty({
      glowPower : 0.1,
      color : Color.white
    }),
    width : 10
  }
});

viewer.trackedEntity = airplaneEntity;


///*	//oskim 2022.12.14 회랑 및 위험영역(원통) 표시
const entities = viewer.entities;
entities.add({
  corridor: {
    positions: Cartesian3.fromDegreesArray([
      127.037,    37.47,
			127.049,    37.48,
			127.049,    37.48,
			127.048,    37.49
    ]),
    width: 100,
    height: 30,	//회랑자체 높이
    extrudedHeight: 100,	//지상으로 부터 높이
    material:  Color.MEDIUMTURQUOISE .withAlpha(0.4)
  },
});

entities.add({
  position: Cartesian3.fromDegrees(127.007, 37.50, 100.0),
  cylinder: {
    hierarchy: new PolygonHierarchy(
      Cartesian3.fromDegreesArray([
        -118.0,
        30.0,
        -115.0,
        30.0,
        -117.1,
        31.1,
        -118.0,
        33.0,
      ])
    ),
    length: 200.0,
    topRadius: 700.0,
    bottomRadius: 700.0,
    outline: true,
    outlineColor: Color.WHITE.withAlpha(0.3),
    outlineWidth: 4,
    material: Color.MAGENTA.withAlpha(0.3),
  },
});
//*/


///* // ssomlee 2022.12.15 드론 시점 변경 추가

// 상공
function skyview() {
  viewer.trackedEntity = undefined;
  viewer.zoomTo(
    viewer.entities,
    new HeadingPitchRange(0, Math.toRadians(-90))
  );
  
}

// HTML 요소 찾기
const btn1 = document.querySelector('#test_skyview');

// action
btn1.addEventListener('click', skyview);


// 측면
function sideview() {
  viewer.trackedEntity = undefined;
  viewer.zoomTo(
    viewer.entities,
    new HeadingPitchRange(Math.toRadians(-90), Math.toRadians(-15), 7500)
  );
};

// HTML 요소 찾기
const btn2 = document.querySelector('#test_sideview');

// action
btn2.addEventListener('click', sideview);

// 드론뷰
function droneview() {
  viewer.trackedEntity = airplaneEntity;
}

// HTML 요소 찾기
const btn3 = document.querySelector('#test_droneview');

// action
btn3.addEventListener('click', droneview);

//*/