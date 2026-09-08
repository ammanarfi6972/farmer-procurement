const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fix() {
  const { data: users, error: err1 } = await supabase.auth.admin.listUsers();
  if (err1) { console.error(err1); return; }

  for (const user of users.users) {
    if (user.email === 'manager@kisanmitra.in') {
      console.log('Fixing manager:', user.id);
      await supabase.from('profiles').upsert({
        id: user.id,
        full_name: 'Demo Manager',
        role: 'centre_manager',
        mobile: '9999999991'
      });
    } else if (user.email === 'admin@kisanmitra.in') {
      console.log('Fixing admin:', user.id);
      await supabase.from('profiles').upsert({
        id: user.id,
        full_name: 'Demo Admin',
        role: 'district_admin',
        mobile: '9999999992'
      });
    }
  }
  console.log('Done fixing profiles!');
}

fix();
