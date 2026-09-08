"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sprout, MapPin, Calendar, Clock, Loader2, CheckCircle2, ChevronRight, Leaf } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { formatDate, formatTime } from "@/lib/utils";
import { useLanguage } from "@/components/providers/language-provider";


export default function BookSlotPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [centres, setCentres] = useState<any[]>([]);
  const [commodities, setCommodities] = useState<any[]>([]);
  const [slots, setSlots] = useState<any[]>([]);
  
  const [selectedCentre, setSelectedCentre] = useState("");
  const [selectedCommodity, setSelectedCommodity] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [quantity, setQuantity] = useState("");
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchFormData = async () => {
      const supabase = createClient();
      
      const { data: centresData } = await supabase.from('procurement_centres').select('*').eq('operational_status', 'ACTIVE');
      const { data: commoditiesData } = await supabase.from('commodities').select(`
        id, code, name, unit, active,
        commodity_prices(price_per_unit)
      `).eq('active', true);
      
      if (centresData) setCentres(centresData);
      if (commoditiesData) setCommodities(commoditiesData);
      setIsLoading(false);
    };
    fetchFormData();
  }, []);

  useEffect(() => {
    if (!selectedCentre) {
      setSlots([]);
      setSelectedSlot("");
      setSelectedDate("");
      return;
    }
    const fetchSlots = async () => {
      const supabase = createClient();
      const { data: slotsData } = await supabase
        .from('slots')
        .select('*')
        .eq('centre_id', selectedCentre)
        .eq('active', true)
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true });
        
      if (slotsData && slotsData.length > 0) {
        // Fetch bookings for these slots to calculate seats left
        const slotIds = slotsData.map((s: any) => s.id);
        const { data: bookingsData } = await supabase
          .from('bookings')
          .select('slot_id')
          .in('slot_id', slotIds)
          .neq('status', 'CANCELLED')
          .neq('status', 'REJECTED')
          .neq('status', 'NO_SHOW');

        const bookingCounts = (bookingsData || []).reduce((acc: any, b: any) => {
          acc[b.slot_id] = (acc[b.slot_id] || 0) + 1;
          return acc;
        }, {});

        const slotsWithCapacity = slotsData.map((s: any) => ({
          ...s,
          bookedCount: bookingCounts[s.id] || 0
        }));

        setSlots(slotsWithCapacity);
      } else {
        setSlots([]);
      }
    };
    fetchSlots();
  }, [selectedCentre]);

  const availableDates = Array.from(new Set(slots.map(s => s.date))).sort();
  const availableTimeSlots = slots.filter(s => s.date === selectedDate).sort((a, b) => a.start_time.localeCompare(b.start_time));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCentre || !selectedCommodity || !selectedSlot || !quantity) return;
    
    setIsSubmitting(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;
    
    // Generate a random booking number like BKG-1234
    const bookingNum = `BKG-${Math.floor(1000 + Math.random() * 9000)}`;

    const { error } = await supabase.from('bookings').insert({
      booking_number: bookingNum,
      farmer_id: user.id,
      centre_id: selectedCentre,
      slot_id: selectedSlot,
      commodity_id: selectedCommodity,
      expected_quantity: parseFloat(quantity),
      status: 'SLOT_BOOKED'
    });

    setIsSubmitting(false);
    if (!error) {
      setSuccess(true);
    } else {
      console.error(error);
      alert("Failed to book slot.");
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>;
  }

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto mt-12 text-center p-12 bg-white/60 backdrop-blur-xl border border-emerald-100 rounded-3xl shadow-xl shadow-emerald-500/10"
      >
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-800 mb-3 tracking-tight">{t('bookSlot.successTitle')}</h2>
        <p className="text-slate-500 mb-8 text-lg">{t('bookSlot.successSub')}</p>
        <Button onClick={() => router.push('/farmer')} className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 font-bold px-8 h-12 rounded-xl text-lg">
          {t('bookSlot.returnDashboard')}
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto space-y-8"
    >
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
          <Leaf className="w-7 h-7 text-emerald-600" />
          {t('bookSlot.title')}
        </h2>
        <p className="text-slate-500 mt-2 font-medium">{t('bookSlot.subtitle')}</p>
      </div>

      <Card className="bg-white/70 backdrop-blur-2xl border-white/40 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-emerald-400 to-teal-500 w-full" />
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-7">
            <div className="space-y-3">
              <Label htmlFor="centre" className="flex items-center gap-2 text-slate-700 font-bold">
                <MapPin className="w-4 h-4 text-emerald-500" /> {t('bookSlot.selectCentre')}
              </Label>
              <Select value={selectedCentre} onValueChange={setSelectedCentre} required>
                <SelectTrigger id="centre" className="h-12 rounded-xl bg-white/50 border-slate-200 focus:ring-emerald-500/50 focus:border-emerald-500 shadow-sm text-sm font-medium">
                  <SelectValue placeholder={t('bookSlot.chooseCentre')} />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 bg-white/95 backdrop-blur-md">
                  {centres.map(c => (
                    <SelectItem key={c.id} value={c.id} className="rounded-lg cursor-pointer">{t(c.name)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="commodity" className="flex items-center gap-2 text-slate-700 font-bold">
                <Sprout className="w-4 h-4 text-emerald-500" /> {t('bookSlot.selectProduce')}
              </Label>
              <Select value={selectedCommodity} onValueChange={setSelectedCommodity} required>
                <SelectTrigger id="commodity" className="h-12 rounded-xl bg-white/50 border-slate-200 focus:ring-emerald-500/50 focus:border-emerald-500 shadow-sm text-sm font-medium">
                  <SelectValue placeholder={t('bookSlot.chooseProduce')} />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 bg-white/95 backdrop-blur-md">
                  {commodities.map(c => {
                    const price = c.commodity_prices?.[0]?.price_per_unit;
                    const priceDisplay = price ? ` - ₹${price}/${c.unit}` : '';
                    return (
                      <SelectItem key={c.id} value={c.id} className="rounded-lg cursor-pointer">
                        {t(c.name)} ({c.unit}){priceDisplay}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="quantity" className="text-slate-700 font-bold">{t('bookSlot.estimatedQuantity')}</Label>
              <Input 
                id="quantity" 
                type="number" 
                min="1" 
                step="0.1" 
                placeholder="e.g. 50" 
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="h-12 rounded-xl bg-white/50 border-slate-200 focus:ring-emerald-500/50 focus:border-emerald-500 font-medium shadow-sm"
                required 
              />
            </div>

            {selectedCentre && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-6 pt-6 border-t border-slate-200/50"
              >
                <div className="space-y-3">
                  <Label htmlFor="date" className="flex items-center gap-2 text-slate-700 font-bold">
                    <Calendar className="w-4 h-4 text-emerald-500" /> {t('bookSlot.selectDate')}
                  </Label>
                  {slots.length === 0 ? (
                    <div className="p-4 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 text-sm font-medium">
                      {t('bookSlot.noSlots')}
                    </div>
                  ) : (
                    <Select 
                      value={selectedDate} 
                      onValueChange={(val) => {
                        setSelectedDate(val);
                        setSelectedSlot("");
                      }}
                      required
                    >
                      <SelectTrigger id="date" className="h-12 rounded-xl bg-white/50 border-slate-200 focus:ring-emerald-500/50 focus:border-emerald-500 shadow-sm text-sm font-medium">
                        <SelectValue placeholder={t('bookSlot.chooseDate')} />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-200 bg-white/95 backdrop-blur-md">
                        {availableDates.map(date => (
                          <SelectItem key={date as string} value={date as string} className="rounded-lg cursor-pointer">
                            {formatDate(date as string)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {selectedDate && (
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-slate-700 font-bold">
                      <Clock className="w-4 h-4 text-emerald-500" /> {t('bookSlot.selectTimeSlot')}
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {availableTimeSlots.map((s, idx) => {
                        const seatsLeft = s.capacity - (s.bookedCount || 0);
                        const isFull = seatsLeft <= 0;
                        return (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          key={s.id} 
                          onClick={() => !isFull && setSelectedSlot(s.id)}
                          className={`p-4 rounded-xl cursor-pointer text-center transition-all duration-200 border-2 ${
                            isFull 
                              ? "opacity-50 cursor-not-allowed bg-slate-100 border-slate-200" 
                              : selectedSlot === s.id 
                                ? "bg-emerald-50 border-emerald-500 shadow-md shadow-emerald-500/10 scale-[1.02]" 
                                : "bg-white/50 border-slate-200 hover:border-emerald-300 hover:bg-slate-50"
                          }`}
                        >
                          <div className="font-extrabold text-slate-800 text-sm">
                            {formatTime(s.start_time)} - {formatTime(s.end_time)}
                          </div>
                          <div className={`text-xs mt-1 font-semibold ${isFull ? "text-rose-500" : "text-emerald-600"}`}>
                            {isFull ? t('bookSlot.full') : `${seatsLeft} ${t('bookSlot.seatsLeft')}`}
                          </div>
                        </motion.div>
                      )})}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 rounded-xl text-lg font-bold shadow-lg shadow-emerald-600/20 transition-all hover:-translate-y-0.5" 
              disabled={isSubmitting || !selectedSlot}
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (
                <span className="flex items-center gap-2">{t('bookSlot.confirmBooking')} <ChevronRight className="w-5 h-5" /></span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
