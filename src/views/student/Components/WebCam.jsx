import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocossd from '@tensorflow-models/coco-ssd';
import * as facelandmarksDetection from '@tensorflow-models/face-landmarks-detection';
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
        const leftEye = face.annotations?.leftEyeIris || [];
        const rightEye = face.annotations?.rightEyeIris || [];
        const nose = face.annotations.noseTip || [];

        const horizontalGaze = leftEye[0][0] - rightEye[3][0];
        const verticalGaze = nose[0][1] - (leftEye[3][1] + rightEye[3][1]) / 2;

        // const horizontalUpperThreshold = 100;
        const horizontalLOwerThreshold = 80;
        const verticalUpperThreshold = 65;
        const verticalLowerThreshold = 40;
        // console.log(`ver:${verticalGaze} Hor:${horizontalGaze}`);

        if (
          Math.abs(horizontalGaze) < horizontalLOwerThreshold ||
          Math.abs(verticalGaze) > verticalUpperThreshold ||
          Math.abs(verticalGaze) < verticalLowerThreshold
        ) {
          // swal('Head Movement Detected:', 'Action has been Recorded', 'error');
        }

        const horizontalGazeLeft = leftEye[0][0] - leftEye[3][0];
        const verticalGazeLeft = leftEye[1][1] - leftEye[4][1];
        const horizontalGazeRight = rightEye[0][0] - rightEye[3][0];
        const verticalGazeRight = rightEye[1][1] - rightEye[4][1];
        const horizontalThreshold = 9;
        const verticalThreshold = 11;
        console.log(
          `hleft:${horizontalGazeLeft} vleft: ${verticalGazeLeft} hright:${horizontalGazeRight} vright:${verticalGazeRight}`,
        );

        if (
          Math.abs(horizontalGazeLeft) > horizontalThreshold ||
          Math.abs(horizontalGazeRight) > horizontalThreshold ||
          Math.abs(verticalGazeLeft) > verticalThreshold ||
          Math.abs(verticalGazeRight) > verticalThreshold
        ) {
          swal('Eye movement detected:', 'Action has been Recorded', 'error');
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
            zIndex: 9,
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
            zIndex: 8,
            width: 240,
            height: 240,
          }}
        />
      </Card>
    </Box>
  );
}
