import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const scaleFont = (size) => size * (width / 375); // Scale font based on standard iPhone 6/7/8 width

// Typography
export const FONT_SIZE_XS = scaleFont(12);
export const FONT_SIZE_SM = scaleFont(14);
export const FONT_SIZE_MD = scaleFont(16);
export const FONT_SIZE_LG = scaleFont(18);
export const FONT_SIZE_XL = scaleFont(20);
export const FONT_SIZE_XXL = scaleFont(24);
export const FONT_SIZE_XXXL = scaleFont(28);

export const LINE_HEIGHT_SM = scaleFont(18);
export const LINE_HEIGHT_MD = scaleFont(22);
export const LINE_HEIGHT_LG = scaleFont(26);
export const LINE_HEIGHT_XL = scaleFont(30);

// Spacing
export const SPACING_XS = 4;
export const SPACING_SM = 8;
export const SPACING_MD = 12;
export const SPACING_LG = 16;
export const SPACING_XL = 20;
export const SPACING_XXL = 24;
export const SPACING_XXXL = 32;

// Responsive spacing (percentage based)
export const PADDING_SCALE = 0.05; // 5% of screen width/height
export const MARGIN_SCALE = 0.015; // 1.5% of screen height
export const MARGIN_MD_SCALE = 0.015; // 1.5% of screen height
export const MARGIN_SM_SCALE = 0.008; // 0.8% of screen height
export const MARGIN_LG_SCALE = 0.03; // 3% of screen height
export const SCROLL_PADDING_SCALE = 0.05; // 5% of screen height
export const LABEL_WIDTH_SCALE = 0.3; // 30% of screen width

// Fixed spacing for consistent design
export const PADDING_XS = 4;
export const PADDING_SM = 8;
export const PADDING_MD = 12;
export const PADDING_LG = 16;
export const PADDING_XL = 20;
export const PADDING_XXL = 24;

export const MARGIN_XS = 4;
export const MARGIN_SM = 8;
export const MARGIN_MD = 12;
export const MARGIN_LG = 16;
export const MARGIN_XL = 20;
export const MARGIN_XXL = 24;

// Border and radius
export const BORDER_WIDTH = 1;
export const BORDER_RADIUS_SM = 8;
export const BORDER_RADIUS = 12;
export const BORDER_RADIUS_LG = 16;
export const BORDER_RADIUS_XL = 20;
export const BORDER_RADIUS_ROUND = 24;

// Component specific
export const BUTTON_HEIGHT = 48;
export const BUTTON_HEIGHT_SM = 36;
export const BUTTON_HEIGHT_LG = 56;

export const INPUT_HEIGHT = 48;
export const SEARCH_HEIGHT = 48;

export const CARD_PADDING = 20;
export const SCREEN_PADDING = 20;

// Shadow
export const SHADOW_OFFSET = {
  width: 0,
  height: 2,
};
export const SHADOW_OPACITY = 0.04;
export const SHADOW_RADIUS = 8;
export const ELEVATION = 2;