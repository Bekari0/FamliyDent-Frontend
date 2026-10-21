// Bootstrap data is available only to migration scripts, never to the browser bundle.
export async function getContentOrFallback<T>(_type: string, values: T[]): Promise<T[]> {
  return structuredClone(values);
}
