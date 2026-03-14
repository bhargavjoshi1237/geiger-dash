# Geiger Dash - Database Schema

This document describes the database schema and migration files for the Geiger Dash application.

## Database Structure

```
database/
├── init/           # Initial migration files
│   ├── changelog.sql
│   └── blog.sql
└── scripts/        # Utility scripts
```

## Tables

### Changelog Tables

#### `dash_changelog`
Stores product update releases and version information.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| version | TEXT | Version number (e.g., "1.2.0") |
| title | TEXT | Release title |
| description | TEXT | Brief description |
| category | TEXT | Type: feature, improvement, bugfix, breaking |
| product | TEXT | Product: geiger-flow, geiger-notes, geiger-dash, geiger-dam, geiger-grey |
| release_date | TIMESTAMP | Date of release |
| is_featured | BOOLEAN | Whether to highlight this release |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### `dash_changelog_items`
Detailed items within each changelog release.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| changelog_id | UUID | Foreign key to dash_changelog |
| type | TEXT | Type: added, changed, fixed, removed, deprecated |
| description | TEXT | Item description |
| created_at | TIMESTAMP | Creation timestamp |

### Blog Tables

#### `dash_blog_posts`
Blog articles and posts.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | TEXT | Post title |
| slug | TEXT | URL-friendly identifier (unique) |
| excerpt | TEXT | Brief summary |
| content | TEXT | Full post content |
| author_id | UUID | Foreign key to auth.users |
| author_name | TEXT | Display name of author |
| author_avatar | TEXT | URL to author avatar |
| category | TEXT | Post category |
| tags | TEXT[] | Array of tag strings |
| featured_image | TEXT | URL to featured image |
| is_published | BOOLEAN | Whether post is live |
| is_featured | BOOLEAN | Whether to highlight post |
| published_at | TIMESTAMP | Publication date |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |
| reading_time_minutes | INTEGER | Estimated reading time |
| views | INTEGER | View count |

#### `dash_blog_categories`
Blog category definitions.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | Category name |
| slug | TEXT | URL-friendly identifier (unique) |
| description | TEXT | Category description |
| color | TEXT | Hex color code for UI |
| created_at | TIMESTAMP | Creation timestamp |

## Row Level Security (RLS)

All tables have RLS enabled with the following policies:

### Public Read Access
- Published blog posts are viewable by everyone
- All blog categories are viewable by everyone
- All changelogs are viewable by everyone

### Authenticated User Access
- Authenticated users can create, update, and delete:
  - Changelogs and changelog items
  - Blog posts and categories

## Setup Instructions

1. **Run migrations in Supabase SQL Editor:**
   ```sql
   -- Execute database/init/changelog.sql
   -- Execute database/init/blog.sql
   ```

2. **Verify tables were created:**
   ```sql
   SELECT * FROM dash_changelog LIMIT 5;
   SELECT * FROM dash_blog_posts LIMIT 5;
   ```

## Sample Data

Both migration files include sample data to help you get started:

- **Changelog:** 3 sample releases across different products
- **Blog:** 4 categories and 3 sample blog posts

## Color Palette

The application uses a consistent color scheme across all Geiger products:

### CSS Variables (from globals.css)
```css
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.141 0.005 285.823);
  --primary: oklch(0.21 0.006 285.885);
  --card: oklch(1 0 0);
  --border: oklch(0.92 0.004 286.32);
  /* ... more variables */
}

.dark {
  --background: oklch(0.141 0.005 285.823);
  --foreground: oklch(0.985 0 0);
  --primary: oklch(0.92 0.004 286.32);
  --card: oklch(0.21 0.006 285.885);
  --border: oklch(1 0 0 / 10%);
  /* ... more variables */
}
```

### Product-Specific Colors
- **Geiger Flow:** Blue (#3b82f6)
- **Geiger Notes:** Emerald/Green (#10b981)
- **Geiger Dash:** Purple (#8b5cf6)
- **Geiger DAM:** Orange (#f59e0b)
- **Geiger Grey:** Gray (#6b7280)

## Components Used

This implementation uses shadcn/ui components:

- `Button` - Various button styles
- `Card` - Content containers
- `Badge` - Labels and tags
- `Dialog` - Modal dialogs
- `Separator` - Dividing lines

## Page Routes

### `/changelog`
- Lists all product changelogs
- Organized by product with color coding
- Shows version, category, and changes
- Featured releases highlighted

### `/blog`
- Blog post listing with featured post at top
- Category filtering
- Grid layout with cards
- Publication metadata display

### `/blog/[slug]`
- Individual blog post view
- Full content display
- Related posts section
- Social sharing options

## Integration with Sister Apps

This dashboard follows the same patterns as:

- **geiger-flow:** Dark theme with accent colors, card-based layouts
- **geiger-notes:** Similar typography and spacing, minimal design

The UI maintains consistency with:
- Same color palette (oklch-based)
- Similar component styling (rounded corners: 0.625rem radius)
- Consistent header/footer structure
- Shared navigation (MegaMenu component)
