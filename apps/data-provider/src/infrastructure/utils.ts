import { FilterQuery, UpdateQuery } from 'mongoose';

export enum QueryType {
  FILTER = 'filter',
  // UPDATE = 'update', not used for now
}

export function buildQueryFromDTO(
  dto: Record<string, any>,
  type: QueryType,
  prefix: string = '',
): FilterQuery<any> | UpdateQuery<any> {
  const query: FilterQuery<any> | UpdateQuery<any> = {};

  if (Object.keys(dto).length === 0) {
    return query; // Empty DTO, return an empty object for 'find all' documents
  }

  for (const [key, value] of Object.entries(dto)) {
    const currentPath = prefix ? `${prefix}.${key}` : key;

    if (value !== null && typeof value !== 'undefined') {
      if (typeof value === 'object' && !(value instanceof Date) && !Array.isArray(value)) {
        Object.assign(query, buildQueryFromDTO(value, type, currentPath)); // Recursively process nested objects
      } else {
        query[currentPath] = value; // Directly add simple fields and arrays to the query
      }
    }
  }

  return query;
}
