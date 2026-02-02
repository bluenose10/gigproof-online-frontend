# ⚠️ READ THIS FIRST BEFORE TOUCHING ANY BLOG ARTICLE ⚠️

**This document exists because schemas were done half-arsed the first time.**

- DO NOT create any blog article without ALL 6 schema blocks
- DO NOT mark work complete unless you've validated schemas  
- DO NOT skip any checklist item - if missing, article is NOT production-ready
- If you're an AI assistant helping with this, READ THE ENTIRE FILE before making changes

---

# GigProof Blog SEO & AI Search Optimization Guide

## Current Status (Feb 2026)
- **11 national blog articles** with full schema markup (6 blocks each)
- **11 Miami articles** (city hub + 10 neighborhood/platform/use case articles)
- **10 Los Angeles articles** (city hub + 10 neighborhood/platform/use case articles)
- **10 New York City articles** (city hub + 10 borough/platform/use case articles)
- **3 city hub pages** at `/blog/miami/`, `/blog/los-angeles/`, and `/blog/new-york/`
- **llms.txt file** at root with comprehensive AI optimization
- **sitemap.xml** with all articles and hub pages indexed

---

## CRITICAL: Before Calling Any Article "Done"

**DO NOT mark complete unless ALL of these exist:**

### Content Requirements
- [ ] Article is 2,500+ words minimum
- [ ] All H2 headers are question-based where possible (e.g., "How do I..." not "Getting Started")
- [ ] TL;DR summary box in first 200 words
- [ ] At least 1 comparison table
- [ ] At least 2 "Pro tip" callout boxes
- [ ] At least 1 numbered list with 5+ items
- [ ] FAQ section with 5+ questions minimum
- [ ] Action plan/checklist section at end
- [ ] "Last updated" date at TOP and bottom of article

### Schema Requirements (ALL 6 BLOCKS REQUIRED)
- [ ] Article schema (enhanced with wordCount, keywords, articleSection, inLanguage)
- [ ] FAQPage schema with 5+ questions (NOT just 3)
- [ ] HowTo schema (if article has step-by-step methods)
- [ ] BreadcrumbList schema (Home > Blog > Article)
- [ ] Organization schema (GigProof brand)
- [ ] ItemList schema (if article has rankings/comparisons)

### SEO Requirements
- [ ] Meta description is 150-160 characters with primary keyword
- [ ] Title tag includes year (e.g., "2026 Guide")
- [ ] Canonical URL is set correctly
- [ ] Open Graph tags complete
- [ ] Twitter Card tags complete
- [ ] At least 3 internal links to related GigProof articles
- [ ] At least 2 external authority links (IRS.gov, HUD.gov, banking resources, etc.)

### Validation Before Publishing
- [ ] Test at https://validator.schema.org/ - ZERO errors allowed
- [ ] Test at https://search.google.com/test/rich-results - all schemas recognized
- [ ] Read article aloud - does it sound natural?
- [ ] Check all links work (internal and external)
- [ ] Verify CTA buttons link to https://gigproof.online

**If ANY checkbox is unchecked, the article is NOT done.**

---

## Schema Markup Templates (Copy These Exactly)

### 1. Article Schema Template
```json
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "[FULL ARTICLE TITLE WITH YEAR]",
    "description": "[SAME AS META DESCRIPTION - 150-160 CHARS]",
    "image": "https://gigproof.online/images/logo.png",
    "author": {
        "@type": "Organization",
        "name": "GigProof",
        "url": "https://gigproof.online"
    },
    "publisher": {
        "@type": "Organization",
        "name": "GigProof",
        "logo": {
            "@type": "ImageObject",
            "url": "https://gigproof.online/images/logo.png"
        }
    },
    "datePublished": "[YYYY-MM-DD]",
    "dateModified": "[YYYY-MM-DD]",
    "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://gigproof.online/blog/[FILENAME].html"
    },
    "wordCount": [ACTUAL WORD COUNT],
    "keywords": "[PRIMARY KEYWORD, SECONDARY KEYWORD, TERTIARY KEYWORD]",
    "articleSection": "Income Verification",
    "inLanguage": "en-US"
}
</script>
```

### 2. FAQPage Schema Template
```json
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "[EXACT QUESTION FROM FAQ SECTION]",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "[FULL ANSWER - 2-3 SENTENCES MINIMUM]"
            }
        },
        {
            "@type": "Question",
            "name": "[QUESTION 2]",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "[ANSWER 2]"
            }
        }
        // ADD 5+ QUESTIONS MINIMUM - INCLUDE ALL FAQS FROM ARTICLE
    ]
}
</script>
```

### 3. HowTo Schema Template
```json
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "[WHAT THE GUIDE TEACHES - e.g., How to Get Uber Income Summary]",
    "description": "[BRIEF DESCRIPTION OF THE PROCESS]",
    "totalTime": "PT5M",
    "step": [
        {
            "@type": "HowToStep",
            "name": "[STEP NAME]",
            "text": "[FULL STEP DESCRIPTION]"
        },
        {
            "@type": "HowToStep",
            "name": "[STEP 2 NAME]",
            "text": "[FULL STEP 2 DESCRIPTION]"
        }
        // ADD ALL STEPS FROM ARTICLE
    ]
}
</script>
```

