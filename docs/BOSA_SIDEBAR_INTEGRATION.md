# BOSA Sidebar Integration for BP_WB

This document explains how BP_WB integrates with BOSA's sidebar navigation system.

## Sidebar Link Configuration

BP_WB is configured to appear in the BOSA sidebar for Super Admin users only, positioned after the "Themes" link.

## Configuration Files

### 1. Manifest Configuration (`manifest.yaml`)

The sidebar configuration is included in the app's manifest:

```yaml
sidebar:
  label: Website Builder
  url: /bp_wb/
  icon: pencil-square
  role: super_admin
  position: after
  after: themes
```

### 2. Sidebar JSON Configuration (`sidebar.json`)

The deployment script also creates a `sidebar.json` file:

```json
{
  "sidebar": {
    "links": [
      {
        "label": "Website Builder",
        "url": "/bp_wb/",
        "icon": "pencil-square",
        "role": "super_admin",
        "position": "after",
        "after": "themes"
      }
    ]
  }
}
```

## BOSA Core Integration Required

For this sidebar link to work, BOSA's core system needs to:

1. **Read sidebar configuration from apps:**
   - Scan `apps/*/manifest.yaml` for `sidebar` configuration
   - Or scan `apps/*/sidebar.json` files
   - Merge app sidebar links with core sidebar links

2. **Filter by role:**
   - Only show links where `role: "super_admin"` for Super Admin users
   - Hide links for users without required role

3. **Position links correctly:**
   - Support `position: "after"` with `after: "themes"` to place link after Themes
   - Support `position: "before"` for placing before specific links
   - Support `position: "append"` for adding to end of sidebar

## Implementation Example (for BOSA Core)

```go
// In BOSA's sidebar rendering code
func LoadAppSidebarLinks() []SidebarLink {
    var links []SidebarLink
    
    // Scan apps directory
    appsDir := "./apps"
    entries, _ := os.ReadDir(appsDir)
    
    for _, entry := range entries {
        if !entry.IsDir() {
            continue
        }
        
        appPath := filepath.Join(appsDir, entry.Name())
        
        // Try manifest.yaml first
        manifestPath := filepath.Join(appPath, "manifest.yaml")
        if manifest, err := LoadManifest(manifestPath); err == nil {
            if manifest.Sidebar != nil {
                links = append(links, manifest.Sidebar)
            }
        }
        
        // Fallback to sidebar.json
        sidebarPath := filepath.Join(appPath, "sidebar.json")
        if sidebar, err := LoadSidebarConfig(sidebarPath); err == nil {
            links = append(links, sidebar.Links...)
        }
    }
    
    return links
}

func FilterSidebarLinksByRole(links []SidebarLink, userRole string) []SidebarLink {
    var filtered []SidebarLink
    
    for _, link := range links {
        // Super admin sees all links
        if userRole == "super_admin" {
            filtered = append(filtered, link)
            continue
        }
        
        // Filter by role requirement
        if link.Role == "" || link.Role == userRole {
            filtered = append(filtered, link)
        }
    }
    
    return filtered
}

func PositionSidebarLinks(coreLinks []SidebarLink, appLinks []SidebarLink) []SidebarLink {
    // Merge and position links based on position rules
    // Implementation depends on BOSA's sidebar structure
}
```

## Testing the Sidebar Link

1. **Deploy the app:**
   ```powershell
   cd D:\dev\projects\BOSA\apps
   .\deploy_wb.bat
   ```

2. **Restart BOSA server**

3. **Login as Super Admin**

4. **Verify sidebar:**
   - Check that "Website Builder" link appears
   - Verify it's positioned after "Themes"
   - Click the link to verify it navigates to `/bp_wb/`

5. **Test role filtering:**
   - Login as non-Super Admin user
   - Verify "Website Builder" link does NOT appear

## Icon Reference

The sidebar uses the `pencil-square` icon. BOSA should support common icon libraries:
- Heroicons (recommended)
- Font Awesome
- Material Icons

If the icon doesn't appear, check BOSA's icon implementation and update the icon name in `manifest.yaml` or `sidebar.json`.

## Troubleshooting

### Link Not Appearing

1. Verify BOSA core reads sidebar configuration from apps
2. Check that `sidebar.json` or `manifest.yaml` sidebar config exists
3. Verify you're logged in as Super Admin
4. Check BOSA logs for sidebar loading errors

### Wrong Position

1. Verify `position: "after"` and `after: "themes"` are correct
2. Check that "Themes" link exists in BOSA sidebar
3. Verify BOSA's positioning logic handles these parameters

### Icon Not Showing

1. Check icon name matches BOSA's icon library
2. Verify icon library is loaded in BOSA frontend
3. Update icon name if needed

