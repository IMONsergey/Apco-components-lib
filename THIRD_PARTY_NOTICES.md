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

The library self-hosts Latin and Cyrillic font files under the SIL Open Font License 1.1. The source archive includes complete copyright and license notices in `public/fonts/`. Preserve those notices when copying font assets into another project.

| Font | Role | Copyright holder | Included license | Upstream |
| --- | --- | --- | --- | --- |
| Instrument Sans Variable | English marketing and SaaS headings | The Instrument Sans Project Authors (2022) | `instrument-sans-LICENSE.txt` | https://github.com/Instrument/instrument-sans |
| Onest Variable | Russian marketing typography | The Onest Project Authors (2021) | `onest-LICENSE.txt` | https://github.com/googlefonts/onest |
| Inter Variable | SaaS interface and Cyrillic fallback | The Inter Project Authors (2016) | `inter-LICENSE.txt` | https://github.com/rsms/inter |
| IBM Plex Mono | Technical data and code, including Cyrillic | IBM Corp. (2017) | `ibm-plex-mono-LICENSE.txt` | https://github.com/IBM/plex |

Onest and IBM Plex Mono Cyrillic files were copied from the APCOSYS website font assets. The Onest license is retained from the [Google Fonts Onest source](https://github.com/google/fonts/tree/main/ofl/onest); the other font license texts are retained from their installed Fontsource packages.