### 4. BreadcrumbList Schema Template
```json
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://gigproof.online/"
        },
        {
            "@type": "ListItem",
            "position": 2,
            "name": "Blog",
            "item": "https://gigproof.online/blog/"
        },
        {
            "@type": "ListItem",
            "position": 3,
            "name": "[ARTICLE TITLE - SHORT VERSION]"
        }
    ]
}
</script>
```

### 5. Organization Schema Template
```json
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "GigProof",
    "url": "https://gigproof.online",
    "logo": "https://gigproof.online/images/logo.png",
    "description": "Professional income documentation tool for gig workers"
}
</script>
```

### 6. ItemList Schema Template (Use for Rankings/Comparisons)
```json
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "[LIST TITLE - e.g., Documents Landlords Accept Ranked by Success Rate]",
    "description": "[BRIEF DESCRIPTION OF THE LIST]",
    "itemListElement": [
        {
            "@type": "ListItem",
            "position": 1,
            "name": "[ITEM 1 NAME]",
            "description": "[ITEM 1 DESCRIPTION WITH KEY DETAILS]"
        },
        {
            "@type": "ListItem",
            "position": 2,
            "name": "[ITEM 2 NAME]",
            "description": "[ITEM 2 DESCRIPTION]"
        }
        // ADD ALL RANKED ITEMS
    ]
}
</script>
```

---

## Schema Implementation Checklist

When adding schemas to an article:

1. **Count the schemas** - Must have 6 blocks (or 5 if no rankings/lists)
2. **Validate each one** at https://validator.schema.org/
3. **Check for duplicates** - Each schema type appears only once
4. **Match content** - FAQ questions match actual FAQs, HowTo steps match actual steps
5. **Update dates** - datePublished and dateModified should reflect reality
6. **Word count accuracy** - Use actual word count, not a guess
7. **Keywords accuracy** - Include actual target keywords from article

---

## Content Optimization for AI Search

### Answer-First Structure (REQUIRED)
Every major section should follow this pattern:

1. **Direct Answer** (first 1-2 sentences)
2. **Supporting Details** (next 2-3 paragraphs)
3. **Examples/Data** (tables, lists, statistics)
4. **Next Steps** (actionable CTA)

**Bad Example:**
> "When applying for apartments, gig workers face unique challenges. The traditional employment verification process doesn't work well for independent contractors. Let's explore the options..."

**Good Example:**
> "Yes, Uber drivers can get approved for apartments by providing tax returns (1040 + Schedule C), 3-6 months of bank statements, and professional income PDFs. Here's exactly how..."

### Entity Optimization (Use These Terms Consistently)

**Platform Names:**
- Uber, Uber Eats, Lyft, DoorDash, Instacart, Grubhub, Amazon Flex, Shipt, Gopuff

**Document Types:**
- 1099-K, 1099-NEC, 1040, Schedule C, W-2, pay stubs, bank statements, tax returns, CPA letter

**Use Cases:**
- apartment applications, rental verification, car loans, mortgages, credit applications, income verification

**Geographic (for location articles):**
- Specific cities, neighborhoods, ZIP codes, county names

### Statistics to Include (When Relevant)

- "Most landlords require 2.5-3x monthly rent in income"
- "90%+ acceptance rate for tax returns"
- "70% acceptance for bank statements"
- "30% acceptance for screenshots alone"
- "22% of Florida workforce are gig workers" (for Florida articles)
- "Under 2 minutes with GigProof vs 30-60 minutes manually"

### External Authority Links (Add 2+ Per Article)

**Government Resources:**
- IRS.gov (for tax form definitions)
- HUD.gov (for fair housing info)
- USA.gov (for federal programs)

**Financial Resources:**
- FDIC.gov (banking info)
- ConsumerFinance.gov (CFPB resources)

**Industry Resources:**
- Plaid.com (for fintech context)
- Relevant state .gov sites for location articles

---

## Google Search Console Setup

### Initial Setup (One-Time)
1. **Add Property:** https://gigproof.online
2. **Verify Ownership:** Via DNS TXT record or HTML file upload
3. **Submit Sitemap:** https://gigproof.online/sitemap.xml
4. **Link Google Analytics** (if using)

### For Each New Article
1. **Request Indexing** via URL Inspection tool
2. **Check Coverage** after 48 hours
3. **Monitor Enhancements** for schema validation
4. **Track Queries** that bring traffic

### Monthly Reviews
- Check "Performance" for top queries
- Identify pages losing traffic
- Find new keyword opportunities
- Fix any crawl errors immediately

---

## Bing Webmaster Tools Setup

### Why Bother?
- Bing feeds DuckDuckGo, Yahoo, Ecosia
- Different algorithm = different ranking opportunities
- Less competitive than Google

