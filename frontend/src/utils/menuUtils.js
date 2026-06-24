import { slugify } from "./pageUtils";

export function createPageId() {
  return `page-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function getPageId(page) {
  return page?.pageId || page?.id || null;
}

export function ensurePageIds(pages = []) {
  return pages.map((page, index) => ({
    ...page,
    pageId: getPageId(page) || createPageId(),
    parentId: page.parentId || null,
    menuOrder: typeof page.menuOrder === "number" ? page.menuOrder : index,
  }));
}

export function pageMenuLink(page) {
  if (!page) return "#";
  if (page.pageType === "link") return page.link || "#";
  const slug = page.slug || slugify(page.title);
  return page.link?.startsWith("/") ? page.link : `/${slug}`;
}

export function countDescendants(pages, parentPageId) {
  const direct = pages.filter((p) => p.parentId === parentPageId);
  return direct.reduce((sum, child) => sum + 1 + countDescendants(pages, getPageId(child)), 0);
}

export function menuNodesToHeaderItems(nodes = []) {
  return nodes.map((node) => ({
    label: node.label,
    link: node.link,
    ...(node.children?.length
      ? { children: node.children.map((child) => ({ label: child.label, link: child.link })) }
      : {}),
  }));
}

export function buildMenuTree(pages = []) {
  const menuPages = ensurePageIds(pages)
    .filter((p) => p.visible !== false && p.showInHeader !== false)
    .sort((a, b) => (a.menuOrder ?? 0) - (b.menuOrder ?? 0));

  const nodes = new Map(
    menuPages.map((page) => {
      const pageId = getPageId(page);
      return [
        pageId,
        {
          pageId,
          label: page.title || "Untitled",
          link: pageMenuLink(page),
          visible: page.visible !== false,
          children: [],
        },
      ];
    })
  );

  const roots = [];
  menuPages.forEach((page) => {
    const pageId = getPageId(page);
    const node = nodes.get(pageId);
    if (!node) return;
    if (page.parentId && nodes.has(page.parentId)) {
      nodes.get(page.parentId).children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

/** Reorder dragged item to appear after target among siblings. */
export function reorderMenuPages(pages, draggedPageId, targetPageId) {
  const list = ensurePageIds([...pages]);
  const dragged = list.find((p) => getPageId(p) === draggedPageId);
  const target = list.find((p) => getPageId(p) === targetPageId);
  if (!dragged || !target || draggedPageId === targetPageId) return list;

  const parentId = target.parentId || null;
  const siblings = list
    .filter((p) => getPageId(p) !== draggedPageId && (p.parentId || null) === parentId)
    .sort((a, b) => (a.menuOrder ?? 0) - (b.menuOrder ?? 0));

  const targetIndex = siblings.findIndex((p) => getPageId(p) === targetPageId);
  const insertAt = targetIndex < 0 ? siblings.length : targetIndex + 1;
  const newSiblings = [...siblings];
  newSiblings.splice(insertAt, 0, { ...dragged, parentId });

  const orderMap = new Map(newSiblings.map((p, i) => [getPageId(p), i]));
  return list.map((p) => {
    const pageId = getPageId(p);
    if (pageId === draggedPageId) return { ...p, parentId, menuOrder: orderMap.get(pageId) ?? p.menuOrder };
    if (orderMap.has(pageId)) return { ...p, menuOrder: orderMap.get(pageId) };
    return p;
  });
}

export function setMenuParent(pages, pageId, parentId) {
  return ensurePageIds(pages).map((p) => (getPageId(p) === pageId ? { ...p, parentId: parentId || null } : p));
}
