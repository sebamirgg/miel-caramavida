import { HoneyId } from '../../data/honeys.data';

export type InquiryType = 'dossier' | 'distribution' | 'samples' | 'other';
export type BusinessType = 'importer' | 'distributor' | 'agent' | 'retail' | 'foodservice' | 'other';
export type HoneyInterest = HoneyId | 'both';

export const INQUIRY_TYPES: readonly InquiryType[] = ['dossier', 'distribution', 'samples', 'other'];
export const BUSINESS_TYPES: readonly BusinessType[] = [
  'importer',
  'distributor',
  'agent',
  'retail',
  'foodservice',
  'other',
];
export const HONEY_INTERESTS: readonly HoneyInterest[] = ['ulmo', 'tineo', 'both'];

/** Payload sent by the contact form. This is the contract for a future API. */
export interface ContactRequest {
  inquiryType: InquiryType;
  name: string;
  company: string;
  country: string;
  email: string;
  businessType: BusinessType;
  interest: HoneyInterest;
  volume: string | null;
  message: string;
  consent: true;
  /** Page language, so the sales team can answer in the same language. */
  lang: string;
}

export type ContactResult = { ok: true } | { ok: false; reason: 'network' | 'spam' };
