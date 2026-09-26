import type { AccessLevel } from '../types';

const ACCESS_WEIGHTS: Record<AccessLevel, number> = {
  pubblico: 0,
  ospite: 1,
  commensale: 2,
};

export interface UserProfile {
  id: string;
  identificativo: string;
  role: AccessLevel;
}

export function hasClearance(userRole: AccessLevel, requiredLevel: AccessLevel): boolean {
  return ACCESS_WEIGHTS[userRole] >= ACCESS_WEIGHTS[requiredLevel];
}

export function evaluateAccess(
  user: UserProfile | null,
  item: { accessLevel: AccessLevel; hidden?: boolean }
): {
  isVisible: boolean;
  canSeeContent: boolean;
} {
  const userRole = user?.role || 'pubblico';
  const hasLevel = hasClearance(userRole, item.accessLevel);

  if (hasLevel) {
    return { isVisible: true, canSeeContent: true };
  }

  if (item.hidden) {
    return { isVisible: false, canSeeContent: false };
  }

  return { isVisible: true, canSeeContent: false };
}

export function filterVisible<T extends { accessLevel: AccessLevel; hidden?: boolean }>(
  items: T[],
  user: UserProfile | null
): T[] {
  return items.filter((item) => evaluateAccess(user, item).isVisible);
}
