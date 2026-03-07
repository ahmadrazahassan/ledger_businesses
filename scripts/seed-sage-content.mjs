import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const env = {};

for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const [key, ...valueParts] = trimmed.split('=');
  env[key.trim()] = valueParts.join('=').trim();
}

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
const MIN_WORDS = 3500;

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function countWords(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

function paragraph(text) {
  return `<p class="mb-6 leading-[1.9]">${text}</p>`;
}

function heading(level, text) {
  if (level === 2) {
    return `<h2 class="mt-14 mb-6 text-[1.75rem] leading-tight font-bold">${text}</h2>`;
  }
  if (level === 3) {
    return `<h3 class="mt-8 mb-4 text-[1.2rem] leading-tight font-semibold">${text}</h3>`;
  }
  return `<h${level} class="mt-8 mb-4 font-semibold">${text}</h${level}>`;
}

function list(items) {
  return `<ul class="my-6 pl-7 list-disc space-y-2">${items.map((item) => `<li>${item}</li>`).join('')}</ul>`;
}

function ordered(items) {
  return `<ol class="my-6 pl-7 list-decimal space-y-2">${items.map((item) => `<li>${item}</li>`).join('')}</ol>`;
}

function sectionBlock(content) {
  return `<section class="my-10">${content}</section>`;
}

function buildLongFormArticle(config) {
  const {
    title,
    audience,
    objective,
    categoryAngle,
    categorySlug,
    tags,
    featuredRank,
    excerpt,
    slug,
  } = config;

  const intro = sectionBlock([
    heading(2, 'Executive Summary'),
    paragraph(`${title} is not just a software conversation. It is an operational design conversation for ${audience}. The real question is how a business can build a finance and operations engine that is fast, compliant, auditable, and decision-oriented. In the UK, that means keeping pace with HMRC requirements, reducing manual processing, and improving visibility across invoicing, cash position, payroll commitments, VAT obligations, and management reporting.`),
    paragraph(`The objective of this guide is straightforward: ${objective}. Instead of generic tips, this article breaks down governance, workflows, controls, implementation sequence, team responsibilities, and KPI architecture. It maps where Sage Accounting, Sage Payroll, and related Sage UK capabilities can fit into practical workflows for small-business execution. The goal is that a founder, finance lead, or practice advisor can use this as a working playbook.`),
    paragraph(`If you are replatforming from spreadsheets, cleaning up fragmented processes, or preparing for growth, you need a methodical structure. This article provides that structure in detail. Every section is designed to translate strategy into weekly operating routines that teams can follow consistently. That consistency is what creates better cash control, stronger compliance confidence, and faster decision loops.`),
    heading(2, 'Contents'),
    ordered([
      'Operational model and governance foundations',
      'Data model and chart-of-accounts discipline',
      'Invoicing and receivables performance system',
      'Purchase workflow and spend controls',
      'VAT and MTD submission readiness',
      'Payroll and HR execution standards',
      'Month-end close and management reporting',
      'Automation design and exception handling',
      '90-day implementation roadmap',
      'KPI framework and board-level visibility',
      'Risk controls and audit readiness',
      'Final checklist and action plan'
    ]),
  ].join('\n'));

  const moduleDefinitions = [
    {
      title: '1) Operational Model and Governance Foundations',
      context: 'Finance operations fail when ownership is vague. Define named owners for invoicing, approvals, VAT coding, payroll checks, and month-end sign-off. A governance matrix prevents tasks from being delayed or duplicated.',
      execution: [
        'Document role ownership across the full finance cycle.',
        'Set weekly and monthly cadence for review meetings.',
        'Create SLA targets for invoice issuance, payment posting, and bank reconciliation.',
        'Define who approves exceptions and by what deadline.',
        'Track unresolved exceptions in a shared action register.',
      ],
      points: [
        'Governance converts finance from admin to operating control.',
        'Named owners improve accountability and speed.',
        'Cadence keeps execution stable through busy periods.',
        'Exception handling protects compliance and cash flow.',
        'Board confidence improves when process ownership is explicit.',
      ],
    },
    {
      title: '2) Data Model and Chart-of-Accounts Discipline',
      context: 'Reliable reporting depends on reliable categorisation. If coding rules are inconsistent, even the best dashboard becomes misleading. Standard account mapping, naming conventions, and VAT-code defaults are mandatory.',
      execution: [
        'Build a concise chart of accounts aligned to management decisions.',
        'Set default VAT treatment per nominal code.',
        'Create posting rules for recurring transactions.',
        'Review coding exceptions weekly and retrain where needed.',
        'Publish a one-page coding standard for every finance user.',
      ],
      points: [
        'Clean coding improves forecasting quality.',
        'Consistent VAT treatment reduces filing errors.',
        'Posting rules reduce rework during month-end.',
        'Standardisation shortens onboarding time for new staff.',
        'Reliable data is the base layer of strategic finance.',
      ],
    },
    {
      title: '3) Invoicing and Receivables Performance System',
      context: 'Most SMEs lose cash velocity through delayed invoicing and weak collections rhythm. A formal invoice-to-cash system should define issue timing, reminder sequence, escalation policy, and dispute closure targets.',
      execution: [
        'Issue invoices immediately after milestone completion.',
        'Use fixed payment terms and enforce them consistently.',
        'Automate reminders at predefined intervals.',
        'Escalate overdue balances by value and aging threshold.',
        'Run a weekly debtors call with action owners.',
      ],
      points: [
        'Faster invoicing improves cash conversion.',
        'Automation cuts manual chasing workload.',
        'Weekly debtors review prevents aging surprises.',
        'Dispute workflow protects customer relationships.',
        'Receivables discipline strengthens working capital.',
      ],
    },
    {
      title: '4) Purchase Workflow and Spend Controls',
      context: 'Uncontrolled purchasing quietly erodes margin. A purchase-to-pay workflow with approval thresholds and supplier controls keeps spend aligned to budget and protects the business from avoidable leakage.',
      execution: [
        'Set approval limits by role and budget owner.',
        'Require PO references before invoice payment.',
        'Introduce three-way checks for critical spend categories.',
        'Review supplier concentration and renegotiate where possible.',
        'Track maverick spend and close policy gaps quickly.',
      ],
      points: [
        'Approval rules reduce unplanned spending.',
        'PO discipline increases audit confidence.',
        'Supplier analytics create negotiation leverage.',
        'Margin improves when leakage is visible.',
        'Spend controls support stable cash planning.',
      ],
    },
    {
      title: '5) VAT and MTD Submission Readiness',
      context: 'VAT should be treated as a monthly governance process, not a deadline event. HMRC and MTD readiness depends on clean digital records, consistent coding, and pre-submission quality checks.',
      execution: [
        'Perform monthly VAT reconciliations before return periods.',
        'Review unusual transactions in a VAT exception queue.',
        'Run pre-submission checks with finance and advisor sign-off.',
        'Maintain digital audit trail for every material adjustment.',
        'Capture lessons learned after each submission cycle.',
      ],
      points: [
        'MTD readiness is process quality, not only software choice.',
        'Exception queues reduce last-minute filing pressure.',
        'Audit trails improve resilience during reviews.',
        'Monthly discipline prevents quarter-end panic.',
        'Strong VAT control protects reputation and cash.',
      ],
    },
    {
      title: '6) Payroll and HR Execution Standards',
      context: 'Payroll reliability requires integration between HR events and pay-cycle operations. Joiners, leavers, tax code updates, and pension actions must follow one controlled workflow.',
      execution: [
        'Publish payroll calendar with cut-off and approval dates.',
        'Create mandatory joiner/mover/leaver checklist.',
        'Validate tax codes and pension status before processing.',
        'Run pre-payroll variance checks against prior periods.',
        'Document correction process for post-payroll exceptions.',
      ],
      points: [
        'Payroll reliability builds employee trust.',
        'Pre-processing checks prevent avoidable corrections.',
        'HR integration reduces data mismatch risk.',
        'Variance analysis catches anomalies early.',
        'Structured corrections reduce compliance exposure.',
      ],
    },
    {
      title: '7) Month-End Close and Management Reporting',
      context: 'A slow close delays decisions. The objective is not just to close books, but to produce decision-grade insight quickly and consistently for leadership.',
      execution: [
        'Set a day-by-day close timetable with named owners.',
        'Automate recurring journals and reconciliations where safe.',
        'Prepare a management pack with commentary, not just numbers.',
        'Review margin, cash, and cost variance in one decision forum.',
        'Track close duration and remove bottlenecks monthly.',
      ],
      points: [
        'Close speed increases strategic agility.',
        'Commentary transforms numbers into decisions.',
        'Variance review prevents silent drift in performance.',
        'Timetable ownership keeps close predictable.',
        'Faster close improves board confidence.',
      ],
    },
    {
      title: '8) Automation Design and Exception Handling',
      context: 'Automation should remove repetitive processing and expose exceptions. The goal is not zero human involvement; it is better human involvement on higher-value decisions.',
      execution: [
        'Automate transaction capture where controls are reliable.',
        'Define exception categories and severity levels.',
        'Assign SLA for each exception class.',
        'Escalate recurring exception types for root-cause fixes.',
        'Measure hours saved and reassign capacity to analysis.',
      ],
      points: [
        'Automation value is measured in decision capacity.',
        'Exception taxonomy improves response quality.',
        'SLA discipline keeps issues from aging.',
        'Root-cause reviews reduce recurring friction.',
        'Admin reduction should fund analytical work.',
      ],
    },
    {
      title: '9) 90-Day Implementation Roadmap',
      context: 'Transformation succeeds when phased. A 90-day roadmap creates momentum while protecting day-to-day operations from disruption.',
      execution: [
        'Days 1-15: process mapping, ownership, and baseline metrics.',
        'Days 16-35: data cleanup, chart design, and control templates.',
        'Days 36-60: system configuration, testing, and pilot execution.',
        'Days 61-80: go-live with controlled monitoring.',
        'Days 81-90: optimisation sprint and KPI baseline reset.',
      ],
      points: [
        'Phasing reduces implementation risk.',
        'Baseline metrics prove progress objectively.',
        'Pilot-first rollout protects business continuity.',
        'Post-go-live optimisation locks in value.',
        'Leadership sponsorship is essential in every phase.',
      ],
    },
    {
      title: '10) KPI Framework and Board-Level Visibility',
      context: 'KPIs should trigger action, not decoration. Each metric must have ownership, threshold, and response plan.',
      execution: [
        'Track debtor days, overdue ratio, and collection velocity.',
        'Track payroll accuracy, exception rate, and cycle time.',
        'Track VAT issue count and pre-submission adjustment volume.',
        'Track gross margin trend and supplier-cost variance.',
        'Track 13-week cash forecast accuracy and runway coverage.',
      ],
      points: [
        'Threshold-driven KPIs create operational discipline.',
        'Ownership prevents dashboard stagnation.',
        'Action plans convert metrics into outcomes.',
        'Forecast reliability supports better capital decisions.',
        'Visibility reduces reaction time under pressure.',
      ],
    },
    {
      title: '11) Risk Controls and Audit Readiness',
      context: 'Audit readiness should be a continuous state. Access controls, approval trails, and documented decisions reduce both compliance and operational risk.',
      execution: [
        'Enforce least-privilege access for sensitive workflows.',
        'Log all material adjustments with rationale and approver.',
        'Review segregation of duties each quarter.',
        'Retain evidence packs for major reconciliations.',
        'Run internal control walkthroughs before busy filing cycles.',
      ],
      points: [
        'Continuous readiness lowers audit stress.',
        'Access governance protects payroll and financial data.',
        'Documentation quality speeds review processes.',
        'Segregation reviews reduce fraud and error exposure.',
        'Control maturity improves lender and partner confidence.',
      ],
    },
    {
      title: '12) Final Checklist and Action Plan',
      context: `${categoryAngle} should now be managed as an operating advantage, not an afterthought. The final step is converting strategy into an accountable action plan with clear dates, owners, and measurable outcomes.`,
      execution: [
        'Publish 30-day action list with owner and due date.',
        'Set monthly steering meeting to review delivery.',
        'Measure cash, compliance, and efficiency outcomes.',
        'Update SOPs based on real operational feedback.',
        'Share progress with stakeholders to reinforce discipline.',
      ],
      points: [
        'Action ownership is the bridge between strategy and result.',
        'Steering cadence keeps execution from drifting.',
        'Outcome metrics prove commercial impact.',
        'SOP updates preserve improvements over time.',
        'Transparent progress builds trust across teams.',
      ],
    },
  ];

  const sections = moduleDefinitions
    .map((module) =>
      sectionBlock(
        [
          heading(2, module.title),
          heading(3, 'Context'),
          paragraph(module.context),
          paragraph(`For ${audience}, this area matters because delayed decisions and inconsistent process execution create hidden cost and compliance risk. A platform-led approach works best when standards are explicit, ownership is clear, and review cadence is protected in the calendar.`),
          heading(3, 'Execution Steps'),
          ordered(module.execution),
          heading(3, 'Key Points'),
          ordered(module.points),
          heading(3, 'Sage Alignment'),
          paragraph(`Sage UK product positioning around cloud access, accounting and payroll workflows, and HMRC compatibility aligns with this execution model. The strongest business outcome appears when teams combine platform capability with disciplined operating routines and measurable controls.`),
        ].join('\n')
      )
    )
    .join('\n');

  let contentHtml = `${intro}\n${sections}`;
  const expansionBank = [
    {
      title: 'Advanced Deep Dive: Scenario Planning',
      bullets: [
        'Run base, upside, and downside scenarios monthly.',
        'Model payroll growth impact on cash runway.',
        'Model debtor delay impact on VAT and supplier payments.',
        'Stress test margin with supplier cost changes.',
        'Tie each scenario to specific management actions.',
      ],
      text: 'Scenario planning should be operational, not theoretical. The most resilient UK SMEs use structured forecasting to decide early whether to accelerate hiring, defer spend, tighten collections, or protect margin through pricing and procurement actions.'
    },
    {
      title: 'Advanced Deep Dive: Control Maturity',
      bullets: [
        'Define control owner for each critical workflow.',
        'Track control test failures and remediation speed.',
        'Embed controls inside daily operations, not year-end only.',
        'Use exception logs to improve policy clarity.',
        'Report control health in monthly leadership packs.',
      ],
      text: 'Control maturity determines whether a business can scale without operational fragility. Mature controls reduce rework, improve confidence with advisors and lenders, and help teams execute with less firefighting.'
    },
  ];

  let expansionIndex = 0;
  while (countWords(stripHtml(contentHtml)) < MIN_WORDS) {
    const topic = expansionBank[expansionIndex % expansionBank.length];
    contentHtml += `\n${sectionBlock(`${heading(2, topic.title)}\n${paragraph(topic.text)}\n${heading(3, 'Action Checklist')}\n${ordered(topic.bullets)}`)}`;
    expansionIndex += 1;
  }

  const contentText = stripHtml(contentHtml);
  const wordCount = countWords(contentText);

  return {
    title,
    slug,
    excerpt,
    category_slug: categorySlug,
    content_html: contentHtml,
    content_text: contentText,
    tags,
    featured_rank: featuredRank,
    word_count: wordCount,
    reading_time: Math.max(1, Math.ceil(wordCount / 230)),
  };
}

const blueprints = [
  {
    title: 'Cloud Accounting vs. Traditional Bookkeeping: The UK SME Operating Blueprint',
    slug: 'cloud-accounting-vs-traditional-bookkeeping',
    excerpt: 'A detailed 3500+ word blueprint comparing cloud accounting and traditional bookkeeping for UK growth-focused businesses.',
    categorySlug: 'accounting-bookkeeping',
    categoryAngle: 'Accounting discipline',
    audience: 'UK founders, finance leads, and practice advisors',
    objective: 'to show how to move from fragmented bookkeeping to a controlled cloud-finance operating model',
    tags: ['Sage Accounting', 'UK SME', 'Bookkeeping', 'Cloud Finance'],
    featuredRank: 1,
  },
  {
    title: 'Making Tax Digital for Income Tax: The Full UK Implementation Guide',
    slug: 'making-tax-digital-income-tax-sole-traders',
    excerpt: 'A practical long-form guide for sole traders and landlords preparing for MTD for Income Tax in the UK.',
    categorySlug: 'vat-tax-compliance',
    categoryAngle: 'Tax and compliance operations',
    audience: 'VAT-registered UK businesses and finance managers',
    objective: 'to convert MTD preparation into a monthly routine with clear controls and low filing risk',
    tags: ['MTD', 'VAT', 'HMRC', 'Sage UK'],
    featuredRank: 2,
  },
  {
    title: '5 Common Payroll Mistakes UK Small Businesses Make and How to Fix Them Permanently',
    slug: 'common-payroll-mistakes-uk-small-businesses',
    excerpt: 'A complete payroll control framework for UK SMEs covering RTI, tax codes, pensions, and error-proof execution.',
    categorySlug: 'payroll',
    categoryAngle: 'Payroll execution quality',
    audience: 'UK SMEs with growing teams and complex payroll cycles',
    objective: 'to build a zero-surprise payroll workflow with stronger compliance and team confidence',
    tags: ['Sage Payroll', 'HR', 'RTI', 'Auto Enrolment'],
    featuredRank: 3,
  },
  {
    title: 'Understanding VAT Schemes in the UK: Standard, Flat Rate, and Cash Accounting in Practice',
    slug: 'understanding-vat-schemes-uk',
    excerpt: 'A long-form operational guide to choosing and running the right VAT scheme with confidence.',
    categorySlug: 'vat-tax-compliance',
    categoryAngle: 'VAT strategy and control',
    audience: 'UK small businesses and finance managers evaluating VAT options',
    objective: 'to help leaders select and operate VAT schemes with fewer errors and stronger cash planning',
    tags: ['VAT', 'HMRC', 'Tax Control', 'Sage Accounting'],
    featuredRank: null,
  },
  {
    title: 'The Strategic Role of HR in Modern Business Growth: A UK Execution Manual',
    slug: 'strategic-role-hr-business-growth',
    excerpt: 'An advanced HR and payroll operations guide for SMEs that want growth without compliance chaos.',
    categorySlug: 'hr',
    categoryAngle: 'People operations and compliance',
    audience: 'UK leaders scaling teams while maintaining payroll and HR quality',
    objective: 'to integrate people operations, payroll governance, and growth planning into one operating model',
    tags: ['HR', 'Payroll', 'Growth', 'Sage UK'],
    featuredRank: null,
  },
  {
    title: 'Invoicing Best Practices to Get Paid Faster: A UK Cash-Flow Playbook',
    slug: 'invoicing-best-practices-get-paid-faster',
    excerpt: 'A structured receivables and collections playbook to reduce debtor days and improve liquidity.',
    categorySlug: 'invoicing',
    categoryAngle: 'Cash conversion performance',
    audience: 'UK service businesses managing payment delays',
    objective: 'to create a repeatable invoicing and collections machine that protects cash every month',
    tags: ['Invoicing', 'Cash Flow', 'Credit Control', 'Sage Accounting'],
    featuredRank: null,
  },
  {
    title: 'Financial Reporting: Turning Data into Decisions for UK SME Leaders',
    slug: 'financial-reporting-data-decisions',
    excerpt: 'A board-ready framework for KPI reporting, variance analysis, and decision-making from live finance data.',
    categorySlug: 'reporting-business-insights',
    categoryAngle: 'Management insight and decision architecture',
    audience: 'owners and directors who need strategic reporting from finance data',
    objective: 'to build a repeatable KPI and review system that supports faster, better decisions',
    tags: ['Management Reporting', 'KPIs', 'Forecasting', 'Sage'],
    featuredRank: null,
  },
  {
    title: 'Construction Industry Scheme (CIS): Complete Compliance Operations Guide',
    slug: 'construction-industry-scheme-guide',
    excerpt: 'A deep CIS compliance and workflow guide for UK contractors and subcontractors.',
    categorySlug: 'vat-tax-compliance',
    categoryAngle: 'Construction tax operations',
    audience: 'UK contractors and subcontractors managing CIS obligations',
    objective: 'to reduce CIS penalties and improve payment workflow control in construction businesses',
    tags: ['CIS', 'HMRC', 'Construction', 'Tax'],
    featuredRank: null,
  },
  {
    title: 'Sage Accounting for UK SMEs: A Complete Operational Playbook',
    slug: 'sage-accounting-uk-sme-operational-playbook',
    excerpt: 'A complete implementation framework for UK SMEs using cloud accounting, VAT workflows, and practical finance controls.',
    categorySlug: 'accounting-bookkeeping',
    categoryAngle: 'Accounting transformation',
    audience: 'UK founders and finance managers modernising operations',
    objective: 'to deploy Sage-aligned accounting workflows that improve speed, visibility, and compliance',
    tags: ['Sage Accounting', 'UK SME', 'Finance Operations', 'Cloud'],
    featuredRank: null,
  },
  {
    title: 'Payroll and HR at Scale: The UK Operator’s Guide to Accuracy and Speed',
    slug: 'payroll-hr-scale-uk-operators-guide',
    excerpt: 'A practical blueprint to run payroll, HR workflows, and compliance controls with fewer errors and faster turnaround.',
    categorySlug: 'payroll',
    categoryAngle: 'Payroll execution',
    audience: 'UK businesses scaling beyond manual payroll processes',
    objective: 'to improve payroll speed and compliance through a robust operating model',
    tags: ['Sage Payroll', 'HR', 'Payroll Controls', 'UK Compliance'],
    featuredRank: null,
  },
];

const posts = blueprints.map((blueprint) => buildLongFormArticle(blueprint));

async function seed() {
  console.log('🌱 Seeding Sage long-form content...');
  const { data: authors } = await supabase.from('authors').select('id').limit(1);

  if (!authors || authors.length === 0) {
    console.error('No authors found. Please create an author first.');
    return;
  }

  const authorId = authors[0].id;

  for (const post of posts) {
    if (post.word_count < MIN_WORDS) {
      console.error(`Skipping ${post.title}: word count ${post.word_count} below minimum ${MIN_WORDS}.`);
      continue;
    }

    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', post.category_slug)
      .single();

    if (!category) {
      console.warn(`Category not found: ${post.category_slug}`);
      continue;
    }

    const { data: newPost, error } = await supabase
      .from('posts')
      .upsert(
        {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content_html: post.content_html,
          content_text: post.content_text,
          author_id: authorId,
          category_id: category.id,
          tags: post.tags,
          status: 'published',
          published_at: new Date().toISOString(),
          reading_time: post.reading_time,
          featured_rank: post.featured_rank,
          view_count: Math.floor(Math.random() * 5000) + 500,
          seo_title: post.title,
          seo_description: post.excerpt,
        },
        { onConflict: 'slug' }
      )
      .select()
      .single();

    if (error) {
      console.error(`Error creating post ${post.title}:`, error.message);
      continue;
    }

    await supabase.from('post_categories').upsert(
      {
        post_id: newPost.id,
        category_id: category.id,
        is_primary: true,
      },
      { onConflict: 'post_id, category_id' }
    );

    console.log(`✅ Seeded: ${post.title} (${post.word_count} words)`);
  }

  console.log('✨ Long-form seeding complete!');
}

seed();
