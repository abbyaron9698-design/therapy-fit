// app/support/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { SupportResourceCard } from "../components/SupportResourceCard";
import { haversineMiles, type LatLng } from "../../lib/geo";

type Resource = Parameters<typeof SupportResourceCard>[0]["r"];

type Scope = "Chicago" | "Illinois" | "National";
type FilterKey = "online" | "free" | "lowCost" | "confidential" | "inPerson";

type ResourcePlus = Resource & {
  scope: Scope;
  flags?: Partial<Record<FilterKey, boolean>>;
  lat?: number;
  lng?: number;
};

function normalizeZip(z: string) {
  return (z ?? "").replace(/[^\d]/g, "").slice(0, 5);
}

function norm(s: string) {
  return (s ?? "").toLowerCase().trim();
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition",
        active
          ? "bg-slate-900 text-white border-slate-900"
          : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

/**
 * SECTION SHELL
 * Fixes the “unclear gap” by rendering opened resources inside a connected panel
 * that visually belongs to the header.
 */
function SectionShell({
  id,
  title,
  subtitle,
  count,
  open,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  count: number;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const wrappedChildren = React.Children.map(children, (child, idx) => (
    <div key={(child as any)?.key ?? idx} className="mb-3 break-inside-avoid">
      {child}
    </div>
  ));

  return (
    <section id={id} className="mt-10 scroll-mt-24">
      <button
        type="button"
        onClick={onToggle}
        className={[
          "w-full border border-slate-200 bg-white px-5 py-4 text-left shadow-sm transition",
          open ? "rounded-t-2xl border-b-0" : "rounded-2xl hover:bg-slate-50",
        ].join(" ")}
        aria-expanded={open}
        aria-controls={`${id}-panel`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                {count}
              </span>
            </div>
            {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}
          </div>

          <span
            className={[
              "shrink-0 rounded-full border px-2 py-1 text-[11px] font-semibold",
              open
                ? "border-slate-300 bg-white text-slate-900"
                : "border-slate-200 bg-slate-50 text-slate-700",
            ].join(" ")}
          >
            {open ? "Hide" : "Show"}
          </span>
        </div>
      </button>

      {open ? (
        <div
          id={`${id}-panel`}
          className="rounded-b-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
        >
          {/* “Masonry” columns for density; cards are compact so lanes are much less noticeable */}
          <div className="columns-1 md:columns-2 gap-4 [column-fill:balance]">
            {wrappedChildren}
          </div>
        </div>
      ) : null}
    </section>
  );
}

/* =========================
   RESOURCES (Expanded)
   National-first + IL/Chicago anchors preserved
   ========================= */

const BASIC_NEEDS: ResourcePlus[] = [
  {
    name: "211 (United Way)",
    description:
      "Confidential help finding local resources for food, housing, utilities, healthcare, and more.",
    coverage: "United States",
    availability: "24/7",
    contacts: [
      { type: "call", href: "tel:211", label: "Call 211" },
      { type: "web", href: "https://www.211.org/", label: "Website" },
    ],
    chips: [{ label: "Navigation help" }, { label: "National directory" }],
    scope: "National",
    flags: { free: true, confidential: true, online: true },
  },
  {
    name: "FindHelp",
    description:
      "Search free and reduced-cost services by ZIP (food, housing, health, work, and more).",
    coverage: "United States",
    availability: "Online",
    contacts: [{ type: "web", href: "https://www.findhelp.org/", label: "Search by ZIP" }],
    chips: [{ label: "Directory" }, { label: "ZIP search" }],
    scope: "National",
    flags: { online: true, lowCost: true },
  },
  {
    name: "Feeding America — Find Your Local Food Bank",
    description: "National directory of food banks and meal programs across the U.S.",
    coverage: "United States",
    availability: "Online",
    contacts: [
      { type: "web", href: "https://www.feedingamerica.org/find-your-local-foodbank", label: "Find food bank" },
    ],
    chips: [{ label: "Food access" }, { label: "Directory" }],
    scope: "National",
    flags: { free: true, online: true },
  },
  {
    name: "Benefits.gov",
    description: "Explore federal and state benefit programs (official portal).",
    coverage: "United States",
    availability: "Online",
    contacts: [{ type: "web", href: "https://www.benefits.gov/", label: "Website" }],
    chips: [{ label: "Benefits" }, { label: "Official portal" }],
    scope: "National",
    flags: { online: true },
  },
  {
    name: "SNAP (USDA) — State Directory",
    description: "Find your state SNAP agency and how to apply.",
    coverage: "United States",
    availability: "Online",
    contacts: [{ type: "web", href: "https://www.fns.usda.gov/snap/state-directory", label: "State directory" }],
    chips: [{ label: "Food benefits" }, { label: "Directory" }],
    scope: "National",
    flags: { online: true },
  },
  {
    name: "WIC (USDA) — Program Finder",
    description: "Find WIC eligibility info and your state program.",
    coverage: "United States",
    availability: "Online",
    contacts: [{ type: "web", href: "https://www.fns.usda.gov/wic", label: "WIC info" }],
    chips: [{ label: "Families" }, { label: "Nutrition support" }],
    scope: "National",
    flags: { online: true },
  },
  // Illinois anchors
  {
    name: "Find Food IL (Illinois Extension)",
    description: "Statewide map of free food, meal sites, SNAP/LINK & WIC stores, and nearby DHS offices.",
    coverage: "Illinois",
    availability: "Online",
    contacts: [
      { type: "web", href: "https://extension.illinois.edu/food/find-food-illinois", label: "Find Food IL map" },
    ],
    chips: [{ label: "Food access" }, { label: "Illinois" }, { label: "Map / locator" }],
    safetyNote: "Listings and hours can change—call ahead when possible to confirm.",
    scope: "Illinois",
    flags: { free: true, online: true },
  },
  {
    name: "Eat. Move. Save. (Illinois Extension)",
    description: "Practical nutrition + budgeting tools to stretch groceries and support health.",
    coverage: "Illinois",
    availability: "Online",
    contacts: [{ type: "web", href: "https://eat-move-save.extension.illinois.edu/", label: "Website" }],
    chips: [{ label: "Food support" }, { label: "Education" }, { label: "Illinois" }],
    scope: "Illinois",
    flags: { online: true, free: true },
  },
  {
    name: "Illinois DHS — Food Connections",
    description: "Illinois DHS page linking to food pantry locators and food bank partners.",
    coverage: "Illinois",
    availability: "Online",
    contacts: [{ type: "web", href: "https://www.dhs.state.il.us/page.aspx?item=31245", label: "Food Connections" }],
    chips: [{ label: "Illinois" }, { label: "Start here" }, { label: "Food support" }],
    scope: "Illinois",
    flags: { online: true },
  },
  {
    name: "Feeding Illinois — Find Food Map",
    description: "Search for food pantries and free food programs across Illinois (filters available).",
    coverage: "Illinois",
    availability: "Online",
    contacts: [{ type: "web", href: "https://www.feedingillinois.org/food-resources-illinois", label: "Find Food map" }],
    chips: [{ label: "Illinois" }, { label: "Map / locator" }, { label: "Food support" }],
    scope: "Illinois",
    flags: { free: true, online: true },
  },
  // Chicago anchor
  {
    name: "Chicago Food Assistance (City of Chicago)",
    description: "Food pantries and programs across Chicago (neighborhood availability varies).",
    coverage: "Chicago",
    availability: "Varies",
    contacts: [
      { type: "web", href: "https://www.chicago.gov/city/en/depts/fss/provdrs/food.html", label: "Website" },
    ],
    chips: [{ label: "Chicago" }, { label: "Food support" }],
    scope: "Chicago",
    flags: { online: true, inPerson: true, lowCost: true },
    lat: 41.8781,
    lng: -87.6298,
  },
];

const HOUSING: ResourcePlus[] = [
  {
    name: "HUD — Find Housing Counseling",
    description: "Find a HUD-approved housing counseling agency (renting, budgeting, foreclosure prevention).",
    coverage: "United States",
    availability: "Online",
    contacts: [{ type: "web", href: "https://hud.gov/findacounselor", label: "Find counseling" }],
    chips: [{ label: "Housing stability" }, { label: "Directory" }],
    scope: "National",
    flags: { online: true, lowCost: true },
  },
  {
    name: "National Low Income Housing Coalition",
    description: "Renter resources, policy info, and emergency rental assistance guidance.",
    coverage: "United States",
    availability: "Online",
    contacts: [{ type: "web", href: "https://nlihc.org/", label: "Website" }],
    chips: [{ label: "Education" }, { label: "Housing stability" }],
    scope: "National",
    flags: { online: true },
  },
  {
    name: "Eviction Lab — Eviction Resources",
    description: "Educational resources on eviction and housing instability (not legal advice).",
    coverage: "United States",
    availability: "Online",
    contacts: [{ type: "web", href: "https://evictionlab.org/", label: "Website" }],
    chips: [{ label: "Education" }, { label: "Eviction" }],
    scope: "National",
    flags: { online: true },
  },
  {
    name: "LawHelp.org — Housing & Eviction",
    description: "Find your state’s legal help site and housing resources (not legal advice).",
    coverage: "United States",
    availability: "Online",
    contacts: [{ type: "web", href: "https://www.lawhelp.org/", label: "Find your state" }],
    chips: [{ label: "Directory" }, { label: "Tenant help" }],
    scope: "National",
    flags: { online: true, free: true },
  },
  // Illinois anchors
  {
    name: "Illinois Housing Development Authority (IHDA)",
    description: "Illinois housing programs and rental assistance information.",
    coverage: "Illinois",
    availability: "Online",
    contacts: [{ type: "web", href: "https://www.ihda.org/", label: "Website" }],
    chips: [{ label: "Illinois" }, { label: "Housing" }],
    scope: "Illinois",
    flags: { online: true },
  },
  {
    name: "Illinois Courts — Eviction Help",
    description: "Court-oriented eviction information and links (not legal advice).",
    coverage: "Illinois",
    availability: "Online",
    contacts: [{ type: "web", href: "https://www.illinoiscourts.gov/self-help/eviction/", label: "Start here" }],
    chips: [{ label: "Illinois" }, { label: "Eviction" }],
    scope: "Illinois",
    flags: { online: true },
  },
  {
    name: "Illinois Legal Aid Online — Housing",
    description: "Tenant rights education and self-help tools for Illinois residents.",
    coverage: "Illinois",
    availability: "Online",
    contacts: [{ type: "web", href: "https://www.illinoislegalaid.org/legal-information/housing", label: "Housing topics" }],
    chips: [{ label: "Illinois" }, { label: "Legal information" }],
    scope: "Illinois",
    flags: { online: true, free: true },
  },
  // Chicago anchors
  {
    name: "Chicago Rents Right",
    description: "Tenant rights education and resources for Chicago renters (not legal advice).",
    coverage: "Chicago",
    availability: "Online",
    contacts: [{ type: "web", href: "https://www.chicago.gov/city/en/depts/doh/provdrs/rents_right.html", label: "Website" }],
    chips: [{ label: "Chicago" }, { label: "Tenant rights" }],
    scope: "Chicago",
    flags: { online: true },
    lat: 41.8781,
    lng: -87.6298,
  },
  {
    name: "City of Chicago — Housing Resources",
    description: "Starting point for Chicago housing programs and guidance.",
    coverage: "Chicago",
    availability: "Online",
    contacts: [{ type: "web", href: "https://www.chicago.gov/city/en/depts/doh.html", label: "Website" }],
    chips: [{ label: "Chicago" }, { label: "Start here" }],
    scope: "Chicago",
    flags: { online: true },
    lat: 41.8781,
    lng: -87.6298,
  },
];

const LEGAL_SUPPORT: ResourcePlus[] = [
  {
    name: "Legal Aid Finder (LSC)",
    description: "Search for free civil legal aid programs by ZIP code.",
    coverage: "United States",
    availability: "Online",
    contacts: [{ type: "web", href: "https://www.lsc.gov/about-lsc/what-legal-aid/find-legal-aid", label: "Find legal aid" }],
    chips: [{ label: "Directory" }, { label: "Civil legal help" }],
    scope: "National",
    flags: { free: true, online: true },
  },
  {
    name: "ABA Free Legal Answers",
    description: "Ask a lawyer a question online (availability varies by state).",
    coverage: "United States",
    availability: "Online",
    contacts: [{ type: "web", href: "https://www.americanbar.org/groups/legal_services/flh-home/flh-free-legal-answers/", label: "Start here" }],
    chips: [{ label: "Online Q&A" }, { label: "Varies by state" }],
    scope: "National",
    flags: { online: true, lowCost: true },
  },
  {
    name: "National Consumer Law Center",
    description: "Education and resources related to consumer rights and debt (not legal advice).",
    coverage: "United States",
    availability: "Online",
    contacts: [{ type: "web", href: "https://www.nclc.org/", label: "Website" }],
    chips: [{ label: "Consumer rights" }, { label: "Education" }],
    scope: "National",
    flags: { online: true },
  },
  {
    name: "VictimConnect Resource Center",
    description: "Confidential referrals and information for crime victims (not an emergency line).",
    coverage: "United States",
    availability: "Varies",
    contacts: [{ type: "web", href: "https://victimconnect.org/", label: "Website" }],
    chips: [{ label: "Confidential" }, { label: "Referrals" }],
    scope: "National",
    flags: { confidential: true, online: true, free: true },
  },
  // Illinois anchors
  {
    name: "Illinois Legal Aid Online",
    description: "Legal information and referrals for Illinois residents (not legal advice).",
    coverage: "Illinois",
    availability: "Online",
    contacts: [{ type: "web", href: "https://www.illinoislegalaid.org/", label: "Website" }],
    chips: [{ label: "Illinois" }, { label: "Legal information" }],
    scope: "Illinois",
    flags: { online: true },
  },
  // Chicago anchors
  {
    name: "Legal Aid Chicago",
    description: "Free civil legal services for people living in poverty in Cook County (intake required).",
    coverage: "Cook County",
    availability: "Varies",
    contacts: [{ type: "web", href: "https://www.legalaidchicago.org/", label: "Website" }],
    chips: [{ label: "Cook County" }, { label: "Free" }],
    scope: "Chicago",
    flags: { free: true, online: true, lowCost: true },
    lat: 41.8781,
    lng: -87.6298,
  },
  {
    name: "CARPLS (Cook County legal aid)",
    description: "Legal aid for Cook County residents (eligibility and services vary).",
    coverage: "Chicago / Cook County",
    availability: "Hours vary",
    contacts: [{ type: "web", href: "https://carpls.org/", label: "Website" }],
    chips: [{ label: "Cook County" }, { label: "Legal help" }],
    scope: "Chicago",
    flags: { online: true, lowCost: true },
    lat: 41.8781,
    lng: -87.6298,
  },
];

const PEER_COMMUNITY: ResourcePlus[] = [
  {
    name: "NAMI — Support Groups",
    description: "Peer and family support groups for people affected by mental health conditions.",
    coverage: "United States",
    availability: "Varies",
    contacts: [{ type: "web", href: "https://www.nami.org/support-education/support-groups/", label: "Find groups" }],
    chips: [{ label: "Peer support" }, { label: "Directory" }],
    scope: "National",
    flags: { free: true, online: true, inPerson: true },
  },
  {
    name: "DBSA — Support Groups",
    description: "Peer-led groups for depression and bipolar disorder.",
    coverage: "United States",
    availability: "Varies",
    contacts: [{ type: "web", href: "https://www.dbsalliance.org/support/chapters-and-support-groups/find-a-support-group/", label: "Find a group" }],
    chips: [{ label: "Peer support" }, { label: "Mood disorders" }],
    scope: "National",
    flags: { free: true, online: true, inPerson: true },
  },
  {
    name: "Mental Health America — Tools & Screening",
    description: "Self-screening, education, and practical tools (not diagnosis).",
    coverage: "United States",
    availability: "Online",
    contacts: [{ type: "web", href: "https://mhanational.org/", label: "Website" }],
    chips: [{ label: "Education" }, { label: "Self-check tools" }],
    scope: "National",
    flags: { online: true, free: true },
  },
  {
    name: "7 Cups (peer listening)",
    description: "Anonymous peer listening and support (not therapy; policies vary).",
    coverage: "United States",
    availability: "Online",
    contacts: [{ type: "web", href: "https://www.7cups.com/", label: "Website" }],
    chips: [{ label: "Peer listening" }, { label: "Online" }],
    scope: "National",
    flags: { online: true, lowCost: true },
  },
  {
    name: "Hearing Voices Network (groups)",
    description: "Peer support groups for voice-hearers and unusual experiences.",
    coverage: "United States",
    availability: "Varies",
    contacts: [{ type: "web", href: "https://www.hearingvoicesusa.org/", label: "Website" }],
    chips: [{ label: "Peer support" }, { label: "Groups" }],
    scope: "National",
    flags: { online: true, inPerson: true },
  },
  // Chicago anchor
  {
    name: "NAMI Chicago",
    description: "Support groups and education for individuals and families affected by mental health conditions.",
    coverage: "Chicago",
    availability: "Varies",
    contacts: [{ type: "web", href: "https://www.namichicago.org/", label: "Website" }],
    chips: [{ label: "Chicago" }, { label: "Support groups" }],
    scope: "Chicago",
    flags: { online: true, free: true, inPerson: true },
    lat: 41.8781,
    lng: -87.6298,
  },
];

const DV_SA_PLANNING: ResourcePlus[] = [
  {
    name: "love is respect",
    description: "Relationship education, boundaries, and safety planning for young people.",
    coverage: "United States",
    availability: "Online",
    contacts: [{ type: "web", href: "https://www.loveisrespect.org/", label: "Website" }],
    chips: [{ label: "Safety planning" }, { label: "Education" }],
    scope: "National",
    flags: { online: true, free: true },
  },
  {
    name: "National Domestic Violence Hotline",
    description: "Safety planning and support options (see Crisis page for urgent use).",
    coverage: "United States",
    availability: "24/7",
    contacts: [{ type: "web", href: "https://www.thehotline.org/", label: "Website" }],
    chips: [{ label: "Safety planning" }, { label: "Confidential" }],
    safetyNote: "If you need urgent help right now, use the Crisis page.",
    scope: "National",
    flags: { confidential: true, online: true },
  },
  {
    name: "NSVRC (National Sexual Violence Resource Center)",
    description: "Education and resources on sexual violence prevention and support.",
    coverage: "United States",
    availability: "Online",
    contacts: [{ type: "web", href: "https://www.nsvrc.org/", label: "Website" }],
    chips: [{ label: "Education" }, { label: "Prevention" }],
    scope: "National",
    flags: { online: true },
  },
  {
    name: "VictimConnect Resource Center",
    description: "Confidential referrals and information for victims of crime (not an emergency line).",
    coverage: "United States",
    availability: "Varies",
    contacts: [{ type: "web", href: "https://victimconnect.org/", label: "Website" }],
    chips: [{ label: "Confidential" }, { label: "Referrals" }],
    scope: "National",
    flags: { confidential: true, online: true, free: true },
  },
  {
    name: "StrongHearts Native Helpline",
    description: "Support and resources for Native communities impacted by domestic or sexual violence.",
    coverage: "United States",
    availability: "Varies",
    contacts: [{ type: "web", href: "https://strongheartshelpline.org/", label: "Website" }],
    chips: [{ label: "Native communities" }, { label: "Support" }],
    scope: "National",
    flags: { online: true, confidential: true },
  },
  // Illinois anchor
  {
    name: "Illinois Domestic Violence Helpline",
    description: "Statewide support and referrals for domestic violence in Illinois.",
    coverage: "Illinois",
    availability: "24/7",
    contacts: [{ type: "call", href: "tel:18778636338", label: "Call 1-877-863-6338" }],
    chips: [{ label: "Illinois" }, { label: "Support" }],
    safetyNote: "If you need urgent help right now, use the Crisis page.",
    scope: "Illinois",
    flags: { confidential: true, free: true },
  },
];

const GRIEF: ResourcePlus[] = [
  {
    name: "The Compassionate Friends",
    description: "Peer support for families after the death of a child (chapters + groups).",
    coverage: "United States",
    availability: "Varies",
    contacts: [{ type: "web", href: "https://www.compassionatefriends.org/", label: "Website" }],
    chips: [{ label: "Peer support" }, { label: "Bereaved families" }],
    scope: "National",
    flags: { online: true, inPerson: true, free: true },
  },
  {
    name: "AFSP — Find a Support Group",
    description: "Support groups including suicide loss support (directory).",
    coverage: "United States",
    availability: "Varies",
    contacts: [{ type: "web", href: "https://afsp.org/find-a-support-group/", label: "Find groups" }],
    chips: [{ label: "Support groups" }, { label: "Suicide loss" }],
    scope: "National",
    flags: { online: true, inPerson: true },
  },
  {
    name: "Alliance of Hope (suicide loss support)",
    description: "Online community for people grieving suicide loss.",
    coverage: "United States",
    availability: "Online",
    contacts: [{ type: "web", href: "https://allianceofhope.org/", label: "Website" }],
    chips: [{ label: "Online community" }, { label: "Suicide loss" }],
    scope: "National",
    flags: { online: true, free: true },
  },
  {
    name: "What’s Your Grief",
    description: "Grief education and practical resources (not therapy).",
    coverage: "United States",
    availability: "Online",
    contacts: [{ type: "web", href: "https://whatsyourgrief.com/", label: "Website" }],
    chips: [{ label: "Education" }, { label: "Tools" }],
    scope: "National",
    flags: { online: true },
  },
  {
    name: "Grief in Common",
    description: "Community grief support and education (online resources).",
    coverage: "United States",
    availability: "Online",
    contacts: [{ type: "web", href: "https://griefincommon.com/", label: "Website" }],
    chips: [{ label: "Education" }, { label: "Community" }],
    scope: "National",
    flags: { online: true },
  },
  {
    name: "GriefShare (group finder)",
    description: "Directory of grief support groups (faith-based; varies by group).",
    coverage: "United States",
    availability: "Varies",
    contacts: [{ type: "web", href: "https://www.griefshare.org/findagroup", label: "Find a group" }],
    chips: [{ label: "Groups" }, { label: "Directory" }],
    scope: "National",
    flags: { online: true, inPerson: true },
  },
  // Chicago anchor (kept, but housed under Peer in the past—here we keep grief-specific options only)
  {
    name: "Hospice Foundation of America (grief resources)",
    description: "Education and grief resources; find local support through hospice programs.",
    coverage: "United States",
    availability: "Online",
    contacts: [{ type: "web", href: "https://hospicefoundation.org/", label: "Website" }],
    chips: [{ label: "Education" }, { label: "Bereavement" }],
    scope: "National",
    flags: { online: true },
  },
];

const OLDER_ADULTS: ResourcePlus[] = [
  {
    name: "Eldercare Locator",
    description: "National directory connecting older adults and caregivers with local services.",
    coverage: "United States",
    availability: "Online",
    contacts: [{ type: "web", href: "https://eldercare.acl.gov/", label: "Website" }],
    chips: [{ label: "Directory" }, { label: "Caregivers" }],
    scope: "National",
    flags: { online: true },
  },
  {
    name: "Family Caregiver Alliance",
    description: "Education, resources, and support for family caregivers.",
    coverage: "United States",
    availability: "Online",
    contacts: [{ type: "web", href: "https://www.caregiver.org/", label: "Website" }],
    chips: [{ label: "Caregivers" }, { label: "Education" }],
    scope: "National",
    flags: { online: true },
  },
  {
    name: "AARP Caregiving Resource Center",
    description: "Information and tools for caregiving, aging, and long-term care planning.",
    coverage: "United States",
    availability: "Online",
    contacts: [{ type: "web", href: "https://www.aarp.org/caregiving/", label: "Website" }],
    chips: [{ label: "Caregivers" }, { label: "Education" }],
    scope: "National",
    flags: { online: true },
  },
  {
    name: "NCOA (National Council on Aging) — Benefits CheckUp",
    description: "See benefit programs older adults may qualify for (tool).",
    coverage: "United States",
    availability: "Online",
    contacts: [{ type: "web", href: "https://www.ncoa.org/benefits-checkup/", label: "Check eligibility" }],
    chips: [{ label: "Benefits" }, { label: "Older adults" }],
    scope: "National",
    flags: { online: true, free: true },
  },
  {
    name: "Meals on Wheels America",
    description: "Find a local Meals on Wheels program (food + check-ins).",
    coverage: "United States",
    availability: "Online",
    contacts: [{ type: "web", href: "https://www.mealsonwheelsamerica.org/find-meals", label: "Find meals" }],
    chips: [{ label: "Food support" }, { label: "Older adults" }],
    scope: "National",
    flags: { online: true },
  },
  // Illinois anchor
  {
    name: "Illinois Department on Aging",
    description: "Programs and services for older adults and caregivers; links to Area Agencies on Aging.",
    coverage: "Illinois",
    availability: "Online",
    contacts: [{ type: "web", href: "https://ilaging.illinois.gov/", label: "Website" }],
    chips: [{ label: "Illinois" }, { label: "Aging services" }],
    scope: "Illinois",
    flags: { online: true },
  },
];

const IMMIGRATION: ResourcePlus[] = [
  {
    name: "Immigration Advocates Network — Legal Directory",
    description: "National directory of nonprofit immigration legal services.",
    coverage: "United States",
    availability: "Online",
    contacts: [
      { type: "web", href: "https://www.immigrationadvocates.org/nonprofit/legaldirectory/", label: "Find services" },
    ],
    chips: [{ label: "Directory" }, { label: "Nonprofit services" }],
    scope: "National",
    flags: { online: true },
  },
  {
    name: "National Immigration Law Center (NILC)",
    description: "Know-your-rights resources and policy education.",
    coverage: "United States",
    availability: "Online",
    contacts: [{ type: "web", href: "https://www.nilc.org/", label: "Website" }],
    chips: [{ label: "Know your rights" }, { label: "Education" }],
    scope: "National",
    flags: { online: true },
  },
  {
    name: "United We Dream",
    description: "Resources and education for immigrant youth and families.",
    coverage: "United States",
    availability: "Online",
    contacts: [{ type: "web", href: "https://unitedwedream.org/", label: "Website" }],
    chips: [{ label: "Immigrant youth" }, { label: "Education" }],
    scope: "National",
    flags: { online: true },
  },
  {
    name: "RAICES",
    description: "Education and support resources for immigrant communities.",
    coverage: "United States",
    availability: "Online",
    contacts: [{ type: "web", href: "https://www.raicestexas.org/", label: "Website" }],
    chips: [{ label: "Education" }, { label: "Resources" }],
    scope: "National",
    flags: { online: true },
  },
  // Illinois anchor
  {
    name: "ICIRR Family Support Hotline",
    description: "Connection to trusted resources for immigrant families; multilingual support.",
    coverage: "Illinois",
    availability: "Hours vary",
    contacts: [{ type: "call", href: "tel:18554357693", label: "Call 1-855-HELP-MY-FAMILY" }],
    chips: [{ label: "Illinois" }, { label: "Navigation" }],
    scope: "Illinois",
    flags: { confidential: true },
  },
];

const SUBSTANCE_USE_NONCRISIS: ResourcePlus[] = [
  {
    name: "SAMHSA Treatment Locator",
    description: "Search for substance use and mental health treatment programs nationwide.",
    coverage: "United States",
    availability: "Online",
    contacts: [{ type: "web", href: "https://findtreatment.gov/", label: "Find treatment" }],
    chips: [{ label: "Directory" }, { label: "Official portal" }],
    scope: "National",
    flags: { online: true },
  },
  {
    name: "Alcoholics Anonymous (AA)",
    description: "Peer-led recovery meetings for alcohol use (12-step; not therapy).",
    coverage: "United States",
    availability: "Varies",
    contacts: [{ type: "web", href: "https://www.aa.org/find-aa", label: "Find meetings" }],
    chips: [{ label: "Peer support" }, { label: "12-step" }],
    scope: "National",
    flags: { free: true, online: true, inPerson: true },
  },
  {
    name: "Narcotics Anonymous (NA)",
    description: "Peer-led recovery meetings for drug use (12-step; not therapy).",
    coverage: "United States",
    availability: "Varies",
    contacts: [{ type: "web", href: "https://www.na.org/meetingsearch/", label: "Find meetings" }],
    chips: [{ label: "Peer support" }, { label: "12-step" }],
    scope: "National",
    flags: { free: true, online: true, inPerson: true },
  },
  {
    name: "Al-Anon",
    description: "Peer support for family and friends affected by someone else’s drinking.",
    coverage: "United States",
    availability: "Varies",
    contacts: [{ type: "web", href: "https://al-anon.org/al-anon-meetings/", label: "Find meetings" }],
    chips: [{ label: "Family support" }, { label: "Peer support" }],
    scope: "National",
    flags: { free: true, online: true, inPerson: true },
  },
  {
    name: "SMART Recovery",
    description: "Evidence-informed peer support groups for addiction recovery (not therapy).",
    coverage: "United States",
    availability: "Varies",
    contacts: [{ type: "web", href: "https://www.smartrecovery.org/", label: "Website" }],
    chips: [{ label: "Peer support" }, { label: "Non-12-step" }],
    scope: "National",
    flags: { free: true, online: true, inPerson: true },
  },
  {
    name: "LifeRing Secular Recovery",
    description: "Peer support for sobriety (secular; meetings vary).",
    coverage: "United States",
    availability: "Varies",
    contacts: [{ type: "web", href: "https://lifering.org/", label: "Website" }],
    chips: [{ label: "Peer support" }, { label: "Secular" }],
    scope: "National",
    flags: { online: true, inPerson: true },
  },
  {
    name: "Refuge Recovery",
    description: "Buddhist-inspired recovery communities and meetings (varies).",
    coverage: "United States",
    availability: "Varies",
    contacts: [{ type: "web", href: "https://refugerecovery.org/", label: "Website" }],
    chips: [{ label: "Peer support" }, { label: "Mindfulness" }],
    scope: "National",
    flags: { online: true, inPerson: true },
  },
  {
    name: "Gamblers Anonymous",
    description: "Peer-led recovery meetings for problem gambling (12-step).",
    coverage: "United States",
    availability: "Varies",
    contacts: [{ type: "web", href: "https://www.gamblersanonymous.org/ga/", label: "Website" }],
    chips: [{ label: "Peer support" }, { label: "Problem gambling" }],
    scope: "National",
    flags: { online: true, inPerson: true },
  },
  // Illinois anchor
  {
    name: "Illinois Helpline (Substance use + problem gambling)",
    description: "Confidential help finding treatment and support for substance use and problem gambling.",
    coverage: "Illinois",
    availability: "24/7",
    contacts: [
      { type: "call", href: "tel:18332346343", label: "Call 833-2FINDHELP" },
      { type: "web", href: "https://helplineil.org/", label: "Website" },
    ],
    chips: [{ label: "Illinois" }, { label: "Treatment finder" }],
    scope: "Illinois",
    flags: { free: true, confidential: true, online: true },
  },
];

const YOUTH_FAMILY: ResourcePlus[] = [
  {
    name: "Child Mind Institute",
    description: "Evidence-informed resources for kids’ mental health and learning (education).",
    coverage: "United States",
    availability: "Online",
    contacts: [{ type: "web", href: "https://childmind.org/", label: "Website" }],
    chips: [{ label: "Youth" }, { label: "Education" }],
    scope: "National",
    flags: { online: true, free: true },
  },
  {
    name: "Boys Town National Hotline",
    description: "Support for youth, parents, and families (call/text/chat options vary).",
    coverage: "United States",
    availability: "Varies",
    contacts: [{ type: "web", href: "https://www.boystown.org/hotline/Pages/default.aspx", label: "Website" }],
    chips: [{ label: "Youth" }, { label: "Family support" }],
    scope: "National",
    flags: { online: true, free: true },
  },
  {
    name: "Sesame Street in Communities",
    description: "Free tools for families on big feelings, grief, routines, and resilience.",
    coverage: "United States",
    availability: "Online",
    contacts: [{ type: "web", href: "https://sesamestreetincommunities.org/", label: "Website" }],
    chips: [{ label: "Families" }, { label: "Tools" }, { label: "Education" }],
    scope: "National",
    flags: { online: true, free: true },
  },
  {
    name: "The Dougy Center",
    description: "Support resources for grieving children, teens, young adults, and families.",
    coverage: "United States",
    availability: "Online",
    contacts: [{ type: "web", href: "https://www.dougy.org/", label: "Website" }],
    chips: [{ label: "Youth grief" }, { label: "Family support" }],
    scope: "National",
    flags: { online: true, free: true },
  },
  {
    name: "National Alliance for Children’s Grief",
    description: "Education and a directory of child and family grief support programs.",
    coverage: "United States",
    availability: "Online",
    contacts: [{ type: "web", href: "https://childrengrieve.org/", label: "Website" }],
    chips: [{ label: "Youth grief" }, { label: "Directory" }],
    scope: "National",
    flags: { online: true, free: true },
  },
  {
    name: "Erika’s Lighthouse",
    description: "Youth mental health education and prevention resources (not emergency services).",
    coverage: "United States",
    availability: "Online",
    contacts: [{ type: "web", href: "https://erikaslighthouse.org/", label: "Website" }],
    chips: [{ label: "Youth" }, { label: "Education" }, { label: "Prevention" }],
    scope: "National",
    flags: { online: true, free: true },
  },
  {
    name: "Parent Stress Line",
    description: "Emotional support and navigation for parents and caregivers (availability varies).",
    coverage: "United States",
    availability: "Varies",
    contacts: [{ type: "web", href: "https://parentstressline.org/", label: "Website" }],
    chips: [{ label: "Caregivers" }, { label: "Support" }],
    scope: "National",
    flags: { online: true, free: true },
  },
  // Illinois anchor
  {
    name: "Illinois CARES Line (Youth support)",
    description: "Navigation support for urgent youth situations in Illinois (not a substitute for emergency response).",
    coverage: "Illinois",
    availability: "24/7",
    contacts: [{ type: "call", href: "tel:18003459049", label: "Call 1-800-345-9049" }],
    chips: [{ label: "Illinois" }, { label: "Youth" }, { label: "Navigation" }],
    scope: "Illinois",
    flags: { free: true, confidential: true },
  },
];

/* =========================
   FILTER + SORT HELPERS
   ========================= */

function matchesScope(r: ResourcePlus, scopes: Scope[]) {
  if (!scopes.length) return true;
  return scopes.includes(r.scope);
}

function matchesFlags(r: ResourcePlus, flagOn: Partial<Record<FilterKey, boolean>>) {
  const need = Object.entries(flagOn).filter(([, v]) => v);
  if (!need.length) return true;
  const f = r.flags ?? {};
  return need.every(([k]) => Boolean((f as any)[k]));
}

function matchesSearch(r: ResourcePlus, q: string) {
  const s = norm(q);
  if (!s) return true;
  const hay = norm(
    [r.name, r.description, r.coverage, r.availability, ...(r.chips ?? []).map((c) => c.label)]
      .filter(Boolean)
      .join(" ")
  );
  return hay.includes(s);
}

async function fetchZipLatLng(zip: string): Promise<LatLng | null> {
  const z = normalizeZip(zip);
  if (z.length !== 5) return null;
  const res = await fetch(`/api/geo?zip=${encodeURIComponent(z)}`);
  if (!res.ok) return null;
  const data: any = await res.json();
  if (!data?.ok) return null;
  return { lat: data.lat, lng: data.lng };
}

export default function SupportPage() {
  const [scopes, setScopes] = useState<Scope[]>([]);
  const [flagOn, setFlagOn] = useState<Partial<Record<FilterKey, boolean>>>({});
  const [nearMe, setNearMe] = useState(false);
  const [zip, setZip] = useState("");
  const [userLL, setUserLL] = useState<LatLng | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!nearMe) {
        setUserLL(null);
        return;
      }
      const z = normalizeZip(zip);
      if (z.length !== 5) {
        setUserLL(null);
        return;
      }
      const ll = await fetchZipLatLng(z);
      if (!cancelled) setUserLL(ll);
    })();
    return () => {
      cancelled = true;
    };
  }, [nearMe, zip]);

  const allSections = useMemo(
    () => [
      {
        key: "basic",
        id: "basic",
        title: "Basic needs & stability supports",
        subtitle:
          "Food access, benefits, and navigation support that reduce stressors outside the therapy hour.",
        items: BASIC_NEEDS,
      },
      {
        key: "housing",
        id: "housing",
        title: "Housing stability & tenant support",
        subtitle: "Rental help, eviction navigation, and renter information (not legal advice).",
        items: HOUSING,
      },
      {
        key: "legal",
        id: "legal",
        title: "Legal information & systems navigation",
        subtitle: "Starting points for civil legal information + referrals (not legal advice).",
        items: LEGAL_SUPPORT,
      },
      {
        key: "peer",
        id: "peer",
        title: "Peer & community support (non-crisis)",
        subtitle: "Groups and community supports that complement therapy over time.",
        items: PEER_COMMUNITY,
      },
      {
        key: "dvsa",
        id: "dvsa",
        title: "Domestic violence / sexual assault (support & planning)",
        subtitle: "Discreet, confidential resources and safety planning.",
        items: DV_SA_PLANNING,
      },
      {
        key: "grief",
        id: "grief",
        title: "Grief & bereavement",
        subtitle: "Support groups, education, and community options for loss.",
        items: GRIEF,
      },
      {
        key: "older",
        id: "older",
        title: "Older adults & caregivers",
        subtitle: "Caregiving support, benefits tools, and aging-related directories.",
        items: OLDER_ADULTS,
      },
      {
        key: "immigration",
        id: "immigration",
        title: "Immigration-related support",
        subtitle: "Trusted, mostly nonprofit resources (availability varies).",
        items: IMMIGRATION,
      },
      {
        key: "recovery",
        id: "recovery",
        title: "Recovery & peer-based support (non-crisis)",
        subtitle: "Treatment navigation and peer support resources (not emergency medical services).",
        items: SUBSTANCE_USE_NONCRISIS,
      },
      {
        key: "youth",
        id: "youth",
        title: "Youth & family supports",
        subtitle: "Resources for kids, teens, and caregivers (not emergency response).",
        items: YOUTH_FAMILY,
      },
    ],
    []
  );

  const filteredSections = useMemo(() => {
    const apply = (items: ResourcePlus[]) =>
      items
        .filter((r) => matchesScope(r, scopes))
        .filter((r) => matchesFlags(r, flagOn))
        .filter((r) => matchesSearch(r, q));

    const sortMaybe = (items: ResourcePlus[]) => {
      if (!nearMe || !userLL) return items;

      const withDist = items.map((r) => {
        const has = Number.isFinite(r.lat) && Number.isFinite(r.lng);
        const dist = has ? haversineMiles(userLL, { lat: r.lat!, lng: r.lng! }) : null;
        return { r, dist };
      });

      withDist.sort((a, b) => {
        if (a.dist == null && b.dist == null) return 0;
        if (a.dist == null) return 1;
        if (b.dist == null) return -1;
        return a.dist - b.dist;
      });

      return withDist.map((x) => x.r);
    };

    return allSections
      .map((s) => ({ ...s, items: sortMaybe(apply(s.items)) }))
      .filter((s) => s.items.length > 0);
  }, [allSections, scopes, flagOn, nearMe, userLL, q]);

  // Default: all collapsed
  const [openKey, setOpenKey] = useState<Record<string, boolean>>(() => {
    const out: Record<string, boolean> = {};
    for (const s of allSections) out[s.key] = false;
    return out;
  });

  // Auto-open sections with matches when filtering/searching
  useEffect(() => {
    const anyFilters =
      norm(q).length > 0 ||
      scopes.length > 0 ||
      Object.values(flagOn).some(Boolean) ||
      (nearMe && normalizeZip(zip).length === 5);

    if (!anyFilters) return;

    setOpenKey((prev) => {
      const next = { ...prev };
      for (const s of filteredSections) next[s.key] = true;
      return next;
    });
  }, [q, scopes, flagOn, nearMe, zip, filteredSections]);

  const resultsCount = useMemo(
    () => filteredSections.reduce((sum, s) => sum + s.items.length, 0),
    [filteredSections]
  );

  function toggleScope(sc: Scope) {
    setScopes((prev) => (prev.includes(sc) ? prev.filter((x) => x !== sc) : [...prev, sc]));
  }

  function toggleFlag(k: FilterKey) {
    setFlagOn((prev) => ({ ...prev, [k]: !prev?.[k] }));
  }

  function setAllOpen(next: boolean) {
    setOpenKey((prev) => {
      const out: Record<string, boolean> = { ...prev };
      for (const s of allSections) out[s.key] = next;
      return out;
    });
  }

  function clearAll() {
    setQ("");
    setScopes([]);
    setFlagOn({});
    setNearMe(false);
    setZip("");
    setAllOpen(false);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-5xl px-6 py-14">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              Support &amp; services (non-crisis)
            </div>

            <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
              Support beyond therapy
            </h1>

            <p className="max-w-3xl text-lg text-slate-600">
              Support beyond therapy includes non-clinical supports that sustain well-being outside the
              therapy hour — community resources, peer connection, education, lifestyle supports, and
              practical navigation. These resources are meant to complement therapy, reduce stressors,
              and support long-term recovery, connection, and stability.
            </p>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <a
                href="/crisis"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-900 hover:bg-slate-50"
              >
                In crisis right now? Go to Crisis Support →
              </a>
              <a
                href="/"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-900 hover:bg-slate-50"
              >
                Back to home
              </a>
            </div>
          </div>

          {/* Find support (NOT sticky) */}
          <div className="mt-10">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <div className="text-sm font-medium text-slate-900">Find support</div>
                    <div className="text-xs text-slate-600">
                      Search + filters help you narrow, but don’t hide important options.
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="hidden text-xs text-slate-600 sm:inline">
                      {resultsCount} results
                    </span>
                    <button
                      type="button"
                      onClick={clearAll}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-50"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search (e.g., food, eviction, support group, immigration)"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900"
                  />

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={nearMe}
                        onChange={(e) => setNearMe(e.target.checked)}
                      />
                      Near me (sort)
                    </label>

                    <div className="flex items-center gap-2">
                      <input
                        value={zip}
                        onChange={(e) => setZip(normalizeZip(e.target.value))}
                        placeholder="ZIP (5 digits)"
                        className="w-40 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900"
                        inputMode="numeric"
                      />
                      <span className="text-[11px] text-slate-500">Distance not guaranteed.</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <FilterChip active={scopes.includes("Chicago")} onClick={() => toggleScope("Chicago")}>
                    Chicago
                  </FilterChip>
                  <FilterChip active={scopes.includes("Illinois")} onClick={() => toggleScope("Illinois")}>
                    Illinois
                  </FilterChip>
                  <FilterChip active={scopes.includes("National")} onClick={() => toggleScope("National")}>
                    National
                  </FilterChip>

                  <span className="mx-2 h-6 w-px bg-slate-200" />

                  <FilterChip active={!!flagOn.free} onClick={() => toggleFlag("free")}>
                    Free
                  </FilterChip>
                  <FilterChip active={!!flagOn.lowCost} onClick={() => toggleFlag("lowCost")}>
                    Low-cost
                  </FilterChip>
                  <FilterChip active={!!flagOn.online} onClick={() => toggleFlag("online")}>
                    Online
                  </FilterChip>
                  <FilterChip active={!!flagOn.inPerson} onClick={() => toggleFlag("inPerson")}>
                    In-person
                  </FilterChip>
                  <FilterChip active={!!flagOn.confidential} onClick={() => toggleFlag("confidential")}>
                    Confidential
                  </FilterChip>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs leading-relaxed text-slate-700">
                    These resources are informational, non-emergency, and non-clinical. If you need urgent help right now,
                    visit{" "}
                    <a href="/crisis" className="font-semibold text-slate-900 underline underline-offset-2">
                      Crisis Support
                    </a>
                    .
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setAllOpen(true)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-50"
                  >
                    Expand all
                  </button>
                  <button
                    type="button"
                    onClick={() => setAllOpen(false)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-50"
                  >
                    Collapse all
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sections */}
          {filteredSections.map((s) => (
            <SectionShell
              key={s.key}
              id={s.id}
              title={s.title}
              subtitle={s.subtitle}
              count={s.items.length}
              open={!!openKey[s.key]}
              onToggle={() => setOpenKey((prev) => ({ ...prev, [s.key]: !prev[s.key] }))}
            >
              {s.items.map((r) => (
                <SupportResourceCard key={r.name} r={r} />
              ))}
            </SectionShell>
          ))}

          <p className="mt-12 text-xs text-slate-500">
            This hub is informational — not medical or legal advice. Verify details with each resource.
          </p>
        </div>
      </div>
    </main>
  );
}
