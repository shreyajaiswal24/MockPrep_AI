"use client";

import { useEffect } from "react";
import { useVideoRecorder } from "@/hooks/useVideoRecorder";
import GlassPanel from "@/components/GlassPanel";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Video,
  Square,
  RotateCcw,
  Upload,
  Pause,
  Play,
  Camera,
  AlertCircle,
} from "lucide-react";

interface VideoRecorderProps {
  timeLimit?: number;
  onSubmit?: (blob: Blob, duration: number) => void;
  onRecordingStart?: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function VideoRecorder({
  timeLimit = 120,
  onSubmit,
  onRecordingStart,
}: VideoRecorderProps) {
  const {
    stream,
    isRecording,
    isPaused,
    recordedBlob,
    recordedUrl,
    duration,
    error,
    videoRef,
    startCamera,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
    stopCamera,
  } = useVideoRecorder();

  useEffect(() => {
    startCamera();
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isRecording && duration >= timeLimit) {
      stopRecording();
    }
  }, [duration, timeLimit, isRecording, stopRecording]);

  const handleStartRecording = () => {
    startRecording();
    onRecordingStart?.();
  };

  const handleSubmit = () => {
    if (recordedBlob) {
      onSubmit?.(recordedBlob, duration);
    }
  };

  const progress = timeLimit > 0 ? (duration / timeLimit) * 100 : 0;

  return (
    <GlassPanel variant="strong" className="overflow-hidden">
      {/* Video area */}
      <div className="relative aspect-video bg-black/60 rounded-t-xl overflow-hidden">
        {recordedUrl && !isRecording ? (
          <video
            src={recordedUrl}
            controls
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover mirror"
            style={{ transform: "scaleX(-1)" }}
          />
        )}

        {/* Recording indicator */}
        {isRecording && (
          <div className="absolute top-4 left-4 flex items-center gap-2 glass rounded-full px-3 py-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 recording-pulse" />
            <span className="text-sm font-medium text-white/90">
              {isPaused ? "Paused" : "Recording"}
            </span>
          </div>
        )}

        {/* Timer overlay */}
        {(isRecording || recordedBlob) && (
          <div className="absolute top-4 right-4 glass rounded-full px-3 py-1.5">
            <span className="text-sm font-mono text-white/90">{formatTime(duration)}</span>
            <span className="text-sm text-white/40"> / {formatTime(timeLimit)}</span>
          </div>
        )}

        {/* No camera */}
        {!stream && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Camera className="w-12 h-12 text-white/20 mb-3" />
            <p className="text-white/40 text-sm">Starting camera...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
            <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
            <p className="text-red-300 text-sm text-center">{error}</p>
            <Button
              onClick={startCamera}
              variant="outline"
              size="sm"
              className="mt-4 border-white/10 text-white/70"
            >
              Retry
            </Button>
          </div>
        )}
      </div>

      {/* Progress bar */}
      {isRecording && (
        <Progress value={progress} className="h-1 rounded-none bg-white/5" />
      )}

      {/* Controls */}
      <div className="p-4 flex items-center justify-center gap-3">
        {!isRecording && !recordedBlob && (
          <Button
            onClick={handleStartRecording}
            disabled={!stream}
            className="btn-gradient text-white border-0 gap-2"
          >
            <Video className="w-4 h-4" />
            Start Recording
          </Button>
        )}

        {isRecording && (
          <>
            {isPaused ? (
              <Button
                onClick={resumeRecording}
                variant="outline"
                className="border-white/10 text-white/70 hover:bg-white/5 gap-2"
              >
                <Play className="w-4 h-4" />
                Resume
              </Button>
            ) : (
              <Button
                onClick={pauseRecording}
                variant="outline"
                className="border-white/10 text-white/70 hover:bg-white/5 gap-2"
              >
                <Pause className="w-4 h-4" />
                Pause
              </Button>
            )}
            <Button
              onClick={stopRecording}
              variant="outline"
              className="border-red-500/30 text-red-400 hover:bg-red-500/10 gap-2"
            >
              <Square className="w-4 h-4" />
              Stop
            </Button>
          </>
        )}

        {recordedBlob && !isRecording && (
          <>
            <Button
              onClick={resetRecording}
              variant="outline"
              className="border-white/10 text-white/70 hover:bg-white/5 gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Re-record
            </Button>
            <Button
              onClick={handleSubmit}
              className="btn-gradient text-white border-0 gap-2"
            >
              <Upload className="w-4 h-4" />
              Submit
            </Button>
          </>
        )}
      </div>
    </GlassPanel>
  );
}
