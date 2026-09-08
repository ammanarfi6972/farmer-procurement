"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { checkInFarmer } from "@/lib/manager/actions";
import { toast } from "sonner";
import { ProcurementDialog } from "@/components/manager/procurement-dialog";
import { Users, CheckSquare, Clock, MapPin, Search, Bell } from "lucide-react";
import { motion } from "framer-motion";

export function ManagerDashboardClient({ initialData }: { initialData: any }) {
  const router = useRouter();
  const [checkingIn, setCheckingIn] = useState<string | null>(null);

  const { centre, bookings } = initialData;

  const expectedToday = bookings.filter((b: any) => b.status === "SLOT_BOOKED" || b.status === "GATE_PASS_GENERATED").length;
  const inQueue = bookings.filter((b: any) => b.status === "YARD_ARRIVED" || b.status === "QUALITY_CHECK" || b.status === "WEIGHMENT").length;
  const completed = bookings.filter((b: any) => b.status === "COMPLETED" || b.status === "DBT_PAID").length;

  async function handleCheckIn(id: string) {
    setCheckingIn(id);
    await checkInFarmer(id);
    toast("📩 SMS Sent to Farmer", {
      description: `Gate pass verified. You have been added to the queue.`,
      className: "!bg-slate-900 !border !border-slate-800 !text-white shadow-xl shadow-indigo-900/20",
      descriptionClassName: "!text-slate-400 font-medium mt-1",
    });
    setCheckingIn(null);
    router.refresh();
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "SLOT_BOOKED":
      case "GATE_PASS_GENERATED": return <Badge variant="outline" className="text-slate-300 border-slate-700 bg-slate-800/50">Awaiting Check-in</Badge>;
      case "YARD_ARRIVED": return <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]">In Queue</Badge>;
      case "QUALITY_CHECK": return <Badge className="bg-orange-500/10 text-orange-400 border border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.2)] animate-pulse">Quality Check</Badge>;
      case "WEIGHMENT": return <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.2)] animate-pulse">Weighment</Badge>;
      case "DBT_PAID":
      case "COMPLETED": return <Badge className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">Completed</Badge>;
      case "CANCELLED": return <Badge variant="destructive" className="bg-red-500/20 text-red-400 border border-red-500/30">Cancelled</Badge>;
      default: return <Badge variant="outline" className="bg-slate-800/50 border-slate-700 text-slate-300">{status}</Badge>;
    }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-extrabold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-indigo-500 drop-shadow-sm">Today's Operations</h2>
        <div className="flex items-center text-indigo-300 font-medium gap-2 bg-indigo-900/20 w-fit px-3 py-1.5 rounded-full border border-indigo-500/20">
          <MapPin className="w-4 h-4 text-indigo-400" />
          <span>{centre.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass relative overflow-hidden group transition-all duration-300 border-indigo-500/20 bg-slate-900/60 hover:bg-slate-900/80 hover:shadow-xl hover:shadow-indigo-500/5">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-100 pointer-events-none"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-slate-400 group-hover:text-indigo-300 transition-colors">Expected Arrivals</CardTitle>
              <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
                <Clock className="w-4 h-4 text-indigo-400" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-black text-white group-hover:text-indigo-100 transition-colors">{expectedToday}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass relative overflow-hidden group transition-all duration-300 border-amber-500/30 bg-slate-900/60 shadow-[0_0_15px_rgba(245,158,11,0.1)] hover:shadow-[0_0_25px_rgba(245,158,11,0.2)]">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-100 pointer-events-none"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-amber-400 group-hover:text-amber-300 transition-colors">Active Queue</CardTitle>
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 group-hover:bg-amber-500/20 transition-colors">
                <Users className="w-4 h-4 text-amber-500" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-black text-amber-500 group-hover:text-amber-400 transition-colors">{inQueue}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="glass relative overflow-hidden group transition-all duration-300 border-emerald-500/20 bg-slate-900/60 hover:bg-slate-900/80 hover:shadow-xl hover:shadow-emerald-500/5">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-100 pointer-events-none"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-slate-400 group-hover:text-emerald-300 transition-colors">Processed</CardTitle>
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                <CheckSquare className="w-4 h-4 text-emerald-400" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-black text-white group-hover:text-emerald-100 transition-colors">{completed}</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="glass border-indigo-500/20 bg-slate-900/60 overflow-hidden shadow-2xl">
          <CardHeader className="border-b border-slate-800/80 bg-slate-950/50 flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold text-white">Queue Management</CardTitle>
          </CardHeader>
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader className="bg-slate-950/80 sticky top-0 shadow-sm z-10 backdrop-blur-md">
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="text-slate-400 font-semibold h-12">Booking ID</TableHead>
                  <TableHead className="text-slate-400 font-semibold">Farmer</TableHead>
                  <TableHead className="text-slate-400 font-semibold">Produce</TableHead>
                  <TableHead className="text-slate-400 font-semibold">Slot Time</TableHead>
                  <TableHead className="text-slate-400 font-semibold">Status</TableHead>
                  <TableHead className="text-right text-slate-400 font-semibold">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.length === 0 ? (
                  <TableRow className="border-transparent hover:bg-transparent">
                    <TableCell colSpan={6} className="text-center h-48">
                      <div className="flex flex-col items-center justify-center text-slate-500 gap-3">
                        <div className="p-4 rounded-full bg-slate-800/50 border border-slate-700/50">
                          <Search className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="font-medium text-lg">No bookings found for this centre today.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  bookings.map((booking: any) => (
                    <TableRow key={booking.id} className="border-slate-800/50 hover:bg-slate-800/40 transition-colors group">
                      <TableCell className="font-mono text-sm text-indigo-300 font-medium">{booking.booking_number}</TableCell>
                      <TableCell>
                        <div className="font-bold text-white group-hover:text-indigo-100 transition-colors">{booking.profiles.full_name}</div>
                        <div className="text-xs text-slate-400">{booking.profiles.mobile}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-slate-200">{booking.commodities.name}</div>
                        <div className="text-xs text-slate-400">{booking.expected_quantity} Qtl</div>
                      </TableCell>
                      <TableCell className="text-slate-300 font-medium">
                        {booking.slots.start_time.slice(0,5)} - {booking.slots.end_time.slice(0,5)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(booking.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        {booking.status === "GATE_PASS_GENERATED" || booking.status === "SLOT_BOOKED" ? (
                          <Button 
                            size="sm" 
                            onClick={() => handleCheckIn(booking.id)}
                            disabled={checkingIn === booking.id}
                            variant="outline"
                            className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 hover:text-white transition-colors shadow-sm"
                          >
                            {checkingIn === booking.id ? "Checking in..." : "Force Check-in"}
                          </Button>
                        ) : booking.status === "YARD_ARRIVED" || booking.status === "QUALITY_CHECK" || booking.status === "WEIGHMENT" ? (
                          <div className="flex justify-end gap-2">
                            {booking.status === "YARD_ARRIVED" && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300 transition-colors shadow-sm"
                                onClick={async () => {
                                  const { callNextFarmer } = await import('@/lib/manager/actions');
                                  await callNextFarmer(booking.id);
                                  toast.success("Notification sent to farmer", {
                                    className: "!bg-slate-900 !border !border-amber-500/30 !text-white",
                                    descriptionClassName: "!text-amber-400",
                                    description: "They have been asked to come to the counter."
                                  });
                                }}
                              >
                                <Bell className="w-4 h-4 mr-1.5 animate-pulse" /> Call
                              </Button>
                            )}
                            <ProcurementDialog booking={booking}>
                              <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-lg shadow-lg shadow-emerald-900/50 font-bold border-0">
                                Process Produce
                              </Button>
                            </ProcurementDialog>
                          </div>
                        ) : (
                          <Button size="sm" variant="ghost" disabled className="text-slate-600 font-medium">
                            Done
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </Card>
      </motion.div>
    </div>
  );
}
