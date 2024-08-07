import * as speakeasy from 'speakeasy';
import * as geoip from 'geoip-lite';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException } from '@nestjs/common';

/**
 * Generates a random IP address
 * @returns string with the IP address
 */
export function generateRandomIP(): string {
  const octets = Array.from({ length: 4 }, () => Math.floor(Math.random() * 256));
  return octets.join('.');
}

/**
 * Generates TOTP code based on the secret with the base32 encoding
 * @param secret secret key for the TOTP code
 * @param encoding default is base32, but can be changed to ascii, hex, or base64
 * @returns string with the TOTP code
 */
export function generateTotpCode(secret: string, encoding: speakeasy.Encoding = 'base32'): string {
  return speakeasy.totp({
    secret: secret,
    encoding,
  });
}

/**
 * Returns the location of the IP address
 * @param ip string with the IP address
 * @returns location in the format of 'country, city' or 'unknown' if the location is not found
 */
export function getLocationByIp(ip: string): string {
  const locationLookup = geoip.lookup(ip);
  if (!locationLookup) return 'unknown';
  return `${locationLookup.country}, ${locationLookup.city}`;
}

export function generateUUID(): string {
  return uuidv4();
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 * Formats milliseconds into a human-readable format like '1d 2h 3m 4s 5ms'
 * or '23ms' or '3d 23ms'; function support days, hours, minutes, seconds and milliseconds
 * @returns string with the formatted time
 * @param milliseconds
 */
export function formatMilliseconds(milliseconds: number): string {
  if (milliseconds === 0) return '0ms';

  let remaining = milliseconds;

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  remaining -= days * (1000 * 60 * 60 * 24);

  const hours = Math.floor(remaining / (1000 * 60 * 60));
  remaining -= hours * (1000 * 60 * 60);

  const minutes = Math.floor(remaining / (1000 * 60));
  remaining -= minutes * (1000 * 60);

  const seconds = Math.floor(remaining / 1000);
  remaining -= seconds * 1000;

  const parts = [];
  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (seconds) parts.push(`${seconds}s`);
  if (remaining) parts.push(`${remaining}ms`);

  return parts.join(' ');
}

export function extractOAuthToken(authorizationHeaderValue: string): string {
  if (!authorizationHeaderValue) {
    // logger?.error('Authorization header is missing');
    throw new BadRequestException('Authorization header is missing');
  }
  const parts = authorizationHeaderValue.split(' ');
  if (parts.length !== 2) {
    // logger?.error('Invalid authorization header format');
    throw new BadRequestException('Invalid authorization header format');
  }
  const [scheme, oAuthToken] = parts;
  if (scheme.toLowerCase() !== 'bearer') {
    // logger?.error('Invalid authorization scheme');
    throw new BadRequestException('Invalid authorization scheme');
  }
  if (!oAuthToken) {
    // logger?.error('Token is missing');
    throw new BadRequestException('Token is missing');
  }
  return oAuthToken;
}
