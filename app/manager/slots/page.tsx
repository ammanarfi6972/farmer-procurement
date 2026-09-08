import { SlotsClient } from "./slots-client";
import { getManagerSlots } from "@/lib/manager/actions";

export default async function SlotsPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const sp = await searchParams;
  const today = new Date().toISOString().split("T")[0];
  const date = sp.date || today;

  const data = await getManagerSlots(date);

  return <SlotsClient initialSlots={data.slots} selectedDate={date} />;
}
