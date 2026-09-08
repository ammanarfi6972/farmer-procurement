const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data, error } = await supabase.from('slots').select('*, bookings(count)').limit(1);
  console.log(JSON.stringify({data, error}, null, 2));
}
run();
