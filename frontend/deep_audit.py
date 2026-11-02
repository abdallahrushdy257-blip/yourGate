import re, glob, os

def inspect_file(rf):
    with open(rf, 'r', encoding='utf-8') as f:
        content = f.read()

    # extract imports
    # lazy(() => import("...")) or import ... from "..."
    imports = {}
    for m in re.finditer(r'(?:const\s+(\w+)\s*=\s*lazy\(\(\)\s*=>\s*import\(["\']([^"\']+)["\']\)|import\s+(\w+)\s+from\s+["\']([^"\']+)["\'])', content):
        name = m.group(1) or m.group(3)
        path = m.group(2) or m.group(4)
        imports[name] = path

    # extract routes: path and element
    routes = []
    # format 1: { path: "...", element: ... }
    for m in re.finditer(r'path:\s*["\']([^"\']+)["\'],\s*element:\s*(?:withSuspense\()?(\w+)', content):
        p, elem = m.group(1), m.group(2)
        target_path = imports.get(elem, 'UNKNOWN')
        routes.append((p, elem, target_path))
    
    # format 2: <Route path="..." element={<Component ... />} />
    for m in re.finditer(r'<Route\s+[^>]*path=["\']([^"\']+)["\'][^>]*element=\{<(\w+)', content):
        p, elem = m.group(1), m.group(2)
        target_path = imports.get(elem, 'UNKNOWN')
        routes.append((p, elem, target_path))

    return routes

print("=== CHECKING APPS.JS ACTIVE ROUTES ===")
app_routes = inspect_file('src/App.js')
for p, elem, target in app_routes:
    print(f"App.js: path='{p}' -> {elem} ({target})")

print("\n=== CHECKING ALL MODULES ===")
for rf in sorted(glob.glob('src/modules/**/routes/*.js', recursive=True) + ['src/admin/routes/adminRoutes.js']):
    mod_name = os.path.basename(rf).replace('.js', '')
    routes = inspect_file(rf)
    # Check for mismatches:
    for p, elem, target in routes:
        # Check target folder vs module name
        t_lower = target.lower().replace('\\', '/')
        m_lower = mod_name.lower().replace('routes', '')
        # highlight suspicious routes
        # e.g., hr route in governance, or voucher in finance, or beneficiary in common
        suspicious = False
        reason = ""
        
        if m_lower == 'governance' and ('hr' in p or 'volunt' in p):
            reason = "Volunteers / HR report in governance?"
        elif m_lower == 'donations' and 'archive' in p.lower():
            reason = "Archive report in donations?"
        elif m_lower == 'finance' and 'voucher' in p.lower():
            reason = "Vouchers inside financeRoutes instead of voucherRoutes?"
        elif m_lower == 'common' and any(x in p.lower() for x in ['terms', 'privacy', 'landing']):
            reason = "Public terms/landing inside commonRoutes?"
        
        if reason:
            print(f"[{mod_name}] {p} -> {elem} | {reason} | Target: {target}")

