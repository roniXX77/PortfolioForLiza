import { test, expect } from "@playwright/test";
test("all routes, local images, navigation and no failed requests", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("response", (r) => {
    if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`);
  });
  for (const route of [
    "/",
    "/projects/",
    "/writings/",
    "/bio/",
    "/projects/los-angeles-one/",
    "/projects/kvartirnik/",
    "/projects/in-search-of-volume/",
    "/projects/space-noses-travel-agency/",
    "/projects/digital-archive/",
  ]) {
    expect((await page.goto(route))?.status()).toBe(200);
    await page.evaluate(() =>
      Array.from(
        document.querySelectorAll<HTMLImageElement>("img[src]"),
      ).forEach((image) => (image.loading = "eager")),
    );
    await page.waitForFunction(() =>
      Array.from(document.querySelectorAll<HTMLImageElement>("img[src]")).every(
        (image) => image.complete && image.naturalWidth > 0,
      ),
    );
  }
  await page.goto("/");
  await expect(page.locator(".hero-tagline")).toHaveText("/go explore!");
  await page
    .getByRole("link", { name: "/selected projects", exact: true })
    .click();
  await expect(page).toHaveURL(/\/projects\//);
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "/writings" })
    .click();
  await expect(page.locator("h1")).toHaveText("/writings");
  expect(errors).toEqual([]);
});
test("filters, reset, URL and archive project", async ({ page }) => {
  await page.goto("/projects/");
  await expect(page.locator(".project-tile:visible")).toHaveCount(22);
  for (const [category, count] of [
    ["video", 5],
    ["photography", 8],
    ["participation", 3],
    ["canvases", 6],
  ] as const) {
    await page
      .getByRole("button", { name: `/${category}`, exact: true })
      .click();
    await expect(page.locator(".project-tile:visible")).toHaveCount(count);
    await expect(page).toHaveURL(new RegExp(`category=${category}`));
  }
  await page.reload();
  await expect(page.locator(".project-tile:visible")).toHaveCount(6);
  await page.getByRole("button", { name: "/all", exact: true }).click();
  await expect(page.locator(".project-tile:visible")).toHaveCount(22);
  const archive = page.locator(".filters .archive-link");
  await expect(archive).toHaveAttribute("href", "/projects/digital-archive/");
  await archive.click();
  await expect(page.locator("h1")).toHaveText("/digital archive");
  const visit = page.getByRole("link", { name: "/visit lichnoye publichnoye" });
  await expect(visit).toHaveAttribute(
    "href",
    "https://lichnoyepublichnoye.art",
  );
  await expect(visit).toHaveAttribute("target", "_blank");
});
test("ribbon pause, hover, focus, repeated group and seamless geometry", async ({
  page,
}) => {
  await page.goto("/");
  await page.mouse.move(0, 0);
  const track = page.locator(".ribbon-track");
  await expect(track).toHaveCSS("animation-play-state", "running");
  await expect(page.getByRole("button", { name: "/pause motion" })).toHaveCount(
    0,
  );
  await page.locator(".ribbon-window").scrollIntoViewIfNeeded();
  const box = await page.locator(".ribbon-window").boundingBox();
  await page.mouse.move(box!.x + 20, box!.y + 30);
  await expect(track).toHaveCSS("animation-play-state", "running");
  const speed = () =>
    track.evaluate((el) => el.getAnimations()[0]?.playbackRate);
  await expect.poll(speed).toBe(0.9);
  await page.mouse.move(0, 0);
  await expect.poll(speed).toBe(1);
  await page.locator(".ribbon-item").first().focus();
  await expect(track).toHaveCSS("animation-play-state", "paused");
  const groups = page.locator(".ribbon-group");
  expect(await groups.count()).toBe(2);
  await expect(groups.nth(1).locator("a").first()).toHaveAttribute(
    "tabindex",
    "-1",
  );
  await expect(groups.nth(1)).toHaveAttribute("aria-hidden", "true");
  const geometry = await track.evaluate((el) => ({
    track: el.getBoundingClientRect().width,
    groups: Array.from(el.children).map((x) => x.getBoundingClientRect().width),
  }));
  expect(geometry.groups[0]).toBeCloseTo(geometry.groups[1], 1);
  expect(geometry.track / 2).toBeCloseTo(geometry.groups[0], 1);
  const viewport = page.locator(".ribbon-window");
  await page.mouse.move(box!.x + 20, box!.y + 30);
  const animationTime = () =>
    track.evaluate((element) =>
      Number(element.getAnimations()[0]?.currentTime),
    );
  const beforeWheel = await animationTime();
  await page.mouse.wheel(100, 0);
  await expect.poll(animationTime).not.toBe(beforeWheel);
  await expect(track).toHaveCSS("animation-play-state", "paused");
  await expect.poll(() => viewport.evaluate((el) => el.scrollLeft)).toBe(0);
  await page.reload();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(track).toHaveCSS("animation-name", "none");
});
test("responsive layouts have no page overflow", async ({ page }) => {
  await page.goto("/projects/");
  const projectRoutes = await page
    .locator('.project-tile a[href^="/projects/"]')
    .evaluateAll((links) => links.map((link) => link.getAttribute("href")!));
  await page.goto("/writings/");
  const essayRoutes = await page
    .locator('.writing-link[href^="/writings/"]')
    .evaluateAll((links) => links.map((link) => link.getAttribute("href")!));
  const detailRoutes = [
    ...new Set([
      ...projectRoutes,
      ...essayRoutes,
      "/projects/digital-archive/",
    ]),
  ];
  expect(detailRoutes).toHaveLength(28);
  const routes = [
    "/",
    "/projects/",
    "/bio/",
    "/writings/",
    ...["video", "photography", "participation", "canvases"].map(
      (category) => `/projects/?category=${category}`,
    ),
    ...detailRoutes,
  ];
  test.setTimeout(90_000);
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      expect((await page.goto(route))?.status(), route).toBe(200);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${route} at ${width}`,
      ).toBe(true);
      if (["/", "/projects/"].includes(route) && [390, 1440].includes(width))
        await page.screenshot({
          path: `test-results/${route === "/" ? "home" : "projects"}-${width}.png`,
          fullPage: true,
        });
    }
  }
});
test("desktop dropdown hover, pointer bridge, click, keyboard and Escape", async ({
  page,
}) => {
  await page.goto("/");
  const menu = page.locator(".projects-menu");
  const toggle = page.getByRole("button", {
    name: "toggle project categories",
  });
  const submenu = page.locator("#project-submenu");
  await expect(submenu).toBeHidden();
  await menu
    .getByRole("link", { name: "/selected projects", exact: true })
    .hover();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await submenu.getByRole("link", { name: "/canvases", exact: true }).hover();
  await expect(submenu).toBeVisible();
  await page.mouse.move(0, 0);
  await expect(submenu).toBeHidden();
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Tab");
  await expect(
    submenu.getByRole("link", { name: "/video", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(submenu).toBeHidden();
  await expect(toggle).toBeFocused();
  await page.keyboard.press("Space");
  await expect(submenu).toBeVisible();
  await toggle.click();
  await expect(submenu).toBeHidden();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "/writings", exact: true })
    .click();
  await page.getByRole("button", { name: "toggle project categories" }).click();
  await page
    .locator("#project-submenu")
    .getByRole("link", { name: "/photography", exact: true })
    .click();
  await expect(page).toHaveURL(/category=photography/);
  await expect(page.locator(".project-tile:visible")).toHaveCount(8);
});

test("direct category links and browser history restore filters", async ({
  page,
}) => {
  await page.goto("/projects/?category=video");
  await expect(page.locator(".project-tile:visible")).toHaveCount(5);
  await expect(
    page.getByRole("button", { name: "/video", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "/photography", exact: true }).click();
  await expect(page.locator(".project-tile:visible")).toHaveCount(8);
  await page.getByRole("button", { name: "/all", exact: true }).click();
  await expect(page.locator(".project-tile:visible")).toHaveCount(22);
  await page.goBack();
  await expect(page.locator(".project-tile:visible")).toHaveCount(8);
  await page.goBack();
  await expect(
    page.getByRole("button", { name: "/video", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.goForward();
  await expect(page.locator(".project-tile:visible")).toHaveCount(8);
  await page.goto("/projects/?category=unknown");
  await expect(page.locator(".project-tile:visible")).toHaveCount(22);
});

test("touch disclosure on every page and a single shared archive URL", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 360, height: 780 },
    isMobile: true,
    hasTouch: true,
    baseURL: "http://127.0.0.1:4322",
  });
  const page = await context.newPage();
  for (const route of [
    "/",
    "/projects/",
    "/writings/",
    "/bio/",
    "/projects/los-angeles-one/",
    "/projects/digital-archive/",
  ]) {
    await page.goto(route);
    const toggle = page.getByRole("button", {
      name: "toggle project categories",
    });
    const submenu = page.locator("#project-submenu");
    await expect(submenu).toBeHidden();
    await toggle.tap();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(submenu).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(submenu.locator(".archive-link")).toHaveAttribute(
      "href",
      "/projects/digital-archive/",
    );
    await toggle.tap();
    await expect(submenu).toBeHidden();
  }
  await page.goto("/");
  await page.getByRole("button", { name: "toggle project categories" }).tap();
  await page
    .locator("#project-submenu")
    .getByRole("link", { name: "/video", exact: true })
    .tap();
  await expect(page).toHaveURL(/category=video/);
  await expect(page.locator(".project-tile:visible")).toHaveCount(5);
  await context.close();
});

test("kvartirnik slideshow advances automatically and accepts manual navigation", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("/projects/kvartirnik/");
  const slideshow = page.locator(".photo-show");
  const count = slideshow.locator(".count");
  await expect(page.locator("main img")).toHaveCount(1);
  await expect(slideshow.locator(".slide")).toHaveAttribute("src", /P1010039/);
  await expect(count).toHaveText("1 / 8");
  await page.clock.fastForward(5000);
  await expect(count).toHaveText("2 / 8");
  await slideshow.getByRole("button", { name: "Previous photo" }).click();
  await expect(count).toHaveText("1 / 8");
  await page.keyboard.press("ArrowLeft");
  await expect(count).toHaveText("8 / 8");
  await slideshow.getByRole("button", { name: "Next photo" }).click();
  await expect(count).toHaveText("1 / 8");
  await expect(
    slideshow.getByRole("button", { name: "Pause slideshow" }),
  ).toHaveCount(0);
  await expect(page.locator("main img")).toHaveCount(1);
});

