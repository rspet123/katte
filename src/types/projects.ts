export interface ProjectDetailData {
  /** Short reference code, e.g. "001" */
  ref?: string
  /** Project title */
  title: string
  /** Date range label, e.g. "2023 - CURRENT" */
  dates?: string
  /** One or two sentence project overview */
  overview: string
  /** Technology stack items */
  stack: string[]
  /** Status label, e.g. "PRODUCTION" */
  status?: string
  /** Optional GitHub URL */
  github?: string
  /** Render a redacted source treatment instead of a source link */
  isPrivate?: boolean
  /** Glyph asset keys shown with the title */
  glyphs?: string[]
}
