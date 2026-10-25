# Third-party notices

The APCOSYS brand mark and site-specific icon geometry are first-party assets. The following upstream packages provide additional iconography and motion.

| Source | Version | License | URL |
| --- | --- | --- | --- |
| Feather Icons (Iconify JSON) | 1.2.1 | MIT | https://github.com/feathericons/feather |
| Phosphor Icons (Iconify JSON) | 1.2.2 | MIT | https://github.com/phosphor-icons/core |
| Iconify data packaging | See lockfile | MIT | https://github.com/iconify/icon-sets |
| Morphicons | 1.7.1 | MIT | https://github.com/guillermolg00/morphicons |
| Lucide (icon data) | 1.52.0 | ISC | https://github.com/lucide-icons/lucide |

**Redistribution policy:** Preserve the upstream LICENSE files and original copyright/permission notices alongside copied source or generated SVG assets. Icons are color-normalized to `currentColor` where appropriate. Feather's 24-grid strokes default to 1.5px; regular Phosphor icons retain their original filled geometry.

No third-party SVG CDN is used at runtime. Source data is installed from exact versions in `package-lock.json` and transformed into local sprites by `scripts/generate-icons.mjs`.

The submitted Figma archives are design references and are not asserted to be byte-identical to the generated open-source icon sprites.

## Fonts

Local font files are distributed under the SIL Open Font License 1.1. Preserve the license files in `public/fonts/` when redistributing these assets.

| Font | Role | License file |
| --- | --- | --- |
| Instrument Sans | English marketing typography and SaaS display typography | `public/fonts/instrument-sans-LICENSE.txt` |
| Onest | Russian marketing typography | `public/fonts/onest-LICENSE.txt` |
| Inter | SaaS interface and Cyrillic fallback | `public/fonts/inter-LICENSE.txt` |
| IBM Plex Mono | Technical data and code, including Cyrillic | `public/fonts/ibm-plex-mono-LICENSE.txt` |

Onest and IBM Plex Mono Cyrillic files were copied from the APCOSYS website font assets. The Onest license is retained from the [Google Fonts Onest source](https://github.com/google/fonts/tree/main/ofl/onest); the other font license texts are retained from their installed Fontsource packages.

## Bundled fonts

The library self-hosts the following font files. They are distributed under the SIL Open Font License 1.1, with their complete copyright and license notices in `public/fonts/`. The source archive includes those notices.

| Font | Copyright holder | Included license | Upstream |
| --- | --- | --- | --- |
| Instrument Sans Variable | The Instrument Sans Project Authors (2022) | `instrument-sans-LICENSE.txt` | https://github.com/Instrument/instrument-sans |
| Onest Variable | The Onest Project Authors (2021) | `onest-LICENSE.txt` | https://github.com/googlefonts/onest |
| Inter Variable | The Inter Project Authors (2016) | `inter-LICENSE.txt` | https://github.com/rsms/inter |
| IBM Plex Mono | IBM Corp. (2017) | `ibm-plex-mono-LICENSE.txt` | https://github.com/IBM/plex |

Preserve these license files when copying the Latin and Cyrillic WOFF2 assets into another project.
