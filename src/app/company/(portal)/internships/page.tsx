"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Plus,
  MapPin,
  Clock,
  Users,
  Trash2,
  ExternalLink,
  X,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/components/providers/language-provider";

export default function InternshipsPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [internships, setInternships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    type: "onsite",
    duration: "",
    deadline: "",
    tags: "",
    applyUrl: "",
    description: "",
  });

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const res = await fetch("/api/company/internships");
      if (res.status === 401) {
        router.push("/company/login");
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setInternships(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/company/internships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean)
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ title: "", location: "", type: "onsite", duration: "", deadline: "", tags: "", applyUrl: "", description: "" });
        fetchInternships();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t.companyportalinternshipspagetsx.text_xyr3)) return;
    try {
      const res = await fetch(`/api/company/internships/${id}`, { method: "DELETE" });
      if (res.ok) {
        setInternships(internships.filter((i) => i.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-primary/10 text-primary">
              <Briefcase className="h-6 w-6" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {t.companyportalinternshipspagetsx.text_5zyo}
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            {t.companyportalinternshipspagetsx.text_oxwt}
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="h-10 px-4 text-xs font-semibold gap-2 shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>{t.companyportalinternshipspagetsx.text_v066}</span>
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-muted-foreground text-sm animate-pulse">
          {t.companyportalinternshipspagetsx.text_ebo6}
        </div>
      ) : internships.length === 0 ? (
        <Card className="text-center py-16 px-4 border-dashed">
          <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
            <Briefcase className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">{t.companyportalinternshipspagetsx.text_43wb}</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">{t.companyportalinternshipspagetsx.text_lsu1}</p>
          <Button
            onClick={() => setIsModalOpen(true)}
            size="sm"
            className="mt-4 gap-1.5 text-xs font-semibold"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{t.companyportalinternshipspagetsx.text_v066}</span>
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {internships.map((internship) => (
            <Card key={internship.id} className="p-5 flex flex-col justify-between hover:border-primary/40 transition-all shadow-xs group">
              <div>
                <div className="flex justify-between items-start gap-2 mb-3">
                  <h3 className="font-bold text-base text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {internship.title}
                  </h3>
                  <Badge variant="outline" className="text-[11px] font-semibold shrink-0">
                    {internship.type === "remote"
                      ? t.companyportalinternshipspagetsx.text_0bzt
                      : internship.type === "hybrid"
                      ? t.companyportalinternshipspagetsx.text_85wz
                      : t.companyportalinternshipspagetsx.text_1f64}
                  </Badge>
                </div>

                <div className="text-xs text-muted-foreground space-y-2 mb-5">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span>{internship.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span>{internship.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="font-semibold text-foreground">
                      {internship._count?.applications || 0} {t.companyportalinternshipspagetsx.text_kn29}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-border">
                <Link
                  href={`/company/internships/${internship.id}/applicants`}
                  className="flex-1"
                >
                  <Button variant="outline" size="sm" className="w-full text-xs font-semibold gap-1.5 h-9">
                    <Users className="h-3.5 w-3.5" />
                    <span>{t.companyportalinternshipspagetsx.text_7omr}</span>
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(internship.id)}
                  className="h-9 px-2.5 text-destructive hover:bg-destructive/10"
                  title={t.companyportalinternshipspagetsx.text_fbls}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* New Internship Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" dir="rtl">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border-border">
            <div className="p-5 border-b border-border flex justify-between items-center sticky top-0 bg-card/95 backdrop-blur-sm z-10">
              <h2 className="text-lg font-bold text-foreground">
                {t.companyportalinternshipspagetsx.text_oss9}
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground">
                    {t.companyportalinternshipspagetsx.text_ok2m}
                  </label>
                  <Input required name="title" value={formData.title} onChange={handleChange} className="h-10 text-xs" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground">
                    {t.companyportalinternshipspagetsx.text_ornd}
                  </label>
                  <Input required name="location" value={formData.location} onChange={handleChange} className="h-10 text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground">
                    {t.companyportalinternshipspagetsx.text_7abo}
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full h-10 px-3 text-xs font-semibold rounded-lg border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="onsite">{t.companyportalinternshipspagetsx.text_e06a}</option>
                    <option value="remote">{t.companyportalinternshipspagetsx.text_p58p}</option>
                    <option value="hybrid">{t.companyportalinternshipspagetsx.text_m6si}</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground">
                    {t.companyportalinternshipspagetsx.text_8tld}
                  </label>
                  <Input required name="duration" value={formData.duration} onChange={handleChange} placeholder={t.companyportalinternshipspagetsx.text_og45} className="h-10 text-xs" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground">
                    {t.companyportalinternshipspagetsx.text_tm0k}
                  </label>
                  <Input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className="h-10 text-xs" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground">
                  {t.companyportalinternshipspagetsx.text_owu7}
                </label>
                <Input name="tags" value={formData.tags} onChange={handleChange} placeholder={t.companyportalinternshipspagetsx.text_t5to} className="h-10 text-xs" />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground">
                  {t.companyportalinternshipspagetsx.text_n9j4}
                </label>
                <Input type="url" name="applyUrl" value={formData.applyUrl} onChange={handleChange} placeholder="https://..." className="h-10 text-xs" />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground">
                  {t.companyportalinternshipspagetsx.text_3oye}
                </label>
                <textarea
                  required
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-3 rounded-lg border border-input bg-card text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-border">
                <Button type="submit" disabled={submitting} className="flex-1 h-10 text-xs font-semibold">
                  {submitting ? t.companyportalinternshipspagetsx.text_jfpm : t.companyportalinternshipspagetsx.text_rd9u}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="h-10 px-6 text-xs font-semibold">
                  {t.companyportalinternshipspagetsx.text_jpzg}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
