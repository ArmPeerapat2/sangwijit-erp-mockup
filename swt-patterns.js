/* ════════════════════════════════════════════════════════════════
   SWT Shared Patterns — SC-11 Summary · SC-12 Status strip
   ref: .agents/topics/shared-components-blueprint.md
   SC-11 = ส่วนสรุปยอดในบิล · SC-12 = แถบสถานะ+Maker≠Checker+doc-chain
   ════════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  var PILL = {
    success: 'pill-success',
    warn: 'pill-warning',
    warning: 'pill-warning',
    danger: 'pill-danger',
    info: 'pill-info',
    neutral: 'pill-neutral',
    violet: 'pill-violet',
    route: 'pill-route',
    promo: 'pill-promo'
  };

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function fmt(n) {
    var x = Number(n);
    if (!isFinite(x)) x = 0;
    return x.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function fmtSigned(n) {
    var x = Number(n);
    if (!isFinite(x)) x = 0;
    return (x < 0 ? '-' : '') + fmt(Math.abs(x));
  }

  function parseNum(s) {
    if (s == null || s === '') return null;
    var x = Number(String(s).replace(/,/g, '').replace(/%/g, '').trim());
    return isFinite(x) ? x : null;
  }

  /**
   * VAT Golden Rule: ส่วนลดก่อน VAT เสมอ
   * vatMode: exclusive (แยกภาษี) | inclusive (รวมในภาษี — ถอด VAT จากยอดรวมก่อนหักส่วนลด)
   * discountMode: amount (฿) | percent (%)
   */
  function swtCalcBillSummary(opts) {
    opts = opts || {};
    var vatMode = opts.vatMode || 'exclusive';
    var vatRatePct = opts.vatRate == null ? 7 : Number(opts.vatRate);
    var vatRate = vatRatePct / 100;
    var subtotal = Number(opts.subtotal != null ? opts.subtotal : (opts.invoice || opts.inv || 0));
    var lineDiscount = Number(opts.lineDiscount || 0);
    var discountMode = opts.discountMode || 'amount';
    var discountInput = Number(opts.discountInput || 0);
    var depositRefs = opts.depositRefs || [];
    var depositFromRefs = sc11SumDepositRefs(depositRefs);
    var deposit = depositRefs.length
      ? depositFromRefs
      : (opts.depositRefsOnly ? 0 : Number(opts.deposit || opts.depositApplied || 0));
    var deduct = Number(opts.deduct || 0);
    if (depositRefs.length) {
      deduct = deposit;
    } else if (!opts.depositRefsOnly) {
      deduct = Number(opts.deduct || opts.deposit || opts.depositApplied || deduct);
    }
    var wht = Number(opts.wht || 0);
    var fee = Number(opts.fee || 0);
    var taxExempt = Number(opts.taxExempt || 0);
    var postDeduct = Number(opts.postDeduct || 0);
    var vatManual = opts.vatManual;
    var preVat, billEndDisc, base, taxable, vat, gross;

    if (vatMode === 'inclusive') {
      preVat = subtotal / (1 + vatRate);
      billEndDisc = discountMode === 'percent' ? preVat * (discountInput / 100) : discountInput;
      base = Math.max(0, preVat - lineDiscount - billEndDisc);
    } else {
      billEndDisc = discountMode === 'percent' ? subtotal * (discountInput / 100) : discountInput;
      base = Math.max(0, subtotal - lineDiscount - billEndDisc);
    }

    taxable = Math.max(0, base - taxExempt);
    if (vatManual != null && vatManual !== '' && !isNaN(Number(vatManual))) {
      vat = Number(vatManual);
    } else {
      vat = taxable * vatRate;
    }
    gross = taxable + vat;
    var totalDiscount = lineDiscount + billEndDisc;

    return {
      subtotal: subtotal,
      inv: subtotal,
      invoice: subtotal,
      vatMode: vatMode,
      vatRate: vatRatePct,
      discountMode: discountMode,
      discountInput: discountInput,
      lineDiscount: lineDiscount,
      billEndDiscount: billEndDisc,
      billDiscount: totalDiscount,
      discount: totalDiscount,
      base: base,
      vat: vat,
      vatManual: vatManual,
      gross: gross,
      deduct: deduct,
      deposit: deposit,
      depositRefs: depositRefs,
      wht: wht,
      fee: fee,
      taxExempt: taxExempt,
      taxable: taxable,
      postDeduct: postDeduct,
      net: gross - deduct - wht - fee - postDeduct,
      recv: opts.recv != null ? opts.recv : gross
    };
  }

  var SC11_TPL_FLAGS = {
    'sales-invoice': { postDeduct: false, totalLbl: 'ยอดชำระสุทธิ' },
    'purchase-order': { postDeduct: false, totalLbl: 'รวมเงินทั้งสิ้น' },
    'ap-invoice': { postDeduct: true, totalLbl: 'ตั้งหนี้สุทธิ (ค้างจ่าย Vendor)' }
  };

  function sc11SumDepositRefs(refs) {
    if (!refs || !refs.length) return 0;
    return refs.reduce(function (s, r) { return s + Number(r.amount != null ? r.amount : (r.applied || 0)); }, 0);
  }

  function sc11DepositRefsInner(refs) {
    return (refs || []).map(function (r) {
      var no = esc(r.no || r.docNo || '');
      if (r.href) return '<a class="sc11-dep-ref" href="' + esc(r.href) + '">' + no + ' ↗</a>';
      return '<span class="sc11-dep-ref">' + no + '</span>';
    }).join(' · ');
  }

  function sc11DepositRowHtml(refs, amount, show) {
    return '<div class="summary-row deduct" id="sumDepRow" style="' + (show ? '' : 'display:none') + '">' +
      '<span class="lbl">หักเงินมัดจำ</span>' +
      '<span class="val deduct sc11-dep-val">' +
        '<span class="sc11-dep-amt">' + fmtSigned(-amount) + '</span>' +
        '<span class="sc11-dep-refs">' + sc11DepositRefsInner(refs) + '</span>' +
      '</span></div>';
  }

  /** @deprecated alias — ใช้ swtCalcBillSummary */
  function swtCalcVatGolden(opts) {
    opts = opts || {};
    if (opts.vatMode || opts.discountMode != null || opts.discountInput != null) {
      return swtCalcBillSummary(opts);
    }
    return swtCalcBillSummary({
      subtotal: opts.invoice || opts.subtotal || 0,
      lineDiscount: 0,
      discountMode: 'amount',
      discountInput: opts.billDiscount || opts.discount || 0,
      vatMode: 'exclusive',
      vatRate: (opts.vatRate == null ? 0.07 : Number(opts.vatRate)) * (opts.vatRate <= 1 ? 100 : 1),
      deduct: opts.deduct || opts.depositApplied || 0,
      wht: opts.wht,
      fee: opts.fee,
      vatManual: opts.vatManual,
      recv: opts.recv
    });
  }

  /** ดึงยอดจากแถวตาราง PO-6.3 (data-kind / data-amt) */
  function swtCalcFromItemRows(selector) {
    var inv = 0, billdisc = 0, deduct = 0;
    document.querySelectorAll(selector).forEach(function (tr) {
      var k = tr.getAttribute('data-kind');
      var amt = Number(tr.getAttribute('data-amt') || 0);
      if (k === 'inv') inv += amt;
      else if (k === 'billdisc') billdisc += Math.abs(amt);
      else if (k === 'deduct') deduct += Math.abs(amt);
    });
    return swtCalcVatGolden({ invoice: inv, billDiscount: billdisc, deduct: deduct, wht: 0 });
  }

  function pillHtml(p) {
    var cls = PILL[p.type] || PILL.neutral;
    return '<span class="pill ' + cls + '"' + (p.id ? ' id="' + esc(p.id) + '"' : '') + '>' + esc(p.text) + '</span>';
  }

  function mcNodeHtml(n) {
    var st = n.state === 'ok' ? ' ok' : n.state === 'wait' ? ' wait' : '';
    return '<div class="mc-node' + st + '"><span class="r">' + esc(n.role) + '</span><span class="w">' + esc(n.step) + '</span></div>';
  }

  function chainNodeHtml(n) {
    if (n.href) {
      return '<a class="dc-node' + (n.state ? ' ' + n.state : '') + '" href="' + esc(n.href) + '" target="_blank">' + esc(n.label) + '</a>';
    }
    return '<span class="dc-node' + (n.state ? ' ' + n.state : '') + '">' + esc(n.label) + '</span>';
  }

  /**
   * SC-12 — Status strip (pills + maker-checker + doc-chain)
   * @param {HTMLElement|string} el
   * @param {object} opts — pills[], makerChecker{title,nodes[]}, docChain[], alignRight
   */
  function swtRenderStatusStrip(el, opts) {
    opts = opts || {};
    var root = typeof el === 'string' ? document.querySelector(el) : el;
    if (!root) return;

    var pills = (opts.pills || []).map(pillHtml).join('');
    var mc = '';
    if (opts.makerChecker && opts.makerChecker.nodes && opts.makerChecker.nodes.length) {
      var title = opts.makerChecker.title || 'Maker ≠ Checker';
      mc = '<div class="mc-chain" title="' + esc(title) + '">';
      opts.makerChecker.nodes.forEach(function (n, i) {
        if (i) mc += '<span class="mc-arrow">→</span>';
        mc += mcNodeHtml(n);
      });
      mc += '</div>';
    }

    var chain = '';
    if (opts.docChain && opts.docChain.length) {
      chain = '<span class="dc-arrow">│</span>';
      opts.docChain.forEach(function (n, i) {
        if (i) chain += '<span class="dc-arrow">→</span>';
        chain += chainNodeHtml(n);
      });
    }

    var right = '<div style="margin-left:auto;display:flex;align-items:center;gap:10px">' + mc + chain + '</div>';
    root.className = (root.className || '').indexOf('status-strip') >= 0 ? root.className : root.className + ' status-strip';
    root.innerHTML = '<div class="sc11-pills">' + pills + '</div>' + right;
  }

  /**
   * ⑤ Doc Chain — แถบล่าง main (แยกจาก SC-12)
   * @param {HTMLElement|string} el — .dc-strip
   * @param {object} opts — label?, nodes[]
   */
  function swtRenderDocChain(el, opts) {
    opts = opts || {};
    var root = typeof el === 'string' ? document.querySelector(el) : el;
    if (!root) return;
    var nodes = opts.nodes || opts.docChain || [];
    var lbl = opts.label != null ? opts.label : 'Doc Chain';
    var chain = '';
    nodes.forEach(function (n, i) {
      if (i) chain += '<span class="dc-arrow">→</span>';
      chain += chainNodeHtml(n);
    });
    root.className = (root.className || '').indexOf('dc-strip') >= 0 ? root.className : root.className + ' dc-strip';
    root.innerHTML = '<span class="dc-lbl">' + esc(lbl) + '</span><div class="dc-chain">' + chain + '</div>';
  }

  /**
   * Gate alert (แยกจาก strip · ใต้ status)
   * compactOk (default true เมื่อ type=ok) → ซ่อนแถบเขียว
   */
  function swtRenderGateAlert(el, opts) {
    opts = opts || {};
    var root = typeof el === 'string' ? document.querySelector(el) : el;
    if (!root) return;
    var type = opts.type || 'ok';
    root.className = 'gate-alert ' + type;
    if (opts.id) root.id = opts.id;
    if (type === 'ok' && opts.compactOk !== false) {
      root.classList.add('is-compact');
      root.innerHTML = '';
      root.setAttribute('title', opts.text || '');
      root.setAttribute('aria-hidden', 'true');
      return;
    }
    root.classList.remove('is-compact');
    root.removeAttribute('aria-hidden');
    root.innerHTML = esc(opts.text || '');
  }

  /** ③ SAAB เมนู ⋯ เพิ่มเติม */
  function swtSaabMoreToggle(btn) {
    var wrap = btn && btn.closest ? btn.closest('.saab-more-wrap') : null;
    if (!wrap) return;
    var open = wrap.classList.contains('open');
    document.querySelectorAll('.saab-more-wrap.open').forEach(function (w) { w.classList.remove('open'); });
    if (!open) wrap.classList.add('open');
  }

  var SUMMARY_TEMPLATES = {
    'ap-invoice': function (c) {
      var vatLbl = vatLabel(c).replace('ภาษีมูลค่าเพิ่ม', 'VAT ซื้อ');
      var rows = [
        { id: 'sumInv', label: c.vatMode === 'inclusive' ? 'ยอดตามใบแจ้งหนี้ (รวมภาษี)' : 'ยอดตามใบแจ้งหนี้ (ก่อนภาษี)', value: c.subtotal != null ? c.subtotal : c.inv }
      ];
      if (c.lineDiscount > 0) {
        rows.push({ id: 'sumLineDisc', label: '🎁 ส่วนลดบนบิล (Sell-in · รายการ)', value: -c.lineDiscount, cls: 'disc' });
      }
      if (c.billEndDiscount > 0 || c.discountInput > 0) {
        rows.push({ id: 'sumBillDisc', label: 'ส่วนลดท้ายบิล', value: -c.billEndDiscount, cls: 'disc' });
      } else if (c.billDiscount > 0 && !c.lineDiscount) {
        rows.push({ id: 'sumBillDisc', label: '🎁 ส่วนลดบนบิล (Sell-in)', value: -c.billDiscount, cls: 'disc' });
      }
      rows.push(
        { id: 'sumBase', label: 'หลังหักส่วนลด (ฐาน VAT)', value: c.base, cls: 'base' },
        { id: 'sumVat', label: vatLbl, value: c.vat },
        { id: 'sumDeduct', label: '↩️ หักหลังบิล (มัดจำ/บิลฝาก/ลดหนี้/ส่งเสริม)', value: -c.deduct, cls: 'disc' },
        { id: 'sumWht', label: 'หัก ณ ที่จ่าย (WHT · สินค้าไม่หัก)', value: -c.wht, cls: 'wht' }
      );
      return { rows: rows, total: { id: 'sumNet', label: 'ตั้งหนี้สุทธิ (ค้างจ่าย Vendor)', value: c.net } };
    },
    payment: function (c) {
      return {
        rows: [
          { id: 'sumAp', label: 'ยอด AP ที่เลือกจ่าย', value: c.inv || c.ap },
          { id: 'sumWht', label: 'หัก ณ ที่จ่าย (WHT)', value: -c.wht, cls: 'wht' },
          { id: 'sumFee', label: 'ค่าธรรมเนียมโอน (ถ้ามี)', value: -c.fee, cls: 'wht' }
        ],
        total: { id: 'sumNet', label: 'ยอดโอน/จ่ายสุทธิ', value: c.net }
      };
    },
    'ar-receipt': function (c) {
      return {
        rows: [
          { id: 'sumRecv', label: 'ยอดรับชำระครั้งนี้', value: c.recv },
          { id: 'sumApply', label: 'จัดสรรประกบ Invoice', value: -c.apply, cls: 'disc' },
          { id: 'sumDisc', label: 'ส่วนลดเงินสด', value: -c.cashDisc, cls: 'disc' },
          { id: 'sumUnapplied', label: 'ยอดส่วนเกิน (Unapplied)', value: c.unapplied }
        ],
        total: { id: 'sumArRemain', label: 'AR ค้างหลัง Post', value: c.arRemain }
      };
    },
    sales: function (c) {
      return {
        rows: [
          { id: 'sumSub', label: 'ยอดก่อน VAT', value: c.base },
          { id: 'sumDisc', label: 'มูลค่าส่วนลด', value: -c.billDiscount, cls: 'disc' },
          { id: 'sumVat', label: 'VAT 7%', value: c.vat },
          { id: 'sumDep', label: 'หักมัดจำ', value: -c.deduct, cls: 'disc' }
        ],
        total: { id: 'sumNet', label: 'ยอดรวมทั้งสิ้น', value: c.net }
      };
    },
    'sales-invoice': function (c) {
      var vatLbl = vatLabel(c);
      var rows = [
        { id: 'sumSub', label: c.vatMode === 'inclusive' ? 'รวมจำนวนเงิน (รวมภาษี)' : 'รวมจำนวนเงิน', value: c.subtotal }
      ];
      if (c.lineDiscount > 0) {
        rows.push({ id: 'sumLineDisc', label: 'ส่วนลดรายการ (โปร+ของแถม)', value: -c.lineDiscount, cls: 'disc' });
      }
      if (c.billEndDiscount > 0 || c.discountInput > 0) {
        rows.push({ id: 'sumBillDisc', label: 'ส่วนลดท้ายบิล', value: -c.billEndDiscount, cls: 'disc' });
      } else if (c.discount > 0 && !c.lineDiscount) {
        rows.push({ id: 'sumDisc', label: 'ส่วนลด', value: -c.discount, cls: 'disc' });
      }
      rows.push(
        { id: 'sumBase', label: 'ยอดก่อนภาษี (ฐาน VAT)', value: c.base, cls: 'base' },
        { id: 'sumVat', label: vatLbl, value: c.vat },
        { id: 'sumGross', label: 'รวมทั้งสิ้น', value: c.gross }
      );
      if (c.depositRefs && c.depositRefs.length) {
        rows.push({ id: 'sumDep', label: 'หักเงินมัดจำ', value: -c.deposit, cls: 'deduct', refs: c.depositRefs });
      }
      return { rows: rows, total: { id: 'sumNet', label: 'ยอดชำระสุทธิ', value: c.net } };
    },
    'purchase-order': function (c) {
      var vatLbl = vatLabel(c);
      var rows = [
        { id: 'sumSub', label: c.vatMode === 'inclusive' ? 'รวมจำนวนเงิน (รวมภาษี)' : 'รวมจำนวนเงิน', value: c.subtotal }
      ];
      if (c.billEndDiscount > 0 || c.discountInput > 0) {
        rows.push({ id: 'sumBillDisc', label: 'ส่วนลดท้ายบิล', value: -c.billEndDiscount, cls: 'disc' });
      } else if (c.discount > 0) {
        rows.push({ id: 'sumDisc', label: 'ส่วนลด', value: -c.discount, cls: 'disc' });
      }
      rows.push(
        { id: 'sumBase', label: 'ยอดก่อนภาษี (ฐาน VAT)', value: c.base, cls: 'base' },
        { id: 'sumVat', label: vatLbl, value: c.vat },
        { id: 'sumRecv', label: 'รับแล้ว 0% · ค้างรับ', value: c.recv, cls: 'recv', signed: false }
      );
      return { rows: rows, total: { id: 'sumNet', label: 'รวมเงินทั้งสิ้น', value: c.net } };
    },
    'grn-receive': function (c) {
      return {
        rows: [
          { id: 'sumOrd', label: 'สั่งทั้งบิล', text: c.ordered },
          { id: 'sumThis', label: 'รับครั้งนี้ (ล็อตนี้)', text: c.thisLot },
          { id: 'sumAcc', label: 'รับสะสม', text: c.accum },
          { id: 'sumOpen', label: '⏳ ค้างรับ', text: c.open, cls: 'open' }
        ],
        total: { id: 'sumProg', label: 'ความคืบหน้า', text: c.progress }
      };
    }
  };

  function vatLabel(c) {
    var mode = c.vatMode === 'inclusive' ? 'รวมใน' : 'แยก';
    var rate = c.vatRate != null ? c.vatRate : 7;
    var manual = c.vatManual != null && c.vatManual !== '' ? ' · คีย์เอง' : '';
    return 'ภาษีมูลค่าเพิ่ม ' + rate + '% (' + mode + ')' + manual;
  }

  var _sc11Mounts = {};

  function sc11Uid(root) {
    if (!root._sc11Uid) root._sc11Uid = 'sc11' + Math.random().toString(36).slice(2, 8);
    return root._sc11Uid;
  }

  function sc11DiscBase(subtotal, vatMode, vatRate, lineDiscount) {
    var rate = (vatRate || 7) / 100;
    if (vatMode === 'inclusive') return subtotal / (1 + rate) - lineDiscount;
    return subtotal - lineDiscount;
  }

  function sc11InlineHtml(uid, template, calc, state) {
    state = state || {};
    var flags = SC11_TPL_FLAGS[template] || SC11_TPL_FLAGS['sales-invoice'];
    var discBase = sc11DiscBase(calc.subtotal, state.vatMode, state.vatRate, calc.lineDiscount || 0);
    var discPct = state.discountMode === 'percent' ? state.discountInput : (discBase > 0 ? (calc.billEndDiscount / discBase * 100) : 0);
    var discAmt = state.discountMode === 'amount' ? state.discountInput : calc.billEndDiscount;
    var subLbl = state.vatMode === 'inclusive' ? 'รวมจำนวนเงิน (รวมภาษี)' : 'รวมจำนวนเงิน';
    var html = '<div class="sc11-rows sc11-inline">';
    html += '<div class="summary-row" id="sumSub"><span class="lbl">' + subLbl + '</span><span class="val sc11-ro">' + fmt(calc.subtotal) + '</span></div>';
    html += '<div class="summary-row disc" id="sumLineDisc" style="' + (calc.lineDiscount > 0 ? '' : 'display:none') + '">' +
      '<span class="lbl">ส่วนลดรายการ</span><span class="val sc11-ro">' + fmt(calc.lineDiscount || 0) + '</span></div>';
    html += '<div class="summary-row disc sc11-edit-row">' +
      '<span class="lbl">ส่วนลด</span>' +
      '<span class="sc11-edit">' +
        '<input class="sc11-in pct" id="' + uid + 'DiscPct" inputmode="decimal" value="' + (discPct ? fmt(discPct) : '') + '" title="% ส่วนลดท้ายบิล">' +
        '<span class="sc11-unit">%</span>' +
        '<input class="sc11-in amt" id="' + uid + 'DiscAmt" inputmode="decimal" value="' + (discAmt ? fmt(discAmt) : '') + '" title="ยอดส่วนลดท้ายบิล (฿)">' +
      '</span></div>';
    html += '<div class="summary-row base" id="sumBase"><span class="lbl">ยอดก่อนภาษี</span><span class="val sc11-ro">' + fmt(calc.base) + '</span></div>';
    html += '<div class="summary-row sc11-edit-row">' +
      '<span class="lbl">ภาษีมูลค่าเพิ่ม ' +
        '<select class="sc11-sel" id="' + uid + 'VatMode" title="แยกภาษี / รวมในภาษี">' +
          '<option value="exclusive"' + (state.vatMode !== 'inclusive' ? ' selected' : '') + '>แยก</option>' +
          '<option value="inclusive"' + (state.vatMode === 'inclusive' ? ' selected' : '') + '>รวมใน</option>' +
        '</select></span>' +
      '<span class="sc11-edit">' +
        '<input class="sc11-in pct" id="' + uid + 'Rate" inputmode="decimal" value="' + esc(String(state.vatRate != null ? state.vatRate : 7)) + '">' +
        '<span class="sc11-unit">%</span>' +
        '<input class="sc11-in amt" id="' + uid + 'Vat" inputmode="decimal" value="' + (state.vatManual != null && state.vatManual !== '' ? fmt(state.vatManual) : fmt(calc.vat)) + '" title="ยอดภาษี (แก้เองได้)">' +
      '</span></div>';
    html += '<div class="summary-row" id="sumGross"><span class="lbl">รวมเงินทั้งสิ้น</span><span class="val sc11-ro">' + fmt(calc.gross) + '</span></div>';
    html += '<div class="summary-row disc" id="sumPostDeduct" style="' + (flags.postDeduct && calc.postDeduct > 0 ? '' : 'display:none') + '">' +
      '<span class="lbl">↩️ หักหลังบิล (รายการ)</span><span class="val sc11-ro">' + fmt(calc.postDeduct || 0) + '</span></div>';
    if (template === 'sales-invoice') {
      var refs = calc.depositRefs || [];
      html += sc11DepositRowHtml(refs, calc.deposit || 0, refs.length > 0);
    }
    html += '</div>';
    html += '<div class="summary-total"><span>' + esc(flags.totalLbl) + '</span><span class="val" id="sumNet">' + fmtSigned(calc.net) + '</span></div>';
    return html;
  }

  function sc11ReadState(root) {
    var uid = sc11Uid(root);
    var meta = _sc11Mounts[uid] || { state: {} };
    var discPct = parseNum((document.getElementById(uid + 'DiscPct') || {}).value);
    var discAmt = parseNum((document.getElementById(uid + 'DiscAmt') || {}).value);
    var discountMode = meta.state.discountEdit === 'pct' ? 'percent' : 'amount';
    var discountInput = discountMode === 'percent' ? (discPct || 0) : (discAmt || 0);
    var vatEl = document.getElementById(uid + 'Vat');
    var vatModeEl = document.getElementById(uid + 'VatMode');
    var vatTouched = meta.state.vatTouched;
    return {
      discountMode: discountMode,
      discountInput: discountInput,
      discountEdit: meta.state.discountEdit || 'amt',
      vatMode: vatModeEl ? vatModeEl.value : 'exclusive',
      vatRate: parseNum((document.getElementById(uid + 'Rate') || {}).value) || 7,
      vatManual: vatTouched && vatEl && vatEl.value.trim() !== '' ? parseNum(vatEl.value) : null,
      vatTouched: vatTouched,
      taxExempt: 0,
      wht: 0
    };
  }

  function sc11UpdateDisplay(root, calc, state) {
    var uid = sc11Uid(root);
    var meta = _sc11Mounts[uid];
    function setRO(id, val, signed) {
      var row = document.getElementById(id);
      if (!row) return;
      var v = row.querySelector('.sc11-ro');
      if (v) v.textContent = signed === false ? fmt(val) : fmtSigned(val);
    }
    setRO('sumSub', calc.subtotal, false);
    var lineDisc = document.getElementById('sumLineDisc');
    if (lineDisc) {
      lineDisc.style.display = calc.lineDiscount > 0 ? '' : 'none';
      setRO('sumLineDisc', calc.lineDiscount, false);
    }
    setRO('sumBase', calc.base, false);
    setRO('sumGross', calc.gross, false);
    var postRow = document.getElementById('sumPostDeduct');
    if (postRow) {
      postRow.style.display = calc.postDeduct > 0 ? '' : 'none';
      setRO('sumPostDeduct', calc.postDeduct, false);
    }
    var depRow = document.getElementById('sumDepRow');
    if (depRow) {
      var refs = (meta && meta.base.depositRefs) || calc.depositRefs || [];
      var show = refs.length > 0;
      depRow.style.display = show ? '' : 'none';
      if (show) {
        var amtEl = depRow.querySelector('.sc11-dep-amt');
        var refsEl = depRow.querySelector('.sc11-dep-refs');
        if (amtEl) amtEl.textContent = fmtSigned(-(calc.deposit || 0));
        if (refsEl) refsEl.innerHTML = sc11DepositRefsInner(refs);
      }
    }
    var net = document.getElementById('sumNet');
    if (net) net.textContent = fmtSigned(calc.net);
    var discPctEl = document.getElementById(uid + 'DiscPct');
    var discAmtEl = document.getElementById(uid + 'DiscAmt');
    var vatEl = document.getElementById(uid + 'Vat');
    var discBase = sc11DiscBase(calc.subtotal, state.vatMode, state.vatRate, calc.lineDiscount);
    if (discPctEl && document.activeElement !== discPctEl) {
      discPctEl.value = discBase > 0 && calc.billEndDiscount ? fmt(calc.billEndDiscount / discBase * 100) : '';
    }
    if (discAmtEl && document.activeElement !== discAmtEl) {
      discAmtEl.value = calc.billEndDiscount ? fmt(calc.billEndDiscount) : '';
    }
    if (vatEl && document.activeElement !== vatEl && !state.vatTouched) {
      vatEl.value = fmt(calc.vat);
    }
  }

  function sc11Repaint(root) {
    var uid = sc11Uid(root);
    var meta = _sc11Mounts[uid];
    if (!meta) return;
    var st = sc11ReadState(root);
    Object.assign(meta.state, st);
    var calc = swtCalcBillSummary(Object.assign({}, meta.base, meta.state, {
      depositRefs: meta.base.depositRefs || [],
      depositRefsOnly: !!meta.base.depositRefsOnly
    }));
    sc11UpdateDisplay(root, calc, meta.state);
    document.dispatchEvent(new CustomEvent('summary:recalc', { detail: calc }));
    if (meta.onRecalc) meta.onRecalc(calc);
    return calc;
  }

  function sc11BindControls(root) {
    var uid = sc11Uid(root);
    var meta = _sc11Mounts[uid];
    if (!meta) return;
    var pctEl = document.getElementById(uid + 'DiscPct');
    var amtEl = document.getElementById(uid + 'DiscAmt');
    if (pctEl) {
      pctEl.addEventListener('focus', function () { meta.state.discountEdit = 'pct'; });
      pctEl.addEventListener('input', function () { sc11Repaint(root); });
    }
    if (amtEl) {
      amtEl.addEventListener('focus', function () { meta.state.discountEdit = 'amt'; });
      amtEl.addEventListener('input', function () { sc11Repaint(root); });
    }
    var vatEl = document.getElementById(uid + 'Vat');
    if (vatEl) {
      vatEl.addEventListener('focus', function () { meta.state.vatTouched = true; });
      vatEl.addEventListener('input', function () { sc11Repaint(root); });
      vatEl.addEventListener('blur', function () {
        if (!vatEl.value.trim()) meta.state.vatTouched = false;
        sc11Repaint(root);
      });
    }
    [uid + 'Rate', uid + 'VatMode'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        el.addEventListener('change', function () { sc11Repaint(root); });
        el.addEventListener('input', function () { sc11Repaint(root); });
      }
    });
  }

  function sc11PaintRows(root, template, calc) {
    var box = root.querySelector('.sc11-rows');
    if (!box || !box.classList.contains('sc11-inline')) {
      var spec = SUMMARY_TEMPLATES[template] ? SUMMARY_TEMPLATES[template](calc) : null;
      if (!spec || !box) return;
      var html = (spec.rows || []).map(rowHtml).join('');
      if (spec.total) {
        var totalVal = spec.total.text != null ? esc(spec.total.text) : fmtSigned(spec.total.value);
        html += '<div class="summary-total"><span>' + esc(spec.total.label) + '</span>' +
          '<span class="val"' + (spec.total.id ? ' id="' + esc(spec.total.id) + '"' : '') + '>' + totalVal + '</span></div>';
      }
      box.innerHTML = html;
      return;
    }
    var meta = _sc11Mounts[sc11Uid(root)];
    sc11UpdateDisplay(root, calc, meta ? meta.state : {});
  }

  function rowHtml(r) {
    var cls = r.cls ? ' ' + r.cls : '';
    var val = r.text != null ? esc(r.text) : (r.signed === false ? fmt(r.value) : fmtSigned(r.value));
    var refHtml = r.refs && r.refs.length ? '<span class="sc11-dep-refs">' + sc11DepositRefsInner(r.refs) + '</span>' : '';
    return '<div class="summary-row' + cls + '"' + (r.id ? ' id="' + esc(r.id) + '"' : '') + '>' +
      '<span class="lbl">' + esc(r.label) + '</span><span class="val">' + val + refHtml + '</span></div>';
  }

  /**
   * SC-11 — Summary block (สรุปยอดในบิล)
   * opts: { template, calc, interactive, onRecalc }
   * interactive: ส่วนลดท้ายบิล (฿/%) · VAT แยก/รวมในภาษี · กรอก VAT เอง
   */
  function swtRenderSummary(el, opts) {
    opts = opts || {};
    var root = typeof el === 'string' ? document.querySelector(el) : el;
    if (!root) return;

    var interactive = !!opts.interactive;
    var template = opts.template;
    var calc = opts.calc;

    if (interactive && template && calc) {
      var uid = sc11Uid(root);
      var initState = {
        discountMode: opts.discountMode || 'amount',
        discountInput: opts.discountInput != null ? opts.discountInput : 0,
        discountEdit: 'amt',
        vatMode: opts.vatMode || calc.vatMode || 'exclusive',
        vatRate: opts.vatRate != null ? opts.vatRate : (calc.vatRate != null ? calc.vatRate : 7),
        vatManual: opts.vatManual != null ? opts.vatManual : null,
        vatTouched: false,
        taxExempt: 0,
        wht: 0,
      };
      var base = {
        subtotal: calc.subtotal != null ? calc.subtotal : calc.inv,
        lineDiscount: calc.lineDiscount != null ? calc.lineDiscount : 0,
        postDeduct: calc.postDeduct != null ? calc.postDeduct : 0,
        deduct: 0,
        depositRefs: calc.depositRefs || [],
        depositRefsOnly: template === 'sales-invoice',
        wht: 0,
        fee: calc.fee || 0,
        recv: calc.recv
      };
      if (template === 'ap-invoice') {
        base.postDeduct = calc.deduct != null ? calc.deduct : (calc.postDeduct || 0);
        base.deduct = 0;
      } else if (template === 'sales-invoice') {
        base.deduct = sc11SumDepositRefs(base.depositRefs);
        base.postDeduct = 0;
      }
      _sc11Mounts[uid] = {
        template: template,
        base: base,
        state: initState,
        root: root,
        onRecalc: opts.onRecalc || null
      };
      var merged = swtCalcBillSummary(Object.assign({}, base, initState, {
        depositRefs: base.depositRefs,
        depositRefsOnly: base.depositRefsOnly
      }));
      root.className = (root.className || '').replace(/\bsc11-interactive\b/g, '').trim() + ' sc11-interactive sc11-inline-ui';
      root.innerHTML = sc11InlineHtml(uid, template, merged, initState);
      sc11BindControls(root);
      return merged;
    }

    var spec = opts;
    if (template && SUMMARY_TEMPLATES[template] && calc) {
      spec = SUMMARY_TEMPLATES[template](calc);
    }

    var html = (spec.rows || []).map(rowHtml).join('');
    if (spec.total) {
      var totalVal = spec.total.text != null ? esc(spec.total.text) : fmtSigned(spec.total.value);
      html += '<div class="summary-total"><span>' + esc(spec.total.label) + '</span>' +
        '<span class="val"' + (spec.total.id ? ' id="' + esc(spec.total.id) + '"' : '') + '>' +
        totalVal + '</span></div>';
    }
    root.innerHTML = html;
  }

  /** อัปเดตยอดจากตารางรายการ + คงค่า interactive ที่ user กรอก */
  function swtSummaryRefresh(el, patch) {
    var root = typeof el === 'string' ? document.querySelector(el) : el;
    if (!root || !root.classList.contains('sc11-interactive')) {
      if (patch && patch.template && patch.calc) swtRenderSummary(root, patch);
      return null;
    }
    var uid = sc11Uid(root);
    var meta = _sc11Mounts[uid];
    if (!meta) return null;
    if (patch) {
      Object.assign(meta.base, patch);
      if (patch.depositRefs) {
        meta.base.deduct = sc11SumDepositRefs(patch.depositRefs);
      }
    }
    return sc11Repaint(root);
  }

  /** อัปเดตเอกสารมัดจำอ้างอิง → แสดงแถวหักมัดจำใน SC-11 */
  function swtSummarySetDeposits(el, refs) {
    return swtSummaryRefresh(el, { depositRefs: refs || [] });
  }

  function sc11ApplyDepositRefs(refs) {
    if (!refs || !refs.length) return;
    Object.keys(_sc11Mounts).forEach(function (uid) {
      var meta = _sc11Mounts[uid];
      if (!meta || meta.template !== 'sales-invoice' || !meta.root) return;
      meta.base.depositRefs = refs;
      meta.base.deduct = sc11SumDepositRefs(refs);
      sc11Repaint(meta.root);
    });
  }

  function sc11DepositRefsFromDocRows(rows) {
    return (rows || []).filter(function (p) {
      var t = String(p.type || '');
      return t.indexOf('มัดจำ') >= 0 || t.indexOf('DP') >= 0;
    }).map(function (p) {
      return { no: p.no, amount: parseNum(p.amt) || 0, href: p.href || 'sl3-deposit-mockup.html' };
    }).filter(function (r) { return r.amount > 0; });
  }

  function sc11DepositRefsFromDepositLines(lines) {
    return (lines || []).map(function (l) {
      return { no: l.no, amount: Number(l.amount || l.applied || 0), href: l.href || 'sl3-deposit-mockup.html' };
    }).filter(function (r) { return r.amount > 0; });
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('doc:pulled', function (e) {
      var refs = sc11DepositRefsFromDocRows(e.detail && e.detail.rows);
      if (refs.length) sc11ApplyDepositRefs(refs);
    });
    document.addEventListener('deposit:applied', function (e) {
      var d = e.detail || {};
      if (d.mode !== 'apply') return;
      var refs = sc11DepositRefsFromDepositLines(d.lines);
      if (refs.length) sc11ApplyDepositRefs(refs);
    });
  }

  /** อัปเดตแถว summary ที่มี id อยู่แล้วใน DOM */
  function swtApplySummaryIds(calc, template) {
    var spec = SUMMARY_TEMPLATES[template] ? SUMMARY_TEMPLATES[template](calc) : null;
    if (!spec) return;
    spec.rows.forEach(function (r) {
      if (!r.id) return;
      var e = document.getElementById(r.id);
      if (e) {
        var v = e.querySelector('.val');
        if (v) v.textContent = fmtSigned(r.value);
      }
    });
    if (spec.total && spec.total.id) {
      var t = document.getElementById(spec.total.id);
      if (t) t.textContent = fmtSigned(spec.total.value);
    }
  }

  /** FI-2: คำนวณจากแถว AP ที่เลือก */
  function swtCalcPaymentFromRows(selector) {
    var ap = 0, wht = 0, net = 0, fee = 0;
    document.querySelectorAll(selector).forEach(function (tr) {
      var c = tr.querySelector('input[type=checkbox]');
      if (!c || !c.checked) return;
      ap += Number(tr.getAttribute('data-amt') || 0);
      wht += Number(tr.getAttribute('data-wht') || 0);
      net += Number(tr.getAttribute('data-net') || 0);
    });
    return { ap: ap, inv: ap, wht: wht, fee: fee, net: net || ap - wht - fee };
  }

  function swtRecalcPaymentSummary(rowSelector, mountSelector) {
    var calc = swtCalcPaymentFromRows(rowSelector || '#apRows tr:not(.empty-row)');
    var mount = mountSelector ? document.querySelector(mountSelector) : null;
    if (mount) {
      swtRenderSummary(mount, { template: 'payment', calc: calc });
    } else {
      swtApplySummaryIds(calc, 'payment');
    }
    return calc;
  }

  function swtCalcArReceiptFromRows(rowSelector, recvAmt, cashDisc, arOpenBefore) {
    var apply = 0;
    document.querySelectorAll(rowSelector || '#arRows tr:not(.empty-row)').forEach(function (tr) {
      var c = tr.querySelector('input[type=checkbox]');
      if (!c || !c.checked) return;
      apply += Number(tr.getAttribute('data-apply') || tr.getAttribute('data-amt') || 0);
    });
    recvAmt = Number(recvAmt != null ? recvAmt : apply);
    cashDisc = Number(cashDisc || 0);
    var unapplied = Math.max(0, recvAmt - apply - cashDisc);
    var arRemain = Math.max(0, Number(arOpenBefore || 0) - apply - cashDisc);
    return { recv: recvAmt, apply: apply, cashDisc: cashDisc, unapplied: unapplied, arRemain: arRemain };
  }

  function swtRecalcArReceiptSummary(rowSelector, mountSelector, opts) {
    opts = opts || {};
    var calc = swtCalcArReceiptFromRows(rowSelector, opts.recvAmt, opts.cashDisc, opts.arOpenBefore);
    var mount = mountSelector ? document.querySelector(mountSelector) : null;
    if (mount) {
      swtRenderSummary(mount, { template: 'ar-receipt', calc: calc });
    }
    return calc;
  }

  function swtRecalcApInvoiceSummary(rowSelector, mountSelector) {
    var sel = rowSelector || 'table.items tbody tr:not(.empty-row)';
    var inv = 0, lineDisc = 0, deduct = 0;
    document.querySelectorAll(sel).forEach(function (tr) {
      var k = tr.getAttribute('data-kind');
      var amt = Number(tr.getAttribute('data-amt') || 0);
      if (k === 'inv') inv += amt;
      else if (k === 'billdisc') lineDisc += Math.abs(amt);
      else if (k === 'deduct') deduct += Math.abs(amt);
    });
    var mount = mountSelector || null;
    if (mount && document.querySelector(mount) && document.querySelector(mount).classList.contains('sc11-interactive')) {
      return swtSummaryRefresh(mount, { subtotal: inv, lineDiscount: lineDisc, postDeduct: deduct });
    }
    var calc = swtCalcBillSummary({ subtotal: inv, lineDiscount: lineDisc, discountMode: 'amount', discountInput: 0, deduct: deduct });
    swtApplySummaryIds(calc, 'ap-invoice');
    return calc;
  }

  /** maker === checker → block post */
  function swtMakerCheckerOk(makerId, checkerId) {
    if (!makerId || !checkerId) return true;
    return String(makerId).toLowerCase() !== String(checkerId).toLowerCase();
  }

  global.swtFmt = fmt;
  global.swtFmtSigned = fmtSigned;
  global.swtCalcVatGolden = swtCalcVatGolden;
  global.swtCalcBillSummary = swtCalcBillSummary;
  global.swtCalcFromItemRows = swtCalcFromItemRows;
  global.swtCalcPaymentFromRows = swtCalcPaymentFromRows;
  global.swtRenderStatusStrip = swtRenderStatusStrip;
  global.swtRenderDocChain = swtRenderDocChain;
  global.swtRenderGateAlert = swtRenderGateAlert;
  global.swtSaabMoreToggle = swtSaabMoreToggle;
  if (typeof document !== 'undefined') {
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.saab-more-wrap')) {
        document.querySelectorAll('.saab-more-wrap.open').forEach(function (w) { w.classList.remove('open'); });
      }
    });
  }
  global.swtRenderSummary = swtRenderSummary;
  global.swtSummaryRefresh = swtSummaryRefresh;
  global.swtSummarySetDeposits = swtSummarySetDeposits;
  global.swtApplySummaryIds = swtApplySummaryIds;
  global.swtRecalcPaymentSummary = swtRecalcPaymentSummary;
  global.swtCalcArReceiptFromRows = swtCalcArReceiptFromRows;
  global.swtRecalcArReceiptSummary = swtRecalcArReceiptSummary;
  global.swtRecalcApInvoiceSummary = swtRecalcApInvoiceSummary;
  global.swtMakerCheckerOk = swtMakerCheckerOk;

  // swt-tip: วางตำแหน่ง popover เองกันล้นจอ (กาง ซ้าย/ขวา/กลาง ตามพื้นที่) — ครอบทุก tip ไม่ต้องกำหนด pop-left/right เอง
  function swtTipPlace(el){
    var pop = el.querySelector('.swt-tip-pop'); if (!pop) return;
    var ir = el.getBoundingClientRect();
    var popW = pop.offsetWidth || 320, popH = pop.offsetHeight || 0;
    var left = ir.left + ir.width / 2 - popW / 2;                        // กลางไอคอน
    left = Math.max(8, Math.min(left, window.innerWidth - popW - 8));    // clamp ไม่ล้นซ้าย/ขวา
    var top = ir.bottom + 7;
    if (top + popH > window.innerHeight - 8) top = ir.top - popH - 7;    // ล่างไม่พอ → เด้งขึ้นบน
    pop.style.left = left + 'px'; pop.style.top = top + 'px';
  }
  // swt-tip: คลิกไอคอน → toggle popover ค้าง (hover เปิดผ่าน CSS) · คลิกที่ว่าง = ปิด
  function swtTipToggle(el, ev){
    if (ev) ev.stopPropagation();
    document.querySelectorAll('.swt-tip.open').forEach(function(t){ if (t !== el) t.classList.remove('open'); });
    swtTipPlace(el);
    el.classList.toggle('open');
  }
  if (typeof document !== 'undefined') {
    document.addEventListener('click', function(e){
      if (!e.target.closest('.swt-tip')) document.querySelectorAll('.swt-tip.open').forEach(function(t){ t.classList.remove('open'); });
    });
    // hover: วางตำแหน่งก่อน popover เด้ง (กันล้น)
    document.addEventListener('mouseover', function(e){ var t = e.target.closest && e.target.closest('.swt-tip'); if (t) swtTipPlace(t); });
  }
  global.swtTipToggle = swtTipToggle;
  global.swtTipPlace = swtTipPlace;
})(typeof window !== 'undefined' ? window : this);
