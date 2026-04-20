export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);
  
  if (diffSec < 60) {
    return 'À l\'instant';
  } else if (diffMin < 60) {
    return `il y a ${diffMin} minute${diffMin > 1 ? 's' : ''}`;
  } else if (diffHour < 24) {
    return `il y a ${diffHour} heure${diffHour > 1 ? 's' : ''}`;
  } else if (diffDay < 7) {
    return `il y a ${diffDay} jour${diffDay > 1 ? 's' : ''}`;
  } else if (diffWeek < 4) {
    return `il y a ${diffWeek} semaine${diffWeek > 1 ? 's' : ''}`;
  } else if (diffMonth < 12) {
    return `il y a ${diffMonth} mois`;
  } else {
    return `il y a ${diffYear} an${diffYear > 1 ? 's' : ''}`;
  }
};

export const formatDateLong = (dateString) => {
  const date = new Date(dateString);
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
  const date = new Date(dateString);
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
