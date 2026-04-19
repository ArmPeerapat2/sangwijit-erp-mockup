export const entityKinds = ['user', 'product', 'warehouse'];

export function isEntityId(value) {
  return typeof value === 'string' && value.length > 0;
}
