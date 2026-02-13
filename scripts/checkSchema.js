const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkSchema() {
  console.log('Checking Table: daily_entries');
  const { data, error } = await supabase.rpc('get_table_info', { table_name: 'daily_entries' });
  if (error) {
    // Fallback if get_table_info doesn't exist
    const { data: cols, error: colError } = await supabase.from('daily_entries').select('*').limit(1);
     console.log('Sample Data Key Types:');
     if (cols && cols[0]) {
        Object.keys(cols[0]).forEach(k => console.log(`- ${k}: ${typeof cols[0][k]}`));
     } else {
        console.log('No data found in daily_entries.');
     }
  } else {
    console.log(data);
  }
}

checkSchema();
