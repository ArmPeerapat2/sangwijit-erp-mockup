/* ════════════════════════════════════════════════════════════════
   swt-doc-finder.js — Shared "📂 เปิดเอกสารเก่า" + Customer/Product picker
   ใช้:  <script src="swt-doc-finder.js"></script>  แล้วผูกปุ่ม onclick="dfOpen()"
   self-contained: inject ทั้ง CSS + markup เอง · ไม่พึ่ง CSS ของหน้า
   API:
     dfOpen() / dfClose()            เปิด-ปิด modal ค้นหาเอกสารเก่า (3 แท็บ + result side-list)
     dfOpenCust() / dfOpenProd()     เปิด picker ลูกค้า/สินค้า (iframe sc1/sc2)
     dfOpenVend()                    เปิด picker เจ้าหนี้/Vendor (iframe sc3) — ใช้ในฟอร์ม PO/AP
     dfVendorMode()                  relabel เงื่อนไขค้นเอกสารเก่าเป็นฝั่งเจ้าหนี้ (เรียกตอนสร้างฟอร์ม PO/AP)
     dfOpenRef(opts)                 SC-5+ อ้างอิงเอกสาร · opts: {docType, partyName, partyId}
     dfRefPull()                     ดึงเอกสารที่เลือกเข้าฟอร์ม (mock)
   อ้างอิง layout จากระบบเดิม 3.5 บันทึกขายสินค้าและบริการ
   ════════════════════════════════════════════════════════════════ */
