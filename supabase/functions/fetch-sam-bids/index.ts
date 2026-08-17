import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Technology NAICS codes we care about
const TECH_NAICS = [
  '541511', // Custom Computer Programming Services
  '541512', // Computer Systems Design Services
  '541513', // Computer Facilities Management Services
  '541519', // Other Computer Related Services
  '518210', // Data Processing, Hosting, and Related Services
  '517110', // Wired Telecommunications Carriers
  '517210', // Wireless Telecommunications Carriers
  '517919', // All Other Telecommunications
  '541715', // R&D in Physical, Engineering Sciences
  '334111', // Electronic Computer Manufacturing
  '334118', // Computer Terminal and Peripheral Equipment Manufacturing
  '811212', // Computer and Office Machine Repair
];

// Map NAICS → our display category
const NAICS_TO_CATEGORY: Record<string, string> = {
  '541511': 'Software',
  '541512': 'Software',
  '541513': 'Software',
  '541519': 'Software',
  '518210': 'Cloud',
  '517110': 'Telecom',
  '517210': 'Telecom',
  '517919': 'Telecom',
  '541715': 'R&D',
  '334111': 'Hardware',
  '334118': 'Hardware',
  '811212': 'IT Services',
};

// Keywords that refine categories from descriptions
function classifyFromTitle(title: string): string {
  const t = title.toLowerCase();
  if (t.match(/cyber|security|soc|siem|endpoint|firewall|zero.?trust|iam|identity|access management|vulnerability|penetration|pentest/)) return 'CyberSec';
  if (t.match(/cloud|aws|azure|gcp|saas|paas|iaas|migration|hosting|data center/)) return 'Cloud';
  if (t.match(/network|telecom|fiber|broadband|5g|lte|wan|lan|routing|switching/)) return 'Telecom';
  if (t.match(/erp|enterprise resource|financial system|hr system|payroll|accounting/)) return 'ERP';
  if (t.match(/health|medical|ehr|emr|clinical|patient|pharmacy|hipaa/)) return 'HealthIT';
  if (t.match(/ai|machine learning|ml|nlp|artificial intelligence|analytics|data science|business intelligence/)) return 'AI/ML';
  if (t.match(/hardware|server|workstation|laptop|computer|peripherals|storage|rack/)) return 'Hardware';
  return 'Software';
}

// Format date for SAM.gov API (MM/dd/YYYY)
function samDate(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

interface SamOpportunity {
  noticeId: string;
  title: string;
  baseType?: string;
  type?: string;
  organizationHierarchy?: Array<{ name?: string; level?: number }>;
  naicsCode?: string;
  classificationCode?: string;
  placeOfPerformance?: {
    state?: { code?: string; name?: string };
  };
  responseDeadLine?: string;
  postedDate?: string;
  description?: string;
  uiLink?: string;
  typeOfSetAsideDescription?: string;
  fullParentPathName?: string;
}

interface SamResponse {
  totalRecords?: number;
  opportunitiesData?: SamOpportunity[];
}

Deno.serve(async (req: Request) => {
  // Allow manual trigger via POST or scheduled cron call
  if (req.method !== 'POST' && req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  const SAM_KEY = Deno.env.get('SAM_GOV_API_KEY');
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
  const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!SAM_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return new Response(JSON.stringify({ error: 'Missing env vars' }), { status: 500 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const startMs = Date.now();

  // Fetch the last 14 days by default; allow override via query param
  const url = new URL(req.url);
  const daysBack = parseInt(url.searchParams.get('days') ?? '14', 10);

  const toDate = new Date();
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - daysBack);

  let totalFetched = 0;
  let totalUpserted = 0;
  const errors: string[] = [];

  for (const naics of TECH_NAICS) {
    try {
      let offset = 0;
      const limit = 1000;

      while (true) {
        const params = new URLSearchParams({
          api_key: SAM_KEY,
          limit: String(limit),
          offset: String(offset),
          postedFrom: samDate(fromDate),
          postedTo: samDate(toDate),
          ncode: naics,
          status: 'active',
        });

        const res = await fetch(
          `https://api.sam.gov/prod/opportunities/v2/search?${params}`,
          { headers: { 'Accept': 'application/json' } }
        );

        if (!res.ok) {
          const body = await res.text();
          errors.push(`NAICS ${naics} offset ${offset}: HTTP ${res.status} — ${body.slice(0, 200)}`);
          break;
        }

        const data: SamResponse = await res.json();
        const opps = data.opportunitiesData ?? [];
        totalFetched += opps.length;

        if (opps.length === 0) break;

        // Build upsert rows
        const rows = opps.map((o) => {
          const orgs = o.organizationHierarchy ?? [];
          const agency = orgs.find(x => x.level === 1)?.name ?? o.fullParentPathName?.split('.')[0] ?? null;
          const subAgency = orgs.find(x => x.level === 2)?.name ?? null;
          const office = orgs.find(x => x.level === 3)?.name ?? null;

          return {
            sam_id: o.noticeId,
            title: o.title,
            notice_type: o.type ?? o.baseType ?? null,
            agency,
            sub_agency: subAgency,
            office,
            state_code: o.placeOfPerformance?.state?.code ?? null,
            naics_code: naics,
            naics_description: null,
            set_aside: o.typeOfSetAsideDescription ?? null,
            posted_date: o.postedDate ?? null,
            response_deadline: o.responseDeadLine ?? null,
            description: o.description ?? null,
            sam_url: o.uiLink ?? `https://sam.gov/opp/${o.noticeId}/view`,
            category: classifyFromTitle(o.title ?? ''),
            status: 'active',
          };
        });

        const { error: upsertErr, count } = await supabase
          .from('bids')
          .upsert(rows, { onConflict: 'sam_id', ignoreDuplicates: false })
          .select('id');

        if (upsertErr) {
          errors.push(`Upsert error NAICS ${naics}: ${upsertErr.message}`);
        } else {
          totalUpserted += count ?? rows.length;
        }

        // SAM.gov max is 1000 records per NAICS per call; if we got fewer we're done
        if (opps.length < limit) break;
        offset += limit;
      }
    } catch (e) {
      errors.push(`NAICS ${naics} exception: ${String(e)}`);
    }
  }

  // Mark bids past their deadline as inactive
  await supabase
    .from('bids')
    .update({ status: 'expired' })
    .lt('response_deadline', new Date().toISOString())
    .eq('status', 'active');

  const durationMs = Date.now() - startMs;

  // Log the run
  await supabase.from('fetch_log').insert({
    bids_fetched: totalFetched,
    bids_upserted: totalUpserted,
    error: errors.length ? errors.join('\n') : null,
    duration_ms: durationMs,
  });

  return new Response(
    JSON.stringify({
      fetched: totalFetched,
      upserted: totalUpserted,
      duration_ms: durationMs,
      errors: errors.length ? errors : undefined,
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
});
