//Copied unexported functions from @angular/router/src/url_tree
import { UrlTree, UrlSegment, PRIMARY_OUTLET } from '@angular/router';
//UrlSegmentGroup not exported, just use any.
type UrlSegmentGroup = any;

export function containsTree(container: UrlTree, containee: UrlTree, exact: boolean): boolean {
  if (exact) {
    return equalSegmentGroups(container.root, containee.root);
  } else {
    return containsSegmentGroup(container.root, containee.root);
  }
}

function equalSegmentGroups(container: UrlSegmentGroup, containee: UrlSegmentGroup): boolean {
  if (!equalPath(container.segments, containee.segments)) return false;
  if (container.numberOfChildren !== containee.numberOfChildren) return false;
  for (let c in containee.children) {
    if (!container.children[c]) return false;
    if (!equalSegmentGroups(container.children[c], containee.children[c])) return false;
  }
  return true;
}

function containsSegmentGroup(container: UrlSegmentGroup, containee: UrlSegmentGroup): boolean {
  return containsSegmentGroupHelper(container, containee, containee.segments);
}

function containsSegmentGroupHelper(
    container: UrlSegmentGroup, containee: UrlSegmentGroup, containeePaths: UrlSegment[]): boolean {
  if (container.segments.length > containeePaths.length) {
    const current = container.segments.slice(0, containeePaths.length);
    if (!equalPath(current, containeePaths)) return false;
    if (containee.hasChildren()) return false;
    return true;

  } else if (container.segments.length === containeePaths.length) {
    if (!equalPath(container.segments, containeePaths)) return false;
    for (let c in containee.children) {
      if (!container.children[c]) return false;
      if (!containsSegmentGroup(container.children[c], containee.children[c])) return false;
    }
    return true;

  } else {
    const current = containeePaths.slice(0, container.segments.length);
    const next = containeePaths.slice(container.segments.length);
    if (!equalPath(container.segments, current)) return false;
    if (!container.children[PRIMARY_OUTLET]) return false;
    return containsSegmentGroupHelper(container.children[PRIMARY_OUTLET], containee, next);
  }
}

export function equalPath(a: UrlSegment[], b: UrlSegment[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; ++i) {
    if (a[i].path !== b[i].path) return false;
  }
  return true;
}
