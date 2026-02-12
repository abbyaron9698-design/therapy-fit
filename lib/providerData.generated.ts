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

];
