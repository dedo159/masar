const fs = require('fs');

const cssContent = 
@import "tailwindcss";

@plugin "tailwindcss-animate";

@custom-variant dark (&:is(.dark *));

@theme {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) + 8px);
}

:root {
  /* Vercel Light Theme */
  --background: #ffffff;
  --foreground: #171717;
  
  --card: #ffffff;
  --card-foreground: #171717;
  
  --popover: #ffffff;
  --popover-foreground: #171717;
  
  /* Primary Action - Vercel Black */
  --primary: #171717;
  --primary-foreground: #ffffff;
  
  /* Secondary / Muted - Grays */
  --secondary: #fafafa;
  --secondary-foreground: #171717;
  
  --muted: #fafafa;
  --muted-foreground: #666666; /* Gray 500 */
  
  --accent: #fafafa;
  --accent-foreground: #171717;
  
  /* Destructive - Ship Red */
  --destructive: #ff5b4f;
  --destructive-foreground: #ffffff;
  
  /* Borders and Inputs */
  --border: #eaeaea;
  --input: #eaeaea;
  --ring: #0070f3; /* Console Blue for focus rings */
  
  --radius: 6px; /* Vercel uses relatively small, sharp border radii */
}

.dark {
  /* Vercel Dark Theme */
  --background: #000000;
  --foreground: #ededed;
  
  --card: #000000;
  --card-foreground: #ededed;
  
  --popover: #000000;
  --popover-foreground: #ededed;
  
  --primary: #ededed;
  --primary-foreground: #000000;
  
  --secondary: #111111;
  --secondary-foreground: #ededed;
  
  --muted: #111111;
  --muted-foreground: #888888;
  
  --accent: #111111;
  --accent-foreground: #ededed;
  
  --destructive: #ff5b4f;
  --destructive-foreground: #ffffff;
  
  --border: #333333;
  --input: #333333;
  --ring: #0070f3;
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    /* Geist is Vercel's default, we can just use default sans */
    font-family: var(--font-geist-sans), system-ui, sans-serif;
  }
}

/* Vercel Specific Utility Classes */
@layer utilities {
  .vercel-card {
    @apply bg-card border border-border rounded-md shadow-sm transition-shadow duration-200 hover:shadow-md;
  }
  
  .vercel-gradient-text {
    @apply bg-clip-text text-transparent bg-gradient-to-r from-[#0070f3] to-[#ff5b4f];
  }
  
  .vercel-link {
    @apply text-[#0072f5] hover:underline decoration-1 underline-offset-4;
  }
}
\;

fs.writeFileSync('src/app/globals.css', cssContent, 'utf8');