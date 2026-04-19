#!/usr/bin/env python3
"""
Update floating nav in HTML mockup files to add 6 new pages.
"""

import os
import re
from pathlib import Path

# Define the folder
FOLDER = "/sessions/great-dreamy-davinci/mnt/Design Ai/"

# Files to skip
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


def add_sl_q(content):
    """Add SL-Q before SL-1 in floating nav."""
    # Find quickNavPanel and look for SL-1 within it
    pattern = r'(id="quickNavPanel"[^>]*>.*?<a href="sl1-quotation-mockup\.html")'

    def replacer(match):
        # Check if SL-Q already exists before SL-1 in this section
        section = match.group(0)
        if 'slq-sales-queue' in section:
            return match.group(0)  # Already there
        # Insert before SL-1
        return match.group(0).replace(
            '<a href="sl1-quotation-mockup.html"',
            '<a href="slq-sales-queue-mockup.html" style="display:block;padding:4px 8px;font-size:12px;color:#2563EB;text-decoration:none;">SL-Q Sales Queue</a>\n<a href="sl1-quotation-mockup.html"'
        )

    return re.sub(pattern, replacer, content, flags=re.DOTALL)


def add_wh_r(content):
    """Add WH-R after WH-3 in floating nav."""
    pattern = r'(<a href="wh3-stock-count-mockup\.html"[^>]*>.*?</a>)(\s*<div style="font-size:11px;font-weight:600;)'

    def replacer(match):
        if 'whr-goods-issue' in match.group(0):
            return match.group(0)  # Already there
        return match.group(1) + '\n    <a href="whr-goods-issue-mockup.html" style="display:flex;align-items:center;gap:8px;padding:6px 12px;border-radius:8px;text-decoration:none;color:#111827;font-size:13px" onmouseover="this.style.background=\'#F1F5F9\'" onmouseout="this.style.background=\'transparent\'"><span style="background:#D1FAE5;color:#059669;font-size:10px;font-weight:600;padding:2px 6px;border-radius:4px">WH-R</span> เบิกสินค้า</a>' + match.group(2)

    return re.sub(pattern, replacer, content, flags=re.DOTALL)


def add_po_q(content):
    """Add PO-Q before PO-4 in floating nav."""
    pattern = r'(🛒 จัดซื้อ / Space.*?<a href="po4-purchase-order-mockup\.html")'

    def replacer(match):
        if 'poq-purchase-queue' in match.group(0):
            return match.group(0)  # Already there
        return match.group(0).replace(
            '<a href="po4-purchase-order-mockup.html"',
            '<a href="poq-purchase-queue-mockup.html" style="display:block;padding:4px 8px;font-size:12px;color:#2563EB;text-decoration:none;">PO-Q คิวจัดซื้อ</a>\n<a href="po4-purchase-order-mockup.html"'
        )

    return re.sub(pattern, replacer, content, flags=re.DOTALL)


def add_ap_1(content):
    """Add AP-1 after CF-1 in floating nav."""
    pattern = r'(<a href="cf1-rbac-permission-mockup\.html"[^>]*>CF-1[^<]*</a>)(\s*<div style="font-size:11px;font-weight:600;color:#6B7280;margin:8px 0 4px;">🔎)'

    def replacer(match):
        if 'ap1-approval' in match.group(0):
            return match.group(0)  # Already there
        return match.group(1) + '\n<a href="ap1-approval-center-mockup.html" style="display:block;padding:4px 8px;font-size:12px;color:#2563EB;text-decoration:none;">AP-1 ศูนย์อนุมัติ</a>' + match.group(2)

    return re.sub(pattern, replacer, content, flags=re.DOTALL)


def add_md_4_5(content):
    """Add MD-4 and MD-5 (look for them in Master Data section or as fallback)."""
    # These don't appear in the basic quickNavPanel, but we should add them
    # Try to find MD-3 or insert at the end before closing the panel

    pattern = r'(id="quickNavPanel"[^>]*>.*?)(<\/div>\s*<\/div>\s*<script>)'

    def replacer(match):
        panel_content = match.group(1)

        # If already present, don't add
        if 'md4-employee-master' in panel_content and 'md5-branch-warehouse' in panel_content:
            return match.group(0)

        # Try to insert after MD-3 if it exists
        if 'md3-vendor-master' in panel_content:
            new_content = panel_content.replace(
                'md3-vendor-master-mockup.html',
                'md3-vendor-master-mockup.html'
            )
            # Find and insert after the </a> of MD-3
            pattern2 = r'(<a href="md3-vendor-master-mockup\.html"[^>]*>.*?</a>)'
            def replacer2(m):
                return m.group(0) + '\n<a href="md4-employee-master-mockup.html" style="display:block;padding:4px 8px;font-size:12px;color:#2563EB;text-decoration:none;">MD-4 ทะเบียนพนักงาน</a>\n<a href="md5-branch-warehouse-mockup.html" style="display:block;padding:4px 8px;font-size:12px;color:#2563EB;text-decoration:none;">MD-5 สาขา & คลัง</a>'
            new_content = re.sub(pattern2, replacer2, new_content, flags=re.DOTALL)
            return new_content + match.group(2)

        # Otherwise don't add them
        return match.group(0)

    return re.sub(pattern, replacer, content, flags=re.DOTALL)


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

            # Apply all updates
            content = add_sl_q(content)
            content = add_wh_r(content)
            content = add_po_q(content)
            content = add_ap_1(content)
            content = add_md_4_5(content)

            # Only write if content changed
            if content != original_content:
                with open(html_file, 'w', encoding='utf-8') as f:
                    f.write(content)
                updated_count += 1
                print(f"✓ Updated floating nav: {html_file.name}")
            else:
                print(f"- No changes needed: {html_file.name}")

        except Exception as e:
            print(f"✗ Error processing {html_file.name}: {str(e)}")

    return updated_count, html_files


if __name__ == "__main__":
    print(f"Updating floating nav in HTML mockup files\n")

    updated, all_files = process_files()

    print(f"\n{'='*60}")
    print(f"Summary:")
    print(f"  Total target files: {len(all_files)}")
    print(f"  Files updated: {updated}")
    print(f"{'='*60}")
