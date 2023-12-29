// import React, { useRef, useEffect } from 'react';
// import * as tf from '@tensorflow/tfjs';
// import * as cocossd from '@tensorflow-models/coco-ssd';
// import Webcam from 'react-webcam';
// // import { drawRect } from './utilities';

// import { Box, Card } from '@mui/material';
// import swal from 'sweetalert';

// export default function Home({ cheatingLog, updateCheatingLog }) {
//   const webcamRef = useRef(null);
//   const canvasRef = useRef(null);

//   const runCoco = async () => {
//     const net = await cocossd.load();
//     console.log('Ai models loaded.');

//     setInterval(() => {
//       detect(net);
//     }, 1500);
//   };

//   const detect = async (net) => {
//     if (
//       typeof webcamRef.current !== 'undefined' &&
//       webcamRef.current !== null &&
//       webcamRef.current.video.readyState === 4
//     ) {
//       const video = webcamRef.current.video;
//       const videoWidth = webcamRef.current.video.videoWidth;
//       const videoHeight = webcamRef.current.video.videoHeight;

//       webcamRef.current.video.width = videoWidth;
//       webcamRef.current.video.height = videoHeight;

//       canvasRef.current.width = videoWidth;
//       canvasRef.current.height = videoHeight;

//       const obj = await net.detect(video);

//       const ctx = canvasRef.current.getContext('2d');

//       let person_count = 0;
//       if (obj.length < 1) {
//         updateCheatingLog((prevLog) => ({
//           ...prevLog,
//           noFaceCount: prevLog.noFaceCount + 1,
//         }));
//         swal('Face Not Visible', 'Action has been Recorded', 'error');
//       }
//       obj.forEach((element) => {
//         if (element.class === 'cell phone') {
//           updateCheatingLog((prevLog) => ({
//             ...prevLog,
//             cellPhoneCount: prevLog.cellPhoneCount + 1,
//           }));
//           swal('Cell Phone Detected', 'Action has been Recorded', 'error');
//         }
//         if (element.class === 'book') {
//           updateCheatingLog((prevLog) => ({
//             ...prevLog,
//             ProhibitedObjectCount: prevLog.ProhibitedObjectCount + 1,
//           }));
//           swal('Prohibited Object Detected', 'Action has been Recorded', 'error');
//         }

//         if (!element.class === 'person') {
//           swal('Face Not Visible', 'Action has been Recorded', 'error');
//         }
//         if (element.class === 'person') {
//           person_count++;
//           if (person_count > 1) {
//             updateCheatingLog((prevLog) => ({
//               ...prevLog,
//               multipleFaceCount: prevLog.multipleFaceCount + 1,
//             }));
//             swal('Multiple Faces Detected', 'Action has been Recorded', 'error');
//             person_count = 0;
//           }
//         }
//       });
//     }
//   };
//   useEffect(() => {
//     runCoco();
//   }, []);

//   return (
//     <Box>
//       <Card variant="outlined">
//         <Webcam
//           ref={webcamRef}
//           muted={true}
//           style={{
//             left: 0,
//             right: 0,
//             textAlign: 'center',
//             zIndex: 9,
//             width: '100%',
//             height: '100%',
//           }}
//         />

//         <canvas
//           ref={canvasRef}
//           style={{
//             position: 'absolute',
//             marginLeft: 'auto',
//             marginRight: 'auto',
//             left: 0,
//             right: 0,
//             textAlign: 'center',
//             zIndex: 8,
//             width: 240,
//             height: 240,
//           }}
//         />
//       </Card>
//     </Box>
//   );
// }

import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocossd from '@tensorflow-models/coco-ssd';
import * as facelandmarksDetection from '@tensorflow-models/face-landmarks-detection'; // Import face mesh
import Webcam from 'react-webcam';
import { Box, Card } from '@mui/material';
import swal from 'sweetalert';
import { drawMesh } from './meshutitlity';