### Setup Steps
1. Add site: https://gigproof.online
2. Verify ownership
3. Submit sitemap
4. Enable IndexNow (instant indexing)

---

## Adding New Blog Articles

### Pre-Writing Checklist
- [ ] Keyword research done (check search volume)
- [ ] Competitor articles reviewed (what are they missing?)
- [ ] Target word count determined (minimum 2,500 words)
- [ ] Outline created with H2 headers as questions
- [ ] Examples/statistics gathered
- [ ] External authority links identified

### During Writing
- [ ] Start with TL;DR summary
- [ ] Answer question directly in first paragraph
- [ ] Add comparison table
- [ ] Add FAQ section with 5+ questions
- [ ] Add action plan/checklist at end
- [ ] Include 3+ internal links to related articles
- [ ] Include 2+ external authority links
- [ ] Add "Pro tip" callout boxes
- [ ] Include specific numbers/statistics

### After Writing (CRITICAL - Don't Skip)
- [ ] Add all 6 schema blocks
- [ ] Validate schemas (zero errors)
- [ ] Test meta description length
- [ ] Check all links work
- [ ] Read aloud for flow
- [ ] **Add to sitemap.xml** (REQUIRED - Google won't find it otherwise)
- [ ] **Add to llms.txt with full summary** (REQUIRED - AI tools won't cite it otherwise)
- [ ] Submit to Google Search Console for indexing
- [ ] Submit to Bing Webmaster Tools

**CRITICAL: If article is not in sitemap.xml and llms.txt, it doesn't exist to search engines and AI tools.**

---

## Recommended Future Articles (Prioritized)

### High Priority (High Search Volume)
1. **Turo Host Income Verification Guide**
   - Target: "turo host proof of income"
   - Estimated volume: 2,400/month

2. **TaskRabbit Tasker Proof of Income**
   - Target: "taskrabbit proof of income"
   - Estimated volume: 1,800/month

3. **Amazon Flex Driver Income Documentation**
   - Target: "amazon flex proof of income"
   - Estimated volume: 3,100/month

4. **Shipt Shopper Income Statements**
   - Target: "shipt shopper income verification"
   - Estimated volume: 1,200/month

### Geographic Expansion (Next Cities)
1. ~~**Los Angeles**~~ ✅ COMPLETE (10 articles + hub page)
2. ~~**New York City**~~ ✅ COMPLETE (10 articles + hub page)
3. **Chicago DoorDash Driver Apartments** (9M metro, major market)
4. **Phoenix Gig Worker Apartments** (5M metro, growing market)
5. **Houston Gig Worker Apartments** (7M metro, affordable market)

**When adding a new city:**
1. Create 10 articles following the template pattern
2. Create city hub page at `/blog/[city-name]/index.html`
3. Add hub page to sitemap.xml (priority 0.9, weekly changefreq)
4. Add hub page to llms.txt under "City Hub Pages" section
5. Update main `/blog/index.html` to include new city card

### Use Case Expansion
1. **Gig Worker Mortgage Pre-Approval Guide**
   - Target: "self-employed mortgage approval"
   - Estimated volume: 8,100/month

2. **Self-Employed Credit Card Applications**
   - Target: "self-employed credit card approval"
   - Estimated volume: 4,400/month

3. **Gig Worker Child Support Documentation**
   - Target: "self-employed child support income"
   - Estimated volume: 1,900/month

4. **Freelancer Visa/Immigration Income Proof**
   - Target: "self-employed visa income proof"
   - Estimated volume: 2,700/month

---

## Monthly SEO Maintenance Tasks

### Week 1: Performance Review
- [ ] Check Google Search Console "Performance" tab
- [ ] Identify top 10 queries bringing traffic
- [ ] Find queries ranking #11-20 (opportunity to improve)
- [ ] Check for any crawl errors or coverage issues
- [ ] Review Core Web Vitals scores

### Week 2: Content Updates
- [ ] Update statistics in articles (if new data available)
- [ ] Refresh "Last updated" dates on changed articles
- [ ] Add new trending search terms to relevant articles
- [ ] Review competitor content for new angles
- [ ] Plan new article based on keyword gaps

### Week 3: Link Building
- [ ] Check backlink profile (Ahrefs/SEMrush free tier)
- [ ] Reach out to 5 relevant sites for backlinks
- [ ] Post to relevant Reddit threads (value-first, not spammy)
- [ ] Share articles in gig worker Facebook groups
- [ ] Update internal links if new articles added

### Week 4: Technical & AI Optimization
- [ ] Test 3 articles in ChatGPT (are we cited?)
- [ ] Test same queries in Perplexity
- [ ] Note what competitors say if GigProof not cited
- [ ] Update llms.txt if any changes to site
- [ ] Validate schemas in Search Console "Enhancements"
- [ ] Run PageSpeed Insights on 3 random articles

---

## AI Search Testing Protocol

### Monthly AI Citation Tests

**Test in ChatGPT:**
1. "How do Uber drivers prove income for apartments?"
2. "What documents do gig workers need for rental applications?"
3. "Best way to show DoorDash income to landlords?"

**Test in Perplexity:**
1. Same 3 queries as above
2. Note: Does Perplexity cite GigProof?
3. If yes: Which article? What context?
4. If no: Who do they cite instead? What do those sites have that we don't?

**Test in Claude (this AI):**
1. Ask same 3 queries in fresh conversation
2. Does Claude mention GigProof?
3. Does Claude recommend our tool?

**Document Results:**
- Create spreadsheet: Date | Query | ChatGPT Result | Perplexity Result | Claude Result
- Track month-over-month improvements
- Adjust content based on what AI models prefer

---

## Internal Linking Strategy

### Link From Every Article To:
- GigProof homepage (1x per article)
- Pricing page (in CTA sections)
- 3-4 related blog articles
- Sample PDF (when relevant)

### Blog Interlinking Pattern

**Income Verification Articles Link To:**
- Other platform guides (Uber ↔ DoorDash ↔ Lyft)
- Use case guides (apartments ↔ car loans ↔ mortgages)
- Multi-app income guide

**Use Case Articles Link To:**
- Platform-specific guides
- Main income verification guide
- Geographic guides (if relevant)

**Geographic Articles Link To:**
- Main apartment guide
- Platform guides relevant to that city
- Other geographic guides

### Adding Internal Links
- Use descriptive anchor text ("complete guide to DoorDash income verification")
- Link naturally within content, not forced
- Update older articles when new related content is published

---

## Quick Reference Links

### Validation Tools
- **Schema Validator:** https://validator.schema.org/
- **Rich Results Test:** https://search.google.com/test/rich-results
- **PageSpeed Insights:** https://pagespeed.web.dev/
- **Mobile-Friendly Test:** https://search.google.com/test/mobile-friendly

### Search Consoles
- **Google Search Console:** https://search.google.com/search-console
- **Bing Webmaster:** https://www.bing.com/webmasters

### SEO Tools (Free Tiers)
- **Ahrefs Webmaster Tools:** https://ahrefs.com/webmaster-tools (free)
- **SEMrush:** https://www.semrush.com/ (limited free)
- **Ubersuggest:** https://neilpatel.com/ubersuggest/ (3 free searches/day)

### Backlink Opportunities
- **HARO:** https://www.helpareporter.com/
- **Reddit:** r/uberdrivers, r/doordash, r/InstacartShoppers, r/lyftdrivers
- **Quora:** Answer questions about gig worker income verification

---

## Promotional Content Guidelines

### The 95/5 Rule (CRITICAL)

**Every article must follow this balance:**
- **95% of article** = Genuinely helpful, actionable content they can use WITHOUT GigProof
- **5% of article** = GigProof promotion positioned as "the easier/faster way"

**Why this matters:**
- Google penalizes thin promotional content
- AI tools (ChatGPT, Perplexity) ignore obvious sales pitches
- Users trust helpful content, not ads
- Reddit/forums will call out spammy articles
- High-quality content = better rankings = more conversions

### Where to Promote GigProof (Strategic Placement)

**Early in article (1 CTA only):**
- [ ] First CTA box after problem statement (around 300-500 words in)
- [ ] Positioned as "quick solution" for readers in a hurry
- [ ] Example: After explaining the rental application problem, offer fast solution

**Middle of article (2-3 CTAs):**
- [ ] In comparison tables (Manual method vs GigProof method)
- [ ] As "Method 3" or final option in step-by-step guides
- [ ] In "Pro tip" callout boxes showing time savings
- [ ] When discussing multiple platform income (highlight merge feature)

**End of article (1 major CTA):**
- [ ] Final "footer CTA" with complete benefits list
- [ ] Positioned AFTER they've consumed all helpful content
- [ ] Includes all key differentiators (security, speed, platforms)

**Total CTAs per article: 4-6 maximum** (more than this feels spammy)

### How to Write Promotional CTAs (Non-Salesy Approach)

#### Bad Examples (Too Pushy - DON'T USE)

❌ **Overselling:**
> "GigProof is the ONLY solution that works for gig workers! Download now or miss out!"

❌ **False urgency:**
> "Limited time offer! Get GigProof before landlords stop accepting other documents!"

❌ **False claims:**
> "Landlords prefer GigProof PDFs over bank statements and tax returns!"

❌ **Aggressive language:**
> "Stop wasting time with manual methods! GigProof is 100x better!"

#### Good Examples (Helpful Positioning - USE THESE)

✅ **Time savings focus:**
> "Most gig workers spend 30-60 minutes manually formatting screenshots. GigProof generates the same professional PDF in under 2 minutes. Try it free (3 credits, no card required) →"

✅ **Honest positioning:**
> "GigProof PDFs work best when combined with tax returns and bank statements. The professional format increases approval odds compared to phone screenshots, but doesn't replace official tax documents."

✅ **Problem/solution format:**
> "Don't let messy screenshots cost you the perfect apartment. Turn your Uber dashboard into a clean, professional PDF that landlords actually trust. Free trial →"

✅ **Comparison approach:**
> "You can manually format your income (30+ minutes) or let GigProof do it automatically (under 2 minutes). Both methods work—GigProof is just faster."

### Required Elements in Every CTA

Include at least 3 of these 5 elements in each CTA:

1. **Time savings comparison:**
   - "Under 2 minutes vs 30-60 minutes manually"
   - "60-second PDF generation"
   - "Fastest way to create professional documentation"

2. **No-risk trial offer:**
   - "3 free credits, no credit card required"
   - "Try it free before you pay"
   - "Risk-free trial"

3. **Security differentiator:**
   - "100% local processing—data never leaves your device"
   - "No bank login required"
   - "Never share your passwords"

4. **Multiple platform support:**
   - "Works for Uber, DoorDash, Lyft, Instacart, and 6 more platforms"
   - "Combine income from all your gig apps"
   - "Supports 10+ gig platforms"

5. **Clear call-to-action link:**
   - "Try GigProof Free →"
   - "Start Your Free Trial →"
   - "Generate Your PDF Now →"

### Comparison Tables (Best Promotional Tool)

**Every article should have 1-2 comparison tables showing:**

| Feature | Manual Method | GigProof |
|---------|---------------|----------|
| Time required | 30-60 minutes | Under 2 minutes |
| Professional format | Inconsistent | Always professional |
| Multiple platforms | Tedious to combine | Easy (free merge tool) |
| Bank login required | No | No |
| Data privacy | Manual = safe | 100% local processing |
| Cost | Free | $2.99 after 3 free credits |

**Why tables work:**
- Factual comparison, not sales pitch
- Shows honest pros/cons
- User makes informed decision
- Google/AI tools see it as helpful content

### What NOT to Do (Avoid These Mistakes)

#### Content Mistakes
- ❌ Making GigProof the ONLY solution presented
- ❌ Hiding or downplaying free/manual methods
- ❌ Claiming landlords "require" GigProof PDFs specifically
- ❌ Saying GigProof is "verified" or "official" (it's not—it's user-generated)
- ❌ Implying GigProof replaces tax returns or bank statements

#### Frequency Mistakes
- ❌ Putting CTAs every 2-3 paragraphs (too spammy)
- ❌ Multiple CTAs in a row without helpful content between them
- ❌ Starting article with immediate sales pitch before explaining problem
- ❌ More than 6 CTAs total in one article

#### Language Mistakes
- ❌ Using aggressive sales language ("Act now!", "Don't miss out!", "Limited time!")
- ❌ Making false claims about acceptance rates or landlord preferences
- ❌ Comparing GigProof to competitors by name (stay classy)
- ❌ Exaggerating statistics ("10x faster!" when it's actually 15x)

#### Positioning Mistakes
- ❌ Claiming GigProof is the "best" solution (subjective)
- ❌ Saying manual methods "don't work" (they do, they're just slower)
- ❌ Implying other income verification tools are insecure (focus on our security, not their flaws)
- ❌ Using fear-based marketing ("You'll lose the apartment without GigProof!")

### Honest Disclaimers to Include

**In articles, always mention:**

1. **GigProof PDFs are user-generated:**
   > "GigProof creates professional income summaries from your dashboard data. The PDF includes a disclaimer that it's user-generated for informational purposes."

2. **Combine with other documents:**
   > "For best results, combine your GigProof PDF with tax returns and bank statements. Landlords want to see multiple verification documents."

3. **Not a replacement for tax docs:**
   > "GigProof doesn't replace your 1099 forms or tax returns—it supplements them by showing your current earnings in a professional format."

4. **Pricing transparency:**
   > "GigProof offers 3 free PDF credits when you sign up (no credit card required). After that, it's $2.99 per PDF or $19.99 for 10 PDFs."

### Testing Promotional Balance

#### Good Signs (Keep doing what you're doing)
- ✅ Article ranks in Google top 10 for target keywords
- ✅ Gets cited by ChatGPT/Perplexity when asked relevant questions
- ✅ Shared on Reddit/forums without being called spam
- ✅ Low bounce rate (<60%) in Google Analytics
- ✅ Good time on page (3+ minutes average)
- ✅ Decent conversion rate (blog visit → GigProof signup)

#### Warning Signs (Reduce promotional content)
- ⚠️ Not ranking despite good content and proper schema
- ⚠️ AI tools consistently skip your content
- ⚠️ Called "spam" or "ad" on forums
- ⚠️ High bounce rate (>70%)
- ⚠️ Low time on page (<1 minute)
- ⚠️ Comments like "just trying to sell something"

**If you see 2+ warning signs:** Reduce promotional content from 5% to 3% and re-test after 2 weeks.

### CTA Positioning Examples (From Actual Articles)

#### Example 1: Early CTA (After Problem Statement)
```
You're an Uber driver clearing $1,500 a week... Then the property manager asks for pay stubs.

You don't have any. [Problem fully explained in 3-4 paragraphs]

[CTA BOX]
🚀 Need a professional income PDF right now?
Turn your Uber or DoorDash dashboard into a clean PDF in 60 seconds.
3 free credits, no bank login required.
[Try GigProof Free →]
```

#### Example 2: Mid-Article Comparison
```
Here's where most gig workers waste time: manually compiling screenshots, editing bank statements, or waiting days for CPA letters.

There's a faster way.

[COMPARISON TABLE: Manual vs GigProof]

💡 Pro tip: Landlords respond better to professional-looking documents. GigProof formats your earnings the way landlords expect to see them—which dramatically improves your approval odds.
```

#### Example 3: Method Listing
```
How to Get Your Uber Driver Income Summary (3 Methods)

Method 1: Download Official Tax Documents from Uber
[Full explanation with pros/cons]

Method 2: Manually Format Bank Statements  
[Full explanation with pros/cons]

Method 3: Use GigProof (Fastest) ⭐
[Full explanation positioning as time-saving option, not only option]
```

#### Example 4: Footer CTA (After All Helpful Content)
```
[After user has read 2,500+ words of helpful content]

Stop Losing Apartments Because of Bad Paperwork

You work hard. Your income is real. Don't let unprofessional screenshots cost you the perfect apartment.

Here's what happens when you use GigProof:
✅ 2-minute PDF generation (vs 30-60 min manual)
✅ Professional format landlords trust
✅ Combine multiple platforms
✅ 100% local processing
✅ No bank login required

[Try it risk-free: 3 free credits when you sign up]
```

### Monthly Promotional Content Audit

**Review one article per week:**
- [ ] Count total CTAs (should be 4-6)
- [ ] Verify 95/5 balance (95% helpful, 5% promotional)
- [ ] Check comparison tables are fair and factual
- [ ] Ensure disclaimers are present
- [ ] Test CTA links work correctly
- [ ] Verify no aggressive sales language
- [ ] Confirm manual methods are explained fully

**If article fails audit:** Reduce promotional content and re-publish.

---

## Current Article URLs

### National Platform-Specific Guides
1. `/blog/uber-doordash-proof-income-apartments.html` - Main Uber/DoorDash guide
2. `/blog/lyft-driver-proof-income.html` - Lyft driver income
3. `/blog/instacart-shopper-proof-income.html` - Instacart shopper income
4. `/blog/doordash-income-statement-guide.html` - DoorDash specific
5. `/blog/uber-driver-tax-documents-1099.html` - Uber tax docs

### National Use Case Guides
6. `/blog/gig-worker-income-verification-guide.html` - Master guide
7. `/blog/what-documents-landlords-accept-self-employed.html` - Landlord docs
8. `/blog/how-to-rent-apartment-without-pay-stubs.html` - No pay stubs
9. `/blog/gig-worker-car-loan-approval.html` - Car loans
10. `/blog/multi-app-income-proof-guide.html` - Multiple platforms

### City Hub Pages
- `/blog/miami/` - Miami hub (links to all 11 Miami articles)
- `/blog/los-angeles/` - Los Angeles hub (links to all 10 LA articles)
- `/blog/new-york/` - New York City hub (links to all 10 NYC articles)

### Miami Articles (11 total)
1. `/blog/miami-uber-driver-apartments.html` - Main Miami guide
2. `/blog/miami-doordash-driver-apartments.html` - DoorDash specific
3. `/blog/miami-lyft-driver-housing.html` - Lyft specific
4. `/blog/miami-instacart-shopper-apartments.html` - Instacart specific
5. `/blog/miami-beach-gig-worker-apartments.html` - Miami Beach neighborhood
6. `/blog/downtown-miami-uber-driver-housing.html` - Downtown/Brickell neighborhood
7. `/blog/hialeah-doordash-driver-apartments.html` - Hialeah neighborhood
8. `/blog/coral-gables-rideshare-driver-rentals.html` - Coral Gables neighborhood
9. `/blog/miami-gig-worker-car-loans.html` - Car loans use case
10. `/blog/miami-uber-driver-income-verification.html` - Income verification use case
11. `/blog/miami-gig-economy-statistics-2026.html` - Market statistics

### Los Angeles Articles (10 total)
1. `/blog/la-doordash-driver-apartments.html` - DoorDash specific
2. `/blog/la-lyft-driver-housing.html` - Lyft specific
3. `/blog/la-instacart-shopper-apartments.html` - Instacart specific
4. `/blog/santa-monica-gig-worker-apartments.html` - Santa Monica neighborhood
5. `/blog/downtown-la-uber-driver-housing.html` - Downtown LA neighborhood
6. `/blog/west-hollywood-rideshare-driver-rentals.html` - West Hollywood neighborhood
7. `/blog/venice-beach-doordash-driver-apartments.html` - Venice Beach neighborhood
8. `/blog/la-gig-worker-car-loans.html` - Car loans use case
9. `/blog/la-uber-driver-income-verification.html` - Income verification use case
10. `/blog/la-gig-economy-statistics-2026.html` - Market statistics

### New York City Articles (10 total)
1. `/blog/nyc-doordash-driver-apartments.html` - DoorDash specific
2. `/blog/nyc-lyft-driver-housing.html` - Lyft specific
3. `/blog/nyc-instacart-shopper-apartments.html` - Instacart specific
4. `/blog/manhattan-gig-worker-apartments.html` - Manhattan borough
5. `/blog/brooklyn-uber-driver-housing.html` - Brooklyn borough
6. `/blog/queens-rideshare-driver-rentals.html` - Queens borough
7. `/blog/bronx-doordash-driver-apartments.html` - Bronx borough
8. `/blog/nyc-gig-worker-car-loans.html` - Car loans use case
9. `/blog/nyc-uber-driver-income-verification.html` - Income verification use case
10. `/blog/nyc-gig-economy-statistics-2026.html` - Market statistics

---

## llms.txt Maintenance

### CRITICAL: Update llms.txt for EVERY New Article

**llms.txt is how AI tools (ChatGPT, Perplexity, Claude) discover your content. If an article isn't in llms.txt, AI tools won't cite it.**

### When to Update llms.txt

**Add new entry when:**
- Publishing ANY new blog article (REQUIRED)
- Adding new product feature
- Creating new landing page
- Launching in new market/location

**Update existing entry when:**
- Article content significantly changed
- New statistics added to article
- Title or meta description changed
- Article URL changed (with redirect)

### How to Add Article to llms.txt

**Format for blog articles:**

```markdown
- https://gigproof.online/blog/[ARTICLE-FILENAME].html
  **Title:** [Full Article Title with Year]
  **Summary:** [2-3 sentence summary covering: what problem it solves, who it's for, key topics covered]
  **Key Topics:** [comma-separated list of main keywords and concepts]
  **Target Audience:** [who this article helps - be specific]
```

**Example - Platform Article:**

```markdown
- https://gigproof.online/blog/miami-doordash-driver-apartments.html
  **Title:** Miami DoorDash Driver Apartment Guide (2026)
  **Summary:** Complete guide for DoorDash drivers seeking apartments in Miami, FL. Covers what documents Miami landlords accept (tax returns, bank statements, professional PDFs), average earnings for Miami dashers ($18-25/hr), and best neighborhoods for affordability vs commute. Includes specific apartment complexes and income verification strategies.
  **Key Topics:** Miami DoorDash income, Miami apartments, rental applications, income verification, 1099-NEC forms, bank statements, professional income documentation, Miami neighborhoods
  **Target Audience:** DoorDash delivery drivers in Miami seeking rental housing
```

**Example - Neighborhood Article:**

```markdown
- https://gigproof.online/blog/miami-beach-gig-worker-apartments.html
  **Title:** Miami Beach Apartments for Gig Workers (2026 Guide)
  **Summary:** Neighborhood-specific apartment guide for Uber/DoorDash/Lyft drivers in Miami Beach. Covers average rents ($2,800/month), landlord requirements, proximity to high-demand areas, and which apartment complexes accept gig worker income. Includes ZIP codes 33139, 33140, 33141.
  **Key Topics:** Miami Beach apartments, gig worker housing, tourist area income verification, Miami Beach rent prices, rideshare driver housing, beachfront apartments
  **Target Audience:** Gig workers (Uber, DoorDash, Lyft) looking for apartments specifically in Miami Beach area
```

### Common Questions Section in llms.txt

**After listing all articles, maintain an updated FAQ section:**

Every time you add articles about new topics, add relevant Q&As to the common questions section. AI tools use this heavily.

**Example - Adding Miami Content:**

When you add 10 Miami articles, also add these FAQs to llms.txt:

```markdown
**Q: Can Uber drivers get apartments in Miami?**
A: Yes. Miami landlords accept gig worker income when properly documented with tax returns (1040 + Schedule C), 3-6 months of bank statements, and professional income PDFs. Average rent in Miami is $2,000-2,800/month for 1br, requiring $5,000-7,000/month in income.

**Q: What are the best Miami neighborhoods for DoorDash drivers?**
A: Hialeah offers affordable rent ($1,650/month) with high restaurant density. Miami Beach has high demand but expensive rent ($2,800/month). Downtown Miami (Brickell) is very expensive ($3,200/month) but has consistent business district demand.

**Q: How much do Miami gig workers earn?**
A: Uber/Lyft drivers in Miami earn $18-25/hour on average. DoorDash drivers earn similar. Peak earnings are in tourist areas (South Beach, Brickell) during evening hours and weekends.
```

### llms.txt Best Practices

1. **Keep summaries concise** (2-3 sentences max per article)
2. **Include target keywords** in descriptions (helps AI matching)
3. **Be specific about audience** ("Miami DoorDash drivers" not "gig workers")
4. **Update "Last updated" date** at bottom of llms.txt file
5. **Test in ChatGPT after updates** - Ask "How do Miami Uber drivers get apartments?" and see if your content is found

**CRITICAL: Claude Code should update llms.txt automatically when creating new articles. Check that it did.**

---

## sitemap.xml Maintenance

### CRITICAL: Update sitemap.xml for EVERY New Article

**sitemap.xml tells Google which pages exist on your site. If an article isn't in sitemap.xml, Google may never find it.**

### Sitemap Format

**For each blog article, add:**

```xml
<url>
  <loc>https://gigproof.online/blog/[ARTICLE-FILENAME].html</loc>
  <lastmod>[YYYY-MM-DD]</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

**Example:**

```xml
<url>
  <loc>https://gigproof.online/blog/miami-doordash-driver-apartments.html</loc>
  <lastmod>2026-02-01</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

### Priority Guidelines

**Use these priority values:**
- Homepage: `1.0`
- Main product pages (pricing, features): `0.9`
- Blog articles: `0.8` (all articles same priority)
- Secondary pages (privacy, terms): `0.5`

**Don't overthink priority - Google mostly ignores it. Just be consistent.**

### Change Frequency

**For blog articles:**
- New articles (< 3 months old): `<changefreq>monthly</changefreq>`
- Older articles (> 3 months): `<changefreq>yearly</changefreq>`

**Update changefreq when you update article content.**

### After Adding to Sitemap

1. **Validate sitemap:**
   - Go to: https://www.xml-sitemaps.com/validate-xml-sitemap.html
   - Paste your sitemap URL
   - Fix any errors

2. **Submit to Google Search Console:**
   - Go to Sitemaps section
   - Click "Add a new sitemap"
   - Enter: `sitemap.xml`
   - Click Submit

3. **Submit to Bing Webmaster Tools:**
   - Same process as Google

**Google will re-crawl sitemap automatically, but manual submission speeds it up.**

### Automation Reminder for Claude Code

**When Claude Code creates new articles, it MUST:**
1. ✅ Add article to sitemap.xml with current date
2. ✅ Add article to llms.txt with full summary
3. ✅ Validate both files (no XML errors, no broken formatting)
4. ✅ Confirm both updates in output

**If Claude Code forgets either step, the article is effectively invisible to search engines and AI tools.**

---

## Common Mistakes to Avoid

### Content Mistakes
- ❌ Writing generic fluff without specific details
- ❌ Not answering the question in first paragraph
- ❌ Using vague language ("many landlords" vs "90% of landlords")
- ❌ No comparison tables or visual elements
- ❌ Missing FAQ section
- ❌ No action plan at end

### Schema Mistakes
- ❌ Only 2-3 schema blocks (need 6)
- ❌ FAQ schema has only 3 questions (need 5+)
- ❌ Schema doesn't match actual content
- ❌ Copy-pasting schemas without updating content
- ❌ Not validating schemas before publishing
- ❌ Missing BreadcrumbList schema

### SEO Mistakes
- ❌ No external authority links
- ❌ No internal links to related articles
- ❌ Meta description too short or too long
- ❌ Not submitting to Search Console after publishing
- ❌ Forgetting to update sitemap.xml
- ❌ Not adding to llms.txt

### AI Optimization Mistakes
- ❌ Burying the answer deep in article
- ❌ No clear section headers
- ❌ Not using specific entity names
- ❌ Missing statistics and numbers
- ❌ No step-by-step instructions
- ❌ Not testing in AI tools after publishing

---

## Emergency Troubleshooting

### Article Not Showing in Google After 7 Days
1. Check Google Search Console → Coverage
2. Look for crawl errors or index exclusions
3. Request indexing manually
4. Check robots.txt isn't blocking
5. Verify canonical URL is correct
6. Check for duplicate content issues

### Schema Errors in Search Console
1. Go to Enhancements → See specific error
2. Fix in article HTML
3. Test at https://validator.schema.org/
4. Request re-crawl in Search Console
5. Wait 48 hours for update

### AI Tools Not Citing GigProof
1. Test query in ChatGPT and Perplexity
2. See what they cite instead
3. Read competitor articles - what do they have?
4. Update our content with missing elements
5. Update llms.txt with clearer context
6. Re-test after 2 weeks

### Traffic Suddenly Drops
1. Check Google Search Console for algorithm update
2. Check for technical errors (site down, robots.txt issue)
3. Review competitor content - did they publish better article?
4. Check backlinks - did we lose important links?
5. Update content with fresher info
6. Request re-indexing

---

## Success Metrics to Track

### Weekly Metrics
- Google Search Console impressions
- Click-through rate (CTR)
- Average position for target keywords
- Pages with errors/warnings

### Monthly Metrics
- Total organic traffic to blog
- Top 10 performing articles
- Conversion rate (blog → GigProof signup)
- Backlinks gained/lost
- AI citation rate (manual testing)

### Quarterly Metrics
- Revenue attributed to blog traffic
- Keyword rankings improvement
- Domain authority (Ahrefs/Moz)
- Geographic expansion success

---

*Last updated: February 2026*

**Remember: Schema markup is NOT optional. If it's missing, the article is NOT complete.**
