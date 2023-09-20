export function buildRoutePath(path) {
  const routeParameteresRegex = /:([a-zA-Z]+)/g;
  //prettier-ignore
  const pathWithParams = path.replaceAll(routeParameteresRegex, "(?<$1>[a-z0-9\-_]+)");

  const pathRegex = new RegExp(`^${pathWithParams}`);

  return pathRegex;
}
