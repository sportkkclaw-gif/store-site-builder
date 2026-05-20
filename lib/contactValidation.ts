export type ContactValidationResult = {
  ok: boolean;
  errors: string[];
  normalized: {
    name: string;
    email: string;
    lineId: string;
  };
};

const invalidNameValues = new Set(['test', '測試']);
const obviousRandomValues = new Set(['asdf', 'qwer', 'qwerty', 'testtest', 'aaaa', 'xxxxx', '亂碼']);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const lineIdPattern = /^[A-Za-z0-9_.-]+$/;
const lineUrlPattern = /^https:\/\/(line\.me|lin\.ee)\//i;

function hasLetterOrCjk(value: string) {
  return /[A-Za-z\u3400-\u9FFF]/u.test(value);
}

function onlySymbols(value: string) {
  return value.length > 0 && !/[A-Za-z0-9\u3400-\u9FFF]/u.test(value);
}

function isInvalidTestValue(value: string) {
  return invalidNameValues.has(value.toLowerCase()) || obviousRandomValues.has(value.toLowerCase());
}

export function normalizeContactFields(input: { name?: string; email?: string; lineId?: string }) {
  return {
    name: (input.name || '').trim(),
    email: (input.email || '').trim().toLowerCase(),
    lineId: (input.lineId || '').trim(),
  };
}

export function validateContactFields(input: { name?: string; email?: string; lineId?: string }): ContactValidationResult {
  const normalized = normalizeContactFields(input);
  const errors: string[] = [];
  const { name, email, lineId } = normalized;

  if (
    name.length < 2 ||
    /^\d+$/.test(name) ||
    onlySymbols(name) ||
    !hasLetterOrCjk(name) ||
    isInvalidTestValue(name)
  ) {
    errors.push('請填寫有效的聯絡人姓名。');
  }

  if (!email && !lineId) {
    errors.push('請至少填寫 Email 或 LINE ID，方便我們聯絡你。');
  }

  if (email && (!emailPattern.test(email) || /\s/.test(input.email || ''))) {
    errors.push('Email 格式不正確。');
  }

  if (lineId) {
    const isLineUrl = lineUrlPattern.test(lineId);
    const isPlainLineId = lineId.length >= 3 && lineIdPattern.test(lineId) && !onlySymbols(lineId) && !isInvalidTestValue(lineId);
    if (/\s/.test(lineId) || (!isLineUrl && !isPlainLineId)) {
      errors.push('LINE ID 格式不正確。');
    }
  }

  return { ok: errors.length === 0, errors: Array.from(new Set(errors)), normalized };
}
