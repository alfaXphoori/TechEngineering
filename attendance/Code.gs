/**
 * ระบบเช็คชื่อเข้าห้อง — Backend (Google Apps Script)
 * รายวิชา เทคโนโลยีดิจิทัลสำหรับวิศวกรรม (Digital Technology for Engineering)
 *
 * 2 สิทธิ์การใช้งาน:
 *   - นักศึกษา : ดูสถานะการเช็คชื่อทั้งห้องได้อย่างเดียว (doGet — สาธารณะ)
 *   - อาจารย์  : เช็ค/ยกเลิกการมาเรียน (doPost — ต้องมีรหัสผ่านอาจารย์)
 *
 * การติดตั้ง (ดูรายละเอียดใน attendance/README.md):
 *   1. เปิดสเปรดชีตทะเบียนรายชื่อ → เมนู Extensions → Apps Script
 *   2. ลบโค้ดเดิม แล้ววางไฟล์นี้ทั้งหมด → Save
 *   3. ตั้งรหัสผ่านอาจารย์: แก้ค่าในฟังก์ชัน setTeacherKey() ด้านล่าง แล้วกด Run 1 ครั้ง
 *      (รหัสจะถูกเก็บใน Script Properties ไม่อยู่ในซอร์สโค้ด)
 *   4. Deploy → Manage deployments → แก้ deployment เดิม → Version: New version
 *        - Execute as:      Me (เจ้าของชีต)
 *        - Who has access:  Anyone
 *   5. ใช้ลิงก์ /exec เดิมได้ต่อ
 *
 * - แท็บแรกของสเปรดชีต = ทะเบียนรายชื่อ (ต้องมีหัวคอลัมน์ studentId และ Fullname)
 * - สคริปต์จะสร้างแท็บ "Attendance" ให้อัตโนมัติเพื่อเก็บบันทึกการมาเรียน
 */

var ATT_SHEET_NAME = 'Attendance';
var SCORES_SHEET_NAME = 'Scores';
var TIMEZONE = 'Asia/Bangkok';

/**
 * ตั้งรหัสผ่านอาจารย์ — แก้ข้อความด้านล่างเป็นรหัสที่ต้องการ แล้วกด Run ฟังก์ชันนี้ 1 ครั้ง
 * (ทำซ้ำได้ทุกครั้งที่ต้องการเปลี่ยนรหัส)
 */
function setTeacherKey() {
  PropertiesService.getScriptProperties().setProperty('TEACHER_KEY', 'เปลี่ยนรหัสนี้');
}

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var mode = (e && e.parameter && e.parameter.mode) ? String(e.parameter.mode) : '';

  if (mode === 'summary') {
    return jsonOut_(buildSummary_(ss));
  }

  if (mode === 'submissions') {
    return jsonOut_(buildSubmissions_(ss));
  }

  if (mode === 'scores') {
    return jsonOut_(buildScores_(ss));
  }

  var today = today_();
  return jsonOut_({
    ok: true,
    today: today,
    roster: readRoster_(ss),
    checked: checkedToday_(ss, today)
  });
}

