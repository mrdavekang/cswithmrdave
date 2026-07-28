/* =============================================================
   report.js — black and white PDF evidence report (jsPDF, local)
   Also provides a print-friendly HTML fallback (window.print()).
   ============================================================= */

(function (global) {
  'use strict';

  const M = { left: 16, right: 16, top: 16, bottom: 18 };
  const PAGE = { w: 210, h: 297 };
  const CONTENT_W = PAGE.w - M.left - M.right;

  function loadImage(src) {
    return new Promise(function (resolve) {
      if (!src) { resolve(null); return; }
      const im = new Image();
      im.onload = function () { resolve(im); };
      im.onerror = function () { resolve(null); };
      im.src = src;
    });
  }

  function LessonPDF(doc, payload) {
    this.doc = doc;
    this.p = payload;
    this.y = M.top;
  }

  LessonPDF.prototype.space = function (needed) {
    if (this.y + needed > PAGE.h - M.bottom) {
      this.doc.addPage();
      this.y = M.top;
      return true;
    }
    return false;
  };

  LessonPDF.prototype.text = function (str, opts) {
    opts = opts || {};
    const doc = this.doc;
    const size = opts.size || 10;
    const font = opts.mono ? 'courier' : 'helvetica';
    const style = opts.bold ? 'bold' : (opts.italic ? 'italic' : 'normal');
    const width = opts.width || CONTENT_W;
    const lh = size * 0.42 + 0.8;
    doc.setFont(font, style);
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(String(str === null || str === undefined ? '' : str), width);
    for (let i = 0; i < lines.length; i++) {
      this.space(lh + 1);
      doc.text(lines[i], opts.x || M.left, this.y);
      this.y += lh;
    }
    if (opts.gap !== 0) this.y += (opts.gap === undefined ? 1.2 : opts.gap);
  };

  LessonPDF.prototype.rule = function (thickness) {
    this.space(3);
    this.doc.setLineWidth(thickness || 0.3);
    this.doc.setDrawColor(0);
    this.doc.line(M.left, this.y, PAGE.w - M.right, this.y);
    this.y += 3;
  };

  LessonPDF.prototype.heading = function (title) {
    this.space(16);
    this.y += 2;
    this.text(title, { size: 13, bold: true, gap: 1 });
    this.rule(0.6);
  };

  LessonPDF.prototype.subheading = function (title) {
    this.space(10);
    this.text(title, { size: 10.5, bold: true, gap: 0.6 });
  };

  /* Code block with a border, split safely across pages. */
  LessonPDF.prototype.code = function (str) {
    const doc = this.doc;
    const size = 8.6;
    const lh = 3.9;
    const padding = 2.4;
    doc.setFont('courier', 'normal');
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(String(str || '').replace(/\t/g, '    '), CONTENT_W - padding * 2 - 6);
    let i = 0;
    while (i < lines.length) {
      const avail = PAGE.h - M.bottom - this.y - padding * 2;
      let fit = Math.max(1, Math.floor(avail / lh));
      if (fit < 3 && i === 0 && lines.length > 2) { this.space(9999); continue; }
      if (fit < 1) { this.space(9999); continue; }
      const chunk = lines.slice(i, i + fit);
      const boxH = chunk.length * lh + padding * 2;
      doc.setDrawColor(120);
      doc.setLineWidth(0.2);
      doc.rect(M.left, this.y, CONTENT_W, boxH);
      doc.setFont('courier', 'normal');
      doc.setFontSize(size);
      let ty = this.y + padding + 2.6;
      chunk.forEach(function (ln, n) {
        doc.setTextColor(120);
        doc.text(String(i + n + 1).padStart(2, ' '), M.left + padding, ty);
        doc.setTextColor(0);
        doc.text(ln, M.left + padding + 6, ty);
        ty += lh;
      });
      this.y += boxH + 2.5;
      i += fit;
      if (i < lines.length) { this.doc.addPage(); this.y = M.top; }
    }
    doc.setTextColor(0);
  };

  LessonPDF.prototype.image = function (img, caption) {
    if (!img) return;
    const maxW = Math.min(CONTENT_W, 150);
    const maxH = 165;
    let w = img.width, hgt = img.height;
    const scale = Math.min(maxW / (w / 3.78), maxH / (hgt / 3.78), 1); /* px → mm at 96dpi */
    let mmW = (w / 3.78) * scale;
    let mmH = (hgt / 3.78) * scale;
    if (mmW < 40) { const k = 40 / mmW; mmW *= k; mmH *= k; }
    if (mmH > maxH) { const k = maxH / mmH; mmW *= k; mmH *= k; }
    if (mmW > maxW) { const k = maxW / mmW; mmW *= k; mmH *= k; }

    this.space(mmH + 8);
    this.doc.setDrawColor(0);
    this.doc.setLineWidth(0.3);
    try {
      this.doc.addImage(img.src || img, 'PNG', M.left, this.y, mmW, mmH);
      this.doc.rect(M.left, this.y, mmW, mmH);
    } catch (e) { /* image could not be embedded */ }
    this.y += mmH + 5;
    if (caption) this.text(caption, { size: 8, italic: true, gap: 2.5 });
  };

  LessonPDF.prototype.coverBlock = function () {
    const p = this.p, L = p.lesson;
    const doc = this.doc;
    doc.setDrawColor(0); doc.setLineWidth(0.8);
    doc.rect(M.left, this.y, CONTENT_W, 40);
    this.y += 7;
    this.text(L.subject + ' — Project Evidence Report', { size: 15, bold: true, x: M.left + 4, width: CONTENT_W - 8, gap: 0.5 });
    this.text(L.title, { size: 12, bold: true, x: M.left + 4, width: CONTENT_W - 8, gap: 0.5 });
    this.text('Unit: ' + L.unit + '   ·   ' + L.weekLabel, { size: 9.5, x: M.left + 4, width: CONTENT_W - 8, gap: 0.5 });
    this.text('Name: ' + p.student.name + '     Class: ' + p.student.className + '     Date: ' + p.date,
      { size: 10.5, bold: true, x: M.left + 4, width: CONTENT_W - 8, gap: 0 });
    this.y = M.top + 44;
  };

  function buildDoc(payload) {
    const jsPDFctor = (global.jspdf && global.jspdf.jsPDF) || global.jsPDF;
    if (!jsPDFctor) return Promise.reject(new Error('PDF library not loaded'));

    const doc = new jsPDFctor({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true });
    doc.setProperties({
      title: payload.filename,
      subject: payload.lesson.title,
      author: payload.student.name + ' (' + payload.student.className + ')'
    });

    const r = new LessonPDF(doc, payload);
    r.coverBlock();

    /* Pre-load every image so that page layout is exact. */
    const imageJobs = [];
    payload.groups.forEach(function (g) {
      g.items.forEach(function (it) {
        if (it.image && it.a) imageJobs.push(loadImage(it.a).then(function (im) { it.__img = im; }));
      });
    });

    return Promise.all(imageJobs).then(function () {
      payload.groups.forEach(function (g) {
        r.heading(g.title);
        g.items.forEach(function (it) {
          const missing = !it.a || (typeof it.a === 'string' && !String(it.a).trim());
          r.subheading(it.q);
          if (it.image) {
            if (missing || !it.__img) r.text('Not added.', { size: 9.5, italic: true });
            else r.image(it.__img, it.alt || '');
          } else if (it.mono) {
            if (missing) r.text('Not written.', { size: 9.5, italic: true });
            else r.code(it.a);
          } else {
            r.text(missing ? 'Not answered.' : it.a, { size: 9.8, italic: missing });
          }
        });
      });

      /* Footer on every page */
      const total = doc.getNumberOfPages();
      for (let i = 1; i <= total; i++) {
        doc.setPage(i);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(90);
        doc.setDrawColor(180);
        doc.setLineWidth(0.2);
        doc.line(M.left, PAGE.h - 12, PAGE.w - M.right, PAGE.h - 12);
        doc.text(payload.student.name + ' · Class ' + payload.student.className + ' · ' +
                 payload.lesson.weekLabel + ' · ' + payload.lesson.title, M.left, PAGE.h - 8);
        doc.text('Page ' + i + ' of ' + total, PAGE.w - M.right, PAGE.h - 8, { align: 'right' });
        doc.setTextColor(0);
      }
      return doc;
    });
  }

  /* ---------------- print fallback ---------------- */
  function esc(s) {
    return String(s === null || s === undefined ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function buildPrintable(payload, container) {
    const L = payload.lesson;
    let html = '<h1>' + esc(L.subject) + ' — Project Evidence Report</h1>' +
      '<p><strong>' + esc(L.title) + '</strong><br>' +
      'Unit: ' + esc(L.unit) + ' · ' + esc(L.weekLabel) + '<br>' +
      'Name: ' + esc(payload.student.name) + ' · Class: ' + esc(payload.student.className) +
      ' · Date: ' + esc(payload.date) + '</p>';

    payload.groups.forEach(function (g) {
      html += '<section><h2>' + esc(g.title) + '</h2>';
      g.items.forEach(function (it) {
        const missing = !it.a || (typeof it.a === 'string' && !String(it.a).trim());
        html += '<div class="pr-item"><h3>' + esc(it.q) + '</h3>';
        if (it.image) {
          html += missing ? '<p><em>Not added.</em></p>'
            : '<img src="' + it.a + '" alt="' + esc(it.alt || it.q) + '">';
        } else if (it.mono) {
          html += missing ? '<p><em>Not written.</em></p>' : '<pre>' + esc(it.a) + '</pre>';
        } else {
          html += missing ? '<p><em>Not answered.</em></p>'
            : '<p style="white-space:pre-wrap">' + esc(it.a) + '</p>';
        }
        html += '</div>';
      });
      html += '</section>';
    });

    container.innerHTML = html;
    container.setAttribute('aria-hidden', 'false');
    return container;
  }

  global.LessonReport = { build: buildDoc, buildPrintable: buildPrintable };

})(window);
