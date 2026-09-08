"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { parseISO } from "date-fns";
import { cn, formatDate, formatTime } from "@/lib/utils";
import { createSlot, updateSlotCapacity, toggleSlotActive } from "@/lib/manager/actions";
import { Calendar as CalendarIcon, Plus, Loader2, Clock, Users, Power, PowerOff } from "lucide-react";

export function SlotsClient({ initialSlots, selectedDate }: { initialSlots: any[], selectedDate: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [slots, setSlots] = useState(initialSlots);

  // Sync state when URL params change the initialSlots
  useEffect(() => {
    setSlots(initialSlots);
  }, [initialSlots]);

  // Calendar popover state
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Create slot state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newSlot, setNewSlot] = useState({ startTime: "09:00", endTime: "12:00", capacity: "50" });
  const [isCreating, setIsCreating] = useState(false);

  // Edit capacity state
  const [editSlot, setEditSlot] = useState<any>(null);
  const [newCapacity, setNewCapacity] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  function handleDateChange(date: Date | undefined) {
    if (!date) return;
    setIsPopoverOpen(false); // Close instantly for snappy UI
    // Keep local date string YYYY-MM-DD
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    const dateString = d.toISOString().split('T')[0];
    
    startTransition(() => {
      router.push(`/manager/slots?date=${dateString}`);
    });
  }

  async function handleCreateSlot(e: React.FormEvent) {
    e.preventDefault();
    setIsCreating(true);
    const res = await createSlot(selectedDate, newSlot.startTime, newSlot.endTime, Number(newSlot.capacity));
    if (res?.success) {
      setIsCreateOpen(false);
      window.location.reload();
    } else {
      alert(res?.error || "Failed to create slot");
    }
    setIsCreating(false);
  }

  async function handleUpdateCapacity(e: React.FormEvent) {
    e.preventDefault();
    if (!editSlot) return;
    setIsUpdating(true);
    const res = await updateSlotCapacity(editSlot.id, Number(newCapacity));
    if (res?.success) {
      setSlots(slots.map(s => s.id === editSlot.id ? { ...s, capacity: Number(newCapacity) } : s));
      setEditSlot(null);
    } else {
      alert(res?.error || "Failed to update capacity");
    }
    setIsUpdating(false);
  }

  async function handleToggleStatus(slotId: string, currentStatus: boolean) {
    const res = await toggleSlotActive(slotId, !currentStatus);
    if (res?.success) {
      setSlots(slots.map(s => s.id === slotId ? { ...s, active: !currentStatus } : s));
    } else {
      alert(res?.error || "Failed to toggle status");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Daily Slot Schedule</h2>
          <p className="text-slate-400">Configure arrival windows and limits for farmers.</p>
        </div>
        <div className="flex items-center gap-3">
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[160px] justify-start text-left font-normal bg-slate-900 border-indigo-500/20 text-white hover:bg-slate-800",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="w-4 h-4 text-indigo-400 mr-2" />
                {selectedDate ? formatDate(selectedDate) : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="dark w-auto p-0 bg-slate-900/95 backdrop-blur-xl border-indigo-500/30 shadow-2xl shadow-indigo-900/20 rounded-xl overflow-hidden" align="start">
              <div style={{ "--primary": "243 75% 59%" } as React.CSSProperties}>
                <Calendar
                  mode="single"
                  selected={parseISO(selectedDate)}
                  onSelect={handleDateChange}
                  initialFocus
                  className="bg-transparent text-white p-3"
                  modifiersClassNames={{
                    today: "bg-slate-800 text-white rounded-md",
                  }}
                />
              </div>
            </PopoverContent>
          </Popover>
          <Button 
            onClick={() => setIsCreateOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Slot
          </Button>
        </div>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative transition-opacity duration-300 ${isPending ? 'opacity-40 pointer-events-none blur-[1px]' : 'opacity-100'}`}>
        {isPending && (
          <div className="absolute inset-0 z-50 flex items-center justify-center">
            <div className="bg-slate-900/80 backdrop-blur-sm p-4 rounded-full shadow-2xl border border-indigo-500/20 text-indigo-400 flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="font-medium text-sm">Syncing Schedule...</span>
            </div>
          </div>
        )}
        {slots.map((slot) => {
          const isActive = slot.active;
          return (
            <Card key={slot.id} className={`glass relative overflow-hidden transition-all duration-500 ${isActive ? 'border-indigo-500/30 bg-slate-900/60 shadow-xl shadow-indigo-900/10 hover:shadow-indigo-900/30 hover:border-indigo-400/50 hover:-translate-y-1' : 'border-slate-800 bg-slate-950/40 opacity-75 grayscale-[20%]'}`}>
              {isActive && <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-100 pointer-events-none"></div>}
              <CardHeader className="pb-4 border-b border-indigo-500/10 bg-slate-900/40 relative z-10">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3 text-lg font-bold text-white tracking-tight">
                    <div className="p-2 bg-indigo-500/20 rounded-lg shadow-[0_0_10px_rgba(99,102,241,0.2)] flex items-center justify-center">
                      <Clock className="w-4 h-4 text-indigo-400" />
                    </div>
                    {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                  </CardTitle>
                  {isActive ? (
                    <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 bg-emerald-500/10 text-[10px] uppercase font-black px-2 shadow-[0_0_10px_rgba(16,185,129,0.2)]">Active</Badge>
                  ) : (
                    <Badge variant="outline" className="text-slate-400 border-slate-700 bg-slate-800/50 text-[10px] uppercase font-bold px-2">Disabled</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-6 pb-6 flex items-center justify-between relative z-10">
                <div className="flex-1 pr-4">
                  <div className="text-xs font-semibold text-indigo-400/80 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    Capacity (Used / Max)
                  </div>
                  <div className="flex items-baseline gap-2">
                    <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200 drop-shadow-sm">
                      {slot.used_capacity || 0}
                    </div>
                    <div className="text-2xl font-bold text-slate-500">
                      / {slot.capacity}
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full mt-3 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${((slot.used_capacity || 0) / slot.capacity) >= 0.9 ? 'bg-rose-500' : 'bg-indigo-500'}`} 
                      style={{ width: `${Math.min(100, ((slot.used_capacity || 0) / slot.capacity) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2.5 pl-4 border-l border-indigo-500/10">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => { setEditSlot(slot); setNewCapacity(slot.capacity.toString()); }}
                    className="border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20 hover:text-white transition-colors shadow-sm shadow-indigo-900/20"
                  >
                    Adjust Limit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleToggleStatus(slot.id, isActive)}
                    className={isActive ? "text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors" : "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors"}
                  >
                    {isActive ? <PowerOff className="w-4 h-4 mr-1.5" /> : <Power className="w-4 h-4 mr-1.5" />}
                    {isActive ? "Disable Slot" : "Enable Slot"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {slots.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl bg-slate-900/20">
            No slots configured for this date.
          </div>
        )}
      </div>

      {/* Create Slot Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={(open) => !open && setIsCreateOpen(false)}>
        <DialogContent className="sm:max-w-[425px] bg-slate-900/95 backdrop-blur-xl border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Create New Slot</DialogTitle>
            <DialogDescription className="text-slate-400">
              Set the time window and maximum capacity for incoming farmers.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSlot}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="start-time" className="text-slate-300">Start Time</Label>
                  <Input
                    id="start-time"
                    type="time"
                    value={newSlot.startTime}
                    onChange={(e) => setNewSlot({...newSlot, startTime: e.target.value})}
                    className="bg-slate-950 border-slate-700 text-white focus-visible:ring-indigo-500"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="end-time" className="text-slate-300">End Time</Label>
                  <Input
                    id="end-time"
                    type="time"
                    value={newSlot.endTime}
                    onChange={(e) => setNewSlot({...newSlot, endTime: e.target.value})}
                    className="bg-slate-950 border-slate-700 text-white focus-visible:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="capacity" className="text-slate-300">Max Capacity (Farmers)</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  value={newSlot.capacity}
                  onChange={(e) => setNewSlot({...newSlot, capacity: e.target.value})}
                  className="bg-slate-950 border-slate-700 text-white focus-visible:ring-indigo-500"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-white">Cancel</Button>
              <Button type="submit" disabled={isCreating} className="bg-indigo-600 hover:bg-indigo-500 text-white flex items-center">
                {isCreating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Create Slot
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Capacity Dialog */}
      <Dialog open={!!editSlot} onOpenChange={(open) => !open && setEditSlot(null)}>
        <DialogContent className="sm:max-w-[400px] bg-slate-900/95 backdrop-blur-xl border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Adjust Capacity Limit</DialogTitle>
            <DialogDescription className="text-slate-400">
              {editSlot && `${formatTime(editSlot.start_time)} - ${formatTime(editSlot.end_time)}`}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateCapacity}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-capacity" className="text-slate-300">New Max Capacity</Label>
                <Input
                  id="edit-capacity"
                  type="number"
                  min="1"
                  value={newCapacity}
                  onChange={(e) => setNewCapacity(e.target.value)}
                  className="bg-slate-950 border-slate-700 text-white focus-visible:ring-indigo-500 text-xl font-bold"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setEditSlot(null)} className="text-slate-400 hover:text-white">Cancel</Button>
              <Button type="submit" disabled={isUpdating} className="bg-indigo-600 hover:bg-indigo-500 text-white flex items-center">
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
