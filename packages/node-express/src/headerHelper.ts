import { logger } from "@link1900/node-logger";
import { parseIntegerString } from "@link1900/node-util";

export interface CacheControlFields {
  maxAge?: number;
  cacheMode: "no-cache" | "allow-cache" | "only-cache";
}

export function getIdTokenFromAuthorizationHeader(
  authHeader?: string
): string | undefined {
  if (authHeader) {
    logger.debug("found authorization header");
    if (authHeader.startsWith("Bearer ")) {
      return authHeader.split("Bearer ")[1];
    } else {
      return authHeader;
    }
  } else {
    logger.debug("no authorization header found");
    return undefined;
  }
}

export function getCacheControlContextFromHeaders(
  cacheControlHeader?: string
): CacheControlFields {
  try {
    if (!cacheControlHeader) {
      return {
        cacheMode: "allow-cache",
      };
    }

    const cacheControlParts = cacheControlHeader
      .toLowerCase()
      .split(",")
      .map((stringField) =>
        stringField
          .trim()
          .split("=")
          .map((stringPart) => stringPart.trim())
      );

    const cacheControl: CacheControlFields = {
      cacheMode: "allow-cache",
    };

    const maxAgePart = cacheControlParts.find((part) => part[0] === "max-age");
    if (maxAgePart) {
      const ageNumber = parseIntegerString(maxAgePart[1]);
      if (ageNumber !== undefined) {
        cacheControl.maxAge = Math.max(ageNumber, 0);
      }
    }

    if (cacheControlParts.find((part) => part[0] === "only-if-cached")) {
      cacheControl.cacheMode = "only-cache";
    }

    if (cacheControlParts.find((part) => part[0] === "no-store")) {
      cacheControl.cacheMode = "no-cache";
    }

    if (cacheControlParts.find((part) => part[0] === "no-cache")) {
      cacheControl.cacheMode = "no-cache";
    }

    return cacheControl;
  } catch (error) {
    logger.error("Error parsing cache control header", error);
    return {
      cacheMode: "allow-cache",
    };
  }
}
