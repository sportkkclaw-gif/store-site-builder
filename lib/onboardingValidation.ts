export type OnboardingBasicInfoInput = {
  name?: string;
  tagline?: string;
  phone?: string;
  line?: string;
  address?: string;
  googleMap?: string;
};

export type OnboardingBasicInfoErrors = Partial<Record<'storeName' | 'tagline' | 'phoneOrLine' | 'addressOrMap', string>>;

export type OnboardingBasicInfoValidationResult = {
  ok: boolean;
  errors: OnboardingBasicInfoErrors;
  normalized: Required<OnboardingBasicInfoInput>;
};

const obviousTestValues = new Set(['test', '測試', 'aaa', 'qqq']);
const googleMapsUrlPattern = /^https:\/\/((www\.)?maps\.google\.com|google\.com\/maps|www\.google\.com\/maps|goo\.gl\/maps|maps\.app\.goo\.gl)\//i;
const lineUrlPattern = /^https:\/\/(line\.me|lin\.ee)\//i;
const lineIdPattern = /^[A-Za-z0-9_.-]+$/;

function normalize(input: OnboardingBasicInfoInput): Required<OnboardingBasicInfoInput> {
  return {
    name: (input.name || '').trim(),
    tagline: (input.tagline || '').trim(),
    phone: (input.phone || '').trim(),
    line: (input.line || '').trim(),
    address: (input.address || '').trim(),
    googleMap: (input.googleMap || '').trim(),
  };
}

function onlyDigits(value: string) {
  return /^\d+$/.test(value);
}

function onlySymbols(value: string) {
  return value.length > 0 && !/[A-Za-z0-9\u3400-\u9FFF]/u.test(value);
}

function isObviousTestValue(value: string) {
  return obviousTestValues.has(value.toLowerCase());
}

function hasEnoughRealText(value: string, minLength: number) {
  return value.length >= minLength && !onlyDigits(value) && !onlySymbols(value) && !isObviousTestValue(value);
}

function isValidPhone(value: string) {
  const digits = value.replace(/\D/g, '');
  if (digits.length < 6) return false;
  if (!/^[0-9+\-\s()]+$/.test(value)) return false;
  if (/^(0{6,}|1{6,}|123456|1234567|12345678|123456789)$/.test(digits)) return false;
  return true;
}

function isValidLine(value: string) {
  if (!value) return false;
  if (/\s/.test(value)) return false;
  if (/^https?:\/\//i.test(value)) return lineUrlPattern.test(value);
  return value.length >= 3 && lineIdPattern.test(value) && !onlySymbols(value) && !isObviousTestValue(value);
}

function isValidAddress(value: string) {
  return hasEnoughRealText(value, 5);
}

function isValidGoogleMap(value: string) {
  return googleMapsUrlPattern.test(value);
}

export function validateOnboardingBasicInfo(input: OnboardingBasicInfoInput): OnboardingBasicInfoValidationResult {
  const normalized = normalize(input);
  const errors: OnboardingBasicInfoErrors = {};

  if (!hasEnoughRealText(normalized.name, 2)) {
    errors.storeName = '請填寫有效的店名。';
  }

  if (!hasEnoughRealText(normalized.tagline, 4)) {
    errors.tagline = '請填寫有效的品牌標語。';
  }

  const hasPhone = normalized.phone.length > 0;
  const hasLine = normalized.line.length > 0;
  if ((!hasPhone && !hasLine) || (hasPhone && !isValidPhone(normalized.phone)) || (hasLine && !isValidLine(normalized.line))) {
    errors.phoneOrLine = '請至少填寫電話或 LINE，讓客人可以聯絡你。';
  }

  const hasAddress = normalized.address.length > 0;
  const hasGoogleMap = normalized.googleMap.length > 0;
  if ((!hasAddress && !hasGoogleMap) || (hasAddress && !isValidAddress(normalized.address)) || (hasGoogleMap && !isValidGoogleMap(normalized.googleMap))) {
    errors.addressOrMap = '請至少填寫地址或 Google Maps，讓客人找得到店家。';
  }

  return { ok: Object.keys(errors).length === 0, errors, normalized };
}
