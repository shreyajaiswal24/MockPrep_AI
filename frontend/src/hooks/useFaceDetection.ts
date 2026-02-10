"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { EmotionData } from "@/types";

type EmotionMap = Record<string, number>;

interface UseFaceDetectionReturn {
  emotionData: EmotionData;
  currentEmotion: string;
  isModelLoaded: boolean;
  startDetection: (videoElement: HTMLVideoElement) => void;
  stopDetection: () => void;
}

export function useFaceDetection(): UseFaceDetectionReturn {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState("neutral");
  const [emotionData, setEmotionData] = useState<EmotionData>({
    averages: {},
    dominant: "neutral",
    timeline: [],
  });

  const faceapiRef = useRef<typeof import("@vladmandic/face-api") | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timelineRef = useRef<Array<{ time: number; emotions: EmotionMap }>>([]);
  const emotionSumsRef = useRef<EmotionMap>({});
  const sampleCountRef = useRef(0);
  const startTimeRef = useRef(0);

  // Load models on mount
  useEffect(() => {
    let mounted = true;

    const loadModels = async () => {
      try {
        const faceapi = await import("@vladmandic/face-api");
        faceapiRef.current = faceapi;

        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceExpressionNet.loadFromUri("/models");

        if (mounted) setIsModelLoaded(true);
      } catch (err) {
        console.warn("Face detection models failed to load:", err);
      }
    };

    loadModels();
    return () => { mounted = false; };
  }, []);

  const startDetection = useCallback((videoElement: HTMLVideoElement) => {
    if (!faceapiRef.current || !isModelLoaded) return;
    if (intervalRef.current) return; // Already running

    const faceapi = faceapiRef.current;
    startTimeRef.current = Date.now();
    timelineRef.current = [];
    emotionSumsRef.current = {};
    sampleCountRef.current = 0;

    intervalRef.current = setInterval(async () => {
      if (videoElement.paused || videoElement.ended) return;

      try {
        const detections = await faceapi
          .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 }))
          .withFaceExpressions();

        if (detections?.expressions) {
          const emotions = detections.expressions as unknown as EmotionMap;
          const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);

          // Track timeline
          timelineRef.current.push({ time: elapsed, emotions: { ...emotions } });

          // Accumulate for averages
          sampleCountRef.current += 1;
          for (const [emotion, value] of Object.entries(emotions)) {
            emotionSumsRef.current[emotion] = (emotionSumsRef.current[emotion] || 0) + (value as number);
          }

          // Find dominant emotion
          let maxVal = 0;
          let dominant = "neutral";
          for (const [emotion, value] of Object.entries(emotions)) {
            if ((value as number) > maxVal) {
              maxVal = value as number;
              dominant = emotion;
            }
          }
          setCurrentEmotion(dominant);

          // Update aggregated data
          const count = sampleCountRef.current;
          const averages: EmotionMap = {};
          for (const [emotion, sum] of Object.entries(emotionSumsRef.current)) {
            averages[emotion] = Math.round((sum / count) * 1000) / 1000;
          }

          setEmotionData({
            averages,
            dominant,
            timeline: timelineRef.current,
          });
        }
      } catch {
        // Detection can fail if video not ready - ignore
      }
    }, 2000);
  }, [isModelLoaded]);

  const stopDetection = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return {
    emotionData,
    currentEmotion,
    isModelLoaded,
    startDetection,
    stopDetection,
  };
}
