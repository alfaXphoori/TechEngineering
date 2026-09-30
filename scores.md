---
layout: default
title: คะแนนและผลการเรียน
description: ตรวจสอบและบันทึกคะแนน รายวิชา เทคโนโลยีดิจิทัลสำหรับวิศวกรรม
---

<style>
/* Page Layout: ขยายความกว้างเต็มจอเพื่อให้ตารางเห็นครบทุกคอลัมน์โดยไม่ต้อง Scroll แนวนอน */
.prose {
  max-width: 100% !important;
  width: min(100%, 1200px) !important;
  padding: 28px clamp(16px, 3vw, 42px) !important;
  margin: 20px auto !important;
  box-sizing: border-box !important;
  border-radius: 14px !important;
}

/* Segmented Menu & Navigation */
.seg-bar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px; margin: 0 0 16px; }
.seg-menu { display: inline-flex; gap: 4px; background: #f1f5f9; padding: 4px; border-radius: 10px; flex-wrap: wrap; }
.seg { padding: 7px 16px; border-radius: 8px; font-weight: 600; font-size: .9rem; color: #475569; text-decoration: none; transition: all .15s; }
.seg:hover { color: var(--indigo, #4f46e5); text-decoration: none; }
.seg.is-active { background: #fff; color: var(--indigo-dark, #3730a3); box-shadow: 0 1px 2px rgba(0,0,0,.08); }

.teacher-panel { background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 12px 18px; margin-bottom: 16px; }
.teacher-head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 10px; }
.teacher-title { font-weight: 800; color: #065f46; font-size: 1rem; display: flex; align-items: center; gap: 6px; }
.teacher-tools { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.tool-btn { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 8px; font-weight: 600; font-size: .85rem; border: 1px solid #cbd5e1; background: #fff; color: #1e293b; cursor: pointer; transition: all .12s ease; }
.tool-btn:hover:not(:disabled) { background: #f8fafc; border-color: #94a3b8; }
.tool-btn--primary { background: #059669; color: #fff; border-color: #047857; font-weight: 700; }
.tool-btn--primary:hover:not(:disabled) { background: #047857; color: #fff; }
.tool-btn:disabled { opacity: .55; cursor: not-allowed; }
.badge-dirty { background: #ef4444; color: #fff; border-radius: 999px; padding: 2px 7px; font-size: .75rem; font-weight: 700; margin-left: 4px; display: none; }

/* Status Messages */
.sc-msg { min-height: 1.2em; margin: 6px 0 12px; font-size: .9rem; font-weight: 500; }
.sc-msg--info { color: #2563eb; }
.sc-msg--success { color: #15803d; font-weight: 600; }
.sc-msg--warn { color: #b45309; }
.sc-msg--error { color: #dc2626; }

/* Stats Bar */
.stats-bar { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-bottom: 14px; font-size: .9rem; }
.chip-stat { background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 8px; padding: 5px 12px; color: #334155; font-weight: 500; }
.chip-stat b { font-family: "JetBrains Mono", monospace; color: #0f172a; font-weight: 700; }
.dist-wrap { display: flex; flex-wrap: wrap; gap: 5px; align-items: center; margin-left: auto; }
.dist-lbl { font-size: .85rem; font-weight: 600; color: #64748b; margin-right: 2px; }
.grade-pill { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 6px; font-size: .78rem; font-weight: 700; font-family: "JetBrains Mono", monospace; }
.pill-a  { background: #dcfce7; color: #166534; }
.pill-bp { background: #dbeafe; color: #1e40af; }
.pill-b  { background: #e0e7ff; color: #3730a3; }
.pill-cp { background: #fef3c7; color: #92400e; }
.pill-c  { background: #fef9c3; color: #854d0e; }
.pill-dp { background: #ffedd5; color: #9a3412; }
.pill-d  { background: #fee2e2; color: #991b1b; }
.pill-f  { background: #f1f5f9; color: #dc2626; border: 1px solid #fca5a5; }

/* Search Box */
.search-wrap { margin-bottom: 14px; }
.sc-search { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 9px; font-size: .95rem; box-sizing: border-box; }
.sc-search:focus { outline: none; border-color: var(--indigo, #4f46e5); box-shadow: 0 0 0 3px rgba(79,70,229,.14); }

/* Student Individual Report Card */
.single-card { background: #ffffff; border: 2px solid var(--indigo, #4f46e5); border-radius: 12px; padding: 14px 18px; margin-bottom: 16px; box-shadow: 0 4px 12px rgba(79,70,229,.08); display: none; }
.sc-card-head { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 10px; }
.sc-card-who .name { font-size: 1.15rem; font-weight: 800; color: #1e293b; }
.sc-card-grade { display: flex; align-items: center; gap: 12px; }
.sc-card-grade .badge { font-size: 1.3rem; font-weight: 900; padding: 3px 14px; border-radius: 10px; }
.sc-card-total .val { font-size: 1.4rem; font-weight: 800; font-family: "JetBrains Mono", monospace; color: #0f172a; }
.sc-card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 8px; }
.sc-card-item { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px; text-align: center; }
.sc-card-item .item-title { font-size: .78rem; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px; }
.sc-card-item .item-score { font-size: 1.05rem; font-weight: 700; color: #0f172a; font-family: "JetBrains Mono", monospace; }
.sc-card-hint { margin-top: 10px; font-size: .85rem; color: #475569; background: #f1f5f9; padding: 6px 12px; border-radius: 8px; }

/* Table Styling: เต็มความกว้าง อ่านง่าย ไม่มี scrollbar แนวนอน */
.table-wrap { width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; border: 1px solid #e2e8f0; border-radius: 10px; background: #fff; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,.04); }
.sc-table { width: 100%; border-collapse: collapse; min-width: 0; font-size: .92rem; }
.sc-table th, .sc-table td { border-bottom: 1px solid #e2e8f0; padding: 8px 12px; text-align: left; vertical-align: middle; }
.sc-table thead th { background: #f8fafc; font-weight: 700; color: #334155; position: sticky; top: 0; z-index: 1; border-bottom: 2px solid #cbd5e1; font-size: .88rem; padding: 10px 12px; }
.sc-table tbody tr:hover { background: #f8fafc; }
.sc-table tbody tr.is-highlight { background: #eef2ff !important; }
.sc-table td.num, .sc-table th.num { text-align: center; white-space: nowrap; }
.sc-name { font-weight: 600; color: #1e293b; white-space: nowrap; }
.sc-total { font-family: "JetBrains Mono", monospace; font-weight: 800; font-size: .95rem; text-align: center; }

/* Grade Badges */
.badge-grade { display: inline-block; padding: 3px 10px; border-radius: 6px; font-weight: 800; font-size: .85rem; text-align: center; min-width: 30px; font-family: "JetBrains Mono", monospace; }
.bg-a  { background: #dcfce7; color: #15803d; }
.bg-bp { background: #dbeafe; color: #1d4ed8; }
.bg-b  { background: #e0e7ff; color: #4338ca; }
.bg-cp { background: #fef3c7; color: #b45309; }
.bg-c  { background: #fef9c3; color: #a16207; }
.bg-dp { background: #ffedd5; color: #c2410c; }
.bg-d  { background: #fee2e2; color: #b91c1c; }
.bg-f  { background: #fef2f2; color: #dc2626; border: 1px solid #fca5a5; }
.bg-none { background: #f1f5f9; color: #94a3b8; }

/* Score Inputs in Teacher Mode */
.sc-input { width: 58px; height: 30px; padding: 2px 6px; border: 1px solid #cbd5e1; border-radius: 6px; font-family: "JetBrains Mono", monospace; font-size: .9rem; text-align: center; font-weight: 600; box-sizing: border-box; transition: all .12s ease; }
.sc-input:focus { outline: none; border-color: var(--indigo, #4f46e5); box-shadow: 0 0 0 3px rgba(79,70,229,.15); background: #fff; }
.sc-input.is-dirty { border-color: #f59e0b; background: #fffbeb; }
.btn-save-row { padding: 4px 10px; border-radius: 6px; font-size: .78rem; font-weight: 600; border: 1px solid #cbd5e1; background: #fff; color: #0f172a; cursor: pointer; }
.btn-save-row:hover:not(:disabled) { background: #059669; color: #fff; border-color: #059669; }

/* Criteria Details */
details.criteria-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 16px; margin-top: 18px; }
details.criteria-box summary { cursor: pointer; font-weight: 700; color: var(--indigo, #4f46e5); font-size: .9rem; }
.criteria-content { margin-top: 10px; font-size: .88rem; line-height: 1.5; }
.criteria-table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: .85rem; }
.criteria-table th, .criteria-table td { border: 1px solid #e2e8f0; padding: 6px 10px; }
.criteria-table thead th { background: #f1f5f9; font-weight: 600; }
</style>

# 📝 คะแนนและผลการเรียน

<!-- แถบนำทางและปุ่มสิทธิ์อาจารย์ -->
<div class="seg-bar">
  <div class="seg-menu">
    <a class="seg is-active" href="{{ '/scores.html' | relative_url }}">📝 คะแนนและเกรด</a>
    <a class="seg" href="{{ '/check-in.html' | relative_url }}">✅ เช็คชื่อ</a>
    <a class="seg" href="{{ '/attendance-summary.html' | relative_url }}">📊 สรุปการมาเรียน</a>
    <a class="seg" href="{{ '/submission-check.html' | relative_url }}">📤 ตรวจการส่งงาน</a>
  </div>
</div>

<!-- กล่องเครื่องมืออาจารย์ (แสดงเมื่อเข้าสู่โหมดอาจารย์) -->
<div id="teacher-tools-wrap"></div>

<!-- แถบสถิติภาพรวมและการกระจายเกรด -->
<div class="stats-bar">
  <span class="chip-stat">👥 นักศึกษา: <b id="st-total">—</b> คน</span>
  <span class="chip-stat">✓ กรอกคะแนนแล้ว: <b id="st-graded">—</b></span>
  <span class="chip-stat">📊 เฉลี่ย: <b id="st-avg">—</b></span>
  <span class="chip-stat">📈 สูงสุด / ต่ำสุด: <b id="st-range">—</b></span>
  <div class="dist-wrap">
    <span class="dist-lbl">เกรด:</span>
    <span class="grade-pill pill-a">A: <b id="cnt-a">0</b></span>
    <span class="grade-pill pill-bp">B+: <b id="cnt-bp">0</b></span>
    <span class="grade-pill pill-b">B: <b id="cnt-b">0</b></span>
    <span class="grade-pill pill-cp">C+: <b id="cnt-cp">0</b></span>
    <span class="grade-pill pill-c">C: <b id="cnt-c">0</b></span>
    <span class="grade-pill pill-dp">D+: <b id="cnt-dp">0</b></span>
    <span class="grade-pill pill-d">D: <b id="cnt-d">0</b></span>
    <span class="grade-pill pill-f">F: <b id="cnt-f">0</b></span>
  </div>
</div>

<!-- ช่องค้นหารายบุคคล -->
<div class="search-wrap">
  <input class="sc-search" id="sc-search" type="text" placeholder="🔍 ค้นหาชื่อหรือรหัสนักศึกษา เพื่อดูคะแนนรายบุคคล…" autocomplete="off">
</div>

<!-- การ์ดแสดงผลคะแนนรายบุคคลเมื่อค้นหา -->
<div class="single-card" id="single-card"></div>

<!-- ข้อความสถานะการทำงาน -->
<div class="sc-msg" id="sc-msg"></div>

<!-- ตารางคะแนนรวม (ไม่แสดงรหัสนักศึกษา เห็นครบทางกว้างพอดีจอ) -->
<div class="table-wrap">
  <table class="sc-table" id="sc-table">
    <thead id="sc-thead"></thead>
    <tbody id="sc-tbody"></tbody>
  </table>
</div>

<!-- เกณฑ์การวัดและประเมินผลตามแผนการสอน -->
<details class="criteria-box">
  <summary>📋 เกณฑ์การวัดและประเมินผล (สัดส่วน 100%)</summary>
  <div class="criteria-content">
    <table class="criteria-table">
      <thead>
        <tr>
          <th>รายการประเมิน</th>
          <th style="text-align:center;">สัดส่วน</th>
          <th>คำอธิบาย</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>จิตพิสัยและการเข้าเรียน</td>
          <td style="text-align:center;">10%</td>
          <td>การตรงต่อเวลาและการมีส่วนร่วมในชั้นเรียน (ดึงข้อมูลจากการเช็คชื่อ)</td>
        </tr>
        <tr>
          <td>ใบงานและแบบฝึกหัด</td>
          <td style="text-align:center;">45%</td>
          <td>ใบงานภาคปฏิบัติ (Wokwi / ESP32 / IoT Platform) และแบบฝึกหัดรายสัปดาห์ W1–W15</td>
        </tr>
        <tr>
          <td>สอบกลางภาค</td>
          <td style="text-align:center;">20%</td>
          <td>วัดผลความรู้เนื้อหาสัปดาห์ที่ 1–8</td>
        </tr>
        <tr>
          <td>สอบปลายภาค</td>
          <td style="text-align:center;">25%</td>
          <td>วัดผลความรู้เนื้อหาสัปดาห์ที่ 9–15</td>
        </tr>
        <tr>
          <td><b>เกณฑ์การตัดเกรด</b></td>
          <td colspan="2">80+ (A) · 75–79 (B+) · 70–74 (B) · 65–69 (C+) · 60–64 (C) · 55–59 (D+) · 50–54 (D) · &lt;50 (F)</td>
        </tr>
      </tbody>
    </table>
  </div>
</details>

{% raw %}
<script>
(function () {
  // ===== Google Apps Script Web App URL =====
  var API_URL = "https://script.google.com/macros/s/AKfycbyKHCGL8MctDIzgyLsLA1laISfPZT4PzhPN6h4VsoAHXspGcQJKXRe3qf17wQBhNXl6/exec";
  var KEY_STORE = 'ci_teacher_key';
  // ==========================================

  function getTeacherKey() {
    if (window.TeacherAuth) return window.TeacherAuth.getKey();
    try { return localStorage.getItem(KEY_STORE) || sessionStorage.getItem(KEY_STORE) || ''; } catch (e) { return ''; }
  }

  var teacherKey = getTeacherKey();
  var columns = [];
  var students = [];
  var dirtyState = {}; // sid -> { colKey: true }

  var elTeacherToolsWrap = document.getElementById('teacher-tools-wrap');
  var elSearch = document.getElementById('sc-search');
  var elSingleCard = document.getElementById('single-card');
  var elMsg = document.getElementById('sc-msg');
  var elThead = document.getElementById('sc-thead');
  var elTbody = document.getElementById('sc-tbody');

  function isTeacher() {
    teacherKey = getTeacherKey();
    return !!teacherKey;
  }

  function setMsg(text, type) {
    elMsg.textContent = text || '';
    elMsg.className = 'sc-msg' + (type ? ' sc-msg--' + type : '');
  }

  function apiPost(payload) {
    return fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    }).then(function (r) { return r.json(); });
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function calcGrade(total) {
    if (total === null || total === '' || isNaN(total)) return '';
    var t = Number(total);
    if (t >= 80) return 'A';
    if (t >= 75) return 'B+';
    if (t >= 70) return 'B';
    if (t >= 65) return 'C+';
    if (t >= 60) return 'C';
    if (t >= 55) return 'D+';
    if (t >= 50) return 'D';
    return 'F';
  }

  function gradeClass(grade) {
    if (!grade) return 'bg-none';
    var g = String(grade).toUpperCase();
    if (g === 'A') return 'bg-a';
    if (g === 'B+') return 'bg-bp';
    if (g === 'B') return 'bg-b';
    if (g === 'C+') return 'bg-cp';
    if (g === 'C') return 'bg-c';
    if (g === 'D+') return 'bg-dp';
    if (g === 'D') return 'bg-d';
    if (g === 'F') return 'bg-f';
    return 'bg-none';
  }

  function countDirty() {
    var count = 0;
    for (var sid in dirtyState) {
      if (dirtyState.hasOwnProperty(sid)) {
        var hasCol = false;
        for (var c in dirtyState[sid]) {
          if (dirtyState[sid][c]) { hasCol = true; break; }
        }
        if (hasCol) count++;
      }
    }
    return count;
  }

  function updateDirtyCounter() {
    var cnt = countDirty();
    var b = document.getElementById('dirty-cnt');
    if (b) {
      b.textContent = cnt;
      b.style.display = cnt > 0 ? 'inline-block' : 'none';
    }
  }

  // ==================== โหมดอาจารย์ ====================
  function renderTeacherBox() {
    elTeacherToolsWrap.innerHTML = '';

    if (isTeacher()) {
      var panel = document.createElement('div');
      panel.className = 'teacher-panel';

      var head = document.createElement('div');
      head.className = 'teacher-head';

      var title = document.createElement('div');
      title.className = 'teacher-title';
      title.innerHTML = '<span>โหมดอาจารย์ (กรอกคะแนนในตารางได้ทันที)</span>';

      head.appendChild(title);

      var tools = document.createElement('div');
      tools.className = 'teacher-tools';

      var btnSaveAll = document.createElement('button');
      btnSaveAll.type = 'button';
      btnSaveAll.id = 'btn-save-all';
      btnSaveAll.className = 'tool-btn tool-btn--primary';
      btnSaveAll.innerHTML = '💾 บันทึกคะแนนทั้งหมด <span class="badge-dirty" id="dirty-cnt">0</span>';
      btnSaveAll.addEventListener('click', saveAllScores);

      var btnSyncAtt = document.createElement('button');
      btnSyncAtt.type = 'button';
      btnSyncAtt.className = 'tool-btn';
      btnSyncAtt.innerHTML = '⚡ ดึงจิตพิสัย (10)';
      btnSyncAtt.title = 'คำนวณจากเปอร์เซ็นต์การมาเรียนในแท็บ Attendance อัตโนมัติ';
      btnSyncAtt.addEventListener('click', syncAttendanceScores);

      var btnSyncSub = document.createElement('button');
      btnSyncSub.type = 'button';
      btnSyncSub.className = 'tool-btn';
      btnSyncSub.innerHTML = '⚡ ดึงใบงาน (45)';
      btnSyncSub.title = 'คำนวณจากเปอร์เซ็นต์การส่งงานแท็บ W1, W2, … อัตโนมัติ';
      btnSyncSub.addEventListener('click', syncSubmissionScores);

      var btnAddCol = document.createElement('button');
      btnAddCol.type = 'button';
      btnAddCol.className = 'tool-btn';
      btnAddCol.innerHTML = '➕ เพิ่มช่องคะแนน';
      btnAddCol.addEventListener('click', promptAddColumn);

      var btnReload = document.createElement('button');
      btnReload.type = 'button';
      btnReload.className = 'tool-btn';
      btnReload.innerHTML = '🔄 รีเฟรช';
      btnReload.addEventListener('click', function () { loadScores(false); });

      tools.appendChild(btnSaveAll);
      tools.appendChild(btnSyncAtt);
      tools.appendChild(btnSyncSub);
      tools.appendChild(btnAddCol);
      tools.appendChild(btnReload);

      panel.appendChild(head);
      panel.appendChild(tools);
      elTeacherToolsWrap.appendChild(panel);
    }
  }

  function loginTeacher() {
    if (window.TeacherAuth) {
      window.TeacherAuth.login().then(function (ok) {
        if (ok) {
          teacherKey = getTeacherKey();
          setMsg('เข้าสู่โหมดอาจารย์แล้ว สามารถกรอกคะแนนในตารางได้ทันที', 'success');
          renderTeacherBox();
          renderTable();
          updateStats();
        }
      });
      return;
    }

    var key = window.prompt('กรุณาใส่รหัสผ่านอาจารย์:');
    if (key === null) return;
    key = key.trim();
    if (!key) return;
    setMsg('กำลังตรวจสอบรหัสผ่าน…', 'info');
    apiPost({ action: 'verify', key: key })
      .then(function (data) {
        if (data && data.ok) {
          teacherKey = key;
          try { localStorage.setItem(KEY_STORE, key); sessionStorage.setItem(KEY_STORE, key); } catch (e) {}
          setMsg('เข้าสู่โหมดอาจารย์แล้ว สามารถกรอกคะแนนในตารางได้ทันที', 'success');
          renderTeacherBox();
          renderTable();
          updateStats();
        } else {
          setMsg('รหัสผ่านไม่ถูกต้อง', 'error');
        }
      })
      .catch(function (err) {
        setMsg('ตรวจสอบรหัสไม่สำเร็จ: ' + err.message, 'error');
      });
  }

  function logoutTeacher() {
    if (window.TeacherAuth) {
      window.TeacherAuth.setKey('');
    } else {
      try { localStorage.removeItem(KEY_STORE); sessionStorage.removeItem(KEY_STORE); } catch (e) {}
    }
    teacherKey = '';
    dirtyState = {};
    setMsg('ออกจากโหมดอาจารย์แล้ว');
    renderTeacherBox();
    renderTable();
  }

  // ==================== สรุปสถิติ ====================
  function updateStats() {
    var totalCount = students.length;
    var gradedCount = 0;
    var sum = 0;
    var maxVal = -Infinity;
    var minVal = Infinity;
    var counts = { 'A': 0, 'B+': 0, 'B': 0, 'C+': 0, 'C': 0, 'D+': 0, 'D': 0, 'F': 0 };

    students.forEach(function (s) {
      if (s.total !== null && !isNaN(s.total)) {
        gradedCount++;
        sum += s.total;
        if (s.total > maxVal) maxVal = s.total;
        if (s.total < minVal) minVal = s.total;
        if (s.grade && counts[s.grade] !== undefined) {
          counts[s.grade]++;
        }
      }
    });

    document.getElementById('st-total').textContent = totalCount;
    document.getElementById('st-graded').textContent = gradedCount + ' / ' + totalCount;
    document.getElementById('st-avg').textContent = gradedCount > 0 ? (Math.round((sum / gradedCount) * 10) / 10) : '—';
    document.getElementById('st-range').textContent = gradedCount > 0 ? (maxVal + ' / ' + minVal) : '—';

    document.getElementById('cnt-a').textContent = counts['A'];
    document.getElementById('cnt-bp').textContent = counts['B+'];
    document.getElementById('cnt-b').textContent = counts['B'];
    document.getElementById('cnt-cp').textContent = counts['C+'];
    document.getElementById('cnt-c').textContent = counts['C'];
    document.getElementById('cnt-dp').textContent = counts['D+'];
    document.getElementById('cnt-d').textContent = counts['D'];
    document.getElementById('cnt-f').textContent = counts['F'];
  }

  // ==================== เรนเดอร์บัตรรายบุคคล ====================
  function renderSingleCard(s) {
    if (!s) {
      elSingleCard.style.display = 'none';
      elSingleCard.innerHTML = '';
      return;
    }

    var totalText = s.total !== null ? s.total : '—';
    var gradeText = s.grade || '—';
    var gClass = gradeClass(s.grade);

    var hint = '';
    if (s.total !== null) {
      var t = Number(s.total);
      if (t < 50) hint = '💡 ต้องการอีก ' + (Math.round((50 - t) * 10) / 10) + ' คะแนน เพื่อผ่านเกณฑ์ (เกรด D)';
      else if (t < 55) hint = '💡 ต้องการอีก ' + (Math.round((55 - t) * 10) / 10) + ' คะแนน เพื่อได้เกรด D+';
      else if (t < 60) hint = '💡 ต้องการอีก ' + (Math.round((60 - t) * 10) / 10) + ' คะแนน เพื่อได้เกรด C';
      else if (t < 65) hint = '💡 ต้องการอีก ' + (Math.round((65 - t) * 10) / 10) + ' คะแนน เพื่อได้เกรด C+';
      else if (t < 70) hint = '💡 ต้องการอีก ' + (Math.round((70 - t) * 10) / 10) + ' คะแนน เพื่อได้เกรด B';
      else if (t < 75) hint = '💡 ต้องการอีก ' + (Math.round((75 - t) * 10) / 10) + ' คะแนน เพื่อได้เกรด B+';
      else if (t < 80) hint = '🌟 ต้องการอีก ' + (Math.round((80 - t) * 10) / 10) + ' คะแนน เพื่อพิชิตเกรด A!';
      else hint = '🎉 ยอดเยี่ยมมาก! คะแนนอยู่ในเกณฑ์เกรด A';
    }

    var itemsHtml = '';
    columns.forEach(function (col) {
      var val = (s.scores && s.scores[col.key] !== undefined && s.scores[col.key] !== null && s.scores[col.key] !== '') ? s.scores[col.key] : '—';
      itemsHtml += '<div class="sc-card-item">' +
        '<div class="item-title" title="' + escapeHtml(col.title) + '">' + escapeHtml(col.title) + '</div>' +
        '<div class="item-score">' + val + (col.max ? ' <span style="font-size:.78rem;color:#94a3b8;">/' + col.max + '</span>' : '') + '</div>' +
        '</div>';
    });

    elSingleCard.innerHTML =
      '<div class="sc-card-head">' +
        '<div class="sc-card-who">' +
          '<input type="hidden" class="sc-hidden-student-id" value="' + escapeHtml(s.id) + '">' +
          '<div class="name">' + escapeHtml(s.name) + '</div>' +
        '</div>' +
        '<div class="sc-card-grade">' +
          '<div class="sc-card-total">' +
            '<div class="val">' + totalText + ' <span style="font-size:.9rem;color:#64748b;">/ 100</span></div>' +
          '</div>' +
          '<div class="badge ' + gClass + '">' + gradeText + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="sc-card-grid">' + itemsHtml + '</div>' +
      (hint ? '<div class="sc-card-hint">' + hint + '</div>' : '');

    elSingleCard.style.display = 'block';
  }

  // ==================== เรนเดอร์หัวและตัวตาราง ====================
  function renderTable() {
    var q = (elSearch.value || '').trim().toLowerCase();
    var filtered = students.filter(function (s) {
      return !q || s.name.toLowerCase().indexOf(q) !== -1 || s.id.toLowerCase().indexOf(q) !== -1;
    });

    if (q && filtered.length === 1) {
      renderSingleCard(filtered[0]);
    } else {
      renderSingleCard(null);
    }

    // หัวตาราง (ซ่อนรหัสนักศึกษาไว้ จัดสรรความกว้างให้เต็มจอพอดี)
    var thead = '<tr><th class="num" style="width:40px;">#</th><th>ชื่อ–สกุล</th>';
    columns.forEach(function (col) {
      var shortTitle = escapeHtml(col.title);
      thead += '<th class="num" title="' + shortTitle + '">' + shortTitle + '</th>';
    });
    thead += '<th class="num" style="width:80px;">รวม (100)</th><th class="num" style="width:60px;">เกรด</th>';
    if (isTeacher()) {
      thead += '<th class="num" style="width:65px;">บันทึก</th>';
    }
    thead += '</tr>';
    elThead.innerHTML = thead;

    if (!filtered.length) {
      elTbody.innerHTML = '<tr><td colspan="' + (columns.length + (isTeacher() ? 4 : 3)) + '" style="text-align:center;padding:24px;color:#94a3b8;">ไม่พบรายชื่อที่ค้นหา</td></tr>';
      return;
    }

    var tbody = '';
    filtered.forEach(function (s, i) {
      var rowHighlight = (q && (s.name.toLowerCase().indexOf(q) !== -1 || s.id.toLowerCase().indexOf(q) !== -1)) ? ' is-highlight' : '';
      var rowDirty = dirtyState[s.id] ? ' is-row-dirty' : '';

      tbody += '<tr class="' + rowHighlight + rowDirty + '" id="row-' + s.id + '" data-student-id="' + escapeHtml(s.id) + '">';
      tbody += '<td class="num">' + (i + 1) + '</td>';
      tbody += '<td>' +
        '<input type="hidden" name="studentId" class="sc-hidden-student-id" value="' + escapeHtml(s.id) + '">' +
        '<span class="sc-name">' + escapeHtml(s.name) + '</span>' +
        '</td>';

      columns.forEach(function (col) {
        var val = (s.scores && s.scores[col.key] !== undefined && s.scores[col.key] !== null) ? s.scores[col.key] : '';
        if (isTeacher()) {
          var isDirtyCell = dirtyState[s.id] && dirtyState[s.id][col.key];
          tbody += '<td class="num">' +
            '<input class="sc-input' + (isDirtyCell ? ' is-dirty' : '') + '" ' +
            'type="number" step="any" min="0" ' + (col.max ? 'max="' + col.max + '" ' : '') +
            'data-id="' + escapeHtml(s.id) + '" data-student-id="' + escapeHtml(s.id) + '" data-col="' + escapeHtml(col.key) + '" ' +
            'value="' + escapeHtml(val) + '">' +
            '</td>';
        } else {
          tbody += '<td class="num">' + (val !== '' ? val : '<span style="color:#cbd5e1;">—</span>') + '</td>';
        }
      });

      var totalDisplay = s.total !== null ? s.total : '<span style="color:#cbd5e1;">—</span>';
      var gradeDisplay = s.grade ? '<span class="badge-grade ' + gradeClass(s.grade) + '">' + s.grade + '</span>' : '<span class="badge-grade bg-none">—</span>';

      tbody += '<td class="num"><span class="sc-total" id="tot-' + s.id + '">' + totalDisplay + '</span></td>';
      tbody += '<td class="num" id="grd-' + s.id + '">' + gradeDisplay + '</td>';

      if (isTeacher()) {
        tbody += '<td class="num"><button type="button" class="btn-save-row" data-id="' + escapeHtml(s.id) + '" data-student-id="' + escapeHtml(s.id) + '">บันทึก</button></td>';
      }

      tbody += '</tr>';
    });
    elTbody.innerHTML = tbody;

    if (isTeacher()) {
      attachInputListeners();
    }
  }

  // ==================== ผูก Event Input สำหรับอาจารย์ ====================
  function attachInputListeners() {
    var inputs = elTbody.querySelectorAll('.sc-input');
    inputs.forEach(function (inp) {
      inp.addEventListener('input', function () {
        var sid = inp.getAttribute('data-id');
        var colKey = inp.getAttribute('data-col');
        var val = inp.value.trim();

        var s = null;
        for (var i = 0; i < students.length; i++) {
          if (students[i].id === sid) { s = students[i]; break; }
        }
        if (!s) return;

        if (!s.scores) s.scores = {};
        s.scores[colKey] = val !== '' ? parseFloat(val) : '';

        if (!dirtyState[sid]) dirtyState[sid] = {};
        dirtyState[sid][colKey] = true;
        inp.classList.add('is-dirty');
        updateDirtyCounter();

        var rowTotal = 0;
        var hasAny = false;
        columns.forEach(function (col) {
          var sc = s.scores[col.key];
          if (sc !== '' && sc !== null && !isNaN(sc)) {
            rowTotal += Number(sc);
            hasAny = true;
          }
        });

        s.total = hasAny ? Math.round(rowTotal * 100) / 100 : null;
        s.grade = s.total !== null ? calcGrade(s.total) : '';

        var elTot = document.getElementById('tot-' + sid);
        if (elTot) elTot.innerHTML = s.total !== null ? s.total : '<span style="color:#cbd5e1;">—</span>';

        var elGrd = document.getElementById('grd-' + sid);
        if (elGrd) elGrd.innerHTML = s.grade ? '<span class="badge-grade ' + gradeClass(s.grade) + '">' + s.grade + '</span>' : '<span class="badge-grade bg-none">—</span>';

        updateStats();
      });

      inp.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === 'ArrowDown') {
          e.preventDefault();
          moveFocus(inp, 1);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          moveFocus(inp, -1);
        }
      });
    });

    var saveBtns = elTbody.querySelectorAll('.btn-save-row');
    saveBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var sid = btn.getAttribute('data-id');
        saveSingleStudent(sid, btn);
      });
    });
  }

  function moveFocus(currentInput, offset) {
    var colKey = currentInput.getAttribute('data-col');
    var inputs = Array.prototype.slice.call(elTbody.querySelectorAll('.sc-input[data-col="' + colKey + '"]'));
    var idx = inputs.indexOf(currentInput);
    if (idx !== -1 && inputs[idx + offset]) {
      inputs[idx + offset].focus();
      inputs[idx + offset].select();
    }
  }

  // ==================== การบันทึกคะแนน ====================
  function saveAllScores() {
    var btn = document.getElementById('btn-save-all');
    if (btn) btn.disabled = true;
    setMsg('กำลังบันทึกคะแนนทั้งหมดลง Google Sheet…', 'info');

    var items = [];
    students.forEach(function (s) {
      var rowScores = {};
      columns.forEach(function (col) {
        var v = (s.scores && s.scores[col.key] !== undefined && s.scores[col.key] !== null) ? s.scores[col.key] : '';
        rowScores[col.key] = v;
      });
      items.push({ studentId: s.id, scores: rowScores });
    });

    apiPost({ action: 'saveScores', key: teacherKey, studentId: (items[0] ? items[0].studentId : ''), items: items })
      .then(function (res) {
        if (btn) btn.disabled = false;
        if (res && res.ok) {
          dirtyState = {};
          updateDirtyCounter();
          setMsg('✓ บันทึกคะแนนทั้งหมดเรียบร้อยแล้ว (' + (res.updatedCount || items.length) + ' รายชื่อ)', 'success');
          renderTable();
        } else {
          if (res && res.error === 'unauthorized') {
            logoutTeacher();
            setMsg('สิทธิ์อาจารย์หมดอายุ กรุณาเข้าสู่ระบบใหม่', 'error');
            return;
          }
          if (res && res.error === 'ไม่ได้ระบุรหัสนักศึกษา') {
            setMsg('⚠️ รหัสนักศึกษาถูกผูกซ่อนไว้เรียบร้อยแล้ว แต่ Google Apps Script ยังเป็นเวอร์ชันเช็คชื่อเดิม — กรุณานำ attendance/Code.gs ไปวางแล้ว Deploy New version', 'error');
            return;
          }
          setMsg('บันทึกไม่สำเร็จ: ' + ((res && res.error) || 'เกิดข้อผิดพลาด'), 'error');
        }
      })
      .catch(function (err) {
        if (btn) btn.disabled = false;
        setMsg('เกิดข้อผิดพลาดในการเชื่อมต่อ: ' + err.message, 'error');
      });
  }

  function saveSingleStudent(sid, btn) {
    if (btn) {
      btn.disabled = true;
      if (!sid) sid = btn.getAttribute('data-student-id') || btn.getAttribute('data-id');
    }
    setMsg('กำลังบันทึกคะแนน…', 'info');

    var s = null;
    for (var i = 0; i < students.length; i++) {
      if (students[i].id === sid) { s = students[i]; break; }
    }
    if (!s) return;

    var rowScores = {};
    columns.forEach(function (col) {
      var v = (s.scores && s.scores[col.key] !== undefined && s.scores[col.key] !== null) ? s.scores[col.key] : '';
      rowScores[col.key] = v;
    });

    apiPost({ action: 'saveScores', key: teacherKey, studentId: sid, items: [{ studentId: sid, scores: rowScores }] })
      .then(function (res) {
        if (btn) btn.disabled = false;
        if (res && res.ok) {
          if (dirtyState[sid]) delete dirtyState[sid];
          updateDirtyCounter();
          setMsg('✓ บันทึกคะแนนของ ' + s.name + ' เรียบร้อยแล้ว', 'success');
          renderTable();
        } else {
          if (res && res.error === 'ไม่ได้ระบุรหัสนักศึกษา') {
            setMsg('⚠️ รหัสนักศึกษาถูกผูกซ่อนไว้เรียบร้อยแล้ว แต่ Google Apps Script ยังเป็นเวอร์ชันเช็คชื่อเดิม — กรุณานำ attendance/Code.gs ไปวางแล้ว Deploy New version', 'error');
            return;
          }
          setMsg('บันทึกไม่สำเร็จ: ' + ((res && res.error) || 'เกิดข้อผิดพลาด'), 'error');
        }
      })
      .catch(function (err) {
        if (btn) btn.disabled = false;
        setMsg('เกิดข้อผิดพลาด: ' + err.message, 'error');
      });
  }

  // ==================== ดึงคะแนนอัตโนมัติ ====================
  function syncAttendanceScores() {
    setMsg('กำลังดึงข้อมูลการเช็คชื่อจากชีต…', 'info');
    fetch(API_URL + '?mode=summary')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data || !data.ok) throw new Error((data && data.error) || 'ไม่สามารถดึงข้อมูลการมาเรียน');
        var totalDays = data.totalDays || 0;
        if (totalDays === 0) {
          setMsg('ยังไม่มีบันทึกการเช็คชื่อในแท็บ Attendance', 'warn');
          return;
        }

        var targetCol = null;
        for (var c = 0; c < columns.length; c++) {
          if (columns[c].key.indexOf('จิตพิสัย') !== -1 || columns[c].key.toLowerCase().indexOf('attendance') !== -1) {
            targetCol = columns[c].key;
            break;
          }
        }
        if (!targetCol && columns.length > 0) targetCol = columns[0].key;

        var attMap = {};
        (data.roster || []).forEach(function (item) {
          attMap[item.id] = item.count || 0;
        });

        var updated = 0;
        students.forEach(function (s) {
          var count = attMap[s.id] || 0;
          var score = Math.round((count / totalDays) * 10 * 10) / 10;
          if (!s.scores) s.scores = {};
          s.scores[targetCol] = score;
          if (!dirtyState[s.id]) dirtyState[s.id] = {};
          dirtyState[s.id][targetCol] = true;
          updated++;
        });

        recalcAll();
        updateDirtyCounter();
        renderTable();
        setMsg('⚡ คำนวณคะแนนจิตพิสัย (เต็ม 10) จากการมาเรียน ' + totalDays + ' คาบ เรียบร้อยแล้ว (อย่าลืมกดบันทึกคะแนนทั้งหมด)', 'success');
      })
      .catch(function (err) {
        setMsg('ดึงคะแนนจิตพิสัยไม่สำเร็จ: ' + err.message, 'error');
      });
  }

  function syncSubmissionScores() {
    setMsg('กำลังดึงข้อมูลการส่งงานจากชีต…', 'info');
    fetch(API_URL + '?mode=submissions')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data || !data.ok) throw new Error((data && data.error) || 'ไม่สามารถดึงข้อมูลการส่งงาน');
        var weeks = data.weeks || [];
        if (weeks.length === 0) {
          setMsg('ยังไม่มีแท็บคำตอบการส่งงาน W1, W2, … ในชีต', 'warn');
          return;
        }

        var targetCol = null;
        for (var c = 0; c < columns.length; c++) {
          if (columns[c].key.indexOf('ใบงาน') !== -1 || columns[c].key.indexOf('แบบฝึกหัด') !== -1) {
            targetCol = columns[c].key;
            break;
          }
        }
        if (!targetCol && columns.length > 1) targetCol = columns[1].key;

        var subMap = {};
        (data.roster || []).forEach(function (item) {
          subMap[item.id] = item.count || 0;
        });

        var updated = 0;
        students.forEach(function (s) {
          var count = subMap[s.id] || 0;
          var score = Math.round((count / weeks.length) * 45 * 10) / 10;
          if (!s.scores) s.scores = {};
          s.scores[targetCol] = score;
          if (!dirtyState[s.id]) dirtyState[s.id] = {};
          dirtyState[s.id][targetCol] = true;
          updated++;
        });

        recalcAll();
        updateDirtyCounter();
        renderTable();
        setMsg('⚡ คำนวณคะแนนใบงาน (เต็ม 45) จากการส่งงาน ' + weeks.length + ' สัปดาห์ เรียบร้อยแล้ว (อย่าลืมกดบันทึกคะแนนทั้งหมด)', 'success');
      })
      .catch(function (err) {
        setMsg('ดึงคะแนนใบงานไม่สำเร็จ: ' + err.message, 'error');
      });
  }

  function recalcAll() {
    students.forEach(function (s) {
      var rowTotal = 0;
      var hasAny = false;
      columns.forEach(function (col) {
        var sc = s.scores && s.scores[col.key];
        if (sc !== '' && sc !== null && !isNaN(sc)) {
          rowTotal += Number(sc);
          hasAny = true;
        }
      });
      s.total = hasAny ? Math.round(rowTotal * 100) / 100 : null;
      s.grade = s.total !== null ? calcGrade(s.total) : '';
    });
    updateStats();
  }

  function promptAddColumn() {
    var title = window.prompt('ระบุชื่อช่องคะแนนใหม่ (เช่น "แบบฝึกหัดย่อย 1 (5)"):');
    if (!title) return;
    title = title.trim();
    if (!title) return;

    for (var i = 0; i < columns.length; i++) {
      if (columns[i].key === title) {
        alert('มีคอลัมน์ชื่อนี้อยู่แล้ว');
        return;
      }
    }

    var maxMatch = title.match(/\((\d+(?:\.\d+)?)\)/);
    var maxVal = maxMatch ? parseFloat(maxMatch[1]) : null;

    columns.push({ key: title, title: title, max: maxVal });
    renderTable();
    setMsg('เพิ่มคอลัมน์ใหม่ "' + title + '" แล้ว สามารถกรอกคะแนนแล้วกดบันทึกทั้งหมดได้ทันที', 'info');
  }

  // ==================== โหลดข้อมูล ====================
  function loadScores(silent) {
    if (!silent) setMsg('กำลังโหลดข้อมูลคะแนน…', 'info');
    fetch(API_URL + '?mode=scores')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data || !data.ok) throw new Error((data && data.error) || 'ไม่สามารถโหลดข้อมูลคะแนน');

        if (data.columns && data.students) {
          columns = data.columns;
          students = data.students;
        } else if (data.roster) {
          columns = [
            { key: 'จิตพิสัย (10)', title: 'จิตพิสัย (10)', max: 10 },
            { key: 'ใบงาน (45)', title: 'ใบงาน (45)', max: 45 },
            { key: 'กลางภาค (20)', title: 'กลางภาค (20)', max: 20 },
            { key: 'ปลายภาค (25)', title: 'ปลายภาค (25)', max: 25 }
          ];
          students = data.roster.map(function (s) {
            return { id: s.id, name: s.name, scores: {}, total: null, grade: '', hasScore: false };
          });
          setMsg('💡 โหลดรายชื่อนักศึกษาเรียบร้อย (หากจะบันทึกลงชีต อย่าลืมอัปเดต Code.gs และ Deploy New Version ตามคู่มือ attendance/README.md)', 'info');
        }

        renderTeacherBox();
        renderTable();
        updateStats();
        if (!silent && (!data.roster || (data.columns && data.students))) setMsg('');
      })
      .catch(function (err) {
        setMsg('โหลดข้อมูลไม่สำเร็จ: ' + err.message, 'error');
      });
  }

  // เริ่มทำงาน
  window.addEventListener('teacher-auth-changed', function () {
    teacherKey = getTeacherKey();
    renderTeacherBox();
    renderTable();
    updateStats();
  });
  elSearch.addEventListener('input', renderTable);
  renderTeacherBox();
  loadScores(false);
})();
</script>
{% endraw %}
