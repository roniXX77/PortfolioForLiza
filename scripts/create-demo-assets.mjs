import sharp from "sharp";
import { writeFile } from "node:fs/promises";
const scenes = [
  [
    "folds",
    1200,
    900,
    "#d2d4cf",
    `<path d="M0 600L440 120 840 240 630 900H0Z" fill="#ece8dd"/>
     <path d="M440 120L550 660 840 240Z" fill="#b5b6b2"/>
     <path d="M550 660L630 900 840 240Z" fill="#858d89"/>
     <path d="M840 240L1200 510V900H630Z" fill="#e7e4dc"/>`,
  ],
  [
    "field",
    900,
    1200,
    "#333e3b",
    `<rect y="710" width="900" height="490" fill="#a8ad83"/>
     <path d="M0 700Q240 550 480 680T900 620V820H0Z" fill="#68765c"/>
     <path d="M580 0L555 1200" stroke="#c6bba0" stroke-width="12"/>
     <path d="M0 240L900 310M0 255L900 325" stroke="#727f75" stroke-width="3"/>
     <circle cx="300" cy="330" r="120" fill="#c6c5b7" opacity=".18"/>`,
  ],
  [
    "still",
    1400,
    900,
    "#d3cdc1",
    `<rect x="0" y="600" width="1400" height="300" fill="#a99e8b"/>
     <ellipse cx="700" cy="680" rx="340" ry="55" fill="#7f7462" opacity=".4"/>
     <path d="M530 270H850L800 650Q700 730 580 650Z" fill="#bc4d31"/>
     <ellipse cx="690" cy="270" rx="160" ry="40" fill="#d78054"/>
     <ellipse cx="690" cy="270" rx="125" ry="25" fill="#663e30"/>
     <path d="M310 410L460 370 510 650 350 680Z" fill="#e7dfc8"/>`,
  ],
  [
    "gathering",
    1100,
    1000,
    "#b9c2cf",
    `<path d="M0 690L1100 460V1000H0Z" fill="#888d85"/>
     <path d="M0 0H1100V460L0 690Z" fill="#d5d9d7"/>
     <path d="M180 0V660M700 0V550" stroke="#9ca5a2" stroke-width="9"/>
     <circle cx="350" cy="480" r="58" fill="#4c5154"/>
     <path d="M290 540Q350 510 410 540L460 880H240Z" fill="#39444a"/>
     <circle cx="680" cy="440" r="53" fill="#a2816f"/>
     <path d="M625 495L740 490 810 795 580 820Z" fill="#9c5042"/>`,
  ],
  [
    "canvas",
    1000,
    1250,
    "#d9d1be",
    `<path d="M0 200Q550 450 1000 80V560Q530 770 0 530Z" fill="#223e9e"/>
     <path d="M180 0Q460 440 300 1250" stroke="#be583d" stroke-width="150" fill="none"/>
     <path d="M0 960Q420 600 1000 1080" stroke="#e6b448" stroke-width="210" fill="none"/>
     <path d="M700 0L780 1250" stroke="#e8dfc5" stroke-width="25"/>`,
  ],
  [
    "portrait",
    800,
    1000,
    "#e0dfd7",
    `<circle cx="400" cy="340" r="120" fill="#bebfb8"/>
     <path d="M170 1000V760Q170 500 400 500T630 760V1000Z" fill="#bebfb8"/>`,
  ],
  [
    "archive",
    1000,
    800,
    "#adbdab",
    `<path d="M160 140H810V230H160ZM160 290H700V380H160ZM160 440H810V530H160ZM160 590H650V680H160Z" fill="#e3e8d9"/>`,
  ],
];
for (const [name, w, h, bg, art] of scenes) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="3" stitchTiles="stitch"/>
     <feColorMatrix type="saturate" values="0"/>
     <feComponentTransfer><feFuncA type="linear" slope=".11"/>
     </feComponentTransfer><feBlend in="SourceGraphic" mode="multiply"/>
     </filter><g filter="url(#grain)">
      <rect width="100%" height="100%" fill="${bg}"/>${art}</g>
    </svg>`;
  await sharp(Buffer.from(svg))
    .jpeg({ quality: 88 })
    .toFile(`src/assets/${name}.jpg`);
}
const records = [
  [
    "fold-study",
    "fold study",
    "photography",
    "folds",
    "Abstract angular paper folds in warm gray, a demonstration image",
  ],
  [
    "field-notes",
    "field notes",
    "video",
    "field",
    "Abstract green landscape with a vertical line, a demonstration video poster",
  ],
  [
    "objects-in-light",
    "objects in light",
    "photography",
    "still",
    "Illustrated terracotta vessel and folded paper, a demonstration still life",
  ],
  [
    "shared-space",
    "shared space",
    "participation",
    "gathering",
    "Abstract silhouettes in a communal space, a demonstration illustration",
  ],
  [
    "colour-exercise",
    "colour exercise",
    "canvases",
    "canvas",
    "Blue, rust and ochre shapes on a neutral ground, a demonstration composition",
  ],
  [
    "digital-archive",
    "digital archive",
    "digital archive",
    "archive",
    "Rows of pale shapes representing records, a demonstration archive cover",
  ],
];
for (const [i, [slug, title, category, asset, alt]] of records.entries()) {
  const media =
    category === "video"
      ? `  - type: video\n    src: /media/demo-motion.mp4\n    poster: ../../assets/${asset}.jpg\n    alt: "silent demo clip: a blue square moving across a neutral background"\n  - type: video\n    src: /media/demo-motion.mp4\n    poster: ../../assets/folds.jpg\n    alt: "second silent demo clip for checking playback controls"`
      : `  - type: image\n    src: ../../assets/${asset}.jpg\n    alt: "${alt}"`;
  await writeFile(
    `src/content/projects/${slug}.md`,
    `---\ntitle: ${title}\nslug: ${slug}\ncategory: ${category}\nyear: 2026\norder: ${i + 1}\ndemo: true\ndescription: "Demonstration project for the ${category} section. This space will hold an approved project description, context and credits when the artist’s materials are ready."\ncover: ../../assets/${asset}.jpg\ncoverAlt: "${alt}"\nmedia:\n${media}\n---\n`,
  );
}
for (const [i, title] of [
  "a conversation about process",
  "notes on looking",
  "selected pages",
].entries())
  await writeFile(
    `src/content/publications/example-${i + 1}.json`,
    JSON.stringify(
      {
        title,
        publication: "publication name to be confirmed",
        year: 2026 - i,
        demo: true,
      },
      null,
      2,
    ),
  );
