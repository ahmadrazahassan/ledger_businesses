# Author Update Summary

## Changes Made

Successfully updated the author data in the seed file to have only one author.

### Before:
- 3 authors: Elena Marchetti, James Whitfield, and Priya Narasimhan

### After:
- 1 author: **Ahmed Raza**

## Details

**Author Information:**
- **ID**: a1
- **Name**: Ahmed Raza
- **Bio**: Senior editor covering enterprise technology, AI, and B2B strategy.
- **Avatar**: /avatars/ahmed.jpg
- **Twitter**: ahmedraza
- **LinkedIn**: ahmedraza

## Posts Updated

All 14 posts in the seed data now have:
- `author_id: 'a1'`
- Author object with Ahmed Raza's information

## Files Modified

- `src/data/seed.ts` - Updated authors array and all post author references

## Verification

✅ No TypeScript errors
✅ All old author names removed
✅ All posts now reference Ahmed Raza
✅ Author dropdown in admin panel will show only Ahmed Raza
