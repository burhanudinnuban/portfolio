function openInNewTab(url: string) {
    var win = window.open(url, "_blank");
    win?.focus();
  }

export default openInNewTab;