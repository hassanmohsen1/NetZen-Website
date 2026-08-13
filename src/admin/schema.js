/**
 * Describes every editable piece of the landing page. The dashboard renders
 * itself from this — adding a field here is all it takes to expose it.
 *
 * Field descriptor:
 *   path      dotted path into the content tree
 *   label     what the admin sees
 *   type      text | textarea | image | icon | select | colorPair
 *   shared    true when the value is not language-specific (icons, URLs,
 *             colors, numbers). Shared values render one input and are written
 *             to both the English and Arabic documents.
 *
 * List descriptor:
 *   itemType  'string' for a plain list, 'object' for a list of records
 *   itemTitle which key to show on the collapsed row header
 *   newItem   the record created by "Add"
 */

// Only these four pairs are safelisted in tailwind.config.js, so restricting the
// dropdown to them guarantees an admin can never pick a colour that Tailwind
// hasn't generated a class for.
export const COLOR_PAIRS = [
  { label: 'Soft blue', color: 'primary-container', textColor: 'on-primary-container' },
  { label: 'Indigo', color: 'secondary-container', textColor: 'on-secondary-container' },
  { label: 'Orange', color: 'tertiary-container', textColor: 'on-tertiary-container' },
  { label: 'Solid blue', color: 'primary', textColor: 'on-primary' },
]

export const BADGE_POSITIONS = [
  { label: 'Top (start side)', value: 'top-start' },
  { label: 'Middle (end side)', value: 'middle-end' },
  { label: 'Bottom (start side)', value: 'bottom-start' },
]

export const CARD_SIZES = [
  { label: 'Large — spans 2 columns', value: 'large' },
  { label: 'Small — single column', value: 'small' },
]

