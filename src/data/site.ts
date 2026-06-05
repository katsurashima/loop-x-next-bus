// Site-level metadata shown in the footer: an unofficial-status disclaimer and
// a stakeholder contact channel.

export interface SiteMeta {
  /** Makes clear this is an unofficial, fan-made viewer. */
  disclaimer: string
  /**
   * Contact form URL (e.g. a Google Form) for the operator or riders to reach
   * the author. Leave empty to hide the contact link until a form exists.
   */
  contactFormUrl: string
}

export const SITE: SiteMeta = {
  disclaimer:
    'このサイトは有志による非公式の時刻表ビューアーです。シダックスおよび LOOP-X とは関係ありません。',
  // Google Form responder link (公開用). Setting this shows the footer link.
  contactFormUrl: 'https://forms.gle/tbdG24kGuz2jqmGRA',
}
