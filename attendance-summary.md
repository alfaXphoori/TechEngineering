---
layout: default
title: สรุปการมาเรียน
description: สรุปการมาเรียนทั้งเทอม รายวิชา เทคโนโลยีดิจิทัลสำหรับวิศวกรรม
---

<style>
.seg-menu { display: inline-flex; gap: 4px; background: #f1f5f9; padding: 4px; border-radius: 12px; margin: .2em 0 1.1em; flex-wrap: wrap; }
.seg { padding: 9px 18px; border-radius: 9px; font-weight: 600; font-size: .95rem; color: #475569; text-decoration: none; }
.seg:hover { color: var(--indigo, #4f46e5); text-decoration: none; }
.seg.is-active { background: #fff; color: var(--indigo-dark, #3730a3); box-shadow: var(--shadow-sm, 0 1px 2px rgba(0,0,0,.08)); }
.as-bar { display: flex; flex-wrap: wrap; gap: 10px 18px; align-items: center; margin: .4em 0 1em; font-size: .95rem; }
.as-stat { background: #eef2ff; color: var(--indigo-dark, #3730a3); border-radius: 999px; padding: 4px 14px; font-weight: 600; font-size: .9rem; }
.as-link { color: var(--indigo, #4f46e5); }
.as-msg { min-height: 1.2em; margin: 6px 0 12px; font-size: .92rem; }
.as-msg--error { color: #dc2626; }
.as-search { width: 100%; padding: 11px 14px; border: 1px solid var(--line); border-radius: 10px; font-size: 1rem; box-sizing: border-box; margin-bottom: 14px; }
.as-search:focus { outline: none; border-color: var(--indigo, #4f46e5); box-shadow: 0 0 0 3px rgba(79,70,229,.15); }
.as-table { width: 100%; border-collapse: collapse; }
.as-table th, .as-table td { border: 1px solid var(--line); padding: 8px 10px; text-align: left; font-size: .92rem; }
.as-table thead th { background: #f1f5f9; position: sticky; top: 0; }
.as-table td.num, .as-table th.num { text-align: center; white-space: nowrap; }
.as-id { font-family: "JetBrains Mono", monospace; font-size: .8rem; color: #64748b; }
.as-pct { display: inline-block; min-width: 44px; font-weight: 700; }
.as-meter { height: 8px; border-radius: 999px; background: #e2e8f0; overflow: hidden; margin-top: 4px; }
.as-meter > span { display: block; height: 100%; border-radius: 999px; }
.lv-hi { color: #15803d; } .bg-hi { background: #22c55e; }
.lv-mid { color: #b45309; } .bg-mid { background: #f59e0b; }
.lv-lo { color: #dc2626; } .bg-lo { background: #ef4444; }
.as-yes { color: #15803d; font-weight: 700; }
.as-no { color: #cbd5e1; }
details.as-matrix { margin-top: 22px; }
details.as-matrix summary { cursor: pointer; font-weight: 600; color: var(--indigo, #4f46e5); }
.as-matrix .as-table th.date, .as-matrix .as-table td.date { text-align: center; white-space: nowrap; font-size: .8rem; }
</style>

# 📊 สรุปการมาเรียน

<div class="seg-menu">
  <a class="seg" href="{{ '/check-in.html' | relative_url }}">✅ เช็คชื่อ</a>
  <a class="seg is-active" href="{{ '/attendance-summary.html' | relative_url }}">📊 สรุปการมาเรียน</a>
</div>

<div class="as-bar">
  <span class="as-stat" id="as-days">—</span>
  <span class="as-stat" id="as-students">—</span>
</div>

<input class="as-search" id="as-search" type="text" placeholder="🔍 ค้นหาชื่อหรือรหัสนักศึกษา…" autocomplete="off">

<div class="as-msg" id="as-msg"></div>

<div class="table-wrap">
  <table class="as-table" id="as-table">
    <thead>
      <tr>
        <th class="num">#</th>
        <th>ชื่อ–สกุล</th>
        <th class="num">มาเรียน</th>
        <th class="num">ร้อยละ</th>
      </tr>
    </thead>
    <tbody id="as-body"></tbody>
  </table>
</div>

<details class="as-matrix" id="as-matrix-wrap">
  <summary>ดูตารางการมาเรียนรายวัน</summary>
  <div class="table-wrap" style="margin-top:10px;">
    <table class="as-table" id="as-matrix"></table>
  </div>
</details>

{% raw %}
<script>
(function () {
  // ===== ลิงก์ Web App (ลงท้าย /exec) เดียวกับหน้าเช็คชื่อ =====
  var API_URL = "";
  // ===========================================================

  var elDays = document.getElementById('as-days');
  var elStudents = document.getElementById('as-students');
  var elSearch = document.getElementById('as-search');
  var elMsg = document.getElementById('as-msg');
  var elBody = document.getElementById('as-body');
  var elMatrix = document.getElementById('as-matrix');

  var roster = [];
  var dates = [];
  var totalDays = 0;

  function setMsg(text, type) {
    elMsg.textContent = text || '';
    elMsg.className = 'as-msg' + (type ? ' as-msg--' + type : '');
  }

  function level(pct) {
    if (pct >= 80) return 'hi';
    if (pct >= 60) return 'mid';
    return 'lo';
  }

  function pad2(n) { return ('0' + n).slice(-2); }
  function shortDate(d) {
    if (!d) return d;
    var p = String(d).split('-');
    if (p.length === 3 && p[0].length === 4) return p[2] + '/' + p[1] + '/' + p[0];
    var dt = new Date(d);
    if (!isNaN(dt.getTime())) return pad2(dt.getDate()) + '/' + pad2(dt.getMonth() + 1) + '/' + dt.getFullYear();
    return d;
  }

  function renderTable() {
    var q = (elSearch.value || '').trim().toLowerCase();
    var rows = roster.filter(function (s) {
      return !q || s.name.toLowerCase().indexOf(q) !== -1 || s.id.toLowerCase().indexOf(q) !== -1;
    });
    elBody.innerHTML = '';
    rows.forEach(function (s, i) {
      var pct = totalDays ? Math.round((s.count / totalDays) * 100) : 0;
      var lv = level(pct);
      var tr = document.createElement('tr');

      var cNo = document.createElement('td'); cNo.className = 'num'; cNo.textContent = (i + 1);
      var cName = document.createElement('td');
      var nm = document.createElement('div'); nm.textContent = s.name;
      var idEl = document.createElement('div'); idEl.className = 'as-id'; idEl.textContent = s.id;
      cName.appendChild(nm); cName.appendChild(idEl);
      var cCount = document.createElement('td'); cCount.className = 'num'; cCount.textContent = s.count + ' / ' + totalDays;
      var cPct = document.createElement('td'); cPct.className = 'num';
      var pctSpan = document.createElement('span'); pctSpan.className = 'as-pct lv-' + lv; pctSpan.textContent = pct + '%';
      var meter = document.createElement('div'); meter.className = 'as-meter';
      var fill = document.createElement('span'); fill.className = 'bg-' + lv; fill.style.width = pct + '%';
      meter.appendChild(fill);
      cPct.appendChild(pctSpan); cPct.appendChild(meter);

      tr.appendChild(cNo); tr.appendChild(cName); tr.appendChild(cCount); tr.appendChild(cPct);
      elBody.appendChild(tr);
    });
  }

  function renderMatrix() {
    if (!dates.length) {
      elMatrix.innerHTML = '<tbody><tr><td class="as-no" style="padding:14px;">ยังไม่มีข้อมูลการเช็คชื่อ</td></tr></tbody>';
      return;
    }
    var thead = '<thead><tr><th>ชื่อ–สกุล</th>';
    dates.forEach(function (d) { thead += '<th class="date">' + shortDate(d) + '</th>'; });
    thead += '<th class="num">รวม</th></tr></thead>';

    var tbody = '<tbody>';
    roster.forEach(function (s) {
      var present = {};
      (s.present || []).forEach(function (d) { present[d] = true; });
      tbody += '<tr><td>' + escapeHtml(s.name) + '</td>';
      dates.forEach(function (d) {
        tbody += present[d] ? '<td class="date as-yes">✓</td>' : '<td class="date as-no">–</td>';
      });
      tbody += '<td class="num">' + s.count + '</td></tr>';
    });
    tbody += '</tbody>';
    elMatrix.innerHTML = thead + tbody;
  }

  function escapeHtml(t) {
    return String(t).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function load() {
    setMsg('กำลังโหลดข้อมูลสรุป…');
    fetch(API_URL + '?mode=summary', { method: 'GET' })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data.ok) throw new Error(data.error || 'โหลดไม่สำเร็จ');
        roster = data.roster || [];
        dates = data.dates || [];
        totalDays = data.totalDays || 0;
        elDays.textContent = 'จำนวนคาบที่เช็คชื่อ: ' + totalDays + ' วัน';
        elStudents.textContent = 'นักศึกษา: ' + roster.length + ' คน';
        renderTable();
        renderMatrix();
        setMsg('');
      })
      .catch(function (err) {
        setMsg('โหลดข้อมูลไม่สำเร็จ: ' + err.message, 'error');
      });
  }

  if (!API_URL) {
    setMsg('⚠️ ผู้สอนยังไม่ได้ตั้งค่าระบบ (API_URL) — ดูวิธีตั้งค่าในไฟล์ attendance/README.md', 'error');
    return;
  }

  elSearch.addEventListener('input', renderTable);
  load();
})();
</script>
{% endraw %}
