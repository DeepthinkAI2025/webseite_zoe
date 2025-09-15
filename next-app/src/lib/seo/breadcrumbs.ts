import { SITE_URL } from './constants';

interface CrumbInput { label: string; path: string; }

export function buildBreadcrumb(pathSegments: CrumbInput[]) {
  return pathSegments.map(seg => ({
    name: seg.label,
    url: `${SITE_URL}${seg.path}`
  }));
}
