// Timetable data for the LOOP-X free shuttle bus (田町駅 ⇔ LOOP-X).
//
// PROVENANCE (必ず維持すること):
//   出所: シダックス公式ページ https://www.shidax.co.jp/dst/loop-x/
//   確認日 (checkedOn): 2026-06-05
//   運行: 月〜金（平日のみ）。土・日・祝日、年末年始(12/29〜1/3)は運休。
//   無料の通勤シャトル(福利厚生)。事業者の最新案内が常に優先する。
//   ロゴ・路線図画像・PDF は転載しない。数値データのみをここに手入力する。
//
// 更新手順: ダイヤ改正時に出所ページを確認し、departures と checkedOn を書き換える。

/** Pictogram kind for an endpoint. Generic glyphs only — never operator logos. */
export type PlaceIcon = 'station' | 'building'

/** An endpoint of the route (a stop). */
export interface Place {
  /** Display name, e.g. "田町駅". */
  name: string
  /** Which pictogram represents this place. */
  icon: PlaceIcon
}

/** A single bus route running in one direction. */
export interface RouteDirection {
  /** Stable id used as a DOM key. */
  id: string
  /** Human label shown on the card, e.g. "LOOP-X 行き". */
  label: string
  /** Where the rider boards. */
  origin: Place
  /** Where the bus is headed. */
  destination: Place
  /** Departure times as "HH:MM", 24h. Order is normalized at render time. */
  departures: readonly string[]
}

/** The whole timetable for the route. */
export interface Timetable {
  /** Route display name. */
  routeName: string
  /** Operator name (事業者). Required for provenance. */
  operator: string
  /** Source URL the data was transcribed from. */
  sourceUrl: string
  /** Date the data was last verified against the source, "YYYY-MM-DD". */
  checkedOn: string
  /** Weekdays the service runs. 0 = Sunday … 6 = Saturday. */
  serviceWeekdays: readonly number[]
  /** Both directions. */
  directions: readonly RouteDirection[]
}

export const TIMETABLE: Timetable = {
  routeName: 'LOOP-X 無料シャトルバス',
  operator: 'シダックス',
  sourceUrl: 'https://www.shidax.co.jp/dst/loop-x/',
  checkedOn: '2026-06-05',
  serviceWeekdays: [1, 2, 3, 4, 5], // Mon–Fri
  directions: [
    {
      id: 'to-loop-x',
      label: 'LOOP-X 行き',
      origin: { name: '田町駅', icon: 'station' },
      destination: { name: 'LOOP-X', icon: 'building' },
      departures: [
        '07:29', '07:38', '07:45', '07:53', '08:00', '08:09', '08:17',
        '08:21', '08:26', '08:34', '08:39', '08:45', '08:55', '08:59',
        '09:07', '09:15', '09:21', '09:26', '09:34', '09:40', '09:43',
        '09:51', '09:57', '10:02', '10:13', '10:29', '10:38', '10:47',
        '10:54', '11:03', '11:22', '11:47', '12:03', '12:23', '12:48',
        '13:04', '13:16', '13:32', '13:48', '14:04', '14:24', '14:49',
        '15:05', '15:25', '15:50', '16:06', '16:26', '16:42', '16:46',
        '17:02', '17:22', '17:43', '17:51', '18:01', '18:07', '18:17',
        '18:23', '18:33', '18:39', '18:49', '18:55', '19:05', '19:12',
        '19:25', '19:50', '20:01', '20:21', '20:46', '21:02', '21:18',
        '21:34', '22:04', '22:20', '22:39',
      ],
    },
    {
      id: 'to-tamachi',
      label: '田町駅 行き',
      origin: { name: 'LOOP-X', icon: 'building' },
      destination: { name: '田町駅', icon: 'station' },
      departures: [
        '07:37', '07:45', '07:52', '08:00', '08:08', '08:17', '08:25',
        '08:29', '08:34', '08:44', '08:49', '08:55', '09:05', '09:10',
        '09:15', '09:24', '09:30', '09:34', '09:42', '09:48', '09:51',
        '10:05', '10:21', '10:30', '10:39', '10:46', '10:55', '11:14',
        '11:39', '11:55', '12:15', '12:40', '12:56', '13:08', '13:24',
        '13:40', '13:56', '14:16', '14:41', '14:57', '15:17', '15:42',
        '15:58', '16:18', '16:34', '16:38', '16:54', '17:14', '17:35',
        '17:43', '17:53', '17:59', '18:09', '18:15', '18:25', '18:31',
        '18:41', '18:47', '18:57', '19:04', '19:17', '19:42', '19:53',
        '20:09', '20:13', '20:38', '20:54', '21:10', '21:26', '21:56',
        '22:12', '22:31', '22:47',
      ],
    },
  ],
}
