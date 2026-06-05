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
  // TODO: Google フォーム等の公開 URL を設定すると、フッターに連絡リンクが出る。
  contactFormUrl: '',
}
