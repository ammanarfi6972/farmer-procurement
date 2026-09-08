"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { updateCommodityPrice, toggleCentreStatus, addCommodity, addCentre, toggleCommodityStatus } from "@/lib/master-data/actions";
import { Leaf, Plus, Edit2, Power, PowerOff, MapPin, Loader2 } from "lucide-react";

export function MasterDataClient({ initialData }: { initialData: any }) {
  const [commodities, setCommodities] = useState(initialData.commodities);
  const [centres, setCentres] = useState(initialData.centres);
  
  // Dialog State
  const [selectedCommodity, setSelectedCommodity] = useState<any>(null);
  const [newPrice, setNewPrice] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Add Commodity State
  const [isAddCommodityOpen, setIsAddCommodityOpen] = useState(false);
  const [newCommodity, setNewCommodity] = useState({ name: "", code: "", unit: "QUINTAL", price: "" });
  const [isAddingCommodity, setIsAddingCommodity] = useState(false);

  // Add Centre State
  const [isAddCentreOpen, setIsAddCentreOpen] = useState(false);
  const [newCentre, setNewCentre] = useState({ name: "", code: "", address: "" });
  const [isAddingCentre, setIsAddingCentre] = useState(false);

  async function handleUpdatePrice(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCommodity || !newPrice) return;
    
    setIsUpdating(true);
    const res = await updateCommodityPrice(selectedCommodity.id, Number(newPrice));
    
    if (res?.success) {
      // Optimistic update
      setCommodities(commodities.map((c: any) => 
        c.id === selectedCommodity.id ? { ...c, currentPrice: Number(newPrice) } : c
      ));
      setSelectedCommodity(null);
      setNewPrice("");
    } else {
      alert(res?.error || "Failed to update price");
    }
    setIsUpdating(false);
  }

  async function handleToggleCommodity(commodityId: string, currentStatus: boolean) {
    const res = await toggleCommodityStatus(commodityId, !currentStatus);
    if (res?.success) {
      setCommodities(commodities.map((c: any) => 
        c.id === commodityId ? { ...c, active: !currentStatus } : c
      ));
    }
  }

  async function handleToggleCentre(centreId: string, currentStatus: boolean) {
    const res = await toggleCentreStatus(centreId, !currentStatus);
    if (res?.success) {
      setCentres(centres.map((c: any) => 
        c.id === centreId ? { ...c, operational_status: currentStatus ? 'INACTIVE' : 'ACTIVE' } : c
      ));
    }
  }

  async function handleAddCommodity(e: React.FormEvent) {
    e.preventDefault();
    setIsAddingCommodity(true);
    const res = await addCommodity(newCommodity.name, newCommodity.code, newCommodity.unit, Number(newCommodity.price));
    if (res?.success) {
      window.location.reload();
    } else {
      alert(res?.error || "Failed to add commodity");
      setIsAddingCommodity(false);
    }
  }

  async function handleAddCentre(e: React.FormEvent) {
    e.preventDefault();
    if (!initialData.defaultDistrictId) {
      alert("No district available to assign this centre to.");
      return;
    }
    setIsAddingCentre(true);
    const res = await addCentre(newCentre.name, newCentre.code, newCentre.address, initialData.defaultDistrictId);
    if (res?.success) {
      window.location.reload();
    } else {
      alert(res?.error || "Failed to add centre");
      setIsAddingCentre(false);
    }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="relative">
        <h2 className="text-3xl font-extrabold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-emerald-200 to-teal-200 drop-shadow-sm">Master Data Management</h2>
        <p className="text-slate-400 mt-2 font-medium">Manage minimum support prices (MSP) and procurement centres.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Commodities Column */}
        <Card className="glass relative overflow-hidden group transition-all duration-300 border-amber-500/20 bg-slate-900/60 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-100"></div>
          <CardHeader className="relative z-10 border-b border-slate-800/50 bg-slate-900/40">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-white">
                  <div className="p-2 bg-amber-500/20 rounded-lg shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                    <Leaf className="w-5 h-5 text-amber-400" />
                  </div>
                  Commodity Pricing
                </CardTitle>
                <CardDescription className="text-slate-400 mt-1">Update the effective pricing per quintal.</CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={() => setIsAddCommodityOpen(true)} className="bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20 hover:text-amber-300">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="relative z-10 pt-6">
            <div className="space-y-4">
              {commodities.map((c: any) => {
                const isActive = c.active;
                return (
                  <div key={c.id} className={`p-5 rounded-xl border transition-all flex items-center justify-between group/item ${isActive ? 'border-slate-700/50 bg-slate-800/40 hover:bg-slate-800/60 hover:shadow-lg hover:shadow-amber-500/5' : 'border-slate-800 bg-slate-950/40 opacity-75 grayscale-[30%] hover:grayscale-0'}`}>
                    <div className="flex flex-col gap-1.5">
                      <div className="font-extrabold text-lg text-white tracking-wide flex items-center gap-3">
                        {c.name}
                        {isActive ? (
                          <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 bg-emerald-500/10 text-[10px] uppercase font-black px-2 shadow-[0_0_10px_rgba(16,185,129,0.2)]">Active</Badge>
                        ) : (
                          <Badge variant="outline" className="text-slate-400 border-slate-700 bg-slate-800/50 text-[10px] uppercase font-bold px-2">Disabled</Badge>
                        )}
                      </div>
                      <div className="text-xs font-semibold text-amber-500/70 uppercase tracking-wider">Unit: {c.unit}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-black text-emerald-400 drop-shadow-sm">₹{c.currentPrice}</div>
                        <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500">per Qtl</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 rounded-full transition-colors"
                          onClick={() => {
                            setSelectedCommodity(c);
                            setNewPrice(c.currentPrice.toString());
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className={isActive 
                            ? "text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors" 
                            : "text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 rounded-full transition-colors"}
                          onClick={() => handleToggleCommodity(c.id, isActive)}
                        >
                          {isActive ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {commodities.length === 0 && (
                 <div className="text-center p-8 text-slate-500 italic">No commodities found.</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Centres Column */}
        <Card className="glass relative overflow-hidden group transition-all duration-300 border-blue-500/20 bg-slate-900/60 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-100"></div>
          <CardHeader className="relative z-10 border-b border-slate-800/50 bg-slate-900/40">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-white">
                  <div className="p-2 bg-blue-500/20 rounded-lg shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                    <MapPin className="w-5 h-5 text-blue-400" />
                  </div>
                  Procurement Centres
                </CardTitle>
                <CardDescription className="text-slate-400 mt-1">Activate or deactivate operational mandis.</CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={() => setIsAddCentreOpen(true)} className="bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20 hover:text-blue-300">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="relative z-10 pt-6">
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {centres.map((c: any) => {
                const isActive = c.operational_status === 'ACTIVE';
                return (
                  <div key={c.id} className={`p-5 rounded-xl border transition-all flex items-center justify-between ${isActive ? 'border-blue-500/30 bg-slate-800/50 hover:bg-slate-800/70 shadow-md shadow-blue-900/20' : 'border-slate-800 bg-slate-950/40 opacity-75 grayscale-[30%] hover:grayscale-0'}`}>
                    <div className="flex flex-col gap-1.5">
                      <div className="font-bold text-white flex items-center gap-3 text-base">
                        {c.name}
                        {isActive ? (
                          <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 bg-emerald-500/10 text-[10px] uppercase font-black px-2 shadow-[0_0_10px_rgba(16,185,129,0.2)]">Active</Badge>
                        ) : (
                          <Badge variant="outline" className="text-slate-400 border-slate-700 bg-slate-800/50 text-[10px] uppercase font-bold px-2">Disabled</Badge>
                        )}
                      </div>
                      <div className="text-xs font-medium text-slate-400 truncate max-w-[220px]" title={c.address}>{c.address}</div>
                    </div>
                    <Button 
                      variant={isActive ? "ghost" : "default"}
                      size="sm"
                      onClick={() => handleToggleCentre(c.id, isActive)}
                      className={isActive 
                        ? "text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" 
                        : "bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-lg shadow-blue-900/50"}
                    >
                      {isActive ? <PowerOff className="w-4 h-4 mr-2" /> : <Power className="w-4 h-4 mr-2" />}
                      {isActive ? "" : "Enable"}
                    </Button>
                  </div>
                );
              })}
              {centres.length === 0 && (
                 <div className="text-center p-8 text-slate-500 italic">No centres found.</div>
              )}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Edit Price Dialog */}
      <Dialog open={!!selectedCommodity} onOpenChange={(open) => !open && setSelectedCommodity(null)}>
        <DialogContent className="sm:max-w-[425px] bg-slate-900/95 backdrop-blur-xl border-slate-700 shadow-2xl text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-500">Update Pricing: {selectedCommodity?.name}</DialogTitle>
            <DialogDescription className="text-slate-400 font-medium">
              Set a new effective price per quintal. This takes effect immediately for all new procurements.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdatePrice}>
            <div className="grid gap-4 py-6">
              <div className="grid gap-3">
                <Label htmlFor="price" className="text-slate-300 font-semibold">Price per Quintal (₹)</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="pl-8 bg-slate-950/50 border-slate-700 text-white text-xl font-black h-14 focus-visible:ring-amber-500 focus-visible:border-amber-500 rounded-xl"
                    required
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0 mt-2">
              <Button type="button" variant="ghost" onClick={() => setSelectedCommodity(null)} className="text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg font-medium">
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-lg shadow-lg shadow-amber-900/20 font-bold border-0 flex items-center">
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Save New Price
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Commodity Dialog */}
      <Dialog open={isAddCommodityOpen} onOpenChange={(open) => !open && setIsAddCommodityOpen(false)}>
        <DialogContent className="sm:max-w-[425px] bg-slate-900/95 backdrop-blur-xl border-slate-700 shadow-2xl text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-500">Add New Commodity</DialogTitle>
            <DialogDescription className="text-slate-400 font-medium">
              Register a new crop type and set its initial MSP.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddCommodity}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="c-name" className="text-slate-300 font-semibold">Name</Label>
                <Input
                  id="c-name"
                  value={newCommodity.name}
                  onChange={(e) => setNewCommodity({...newCommodity, name: e.target.value})}
                  className="bg-slate-950/50 border-slate-700 text-white focus-visible:ring-amber-500"
                  required
                  placeholder="e.g. Soybeans"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="c-code" className="text-slate-300 font-semibold">Code</Label>
                <Input
                  id="c-code"
                  value={newCommodity.code}
                  onChange={(e) => setNewCommodity({...newCommodity, code: e.target.value.toUpperCase()})}
                  className="bg-slate-950/50 border-slate-700 text-white focus-visible:ring-amber-500"
                  required
                  placeholder="e.g. SOYBEAN"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="c-price" className="text-slate-300 font-semibold">Initial Price per Quintal (₹)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <Input
                    id="c-price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={newCommodity.price}
                    onChange={(e) => setNewCommodity({...newCommodity, price: e.target.value})}
                    className="pl-8 bg-slate-950/50 border-slate-700 text-white focus-visible:ring-amber-500"
                    required
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0 mt-2">
              <Button type="button" variant="ghost" onClick={() => setIsAddCommodityOpen(false)} className="text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg font-medium">
                Cancel
              </Button>
              <Button type="submit" disabled={isAddingCommodity} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-lg shadow-lg shadow-amber-900/20 font-bold border-0 flex items-center">
                {isAddingCommodity ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Add Commodity
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Centre Dialog */}
      <Dialog open={isAddCentreOpen} onOpenChange={(open) => !open && setIsAddCentreOpen(false)}>
        <DialogContent className="sm:max-w-[425px] bg-slate-900/95 backdrop-blur-xl border-slate-700 shadow-2xl text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-blue-500">Add New Centre</DialogTitle>
            <DialogDescription className="text-slate-400 font-medium">
              Create a new operational procurement mandi.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddCentre}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="centre-name" className="text-slate-300 font-semibold">Name</Label>
                <Input
                  id="centre-name"
                  value={newCentre.name}
                  onChange={(e) => setNewCentre({...newCentre, name: e.target.value})}
                  className="bg-slate-950/50 border-slate-700 text-white focus-visible:ring-blue-500"
                  required
                  placeholder="e.g. Kanpur South Centre"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="centre-code" className="text-slate-300 font-semibold">Centre Code</Label>
                <Input
                  id="centre-code"
                  value={newCentre.code}
                  onChange={(e) => setNewCentre({...newCentre, code: e.target.value.toUpperCase()})}
                  className="bg-slate-950/50 border-slate-700 text-white focus-visible:ring-blue-500"
                  required
                  placeholder="e.g. KAN-01"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="centre-address" className="text-slate-300 font-semibold">Full Address</Label>
                <Input
                  id="centre-address"
                  value={newCentre.address}
                  onChange={(e) => setNewCentre({...newCentre, address: e.target.value})}
                  className="bg-slate-950/50 border-slate-700 text-white focus-visible:ring-blue-500"
                  required
                  placeholder="e.g. 123 Agri Lane, Kanpur"
                />
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0 mt-2">
              <Button type="button" variant="ghost" onClick={() => setIsAddCentreOpen(false)} className="text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg font-medium">
                Cancel
              </Button>
              <Button type="submit" disabled={isAddingCentre} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg shadow-lg shadow-blue-900/20 font-bold border-0 flex items-center">
                {isAddingCentre ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Add Centre
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
