"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Phone, Globe, Shield, Edit2, Check, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { updateFarmerProfile } from "@/lib/farmer/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useLanguage } from "@/components/providers/language-provider";
import { languages } from "@/lib/i18n";

export function FarmerProfileClient({ profile }: { profile: any }) {
  const router = useRouter();
  const { t, setLanguage, language: currentLang } = useLanguage();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || "",
    preferredLanguage: profile?.preferred_language || "en"
  });

  const handleSave = async () => {
    setIsSaving(true);
    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("preferredLanguage", formData.preferredLanguage);

    const result = await updateFarmerProfile(data);
    setIsSaving(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Profile updated successfully");
      setIsEditing(false);
      setLanguage(formData.preferredLanguage);
      router.refresh();
    }
  };

  const currentLangName = languages.find(l => l.code === (profile?.preferred_language || 'en'))?.name || 'English';

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-end"
      >
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
            <User className="w-7 h-7 text-emerald-600" />
            {t('profile.title')}
          </h2>
          <p className="text-slate-500 mt-2 font-medium">{t('profile.subtitle')}</p>
        </div>
        
        {!isEditing && (
          <Button 
            onClick={() => setIsEditing(true)} 
            variant="outline" 
            className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-xl"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            {t('profile.edit')}
          </Button>
        )}
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <Card className="bg-white/60 backdrop-blur-xl border border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-emerald-400 to-teal-500 w-full" />
          <CardHeader className="border-b border-slate-100 bg-white/40 pb-4">
            <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-500" />
              {t('profile.personalInfo')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <motion.div variants={itemVariants} className="flex items-center gap-5 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-emerald-100 transition-all">
                <User className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">{t('profile.fullName')}</p>
                {isEditing ? (
                  <Input 
                    value={formData.fullName} 
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="mt-1 font-bold text-slate-800"
                  />
                ) : (
                  <p className="font-extrabold text-slate-800 text-lg">{profile?.full_name || 'N/A'}</p>
                )}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center gap-5 p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-slate-200 text-slate-500 rounded-xl flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide">{t('profile.mobile')}</p>
                <p className="font-extrabold text-slate-600 text-lg tracking-widest">{profile?.mobile || 'N/A'}</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center gap-5 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-emerald-100 transition-all">
                <Globe className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">{t('profile.language')}</p>
                {isEditing ? (
                  <div className="mt-1">
                    <Select 
                      value={formData.preferredLanguage} 
                      onValueChange={(val) => setFormData({...formData, preferredLanguage: val})}
                    >
                      <SelectTrigger className="w-full font-bold text-slate-800 bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((l) => (
                          <SelectItem key={l.code} value={l.code} className="font-medium text-slate-700">
                            {l.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <p className="font-extrabold text-slate-800 text-lg">{currentLangName}</p>
                )}
              </div>
            </motion.div>

            {isEditing && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center gap-3 pt-4 justify-end border-t border-slate-100 mt-6"
              >
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setFormData({ fullName: profile?.full_name || "", preferredLanguage: profile?.preferred_language || "en" });
                    setIsEditing(false);
                  }}
                  disabled={isSaving}
                  className="rounded-xl text-slate-500 hover:text-slate-700"
                >
                  <X className="w-4 h-4 mr-2" />
                  {t('profile.cancel')}
                </Button>
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/30"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                  {isSaving ? t('profile.saving') : t('profile.save')}
                </Button>
              </motion.div>
            )}

          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
