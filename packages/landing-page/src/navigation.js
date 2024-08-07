import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Product',
      links: [
        {
          text: 'Features',
          href: getPermalink('/#features'),
        },
        {
          text: 'Management',
          href: getPermalink('/#casaos'),
        },
        {
          text: 'Security',
          href: getPermalink('/#security'),
        },
        {
          text: 'Anonymity',
          href: getPermalink('/#anonymity'),
        },
        {
          text: 'Domain',
          href: getPermalink('/#domain'),
        },
      ],
    },
    {
      text: 'Docs',
      links: [
        {
          text: 'Getting Started',
          href: getPermalink('/#getting-started'),
        },
        {
          text: 'Medium',
          href: "https://aptero-co.medium.com/",
        },
      ],
    },
    {
      text: 'Community',
      links: [
        {
          text: 'Discord',
          href: "https://discord.gg/QDYHdpYw",
        },
        {
          text: 'GitHub',
          href: "https://github.com/ApteroSAS",
        },
      ],
    },
    {
      text: 'Pricing',
      href: getPermalink('/pricing'),
    },
  ],
  actions: [{ text: 'Open Nasselle', href: getPermalink('/app'), target: '_blank' }],
};

export const footerData = {
  links: [
    {
      title: 'Company',
      links: [
        { text: 'About', href: 'https://www.aptero.co/' },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('https://www.aptero.co/legal-notice') },
    { text: 'Privacy Policy', href: getPermalink('https://www.aptero.co/legal-notice') },
  ],
  socialLinks: [
    { ariaLabel: 'X', icon: 'tabler:brand-x', href: 'https://x.com/Aptero3D' },
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: 'https://www.instagram.com/apterovr' },
    { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/ApteroSAS' },
  ],
  footNote: `
    <img class="w-5 h-5 md:w-6 md:h-6 md:-mt-0.5 bg-cover mr-1.5 rtl:mr-0 rtl:ml-1.5 float-left rtl:float-right rounded-sm" src="https://onwidget.com/favicon/favicon-32x32.png" alt="onWidget logo" loading="lazy"></img>
    Made by <a class="text-blue-600 underline dark:text-muted" href="https://onwidget.com/"> onWidget</a> · All rights reserved.
  `,
};
