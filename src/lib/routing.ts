const NAVIGATE_EVENT = "app:navigate";

function emitNavigate() {
  window.dispatchEvent(new Event(NAVIGATE_EVENT));
}

export function navigateTo(path: string) {
  window.history.pushState({}, "", path);
  emitNavigate();
}

export function replaceTo(path: string) {
  window.history.replaceState({}, "", path);
  emitNavigate();
}

export function buildHomeSectionPath(sectionId?: string) {
  return sectionId ? `/#${sectionId}` : "/";
}

export function buildProjectPath(slug: string) {
  return `/projects/${slug}`;
}

export function isProjectDetailPath(pathname: string) {
  return /^\/projects\/[^/]+\/?$/.test(pathname);
}

export function getProjectSlugFromPath(pathname: string) {
  const match = pathname.match(/^\/projects\/([^/]+)\/?$/);
  return match?.[1] ?? null;
}

export function subscribeNavigation(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener(NAVIGATE_EVENT, callback);

  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(NAVIGATE_EVENT, callback);
  };
}
