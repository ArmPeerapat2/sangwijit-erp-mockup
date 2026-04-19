#!/usr/bin/env python3
"""
Update HTML mockup files to add 6 new pages to sidebar and floating nav.
"""

import os
import re
from pathlib import Path

# Define the folder
FOLDER = "/sessions/great-dreamy-davinci/mnt/Design Ai/"

# Files to skip (already have new pages or shouldn't be modified)
SKIP_FILES = {
    "portal-mockup-index.html",
    "sangwijit-portal-architecture.html",
    "ap1-approval-center-mockup.html",
    "slq-sales-queue-mockup.html",
    "poq-purchase-queue-mockup.html",
    "whr-goods-issue-mockup.html",
    "md4-employee-master-mockup.html",
    "md5-branch-warehouse-mockup.html"
}

# Sidebar links to add - (search_pattern, insert_position, html_content)
SIDEBAR_UPDATES = [
    # SL-Q before SL-1
    (
        r'(<a href="sl1-quotation-mockup\.html")',
        'before',
        '  <a href="slq-sales-queue-mockup.html" style="display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:6px;text-decoration:none;color:#D1D5DB;font-size:12px;margin:1px 0" onmouseover="this.style.background=\'rgba(255,255,255,0.1)\';this.style.color=\'#fff\'" onmouseout="this.style.background=\'transparent\';this.style.color=\'#D1D5DB\'">SL-Q Sales Queue</a>\n'
    ),
    # WH-R after WH-3
    (
        r'(<a href="wh3-stock-count-mockup\.html"[^>]*>.*?</a>)',
        'after',
        '  <a href="whr-goods-issue-mockup.html" style="display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:6px;text-decoration:none;color:#D1D5DB;font-size:12px;margin:1px 0" onmouseover="this.style.background=\'rgba(255,255,255,0.1)\';this.style.color=\'#fff\'" onmouseout="this.style.background=\'transparent\';this.style.color=\'#D1D5DB\'">WH-R เบิกสินค้า</a>\n'
    ),
    # PO-Q before PO-4
    (
        r'(<a href="po4-purchase-order-mockup\.html")',
        'before',
        '  <a href="poq-purchase-queue-mockup.html" style="display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:6px;text-decoration:none;color:#D1D5DB;font-size:12px;margin:1px 0" onmouseover="this.style.background=\'rgba(255,255,255,0.1)\';this.style.color=\'#fff\'" onmouseout="this.style.background=\'transparent\';this.style.color=\'#D1D5DB\'">PO-Q คิวจัดซื้อ</a>\n'
    ),
    # AP-1 after CF-1
    (
        r'(<a href="cf1-rbac-permission-mockup\.html"[^>]*>.*?</a>)',
        'after',
        '  <a href="ap1-approval-center-mockup.html" style="display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:6px;text-decoration:none;color:#D1D5DB;font-size:12px;margin:1px 0" onmouseover="this.style.background=\'rgba(255,255,255,0.1)\';this.style.color=\'#fff\'" onmouseout="this.style.background=\'transparent\';this.style.color=\'#D1D5DB\'">AP-1 ศูนย์อนุมัติ</a>\n'
    ),
    # MD-4 and MD-5 after MD-3
    (
        r'(<a href="md3-vendor-master-mockup\.html"[^>]*>.*?</a>)',
        'after',
        '  <a href="md4-employee-master-mockup.html" style="display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:6px;text-decoration:none;color:#D1D5DB;font-size:12px;margin:1px 0" onmouseover="this.style.background=\'rgba(255,255,255,0.1)\';this.style.color=\'#fff\'" onmouseout="this.style.background=\'transparent\';this.style.color=\'#D1D5DB\'">MD-4 ทะเบียนพนักงาน</a>\n  <a href="md5-branch-warehouse-mockup.html" style="display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:6px;text-decoration:none;color:#D1D5DB;font-size:12px;margin:1px 0" onmouseover="this.style.background=\'rgba(255,255,255,0.1)\';this.style.color=\'#fff\'" onmouseout="this.style.background=\'transparent\';this.style.color=\'#D1D5DB\'">MD-5 สาขา & คลัง</a>\n'
    ),
]

