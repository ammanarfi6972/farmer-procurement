"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, MapPin, Calendar, Scale, IndianRupee, Loader2, CheckCircle2, XCircle, Sprout, Search, History as HistoryIcon } from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useLanguage } from "@/components/providers/language-provider";

export function FarmerHistoryClient({ bookings }: { bookings: any[] }) {
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const { t } = useLanguage();

  const getStatusText = (status: string) => {
    if (status === 'YARD_ARRIVED') return t('dashboard.status.inQueue');
    if (status === 'COMPLETED') return t('status.completed');
    if (status === 'CANCELLED') return t('status.cancelled');
    if (status === 'REJECTED') return t('status.rejected');
    if (status === 'DBT_PAID') return t('status.dbt_paid');
    return status.replace(/_/g, ' ');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
          <HistoryIcon className="w-7 h-7 text-emerald-600" />
          {t('history.title')}
        </h2>
        <p className="text-slate-500 mt-2 font-medium">{t('history.subtitle')}</p>
      </motion.div>

      {bookings && bookings.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {bookings.map((booking: any, index: number) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                className="bg-white/60 backdrop-blur-xl shadow-sm border-slate-200/60 hover:border-emerald-300 hover:shadow-md transition-all duration-300 cursor-pointer group"
                onClick={() => setSelectedBooking(booking)}
              >
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg">{t(booking.commodities?.name)}</h4>
                      <p className="text-sm font-semibold text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Sprout className="w-4 h-4 text-emerald-500" />
                        {booking.expected_quantity} {booking.commodities?.unit}
                      </p>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold border shadow-sm ${
                      booking.status === 'COMPLETED' || booking.status === 'DBT_PAID' ? 'bg-emerald-100/80 text-emerald-800 border-emerald-200' :
                      booking.status === 'CANCELLED' || booking.status === 'REJECTED' ? 'bg-rose-100/80 text-rose-800 border-rose-200' :
                      'bg-slate-100/80 text-slate-800 border-slate-200'
                    }`}>
                      {getStatusText(booking.status)}
                    </span>
                  </div>
                  
                  <div className="space-y-2.5 pt-4 border-t border-slate-100">
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-slate-500 font-medium">{t('history.date')}</span>
                      <p className="text-slate-700 font-medium text-sm lg:text-base">
                        {booking.slots?.date ? formatDate(booking.slots.date) : 'N/A'}
                      </p>
                    </div>
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-slate-500 font-medium">{t('history.centre')}</span>
                      <span className="font-bold text-slate-800 text-right">{t(booking.procurement_centres?.name)}</span>
                    </div>
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
          className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-2xl border-2 border-dashed border-slate-200"
        >
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">{t('history.empty')}</h3>
          <p className="text-slate-500 mt-2 max-w-sm mx-auto font-medium">
            {t('history.emptySub')}
          </p>
        </motion.div>
      )}

      {selectedBooking && (
        <Dialog open={!!selectedBooking} onOpenChange={(open) => !open && setSelectedBooking(null)}>
          <DialogContent className="sm:max-w-[425px] bg-white border-slate-200 shadow-2xl rounded-2xl">
            <DialogHeader className="border-b border-slate-100 pb-4">
              <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                {t('history.details')}
              </DialogTitle>
              <DialogDescription className="text-slate-500 font-medium flex items-center gap-2">
                {t('history.reference')} <span className="font-mono text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">{selectedBooking.booking_number}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-2">
              {/* Status and Produce */}
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <h4 className="font-bold text-slate-800">{t(selectedBooking.commodities?.name)}</h4>
                  <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border shadow-sm ${
                    selectedBooking.status === 'COMPLETED' || selectedBooking.status === 'DBT_PAID' ? 'bg-emerald-100/80 text-emerald-800 border-emerald-200' :
                    selectedBooking.status === 'CANCELLED' || selectedBooking.status === 'REJECTED' ? 'bg-rose-100/80 text-rose-800 border-rose-200' :
                    'bg-slate-100/80 text-slate-800 border-slate-200'
                  }`}>
                    {getStatusText(selectedBooking.status)}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-700 flex items-center justify-end gap-1">
                    <Scale className="w-4 h-4 text-emerald-500" />
                    {selectedBooking.procurements?.accepted_quantity || selectedBooking.expected_quantity} {selectedBooking.commodities?.unit}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-0.5">
                    {selectedBooking.procurements?.accepted_quantity ? t('history.actualWeighed') : t('history.estimated')}
                  </p>
                </div>
              </div>

              {/* Slot & Location */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 bg-blue-50 p-1.5 rounded-lg border border-blue-100">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {selectedBooking.slots?.date ? formatDate(selectedBooking.slots.date) : 'N/A'}
                    </p>
                    <p className="text-xs font-medium text-slate-500">
                      {selectedBooking.slots?.start_time ? `${formatTime(selectedBooking.slots.start_time)} - ${formatTime(selectedBooking.slots.end_time)}` : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 bg-rose-50 p-1.5 rounded-lg border border-rose-100">
                    <MapPin className="w-4 h-4 text-rose-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {t(selectedBooking.procurement_centres?.name) || 'Unknown Centre'}
                    </p>
                    <p className="text-xs font-medium text-slate-500">
                      {t('history.reportingLocation')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Financials (if completed) */}
              {selectedBooking.procurements && (
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="bg-emerald-50 p-1.5 rounded-lg border border-emerald-100">
                        <IndianRupee className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{t('history.settlement')}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-slate-800">
                        ₹{selectedBooking.procurements.total_value.toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs font-bold text-emerald-600 flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {selectedBooking.procurements.quality_status === 'ACCEPTED' ? t('status.completed') : t('status.rejected')}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
