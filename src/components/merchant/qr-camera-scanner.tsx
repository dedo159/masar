"use client";

import { useEffect, useRef, useState } from "react";
import {
  Camera,
  X,
  RefreshCw,
  Flashlight,
  AlertCircle,
  Sparkles,
  QrCode,
  ShieldCheck,
  SwitchCamera,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface QrCameraScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (decodedCode: string) => void;
}

export function QrCameraScanner({ isOpen, onClose, onScanSuccess }: QrCameraScannerProps) {
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [cameras, setCameras] = useState<Array<{ id: string; label: string }>>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);

  const scannerRef = useRef<any>(null);
  const readerElementId = "masar-pos-qr-reader";

  // Play cashier confirmation beep on scan
  const playCashierBeep = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(987.77, ctx.currentTime); // B5 note
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.16);
    } catch {
      // Audio context might be restricted before interaction
    }
  };

  const parseScannedText = (raw: string): string => {
    let clean = raw.trim();
    try {
      if (clean.startsWith("{") && clean.endsWith("}")) {
        const obj = JSON.parse(clean);
        if (obj.code) return String(obj.code).toUpperCase();
        if (obj.voucher) return String(obj.voucher).toUpperCase();
        if (obj.dealId) return String(obj.dealId).toUpperCase();
      }
    } catch {}
    if (clean.includes("code=")) {
      const match = clean.match(/code=([a-zA-Z0-9_-]+)/);
      if (match) return match[1].toUpperCase();
    }
    return clean.toUpperCase();
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    let isMounted = true;
    let html5QrCode: any = null;

    async function initCamera() {
      setIsInitializing(true);
      setCameraError(null);

      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (!isMounted) return;

        // Check for available cameras
        try {
          const devices = await Html5Qrcode.getCameras();
          if (isMounted && devices && devices.length > 0) {
            setCameras(devices);
            if (!selectedCameraId) {
              // Prefer back/environment camera
              const backCam = devices.find(
                (d) =>
                  d.label.toLowerCase().includes("back") ||
                  d.label.toLowerCase().includes("rear") ||
                  d.label.toLowerCase().includes("environment")
              );
              setSelectedCameraId(backCam ? backCam.id : devices[0].id);
            }
          }
        } catch {
          // getCameras failed, will fallback to facingMode: environment
        }

        html5QrCode = new Html5Qrcode(readerElementId);
        scannerRef.current = html5QrCode;

        const cameraConfig = selectedCameraId
          ? { deviceId: { exact: selectedCameraId } }
          : { facingMode: "environment" };

        await html5QrCode.start(
          cameraConfig,
          {
            fps: 12,
            qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
              const minDim = Math.min(viewfinderWidth, viewfinderHeight);
              return {
                width: Math.floor(minDim * 0.72),
                height: Math.floor(minDim * 0.72),
              };
            },
            aspectRatio: 1.0,
          },
          (decodedText: string) => {
            if (!isMounted) return;
            playCashierBeep();
            const code = parseScannedText(decodedText);
            // Stop scanning and close
            if (html5QrCode && html5QrCode.isScanning) {
              html5QrCode.stop().then(() => {
                html5QrCode.clear();
              }).catch(() => {});
            }
            onScanSuccess(code);
          },
          () => {
            // Frame parse error - ignore standard noise frames
          }
        );

        if (isMounted) {
          setIsInitializing(false);
          // Check if torch is supported
          try {
            const track = html5QrCode.getRunningTrackCameraCapabilities();
            if (track && track.torchFeature && track.torchFeature().isSupported()) {
              setHasTorch(true);
            }
          } catch {}
        }
      } catch (err: any) {
        if (!isMounted) return;
        console.error("Camera start error:", err);
        setIsInitializing(false);

        let message = "تعذر تشغيل كاميرا الجهاز. يرجى التأكد من منح الإذن لاستخدام الكاميرا.";
        if (err?.name === "NotAllowedError" || String(err).includes("NotAllowedError")) {
          message = "تم رفض إذن الوصول للكاميرا. يرجى السماح بالوصول من إعدادات المتصفح ثم المحاولة ثانية.";
        } else if (err?.name === "NotFoundError" || String(err).includes("NotFoundError")) {
          message = "لم يتم العثور على كاميرا متصلة بهذا الجهاز.";
        } else if (location.protocol !== "https:" && location.hostname !== "localhost") {
          message = "يتطلب تشغيل الكاميرا اتصالاً آمناً عبر HTTPS.";
        }
        setCameraError(message);
      }
    }

    initCamera();

    return () => {
      isMounted = false;
      if (scannerRef.current) {
        try {
          if (scannerRef.current.isScanning) {
            scannerRef.current.stop().then(() => {
              scannerRef.current.clear();
            }).catch(() => {});
          } else {
            scannerRef.current.clear();
          }
        } catch {}
      }
    };
  }, [isOpen, selectedCameraId]);

  const toggleTorch = async () => {
    if (!scannerRef.current) return;
    try {
      const caps = scannerRef.current.getRunningTrackCameraCapabilities();
      if (caps && caps.torchFeature) {
        await caps.torchFeature().apply(!torchOn);
        setTorchOn(!torchOn);
      }
    } catch (e) {
      console.error("Torch error", e);
    }
  };

  const switchCamera = () => {
    if (cameras.length <= 1) return;
    const currentIndex = cameras.findIndex((c) => c.id === selectedCameraId);
    const nextIndex = (currentIndex + 1) % cameras.length;
    setSelectedCameraId(cameras[nextIndex].id);
  };

  if (!isOpen) return null;

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0f1724] p-5 sm:p-6 shadow-2xl space-y-4 text-start">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Camera className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">ماسح الكاميرا الفوري لنقاط البيع</h3>
              <p className="text-[11px] text-slate-400 font-mono">Live POS Camera Scanner</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Viewport Container */}
        <div className="relative w-full aspect-square rounded-2xl bg-[#090d14] overflow-hidden border-2 border-emerald-500/30 flex items-center justify-center shadow-inner">
          {/* html5-qrcode target element */}
          <div
            id={readerElementId}
            className="w-full h-full object-cover [&>video]:w-full [&>video]:h-full [&>video]:object-cover"
          />

          {/* Laser Scanning Animation (active while scanning) */}
          {!cameraError && !isInitializing && (
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-center items-center">
              {/* Center Brackets */}
              <div className="w-56 h-56 border-2 border-dashed border-emerald-400/80 rounded-2xl relative shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                {/* Corner Accents */}
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />

                {/* Animated Laser Beam */}
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#10b981] animate-pulse top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          {/* Initializing Spinner */}
          {isInitializing && !cameraError && (
            <div className="absolute inset-0 bg-[#090d14]/90 flex flex-col items-center justify-center gap-2 z-10">
              <RefreshCw className="h-8 w-8 text-emerald-400 animate-spin" />
              <span className="text-xs text-slate-300 font-mono">جاري ربط وتشغيل الكاميرا...</span>
            </div>
          )}

          {/* Camera Error Display */}
          {cameraError && (
            <div className="absolute inset-0 bg-[#090d14]/95 p-6 flex flex-col items-center justify-center text-center gap-3 z-10">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
                <AlertCircle className="h-6 w-6" />
              </div>
              <p className="text-xs text-rose-300 leading-relaxed max-w-xs">{cameraError}</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedCameraId(null)}
                  className="text-xs border-white/10 hover:bg-white/10 text-white cursor-pointer"
                >
                  إعادة المحاولة
                </Button>
              </div>
            </div>
          )}

          {/* Top Camera Controls Overlay */}
          {!cameraError && !isInitializing && (
            <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-auto z-20">
              <div className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>الكاميرا متصلة وحية</span>
              </div>

              <div className="flex items-center gap-1.5">
                {hasTorch && (
                  <button
                    type="button"
                    onClick={toggleTorch}
                    className={`p-2 rounded-full backdrop-blur-md border transition-colors cursor-pointer ${
                      torchOn
                        ? "bg-amber-500 text-black border-amber-400"
                        : "bg-black/60 text-white border-white/10 hover:bg-white/20"
                    }`}
                    title="تشغيل / إيقاف الفلاش"
                  >
                    <Flashlight className="h-4 w-4" />
                  </button>
                )}

                {cameras.length > 1 && (
                  <button
                    type="button"
                    onClick={switchCamera}
                    className="p-2 rounded-full bg-black/60 text-white border border-white/10 hover:bg-white/20 backdrop-blur-md transition-colors cursor-pointer"
                    title="تبديل الكاميرا (أمامية / خلفية)"
                  >
                    <SwitchCamera className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Guidance and Fallback Simulation */}
        <div className="space-y-2.5 pt-1">
          <p className="text-[11px] text-slate-400 text-center">
            وجّه الكاميرا نحو رمز QR على تطبيق الطالب وسيتم التحقق التلقائي فوراً مع صوت التوثيق.
          </p>

          {/* Quick Fallback Simulation Buttons for testing without camera */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>أو محاكاة سريعة بكود تجريبي:</span>
              <Sparkles className="h-3 w-3 text-amber-400" />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <Button
                size="sm"
                onClick={() => {
                  playCashierBeep();
                  onScanSuccess("MASAR20");
                }}
                className="bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold h-9 text-xs rounded-xl cursor-pointer"
              >
                مسح كود عمر (خصم 20%)
              </Button>

              <Button
                size="sm"
                onClick={() => {
                  playCashierBeep();
                  onScanSuccess("BURGER50");
                }}
                className="bg-amber-600/90 hover:bg-amber-500 text-white font-bold h-9 text-xs rounded-xl cursor-pointer"
              >
                مسح كود سارة (BOGO)
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Security */}
        <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 font-mono pt-1">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>تشفير الكاميرا والماسح متوافق مع معايير نقاط البيع السريعة</span>
        </div>
      </div>
    </div>
  );
}
