---
layout: default
title: ตรวจการส่งงาน
description: ตรวจสอบการส่งงานรายสัปดาห์ รายวิชา เทคโนโลยีดิจิทัลสำหรับวิศวกรรม
---

<style>
.seg-menu { display: inline-flex; gap: 4px; background: #f1f5f9; padding: 4px; border-radius: 12px; margin: .2em 0 1.1em; flex-wrap: wrap; }
.seg { padding: 9px 18px; border-radius: 9px; font-weight: 600; font-size: .95rem; color: #475569; text-decoration: none; }
.seg:hover { color: var(--indigo, #4f46e5); text-decoration: none; }
.seg.is-active { background: #fff; color: var(--indigo-dark, #3730a3); box-shadow: var(--shadow-sm, 0 1px 2px rgba(0,0,0,.08)); }
.sc-bar { display: flex; flex-wrap: wrap; gap: 10px 18px; align-items: center; margin: .4em 0 1em; font-size: .95rem; }
.sc-stat { background: #eef2ff; color: var(--indigo-dark, #3730a3); border-radius: 999px; padding: 4px 14px; font-weight: 600; font-size: .9rem; }
.sc-msg { min-height: 1.2em; margin: 6px 0 12px; font-size: .92rem; }
.sc-msg--error { color: #dc2626; }
.sc-search { width: 100%; padding: 11px 14px; border: 1px solid var(--line); border-radius: 10px; font-size: 1rem; box-sizing: border-box; margin-bottom: 14px; }
.sc-search:focus { outline: none; border-color: var(--indigo, #4f46e5); box-shadow: 0 0 0 3px rgba(79,70,229,.15); }
.sc-table { width: 100%; border-collapse: collapse; }
.sc-table th, .sc-table td { border: 1px solid var(--line); padding: 8px 10px; text-align: left; font-size: .92rem; }
.sc-table thead th { background: #f1f5f9; }
.sc-table td.num, .sc-table th.num { text-align: center; white-space: nowrap; }
.sc-id { font-family: "JetBrains Mono", monospace; font-size: .8rem; color: #64748b; }
.sc-yes { color: #15803d; font-weight: 700; text-align: center; }
.sc-no { color: #cbd5e1; text-align: center; }
.sc-pct { display: inline-block; min-width: 44px; font-weight: 700; }
.sc-meter { height: 8px; border-radius: 999px; background: #e2e8f0; overflow: hidden; margin-top: 4px; }
.sc-meter > span { display: block; height: 100%; border-radius: 999px; }
.lv-hi { color: #15803d; } .bg-hi { background: #22c55e; }
.lv-mid { color: #b45309; } .bg-mid { background: #f59e0b; }
.lv-lo { color: #dc2626; } .bg-lo { background: #ef4444; }
</style>

# 📊 ตรวจการส่งงาน

<div class="seg-menu">
  <a class="seg" href="{{ '/submit-work.html' | relative_url }}">📤 ส่งงาน</a>
  <a class="seg is-active" href="{{ '/submission-check.html' | relative_url }}">📊 ตรวจการส่ง</a>
</div>

<div class="sc-bar">
  <span class="sc-stat" id="sc-weeks">—</span>
  <span class="sc-stat" id="sc-students">—</span>
</div>

<input class="sc-search" id="sc-search" type="text" placeholder="🔍 ค้นหาชื่อหรือรหัสนักศึกษา…" autocomplete="off">

<div class="sc-msg" id="sc-msg"></div>

<div class="table-wrap">
  <table class="sc-table" id="sc-table"></table>
</div>

{% raw %}
<script>
(function () {
  // ===== ลิงก์ Web App (ลงท้าย /exec) เดียวกับระบบเช็คชื่อ =====
  var API_URL = "https://script.google.com/macros/s/AKfycbyKHCGL8MctDIzgyLsLA1laISfPZT4PzhPN6h4VsoAHXspGcQJKXRe3qf17wQBhNXl6/exec";
  // ===========================================================

  var elWeeks = document.getElementById('sc-weeks');
  var elStudents = document.getElementById('sc-students');
  var elSearch = document.getElementById('sc-search');
  var elMsg = document.getElementById('sc-msg');
  var elTable = document.getElementById('sc-table');

  var roster = [];
  var weeks = [];
  var counts = {};

  function setMsg(text, type) {
    elMsg.textContent = text || '';
    elMsg.className = 'sc-msg' + (type ? ' sc-msg--' + type : '');
  }

  function level(pct) { return pct >= 80 ? 'hi' : (pct >= 60 ? 'mid' : 'lo'); }

  function escapeHtml(t) {
    return String(t).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function render() {
    var q = (elSearch.value || '').trim().toLowerCase();
    var rows = roster.filter(function (s) {
      return !q || s.name.toLowerCase().indexOf(q) !== -1 || s.id.toLowerCase().indexOf(q) !== -1;
    });

    if (!weeks.length) {
      elTable.innerHTML = '<tbody><tr><td style="padding:14px;color:#94a3b8;">ยังไม่มีข้อมูลการส่งงาน — ตั้งค่าแท็บคำตอบ W1, W2, … ในชีตก่อน (ดู attendance/README.md)</td></tr></tbody>';
      return;
    }

    var thead = '<thead><tr><th class="num">#</th><th>ชื่อ–สกุล</th>';
    weeks.forEach(function (w) { thead += '<th class="num">W' + w + '</th>'; });
    thead += '<th class="num">ส่งแล้ว</th><th class="num">ร้อยละ</th></tr></thead>';

    var tbody = '<tbody>';
    rows.forEach(function (s, i) {
      var pct = weeks.length ? Math.round((s.count / weeks.length) * 100) : 0;
      var lv = level(pct);
      tbody += '<tr><td class="num">' + (i + 1) + '</td>';
      tbody += '<td>' + escapeHtml(s.name) + '<div class="sc-id">' + escapeHtml(s.id) + '</div></td>';
      weeks.forEach(function (w) {
        tbody += s.submitted[w]
          ? '<td class="sc-yes">✓</td>'
          : '<td class="sc-no">–</td>';
      });
      tbody += '<td class="num">' + s.count + ' / ' + weeks.length + '</td>';
      tbody += '<td class="num"><span class="sc-pct lv-' + lv + '">' + pct + '%</span>'
            + '<div class="sc-meter"><span class="bg-' + lv + '" style="width:' + pct + '%"></span></div></td>';
      tbody += '</tr>';
    });
    tbody += '</tbody>';
    elTable.innerHTML = thead + tbody;
  }

  function load() {
    setMsg('กำลังโหลดข้อมูลการส่งงาน…');
    fetch(API_URL + '?mode=submissions', { method: 'GET' })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data.ok) throw new Error(data.error || 'โหลดไม่สำเร็จ');
        roster = data.roster || [];
        weeks = data.weeks || [];
        counts = data.counts || {};
        elWeeks.textContent = 'สัปดาห์ที่เปิดรับงาน: ' + weeks.length;
        elStudents.textContent = 'นักศึกษา: ' + (data.totalStudents || roster.length) + ' คน';
        render();
        setMsg('');
      })
      .catch(function (err) {
        setMsg('โหลดข้อมูลไม่สำเร็จ: ' + err.message, 'error');
      });
  }

  if (!API_URL) {
    setMsg('⚠️ ผู้สอนยังไม่ได้ตั้งค่าระบบ (API_URL)', 'error');
    return;
  }

  elSearch.addEventListener('input', render);
  load();
})();
</script>
{% endraw %}
