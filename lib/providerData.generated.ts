// AUTO-GENERATED. DO NOT EDIT BY HAND.
// Source: data/providers.csv
import type { ModalityId } from "./quizData";

export type Provider = {
  id: string;
  name: string;

  address: string;
  city: string;
  state: string;
  zip: string;

  telehealth: boolean;
  acceptingNewClients: boolean;

  insurance: string[];
  modalities: ModalityId[];

  website?: string;
  intakeUrl?: string;
  directionsUrl?: string;
  parkingUrl?: string;
  notes?: string;
  sourceUrl?: string;

  verified?: boolean;
  lastVerified?: string;

  featured?: boolean;
  featuredRank?: number;
  featuredUntil?: string;
  featuredTagline?: string;
};

export const PROVIDERS: Provider[] = [
  {
    id: "il-0001",
    name: "Demo CBT + ACT Clinic",

    address: "123 N State St",
    city: "Chicago",
    state: "IL",
    zip: "60602",

    telehealth: true,
    acceptingNewClients: true,

    insurance: ["BCBS","Aetna","United","Cigna"],
    modalities: ["cbt","act","group"] as ModalityId[],

    website: "https://example.com",
    intakeUrl: "https://example.com/intake",
    directionsUrl: "https://maps.google.com/?q=123+N+State+St+Chicago+IL",
    parkingUrl: "https://example.com/parking",
    notes: "Downtown; street parking limited; garages nearby",
    sourceUrl: "https://example.com/directory",

    verified: true,
    lastVerified: "2025-12-31",

    featured: true,
    featuredRank: 1,
    featuredUntil: "2026-03-01",
    featuredTagline: "Fast intake • Telehealth",
  },
  {
    id: "il-0002",
    name: "Demo Trauma + EMDR Center",

    address: "2400 N Lincoln Ave",
    city: "Chicago",
    state: "IL",
    zip: "60614",

    telehealth: true,
    acceptingNewClients: false,

    insurance: ["BCBS","United"],
    modalities: ["emdr","somatic","ifs"] as ModalityId[],

    website: "https://example.com",
    intakeUrl: undefined,
    directionsUrl: "https://maps.google.com/?q=2400+N+Lincoln+Ave+Chicago+IL",
    parkingUrl: undefined,
    notes: "Waitlist likely; ask about EMDR consult",
    sourceUrl: "https://example.com/directory",

    verified: false,
    lastVerified: undefined,

    featured: false,
    featuredRank: 0,
    featuredUntil: undefined,
    featuredTagline: undefined,
  },
  {
    id: "il-0003",
    name: "Demo DBT Skills Program",

    address: "555 W Madison St",
    city: "Chicago",
    state: "IL",
    zip: "60661",

    telehealth: true,
    acceptingNewClients: true,

    insurance: ["Aetna","Cigna","United"],
    modalities: ["dbt","group"] as ModalityId[],

    website: "https://example.com",
    intakeUrl: "https://example.com/intake",
    directionsUrl: "https://maps.google.com/?q=555+W+Madison+St+Chicago+IL",
    parkingUrl: undefined,
    notes: "Group-based program; ask about schedule",
    sourceUrl: "https://example.com/directory",

    verified: false,
    lastVerified: undefined,

    featured: false,
    featuredRank: 0,
    featuredUntil: undefined,
    featuredTagline: undefined,
  },
  {
    id: "il-0004",
    name: "Demo Art Therapy Studio",

    address: "900 W Armitage Ave",
    city: "Chicago",
    state: "IL",
    zip: "60614",

    telehealth: true,
    acceptingNewClients: true,

    insurance: ["BCBS","Aetna"],
    modalities: ["art","somatic","narrative"] as ModalityId[],

    website: "https://example.com",
    intakeUrl: undefined,
    directionsUrl: "https://maps.google.com/?q=900+W+Armitage+Ave+Chicago+IL",
    parkingUrl: undefined,
    notes: "Free street parking after 6pm (example)",
    sourceUrl: "https://example.com/directory",

    verified: false,
    lastVerified: undefined,

    featured: false,
    featuredRank: 0,
    featuredUntil: undefined,
    featuredTagline: undefined,
  },
  {
    id: "il-0005",
    name: "Demo Music Therapy Practice",

    address: "1 S Dearborn St",
    city: "Chicago",
    state: "IL",
    zip: "60603",

    telehealth: true,
    acceptingNewClients: true,

    insurance: ["BCBS","United"],
    modalities: ["music","group"] as ModalityId[],

    website: "https://example.com",
    intakeUrl: undefined,
    directionsUrl: "https://maps.google.com/?q=1+S+Dearborn+St+Chicago+IL",
    parkingUrl: undefined,
    notes: "Near public transit",
    sourceUrl: "https://example.com/directory",

    verified: false,
    lastVerified: undefined,

    featured: false,
    featuredRank: 0,
    featuredUntil: undefined,
    featuredTagline: undefined,
  },
  {
    id: "il-0006",
    name: "Demo OCD / ERP Clinic",

    address: "250 S Michigan Ave",
    city: "Chicago",
    state: "IL",
    zip: "60604",

    telehealth: true,
    acceptingNewClients: true,

    insurance: ["Aetna","BCBS"],
    modalities: ["erp","cbt"] as ModalityId[],

    website: "https://example.com",
    intakeUrl: undefined,
    directionsUrl: "https://maps.google.com/?q=250+S+Michigan+Ave+Chicago+IL",
    parkingUrl: undefined,
    notes: "ERP-focused; ask about OCD specialization",
    sourceUrl: "https://example.com/directory",

    verified: false,
    lastVerified: undefined,

    featured: false,
    featuredRank: 0,
    featuredUntil: undefined,
    featuredTagline: undefined,
  },
  {
    id: "il-0007",
    name: "Demo Psychodynamic Therapist",

    address: "2000 W North Ave",
    city: "Chicago",
    state: "IL",
    zip: "60647",

    telehealth: true,
    acceptingNewClients: true,

    insurance: ["Cigna","BCBS"],
    modalities: ["psychodynamic","ifs"] as ModalityId[],

    website: "https://example.com",
    intakeUrl: undefined,
    directionsUrl: "https://maps.google.com/?q=2000+W+North+Ave+Chicago+IL",
    parkingUrl: undefined,
    notes: "Evening appointments (example)",
    sourceUrl: "https://example.com/directory",

    verified: false,
    lastVerified: undefined,

    featured: false,
    featuredRank: 0,
    featuredUntil: undefined,
    featuredTagline: undefined,
  },
  {
    id: "il-0008",
    name: "Demo Couples + Family Practice",

    address: "1603 Orrington Ave",
    city: "Evanston",
    state: "IL",
    zip: "60201",

    telehealth: true,
    acceptingNewClients: true,

    insurance: ["Aetna","Cigna"],
    modalities: ["family","cbt"] as ModalityId[],

    website: "https://example.com",
    intakeUrl: undefined,
    directionsUrl: "https://maps.google.com/?q=1603+Orrington+Ave+Evanston+IL",
    parkingUrl: undefined,
    notes: "Metered street parking",
    sourceUrl: "https://example.com/directory",

    verified: false,
    lastVerified: undefined,

    featured: false,
    featuredRank: 0,
    featuredUntil: undefined,
    featuredTagline: undefined,
  },
  {
    id: "il-0009",
    name: "Demo Somatic Clinic (Suburbs)",

    address: "2500 Ridge Ave",
    city: "Evanston",
    state: "IL",
    zip: "60201",

    telehealth: true,
    acceptingNewClients: true,

    insurance: ["United","BCBS"],
    modalities: ["somatic","emdr","ifs"] as ModalityId[],

    website: "https://example.com",
    intakeUrl: undefined,
    directionsUrl: "https://maps.google.com/?q=2500+Ridge+Ave+Evanston+IL",
    parkingUrl: undefined,
    notes: "Ask about body-based trauma stabilization",
    sourceUrl: "https://example.com/directory",

    verified: false,
    lastVerified: undefined,

    featured: false,
    featuredRank: 0,
    featuredUntil: undefined,
    featuredTagline: undefined,
  },
  {
    id: "il-0010",
    name: "Demo Therapy Practice (Oak Park)",

    address: "100 N Marion St",
    city: "Oak Park",
    state: "IL",
    zip: "60301",

    telehealth: true,
    acceptingNewClients: true,

    insurance: ["BCBS","Aetna"],
    modalities: ["cbt","act","group"] as ModalityId[],

    website: "https://example.com",
    intakeUrl: undefined,
    directionsUrl: "https://maps.google.com/?q=100+N+Marion+St+Oak+Park+IL",
    parkingUrl: undefined,
    notes: "Garage across the street",
    sourceUrl: "https://example.com/directory",

    verified: false,
    lastVerified: undefined,

    featured: false,
    featuredRank: 0,
    featuredUntil: undefined,
    featuredTagline: undefined,
  },
  {
    id: "il-0011",
    name: "Demo IFS Therapist (Naperville)",

    address: "50 S Main St",
    city: "Naperville",
    state: "IL",
    zip: "60540",

    telehealth: true,
    acceptingNewClients: true,

    insurance: ["Cigna","United"],
    modalities: ["ifs","psychodynamic","act"] as ModalityId[],

    website: "https://example.com",
    intakeUrl: undefined,
    directionsUrl: "https://maps.google.com/?q=50+S+Main+St+Naperville+IL",
    parkingUrl: undefined,
    notes: "Free parking lot behind building",
    sourceUrl: "https://example.com/directory",

    verified: false,
    lastVerified: undefined,

    featured: false,
    featuredRank: 0,
    featuredUntil: undefined,
    featuredTagline: undefined,
  },
  {
    id: "il-0012",
    name: "Demo Trauma Therapist (Peoria)",

    address: "200 SW Jefferson Ave",
    city: "Peoria",
    state: "IL",
    zip: "61602",

    telehealth: true,
    acceptingNewClients: true,

    insurance: ["BCBS","Aetna"],
    modalities: ["emdr","somatic","cbt"] as ModalityId[],

    website: "https://example.com",
    intakeUrl: undefined,
    directionsUrl: "https://maps.google.com/?q=200+SW+Jefferson+Ave+Peoria+IL",
    parkingUrl: undefined,
    notes: "Check downtown parking meters",
    sourceUrl: "https://example.com/directory",

    verified: false,
    lastVerified: undefined,

    featured: false,
    featuredRank: 0,
    featuredUntil: undefined,
    featuredTagline: undefined,
  },
  {
    id: "il-0013",
    name: "Demo Counseling Center (Champaign)",

    address: "30 E Main St",
    city: "Champaign",
    state: "IL",
    zip: "61820",

    telehealth: true,
    acceptingNewClients: true,

    insurance: ["United","Cigna"],
    modalities: ["cbt","dbt","act","group"] as ModalityId[],

    website: "https://example.com",
    intakeUrl: undefined,
    directionsUrl: "https://maps.google.com/?q=30+E+Main+St+Champaign+IL",
    parkingUrl: undefined,
    notes: "Near campus; bus-friendly",
    sourceUrl: "https://example.com/directory",

    verified: false,
    lastVerified: undefined,

    featured: false,
    featuredRank: 0,
    featuredUntil: undefined,
    featuredTagline: undefined,
  },
  {
    id: "il-0014",
    name: "Demo Practice (Springfield)",

    address: "1 S Old State Capitol Plaza",
    city: "Springfield",
    state: "IL",
    zip: "62701",

    telehealth: true,
    acceptingNewClients: true,

    insurance: ["BCBS","Aetna"],
    modalities: ["cbt","psychodynamic","narrative"] as ModalityId[],

    website: "https://example.com",
    intakeUrl: undefined,
    directionsUrl: "https://maps.google.com/?q=1+S+Old+State+Capitol+Plaza+Springfield+IL",
    parkingUrl: undefined,
    notes: "Garages nearby",
    sourceUrl: "https://example.com/directory",

    verified: false,
    lastVerified: undefined,

    featured: false,
    featuredRank: 0,
    featuredUntil: undefined,
    featuredTagline: undefined,
  },
];