export default function Home({ cheatingLog, updateCheatingLog }) {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runModels = async () => {
    const net = await cocossd.load();
    console.log('Ai models loaded.');

    const faceMesh = await facelandmarksDetection.load(
      facelandmarksDetection.SupportedPackages.mediapipeFacemesh,
    );
    console.log('Face landmarks detection model loaded.');

    setInterval(() => {
      // console.log('AI models Called.');
      detect(net, faceMesh);
    }, 1500);
  };

  useEffect(() => {
    runModels();
  }, []);

  const detect = async (objNet, facemeshModel) => {
    if (
      typeof webcamRef.current !== 'undefined' &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;

      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const obj = await objNet.detect(video);
      let person_count = 0;
      if (obj.length < 1) {
        updateCheatingLog((prevLog) => ({
          ...prevLog,
          noFaceCount: prevLog.noFaceCount + 1,
        }));
        swal('Face Not Visible', 'Action has been Recorded', 'error');
      }
      obj.forEach((element) => {
        if (element.class === 'cell phone') {
          updateCheatingLog((prevLog) => ({
            ...prevLog,
            cellPhoneCount: prevLog.cellPhoneCount + 1,
          }));
          swal('Cell Phone Detected', 'Action has been Recorded', 'error');
        }
        if (element.class === 'book') {
          updateCheatingLog((prevLog) => ({
            ...prevLog,
            ProhibitedObjectCount: prevLog.ProhibitedObjectCount + 1,
          }));
          swal('Prohibited Object Detected', 'Action has been Recorded', 'error');
        }
        if (!element.class === 'person') {
          swal('Face Not Visible', 'Action has been Recorded', 'error');
        }
        if (element.class === 'person') {
          person_count++;
          if (person_count > 1) {
            updateCheatingLog((prevLog) => ({
              ...prevLog,
              multipleFaceCount: prevLog.multipleFaceCount + 1,
            }));
            swal('Multiple Faces Detected', 'Action has been Recorded', 'error');
            person_count = 0;
          }
        }
      });

      // Head pose estimation using face mesh
      const faces = await facemeshModel.estimateFaces({ input: video });
      console.log('face Data: ', faces);

      // Assuming the first face detected is the user's face
      if (faces.length > 0) {
        const face = faces[0];
        // console.log("face[0] Data: ",face);
        const leftEye = face.annotations?.leftEyeIris || [];
        const rightEye = face.annotations?.rightEyeIris || [];
        const nose = face.annotations.noseTip || [];

        const eyeCoordinates = leftEye.concat(rightEye);

        // console.log("eye coordinates: " + eyeCoordinates)

        // Check if any eye coordinate moves away from the screen
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        let eyeMovedAway = false;
        eyeCoordinates.forEach((eyeCoord) => {
          const [x, y] = eyeCoord;
          if (x < 0 || x > screenWidth || y < 0 || y > screenHeight) {
            eyeMovedAway = true;
          }
        });
        if (eyeMovedAway) {
          // Trigger alert if any eye moves away from the screen
          swal('Eyes Moved Away from Screen', 'Action has been Recorded', 'error');
        }

        // Calculate the relative positions of eyes and nose tip for gaze direction
        const horizontalGaze = leftEye[0][0] - rightEye[3][0]; // Horizontal gaze
        const verticalGaze = nose[0][1] - (leftEye[3][1] + rightEye[3][1]) / 2;
        // Determine the direction based on horizontal and vertical gaze values
        let direction = '';
        if (Math.abs(horizontalGaze) > Math.abs(verticalGaze)) {
          direction = horizontalGaze > 0 ? 'Right' : 'Left';
        } else {
          direction = verticalGaze > 0 ? 'Down' : 'Up';
        }

        // Trigger alert based on gaze direction
        if (direction !== '') {
          console.log(`Gaze direction detected: ${direction}`);
          // swal('Gaze direction detected:', 'Action has been Recorded', 'error');
        }

        // Get canvas context
        const ctx = canvasRef.current.getContext('2d');
        requestAnimationFrame(() => {
          drawMesh(faces, ctx);
        });
      }
    }
  };

  return (
    <Box>
      <Card variant="outlined">
        <Webcam
          ref={webcamRef}
          muted={true}
          style={{
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex: 9, // Fix: Change z-index to correct capitalization
            width: '100%',
            height: '100%',
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex: 8, // Fix: Change z-index to correct capitalization
            width: 240,
            height: 240,
          }}
        />
      </Card>
    </Box>
  );
}