/** สรุปการมาเรียนทั้งเทอม: นับจำนวนวันที่มาเรียนต่อคน + รายการวันที่มีคาบเรียน */
function buildSummary_(ss) {
  var roster = readRoster_(ss);
  var sheet = ss.getSheetByName(ATT_SHEET_NAME);
  var dateSet = {};
  var perStudent = {}; // id -> { date: true }

  if (sheet) {
    var values = sheet.getDataRange().getValues();
    for (var r = 1; r < values.length; r++) {
      var d = dateStr_(values[r][1]);
      var id = String(values[r][2]).trim();
      if (!d || !id) continue;
      dateSet[d] = true;
      if (!perStudent[id]) perStudent[id] = {};
      perStudent[id][d] = true;
    }
  }

  var dates = Object.keys(dateSet).sort();
  var rosterOut = roster.map(function (s) {
    var pres = perStudent[s.id] || {};
    var presentDates = dates.filter(function (d) { return pres[d]; });
    return { id: s.id, name: s.name, count: presentDates.length, present: presentDates };
  });

  return { ok: true, dates: dates, totalDays: dates.length, roster: rosterOut };
}

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var body = parseBody_(e);
    var action = String(body.action || 'check');

    // ตรวจสอบรหัสผ่านอาจารย์ (ใช้สำหรับล็อกอินโหมดอาจารย์)
    if (action === 'verify') {
      return jsonOut_({ ok: isTeacher_(body.key) });
    }

    // ทุกการเขียนข้อมูลต้องเป็นอาจารย์เท่านั้น
    if (!isTeacher_(body.key)) {
      return jsonOut_({ ok: false, error: 'unauthorized' });
    }

    // บันทึกคะแนน
    if (action === 'saveScores') {
      return jsonOut_(saveScores_(ss, body));
    }

    var id = String(body.studentId || '').trim();
    if (!id) return jsonOut_({ ok: false, error: 'ไม่ได้ระบุรหัสนักศึกษา' });

    var roster = readRoster_(ss);
    var student = null;
    for (var i = 0; i < roster.length; i++) {
      if (roster[i].id === id) { student = roster[i]; break; }
    }
    if (!student) return jsonOut_({ ok: false, error: 'ไม่พบรหัสนี้ในทะเบียนรายชื่อ' });

    var today = today_();

    if (action === 'uncheck') {
      removeToday_(ss, today, id);
      return jsonOut_({ ok: true, action: 'uncheck', today: today, student: student });
    }

    // action = check (ค่าเริ่มต้น)
    if (checkedToday_(ss, today).indexOf(id) !== -1) {
      return jsonOut_({ ok: true, duplicate: true, today: today, student: student });
    }
    getAttSheet_(ss).appendRow([new Date(), today, id, student.name, String(body.session || '')]);
    return jsonOut_({ ok: true, duplicate: false, today: today, student: student });
  } catch (err) {
    return jsonOut_({ ok: false, error: String(err) });
  }
}

function isTeacher_(key) {
  var k = PropertiesService.getScriptProperties().getProperty('TEACHER_KEY') || '';
  return k !== '' && String(key || '') === k;
}

/** หาแท็บทะเบียนรายชื่อจากหัวคอลัมน์ (ไม่ยึดตำแหน่งแท็บ เพราะอาจมีแท็บฟอร์มแทรก) */
function rosterSheet_(ss) {
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    var name = String(sheets[i].getName()).trim();
    if (/^W\s*\d+$/i.test(name) || name === ATT_SHEET_NAME || name === SCORES_SHEET_NAME) continue;
    if (sheets[i].getLastColumn() < 1 || sheets[i].getLastRow() < 1) continue;
    var header = sheets[i].getRange(1, 1, 1, sheets[i].getLastColumn())
      .getValues()[0].map(function (h) { return String(h).trim().toLowerCase(); });
    if (header.indexOf('studentid') !== -1 &&
        (header.indexOf('fullname') !== -1 || header.indexOf('name') !== -1)) {
      return sheets[i];
    }
  }
  // สำรอง: หาแท็บแรกที่ไม่ใช่แท็บระบบ
  for (var j = 0; j < sheets.length; j++) {
    var sName = String(sheets[j].getName()).trim();
    if (!/^W\s*\d+$/i.test(sName) && sName !== ATT_SHEET_NAME && sName !== SCORES_SHEET_NAME) {
      return sheets[j];
    }
  }
  return sheets[0];
}

/** อ่านทะเบียนรายชื่อ คืน [{ id, name }] */
function readRoster_(ss) {
  var sheet = rosterSheet_(ss);
  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];

  var header = values[0].map(function (h) { return String(h).trim().toLowerCase(); });
  var idCol = header.indexOf('studentid');
  var nameCol = header.indexOf('fullname');
  if (nameCol === -1) nameCol = header.indexOf('name');
  if (idCol === -1) idCol = 1;     // สำรอง: คอลัมน์ B
  if (nameCol === -1) nameCol = 2; // สำรอง: คอลัมน์ C

  var out = [];
  for (var r = 1; r < values.length; r++) {
    var id = String(values[r][idCol]).trim();
    var name = String(values[r][nameCol]).trim();
    if (id && name) out.push({ id: id, name: name });
  }
  return out;
}

