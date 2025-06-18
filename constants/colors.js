// Updated Colors with improved professional palette
export const PRIMARY = '#007bff';
export const PRIMARY_LIGHT = '#E6F3FF';
export const PRIMARY_DARK = '#0056b3';

export const SUCCESS = '#2D7D32';
export const SUCCESS_LIGHT = '#E8F5E8';
export const WARNING = '#F57C00';
export const WARNING_LIGHT = '#FFF4E6';
export const INFO = '#1976D2';
export const INFO_LIGHT = '#E6F3FF';
export const PURPLE = '#7B1FA2';
export const PURPLE_LIGHT = '#F0E6FF';

export const BACKGROUND = '#FAFAFA';
export const BACKGROUND_SECONDARY = '#F8F9FA';
export const WHITE = '#FFFFFF';
export const BORDER = '#E9ECEF';
export const BORDER_LIGHT = '#F0F0F0';

export const TEXT_PRIMARY = '#212529';
export const TEXT_SECONDARY = '#6C757D';
export const TEXT_TERTIARY = '#ADB5BD';

export const SHADOW_COLOR = '#000000';
export const OVERLAY = 'rgba(0, 0, 0, 0.5)';

// Job type specific colors
export const JOB_TYPES = {
  'Full-time': {
    background: SUCCESS_LIGHT,
    text: SUCCESS,
  },
  'Part-time': {
    background: WARNING_LIGHT,
    text: WARNING,
  },
  'Contract': {
    background: INFO_LIGHT,
    text: INFO,
  },
  'Remote': {
    background: PURPLE_LIGHT,
    text: PURPLE,
  },
  default: {
    background: BACKGROUND_SECONDARY,
    text: TEXT_SECONDARY,
  },
};