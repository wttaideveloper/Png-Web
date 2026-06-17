# How to Run (Important)

Your project is **NOT** in `C:\Users\shree\backend`.

Use this exact folder:

```text
C:\Users\shree\.cursor\projects\C-Users-shree-AppData-Local-Temp-114b15d0-2c10-4609-acfb-6adf9291b2ec
```

## Terminal 1 — Backend (Strapi Admin)

```powershell
cd "C:\Users\shree\.cursor\projects\C-Users-shree-AppData-Local-Temp-114b15d0-2c10-4609-acfb-6adf9291b2ec\backend"
npm run develop
```

Admin portal: http://localhost:1337/admin

## Terminal 2 — Frontend (Website)

```powershell
cd "C:\Users\shree\.cursor\projects\C-Users-shree-AppData-Local-Temp-114b15d0-2c10-4609-acfb-6adf9291b2ec\frontend"
npm run dev
```

Website: http://localhost:5173

## If homepage shows empty or 404

1. Open http://localhost:1337/admin
2. Go to **Content Manager → Home Page**
3. Create/edit content and click **Publish**
4. Refresh http://localhost:5173

## If schema changes are not visible in admin

Stop Strapi, delete `backend\.tmp\data.db`, then run `npm run develop` again to reseed defaults.
