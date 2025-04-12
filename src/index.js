import fs from 'node:fs';

import palettes from './palettes.json' with { type: 'json' };
import tokenizedTheme from './tokenized-theme.json' with { type: 'json' };

(function build() {
  for (const palette of palettes) {
    const theme = {
      name: palette.name,
      type: palette.type,
      colors: {},
      tokenColors: []
    };

    for (const [key, value] of Object.entries(tokenizedTheme.colors)) {
      const [token, alpha] = value.replace('$', '').split('/');

      const color = palette.colors.find(color => color.alias === token);

      theme.colors[key] = alpha ? color.hex.concat(alpha) : color.hex;
    }

    for (const tokenColor of tokenizedTheme.tokenColors) {
      if (tokenColor.settings?.foreground) {
        const [token, alpha] = tokenColor.settings.foreground
          .replace('$', '')
          .split('/');

        const color = palette.colors.find(color => color.alias === token);

        tokenColor.settings.foreground = alpha
          ? color.hex.concat(alpha)
          : color.hex;
      }

      theme.tokenColors.push(tokenColor);
    }

    fs.writeFileSync(
      `themes/${palette.alias}-color-theme.json`,
      JSON.stringify(theme, null, 2)
    );
  }
})();
