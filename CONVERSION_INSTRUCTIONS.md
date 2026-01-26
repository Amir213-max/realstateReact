# Complete Conversion Instructions

## Summary
The project has been partially converted from Next.js 15 to a pure React client-side application using Vite and React Router.

## Completed
✅ Package.json updated with Vite and React Router
✅ index.html created
✅ vite.config.js created
✅ src/main.jsx created
✅ src/App.jsx with routing setup
✅ components/Image.jsx (replacement for next/image)
✅ components/Navbar.jsx (converted)
✅ components/Cards/ProjectCard.jsx (converted)
✅ pages/Home.jsx (converted)
✅ pages/About.jsx (converted)

## Remaining Conversions Needed

### 1. Convert All Components
Replace in each component file:
- `import Link from 'next/link'` → `import { Link } from 'react-router-dom'`
- `import Image from 'next/image'` → `import Image from '../components/Image'` (or adjust path)
- `import { usePathname } from 'next/navigation'` → `import { useLocation } from 'react-router-dom'` then `const location = useLocation(); const pathname = location.pathname;`
- `import { useParams } from 'next/navigation'` → `import { useParams } from 'react-router-dom'`
- Remove all `'use client'` directives
- Change `href` to `to` in Link components

### 2. Convert All Pages
Files to convert in `app/` directory:
- `app/about/page.js` → `pages/About.jsx` ✅ (done)
- `app/contact/page.js` → `pages/Contact.jsx`
- `app/properties/page.js` → `pages/Properties.jsx`
- `app/properties/[id]/page.js` → `pages/PropertyDetail.jsx`
- `app/projects/[id]/page.js` → `pages/ProjectDetail.jsx`
- `app/destinations/page.js` → `pages/Destinations.jsx`
- `app/destinations/[id]/page.js` → `pages/DestinationDetail.jsx`
- `app/developers/[id]/page.js` → `pages/DeveloperDetail.jsx`
- `app/units/[id]/page.js` → `pages/UnitDetail.jsx`

For dynamic routes, use `useParams()` from react-router-dom:
```jsx
import { useParams } from 'react-router-dom';

export default function ProjectDetail() {
  const { id } = useParams();
  // Use id instead of params.id
}
```

### 3. Convert Components
- `components/Footer.js` → Update to use React Router Link
- `components/Logo.js` → Update Image import
- `components/Cards/DestinationCard.js`
- `components/Cards/DeveloperCard.js`
- `components/Cards/PropertyCard.js`
- `components/Cards/UnitCard.js`
- All other components using Next.js imports

### 4. Update Providers.js
Remove `'use client'` directive if present.

### 5. Fix localStorage
All localStorage usage is already safe, but verify:
- Only accessed in `useEffect` or event handlers
- Protected with `typeof window !== 'undefined'` checks

## Quick Conversion Script Pattern

For each file:
1. Change imports from Next.js to React Router
2. Replace `href` with `to` in Link components
3. Replace Next.js Image with custom Image component
4. Update hooks (usePathname → useLocation, etc.)
5. Remove `'use client'` directives

## Testing
After conversion:
1. Run `npm install`
2. Run `npm run dev`
3. Test all routes
4. Verify localStorage works
5. Check all images load
6. Test navigation

## Build
```bash
npm run build
npm run preview
```
