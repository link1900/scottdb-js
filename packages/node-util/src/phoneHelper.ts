import { isValidString } from "@link1900/node-validation";
import { PhoneNumberUtil, PhoneNumberType } from "google-libphonenumber";

/**
 * Takes a phone number and does analysis it to determine if it is a mobile or national number.
 */
export function categorizePhoneNumber(
  phone?: string,
  isoCountryCode?: string
): { mobile?: string; phone?: string } {
  if (!phone || !isValidString(phone, { min: 1, max: 50 })) {
    return {
      mobile: undefined,
      phone: undefined,
    };
  }

  if (!isoCountryCode) {
    return {
      mobile: undefined,
      phone,
    };
  }

  if (isNumberMobileType(phone, isoCountryCode)) {
    return {
      mobile: phone,
      phone: undefined,
    };
  }

  return {
    mobile: undefined,
    phone,
  };
}

export function isNumberMobileType(
  phone: string,
  isoCountryCode: string
): boolean {
  const type = getNumberType(phone, isoCountryCode);
  return type === PhoneNumberType.MOBILE;
}

export function getNumberType(
  phone: string,
  isoCountryCode: string
): PhoneNumberType {
  try {
    const phoneNumber = getPhoneUtil().parse(phone, isoCountryCode);
    return getPhoneUtil().getNumberType(phoneNumber);
  } catch (error) {
    return PhoneNumberType.UNKNOWN;
  }
}

export function getPhoneUtil(): PhoneNumberUtil {
  return PhoneNumberUtil.getInstance();
}
