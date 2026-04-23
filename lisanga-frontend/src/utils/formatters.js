const parseApiDate = (dateValue) => {
  if (!dateValue) return null;
  if (dateValue instanceof Date) return dateValue;

  const raw = String(dateValue).trim();
  if (!raw) return null;

  // Normalise les variantes PostgreSQL:
  // - "YYYY-MM-DD HH:mm:ss(.sss)"
  // - "YYYY-MM-DD HH:mm:ss(.sss)+00"
  // - "YYYY-MM-DD HH:mm:ss(.sss)+0000"
  // - "YYYY-MM-DD HH:mm:ss(.sss)+00:00"
  const postgresPattern =
    /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2}(?:\.\d+)?)(?:\s*(Z|[+-]\d{2}(?::?\d{2})?))?$/;

  const match = raw.match(postgresPattern);
  if (match) {
    const [, datePart, timePart, timezonePart] = match;
    const baseIso = `${datePart}T${timePart}`;

    // Cas sans timezone explicite : on compare local vs UTC et on garde le plus cohérent.
    if (!timezonePart) {
      const localCandidate = new Date(baseIso);
      const utcCandidate = new Date(`${baseIso}Z`);

      if (Number.isNaN(localCandidate.getTime())) return utcCandidate;
      if (Number.isNaN(utcCandidate.getTime())) return localCandidate;

      const now = Date.now();
      const localDiff = Math.abs(now - localCandidate.getTime());
      const utcDiff = Math.abs(now - utcCandidate.getTime());

      return utcDiff < localDiff ? utcCandidate : localCandidate;
    }

    let normalizedTz = timezonePart;
    if (/^[+-]\d{2}$/.test(normalizedTz)) {
      normalizedTz = `${normalizedTz}:00`;
    } else if (/^[+-]\d{4}$/.test(normalizedTz)) {
      normalizedTz = `${normalizedTz.slice(0, 3)}:${normalizedTz.slice(3)}`;
    }

    return new Date(`${baseIso}${normalizedTz}`);
  }

  return new Date(raw);
};

const relativeTimeFormatter = new Intl.RelativeTimeFormat('fr-FR', {
  numeric: 'always',
  style: 'long',
});

const getRelativeTimeLabel = (date) => {
  const now = Date.now();
  const target = date.getTime();

  if (Number.isNaN(target)) return 'Date inconnue';

  const diffMs = target - now;
  const absDiffMs = Math.abs(diffMs);

  // Moins d'une minute -> "À l'instant"
  if (absDiffMs < 60 * 1000) {
    return "À l'instant";
  }

  const units = [
    { unit: 'year', ms: 365 * 24 * 60 * 60 * 1000 },
    { unit: 'month', ms: 30 * 24 * 60 * 60 * 1000 },
    { unit: 'week', ms: 7 * 24 * 60 * 60 * 1000 },
    { unit: 'day', ms: 24 * 60 * 60 * 1000 },
    { unit: 'hour', ms: 60 * 60 * 1000 },
    { unit: 'minute', ms: 60 * 1000 },
  ];

  for (const { unit, ms } of units) {
    if (absDiffMs >= ms) {
      // Math.trunc évite qu'un 59m30 soit affiché "60 minutes"
      const value = Math.trunc(diffMs / ms);
      return relativeTimeFormatter.format(value, unit);
    }
  }

  return "À l'instant";
};

export const formatDate = (dateString) => {
  const date = parseApiDate(dateString);
  if (!date || Number.isNaN(date.getTime())) return 'Date inconnue';
  return getRelativeTimeLabel(date);
};

export const formatDateLong = (dateString) => {
  const date = parseApiDate(dateString);
  if (!date || Number.isNaN(date.getTime())) return 'Date inconnue';
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return date.toLocaleDateString('fr-FR', options);
};

export const formatDateShort = (dateString) => {
  const date = parseApiDate(dateString);
  if (!date || Number.isNaN(date.getTime())) return 'Date inconnue';
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  };
  return date.toLocaleDateString('fr-FR', options);
};

export const formatNumber = (num) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Octets';
  
  const k = 1024;
  const sizes = ['Octets', 'Ko', 'Mo', 'Go'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const generateExcerpt = (content, maxLength = 150) => {
  const cleanContent = content.replace(/\n/g, ' ').trim();
  return truncateText(cleanContent, maxLength);
};

export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};
