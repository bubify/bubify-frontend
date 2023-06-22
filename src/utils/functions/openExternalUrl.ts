export function openExternalUrl(url: string | undefined | null) {
  if (!url) return;
  window.open(url);
}

export function openExternalUrlSameTab(url: string | undefined | null) {
  if (!url) return;
  window.open(url, "_self");
}

export function openZoomUrl(id: string | null) {
  if (!id) return;
  window.open("https://uu-se.zoom.us/j/" + id);
}