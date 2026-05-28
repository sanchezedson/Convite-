/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GuestRSVP {
  id: string;
  name: string;
  attending: boolean;
  adultsCount: number;
  childrenCount: number;
  plateText: string;
  submissionDate: string;
  message?: string;
}

export interface CharacterMessage {
  id: string;
  name: string;
  role: string;
  quote: string;
  carColor: string;
  accentColor: string;
  speed: string;
}

export interface GiftItem {
  id: string;
  category: string;
  suggestion: string;
  reserved: boolean;
  reservedBy?: string;
}
