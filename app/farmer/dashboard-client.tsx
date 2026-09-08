"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Package, ArrowRight, Sprout, Tractor, LayoutDashboard, Ticket, Clock, Loader2 } from "lucide-react";
import Link from "next/link";
import { formatDate, formatTime } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { checkInFromPhone, getQueueStatus } from "@/lib/farmer/actions";
import { useLanguage } from "@/components/providers/language-provider";

function QueueTracker({ bookingId }: { bookingId: string }) {
  const [status, setStatus] = useState<any>(null);
  const { t } = useLanguage();

  useEffect(() => {
    let active = true;
    const fetchStatus = async () => {
      const res = await getQueueStatus(bookingId);
      if (active && res) {
        setStatus(res);
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000); // 10s poll
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [bookingId]);

  if (!status) {
    return <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center text-emerald-600"><Loader2 className="w-5 h-5 animate-spin" /></div>;
  }

  const { farmerNum, currentNum } = status;
  
  let message = "";
  let subMessage = "";
  
  if (farmerNum <= currentNum) {
    message = t('dashboard.queue.next');
    subMessage = t('dashboard.queue.servingNow', { token: `Q-${farmerNum}` });
  } else if (farmerNum - currentNum <= 2) {
    message = t('dashboard.queue.nearby');
    subMessage = t('dashboard.queue.servingOther', { farmerNum, currentNum });
  } else {
    message = t('dashboard.queue.waiting', { farmerNum });
    subMessage = t('dashboard.queue.currentlyServing', { currentNum });
  }

  return (
    <div className="mt-4 pt-4 border-t border-slate-100">
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col items-center justify-center text-center shadow-inner">
        <h4 className="font-extrabold text-emerald-800 text-sm sm:text-base mb-1">{message}</h4>
        <p className="text-xs sm:text-sm text-emerald-600 font-semibold">{subMessage}</p>
      </div>
    </div>
  );
}

export function FarmerDashboardClient({ bookings, totalQuantity }: { bookings: any[], totalQuantity: number }) {
  const router = useRouter();
  const { t } = useLanguage();
  const [checkingIn, setCheckingIn] = useState<string | null>(null);

  async function handleCheckIn(id: string) {
    setCheckingIn(id);
    const res = await checkInFromPhone(id);
    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success("Checked in successfully! Proceed to the yard.");
      router.refresh();
    }
    setCheckingIn(null);
  }

  function isCheckInAllowed(dateStr: string, startTime: string, endTime: string) {
    if (!dateStr || !startTime || !endTime) return false;
    const today = new Date();
    
    const offset = today.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(today.getTime() - offset)).toISOString().slice(0, 10);
    
    if (dateStr !== localISOTime) return false;

    const currentMs = today.getHours() * 60 * 60 * 1000 + today.getMinutes() * 60 * 1000;

    const parseTime = (t: string) => {
      const [h, m] = t.split(":");
      return parseInt(h) * 60 * 60 * 1000 + parseInt(m) * 60 * 1000;
    };

    const startMs = parseTime(startTime) - 15 * 60 * 1000; // 15 mins early
    const endMs = parseTime(endTime);

    return currentMs >= startMs && currentMs <= endMs;
  }

  const getStatusText = (status: string) => {
    if (status === 'YARD_ARRIVED') return t('dashboard.status.inQueue');
    if (status === 'COMPLETED') return t('status.completed');
    if (status === 'CANCELLED') return t('status.cancelled');
    if (status === 'REJECTED') return t('status.rejected');
    if (status === 'DBT_PAID') return t('status.dbt_paid');
    return status.replace(/_/g, ' ');
  };

  const containerVariants: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 drop-shadow-sm">{t('dashboard.welcome')}</h2>
        <p className="text-slate-500 mt-2 font-medium">{t('dashboard.subtitle')}</p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-5 md:grid-cols-2"
      >
        <motion.div variants={itemVariants}>
          <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-700 text-white border-none shadow-lg shadow-emerald-500/20 group hover:shadow-emerald-500/40 transition-all duration-300">
            <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-500" />
            <CardContent className="p-6 relative z-10">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-emerald-100/90 text-sm font-semibold tracking-wide uppercase">{t('dashboard.newBooking')}</p>
                  <p className="text-3xl font-black tracking-tight drop-shadow-md">{t('dashboard.sellProduce')}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner">
                  <Tractor className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-6">
                <Link href="/farmer/book-slot">
                  <Button className="w-full bg-white text-emerald-800 hover:bg-emerald-50 font-bold shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0">
                    {t('dashboard.bookSlotNow')}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-white/60 backdrop-blur-xl border border-slate-200/50 shadow-xl shadow-slate-200/20 hover:border-emerald-200 hover:shadow-emerald-100 transition-all duration-300 h-full">
            <CardContent className="p-6 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-slate-500 text-sm font-semibold tracking-wide uppercase">{t('dashboard.activeBookingsCount')}</p>
                  <p className="text-4xl font-black text-slate-800 tracking-tighter drop-shadow-sm">{bookings.length}</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 shadow-sm text-emerald-600">
                  <Calendar className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 text-sm font-medium text-emerald-600 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {t('dashboard.inProgress')}
              </div>
            </CardContent>
          </Card>
        </motion.div>


      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="space-y-4 pt-4"
      >
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-emerald-600" />
            {t('dashboard.activeBooking')}
          </h3>
          <Link href="/farmer/history" className="text-sm text-emerald-600 font-bold hover:text-emerald-700 transition-colors flex items-center gap-1 group">
            {t('dashboard.viewAll')} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {bookings && bookings.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {bookings.map((booking: any, index: number) => (
              <motion.div 
                key={booking.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + (index * 0.1) }}
              >
                <Card className="bg-white/80 backdrop-blur-md shadow-sm border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all duration-300 group">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-slate-800 text-lg group-hover:text-emerald-700 transition-colors">{t(booking.commodities?.name)}</h4>
                        <p className="text-sm font-semibold text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <Sprout className="w-4 h-4 text-emerald-500" />
                          {booking.estimated_quantity} {booking.commodities?.unit}
                        </p>
                      </div>
                      <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-100/80 text-amber-800 border border-amber-200 shadow-sm">
                        {getStatusText(booking.status)}
                      </span>
                    </div>
                    
                    <div className="space-y-2.5 pt-4 border-t border-slate-100">
                      <div className="flex justify-between text-sm items-center">
                        <span className="text-slate-500 font-medium">{t('history.date')}</span>
                        <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                          {booking.slots?.date ? formatDate(booking.slots.date) : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm items-center">
                        <span className="text-slate-500 font-medium">{t('dashboard.slotTime')}</span>
                        <span className="font-bold text-slate-800">
                          {booking.slots?.start_time ? `${formatTime(booking.slots.start_time)} - ${formatTime(booking.slots.end_time)}` : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm items-center">
                        <span className="text-slate-500 font-medium">{t('history.centre')}</span>
                        <span className="font-bold text-slate-800 text-right">{t(booking.procurement_centres?.name)}</span>
                      </div>
                      {booking.gate_pass_token && (
                        <div className="flex justify-between text-sm items-center bg-emerald-50 p-2.5 rounded-lg mt-3 border border-emerald-100">
                          <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                            <Ticket className="w-4 h-4" />
                            {t('dashboard.gatePass')}
                          </span>
                          <span className="font-black text-emerald-800 tracking-widest">{booking.gate_pass_token}</span>
                        </div>
                      )}
                      
                      {(booking.status === 'GATE_PASS_GENERATED' || booking.status === 'SLOT_BOOKED') && (
                        <div className="mt-4 pt-4 border-t border-slate-100">
                          <Button 
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 rounded-xl font-bold"
                            disabled={checkingIn === booking.id || !isCheckInAllowed(booking.slots?.date, booking.slots?.start_time, booking.slots?.end_time)}
                            onClick={() => handleCheckIn(booking.id)}
                          >
                            {checkingIn === booking.id ? (
                              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t('dashboard.checkingIn')}</>
                            ) : !isCheckInAllowed(booking.slots?.date, booking.slots?.start_time, booking.slots?.end_time) ? (
                              <><Clock className="w-4 h-4 mr-2" /> {t('dashboard.checkInNotTime')}</>
                            ) : (
                              <><Ticket className="w-4 h-4 mr-2" /> {t('dashboard.selfCheckIn')}</>
                            )}
                          </Button>
                        </div>
                      )}
                      
                      {booking.status === 'YARD_ARRIVED' && (
                        <QueueTracker bookingId={booking.id} />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-2xl border-2 border-dashed border-slate-200"
          >
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <Package className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">{t('dashboard.noActiveBookings')}</h3>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto font-medium">
              {t('dashboard.noActiveSub')}
            </p>
            <div className="mt-8">
              <Link href="/farmer/book-slot">
                <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 font-bold px-8">
                  {t('dashboard.bookSlotNow')}
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
