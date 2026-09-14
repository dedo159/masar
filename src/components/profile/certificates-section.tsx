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
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          {isRtl ? "الشهادات والدورات" : "Certificates"}
        </h3>
        {!showUploadForm && (
          <Button variant="outline" size="sm" onClick={() => setShowUploadForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            {isRtl ? "إضافة شهادة" : "Add Certificate"}
          </Button>
        )}
      </div>

      {showUploadForm && (
        <form onSubmit={handleUpload} className="bg-secondary/30 p-4 rounded-lg mb-6 border border-border/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">{isRtl ? "اسم الشهادة/الدورة" : "Certificate Name"}</label>
              <Input 
                required 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder={isRtl ? "مثال: Google Data Analytics" : "e.g. Google Data Analytics"}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                {isRtl ? "الجهة المانحة" : "Issuer"} <span className="text-muted-foreground text-xs font-normal">({isRtl ? "اختياري" : "Optional"})</span>
              </label>
              <Input 
                value={formData.issuer} 
                onChange={(e) => setFormData({...formData, issuer: e.target.value})}
                placeholder={isRtl ? "مثال: Coursera" : "e.g. Coursera"}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">{isRtl ? "ملف الشهادة (صورة أو PDF)" : "Certificate File"}</label>
              <Input 
                type="file" 
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="file:me-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setShowUploadForm(false)}>
              {isRtl ? "إلغاء" : "Cancel"}
            </Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? (isRtl ? "جاري الرفع..." : "Uploading...") : (isRtl ? "حفظ الشهادة" : "Save Certificate")}
            </Button>
          </div>
        </form>
      )}

      {certificates.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground bg-secondary/10 rounded-lg border border-dashed">
          <Award className="h-10 w-10 mx-auto mb-3 opacity-20" />
          <p>{isRtl ? "لا توجد شهادات مضافة حتى الآن." : "No certificates added yet."}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {certificates.map((cert) => (
            <div key={cert.id} className="flex p-3 rounded-lg border border-border bg-background hover:border-primary/30 transition-colors group">
              <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center me-3 shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-foreground truncate" title={cert.name}>{cert.name}</h4>
                {cert.issuer && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                    <Building2 className="h-3 w-3" />
                    <span className="truncate">{cert.issuer}</span>
                  </p>
                )}
              </div>
              <div className="flex items-start opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="ghost" 
                  size="icon-sm" 
                  className="text-destructive hover:bg-destructive/10 h-7 w-7"
                  onClick={() => handleDelete(cert.id)}
                  disabled={deletingId === cert.id}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                {cert.fileData && (
                  <Button 
                    variant="ghost" 
                    size="icon-sm" 
                    className="text-primary hover:bg-primary/10 h-7 w-7 ms-1"
                    onClick={() => {
                      const w = window.open();
                      if (w) w.document.write(`<iframe src="${cert.fileData}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
                    }}
                  >
                    <Upload className="h-4 w-4 rotate-180" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