test("kvartirnik responds to touch swipes in both directions", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    isMobile: true,
    hasTouch: true,
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  try {
    const page = await context.newPage();
    await page.goto("/projects/kvartirnik/");
    const stage = page.locator(".photo-show .stage");
    await stage.scrollIntoViewIfNeeded();
    const box = (await stage.boundingBox())!;
    const session = await context.newCDPSession(page);
    async function swipe(from: number, to: number) {
      const y = Math.round(box.y + box.height / 2);
      await session.send("Input.dispatchTouchEvent", {
        type: "touchStart",
        touchPoints: [{ x: from, y }],
      });
      await session.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: to, y }],
      });
      await session.send("Input.dispatchTouchEvent", {
        type: "touchEnd",
        touchPoints: [],
      });
    }
    const left = Math.round(box.x + box.width * 0.2);
    const right = Math.round(box.x + box.width * 0.8);
    await swipe(right, left);
    await expect(page.locator(".photo-show .count")).toHaveText("2 / 8");
    await swipe(left, right);
    await expect(page.locator(".photo-show .count")).toHaveText("1 / 8");
    await expect(
      page.getByRole("button", { name: "Pause slideshow" }),
    ).toBeHidden();
  } finally {
    await context.close();
  }
});

test("In Search of Volume uses its cover as the first of nine slides", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/projects/?category=participation");
  await page
    .locator(".project-tile")
    .getByRole("link", { name: /In Search of Volume/i })
    .first()
    .click();
  await expect(page).toHaveURL(/\/projects\/in-search-of-volume\//);
  await expect(page.locator("h1 a")).toHaveAttribute(
    "href",
    /garagemca\.org\/event\/in-search-of-volume-/,
  );
  await expect(
    page.locator("h2 a", { hasText: "Garage MCA – Teen Program" }),
  ).toHaveAttribute("href", /garagemca\.org\/event\/performative-reading-/);
  await expect(page.locator("main img")).toHaveCount(1);
  const slide = page.locator(".photo-show .slide");
  await expect(slide).toHaveAttribute("src", /1-104_resized/);
  await expect(page.locator(".photo-show figcaption")).toContainText(
    "Photo credit: Olga Gagua",
  );
  await expect(
    page.getByRole("button", { name: "Pause slideshow" }),
  ).toHaveCount(0);
  await expect(page.locator(".photo-show .count")).toHaveText("1 / 9");
  await page.getByRole("button", { name: "Next photo" }).click();
  await expect(slide).toHaveAttribute("src", /1-7_resized/);
});
