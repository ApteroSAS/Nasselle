// utils/domainGenerator.ts
import {adjectives, animals, uniqueNamesGenerator} from 'unique-names-generator';
import {checkDomainAvailability} from '@/providers/mesh-router/MeshRouterAPI';

/**
 * Generates a fun and silly domain name, checks its availability, and ensures it meets the required criteria.
 * @param maxAttempts Number of attempts to find an available domain before appending a suffix.
 * @returns A domain name that is available or a default/fallback name.
 * @throws An error if unable to generate an available domain name.
 */
export const generateAvailableDomainName = async (maxAttempts: number = 3): Promise<string> => {
  // Utility function to generate a random 4-character alphanumeric string
  const generateRandomSuffix = (): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let suffix = '';
    for (let i = 0; i < 4; i++) {
      suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return suffix;
  };

  // Utility function to sanitize and ensure the domain name contains only a-z and 0-9
  const sanitizeDomainName = (name: string): string => {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '');
  };

  let attempts = 0;
  let generatedName = '';
  let isAvailable = false;

  while (attempts < maxAttempts && !isAvailable) {
    // Generate a unique name using adjectives and animals
    const randomName = uniqueNamesGenerator({
      dictionaries: [adjectives, animals],
      separator: '',
      style: 'lowerCase'
    });

    // Sanitize the name to ensure only a-z and 0-9
    generatedName = sanitizeDomainName(randomName);

    // Check availability
    try {
      isAvailable = await checkDomainAvailability(generatedName);
      if (!isAvailable) {
        attempts += 1;
      }
    } catch (error) {
      console.error(`Error checking availability for ${generatedName}:`, error);
      // Optionally, decide whether to retry or break
      attempts += 1;
    }
  }

  // If not available after maxAttempts, append a random suffix
  if (!isAvailable) {
    const suffix = generateRandomSuffix();
    generatedName = `${generatedName}${suffix}`;
    try {
      isAvailable = await checkDomainAvailability(generatedName);
      if (!isAvailable) {
        throw new Error('Unable to generate an available domain name.');
      }
    } catch (error) {
      console.error(`Error checking availability for ${generatedName}:`, error);
      // Fallback to a default domain name or handle accordingly
      generatedName = 'defaultdomain';
    }
  }

  return generatedName;
};
