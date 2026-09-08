"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, Users, Scale, AlertCircle, TrendingUp, PackageSearch, Calendar as CalendarIcon } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { cn, formatDateTime } from "@/lib/utils";

const COLORS = ['#818cf8', '#34d399', '#fbbf24', '#f87171', '#a78bfa'];

export function AdminDashboardClient({ initialData, initialParams }: { initialData: any, initialParams: any }) {
  const router = useRouter();
  const [period, setPeriod] = useState(initialParams?.period || "today");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
    from: initialParams?.from ? new Date(initialParams.from) : undefined,
    to: initialParams?.to ? new Date(initialParams.to) : undefined,
  });

  const { metrics, chartDataByCentre, chartDataByCommodity, recentActivity } = initialData;

  const totalVolume = metrics?.totalVolume ?? 0;
  const totalValue = metrics?.totalValue ?? 0;
  const farmersProcessed = metrics?.farmersProcessed ?? 0;
  const activeQueueCount = metrics?.activeQueueCount ?? 0;

  const formattedValue = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(totalValue);

  const handlePeriodChange = (val: string) => {
    setPeriod(val);
    if (val !== "custom") {
      router.push(`?period=${val}`);
    }
  };

  const handleCustomDateChange = (range: any) => {
    setDateRange(range);
    if (range?.from && range?.to) {
      router.push(`?period=custom&from=${range.from.toISOString()}&to=${range.to.toISOString()}`);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-blue-200 drop-shadow-sm">District Overview</h2>
          <p className="text-slate-400 mt-2 font-medium">Aggregate performance metrics across all procurement centres.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-[180px] bg-slate-900/80 border-slate-700 text-white font-medium">
              <SelectValue placeholder="Select Period" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700 text-white">
              <SelectItem value="today" className="focus:bg-slate-800 focus:text-white">Today</SelectItem>
              <SelectItem value="yesterday" className="focus:bg-slate-800 focus:text-white">Yesterday</SelectItem>
              <SelectItem value="this_week" className="focus:bg-slate-800 focus:text-white">This Week</SelectItem>
              <SelectItem value="last_week" className="focus:bg-slate-800 focus:text-white">Last Week</SelectItem>
              <SelectItem value="this_month" className="focus:bg-slate-800 focus:text-white">This Month</SelectItem>
              <SelectItem value="last_month" className="focus:bg-slate-800 focus:text-white">Last Month</SelectItem>
              <SelectItem value="this_year" className="focus:bg-slate-800 focus:text-white">This Year</SelectItem>
              <SelectItem value="last_year" className="focus:bg-slate-800 focus:text-white">Last Year</SelectItem>
              <SelectItem value="all_time" className="focus:bg-slate-800 focus:text-white">All Time</SelectItem>
              <SelectItem value="custom" className="focus:bg-slate-800 focus:text-white">Custom Date</SelectItem>
            </SelectContent>
          </Select>

          {period === "custom" && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[260px] justify-start text-left font-normal bg-slate-900/80 border-slate-700 text-white hover:bg-slate-800 hover:text-white",
                    !dateRange && "text-slate-400"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-indigo-400" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-slate-900 border-slate-700 text-white" align="end">
                <Calendar
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={handleCustomDateChange}
                  numberOfMonths={2}
                  className="bg-slate-900 text-white"
                />
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Procured Volume */}
        <Card className="glass relative overflow-hidden group hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 border-indigo-500/20 bg-slate-900/60">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
            <CardTitle className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Total Volume</CardTitle>
            <div className="p-2 bg-indigo-500/20 rounded-lg group-hover:bg-indigo-500/30 transition-colors">
              <Scale className="w-5 h-5 text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-black text-white tracking-tight drop-shadow-md">
              {totalVolume.toFixed(1)} <span className="text-xl font-medium text-indigo-300/70">Qtl</span>
            </div>
          </CardContent>
        </Card>

        {/* Value Disbursed */}
        <Card className="glass relative overflow-hidden group hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 border-emerald-500/20 bg-slate-900/60">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
            <CardTitle className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Value Disbursed</CardTitle>
            <div className="p-2 bg-emerald-500/20 rounded-lg group-hover:bg-emerald-500/30 transition-colors">
              <IndianRupee className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-black text-white tracking-tight drop-shadow-md">{formattedValue}</div>
          </CardContent>
        </Card>

        {/* Farmers Processed */}
        <Card className="glass relative overflow-hidden group hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 border-blue-500/20 bg-slate-900/60">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
            <CardTitle className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Farmers Served</CardTitle>
            <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
              <Users className="w-5 h-5 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-black text-white tracking-tight drop-shadow-md">{farmersProcessed}</div>
          </CardContent>
        </Card>

        {/* Currently in Queue */}
        <Card className="glass relative overflow-hidden group hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 border-amber-500/20 bg-slate-900/60">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
            <CardTitle className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Active Queue</CardTitle>
            <div className="p-2 bg-amber-500/20 rounded-lg group-hover:bg-amber-500/30 transition-colors">
              <AlertCircle className="w-5 h-5 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-black text-amber-400 tracking-tight drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]">{activeQueueCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart: Procurement by Centre */}
        <Card className="lg:col-span-2 glass border-slate-800/50 bg-slate-900/40">
          <CardHeader>
            <CardTitle className="text-white font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              Procurement by Centre
            </CardTitle>
            <CardDescription className="text-slate-400">Volume procured (in Quintals) grouped by location.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[320px] w-full mt-4">
              {chartDataByCentre && chartDataByCentre.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartDataByCentre} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.9}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.9}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.4} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dx={-10} />
                    <RechartsTooltip 
                      cursor={{fill: '#1e293b', opacity: 0.4}}
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)', color: '#fff' }}
                      itemStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="volume" fill="url(#colorVolume)" radius={[6, 6, 0, 0]} maxBarSize={60} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-3">
                  <div className="p-4 bg-slate-800/50 rounded-full">
                    <TrendingUp className="w-8 h-8 text-slate-600" />
                  </div>
                  <span className="font-medium">No procurement data available yet.</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chart: Commodity Distribution */}
        <Card className="glass border-slate-800/50 bg-slate-900/40">
          <CardHeader>
            <CardTitle className="text-white font-bold flex items-center gap-2">
              <PackageSearch className="w-5 h-5 text-indigo-400" />
              Commodity Distribution
            </CardTitle>
            <CardDescription className="text-slate-400">Share of total volume.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              {chartDataByCommodity && chartDataByCommodity.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartDataByCommodity}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={8}
                      dataKey="value"
                      stroke="none"
                    >
                      {chartDataByCommodity.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="drop-shadow-sm hover:opacity-80 transition-opacity cursor-pointer" />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)', color: '#fff' }}
                      itemStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-3">
                  <div className="p-4 bg-slate-800/50 rounded-full">
                    <PackageSearch className="w-8 h-8 text-slate-600" />
                  </div>
                  <span className="font-medium">No data.</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-3 mt-4">
              {chartDataByCommodity && chartDataByCommodity.map((entry: any, index: number) => (
                <div key={entry.name} className="flex items-center justify-between text-sm p-2 rounded-lg bg-slate-800/30 border border-slate-800/50 hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: COLORS[index % COLORS.length], color: COLORS[index % COLORS.length] }}></div>
                    <span className="text-slate-300 font-medium">{entry.name}</span>
                  </div>
                  <span className="font-bold text-white">{entry.value} <span className="text-xs font-normal text-slate-500">Qtl</span></span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Feed */}
      <Card className="glass border-slate-800/50 bg-slate-900/40">
        <CardHeader>
          <CardTitle className="text-white font-bold">Recent Activity Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!recentActivity || recentActivity.length === 0 ? (
              <div className="text-sm font-medium text-slate-500 italic py-4 text-center bg-slate-800/20 rounded-lg border border-slate-800/50">
                No recent activity recorded.
              </div>
            ) : (
              recentActivity.map((log: any) => (
                <div key={log.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 hover:bg-slate-800/60 border border-slate-800/50 transition-all group">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-slate-200">
                      <span className="text-indigo-300">{log.bookings.profiles.full_name}</span> sold {log.accepted_quantity} Qtl of <span className="text-emerald-300">{log.commodities.name}</span>
                    </span>
                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                      <span>{log.bookings.procurement_centres.name}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                      <span>{formatDateTime(log.created_at)}</span>
                    </span>
                  </div>
                  <div className="text-sm font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.15)] group-hover:scale-105 transition-transform">
                    +₹{log.total_value.toLocaleString('en-IN')}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