# Floating nav updates - (search_pattern, insert_position, html_content)
FLOATING_NAV_UPDATES = [
    # SL-Q before SL-1
    (
        r'(<a href="sl1-quotation-mockup\.html"[^>]*><span[^>]*>SL-1</span>)',
        'before',
        '    <a href="slq-sales-queue-mockup.html" style="display:flex;align-items:center;gap:8px;padding:6px 12px;border-radius:8px;text-decoration:none;color:#111827;font-size:13px" onmouseover="this.style.background=\'#F1F5F9\'" onmouseout="this.style.background=\'transparent\'"><span style="background:#DBEAFE;color:#2563EB;font-size:10px;font-weight:600;padding:2px 6px;border-radius:4px">SL-Q</span> Sales Queue</a>\n'
    ),
    # WH-R after WH-3
    (
        r'(<a href="wh3-stock-count-mockup\.html"[^>]*><span[^>]*>WH-3</span>.*?</a>)',
        'after',
        '    <a href="whr-goods-issue-mockup.html" style="display:flex;align-items:center;gap:8px;padding:6px 12px;border-radius:8px;text-decoration:none;color:#111827;font-size:13px" onmouseover="this.style.background=\'#F1F5F9\'" onmouseout="this.style.background=\'transparent\'"><span style="background:#D1FAE5;color:#059669;font-size:10px;font-weight:600;padding:2px 6px;border-radius:4px">WH-R</span> เบิกสินค้า</a>\n'
    ),
    # PO-Q before PO-4
    (
        r'(<a href="po4-purchase-order-mockup\.html"[^>]*><span[^>]*>PO-4</span>)',
        'before',
        '    <a href="poq-purchase-queue-mockup.html" style="display:flex;align-items:center;gap:8px;padding:6px 12px;border-radius:8px;text-decoration:none;color:#111827;font-size:13px" onmouseover="this.style.background=\'#F1F5F9\'" onmouseout="this.style.background=\'transparent\'"><span style="background:#FEF3C7;color:#D97706;font-size:10px;font-weight:600;padding:2px 6px;border-radius:4px">PO-Q</span> คิวจัดซื้อ</a>\n'
    ),
    # AP-1 after CF-1
    (
        r'(<a href="cf1-rbac-permission-mockup\.html"[^>]*><span[^>]*>CF-1</span>.*?</a>)',
        'after',
        '    <a href="ap1-approval-center-mockup.html" style="display:flex;align-items:center;gap:8px;padding:6px 12px;border-radius:8px;text-decoration:none;color:#111827;font-size:13px" onmouseover="this.style.background=\'#F1F5F9\'" onmouseout="this.style.background=\'transparent\'"><span style="background:#F3F4F6;color:#374151;font-size:10px;font-weight:600;padding:2px 6px;border-radius:4px">AP-1</span> ศูนย์อนุมัติ</a>\n'
    ),
    # MD-4 and MD-5 after MD-3
    (
        r'(<a href="md3-vendor-master-mockup\.html"[^>]*><span[^>]*>MD-3</span>.*?</a>)',
        'after',
        '    <a href="md4-employee-master-mockup.html" style="display:flex;align-items:center;gap:8px;padding:6px 12px;border-radius:8px;text-decoration:none;color:#111827;font-size:13px" onmouseover="this.style.background=\'#F1F5F9\'" onmouseout="this.style.background=\'transparent\'"><span style="background:#FCE7F3;color:#DB2777;font-size:10px;font-weight:600;padding:2px 6px;border-radius:4px">MD-4</span> ทะเบียนพนักงาน</a>\n    <a href="md5-branch-warehouse-mockup.html" style="display:flex;align-items:center;gap:8px;padding:6px 12px;border-radius:8px;text-decoration:none;color:#111827;font-size:13px" onmouseover="this.style.background=\'#F1F5F9\'" onmouseout="this.style.background=\'transparent\'"><span style="background:#FCE7F3;color:#DB2777;font-size:10px;font-weight:600;padding:2px 6px;border-radius:4px">MD-5</span> สาขา & คลัง</a>\n'
    ),
]


def insert_before(content, pattern, new_html):
    """Insert new HTML before matching pattern."""
    match = re.search(pattern, content, re.DOTALL)
    if match:
        insert_pos = match.start()
        return content[:insert_pos] + new_html + content[insert_pos:]
    return content


def insert_after(content, pattern, new_html):
    """Insert new HTML after matching pattern."""
    match = re.search(pattern, content, re.DOTALL)
    if match:
        insert_pos = match.end()
        return content[:insert_pos] + '\n' + new_html + content[insert_pos:]
    return content


def update_sidebar(content):
    """Update sidebar with new links."""
    for pattern, position, new_html in SIDEBAR_UPDATES:
        # Check if link already exists
        link_filename = re.search(r'href="([^"]+)"', new_html).group(1)
        if link_filename in content:
            # Link already exists, skip
            continue

        if position == 'before':
            content = insert_before(content, pattern, new_html)
        else:
            content = insert_after(content, pattern, new_html)

    return content


def update_floating_nav(content):
    """Update floating nav with new links."""
    for pattern, position, new_html in FLOATING_NAV_UPDATES:
        # Check if link already exists
        link_filename = re.search(r'href="([^"]+)"', new_html).group(1)
        if link_filename in content:
            # Link already exists, skip
            continue

        if position == 'before':
            content = insert_before(content, pattern, new_html)
        else:
            content = insert_after(content, pattern, new_html)

    return content


def process_files():
    """Process all HTML mockup files."""
    folder_path = Path(FOLDER)
    html_files = sorted([f for f in folder_path.glob('*-mockup.html') if f.name not in SKIP_FILES])

    updated_count = 0

    for html_file in html_files:
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()

            original_content = content

            # Update sidebar
            content = update_sidebar(content)

            # Update floating nav
            content = update_floating_nav(content)

            # Only write if content changed
            if content != original_content:
                with open(html_file, 'w', encoding='utf-8') as f:
                    f.write(content)
                updated_count += 1
                print(f"✓ Updated: {html_file.name}")
            else:
                print(f"- Skipped: {html_file.name} (already has all links)")

        except Exception as e:
            print(f"✗ Error processing {html_file.name}: {str(e)}")

    return updated_count, html_files


if __name__ == "__main__":
    print(f"Starting update of HTML mockup files in {FOLDER}\n")
    print(f"Files to skip: {SKIP_FILES}\n")

    updated, all_files = process_files()

    print(f"\n{'='*60}")
    print(f"Summary:")
    print(f"  Total target files: {len(all_files)}")
    print(f"  Files updated: {updated}")
    print(f"  Files skipped: {len(all_files) - updated}")
    print(f"{'='*60}")
