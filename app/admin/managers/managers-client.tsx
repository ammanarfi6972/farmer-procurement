"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createManagerMember } from "@/lib/manager/actions";
import { UserPlus, Phone, MapPin, Shield, Mail, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function ManagersClient({ initialManagers, centres }: { initialManagers: any[], centres: any[] }) {
  const [managers, setManagers] = useState(initialManagers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    role: "centre_manager",
    centreId: ""
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    
    const res = await createManagerMember(formData);
    
    if (res.success) {
      window.location.reload();
    } else {
      alert(res.error || "Failed to create manager member");
      setIsSubmitting(false);
    }
  }

  const roleColors: Record<string, string> = {
    'district_admin': 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
    'centre_manager': 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  };

  const roleLabels: Record<string, string> = {
    'district_admin': 'District Admin',
    'centre_manager': 'Centre Manager',
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative">
          <h2 className="text-3xl font-extrabold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-indigo-500 drop-shadow-sm">Team Directory</h2>
          <p className="text-slate-400 mt-2 font-medium">Manage district administrators and centre managers.</p>
        </div>
        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-lg shadow-lg shadow-indigo-900/50 font-bold border-0"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Add Team Member
        </Button>
      </div>

      <Card className="glass relative overflow-hidden group transition-all duration-300 border-indigo-500/20 bg-slate-900/60 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-100 pointer-events-none"></div>
        <CardContent className="relative z-10 p-0 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-4 sm:p-0">
            {managers.map((person: any) => (
              <motion.div 
                key={person.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl border border-slate-700/50 bg-slate-800/40 hover:bg-slate-800/80 transition-all hover:shadow-xl hover:shadow-indigo-500/5 group/card"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                      <span className="text-xl font-bold text-indigo-400">
                        {person.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white group-hover/card:text-indigo-200 transition-colors">{person.name}</h3>
                      <Badge variant="outline" className={`mt-1 text-[10px] uppercase font-black px-2 shadow-sm ${roleColors[person.role] || 'text-slate-400 border-slate-500/30 bg-slate-500/10'}`}>
                        {roleLabels[person.role] || person.role}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mt-6 pt-4 border-t border-slate-700/50">
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <Phone className="w-4 h-4 text-slate-500" />
                    {person.mobile || "N/A"}
                  </div>
                  {person.role === 'centre_manager' && (
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <MapPin className="w-4 h-4 text-amber-500" />
                      <span className="truncate" title={person.centreName}>{person.centreName}</span>
                    </div>
                  )}
                  {person.role === 'district_admin' && (
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <Shield className="w-4 h-4 text-indigo-500" />
                      District HQ
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {managers.length === 0 && (
              <div className="col-span-full text-center p-12 text-slate-500 italic border border-slate-800 rounded-xl bg-slate-900/50">
                No team members found.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Staff Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-slate-900/95 backdrop-blur-xl border-slate-700 shadow-2xl text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-indigo-500">Add New Team Member</DialogTitle>
            <DialogDescription className="text-slate-400 font-medium">
              Create a new account. They will be assigned the temporary password <code className="bg-slate-800 text-indigo-300 px-1 py-0.5 rounded">password123</code>.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-5 py-6">
              
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-slate-300 font-semibold">Full Name</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-slate-950/50 border-slate-700 text-white h-12 focus-visible:ring-indigo-500 rounded-xl"
                  placeholder="e.g. Rahul Kumar"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email" className="text-slate-300 font-semibold">Email Address</Label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="pl-9 bg-slate-950/50 border-slate-700 text-white h-12 focus-visible:ring-indigo-500 rounded-xl"
                    placeholder="manager@example.com"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="mobile" className="text-slate-300 font-semibold">Mobile Number</Label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <Input
                    id="mobile"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                    className="pl-9 bg-slate-950/50 border-slate-700 text-white h-12 focus-visible:ring-indigo-500 rounded-xl"
                    placeholder="9876543210"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label className="text-slate-300 font-semibold">Role</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(val) => {
                    setFormData({...formData, role: val, centreId: val === 'district_admin' ? '' : formData.centreId})
                  }}
                >
                  <SelectTrigger className="bg-slate-950/50 border-slate-700 text-white h-12 focus:ring-indigo-500 rounded-xl">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700 text-white">
                    <SelectItem value="centre_manager">Centre Manager</SelectItem>
                    <SelectItem value="district_admin">District Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.role !== 'district_admin' && (
                <div className="grid gap-2">
                  <Label className="text-slate-300 font-semibold">Assign to Centre</Label>
                  <Select 
                    required 
                    value={formData.centreId} 
                    onValueChange={(val) => setFormData({...formData, centreId: val})}
                  >
                    <SelectTrigger className="bg-slate-950/50 border-slate-700 text-white h-12 focus:ring-indigo-500 rounded-xl">
                      <SelectValue placeholder="Select a procurement centre" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-white max-h-60">
                      {centres.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

            </div>
            <DialogFooter className="gap-2 sm:gap-0 mt-2">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg font-medium">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-400 hover:to-blue-400 text-white rounded-lg shadow-lg shadow-indigo-900/20 font-bold border-0">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Create Account
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