/**
 * สรุปการส่งงาน: อ่านแท็บคำตอบของฟอร์มที่ชื่อ W1, W2, ... (ลิงก์มาจาก Google Form)
 * จับคู่กับทะเบียนรายชื่อด้วย "รหัสนักศึกษา" หรือ "ชื่อ-สกุล" (อย่างใดอย่างหนึ่งที่ตรง)
 */
function buildSubmissions_(ss) {
  var roster = readRoster_(ss);

  // ทำดัชนีไว้จับคู่: ตามรหัส และตามชื่อ → คืนเป็น studentId มาตรฐานของทะเบียน
  var idx = { byId: {}, byName: {} };
  roster.forEach(function (s) {
    idx.byId[normId_(s.id)] = s.id;
    idx.byName[normName_(s.name)] = s.id;
  });

  var sheets = ss.getSheets();
  var weekData = {}; // week -> { rosterId: true }
  var weeks = [];

  for (var i = 0; i < sheets.length; i++) {
    var m = String(sheets[i].getName()).trim().match(/^W\s*(\d+)$/i);
    if (!m) continue;
    var wk = parseInt(m[1], 10);
    weekData[wk] = readSubmitted_(sheets[i], idx);
    weeks.push(wk);
  }
  weeks.sort(function (a, b) { return a - b; });

  var rosterOut = roster.map(function (s) {
    var sub = {};
    var c = 0;
    for (var k = 0; k < weeks.length; k++) {
      var has = !!weekData[weeks[k]][s.id];
      sub[weeks[k]] = has;
      if (has) c++;
    }
    return { id: s.id, name: s.name, submitted: sub, count: c };
  });

  var counts = {};
  weeks.forEach(function (wk) {
    var cnt = 0;
    rosterOut.forEach(function (s) { if (s.submitted[wk]) cnt++; });
    counts[wk] = cnt;
  });

  return { ok: true, weeks: weeks, counts: counts, totalStudents: roster.length, roster: rosterOut };
}

/** อ่านคำตอบ 1 แท็บ จับคู่กับทะเบียน คืน { rosterId: true } ของคนที่ส่งแล้ว */
function readSubmitted_(sheet, idx) {
  var out = {};
  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return out;

  var header = values[0].map(function (h) { return String(h).trim().toLowerCase(); });
  var idCol = -1, nameCol = -1;
  for (var c = 0; c < header.length; c++) {
    if (idCol === -1 && (header[c].indexOf('รหัส') !== -1 ||
        header[c].indexOf('studentid') !== -1 || header[c].indexOf('student id') !== -1)) idCol = c;
    if (nameCol === -1 && (header[c].indexOf('ชื่อ') !== -1 ||
        header[c] === 'name' || header[c].indexOf('fullname') !== -1 || header[c].indexOf('full name') !== -1)) nameCol = c;
  }

  for (var r = 1; r < values.length; r++) {
    var matched = null;
    if (idCol !== -1) {
      var k1 = normId_(values[r][idCol]);
      if (k1 && idx.byId[k1]) matched = idx.byId[k1];
    }
    if (!matched && nameCol !== -1) {
      var k2 = normName_(values[r][nameCol]);
      if (k2 && idx.byName[k2]) matched = idx.byName[k2];
    }
    if (matched) out[matched] = true;
  }
  return out;
}

/** ตัดให้เหลือเฉพาะเลขรหัสส่วนหน้า (ก่อน '-') เพื่อเทียบให้ตรงแม้พิมพ์ต่างรูปแบบ */
function normId_(x) {
  var s = String(x == null ? '' : x).trim();
  s = s.split('-')[0];
  return s.replace(/[^0-9]/g, '');
}

