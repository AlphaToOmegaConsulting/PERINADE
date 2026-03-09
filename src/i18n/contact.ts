import { getEntry } from "astro:content";

export type ContactInfo = {
  phone: string;
  phoneTel: string;
  email: string;
  website: string;
  address: string;
  region: string;
  city: string;
  mapUrl: string;
  instagram: string;
  facebook: string;
};

/** Reads contact info from content collection (CMS-driven). */
export async function getContactInfo(): Promise<ContactInfo> {
  const entry = await getEntry("contact", "contact");
  if (!entry) throw new Error("Contact info not found");
  return entry.data as ContactInfo;
}
