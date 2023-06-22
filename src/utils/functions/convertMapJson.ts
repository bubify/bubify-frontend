export function mapToJson(map: any) {
  return JSON.stringify([...map]);
}

export function jsonToMap(jsonStr: any): Map<any, any> {
  return new Map(JSON.parse(jsonStr));
}
