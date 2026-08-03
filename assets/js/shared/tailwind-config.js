/* -----------------------------------------------------------------------------
   INSPIRE TRAVELS & TOURS - SHARED TAILWIND DESIGN TOKENS
   -----------------------------------------------------------------------------

   Author: Zig Zag AI
   Description: One shared Tailwind config for every page on the site
   Purpose: Keeps fonts, colors, shadows and radius the same on all pages

   This file must load AFTER the Tailwind CDN script and BEFORE the page body.
   Every page links this same file, so a token only changes in one place.

   -----------------------------------------------------------------------------
*/

tailwind.config = {
	theme: {
		extend: {
			screens: {
				'xxs': '320px',
				'xs': '375px'
			},

			/* Type roles. Use these names, not the raw font names.
			   display = big headlines, sans = body text, mono = small labels. */
			fontFamily: {
				'display': ['Newsreader', 'Georgia', 'serif'],
				'sans': ['Geist', 'system-ui', 'sans-serif'],
				'mono': ['Geist Mono', 'ui-monospace', 'monospace'],
				/* Legacy alias kept as a safety net for future external snippets. */
				'serif': ['Newsreader', 'Georgia', 'serif']
			},

			colors: {
				primary: {
					DEFAULT: 'oklch(0.35 0.15 195)',
					foreground: 'oklch(0.98 0.01 85)'
				},
				secondary: {
					DEFAULT: 'oklch(0.65 0.12 35)',
					foreground: 'oklch(0.98 0.01 85)'
				},
				accent: {
					DEFAULT: 'oklch(0.75 0.15 75)',
					foreground: 'oklch(0.15 0.02 45)'
				},
				background: 'oklch(0.98 0.035 105)',
				foreground: 'oklch(0.15 0.02 45)',
				muted: {
					DEFAULT: 'oklch(0.95 0.01 85)',
					foreground: 'oklch(0.45 0.02 45)'
				},
				card: {
					DEFAULT: 'oklch(1 0 0)',
					foreground: 'oklch(0.15 0.02 45)'
				},
				border: 'oklch(0.9 0.01 85)'
			},

			/* One radius rule for the whole site.
			   pill for buttons, card for cards, inner for things inside a card. */
			borderRadius: {
				/* The markup mixes five different corner sizes. Pulling the
				   big ones closer together makes the shapes agree with
				   each other, without touching every single class. */
				'lg': '0.625rem',
				'xl': '0.875rem',
				'2xl': '1rem',
				'3xl': '1.25rem',

				'inner': '0.5rem',
				'card': '1rem',
				'pill': '9999px'
			},

			/* Shadows tinted warm to match the cream background.
			   Plain black shadows made the light sections look dirty. */
			boxShadow: {
				/* These four names already exist in the markup over 120 times.
				   Redefining them here warms up the whole site at once. */
				'md': '0 1px 2px oklch(0.35 0.05 60 / 0.04), 0 4px 12px oklch(0.35 0.05 60 / 0.05)',
				'lg': '0 2px 4px oklch(0.35 0.05 60 / 0.05), 0 12px 28px oklch(0.35 0.05 60 / 0.09)',
				'xl': '0 4px 8px oklch(0.30 0.06 60 / 0.06), 0 18px 40px oklch(0.30 0.06 60 / 0.11)',
				'2xl': '0 4px 8px oklch(0.30 0.06 60 / 0.07), 0 24px 56px oklch(0.30 0.06 60 / 0.13)',

				/* Friendlier names for new markup. */
				'soft': '0 1px 2px oklch(0.35 0.05 60 / 0.04), 0 4px 12px oklch(0.35 0.05 60 / 0.05)',
				'lift': '0 2px 4px oklch(0.35 0.05 60 / 0.05), 0 12px 28px oklch(0.35 0.05 60 / 0.09)',
				'deep': '0 4px 8px oklch(0.30 0.06 60 / 0.07), 0 24px 56px oklch(0.30 0.06 60 / 0.13)',
				'glow': '0 8px 32px oklch(0.75 0.15 75 / 0.22)'
			},

			/* Section rhythm. Sections should not all share one padding value. */
			spacing: {
				'section': '5.5rem',
				'section-lg': '8rem'
			},

			letterSpacing: {
				'display': '-0.03em',
				'label': '0.18em'
			},

			animation: {
				'spin-slow': 'spin 3s linear infinite',
				'fade-in': 'fadeIn 1s ease-out forwards',
				'float': 'float 3s ease-in-out infinite',
				'bounce-slow': 'bounce 2s infinite'
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				float: {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				}
			}
		}
	}
};
