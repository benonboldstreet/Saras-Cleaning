/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  propertyType: string;
  serviceType: string;
  message: string;
  estimateDetails: EstimateDetails | null;
  submittedAt: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
}

export interface EstimateDetails {
  floors?: string;
  entryways?: string;
  area?: string;
  type: string;
  serviceMode: string;
  frequency: string;
  computedCost: string;
  computedHours: string;
}

export interface ServiceDetail {
  id: string;
  title: string;
  description: string;
  iconName: string;
  ratesDescription: string;
  typicalJobCost: string;
  duties: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  text: string;
  rating: number;
}