/** ตัดคำนำหน้าชื่อและช่องว่างออก เพื่อเทียบชื่อให้ตรงแม้เว้นวรรคต่างกัน */
function normName_(x) {
  var s = String(x == null ? '' : x).trim();
  var titles = ['นางสาว', 'เด็กชาย', 'เด็กหญิง', 'ด.ช.', 'ด.ญ.', 'น.ส.', 'นาย', 'นาง'];
  for (var i = 0; i < titles.length; i++) {
    if (s.indexOf(titles[i]) === 0) { s = s.substring(titles[i].length); break; }
  }
  return s.replace(/\s+/g, '');
}

/** คืนแท็บ Attendance (สร้างใหม่พร้อมหัวตารางถ้ายังไม่มี) */
function getAttSheet_(ss) {
  var sheet = ss.getSheetByName(ATT_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(ATT_SHEET_NAME);
    sheet.appendRow(['Timestamp', 'Date', 'studentId', 'Fullname', 'Session']);
  }
  return sheet;
}

/** คืนรายการ studentId ที่เช็คชื่อแล้วในวันที่ที่กำหนด */
function checkedToday_(ss, today) {
  var sheet = ss.getSheetByName(ATT_SHEET_NAME);
  if (!sheet) return [];
  var values = sheet.getDataRange().getValues();
  var out = [];
  for (var r = 1; r < values.length; r++) {
    if (dateStr_(values[r][1]) === today) out.push(String(values[r][2]).trim());
  }
  return out;
}

/** ลบบันทึกการมาเรียนของรหัสนี้ในวันนี้ (ใช้ตอนอาจารย์กดยกเลิก) */
function removeToday_(ss, today, id) {
  var sheet = ss.getSheetByName(ATT_SHEET_NAME);
  if (!sheet) return;
  var values = sheet.getDataRange().getValues();
  for (var r = values.length - 1; r >= 1; r--) {
    if (String(values[r][1]) === today && String(values[r][2]).trim() === id) {
      sheet.deleteRow(r + 1);
    }
  }
}

function today_() {
  return Utilities.formatDate(new Date(), TIMEZONE, 'yyyy-MM-dd');
}

/** แปลงค่าจากคอลัมน์วันที่ให้เป็นสตริง yyyy-MM-dd เสมอ (กันกรณีชีตแปลงเป็น Date object) */
function dateStr_(v) {
  if (v instanceof Date) return Utilities.formatDate(v, TIMEZONE, 'yyyy-MM-dd');
  return String(v == null ? '' : v).trim();
}

function parseBody_(e) {
  if (e && e.postData && e.postData.contents) {
    try { return JSON.parse(e.postData.contents); } catch (x) {}
  }
  return (e && e.parameter) ? e.parameter : {};
}

function jsonOut_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * =========================================================================
 * ระบบจัดการคะแนนและผลการเรียน (Scores / Grading)
 * =========================================================================
 */

/**
 * ดึงข้อมูลคะแนน: อ่านแท็บ Scores
 * ถ้ายังไม่มีแท็บ Scores ให้สร้างให้อัตโนมัติพร้อมรายชื่อนักศึกษาจากทะเบียน
 */
