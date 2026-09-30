---
layout: default
title: เช็คชื่อเข้าห้อง
description: เช็คชื่อเข้าเรียนรายวิชา เทคโนโลยีดิจิทัลสำหรับวิศวกรรม (อาจารย์เรียกชื่อ · นักศึกษาดูได้)
---

<style>
.ci-bar { display: flex; flex-wrap: wrap; gap: 10px 18px; align-items: center; margin: .4em 0 1em; font-size: .95rem; }
.ci-bar .ci-date { font-weight: 700; }
.ci-stat { background: #eef2ff; color: var(--indigo-dark, #3730a3); border-radius: 999px; padding: 4px 14px; font-weight: 600; font-size: .9rem; }
.ci-spacer { flex: 1 1 auto; }
/* เมนูแท็บในหน้า */
.seg-menu { display: inline-flex; gap: 4px; background: #f1f5f9; padding: 4px; border-radius: 12px; margin: .2em 0 1.1em; flex-wrap: wrap; }
.seg { padding: 9px 18px; border-radius: 9px; font-weight: 600; font-size: .95rem; color: #475569; text-decoration: none; }
.seg:hover { color: var(--indigo, #4f46e5); text-decoration: none; }
.seg.is-active { background: #fff; color: var(--indigo-dark, #3730a3); box-shadow: var(--shadow-sm, 0 1px 2px rgba(0,0,0,.08)); }
.ci-search { width: 100%; padding: 11px 14px; border: 1px solid var(--line); border-radius: 10px; font-size: 1rem; box-sizing: border-box; margin-bottom: 12px; }
.ci-search:focus { outline: none; border-color: var(--indigo, #4f46e5); box-shadow: 0 0 0 3px rgba(79,70,229,.15); }
.ci-msg { min-height: 1.2em; margin: 6px 0 12px; font-size: .92rem; }
.ci-msg--warn { color: #b45309; }
.ci-msg--error { color: #dc2626; }
.ci-msg--success { color: #15803d; font-weight: 600; }
.ci-list { display: grid; gap: 8px; }
.ci-item { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 11px 14px; border: 1px solid var(--line); border-radius: 10px; background: #fff; }
.ci-item.is-done { background: #f0fdf4; border-color: #bbf7d0; }
.ci-info { display: flex; flex-direction: column; line-height: 1.35; min-width: 0; }
.ci-name { font-weight: 600; }
.ci-id { font-family: "JetBrains Mono", monospace; font-size: .8rem; color: #64748b; }
.ci-right { flex: none; display: inline-flex; align-items: center; gap: 10px; }
.ci-badge { font-size: .85rem; font-weight: 600; padding: 5px 12px; border-radius: 999px; }
.ci-badge--yes { background: #dcfce7; color: #15803d; }
.ci-badge--no { background: #f1f5f9; color: #94a3b8; }
.ci-btn { flex: none; padding: 8px 16px; border-radius: 8px; font-weight: 600; font-size: .9rem; border: 1px solid transparent; background: var(--indigo, #4f46e5); color: #fff; cursor: pointer; transition: opacity .12s ease, transform .12s ease; }
.ci-btn:hover:not(:disabled) { opacity: .9; transform: translateY(-1px); }
.ci-btn:disabled { opacity: .6; cursor: default; }
.ci-undo { background: none; border: none; color: #dc2626; font: inherit; font-size: .82rem; cursor: pointer; text-decoration: underline; padding: 0; }
.ci-empty { color: #94a3b8; padding: 16px; text-align: center; }
</style>

# ✅ เช็คชื่อเข้าห้อง

<div class="seg-menu">
  <a class="seg is-active" href="{{ '/check-in.html' | relative_url }}">✅ เช็คชื่อ</a>
  <a class="seg" href="{{ '/attendance-summary.html' | relative_url }}">📊 สรุปการมาเรียน</a>
  <a class="seg" href="{{ '/submission-check.html' | relative_url }}">📤 ตรวจการส่งงาน</a>
  <a class="seg" href="{{ '/scores.html' | relative_url }}">📝 คะแนนและเกรด</a>
</div>

<div class="ci-bar">
  <span>📅 วันที่: <span class="ci-date" id="ci-date">—</span></span>
  <span class="ci-stat" id="ci-stat">—</span>
</div>

<input class="ci-search" id="ci-search" type="text" placeholder="🔍 ค้นหาชื่อหรือรหัสนักศึกษา…" autocomplete="off">

<div class="ci-msg" id="ci-msg"></div>

<div class="ci-list" id="ci-list"></div>

{% raw %}
<script>
(function () {
  // ===== ตั้งค่า: วางลิงก์ Web App (ลงท้าย /exec) จาก Google Apps Script ตรงนี้ =====
  var API_URL = "https://script.google.com/macros/s/AKfycbyKHCGL8MctDIzgyLsLA1laISfPZT4PzhPN6h4VsoAHXspGcQJKXRe3qf17wQBhNXl6/exec";
  // ดูวิธีสร้าง/ติดตั้งใน attendance/README.md
  // ============================================================================

  var KEY_STORE = 'ci_teacher_key';
  var POLL_MS = 20000;

  function getTeacherKey() {
    if (window.TeacherAuth) return window.TeacherAuth.getKey();
    try { return localStorage.getItem(KEY_STORE) || sessionStorage.getItem(KEY_STORE) || ''; } catch (e) { return ''; }
  }

  var elDate = document.getElementById('ci-date');
  var elSearch = document.getElementById('ci-search');
  var elList = document.getElementById('ci-list');
  var elStat = document.getElementById('ci-stat');
  var elMsg = document.getElementById('ci-msg');

  var roster = [];
  var checked = {};
  var today = '';
  var teacherKey = getTeacherKey();
  var pollTimer = null;

  function isTeacher() {
    teacherKey = getTeacherKey();
    return !!teacherKey;
  }

  function setMsg(text, type) {
    elMsg.textContent = text || '';
    elMsg.className = 'ci-msg' + (type ? ' ci-msg--' + type : '');
  }

  function api(payload) {
    return fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    }).then(function (r) { return r.json(); });
  }

  function loginTeacher() {
    if (window.TeacherAuth) {
      window.TeacherAuth.login().then(function (ok) {
        if (ok) {
          teacherKey = getTeacherKey();
          setMsg('เข้าสู่โหมดอาจารย์แล้ว', 'success');
          stopPoll();
          render();
        }
      });
      return;
    }

    var key = window.prompt('ใส่รหัสผ่านอาจารย์:');
    if (key === null) return;
    key = key.trim();
    if (!key) return;
    setMsg('กำลังตรวจสอบรหัส…');
    api({ action: 'verify', key: key })
      .then(function (data) {
        if (data && data.ok) {
          teacherKey = key;
          try { localStorage.setItem(KEY_STORE, key); sessionStorage.setItem(KEY_STORE, key); } catch (e) {}
          setMsg('เข้าสู่โหมดอาจารย์แล้ว', 'success');
          stopPoll();
          render();
        } else {
          setMsg('รหัสผ่านไม่ถูกต้อง', 'error');
        }
      })
      .catch(function (err) { setMsg('ตรวจสอบรหัสไม่สำเร็จ: ' + err.message, 'error'); });
  }

  function logoutTeacher() {
    if (window.TeacherAuth) {
      window.TeacherAuth.setKey('');
    } else {
      try { localStorage.removeItem(KEY_STORE); sessionStorage.removeItem(KEY_STORE); } catch (e) {}
    }
    teacherKey = '';
    setMsg('ออกจากโหมดอาจารย์แล้ว');
    render();
    startPoll();
  }

  // ---------- การแสดงผลรายชื่อ ----------
  function counts() {
    var done = roster.filter(function (s) { return checked[s.id]; }).length;
    return done + ' / ' + roster.length;
  }

  function render() {
    var q = (elSearch.value || '').trim().toLowerCase();
    var rows = roster.filter(function (s) {
      return !q || s.name.toLowerCase().indexOf(q) !== -1 || s.id.toLowerCase().indexOf(q) !== -1;
    });
    elStat.textContent = 'มาเรียน ' + counts();
    elList.innerHTML = '';
    if (!rows.length) {
      var empty = document.createElement('div');
      empty.className = 'ci-empty';
      empty.textContent = 'ไม่พบรายชื่อที่ค้นหา';
      elList.appendChild(empty);
      return;
    }
    rows.forEach(function (s) {
      var done = !!checked[s.id];
      var row = document.createElement('div');
      row.className = 'ci-item' + (done ? ' is-done' : '');

      var info = document.createElement('div');
      info.className = 'ci-info';
      var nm = document.createElement('span');
      nm.className = 'ci-name';
      nm.textContent = s.name;
      var idEl = document.createElement('span');
      idEl.className = 'ci-id';
      idEl.textContent = s.id;
      info.appendChild(nm);
      info.appendChild(idEl);

      var right = document.createElement('div');
      right.className = 'ci-right';

      var badge = document.createElement('span');
      badge.className = 'ci-badge ' + (done ? 'ci-badge--yes' : 'ci-badge--no');
      badge.textContent = done ? '✓ มาเรียน' : 'ยังไม่เช็ค';
      right.appendChild(badge);

      // ปุ่มควบคุมเฉพาะอาจารย์
      if (isTeacher()) {
        if (done) {
          var undo = document.createElement('button');
          undo.className = 'ci-undo';
          undo.type = 'button';
          undo.textContent = 'ยกเลิก';
          undo.addEventListener('click', function () { mark(s, 'uncheck', undo); });
          right.appendChild(undo);
        } else {
          var btn = document.createElement('button');
          btn.className = 'ci-btn';
          btn.type = 'button';
          btn.textContent = 'เช็คชื่อ';
          btn.addEventListener('click', function () { mark(s, 'check', btn); });
          right.appendChild(btn);
        }
      }

      row.appendChild(info);
      row.appendChild(right);
      elList.appendChild(row);
    });
  }

  function mark(s, action, ctrl) {
    if (ctrl) { ctrl.disabled = true; }
    api({ action: action, key: teacherKey, studentId: s.id })
      .then(function (data) {
        if (!data.ok) {
          if (data.error === 'unauthorized') { logoutTeacher(); setMsg('สิทธิ์หมดอายุ กรุณาเข้าสู่ระบบใหม่', 'error'); return; }
          throw new Error(data.error || 'ทำรายการไม่สำเร็จ');
        }
        checked[s.id] = (action === 'check');
        render();
        if (action === 'check') {
          setMsg((data.duplicate ? 'เช็คไว้แล้ว: ' : '✓ เช็คชื่อ: ') + s.name, 'success');
        } else {
          setMsg('ยกเลิกการเช็คชื่อ: ' + s.name, 'success');
        }
      })
      .catch(function (err) {
        if (ctrl) { ctrl.disabled = false; }
        setMsg('ไม่สำเร็จ: ' + err.message, 'error');
      });
  }

  // ---------- โหลดข้อมูล ----------
  function load(silent) {
    if (!silent) setMsg('กำลังโหลดรายชื่อ…');
    fetch(API_URL, { method: 'GET' })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data.ok) throw new Error(data.error || 'โหลดไม่สำเร็จ');
        roster = data.roster || [];
        today = data.today || '';
        checked = {};
        (data.checked || []).forEach(function (id) { checked[id] = true; });
        if (elDate) elDate.textContent = today;
        render();
        if (!silent) setMsg('');
      })
      .catch(function (err) {
        if (!silent) setMsg('โหลดรายชื่อไม่สำเร็จ: ' + err.message, 'error');
      });
  }

  function startPoll() {
    stopPoll();
    if (!isTeacher()) pollTimer = setInterval(function () { load(true); }, POLL_MS);
  }
  function stopPoll() { if (pollTimer) { clearInterval(pollTimer); pollTimer = null; } }

  // ---------- เริ่มทำงาน ----------
  window.addEventListener('teacher-auth-changed', function () {
    teacherKey = getTeacherKey();
    if (teacherKey) stopPoll(); else startPoll();
    render();
  });

  if (!API_URL) {
    elStat.textContent = 'ยังไม่พร้อมใช้งาน';
    setMsg('⚠️ ผู้สอนยังไม่ได้ตั้งค่าระบบ (API_URL) — ดูวิธีตั้งค่าในไฟล์ attendance/README.md', 'warn');
    return;
  }

  elSearch.addEventListener('input', render);
  load();
  startPoll();
})();
</script>
{% endraw %}
