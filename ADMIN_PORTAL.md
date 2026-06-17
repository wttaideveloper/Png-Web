# Admin Portal Guide (Strapi CMS)

Your **admin portal** is Strapi Admin. Use it to manage all homepage content, colors, fonts, section visibility, and order without changing React code.

## Access Admin Portal

1. Start backend:
   ```bash
   cd backend
   npm run develop
   ```
2. Open: **http://localhost:1337/admin**
3. Create your admin account on first launch.
4. Go to **Content Manager → Home Page**.

## What You Can Edit in Admin

### 1) Global Theme (`globalTheme`)
Change site-wide design tokens:
- Primary / secondary colors
- Accent orange, navy, teal
- Background and text colors
- Body font family
- Heading font family
- Heading/body font sizes
- Container width and section spacing

### 2) Header Settings (`headerSettings`)
- Logo image
- Menu items (label + link)
- Header background/text colors
- Header font
- Sticky header on/off
- CTA button text/link/colors

### 3) Footer Settings (`footerSettings`)
- Footer logo
- Description and copyright
- Footer links
- Social links
- Footer background/text colors

### 4) Seventh Rail (`railSettings`)
- Rail background color
- Rail width
- Show/hide logo
- Logo color

### 5) Homepage Sections (`sections`)
Each section supports:
- Section name (`hero`, `about`, `services`, `products`, `contact`, etc.)
- Title, subtitle, description
- Active/inactive toggle
- Display order
- Background/text colors (`colorSettings`)
- Typography (`titleTypography`, `subtitleTypography`, `bodyTypography`)
- Spacing (`spacingSettings`)
- Primary/secondary buttons (`buttonSettings`, `secondaryButtonSettings`)
- Section image (`imageSettings`)

Section-specific lists (editable in admin forms):
- `statItems` → mission stats (about section)
- `ministryItems` → ministry cards (services section)
- `newsItems` → news list (products section)
- `videoItems` → featured videos (products section)
- `donationItems` → donation chips (contact section)

## Hero Title Format

Use pipe format for two-line hero heading:
```text
Serving God's People|Across the Islands
```
- Left part = first line
- Right part = orange italic second line

## Publish Workflow

1. Edit fields in **Home Page**.
2. Click **Save**.
3. Click **Publish**.
4. Refresh frontend: **http://localhost:5173**

## Public API Permission

Bootstrap auto-enables public `find` permission for `home-page`.
If needed manually:
- **Settings → Users & Permissions → Roles → Public**
- Enable `Home-page → find`

## Frontend + Backend Run

```bash
# Terminal 1
cd backend
npm run develop

# Terminal 2
cd frontend
npm run dev
```

Frontend URL: http://localhost:5173  
Admin URL: http://localhost:1337/admin
