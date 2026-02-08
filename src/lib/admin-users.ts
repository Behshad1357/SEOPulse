// src/lib/admin-users.ts
export const ADMIN_EMAILS = [
  'davoodshadmani1978@gmail.com',
  'davoodshadmani@yahoo.com',
  'amirealtorfl@gmail.com',
  // Add more VIP emails here
];

export function isAdminUser(email: string | undefined | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export function getEffectivePlan(
  email: string | undefined | null, 
  dbPlan: string | undefined | null
): string {
  // Admins always get agency plan
  if (isAdminUser(email)) {
    return 'agency';
  }
  return dbPlan || 'free';
}