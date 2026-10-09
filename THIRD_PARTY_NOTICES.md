# Third-party icon and motion notices

The APCOSYS brand mark and site-specific icon geometry are first-party assets. The following upstream packages are used only for additional iconography and motion.

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