(function(){
  /* ---- สีสถานะ (อธิบายสีตัวอักษร · อ้างอิงระบบเดิม) ---- */
  var DF_STATUS = {
    normal:  {c:'#1F2937', t:'1·ปกติ/รายการใหม่'},
    approved:{c:'#2563EB', t:'2·ได้รับการอนุมัติแล้ว'},
    refpart: {c:'#16A34A', t:'3·ถูกอ้างอิงบางส่วน'},
    reffull: {c:'#0891B2', t:'4·ถูกอ้างอิงทั้งหมดแล้ว'},
    cancel:  {c:'#EF4444', t:'5·ยกเลิก'},
    closed:  {c:'#F59E0B', t:'6·ปิดรายการคงค้าง'},
    etax:    {c:'#B45309', t:'7·E-TAX'}
  };
  /* ---- ตัวอย่างผลค้นหา (mock) ---- */
  var DF_ROWS = [
    {no:'08QT-2604-0015', d:'20 เม.ย. 26', p:'‹ลูกค้า A›',  amt:'103,439.00', st:'approved'},
    {no:'08QT-2604-0014', d:'19 เม.ย. 26', p:'‹ลูกค้า C›',  amt:'8,250.00',   st:'reffull'},
    {no:'08QT-2604-0013', d:'19 เม.ย. 26', p:'‹ลูกค้า D›',  amt:'61,000.00',  st:'refpart'},
    {no:'08QT-2604-0012', d:'18 เม.ย. 26', p:'‹ลูกค้า B›',  amt:'52,000.00',  st:'normal'},
    {no:'08QT-2604-0011', d:'18 เม.ย. 26', p:'‹ลูกค้า E›',  amt:'15,900.00',  st:'closed'},
    {no:'08QT-2604-0010', d:'17 เม.ย. 26', p:'‹ลูกค้า F›',  amt:'0.00',       st:'cancel'},
    {no:'08INV-2604-0221',d:'17 เม.ย. 26', p:'‹ลูกค้า G›',  amt:'242,000.00', st:'etax'}
  ];

  /* SC-5+ — โปรไฟล์อ้างอิงตาม docType (localize แท็บ+แถว) */
  var DF_REF_PROFILES = {
    SL: {
      partyLabel: 'ลูกหนี้',
      tabs: [
        { id: 'all', label: 'ทั้งหมด' },
        { id: 'QT', label: 'ใบเสนอราคา' },
        { id: 'SO', label: 'ใบจอง' },
        { id: 'DP', label: 'ใบมัดจำ' },
        { id: 'INV', label: 'ใบขาย' }
      ],
      rows: [
        { g: 'QT', type: 'ใบเสนอราคา', no: '08QT-2606-0047', date: '06 มิ.ย. 26', amt: '17,430.30', status: 'อนุมัติ', sc: '#2563EB' },
        { g: 'SO', type: 'ใบจอง', no: '08SO-2606-0021', date: '06 มิ.ย. 26', amt: '17,430.30', status: 'Confirmed', sc: '#16A34A' },
        { g: 'SO', type: 'ใบจอง', no: '08SO-2606-0025', date: '08 มิ.ย. 26', amt: '5,200.00', status: 'Confirmed', sc: '#16A34A' },
        { g: 'DP', type: 'ใบมัดจำ', no: '08DP-2606-0009', date: '06 มิ.ย. 26', amt: '6,290.00', status: 'Posted', sc: '#0891B2' },
        { g: 'INV', type: 'ใบขาย', no: '08INV-2606-0210', date: '02 มิ.ย. 26', amt: '8,900.00', status: 'Posted', sc: '#0891B2' }
      ]
    },
    PO: {
      partyLabel: 'เจ้าหนี้',
      tabs: [
        { id: 'all', label: 'ทั้งหมด' },
        { id: 'PR', label: 'ใบขอซื้อ (PR)' },
        { id: 'RFQ', label: 'RFQ Vendor' },
        { id: 'PO', label: 'ใบสั่งซื้อ' }
      ],
      rows: [
        { g: 'PR', type: 'ใบขอซื้อ', no: 'PR-2606-0019', date: '05 มิ.ย. 26', amt: '2,418,200.00', status: 'อนุมัติ', sc: '#2563EB' },
        { g: 'RFQ', type: 'RFQ Vendor', no: 'RFQ-2606-0003', date: '04 มิ.ย. 26', amt: '2,260,000.00', status: 'ตอบแล้ว', sc: '#16A34A' },
        { g: 'PO', type: 'ใบสั่งซื้อ', no: 'PO-2606-0041', date: '01 มิ.ย. 26', amt: '890,000.00', status: 'ค้างรับ', sc: '#D97706' }
      ]
    },
    WH: {
      partyLabel: 'เจ้าหนี้',
      tabs: [
        { id: 'all', label: 'ทั้งหมด' },
        { id: 'PO', label: 'ใบสั่งซื้อ (PO)' },
        { id: 'TO', label: 'โอนคลัง (TO)' }
      ],
      rows: [
        { g: 'PO', type: 'ใบสั่งซื้อ', no: 'PO-2606-0042', date: '07 มิ.ย. 26', amt: '2,418,200.00', status: 'ค้างรับ', sc: '#D97706' },
        { g: 'PO', type: 'ใบสั่งซื้อ', no: 'PO-2606-0038', date: '28 พ.ค. 26', amt: '156,000.00', status: 'รับครบ', sc: '#16A34A' },
        { g: 'TO', type: 'โอนคลัง', no: 'TO-2606-0011', date: '10 มิ.ย. 26', amt: '—', status: 'Open', sc: '#2563EB' }
      ]
    },
    FI: {
      partyLabel: 'ลูกหนี้',
      tabs: [
        { id: 'all', label: 'ทั้งหมด' },
        { id: 'INV', label: 'บิลขาย' },
        { id: 'DP', label: 'มัดจำ' },
        { id: 'AP', label: 'AP' }
      ],
      rows: [
        { g: 'INV', type: 'บิลขาย', no: 'INV-2606-0221', date: '13 มิ.ย. 26', amt: '11,140.30', status: 'ร่าง', sc: '#6B7280' },
        { g: 'DP', type: 'มัดจำ', no: 'DP-2606-0009', date: '06 มิ.ย. 26', amt: '6,290.00', status: 'Posted', sc: '#0891B2' },
        { g: 'AP', type: 'AP', no: 'AP-2606-0088', date: '17 มิ.ย. 26', amt: '2,339,836.00', status: 'ค้างจ่าย', sc: '#D97706' }
      ]
    }
  };

  var _dfRefCtx = { docType: 'SL', partyName: '' };

  var CSS = `
  .df-bg{display:none;position:fixed;inset:0;background:rgba(0,0,0,.42);z-index:950;align-items:center;justify-content:center;font-family:'Inter','Noto Sans Thai',sans-serif;font-size:13px}
  .df-bg.on{display:flex}
  .df-modal{background:#fff;border-radius:10px;box-shadow:0 12px 44px rgba(0,0,0,.28);display:flex;flex-direction:column;max-height:92vh}
  .df-find{width:1080px;max-width:97vw}
  .df-pick{width:1040px;max-width:96vw}
  .df-x{flex-shrink:0;width:30px;height:30px;border:none;border-radius:6px;background:#F3F4F6;color:#6B7280;font-size:17px;line-height:1;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;padding:0}
  .df-x:hover{background:#FEE2E2;color:#DC2626}
  .df-hd{display:flex;align-items:center;gap:12px;padding:13px 18px;border-bottom:1px solid #E5E7EB}
  .df-hd h3{margin:0;font-size:15px;color:#111827;font-weight:700}
  .df-hd .sub{color:#9CA3AF;font-style:italic;font-size:12px}
  .df-sp{flex:1}
  .df-want{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600;color:#374151}
  .df-want input{width:66px;padding:3px 6px;border:1px solid #CBD5E1;border-radius:4px;text-align:right;font-family:monospace}
  .df-btn{display:inline-flex;align-items:center;gap:5px;padding:7px 14px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid transparent;font-family:inherit}
  .df-btn.pri{background:#2563EB;color:#fff}.df-btn.ok{background:#10B981;color:#fff}.df-btn.out{background:#fff;color:#374151;border-color:#E5E7EB}
  .df-body{display:grid;grid-template-columns:560px 1fr;flex:1;min-height:0}
  .df-cond{padding:0;border-right:1px solid #E5E7EB;overflow:auto;display:flex;flex-direction:column}
  .df-tabs{display:flex;border-bottom:1px solid #E5E7EB;background:#F8FAFC}
  .df-tabs button{padding:10px 14px;font-size:12px;font-weight:600;color:#6B7280;background:transparent;border:none;border-bottom:2px solid transparent;cursor:pointer;font-family:inherit}
  .df-tabs button.on{color:#2563EB;border-bottom-color:#2563EB;background:#fff}
  .df-pane{display:none;padding:14px}.df-pane.on{display:block}
  .df-grid{display:grid;grid-template-columns:auto 1fr;gap:7px 10px;align-items:center;font-size:12px}
  .df-grid label{color:#6B7280;text-align:right;white-space:nowrap}
  .df-grid input,.df-grid select{padding:4px 8px;border:1px solid #E5E7EB;border-radius:4px;font-size:12px;font-family:inherit;width:100%}
  .df-rng{width:100%;border-collapse:collapse;font-size:11.5px;margin-top:10px}
  .df-rng th{background:#F0F4FF;border:1px solid #D6E0F5;padding:4px 6px;font-weight:600;color:#374151}
  .df-rng td{border:1px solid #E5E7EB;padding:1px 4px}
  .df-rng td input{border:none;width:100%;font-size:11.5px;font-family:inherit;outline:none;background:transparent}
  .df-rng input.find{cursor:pointer;color:#2563EB}
  .df-res{display:flex;flex-direction:column;min-height:0}
  .df-legend{display:flex;flex-wrap:wrap;gap:4px 12px;padding:8px 14px;border-bottom:1px solid #F3F4F6;background:#FCFCFD}
  .df-legend span{font-size:10.5px;font-weight:700}
  .df-list{flex:1;overflow:auto}
  .df-list table{width:100%;border-collapse:collapse;font-size:12px}
  .df-list thead th{position:sticky;top:0;background:#F8FAFC;padding:7px 12px;text-align:left;border-bottom:1px solid #E5E7EB;font-size:10px;color:#6B7280;text-transform:uppercase;z-index:2}
  .df-list tbody td{padding:7px 12px;border-bottom:1px solid #F3F4F6;font-weight:600}
  .df-list tbody tr{cursor:pointer}
  .df-list tbody tr:hover{background:#EFF6FF}
  .df-num{text-align:right;font-family:'Inter',monospace}
  .df-ft{display:flex;gap:8px;justify-content:flex-end;padding:12px 18px;border-top:1px solid #E5E7EB}
  /* picker */
  .df-phead{display:flex;align-items:center;gap:12px;padding:13px 18px 13px 18px;border-bottom:1px solid #E5E7EB;flex-wrap:wrap}
  .df-phead .df-x{margin-left:auto}
  .df-ptabs{display:flex;gap:4px}
  .df-ptabs button{padding:5px 12px;border:1px solid #E5E7EB;background:#F8FAFC;border-radius:6px;font-size:11.5px;font-weight:600;cursor:pointer;font-family:inherit}
  .df-ptabs button.on{background:#2563EB;color:#fff;border-color:#2563EB}
  .df-search{display:flex;align-items:center;gap:6px;background:#F3F4F6;border-radius:8px;padding:5px 12px}
  .df-search input{border:none;background:transparent;outline:none;font-size:12px;font-family:inherit;width:240px}
  .df-pwrap{overflow:auto;max-height:60vh;padding:0 4px}
  .df-pwrap table{width:100%;border-collapse:collapse;font-size:11.5px;white-space:nowrap}
  .df-pwrap thead th{position:sticky;top:0;background:#F8FAFC;padding:7px 9px;text-align:left;border-bottom:1px solid #E5E7EB;font-size:10px;color:#6B7280;text-transform:uppercase;z-index:2}
  .df-pwrap tbody td{padding:6px 9px;border-bottom:1px solid #F3F4F6}
  .df-pwrap tbody tr{cursor:pointer}.df-pwrap tbody tr:hover{background:#EFF6FF}
  .df-warn{color:#EF4444;font-weight:600}
  .df-frame-wrap{position:relative;width:100vw;height:100vh;max-width:none;background:transparent;border-radius:0;overflow:hidden;box-shadow:none;display:flex}
  .df-frame-x{position:absolute;top:14px;right:18px;z-index:20;width:36px;height:36px;border:none;border-radius:50%;background:rgba(15,23,42,0.72);color:#fff;font-size:18px;line-height:1;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;padding:0;box-shadow:0 2px 8px rgba(0,0,0,.25)}
  .df-frame-x:hover{background:#DC2626}
  .df-frame-wrap iframe{flex:1;border:none;width:100%;height:100%}
  `;

  function legendHTML(){
    return Object.keys(DF_STATUS).map(function(k){
      var s=DF_STATUS[k]; return '<span style="color:'+s.c+'">●&nbsp;'+s.t+'</span>';
    }).join('');
  }
  function rowsHTML(){
    return DF_ROWS.map(function(r){
      var c=DF_STATUS[r.st].c;
      return '<tr onclick="dfClose()" style="color:'+c+'"><td>'+r.no+'</td><td>'+r.d+'</td><td>'+r.p+'</td><td class="df-num">'+r.amt+'</td></tr>';
    }).join('');
  }

  var HTML = `
  <!-- 📂 FIND DOC -->
  <div class="df-bg" id="dfFind"><div class="df-modal df-find">
    <div class="df-hd">
      <h3>📂 ค้นหา / เปิดเอกสารเก่า</h3><span class="sub">อ้างอิงระบบเดิม 3.5</span><div class="df-sp"></div>
      <span class="df-want">ผลลัพธ์ที่ต้องการ <input type="number" value="300"></span>
      <button class="df-btn pri" onclick="dfRun()">🔍 ค้นหา</button>
      <button type="button" class="df-x" onclick="dfClose()" title="ปิด (Esc)" aria-label="ปิด">✕</button>
    </div>
    <div class="df-body">
      <div class="df-cond">
        <div class="df-tabs">
          <button class="on" onclick="dfTab(this,'dp-std')">เงื่อนไขมาตรฐาน</button>
          <button onclick="dfTab(this,'dp-party')" id="dfPartyTab">เงื่อนไขลูกค้า</button>
          <button onclick="dfTab(this,'dp-item')">เงื่อนไขสินค้า</button>
        </div>
        <div class="df-pane on" id="dp-std">
          <div class="df-grid">
            <label>เริ่มจากวันที่</label><input value="01/06/2569">
            <label>ถึงวันที่</label><input value="06/06/2569">
            <label>พนักงานขาย</label><select><option>ทั้งหมด</option></select>
            <label>สาขา</label><select><option>ทั้งหมด (ตามสิทธิ์)</option></select>
            <label>แผนก</label><select><option>ทั้งหมด (ตามสิทธิ์)</option></select>
            <label>โครงการ</label><select><option>ทั้งหมด</option></select>
            <label>การจัดสรร</label><select><option>ทั้งหมด</option></select>
            <label>กลุ่มข้อมูล</label><select><option>ทั้งหมด</option></select>
            <label>สถานะคงค้าง</label><select><option>ทั้งหมด</option><option>คงค้าง</option><option>ปิดแล้ว</option></select>
            <label>เลขที่เอกสารอ้างอิง</label><input>
            <label>ช่วงครบกำหนด</label><span style="display:flex;gap:6px"><input placeholder="จาก"><input placeholder="ถึง"></span>
          </div>
        </div>
        <div class="df-pane" id="dp-party">
          <div class="df-grid">
            <label>ระบุกลุ่ม</label><select><option></option></select>
            <label>ระบุกลุ่มย่อย</label><select><option></option></select>
            <label>ระบุประเภท</label><select><option></option></select>
            <label>เขตการขาย</label><select><option></option></select>
            <label>เงื่อนไขการชำระ</label><select><option></option></select>
          </div>
          <table class="df-rng"><thead><tr><th style="width:22px"></th><th>จากรหัส</th><th>ถึงรหัส</th></tr></thead><tbody>
            <tr><td>1</td><td><input class="find" readonly onclick="dfOpenCust()" placeholder="🔍 เลือก"></td><td><input readonly></td></tr>
            <tr><td>2</td><td><input class="find" readonly onclick="dfOpenCust()" placeholder="🔍 เลือก"></td><td><input readonly></td></tr>
            <tr><td>3</td><td><input class="find" readonly onclick="dfOpenCust()" placeholder="🔍 เลือก"></td><td><input readonly></td></tr>
          </tbody></table>
        </div>
        <div class="df-pane" id="dp-item">
          <div class="df-grid">
            <label>ระบุกลุ่ม</label><select><option></option></select>
            <label>ระบุกลุ่มย่อย</label><select><option></option></select>
            <label>ระบุประเภท</label><select><option></option></select>
            <label>ระบุยี่ห้อ</label><select><option></option></select>
            <label>ระบุรุ่น</label><select><option></option></select>
            <label>Rebate</label><select><option></option></select>
            <label>ตัวแทนฯหลัก</label><input>
            <label>กลุ่มการขาย</label><select><option></option></select>
          </div>
          <table class="df-rng"><thead><tr><th style="width:22px"></th><th>จากรหัส</th><th>ถึงรหัส</th></tr></thead><tbody>
            <tr><td>1</td><td><input class="find" readonly onclick="dfOpenProd()" placeholder="🔍 เลือก"></td><td><input readonly></td></tr>
            <tr><td>2</td><td><input class="find" readonly onclick="dfOpenProd()" placeholder="🔍 เลือก"></td><td><input readonly></td></tr>
            <tr><td>3</td><td><input class="find" readonly onclick="dfOpenProd()" placeholder="🔍 เลือก"></td><td><input readonly></td></tr>
          </tbody></table>
        </div>
      </div>
      <div class="df-res">
        <div class="df-legend">`+legendHTML()+`</div>
        <div class="df-list"><table>
          <thead><tr><th>เลขที่</th><th>วันที่</th><th>ลูกค้า/คู่ค้า</th><th class="df-num">ยอด</th></tr></thead>
          <tbody id="dfRows">`+rowsHTML()+`</tbody>
        </table></div>
      </div>
    </div>
    <div class="df-ft">
      <button class="df-btn out" onclick="dfClose()">Esc = ยกเลิก</button>
      <button class="df-btn ok" onclick="dfClose()">F11 = ตกลง (เปิดเอกสาร)</button>
    </div>
  </div></div>

  <!-- 🔎 CUSTOMER PICKER (ฝั่งซื้อ = เจ้าหนี้) -->
  <div class="df-bg" id="dfCust"><div class="df-modal df-pick">
    <div class="df-phead">
      <h3 style="margin:0;font-size:15px;font-weight:700">🔎 Customer Search <span class="sub" id="dfCustKind" style="color:#9CA3AF;font-style:italic;font-size:12px">(ลูกค้า)</span></h3>
      <div class="df-sp"></div>
      <div class="df-search">🔍<input placeholder="ค้นหา: รหัส / ชื่อ / โทร…"></div>
      <button type="button" class="df-x" onclick="dfCloseCust()" title="ปิด (Esc)" aria-label="ปิด">✕</button>
    </div>
    <div class="df-pwrap"><table>
      <thead><tr><th>รหัส</th><th>ชื่อ</th><th>ที่อยู่</th><th>โทรศัพท์</th><th class="df-num">ยอดหนี้</th><th class="df-num">เช็คในมือ</th><th class="df-num">เช็คคืน</th><th>ข้อความเตือน</th><th>พนักงานขาย</th></tr></thead>
      <tbody>
        <tr onclick="dfCloseCust()"><td>342100008</td><td>ร้าน ตอง 777 อิเล็คทรอนิคส์</td><td>86/1 ม.4 ต.นาแก อ.นาแก</td><td>—</td><td class="df-num">12,500.00</td><td class="df-num">0.00</td><td class="df-num">0.00</td><td class="df-warn">เกินกำหนด</td><td>‹ผู้ขาย›</td></tr>
        <tr onclick="dfCloseCust()"><td>347010046</td><td>คุณ นฤมล พรมไพสน</td><td>149 ม.2 ต.ดงชน อ.เมืองสกล</td><td>084-7877794</td><td class="df-num">0.00</td><td class="df-num">0.00</td><td class="df-num">0.00</td><td></td><td>‹ผู้ขาย›</td></tr>
        <tr onclick="dfCloseCust()"><td>347010064</td><td>คุณ วีระชัย สิริเรืองสกุล</td><td>777 ม.1 ต.ท่าแร่ อ.เมือง</td><td>083-3625600</td><td class="df-num">45,000.00</td><td class="df-num">20,000.00</td><td class="df-num">0.00</td><td></td><td>‹ผู้ขาย›</td></tr>
      </tbody>
    </table></div>
    <div class="df-ft"><button class="df-btn out" onclick="dfCloseCust()">ปิด</button></div>
  </div></div>

  <!-- 🔎 PRODUCT PICKER -->
  <div class="df-bg" id="dfProd"><div class="df-modal df-pick">
    <div class="df-phead">
      <h3 style="margin:0;font-size:15px;font-weight:700">🔎 Product Search</h3>
      <div class="df-ptabs"><button class="on">สินค้า</button><button>บริการ</button><button>สินค้าชุด</button></div>
      <div class="df-sp"></div>
      <div class="df-search">🔍<input placeholder="ค้นหา: รหัส / ชื่อ / รุ่น…"></div>
      <button type="button" class="df-x" onclick="dfCloseProd()" title="ปิด (Esc)" aria-label="ปิด">✕</button>
    </div>
    <div class="df-pwrap"><table>
      <thead><tr><th>รหัสสินค้า</th><th>ชื่อสินค้า</th><th>หน่วย</th><th class="df-num">สต็อก</th><th class="df-num">สั่งขาย</th><th class="df-num">สุทธิ</th><th class="df-num">สั่งซื้อ</th><th class="df-num">ขอจ่าย</th><th class="df-num">ขอโอน</th></tr></thead>
      <tbody>
        <tr onclick="dfCloseProd()"><td>01-OA03-4...</td><td>ฟิล์มแฟกซ์ PANASONIC KX-FA55A</td><td>ม้วน</td><td class="df-num">—</td><td class="df-num"></td><td class="df-num"></td><td class="df-num"></td><td class="df-num"></td><td class="df-num"></td></tr>
        <tr onclick="dfCloseProd()"><td>01xx011x7...</td><td>กระเป๋าสกรีน แสงวิจิตร+TEFAL</td><td>ใบ</td><td class="df-num">41</td><td class="df-num">0</td><td class="df-num">41</td><td class="df-num">0</td><td class="df-num">0</td><td class="df-num">0</td></tr>
        <tr onclick="dfCloseProd()"><td>02-HA01-0...</td><td>ใบพัดลมโคจร 16" (PROPELLER FAN ASSY)</td><td>ใบ</td><td class="df-num">12</td><td class="df-num">2</td><td class="df-num">10</td><td class="df-num">0</td><td class="df-num">0</td><td class="df-num">0</td></tr>
      </tbody>
    </table></div>
    <div class="df-ft"><button class="df-btn out" onclick="dfCloseProd()">ปิด</button></div>
  </div></div>

  <!-- 🔗 REFERENCE PICKER (อ้างอิงเอกสาร · scope ตามลูกหนี้/เจ้าหนี้ · multi-select หลายใบ) -->
  <div class="df-bg" id="dfRef"><div class="df-modal df-pick">
    <div class="df-phead">
      <h3 style="margin:0;font-size:15px;font-weight:700">🔗 อ้างอิงเอกสาร <span class="sub" id="dfRefParty" style="color:#9CA3AF;font-style:italic;font-size:12px">(ลูกหนี้: คุณ อดิเทพ ไชยเศรษฐ์)</span></h3>
      <div class="df-ptabs" id="dfRefTabs"></div>
      <div class="df-sp"></div>
      <div class="df-search">🔍<input placeholder="ค้นหาเลขที่/วันที่…"></div>
      <button type="button" class="df-x" onclick="dfCloseRef()" title="ปิด (Esc)" aria-label="ปิด">✕</button>
    </div>
    <div class="df-pwrap"><table>
      <thead><tr><th style="width:34px"></th><th>ประเภท</th><th>เลขที่</th><th>วันที่</th><th class="df-num">ยอด</th><th>สถานะ</th></tr></thead>
      <tbody id="dfRefRows"></tbody>
    </table></div>
    <div class="df-ft"><span id="dfRefCount" style="margin-right:auto;font-size:11px;color:#6B7280">เลือก 0 รายการ</span><button class="df-btn out" onclick="dfCloseRef()">ปิด</button><button class="df-btn ok" onclick="dfRefPull()">↩ ดึงเข้าฟอร์ม</button></div>
  </div></div>

  <!-- iframe modal — โหลด sc1/sc2 (Customer/Product Search ตัวหลัก) -->
  <div class="df-bg" id="dfFrame"><div class="df-frame-wrap">
    <button type="button" class="df-frame-x" onclick="dfCloseFrame()" title="ปิด (Esc)" aria-label="ปิด">✕</button>
    <iframe id="dfFrameSrc" src="about:blank"></iframe>
  </div></div>
  `;

  /* inject */
  function inject(){
    var st=document.createElement('style'); st.id='df-style'; st.textContent=CSS; document.head.appendChild(st);
    var wrap=document.createElement('div'); wrap.innerHTML=HTML; document.body.appendChild(wrap);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',inject); else inject();

  /* API */
  window.dfOpen=function(){document.getElementById('dfFind').classList.add('on');};
  window.dfClose=function(){document.getElementById('dfFind').classList.remove('on');};
  window.dfRun=function(){/* mock: ปกติจะ query แล้ว re-render #dfRows */};
  window.dfTab=function(btn,id){
    var tabs=btn.parentElement; tabs.querySelectorAll('button').forEach(function(b){b.classList.remove('on');}); btn.classList.add('on');
    var cond=tabs.parentElement; cond.querySelectorAll('.df-pane').forEach(function(p){p.classList.remove('on');});
    document.getElementById(id).classList.add('on');
  };
  /* ลูกค้า/สินค้า = เปิด sc1/sc2 (ตัวหลัก) เป็น iframe modal · #dfCust/#dfProd inline = สำรอง (ไม่ใช้แล้ว) */
  function dfFrameOpen(src,title){
    var f=document.getElementById('dfFrameSrc'); f.src=src;
    document.getElementById('dfFrame').classList.add('on');
  }
  window.dfCloseFrame=function(){var m=document.getElementById('dfFrame');m.classList.remove('on');document.getElementById('dfFrameSrc').src='about:blank';};
  window.dfOpenCust=function(){dfFrameOpen('sc1-customer-search-mockup.html','🔎 ค้นหาลูกหนี้ (SC-1)');};
  window.dfOpenProd=function(){dfFrameOpen('bc365/sc2-item-search-mockup.html','🔎 ค้นหาสินค้า (SC-2)');};
  window.dfOpenVend=function(){dfFrameOpen('sc3-vendor-search-mockup.html','🔎 ค้นหาเจ้าหนี้/Vendor (SC-3)');};
  window.dfCloseCust=function(){dfCloseFrame();};
  window.dfCloseProd=function(){dfCloseFrame();};
  window.dfCloseVend=function(){dfCloseFrame();};
  window.dfVendorMode=function(){
    var t=document.getElementById('dfPartyTab'); if(t) t.textContent='เงื่อนไขเจ้าหนี้';
    var k=document.getElementById('dfCustKind'); if(k) k.textContent='(เจ้าหนี้/Vendor)';
    window._dfRefDefaultType='PO';
  };
  function dfRefProfile(docType){ return DF_REF_PROFILES[docType] || DF_REF_PROFILES.SL; }
  function dfRefEsc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function dfRefRenderTabs(profile, active){
    var el=document.getElementById('dfRefTabs'); if(!el) return;
    el.innerHTML=profile.tabs.map(function(tab,i){
      var on=(tab.id===active)||(!active&&i===0)?' class="on"':'';
      return '<button'+on+' onclick="dfRefGroup(this,\''+tab.id+'\')">'+dfRefEsc(tab.label)+'</button>';
    }).join('');
  }
  function dfRefRenderRows(profile, filter){
    var tbody=document.getElementById('dfRefRows'); if(!tbody) return;
    filter=filter||'all';
    tbody.innerHTML=profile.rows.map(function(r){
      var show=(filter==='all'||r.g===filter);
      return '<tr data-g="'+r.g+'" data-amt="'+dfRefEsc(r.amt)+'" style="'+(show?'':'display:none')+'">'+
        '<td><input type="checkbox" onchange="dfRefCount()"></td>'+
        '<td>'+dfRefEsc(r.type)+'</td>'+
        '<td>'+dfRefEsc(r.no)+'</td>'+
        '<td>'+dfRefEsc(r.date)+'</td>'+
        '<td class="df-num">'+dfRefEsc(r.amt)+'</td>'+
        '<td style="color:'+dfRefEsc(r.sc||'#374151')+'">'+dfRefEsc(r.status)+'</td></tr>';
    }).join('');
  }
  function dfRefApplyCtx(opts){
    opts=opts||{};
    var docType=opts.docType||window._dfRefDefaultType||'SL';
    var profile=dfRefProfile(docType);
    var party=opts.partyName||opts.party||'';
    _dfRefCtx={docType:docType,partyName:party,partyId:opts.partyId||''};
    var rp=document.getElementById('dfRefParty');
    if(rp) rp.textContent='('+profile.partyLabel+(party?': '+party:'')+')';
    dfRefRenderTabs(profile,'all');
    dfRefRenderRows(profile,'all');
    dfRefCount();
  }
  /* 🔗 SC-5+ Reference picker — scope ตาม party · localize ตาม docType */
  window.dfOpenRef=function(opts){
    if(typeof opts==='string') opts={partyName:opts};
    dfRefApplyCtx(opts||{});
    document.getElementById('dfRef').classList.add('on');
  };
  window.dfCloseRef=function(){document.getElementById('dfRef').classList.remove('on');};
  window.dfRefGroup=function(btn,g){
    var tabs=btn.parentElement; tabs.querySelectorAll('button').forEach(function(b){b.classList.remove('on');}); btn.classList.add('on');
    document.querySelectorAll('#dfRefRows tr').forEach(function(tr){tr.style.display=(g==='all'||tr.getAttribute('data-g')===g)?'':'none';});
  };
  window.dfRefCount=function(){
    var n=0,sum=0;
    document.querySelectorAll('#dfRefRows tr').forEach(function(tr){
      if(tr.style.display==='none') return;
      var c=tr.querySelector('input[type=checkbox]');
      if(c&&c.checked){ n++; var a=tr.getAttribute('data-amt'); if(a&&a!=='—') sum+=parseFloat(a.replace(/,/g,''))||0; }
    });
    var el=document.getElementById('dfRefCount');
    if(el) el.innerHTML='เลือก <b>'+n+'</b> รายการ'+(sum?' · รวม <b class="df-num">'+sum.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})+'</b>':'');
  };
  window.dfRefPull=function(){
    var picked=[];
    document.querySelectorAll('#dfRefRows tr').forEach(function(tr){
      if(tr.style.display==='none') return;
      var c=tr.querySelector('input[type=checkbox]');
      if(c&&c.checked) picked.push({type:tr.cells[1].textContent,no:tr.cells[2].textContent,amt:tr.getAttribute('data-amt')});
    });
    if(!picked.length){ alert('ยังไม่ได้เลือกเอกสารอ้างอิง'); return; }
    var lines=picked.map(function(p){ return '• '+p.type+' '+p.no+' ('+p.amt+')'; }).join('\n');
    alert('ดึงเข้าฟอร์ม (mock · SC-5+):\n\n'+lines+'\n\n→ ระบบจริง: map รายการเข้าตาราง + อัปเดตเลขอ้างอิง');
    document.dispatchEvent(new CustomEvent('doc:pulled',{detail:{docType:_dfRefCtx.docType,rows:picked}}));
    dfCloseRef();
  };
  dfRefApplyCtx({docType:'SL',partyName:'คุณ อดิเทพ ไชยเศรษฐ์'});
  /* ปิด modal เมื่อคลิกฉากหลัง · Esc */
  document.addEventListener('click',function(e){
    if(!e.target.classList||!e.target.classList.contains('df-bg')) return;
    if(e.target.id==='dfFrame') dfCloseFrame();
    else e.target.classList.remove('on');
  });
  document.addEventListener('keydown',function(e){
    if(e.key!=='Escape') return;
    if(document.getElementById('dfFrame')&&document.getElementById('dfFrame').classList.contains('on')){dfCloseFrame();return;}
    if(document.getElementById('dfRef')&&document.getElementById('dfRef').classList.contains('on')){dfCloseRef();return;}
    if(document.getElementById('dfFind')&&document.getElementById('dfFind').classList.contains('on')){dfClose();return;}
    if(document.getElementById('dfCust')&&document.getElementById('dfCust').classList.contains('on')){dfCloseCust();return;}
    if(document.getElementById('dfProd')&&document.getElementById('dfProd').classList.contains('on')){dfCloseProd();return;}
  });
  /* child picker iframe fallback: postMessage -> close frame */
  window.addEventListener('message', function (ev) {
    var d = ev && ev.data;
    if (!d || typeof d !== 'object') return;
    if (d.type === 'df:close-frame') {
      dfCloseFrame();
    }
  });
})();
