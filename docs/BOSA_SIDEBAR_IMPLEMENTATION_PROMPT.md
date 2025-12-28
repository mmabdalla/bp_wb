# BOSA Sidebar Integration for BP_WB

## Task
Add sidebar link support for apps in the `apps/` directory. BP_WB app needs a sidebar link labeled **"Theme Builder"** that appears for Super Admin users only, positioned after the "Themes" link.

## Requirements

1. **Read sidebar configuration from apps:**
   - Scan `apps/*/manifest.yaml` for `sidebar` section
   - Or scan `apps/*/sidebar.json` files
   - Merge app sidebar links with core sidebar links

2. **Configuration format:**
   ```yaml
   # In apps/bp_wb/manifest.yaml
   sidebar:
     label: Theme Builder
     url: /bp_wb/
     icon: pencil-square
     role: super_admin
     position: after
     after: themes
   ```

3. **Filtering:**
   - Only show links where `role: "super_admin"` for Super Admin users
   - Hide links for users without required role

4. **Positioning:**
   - Support `position: "after"` with `after: "themes"` to place link after Themes
   - Support `position: "before"` for placing before specific links
   - Support `position: "append"` for adding to end of sidebar

## Expected Result
When BP_WB is deployed to `apps/bp_wb/`, Super Admin users should see a "Theme Builder" link in the sidebar immediately after the "Themes" link, linking to `/bp_wb/`.