function buildScores_(ss) {
  var sheet = getScoresSheet_(ss);
  var roster = readRoster_(ss);
  var values = sheet.getDataRange().getValues();

  if (values.length < 1) {
    return { ok: false, error: 'ตารางคะแนนว่างเปล่า' };
  }

  var header = values[0].map(function (h) { return String(h).trim(); });
  var headerLower = header.map(function (h) { return h.toLowerCase(); });

  var idCol = -1;
  var nameCol = -1;
  var totalCol = -1;
  var gradeCol = -1;

  for (var c = 0; c < headerLower.length; c++) {
    var h = headerLower[c];
    if (idCol === -1 && (h.indexOf('studentid') !== -1 || h.indexOf('รหัส') !== -1)) idCol = c;
    else if (nameCol === -1 && (h.indexOf('fullname') !== -1 || h === 'name' || h.indexOf('ชื่อ') !== -1)) nameCol = c;
    else if (totalCol === -1 && (h === 'รวม' || h.indexOf('รวม') !== -1 || h === 'total' || h.indexOf('total') !== -1)) totalCol = c;
    else if (gradeCol === -1 && (h === 'เกรด' || h.indexOf('เกรด') !== -1 || h === 'grade' || h.indexOf('grade') !== -1)) gradeCol = c;
  }

  if (idCol === -1) idCol = 0;
  if (nameCol === -1) nameCol = 1;

  // รายการคอลัมน์คะแนน
  var columns = [];
  for (var c = 0; c < header.length; c++) {
    if (c === idCol || c === nameCol || c === totalCol || c === gradeCol) continue;
    var colName = header[c];
    if (!colName) continue;
    var maxMatch = colName.match(/\((\d+(?:\.\d+)?)\)/);
    var maxVal = maxMatch ? parseFloat(maxMatch[1]) : null;
    columns.push({
      key: colName,
      title: colName,
      colIndex: c,
      max: maxVal
    });
  }

  // อ่านข้อมูลนักศึกษาในแท็บ Scores
  var scoreMap = {};
  for (var r = 1; r < values.length; r++) {
    var rawId = values[r][idCol];
    var nid = normId_(rawId);
    if (!nid) continue;

    var sc = {};
    for (var k = 0; k < columns.length; k++) {
      var colIdx = columns[k].colIndex;
      var val = values[r][colIdx];
      if (val !== '' && val !== null && !isNaN(val)) {
        sc[columns[k].key] = Number(val);
      } else {
        sc[columns[k].key] = (val === '' || val === null) ? null : val;
      }
    }

    var rawTotal = totalCol !== -1 ? values[r][totalCol] : null;
    var totalVal = (rawTotal !== '' && rawTotal !== null && !isNaN(rawTotal)) ? Number(rawTotal) : null;
    var rawGrade = gradeCol !== -1 ? String(values[r][gradeCol]).trim() : '';

    scoreMap[nid] = {
      rawId: String(rawId).trim(),
      scores: sc,
      total: totalVal,
      grade: rawGrade
    };
  }

  // ประกอบผลลัพธ์โดยยึดทะเบียน roster เป็นหลัก
  var studentsOut = [];
  var gradedCount = 0;
  var sumScores = 0;
  var maxScore = -Infinity;
  var minScore = Infinity;
  var gradeCounts = { 'A': 0, 'B+': 0, 'B': 0, 'C+': 0, 'C': 0, 'D+': 0, 'D': 0, 'F': 0 };

  for (var i = 0; i < roster.length; i++) {
    var s = roster[i];
    var nid = normId_(s.id);
    var sm = scoreMap[nid] || { scores: {}, total: null, grade: '' };

    var itemTotal = 0;
    var hasAnyScore = false;
    for (var k = 0; k < columns.length; k++) {
      var cKey = columns[k].key;
      var v = sm.scores[cKey];
      if (typeof v === 'number') {
        itemTotal += v;
        hasAnyScore = true;
      }
    }

    var finalTotal = (sm.total !== null && !isNaN(sm.total)) ? sm.total : (hasAnyScore ? Math.round(itemTotal * 100) / 100 : null);
    var finalGrade = sm.grade || (finalTotal !== null ? calcGrade_(finalTotal) : '');

    if (finalTotal !== null) {
      gradedCount++;
      sumScores += finalTotal;
      if (finalTotal > maxScore) maxScore = finalTotal;
      if (finalTotal < minScore) minScore = finalTotal;
      if (gradeCounts[finalGrade] !== undefined) {
        gradeCounts[finalGrade]++;
      }
    }

    studentsOut.push({
      id: s.id,
      name: s.name,
      scores: sm.scores,
      total: finalTotal,
      grade: finalGrade,
      hasScore: hasAnyScore || (finalTotal !== null)
    });
  }

  var summary = {
    totalStudents: roster.length,
    gradedCount: gradedCount,
    averageTotal: gradedCount > 0 ? Math.round((sumScores / gradedCount) * 10) / 10 : 0,
    maxTotal: maxScore !== -Infinity ? maxScore : 0,
    minTotal: minScore !== Infinity ? minScore : 0,
    gradeCounts: gradeCounts
  };

  return {
    ok: true,
    columns: columns.map(function (c) { return { key: c.key, title: c.title, max: c.max }; }),
    students: studentsOut,
    summary: summary
  };
}

