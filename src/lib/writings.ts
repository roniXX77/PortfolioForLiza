interface Writing {
  id: string;
  title: string;
  format: string;
  year?: number;
  preview: string;
  url?: string;
  imageCredit?: { label: string; url: string };
}

export const published: Writing[] = [
  {
    id: "spring",
    title: "Spring Pictures and Uncomfortable Bodies (18+)",
    format: "ST.ART · essay",
    year: 2026,
    preview:
      "From Edo-period shunga to contemporary art, this essay follows the changing rules around who can make, own and explain images of the body.",
    url: "https://saint-art.net/en/spring-pictures-and-uncomfortable-bodies/",
  },
  {
    id: "gta",
    title: "Can You Just Drive Around? Art and Life Inside GTA",
    format: "ST.ART · dialogue with B.A.",
    year: 2026,
    preview:
      "A conversation about GTA’s doubled cities, museum display and what driving without a mission reveals about the way a game teaches us to see a place.",
    url: "https://saint-art.net/en/art-and-life-inside-gta/",
  },
  {
    id: "hollywood",
    title: "Hollywood Dialogues: How American Cinema Influenced Video Art",
    format: "ST.ART · essay",
    year: 2025,
    preview:
      "Starting on Hollywood Boulevard, this essay traces the uneasy proximity of commercial cinema, experimental film and video art in Los Angeles.",
    url: "https://saint-art.net/en/hollywood-dialogues-how-american-cinema-influenced-video-art/",
  },
  {
    id: "museum",
    title: "A Museum as a Living Body: Davide Quadrio on Song Dong. Soul Out",
    format: "ST.ART · interview",
    year: 2026,
    preview:
      "MAO director Davide Quadrio discusses Song Dong’s exhibition, the remaking of the museum’s Chinese galleries and the role of Turin residents in Borrow Light.",
    url: "https://saint-art.net/en/a-museum-as-a-living-body-davide-quadrio-on-song-dong-soul-out/",
  },
];

export const selected: Writing[] = [
  {
    id: "birth",
    title: "Who Gets to See Birth? Brakhage’s Window Water Baby Moving",
    format: "Essay · experimental film",
    preview:
      "Reading Stan Brakhage through James Broughton, I consider the tenderness and unequal positions of childbirth, filming and spectatorship.",
    imageCredit: {
      label: "Wikimedia Commons",
      url: "https://commons.wikimedia.org/wiki/File:Window_Water_Baby_Moving_(1959)_title.jpg",
    },
  },
  {
    id: "rubber",
    title: "No Reason: Watching the Watchers in Quentin Dupieux’s Rubber",
    format: "Essay · film criticism",
    year: 2025,
    preview:
      "Dupieux’s murderous tire turns a desert thriller into an experiment on its own audience, exposing how viewers search for plot and purpose.",
    imageCredit: {
      label: "UFO Distribution",
      url: "https://www.ufo-distribution.com/movie/rubber/",
    },
  },
  {
    id: "lynch",
    title:
      "Love Through the Image: David Lynch’s Inland Empire and Late Lithographs",
    format: "Essay · film and visual art",
    year: 2026,
    preview:
      "A reading of Lynch’s late esotericism through digital images, lithographs and the difficult forms in which love becomes visible.",
    imageCredit: {
      label: "Lyncharium",
      url: "https://lyncharium.com/inland-empire/",
    },
  },
  {
    id: "flowers",
    title: "The Greatest USPS Commercial: Jim Jarmusch’s Broken Flowers",
    format: "Essay · film criticism",
    year: 2025,
    preview:
      "A skeptical reading of Broken Flowers as a broken fairy tale, where interiors and music carry more life than Don’s reluctant quest.",
    imageCredit: {
      label: "Focus Features",
      url: "https://www.focusfeatures.com/broken_flowers",
    },
  },
  {
    id: "boomerang",
    title: "One Second Too Late: Delay and Self-Perception in Boomerang",
    format: "Essay · video art",
    preview:
      "Richard Serra and Nancy Holt’s Boomerang turns a one-second delay into a bodily experience of speech, feedback and a fractured present.",
  },
];
