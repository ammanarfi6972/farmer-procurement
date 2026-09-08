import { getDemoState } from "@/lib/demo/actions";
import { DemoClient } from "./demo-client";

export default async function DemoPage() {
  const data = await getDemoState();
  return <DemoClient initialData={data} />;
}
