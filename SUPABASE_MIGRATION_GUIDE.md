# Supabase Data Migration Guide

## Overview

This guide explains the migration of user data from local browser storage to Supabase cloud database to prevent data loss and enable cross-device synchronization.

## What Was Changed

### 1. Database Schema
- Created new Supabase tables:
  - `user_shops` - Business/shop configuration
  - `user_machines` - Machine inventory and specifications
  - `user_materials` - Material inventory and supplier information

### 2. Updated Stores
- **Shop Store** (`src/store/shop-store.ts`) - Now syncs to Supabase
- **Machine Store** (`src/store/machine-store.ts`) - Now syncs to Supabase  
- **Materials Store** (`src/store/user-materials-store.ts`) - Now syncs to Supabase
- **Quote Store** - Already had Supabase integration ✅

### 3. Auto-Migration System
- Created `useDataSync` hook that automatically migrates existing localStorage data to Supabase
- Runs when user logs in for the first time after the update
- Preserves all existing data during transition

## Required Setup Steps

### 1. Run Database Schema
Execute the SQL commands in `supabase-schema-updates.sql` in your Supabase SQL editor to create the required tables and policies.

### 2. Test the Migration
1. **Before logging in**: Check your browser's localStorage to see existing data
2. **Log in**: The migration will automatically run and sync data to Supabase
3. **Verify**: Check the Supabase dashboard to confirm data was migrated
4. **Test cross-device**: Log in from another device/browser to verify sync

## How It Works

### Local-First with Cloud Sync
- Data is still stored locally for offline access
- Changes automatically sync to Supabase when authenticated  
- On login, cloud data is loaded and merged with local data
- Graceful fallback to local-only mode when offline

### Migration Logic
```javascript
// When user logs in:
1. Load existing data from Supabase
2. If no cloud data exists but local data exists -> Migrate local to cloud
3. If cloud data exists -> Use cloud data (most recent)
4. Future changes auto-sync to cloud
```

### Data States
- ✅ **Authenticated + Online**: Full cloud sync enabled
- ⚠️ **Authenticated + Offline**: Local changes queued for next sync
- 📱 **Not Authenticated**: Local-only storage (legacy mode)

## Migration Safety

### What's Protected
- All existing shop configurations
- All custom machines and their settings
- All custom materials and inventory data
- All existing quotes (already cloud-synced)

### Backup Strategy
- Original data remains in localStorage during migration
- Migration is additive (doesn't delete local data)
- Can revert by clearing Supabase tables if needed

## Troubleshooting

### If Migration Fails
1. Check browser console for error messages
2. Verify Supabase connection and authentication
3. Ensure database tables exist and RLS policies are set up
4. Local data remains safe - migration can be retried

### Force Re-Migration
If needed, you can trigger re-migration by:
1. Clearing the relevant Supabase table
2. Logging out and back in
3. The system will detect missing cloud data and re-migrate

## Benefits After Migration

1. **No More Data Loss**: Updates won't delete user configurations
2. **Cross-Device Sync**: Access your data from any device
3. **Backup & Recovery**: Data safely stored in cloud
4. **Real-time Sync**: Changes sync immediately when online
5. **Offline Support**: Continue working offline, sync when reconnected

## Monitoring

The application includes logging to help track migration status:
- `🔄 Starting user data sync...` - Migration beginning
- `✅ Data loaded from cloud` - Cloud data successfully loaded
- `📦 Migrating local data to cloud...` - Local data being migrated
- `✅ Local data migrated to cloud` - Migration completed successfully
- `❌ Data sync failed:` - Error occurred (check logs)

Check browser console (F12) to monitor migration progress.