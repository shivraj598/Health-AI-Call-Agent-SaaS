import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: [
  				'var(--font-manrope)',
  				'system-ui',
  				'sans-serif'
  			],
  			serif: [
  				'var(--font-serif)',
  				'Georgia',
  				'serif'
  			],
  			mono: [
  				'var(--font-mono)',
  				'ui-monospace',
  				'monospace'
  			]
  		},
  		colors: {
  			background: '#F7F6F3',
  			foreground: '#111111',
  			card: '#FFFFFF',
  			'card-foreground': '#111111',
  			popover: '#FFFFFF',
  			'popover-foreground': '#111111',
  			primary: {
  				DEFAULT: '#111111',
  				foreground: '#FFFFFF'
  			},
  			secondary: {
  				DEFAULT: '#EFEDE8',
  				foreground: '#111111'
  			},
  			muted: {
  				DEFAULT: '#F7F6F3',
  				foreground: '#787774'
  			},
  			accent: {
  				DEFAULT: '#EFEDE8',
  				foreground: '#111111'
  			},
  			border: '#EAEAEA',
  			input: '#EAEAEA',
  			ring: '#111111',
  		},
  		borderRadius: {
  			DEFAULT: '8px',
  			sm: '6px',
  			md: '8px',
  			lg: '10px',
  			xl: '12px',
  			'2xl': '14px',
  			'3xl': '18px'
  		},
  		boxShadow: {
  			xs: '0 1px 2px 0 rgb(13 115 119 / 0.04)',
  			soft: '0 1px 3px 0 rgb(13 115 119 / 0.06), 0 1px 2px -1px rgb(13 115 119 / 0.04)',
  			card: '0 2px 6px -1px rgb(13 115 119 / 0.07), 0 1px 3px -1px rgb(13 115 119 / 0.05)',
  			elevated: '0 8px 20px -4px rgb(13 115 119 / 0.10), 0 4px 8px -4px rgb(13 115 119 / 0.07)',
  			'glow-teal': '0 0 0 3px rgb(20 168 181 / 0.15), 0 2px 8px rgb(20 168 181 / 0.18)',
  			'glow-teal-lg': '0 0 0 4px rgb(20 168 181 / 0.12), 0 4px 16px rgb(20 168 181 / 0.22)',
  			'glow-green': '0 0 0 3px rgb(16 185 129 / 0.15)',
  			'inner-teal': 'inset 0 1px 0 rgb(20 168 181 / 0.12)',
  			dropdown: '0 4px 16px -2px rgb(13 115 119 / 0.10), 0 2px 8px -2px rgb(13 115 119 / 0.06)'
  		},
  		animation: {
  			'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  			'spin-slow': 'spin 3s linear infinite',
  			'wave': 'wave 1.2s ease-in-out infinite',
  			'glow': 'glow 2s ease-in-out infinite',
  			'float': 'float 6s ease-in-out infinite',
  			'slide-in': 'slideIn 0.25s ease-out',
  			'fade-up': 'fadeUp 0.35s ease-out both',
  			'shimmer': 'shimmer 1.6s linear infinite',
  			'pop-in': 'popIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
  		keyframes: {
  			wave: {
  				'0%, 100%': {
  					transform: 'scaleY(1)'
  				},
  				'50%': {
  					transform: 'scaleY(2)'
  				}
  			},
  			glow: {
  				'0%, 100%': {
  					boxShadow: '0 0 20px rgb(20 168 181 / 0.2)'
  				},
  				'50%': {
  					boxShadow: '0 0 36px rgb(20 168 181 / 0.45)'
  				}
  			},
  			float: {
  				'0%, 100%': {
  					transform: 'translateY(0px)'
  				},
  				'50%': {
  					transform: 'translateY(-8px)'
  				}
  			},
  			slideIn: {
  				from: {
  					opacity: '0',
  					transform: 'translateX(-6px)'
  				},
  				to: {
  					opacity: '1',
  					transform: 'translateX(0)'
  				}
  			},
  			fadeUp: {
  				from: {
  					opacity: '0',
  					transform: 'translateY(10px)'
  				},
  				to: {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			shimmer: {
  				'0%': {
  					backgroundPosition: '-200% 0'
  				},
  				'100%': {
  					backgroundPosition: '200% 0'
  				}
  			},
  			popIn: {
  				from: {
  					opacity: '0',
  					transform: 'scale(0.92)'
  				},
  				to: {
  					opacity: '1',
  					transform: 'scale(1)'
  				}
  			},
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		backdropBlur: {
  			xs: '2px'
  		},
  		spacing: {
  			'62': '15.5rem',
  			'72': '18rem'
  		}
  	}
  },
  plugins: [],
};

export default config;
