import re, glob, os, sys
sys.stdout.reconfigure(encoding='utf-8')

sidebar_categories = {}
with open('src/components/RightSidebar.js', 'r', encoding='utf-8') as f:
    sb_text = f.read()

dropdown_names = {
    'dropdownChoices1': 'Beneficiaries / Cases (الحالات وإنشاء وإدارة)',
    'dropdownChoices2': 'Projects / Marketing (المشاريع والتسويق)',
    'dropdownChoices3': 'HR (الموارد البشرية)',
    'dropdownChoices4': 'Accounting (المحاسبة المالية)',
    'dropdownChoices5': 'Governance (الحوكمة)',
    'dropdownChoices6': 'Loans (القروض والأقساط)',
    'dropdownChoices7': 'Donors / Donations (المانحون والتبرعات)',
    'dropdownChoices8': 'Endowments (الأوقاف)',
    'dropdownChoices9': 'Archives (الأرشيف)',
    'dropdownChoices10': 'Tasks (إدارة المهام)',
    'dropdownChoices15': 'Permissions & Roles (الأذونات والأدوار)',
    'dropdownChoices16': 'Settings (الإعدادات)',
}

route_to_sidebar = {}
for dp_var, dp_label in dropdown_names.items():
    dp_match = re.search(r'const\s+' + dp_var + r'\s*=\s*(\[[\s\S]*?\]);', sb_text)
    if dp_match:
        dp_content = dp_match.group(1)
        for r_m in re.finditer(r'route:\s*["\']([^"\']+)["\']', dp_content):
            route_to_sidebar[r_m.group(1).lower()] = (dp_label, r_m.group(1))

route_files = sorted(glob.glob('src/modules/**/routes/*.js', recursive=True) + ['src/admin/routes/adminRoutes.js'])

mismatches = []

for rf in route_files:
    mod_name = os.path.basename(rf).replace('.js', '')
    with open(rf, 'r', encoding='utf-8') as f:
        content = f.read()

    imports = {}
    for m in re.finditer(r'const\s+(\w+)\s*=\s*lazy\(\(\)\s*=>\s*import\(["\']([^"\']+)["\']\)', content):
        imports[m.group(1)] = m.group(2)
    for m in re.finditer(r'import\s+(\w+)\s+from\s+["\']([^"\']+)["\']', content):
        imports[m.group(1)] = m.group(2)

    for m in re.finditer(r'path:\s*["\']([^"\']+)["\'],\s*element:\s*(?:withSuspense\()?(\w+)', content):
        p, elem = m.group(1), m.group(2)
        target = imports.get(elem, 'UNKNOWN')
        p_clean = p.split('?')[0].rstrip('/').lower()

        sidebar_info = route_to_sidebar.get(p_clean)

        suspicious = []
        
        # 1. Donors
        if 'adddonor' in target.lower() and 'donor' not in mod_name.lower() and 'donation' not in mod_name.lower():
            suspicious.append(f"Target is in AddDonor folder, but route is registered in '{mod_name}'")
        
        # 2. Archive
        if 'archieve' in target.lower() or 'archive' in target.lower():
            if mod_name == 'donationRoutes':
                suspicious.append(f"Target is Archive ({target}) but route is in '{mod_name}'")

        # 3. GeneralPayment (Accounting) in finance
        if 'generalpayment' in target.lower() and mod_name == 'financeRoutes':
            suspicious.append(f"Target is Accounting/GeneralPayment but route is in '{mod_name}'")

        # 4. Volunteers in governance vs HR
        if 'volunt' in target.lower() and mod_name == 'governanceRoutes':
            suspicious.append(f"Volunteer route is in '{mod_name}' (Sidebar lists volunteers under HR)")

        # 5. Sidebar mismatches
        if sidebar_info:
            sb_cat, sb_route = sidebar_info
            if 'HR' in sb_cat and mod_name not in ['hrRoutes', 'trainingRoutes', 'organizationRoutes']:
                suspicious.append(f"Sidebar places this under '{sb_cat}', but route is in '{mod_name}'")
            if 'Donors' in sb_cat and mod_name not in ['donationRoutes']:
                suspicious.append(f"Sidebar places this under '{sb_cat}', but route is in '{mod_name}'")

        if suspicious:
            mismatches.append({
                'route': p,
                'element': elem,
                'target': target,
                'current_module': mod_name,
                'reasons': suspicious
            })

print(f"=== Total Misplaced / Questionable Routes Found: {len(mismatches)} ===")
for m in mismatches:
    print(f"\nRoute: {m['route']} ({m['element']})")
    print(f"  Current File: {m['current_module']}")
    print(f"  Target File:  {m['target']}")
    for r in m['reasons']:
        print(f"  -> {r}")
