
export function fastClone(objectToClone: any) {
  return (JSON.parse(JSON.stringify(objectToClone)));
}