/**
 * คืนแท็บ Scores (สร้างใหม่พร้อมหัวตารางและรายชื่อนักศึกษาจากทะเบียน ถ้ายังไม่มี)
 */
function getScoresSheet_(ss) {
  var sheet = ss.getSheetByName(SCORES_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SCORES_SHEET_NAME);
    // คอลัมน์มาตรฐานตามเกณฑ์การวัดและประเมินผลในแผนการจัดการเรียนรู้ (สัดส่วน 100%)
    var headers = ['studentId', 'Fullname', 'จิตพิสัย (10)', 'ใบงาน (45)', 'กลางภาค (20)', 'ปลายภาค (25)', 'รวม (100)', 'เกรด'];
    sheet.appendRow(headers);

    var headRange = sheet.getRange(1, 1, 1, headers.length);
    headRange.setFontWeight('bold');
    headRange.setBackground('#f1f5f9');
  }

  // ถ้าแท็บ Scores มีเฉพาะหัวตาราง ให้ใส่รายชื่อนักศึกษาจากทะเบียนอัตโนมัติ
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    var roster = readRoster_(ss);
    if (roster.length > 0) {
      var rows = [];
      for (var i = 0; i < roster.length; i++) {
        var rowNum = i + 2;
        var sumFormula = '=IF(COUNT(C' + rowNum + ':G' + rowNum + ')=0, "", SUM(C' + rowNum + ':G' + rowNum + '))';
        var gradeFormula = '=IF(H' + rowNum + '="", "", IF(H' + rowNum + '>=80, "A", IF(H' + rowNum + '>=75, "B+", IF(H' + rowNum + '>=70, "B", IF(H' + rowNum + '>=65, "C+", IF(H' + rowNum + '>=60, "C", IF(H' + rowNum + '>=55, "D+", IF(H' + rowNum + '>=50, "D", "F"))))))))';
        rows.push([roster[i].id, roster[i].name, '', '', '', '', '', sumFormula, gradeFormula]);
      }
      sheet.getRange(2, 1, rows.length, 9).setValues(rows);
    }
  }

  return sheet;
}

/**
 * บันทึกคะแนนลงในแท็บ Scores (ต้องเป็นอาจารย์เท่านั้น)
 * รองรับ body.items: [ { studentId: '...', scores: { 'จิตพิสัย (10)': 10, ... } }, ... ]
 * หรือ body.scores: { [studentId]: { [columnName]: value } }
 */
