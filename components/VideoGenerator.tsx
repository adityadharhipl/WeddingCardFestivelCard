'use client';

import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';

interface VideoGeneratorProps {
  currentUser: { isApproved: boolean; email?: string } | null;
  onNeedLogin: () => void;
  isAdmin?: boolean;
}

export default function VideoGenerator({ currentUser, onNeedLogin, isAdmin }: VideoGeneratorProps) {
  const [images, setImages] = useState<File[]>([]);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [videoDuration, setVideoDuration] = useState(5); // Minutes
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  
  const isSuperAdmin = currentUser?.email === 'aditya16@gmail.com';
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (filesArray.length < 3 || filesArray.length > 4) {
        toast.error('Please select exactly 3 or 4 images.');
        return;
      }
      setImages(filesArray);
      setVideoUrl(null);
    }
  };

  const generateVideo = async () => {
    if (images.length < 3 || images.length > 4) {
      toast.error('You need exactly 3 or 4 images.');
      return;
    }

    if (!isAdmin) {
      if (!currentUser) {
        const guestCount = parseInt(localStorage.getItem('guestVideoCount') || '0', 10);
        if (guestCount >= 2) {
          toast.error('Guest limit reached. Please log in to continue.');
          onNeedLogin();
          return;
        }
      } else if (!currentUser.isApproved) {
        toast.error('Your account is pending admin approval.');
        return;
      }
    }

    setIsGenerating(true);
    setProgress(0);
    setVideoUrl(null);

    try {
      const loadedImages = await Promise.all(
        images.map(
          (file) =>
            new Promise<HTMLImageElement>((resolve, reject) => {
              const img = new Image();
              img.src = URL.createObjectURL(file);
              img.onload = () => resolve(img);
              img.onerror = reject;
            })
        )
      );

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set standard size (1080x1920 portrait)
      canvas.width = 1080;
      canvas.height = 1920;

      const stream = canvas.captureStream(30);

      // Mix audio if provided
      if (isSuperAdmin && audioFile) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const source = audioContext.createBufferSource();
        const arrayBuffer = await audioFile.arrayBuffer();
        source.buffer = await audioContext.decodeAudioData(arrayBuffer);
        const destination = audioContext.createMediaStreamDestination();
        source.connect(destination);
        source.start(0);
        // Add audio tracks to the canvas video stream
        destination.stream.getAudioTracks().forEach(track => {
          stream.addTrack(track);
        });
      }

      const options = { mimeType: 'video/webm;codecs=vp9' };
      const supportedMime = MediaRecorder.isTypeSupported(options.mimeType) ? options.mimeType : 'video/webm';
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType: supportedMime, videoBitsPerSecond: 5000000 });
      mediaRecorderRef.current = mediaRecorder;

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: supportedMime });
        setVideoBlob(blob);
        setVideoUrl(URL.createObjectURL(blob));
        setIsGenerating(false);
        setProgress(100);

        if (!isAdmin && !currentUser) {
          const currentCount = parseInt(localStorage.getItem('guestVideoCount') || '0', 10);
          localStorage.setItem('guestVideoCount', (currentCount + 1).toString());
        }
      };

      mediaRecorder.start();

      let durationPerImage = 3000; // 3 seconds default
      if (isSuperAdmin) {
        durationPerImage = (videoDuration * 60 * 1000) / loadedImages.length;
      }
      const fadeDuration = 500; // 0.5s fade
      const totalDuration = loadedImages.length * durationPerImage;
      const startTime = performance.now();

      const drawFrame = (timestamp: number) => {
        const elapsed = timestamp - startTime;
        setProgress(Math.min((elapsed / totalDuration) * 100, 100));

        if (elapsed >= totalDuration) {
          mediaRecorder.stop();
          return;
        }

        const currentIndex = Math.floor(elapsed / durationPerImage);
        const timeInCurrentImage = elapsed % durationPerImage;
        const currentImg = loadedImages[currentIndex];
        const nextImg = loadedImages[Math.min(currentIndex + 1, loadedImages.length - 1)];

        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const drawImageCover = (img: HTMLImageElement, alpha: number) => {
          ctx.globalAlpha = alpha;
          const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
          const w = img.width * scale;
          const h = img.height * scale;
          const x = (canvas.width - w) / 2;
          const y = (canvas.height - h) / 2;
          ctx.drawImage(img, x, y, w, h);
        };

        if (timeInCurrentImage > durationPerImage - fadeDuration && currentIndex < loadedImages.length - 1) {
          // Crossfade
          const fadeProgress = (timeInCurrentImage - (durationPerImage - fadeDuration)) / fadeDuration;
          drawImageCover(currentImg, 1 - fadeProgress);
          drawImageCover(nextImg, fadeProgress);
        } else {
          // Solid
          drawImageCover(currentImg, 1);
        }

        animationRef.current = requestAnimationFrame(drawFrame);
      };

      animationRef.current = requestAnimationFrame(drawFrame);
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate video');
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="glass" style={{ padding: 40, borderRadius: 24, textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>
        {isAdmin ? 'Admin Video Generator' : 'Premium Video Maker 🎥'}
      </h2>
      <p style={{ color: 'var(--ink-soft)', marginBottom: 32 }}>
        Select 3 to 4 images to create a stunning slideshow video.
      </p>

      <div style={{ marginBottom: 24 }}>
        <label style={{ 
          display: 'inline-flex', 
          alignItems: 'center',
          gap: 8,
          cursor: 'pointer', 
          padding: '14px 28px',
          border: '1px solid var(--border-soft)',
          borderRadius: 100,
          background: 'var(--surface-2)',
          color: 'var(--fg)',
          fontWeight: 600,
          fontSize: 16,
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'var(--surface-2)'}
        >
          📷 Upload Images (3-4)
          <input
            type="file"
            multiple
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageChange}
            disabled={isGenerating}
          />
        </label>
        {images.length > 0 && (
          <p style={{ marginTop: 12, fontSize: 14, color: 'var(--ink-soft)' }}>
            {images.length} images selected
          </p>
        )}
      </div>

      {isSuperAdmin && (
        <div style={{ marginBottom: 24, padding: 16, border: '1px dashed var(--border-soft)', borderRadius: 16, background: 'rgba(255,255,255,0.02)' }}>
          <h4 style={{ marginBottom: 12, color: 'var(--fg)', fontSize: 16, fontWeight: 700 }}>👑 Super Admin Settings</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: 'var(--ink-soft)' }}>Video Duration (5-10 minutes)</label>
              <input 
                type="number" 
                min={5} 
                max={10} 
                value={videoDuration}
                onChange={e => setVideoDuration(parseInt(e.target.value) || 5)}
                className="input-field"
                style={{ width: '100%', textAlign: 'center' }}
              />
            </div>
            
            <div>
              <label style={{ 
                display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer', 
                padding: '10px 20px', border: '1px solid var(--border-soft)', borderRadius: 100,
                background: 'var(--surface-2)', color: 'var(--fg)', fontSize: 14,
              }}>
                🎵 Add Background Song
                <input
                  type="file"
                  accept="audio/*"
                  style={{ display: 'none' }}
                  onChange={e => setAudioFile(e.target.files?.[0] || null)}
                />
              </label>
              {audioFile && <p style={{ marginTop: 8, fontSize: 12, color: 'var(--accent)' }}>Selected: {audioFile.name}</p>}
            </div>
          </div>
        </div>
      )}

      <button
        className="btn-primary"
        onClick={generateVideo}
        disabled={isGenerating || images.length < 3 || images.length > 4}
        style={{ width: '100%', padding: 16, fontSize: 18 }}
      >
        {isGenerating ? `Generating... ${Math.floor(progress)}%` : 'Create Video'}
      </button>

      {/* Hidden canvas for video generation */}
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
      />

      {videoUrl && (
        <div style={{ marginTop: 32 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Your Video is Ready! 🎉</h3>
          <video
            src={videoUrl}
            controls
            autoPlay
            loop
            style={{ width: '100%', borderRadius: 16, border: '2px solid var(--border-soft)', marginBottom: 16 }}
          />
            <a
              href={videoUrl}
              download="dwivedi-premium-slideshow.webm"
              className="btn-primary"
              style={{ display: 'inline-block', textDecoration: 'none', padding: '12px 32px' }}
            >
              Download Video
            </a>
            <button
              onClick={async () => {
                if (navigator.share && videoBlob) {
                  const file = new File([videoBlob], 'slideshow.webm', { type: 'video/webm' });
                  try {
                    await navigator.share({
                      title: 'My Video',
                      files: [file],
                    });
                  } catch (err) {
                    console.log('Share canceled or failed', err);
                  }
                } else {
                  toast.error('Sharing not supported on this browser. Download and share manually!');
                }
              }}
              className="btn-secondary"
              style={{ marginLeft: 16, padding: '12px 32px', borderRadius: 100, border: '1px solid #fff', background: 'transparent', color: '#fff', cursor: 'pointer' }}
            >
              Share to Instagram
            </button>
        </div>
      )}
    </div>
  );
}
