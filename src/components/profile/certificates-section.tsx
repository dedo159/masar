"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Upload, Trash2, Award, Calendar, FileText, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/components/providers/language-provider";
import { formatTime } from "@/lib/utils";

interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: Date | string;
  fileType?: string | null;
  fileData?: string | null;
}

export function CertificatesSection({ certificates }: { certificates: Certificate[] }) {
  const { t, isRtl } = useLanguage();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    issuer: "",
    issueDate: "",
    fileData: "",
    fileType: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setFormData((prev) => ({
        ...prev,
        fileData: base64,
        fileType: file.type,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    setIsUploading(true);
    try {
      const res = await fetch("/api/students/me/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowUploadForm(false);
        setFormData({ name: "", issuer: "", issueDate: "", fileData: "", fileType: "" });
        router.refresh();
      } else {
        console.error("Upload failed");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isRtl ? "هل أنت متأكد من حذف هذه الشهادة؟" : "Are you sure you want to delete this certificate?")) return;
    
    setDeletingId(id);
    try {
      const res = await fetch(`/api/students/me/certificates/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="apple-glass-card p-5 sm:p-6 shadow-xl mt-6">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
        <h3 className="font-bold text-lg flex items-center gap-2.5 text-white">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Award className="h-5 w-5" />
          </div>
          <span>{isRtl ? "الشهادات والدورات المعتمدة" : "Certificates & Accreditations"}</span>
        </h3>
        {!showUploadForm && (
          <Button 
            size="sm" 
            onClick={() => setShowUploadForm(true)} 
            className="gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 text-xs px-3.5 py-2"
          >
            <Plus className="h-4 w-4" />
            <span>{isRtl ? "إضافة شهادة" : "Add Certificate"}</span>
          </Button>
        )}
      </div>

      {showUploadForm && (
        <form onSubmit={handleUpload} className="bg-white/[0.04] p-5 rounded-2xl mb-6 border border-white/12 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-200 mb-1.5 block">
                {isRtl ? "اسم الشهادة أو الدورة" : "Certificate Name"}
              </label>
              <Input 
                required 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder={isRtl ? "مثال: Google Data Analytics Certificate" : "e.g. Google Data Analytics"}
                className="bg-white/[0.06] border-white/15 text-white placeholder:text-slate-400 focus:border-blue-400 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-200 mb-1.5 block">
                {isRtl ? "الجهة المانحة" : "Issuer"} <span className="text-slate-400 text-xs font-normal">({isRtl ? "اختياري" : "Optional"})</span>
              </label>
              <Input 
                value={formData.issuer} 
                onChange={(e) => setFormData({...formData, issuer: e.target.value})}
                placeholder={isRtl ? "مثال: Coursera / Google" : "e.g. Coursera"}
                className="bg-white/[0.06] border-white/15 text-white placeholder:text-slate-400 focus:border-blue-400 rounded-xl text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-slate-200 mb-1.5 block">
                {isRtl ? "ملف الشهادة (صورة أو PDF)" : "Certificate File"}
              </label>
              <Input 
                type="file" 
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="bg-white/[0.06] border-white/15 text-slate-200 file:me-3 file:py-1.5 file:px-3.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer rounded-xl text-sm"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2.5 pt-2">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setShowUploadForm(false)}
              className="text-slate-300 hover:text-white hover:bg-white/10 rounded-xl text-xs font-medium"
            >
              {isRtl ? "إلغاء" : "Cancel"}
            </Button>
            <Button 
              type="submit" 
              disabled={isUploading}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs px-5 shadow-md"
            >
              {isUploading ? (isRtl ? "جاري الرفع..." : "Uploading...") : (isRtl ? "حفظ الشهادة" : "Save Certificate")}
            </Button>
          </div>
        </form>
      )}

      {certificates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 px-4 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] text-center transition-colors">
          <div className="h-14 w-14 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center mb-3 shadow-md text-blue-400">
            <Award className="h-7 w-7" strokeWidth={1.75} />
          </div>
          <p className="text-slate-200 font-semibold text-sm">
            {isRtl ? "لا توجد شهادات مضافة حتى الآن." : "No certificates added yet."}
          </p>
          <p className="text-slate-400 text-xs mt-1">
            {isRtl ? "أضف شهاداتك ودوراتك التدريبية لتعزيز ملفك الشخصي أمام مسؤولي التوظيف" : "Add your certifications to showcase verified skills to recruiters"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {certificates.map((cert) => (
            <div 
              key={cert.id} 
              className="flex items-center p-3.5 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 active:scale-[0.99] transition-all duration-200 group shadow-sm"
            >
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-400/30 text-blue-400 flex items-center justify-center me-3.5 shrink-0 shadow-sm">
                <FileText className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-white truncate" title={cert.name}>
                  {cert.name}
                </h4>
                {cert.issuer && (
                  <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-1 font-medium">
                    <Building2 className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                    <span className="truncate">{cert.issuer}</span>
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity shrink-0">
                {cert.fileData && (
                  <Button 
                    variant="ghost" 
                    size="icon-sm" 
                    className="text-blue-400 hover:text-blue-300 hover:bg-white/10 h-8 w-8 rounded-lg"
                    title={isRtl ? "عرض ملف الشهادة" : "View certificate file"}
                    onClick={() => {
                      const w = window.open();
                      if (w) w.document.write(`<iframe src="${cert.fileData}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
                    }}
                  >
                    <Upload className="h-4 w-4 rotate-180" />
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="icon-sm" 
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/15 h-8 w-8 rounded-lg"
                  title={isRtl ? "حذف الشهادة" : "Delete certificate"}
                  onClick={() => handleDelete(cert.id)}
                  disabled={deletingId === cert.id}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