function saveScores_(ss, body) {
  var sheet = getScoresSheet_(ss);
  var items = [];

  if (Array.isArray(body.items)) {
    items = body.items;
  } else if (body.scores && typeof body.scores === 'object') {
    for (var sid in body.scores) {
      if (body.scores.hasOwnProperty(sid)) {
        items.push({ studentId: sid, scores: body.scores[sid] });
      }
    }
  } else if (body.studentId && body.scores) {
    items.push({ studentId: body.studentId, scores: body.scores });
  }

  if (items.length === 0) {
    return { ok: false, error: 'ไม่มีข้อมูลคะแนนที่จะบันทึก' };
  }

  var range = sheet.getDataRange();
  var values = range.getValues();
  var formulas = range.getFormulas();
  var header = values[0].map(function (h) { return String(h).trim(); });
  var headerLower = header.map(function (h) { return h.toLowerCase(); });

  var idCol = -1;
  var nameCol = -1;
  var totalCol = -1;
  var gradeCol = -1;

  for (var c = 0; c < headerLower.length; c++) {
    var h = headerLower[c];
    if (idCol === -1 && (h.indexOf('studentid') !== -1 || h.indexOf('รหัส') !== -1)) idCol = c;
    else if (nameCol === -1 && (h.indexOf('fullname') !== -1 || h === 'name' || h.indexOf('ชื่อ') !== -1)) nameCol = c;
    else if (totalCol === -1 && (h === 'รวม' || h.indexOf('รวม') !== -1 || h === 'total' || h.indexOf('total') !== -1)) totalCol = c;
    else if (gradeCol === -1 && (h === 'เกรด' || h.indexOf('เกรด') !== -1 || h === 'grade' || h.indexOf('grade') !== -1)) gradeCol = c;
  }

  if (idCol === -1) idCol = 0;

  // ตรวจสอบคอลัมน์ใหม่ที่ยังไม่มีใน header
  var newCols = [];
  items.forEach(function (item) {
    if (!item.scores) return;
    for (var k in item.scores) {
      if (item.scores.hasOwnProperty(k) && header.indexOf(k) === -1 && newCols.indexOf(k) === -1) {
        newCols.push(k);
      }
    }
  });

  // ถ้ามีคอลัมน์ใหม่ ให้แทรกคอลัมน์ก่อนคอลัมน์รวม
  if (newCols.length > 0) {
    for (var nc = 0; nc < newCols.length; nc++) {
      var insertIdx = totalCol !== -1 ? totalCol + 1 : sheet.getLastColumn() + 1;
      sheet.insertColumnBefore(insertIdx);
      sheet.getRange(1, insertIdx).setValue(newCols[nc]).setFontWeight('bold').setBackground('#f1f5f9');
      if (totalCol !== -1) totalCol++;
      if (gradeCol !== -1 && gradeCol >= totalCol) gradeCol++;
    }
    range = sheet.getDataRange();
    values = range.getValues();
    formulas = range.getFormulas();
    header = values[0].map(function (h) { return String(h).trim(); });
  }

  var colIndexMap = {};
  for (var c = 0; c < header.length; c++) {
    colIndexMap[header[c]] = c;
  }

  var rowMap = {};
  for (var r = 1; r < values.length; r++) {
    var nid = normId_(values[r][idCol]);
    if (nid) rowMap[nid] = r;
  }

  var updatedCount = 0;
  items.forEach(function (item) {
    var nid = normId_(item.studentId);
    if (!nid || rowMap[nid] === undefined) return;
    var r = rowMap[nid];

    for (var colKey in item.scores) {
      if (!item.scores.hasOwnProperty(colKey)) continue;
      var cIdx = colIndexMap[colKey];
      if (cIdx !== undefined && cIdx !== idCol && cIdx !== nameCol) {
        var rawVal = item.scores[colKey];
        var numVal = (rawVal === '' || rawVal === null || isNaN(rawVal)) ? '' : Number(rawVal);
        values[r][cIdx] = numVal;
      }
    }
    updatedCount++;
  });

  // คงสูตรเดิมไว้สำหรับ cell ที่เป็นสูตร หรือคำนวณถ้าไม่มีสูตร
  for (var r = 1; r < values.length; r++) {
    for (var c = 0; c < values[r].length; c++) {
      if (formulas[r][c] && String(formulas[r][c]).indexOf('=') === 0) {
        values[r][c] = formulas[r][c];
      }
    }
    if (totalCol !== -1 && (!formulas[r][totalCol] || String(formulas[r][totalCol]).indexOf('=') !== 0)) {
      var rTotal = 0;
      var hasAny = false;
      for (var c = 0; c < header.length; c++) {
        if (c === idCol || c === nameCol || c === totalCol || c === gradeCol) continue;
        var cv = values[r][c];
        if (typeof cv === 'number') {
          rTotal += cv;
          hasAny = true;
        }
      }
      values[r][totalCol] = hasAny ? Math.round(rTotal * 100) / 100 : '';
    }
    if (gradeCol !== -1 && (!formulas[r][gradeCol] || String(formulas[r][gradeCol]).indexOf('=') !== 0)) {
      var tot = totalCol !== -1 ? values[r][totalCol] : null;
      values[r][gradeCol] = (tot !== '' && tot !== null && !isNaN(tot)) ? calcGrade_(Number(tot)) : '';
    }
  }

  range.setValues(values);
  return { ok: true, updatedCount: updatedCount };
}

/** คำนวณเกรดตามเกณฑ์อิงเกณฑ์มาตรฐานมหาวิทยาลัย */
function calcGrade_(total) {
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

