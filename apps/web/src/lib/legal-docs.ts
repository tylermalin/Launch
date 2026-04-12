export type LegalDocMeta = {
  slug: string
  title: string
  fileName: string
  /** Short label for checkboxes */
  shortLabel: string
}

export const LEGAL_DOCS: LegalDocMeta[] = [
  {
    slug: 'terms',
    title: 'Terms and Conditions',
    fileName: 'terms.txt',
    shortLabel: 'Terms & Conditions',
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    fileName: 'privacy.txt',
    shortLabel: 'Privacy Policy',
  },
  {
    slug: 'hex-node-purchase',
    title: 'Hex Node Purchase & Preorder Agreement',
    fileName: 'hex-node-purchase.txt',
    shortLabel: 'Hex Node Purchase & Preorder Agreement',
  },
  {
    slug: 'token-rewards-risk',
    title: 'Token & Rewards Risk Disclosure',
    fileName: 'token-rewards-risk.txt',
    shortLabel: 'Token & Rewards Risk Disclosure',
  },
]

export function getLegalBySlug(slug: string) {
  return LEGAL_DOCS.find((d) => d.slug === slug)
}