export const SECTIONS = [
  {
    id: 'nav',
    label: 'Navigation',
    icon: 'menu',
    fields: [
      { path: 'nav.brand', label: 'Brand name', type: 'text' },
      { path: 'nav.getQuote', label: '"Get a Quote" button', type: 'text' },
      {
        path: 'nav.langToggle',
        label: 'Language switch label',
        type: 'text',
        help: 'Shown on the button that switches language — "AR" on the English site, "EN" on the Arabic one.',
      },
    ],
    lists: [
      {
        path: 'nav.links',
        label: 'Menu links',
        itemType: 'object',
        itemTitle: 'label',
        newItem: { label: 'New link', href: '#home' },
        itemFields: [
          { key: 'label', label: 'Label', type: 'text' },
          {
            key: 'href',
            label: 'Target',
            type: 'text',
            shared: true,
            help: 'A section anchor such as #services, or a full URL.',
          },
        ],
      },
    ],
  },
  {
    id: 'hero',
    label: 'Hero',
    icon: 'rocket_launch',
    fields: [
      { path: 'hero.titleLine1', label: 'Headline — line 1', type: 'text' },
      {
        path: 'hero.titleLine2',
        label: 'Headline — line 2',
        type: 'text',
        help: 'Rendered in the blue gradient.',
      },
      { path: 'hero.subtitle', label: 'Subtitle', type: 'textarea' },
      { path: 'hero.cta', label: 'Primary button', type: 'text' },
      { path: 'hero.ctaSecondary', label: 'Secondary button', type: 'text' },
      { path: 'hero.image', label: 'Hero image', type: 'image', shared: true },
    ],
    lists: [
      {
        path: 'hero.badges',
        label: 'Floating badges',
        help: 'The small cards that float over the hero image on desktop.',
        itemType: 'object',
        itemTitle: 'text',
        newItem: {
          icon: 'bolt',
          text: 'New badge',
          color: 'primary-container',
          textColor: 'on-primary-container',
          position: 'top-start',
        },
        itemFields: [
          { key: 'text', label: 'Text', type: 'text' },
          { key: 'icon', label: 'Icon', type: 'icon', shared: true },
          { key: 'color', label: 'Colour', type: 'colorPair', shared: true },
          {
            key: 'position',
            label: 'Position',
            type: 'select',
            shared: true,
            options: BADGE_POSITIONS,
          },
        ],
      },
    ],
  },
  {
    id: 'stats',
    label: 'Stats & Trust',
    icon: 'insights',
    fields: [
      { path: 'stats.trustedBy', label: '"Trusted by" heading', type: 'text' },
    ],
    lists: [
      {
        path: 'stats.items',
        label: 'Stat counters',
        itemType: 'object',
        itemTitle: 'label',
        newItem: { value: '100', suffix: '+', display: '', label: 'New stat' },
        itemFields: [
          { key: 'label', label: 'Label', type: 'text' },
          {
            key: 'value',
            label: 'Number',
            type: 'text',
            shared: true,
            help: 'Counts up to this number. Decimals are fine (99.9).',
          },
          {
            key: 'suffix',
            label: 'Suffix',
            type: 'text',
            shared: true,
            help: 'Appended after the number, e.g. + or %.',
          },
          {
            key: 'display',
            label: 'Literal override',
            type: 'text',
            shared: true,
            help: 'Set this to show fixed text like "24/7" instead of a counting animation. Leave empty to count.',
          },
        ],
      },
      {
        path: 'stats.logos',
        label: 'Client logos',
        help: 'Company names shown under the stats.',
        itemType: 'string',
        shared: true,
        newItem: 'New client',
      },
    ],
  },
  {
    id: 'services',
    label: 'Services',
    icon: 'grid_view',
    fields: [
      { path: 'services.title', label: 'Section title', type: 'text' },
      { path: 'services.subtitle', label: 'Section subtitle', type: 'textarea' },
      { path: 'services.learnMore', label: '"Learn more" link text', type: 'text' },
    ],
    lists: [
      {
        path: 'services.items',
        label: 'Service cards',
        itemType: 'object',
        itemTitle: 'title',
        newItem: {
          icon: 'settings',
          title: 'New service',
          desc: '',
          color: 'primary-container',
          textColor: 'on-primary-container',
        },
        itemFields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'desc', label: 'Description', type: 'textarea' },
          { key: 'icon', label: 'Icon', type: 'icon', shared: true },
          { key: 'color', label: 'Colour', type: 'colorPair', shared: true },
        ],
      },
    ],
  },
  {
    id: 'solutions',
    label: 'Solutions',
    icon: 'dashboard',
    fields: [],
    lists: [
      {
        path: 'solutions.items',
        label: 'Bento cards',
        help: 'Large cards span two columns and show their description; small cards show only a title and a text link.',
        itemType: 'object',
        itemTitle: 'title',
        newItem: {
          image: '',
          title: 'New solution',
          desc: '',
          cta: 'Learn More',
          size: 'small',
        },
        itemFields: [
          { key: 'title', label: 'Title', type: 'text' },
          {
            key: 'desc',
            label: 'Description',
            type: 'textarea',
            help: 'Only shown on large cards.',
          },
          { key: 'cta', label: 'Button text', type: 'text' },
          { key: 'image', label: 'Background image', type: 'image', shared: true },
          { key: 'size', label: 'Card size', type: 'select', shared: true, options: CARD_SIZES },
        ],
      },
    ],
  },
  {
    id: 'whyNetzen',
    label: 'Why NetZen',
    icon: 'verified',
    fields: [
      { path: 'whyNetzen.title', label: 'Section title', type: 'text' },
      { path: 'whyNetzen.image', label: 'Section image', type: 'image', shared: true },
    ],
    lists: [
      {
        path: 'whyNetzen.items',
        label: 'Reasons',
        itemType: 'object',
        itemTitle: 'title',
        newItem: { icon: 'check_circle', title: 'New reason', desc: '' },
        itemFields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'desc', label: 'Description', type: 'textarea' },
          { key: 'icon', label: 'Icon', type: 'icon', shared: true },
        ],
      },
    ],
  },
  {
    id: 'techEcosystem',
    label: 'Tech Ecosystem',
    icon: 'hub',
    fields: [{ path: 'techEcosystem.title', label: 'Section title', type: 'text' }],
    lists: [
      {
        path: 'techEcosystem.partners',
        label: 'Technology partners',
        help: 'Scrolling marquee of vendor names.',
        itemType: 'string',
        shared: true,
        newItem: 'New partner',
      },
    ],
  },
  {
    id: 'cta',
    label: 'CTA Banner',
    icon: 'campaign',
    fields: [
      { path: 'cta.title', label: 'Title', type: 'text' },
      { path: 'cta.subtitle', label: 'Subtitle', type: 'textarea' },
      { path: 'cta.consultation', label: 'Primary button', type: 'text' },
      { path: 'cta.packages', label: 'Secondary button', type: 'text' },
    ],
  },
  {
    id: 'contact',
    label: 'Contact',
    icon: 'mail',
    fields: [
      { path: 'contact.title', label: 'Section title', type: 'text' },
      { path: 'contact.subtitle', label: 'Section subtitle', type: 'textarea' },
      { path: 'contact.emailLabel', label: 'Email label', type: 'text' },
      { path: 'contact.email', label: 'Email address', type: 'text', shared: true },
      { path: 'contact.phoneLabel', label: 'Phone label', type: 'text' },
      { path: 'contact.phone', label: 'Phone number', type: 'text' },
      { path: 'contact.locationLabel', label: 'Location label', type: 'text' },
      { path: 'contact.location', label: 'Address', type: 'text' },
      { path: 'contact.mapImage', label: 'Map image', type: 'image', shared: true },
      { path: 'contact.formTitle', label: 'Form title', type: 'text' },
      { path: 'contact.fullName', label: 'Field label — name', type: 'text' },
      { path: 'contact.fullNamePlaceholder', label: 'Placeholder — name', type: 'text' },
      { path: 'contact.businessEmail', label: 'Field label — email', type: 'text' },
      { path: 'contact.businessEmailPlaceholder', label: 'Placeholder — email', type: 'text' },
      { path: 'contact.serviceRequired', label: 'Field label — service', type: 'text' },
      { path: 'contact.message', label: 'Field label — message', type: 'text' },
      { path: 'contact.messagePlaceholder', label: 'Placeholder — message', type: 'text' },
      { path: 'contact.submit', label: 'Submit button', type: 'text' },
      { path: 'contact.sending', label: 'Status — sending', type: 'text' },
      { path: 'contact.success', label: 'Status — success', type: 'textarea' },
      { path: 'contact.error', label: 'Status — failed', type: 'textarea' },
      { path: 'contact.errorRequired', label: 'Status — missing fields', type: 'textarea' },
      { path: 'contact.errorEmail', label: 'Status — invalid email', type: 'textarea' },
    ],
    lists: [
      {
        path: 'contact.serviceOptions',
        label: 'Service dropdown options',
        itemType: 'string',
        newItem: 'New service',
      },
    ],
  },
  {
    id: 'footer',
    label: 'Footer',
    icon: 'call_to_action',
    fields: [
      { path: 'footer.brand', label: 'Brand name', type: 'text' },
      { path: 'footer.tagline', label: 'Tagline', type: 'textarea' },
      { path: 'footer.servicesTitle', label: 'Services column heading', type: 'text' },
      { path: 'footer.companyTitle', label: 'Company column heading', type: 'text' },
      { path: 'footer.newsletterTitle', label: 'Newsletter heading', type: 'text' },
      { path: 'footer.newsletterDesc', label: 'Newsletter description', type: 'textarea' },
      { path: 'footer.emailPlaceholder', label: 'Newsletter placeholder', type: 'text' },
      { path: 'footer.copyright', label: 'Copyright line', type: 'text' },
    ],
    lists: [
      {
        path: 'footer.social',
        label: 'Social icons',
        itemType: 'object',
        itemTitle: 'icon',
        shared: true,
        newItem: { icon: 'public', url: '#' },
        itemFields: [
          { key: 'icon', label: 'Icon', type: 'icon', shared: true },
          { key: 'url', label: 'URL', type: 'text', shared: true },
        ],
      },
      {
        path: 'footer.servicesLinks',
        label: 'Services column links',
        itemType: 'object',
        itemTitle: 'label',
        newItem: { label: 'New link', href: '#services' },
        itemFields: [
          { key: 'label', label: 'Label', type: 'text' },
          { key: 'href', label: 'Target', type: 'text', shared: true },
        ],
      },
      {
        path: 'footer.companyLinks',
        label: 'Company column links',
        itemType: 'object',
        itemTitle: 'label',
        newItem: { label: 'New link', href: '#about' },
        itemFields: [
          { key: 'label', label: 'Label', type: 'text' },
          { key: 'href', label: 'Target', type: 'text', shared: true },
        ],
      },
      {
        path: 'footer.bottomLinks',
        label: 'Legal links',
        itemType: 'object',
        itemTitle: 'label',
        newItem: { label: 'New link', href: '#' },
        itemFields: [
          { key: 'label', label: 'Label', type: 'text' },
          { key: 'href', label: 'Target', type: 'text', shared: true },
        ],
      },
    ],
  },
]
