(function () {
  "use strict";

  var data = window.COURSE_DATA || { meta: {}, lessons: [] };
  var lessons = data.lessons || [];
  var art = window.LESSON_ART || { get: function () { return ""; } };
  var PROGRESS_KEY = "little-aesthetics-done";
  var GAME_KEY = "little-aesthetics-games-done";
  var SOUND_KEY = "little-aesthetics-sound";
  var currentLessonSlug = "";
  var audioContext = null;
  var BADGES = [
    { name: "好奇宝宝", mark: "奇", threshold: 3, color: "#F2CC8F" },
    { name: "美学小达人", mark: "达", threshold: 5, color: "#81B29A" },
    { name: "传统美学小博士", mark: "博", threshold: 10, color: "#C7A19B" }
  ];
  var EXTENSION_ICONS = {
    "01-color": "palette",
    "02-pattern": "pattern",
    "03-architecture": "build",
    "04-painting": "brush",
    "05-calligraphy": "script",
    "06-porcelain": "vase",
    "07-costume": "robe",
    "08-garden": "garden",
    "09-festival": "lantern",
    "10-sculpture": "grotto"
  };
  var toastTimer = 0;
  var selectedNode = null;

  function qs(selector, context) {
    return (context || document).querySelector(selector);
  }

  function qa(selector, context) {
    return Array.prototype.slice.call((context || document).querySelectorAll(selector));
  }

  function setMeta(property, content) {
    var node = qs('meta[property="' + property + '"]');
    if (!node) {
      node = document.createElement("meta");
      node.setAttribute("property", property);
      document.head.appendChild(node);
    }
    node.setAttribute("content", content);
  }

  function setMetaName(name, content) {
    var node = qs('meta[name="' + name + '"]');
    if (!node) {
      node = document.createElement("meta");
      node.setAttribute("name", name);
      document.head.appendChild(node);
    }
    node.setAttribute("content", content);
  }

  function extensionIcon(type) {
    var icons = {
      palette: '<path d="M12 3a9 9 0 1 0 0 18h2a2 2 0 0 0 0-4h-1a2 2 0 0 1 0-4h4a3 3 0 0 0 3-3 7 7 0 0 0-8-7z"/><circle cx="7.5" cy="10.5" r="1"/><circle cx="10.5" cy="7.5" r="1"/><circle cx="14.5" cy="7.5" r="1"/>',
      pattern: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 8h8v8H8zM4 12h4M16 12h4M12 4v4M12 16v4"/>',
      build: '<path d="M4 20h16M6 20v-8l6-4 6 4v8M9 20v-5h6v5"/>',
      brush: '<path d="M4 20l6-6M14 4l6 6M12 6l6 6M3 21l5-1 10-10-4-4L4 16z"/>',
      script: '<path d="M4 19c4-1 6-4 8-8s6-6 8-4-2 7-5 8-5 1-7 4z"/><path d="M6 8h4M6 12h3"/>',
      vase: '<path d="M9 3h6l-1 4c3 3 4 6 4 9 0 4-3 6-6 6s-6-2-6-6c0-3 1-6 4-9z"/><path d="M8 14c3 2 5 2 8 0"/>',
      robe: '<path d="M9 3l3 2 3-2 5 3-2 5-2-1v11H8V10L6 11 4 6z"/><path d="M12 5l-2 4M12 5l2 4M8 15h8"/>',
      garden: '<path d="M4 20h16M6 20l3-8 3 5 3-7 3 10"/><path d="M12 5c2-2 5-2 6 0-2 2-5 2-6 0z"/><path d="M9 8c-2-2-5-2-6 0 2 2 5 2 6 0z"/>',
      lantern: '<path d="M9 4h6M10 4v2M14 4v2M7 8h10c0 5-2 9-5 9s-5-4-5-9z"/><path d="M10 17v3M14 17v3M9 20h6"/>',
      grotto: '<path d="M3 20l4-13 4 7 3-9 7 15z"/><circle cx="14" cy="12" r="3"/><path d="M13 12c.5.7 1.5.7 2 0"/>',
      idea: '<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/>'
    };
    return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + (icons[type] || icons.idea) + '</svg>';
  }

  function escapeHTML(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function lessonBySlug(slug) {
    return lessons.filter(function (item) { return item.slug === slug; })[0];
  }

  function toast(message) {
    var node = qs("#course-toast");
    if (!node) {
      node = document.createElement("div");
      node.id = "course-toast";
      node.className = "toast";
      node.setAttribute("role", "status");
      node.setAttribute("aria-live", "polite");
      document.body.appendChild(node);
    }
    node.textContent = message;
    node.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { node.classList.remove("show"); }, 2600);
  }

  function copyText(text, message) {
    function fallback() {
      var area = document.createElement("textarea");
      area.value = text;
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy");
        toast(message);
      } catch (error) {
        toast("未能自动复制，请手动选择文字");
      }
      document.body.removeChild(area);
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { toast(message); }).catch(fallback);
      return;
    }
    fallback();
  }

  function loadDone() {
    try {
      var value = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "[]");
      return Array.isArray(value) ? value : [];
    } catch (error) {
      return [];
    }
  }

  function saveDone(list) {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(list));
    } catch (error) {
      toast("浏览器没有允许保存进度");
    }
  }

  function loadGameDone() {
    try {
      var value = JSON.parse(localStorage.getItem(GAME_KEY) || "[]");
      return Array.isArray(value) ? value : [];
    } catch (error) {
      return [];
    }
  }

  function saveGameDone(list) {
    try {
      localStorage.setItem(GAME_KEY, JSON.stringify(list));
    } catch (error) {
      toast("浏览器没有允许保存游戏进度");
    }
  }

  function isGameDone(slug) {
    return loadGameDone().indexOf(slug) > -1;
  }

  function markGameDone(slug) {
    if (!slug) return;
    var list = loadGameDone();
    if (list.indexOf(slug) === -1) {
      list.push(slug);
      saveGameDone(list);
    }
  }

  function isSoundOn() {
    try {
      return localStorage.getItem(SOUND_KEY) === "1";
    } catch (error) {
      return false;
    }
  }

  function setSoundOn(value) {
    try {
      localStorage.setItem(SOUND_KEY, value ? "1" : "0");
    } catch (error) {
      // 浏览器不允许保存时，本次会话仍然按当前开关工作。
    }
  }

  function playTone(type) {
    if (!isSoundOn()) return;
    var AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return;
    if (!audioContext) audioContext = new AudioCtor();
    if (audioContext.state === "suspended" && audioContext.resume) audioContext.resume();
    var notes = type === "wrong" ? [220] : type === "complete" ? [660, 880] : type === "click" ? [520] : [880];
    notes.forEach(function (frequency, index) {
      var oscillator = audioContext.createOscillator();
      var gain = audioContext.createGain();
      var start = audioContext.currentTime + index * 0.09;
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.06, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.16);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.18);
    });
  }

  function isDone(index) {
    return loadDone().indexOf(index) > -1;
  }

  function setDone(index, done) {
    var before = loadDone();
    var wasDone = before.indexOf(index) > -1;
    var list = before.filter(function (item) { return item !== index; });
    if (done) list.push(index);
    list.sort(function (a, b) { return a - b; });
    saveDone(list);
    updateProgressDisplay();
    if (done && !wasDone) announceMilestone(before.length, list.length);
  }

  function announceMilestone(beforeCount, afterCount) {
    if (afterCount === 1) {
      toast("太棒了！你完成了第一课");
      return;
    }
    BADGES.forEach(function (badge) {
      if (beforeCount < badge.threshold && afterCount >= badge.threshold) {
        if (badge.threshold === 10) {
          toast("全部完成！解锁“" + badge.name + "”");
          celebrate();
        } else {
          toast("解锁徽章：" + badge.name);
        }
      }
    });
  }

  function updateProgressDisplay() {
    var count = loadDone().length;
    var countNode = qs("#progress-count");
    var barNode = qs("#progress-bar");
    var badgeNode = qs("#badge-strip");
    var encouragement = qs("#progress-encouragement");
    var certificate = qs("#certificate");
    if (countNode) countNode.textContent = String(count);
    if (barNode) barNode.style.transform = "scaleX(" + (count / Math.max(lessons.length, 1)) + ")";
    if (badgeNode) {
      badgeNode.innerHTML = BADGES.map(function (badge) {
        var unlocked = count >= badge.threshold;
        return '<div class="badge-item ' + (unlocked ? "unlocked" : "locked") + '" style="--badge-color:' + badge.color + '">' +
          '<span class="badge-mark" aria-hidden="true">' + badge.mark + '</span>' +
          '<div><strong>' + escapeHTML(badge.name) + '</strong><small>' +
          (unlocked ? "已解锁" : "完成" + badge.threshold + "课解锁") + '</small></div></div>';
      }).join("");
    }
    if (encouragement) {
      var nextBadge = BADGES.filter(function (badge) { return count < badge.threshold; })[0];
      if (count >= lessons.length) encouragement.textContent = "全部完成，你已经是传统美学小博士。";
      else if (!nextBadge) encouragement.textContent = "继续复习，保持你的观察力。";
      else encouragement.textContent = "再完成 " + (nextBadge.threshold - count) + " 课，就能解锁“" + nextBadge.name + "”。";
    }
    if (certificate) certificate.hidden = count < lessons.length;
    qa(".lesson-card").forEach(function (card) {
      var index = Number(card.dataset.index);
      card.classList.toggle("is-done", isDone(index));
      var mark = qs(".card-done", card);
      if (mark) mark.textContent = isDone(index) ? "已完成" : "未完成";
    });
  }

  function celebrate() {
    if (qs("#celebration")) return;
    var overlay = document.createElement("div");
    overlay.id = "celebration";
    overlay.className = "celebration";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-labelledby", "celebration-title");
    overlay.innerHTML = '<div class="celebration-card"><span class="celebration-mark" aria-hidden="true">博</span>' +
      '<h2 id="celebration-title">10课全部完成</h2><p>你解锁了“传统美学小博士”。</p>' +
      '<div class="celebration-actions"><button class="btn btn-primary" type="button" data-action="certificate">查看证书</button>' +
      '<button class="btn btn-secondary" type="button" data-action="close">关闭</button></div></div>';
    document.body.appendChild(overlay);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      var colors = ["#F2CC8F", "#81B29A", "#E07A5F", "#A8B5C9"];
      for (var i = 0; i < 24; i += 1) {
        var piece = document.createElement("span");
        piece.className = "confetti";
        piece.style.left = (Math.random() * 100) + "%";
        piece.style.animationDelay = (Math.random() * 0.8) + "s";
        piece.style.background = colors[i % colors.length];
        overlay.appendChild(piece);
      }
    }
    overlay.addEventListener("click", function (event) {
      if (event.target === overlay || event.target.dataset.action === "close") overlay.remove();
      if (event.target.dataset.action === "certificate") {
        overlay.remove();
        showCertificate();
      }
    });
    document.addEventListener("keydown", function onEscape(event) {
      if (event.key !== "Escape") return;
      overlay.remove();
      document.removeEventListener("keydown", onEscape);
    });
    var focusTarget = qs("[data-action='certificate']", overlay);
    if (focusTarget) focusTarget.focus();
  }

  function showCertificate() {
    var certificate = qs("#certificate");
    if (!certificate) {
      var target = document.body.dataset.page === "lesson" ? "../index.html#certificate" : "index.html#certificate";
      window.location.href = target;
      return;
    }
    certificate.hidden = false;
    if (typeof renderCertPreview === "function") renderCertPreview();
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    certificate.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  }

  // === 结业证书 ===

  function getCertName() {
    var saved = localStorage.getItem("little-aesthetics-name");
    return saved || "小小美学家";
  }

  function saveCertName(name) {
    if (name && name.trim()) {
      localStorage.setItem("little-aesthetics-name", name.trim());
    } else {
      localStorage.removeItem("little-aesthetics-name");
    }
  }

  function getCertNumber() {
    var saved = localStorage.getItem("little-aesthetics-cert-no");
    if (saved) return saved;
    var num = "MXJ-" + new Date().getFullYear() + "-" +
      Math.floor(1000 + Math.random() * 9000);
    localStorage.setItem("little-aesthetics-cert-no", num);
    return num;
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function drawCornerPattern(ctx, x, y, size, color, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineCap = "butt";
    ctx.lineJoin = "miter";

    var pad = 4;

    // 外层L形线
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(pad, size - pad);
    ctx.lineTo(pad, pad);
    ctx.lineTo(size - pad, pad);
    ctx.stroke();

    // 内层L形线
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(pad + 9, size - pad - 9);
    ctx.lineTo(pad + 9, pad + 9);
    ctx.lineTo(size - pad - 9, pad + 9);
    ctx.stroke();

    // 沿水平边的小菱形
    var ds = 4;
    var spacing = 10;
    var count = Math.floor((size - pad * 2 - 20) / spacing);
    for (var i = 0; i < count; i++) {
      var dx = pad + 14 + i * spacing;
      var dy = pad + 4.5;
      ctx.beginPath();
      ctx.moveTo(dx, dy - ds);
      ctx.lineTo(dx + ds, dy);
      ctx.lineTo(dx, dy + ds);
      ctx.lineTo(dx - ds, dy);
      ctx.closePath();
      ctx.fill();
    }

    // 沿垂直边的小菱形
    for (var j = 0; j < count; j++) {
      var dx2 = pad + 4.5;
      var dy2 = pad + 14 + j * spacing;
      ctx.beginPath();
      ctx.moveTo(dx2, dy2 - ds);
      ctx.lineTo(dx2 + ds, dy2);
      ctx.lineTo(dx2, dy2 + ds);
      ctx.lineTo(dx2 - ds, dy2);
      ctx.closePath();
      ctx.fill();
    }

    // 角落如意云头
    var cx = pad + 5;
    var cy = pad + 5;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx + 5, cy, 5, Math.PI, Math.PI * 1.5);
    ctx.arc(cx + 5, cy + 5, 5, Math.PI * 1.5, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + 5, cy + 2.5, 1.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawSeal(ctx, x, y, radius) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-0.08);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "#B83A2D";
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, radius - 8, 0, Math.PI * 2);
    ctx.strokeStyle = "#B83A2D";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#B83A2D";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "700 " + Math.floor(radius * 0.52) + "px 'Microsoft YaHei', 'PingFang SC', sans-serif";
    ctx.fillText("美识集", 0, 2);
    ctx.restore();
  }

  function drawCertificate(canvas, name) {
    var ctx = canvas.getContext("2d");
    if (!ctx) return false;

    var W = canvas.width;
    var H = canvas.height;
    var ink = "#414C39";
    var inkSoft = "#6B5D4F";
    var clay = "#C7A19B";
    var paper = "#F7F2E8";
    var red = "#B83A2D";

    // 1. 背景
    ctx.fillStyle = paper;
    ctx.fillRect(0, 0, W, H);

    // 2. 宣纸纹理
    ctx.fillStyle = "rgba(65, 76, 57, 0.018)";
    for (var i = 0; i < 600; i++) {
      ctx.fillRect(Math.random() * W, Math.random() * H, 1.5, 1.5);
    }

    // 3. 双层边框
    ctx.strokeStyle = ink;
    ctx.lineWidth = 12;
    ctx.strokeRect(42, 42, W - 84, H - 84);
    ctx.strokeStyle = clay;
    ctx.lineWidth = 3;
    ctx.strokeRect(68, 68, W - 136, H - 136);

    // 4. 四角回纹
    var cornerColor = "rgba(65, 76, 57, 0.3)";
    drawCornerPattern(ctx, 85, 85, 70, cornerColor, 0);
    drawCornerPattern(ctx, W - 85, 85, 70, cornerColor, Math.PI / 2);
    drawCornerPattern(ctx, W - 85, H - 85, 70, cornerColor, Math.PI);
    drawCornerPattern(ctx, 85, H - 85, 70, cornerColor, -Math.PI / 2);

    // 5. 品牌名
    ctx.textAlign = "center";
    ctx.fillStyle = inkSoft;
    ctx.font = "400 30px 'Microsoft YaHei', 'PingFang SC', sans-serif";
    ctx.fillText("美识集 · 小小美育课", W / 2, 145);

    // 装饰线+菱形
    ctx.strokeStyle = clay;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 130, 166);
    ctx.lineTo(W / 2 - 14, 166);
    ctx.moveTo(W / 2 + 14, 166);
    ctx.lineTo(W / 2 + 130, 166);
    ctx.stroke();
    ctx.fillStyle = clay;
    ctx.beginPath();
    ctx.moveTo(W / 2, 158);
    ctx.lineTo(W / 2 + 9, 166);
    ctx.lineTo(W / 2, 174);
    ctx.lineTo(W / 2 - 9, 166);
    ctx.closePath();
    ctx.fill();

    // 6. 主标题
    ctx.fillStyle = ink;
    ctx.font = "700 86px 'Microsoft YaHei', 'PingFang SC', sans-serif";
    ctx.fillText("结 业 证 书", W / 2, 252);

    // 英文
    ctx.fillStyle = clay;
    ctx.font = "400 20px Georgia, serif";
    ctx.fillText("C E R T I F I C A T E", W / 2, 294);

    // 7. 证书编号
    ctx.textAlign = "left";
    ctx.fillStyle = inkSoft;
    ctx.font = "400 22px 'Microsoft YaHei', 'PingFang SC', sans-serif";
    ctx.fillText("证书编号：" + getCertNumber(), 130, 348);

    // 8. 兹证明
    ctx.textAlign = "center";
    ctx.fillStyle = ink;
    ctx.font = "400 30px 'Microsoft YaHei', 'PingFang SC', sans-serif";
    ctx.fillText("兹 证 明", W / 2, 412);

    // 9. 昵称
    ctx.fillStyle = ink;
    ctx.font = "700 74px 'Microsoft YaHei', 'PingFang SC', sans-serif";
    ctx.fillText(name, W / 2, 500);
    var nameWidth = ctx.measureText(name).width;
    var lineWidth = Math.min(nameWidth + 80, 520);
    ctx.strokeStyle = clay;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(W / 2 - lineWidth / 2, 528);
    ctx.lineTo(W / 2 + lineWidth / 2, 528);
    ctx.stroke();

    // 10. 证明正文
    ctx.textAlign = "center";
    ctx.fillStyle = ink;
    ctx.font = "400 26px 'Microsoft YaHei', 'PingFang SC', sans-serif";
    var bodyLines = [
      "完成了「传统美学的10个秘密」全部课程，",
      "系统学习了颜色、花纹、建筑、绘画、书法、",
      "陶瓷、服饰、园林、节日、石窟十大主题，"
    ];
    bodyLines.forEach(function (line, idx) {
      ctx.fillText(line, W / 2, 588 + idx * 42);
    });

    // 荣誉称号
    ctx.fillStyle = red;
    ctx.font = "700 30px 'Microsoft YaHei', 'PingFang SC', sans-serif";
    ctx.fillText("特授予「传统美学小博士」荣誉称号。", W / 2, 730);

    // 11. 四个数据卡片
    var cardY = 788;
    var cardW = 220;
    var cardH = 92;
    var cardGap = 28;
    var totalW = cardW * 4 + cardGap * 3;
    var startX = (W - totalW) / 2;
    var stats = [
      { num: "10", label: "节课完整学习" },
      { num: "30", label: "个知识点掌握" },
      { num: "10", label: "个互动游戏" },
      { num: "10", label: "句好记口诀" }
    ];
    stats.forEach(function (stat, idx) {
      var x = startX + idx * (cardW + cardGap);
      ctx.fillStyle = "rgba(199, 161, 155, 0.12)";
      roundRect(ctx, x, cardY, cardW, cardH, 12);
      ctx.fill();
      ctx.strokeStyle = "rgba(199, 161, 155, 0.45)";
      ctx.lineWidth = 1.5;
      roundRect(ctx, x, cardY, cardW, cardH, 12);
      ctx.stroke();
      ctx.fillStyle = ink;
      ctx.font = "700 38px 'Microsoft YaHei', 'PingFang SC', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(stat.num, x + cardW / 2, cardY + 44);
      ctx.fillStyle = inkSoft;
      ctx.font = "400 16px 'Microsoft YaHei', 'PingFang SC', sans-serif";
      ctx.fillText(stat.label, x + cardW / 2, cardY + 70);
    });

    // 12. 课程亮点
    ctx.textAlign = "left";
    ctx.fillStyle = inkSoft;
    ctx.font = "400 20px 'Microsoft YaHei', 'PingFang SC', sans-serif";
    var highlights = [
      "✓ 内容参考故宫博物院、敦煌研究院、UNESCO等公开权威资料",
      "✓ 严格区分史实与民间传说，不杜撰、不歪曲",
      "✓ 每课配套互动游戏和动手练习，边玩边学"
    ];
    highlights.forEach(function (h, idx) {
      ctx.fillText(h, 160, 920 + idx * 32);
    });

    // 13. 印章
    drawSeal(ctx, W - 230, H - 185, 56);

    // 14. 日期
    ctx.textAlign = "right";
    ctx.fillStyle = ink;
    ctx.font = "400 24px 'Microsoft YaHei', 'PingFang SC', sans-serif";
    var dateStr = new Intl.DateTimeFormat("zh-CN", {
      year: "numeric", month: "long", day: "numeric"
    }).format(new Date());
    ctx.fillText("颁发日期：" + dateStr, W - 130, H - 132);

    // 15. 底部品牌语
    ctx.textAlign = "center";
    ctx.fillStyle = inkSoft;
    ctx.font = "400 20px 'Microsoft YaHei', 'PingFang SC', sans-serif";
    ctx.fillText("美识集 · 把传统美学，变成小朋友听得懂的语言", W / 2, H - 92);

    return true;
  }

  function downloadCertificate() {
    var name = getCertName();
    var canvas = document.createElement("canvas");
    canvas.width = 1600;
    canvas.height = 1131;

    if (!drawCertificate(canvas, name)) {
      toast("这个浏览器暂时不能生成证书");
      return;
    }

    canvas.toBlob(function (blob) {
      if (!blob) {
        toast("证书生成失败");
        return;
      }
      var url = URL.createObjectURL(blob);
      var link = document.createElement("a");
      link.href = url;
      link.download = "小小美育课结业证书_" + name + ".png";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(function () { URL.revokeObjectURL(url); }, 1200);
      toast("证书已生成");
    }, "image/png");
  }

  function renderCertPreview() {
    var preview = document.getElementById("cert-preview");
    if (!preview) return;
    preview.innerHTML = "";
    var canvas = document.createElement("canvas");
    canvas.width = 1600;
    canvas.height = 1131;
    drawCertificate(canvas, getCertName());
    preview.appendChild(canvas);
  }

  function initCertificate() {
    var button = document.getElementById("download-certificate");
    if (button) button.addEventListener("click", downloadCertificate);

    var nameInput = document.getElementById("cert-name");
    if (nameInput) {
      var saved = getCertName();
      nameInput.value = saved === "小小美学家" ? "" : saved;
      nameInput.addEventListener("input", function () {
        saveCertName(nameInput.value);
        renderCertPreview();
      });
    }

    var certSection = document.getElementById("certificate");
    if (certSection && !certSection.hidden) {
      renderCertPreview();
    }
  }

  function renderIndex() {
    var artNode = qs("#home-art");
    if (artNode) {
      var heroArt = art.get("home-cluster", "十个课程主题组成的原创插画");
      if (heroArt) {
        artNode.innerHTML = heroArt;
        artNode.classList.add("has-art");
      }
    }
    var grid = qs("#lesson-grid");
    if (grid) {
      grid.innerHTML = lessons.map(function (lesson) {
        var status = lesson.index === 1
          ? '<span class="card-top-right"><span class="card-start">从这里开始</span><span class="card-done"></span></span>'
          : '<span class="card-done"></span>';
        return '<a class="lesson-card" data-index="' + lesson.index + '" href="' + lesson.slug + '/lesson.html" style="--card-accent:' + lesson.theme + ';--card-deep:' + lesson.themeDeep + '">' +
          '<span class="card-art" aria-hidden="true">' + art.get(lesson.art, lesson.title + "主题插画") + '</span>' +
          '<span class="card-body"><span class="card-top"><span class="card-index">' + String(lesson.index).padStart(2, "0") + '</span>' + status + '</span>' +
          '<strong>' + escapeHTML(lesson.title) + '</strong><span class="card-sub">' + escapeHTML(lesson.subtitle) + '</span>' +
          '<span class="card-question">“' + escapeHTML(lesson.question) + '”</span>' +
          '<span class="card-meta">' + escapeHTML(lesson.duration) + ' · ' + escapeHTML(lesson.ageGroup) + '</span></span></a>';
      }).join("");
    }
    var reset = qs("#reset-progress");
    if (reset) {
      reset.addEventListener("click", function () {
        saveDone([]);
        saveGameDone([]);
        updateProgressDisplay();
        toast("进度已清空");
      });
    }
    updateProgressDisplay();
    if (location.hash === "#certificate") window.setTimeout(showCertificate, 0);
  }

  function renderSectionImage(lesson, section) {
    var groups = window.COURSE_IMAGES || {};
    var image = groups[lesson.slug] && groups[lesson.slug][section.id];
    if (!image) return "";
    var alt = image.alt || image.title || section.title;
    return '<figure class="section-figure">' +
      '<img src="../assets/images/' + encodeURIComponent(image.file).replace(/%2F/g, "/") + '" alt="' + escapeHTML(alt) +
      '" width="' + (image.width || 1000) + '" height="' + (image.height || 750) + '" loading="lazy" decoding="async">' +
      '<figcaption><strong>' + escapeHTML(image.title) + '</strong><span>' + escapeHTML(image.caption) + '</span>' +
      '<small><span>' + escapeHTML(image.credit) + '</span><span>' + escapeHTML(image.license) +
      '</span><a href="' + image.sourceUrl + '" target="_blank" rel="noopener">查看原图来源</a></small></figcaption></figure>';
  }

  function renderSection(section, index, lesson) {
    var paragraphs = (section.paragraphs || []).map(function (text) {
      return "<p>" + escapeHTML(text) + "</p>";
    }).join("");
    var extensionGroup = (window.COURSE_EXTENSIONS || {})[lesson.slug] || {};
    var lifeText = extensionGroup.lifeExamples && extensionGroup.lifeExamples[section.id];
    var lifeExample = lifeText
      ? '<div class="life-example"><span class="life-mark" aria-hidden="true">🌿</span><p><strong>生活里：</strong>' + escapeHTML(lifeText) + '</p></div>'
      : "";
    var figure = renderSectionImage(lesson, section);
    var source = section.source
      ? '<div class="source-line"><span>' + escapeHTML(section.source) + '</span>' +
        (section.sourceUrl ? '<a href="' + section.sourceUrl + '" target="_blank" rel="noopener">查看公开来源</a>' :
          '<a href="#reading">查看本课延伸阅读</a>') + '</div>'
      : "";
    var insight = section.insight
      ? '<div class="insight-box"><span class="box-label">' + escapeHTML(section.insight.label || "关键理解") + '</span><p>' +
        escapeHTML(section.insight.text || section.insight) + '</p></div>'
      : "";
    var fact = section.fact
      ? '<div class="fact-box"><span class="box-label">' + escapeHTML(section.fact.label || "小知识") + '</span><p>' +
        escapeHTML(section.fact.text || section.fact) + '</p></div>'
      : "";
    var caution = section.caution
      ? '<p class="caution-line"><span>准确提示</span>' + escapeHTML(section.caution) + '</p>'
      : "";
    return '<section class="lesson-section" id="' + escapeHTML(section.id) + '">' +
      '<div class="section-head"><span class="section-kicker">' + escapeHTML(section.kicker) + '</span><h2>' +
      escapeHTML(section.title) + '</h2></div>' + paragraphs + lifeExample + figure + insight + fact + caution + source + '</section>';
  }

  function renderExtensions(lesson) {
    var group = (window.COURSE_EXTENSIONS || {})[lesson.slug] || {};
    if (!group.extensions || !group.extensions.length) return "";
    var iconType = EXTENSION_ICONS[lesson.slug] || "idea";
    return '<section class="lesson-section extension-section" id="extensions">' +
      '<div class="section-head"><span class="section-kicker">延伸知识</span><h2>你知道吗？</h2></div>' +
      '<p class="section-intro">这些内容不是主流程，想多知道一点时可以展开看看。</p>' +
      '<div class="extension-list">' + group.extensions.map(function (item) {
        return '<details class="extension-card"><summary><span class="extension-icon" aria-hidden="true">' +
          extensionIcon(iconType) + '</span><span class="extension-title">' + escapeHTML(item.title) +
          '</span><span class="extension-action" aria-hidden="true"></span></summary><div class="extension-body">' +
          (item.paragraphs || []).map(function (text) { return '<p>' + escapeHTML(text) + '</p>'; }).join("") +
          (item.fact ? '<div class="extension-fact"><strong>小事实</strong><p>' + escapeHTML(item.fact) + '</p></div>' : "") +
          (item.source ? '<div class="source-line"><span>' + escapeHTML(item.source) + '</span>' +
            (item.sourceUrl ? '<a href="' + item.sourceUrl + '" target="_blank" rel="noopener">查看公开来源</a>' : "") +
            '</div>' : "") +
          '</div></details>';
      }).join("") + '</div></section>';
  }

  function renderConnections(lesson) {
    var group = (window.COURSE_EXTENSIONS || {})[lesson.slug] || {};
    if (!group.connections || !group.connections.length) return "";
    return '<section class="connection-section" id="connections" aria-label="跨课关联">' +
      '<strong>这节课和其他课的关系</strong><div class="connection-list">' +
      group.connections.map(function (item) {
        var target = lessons.filter(function (candidate) { return candidate.index === item.lesson; })[0];
        var href = target ? "../" + target.slug + "/lesson.html" : "../index.html#course-map";
        return '<a class="connection-item" href="' + href + '"><span class="connection-badge">第' + item.lesson +
          '课</span><span class="connection-topic">' + escapeHTML(item.topic) + '</span><span class="connection-note">' +
          escapeHTML(item.note) + '</span></a>';
      }).join("") + '</div></section>';
  }

  function renderMiniExperiment(lesson) {
    var group = (window.COURSE_EXTENSIONS || {})[lesson.slug] || {};
    var experiment = group.miniExperiment;
    if (!experiment) return "";
    return '<section class="mini-experiment" id="mini-experiment" aria-label="1分钟小实验">' +
      '<div class="mini-head"><span class="mini-badge">1分钟小实验</span><h2>' + escapeHTML(experiment.title) + '</h2></div>' +
      '<ol class="mini-steps">' + (experiment.steps || []).map(function (step) {
        return '<li>' + escapeHTML(step) + '</li>';
      }).join("") + '</ol></section>';
  }

  function renderQuiz(quiz) {
    return quiz.map(function (item, index) {
      var options = item.options.map(function (option, optionIndex) {
        return '<label class="quiz-option"><input type="radio" name="quiz-' + index + '" value="' + optionIndex +
          '"><span>' + escapeHTML(option) + '</span></label>';
      }).join("");
      return '<article class="quiz-item" data-correct="' + item.correct + '" data-explanation="' +
        escapeHTML(item.explanation) + '"><h3>' + (index + 1) + '. ' + escapeHTML(item.question) + '</h3>' +
        '<div class="quiz-options">' + options + '</div>' +
        '<button class="btn btn-secondary quiz-check" type="button">检查答案</button>' +
        '<div class="quiz-result" aria-live="polite"></div></article>';
    }).join("");
  }

  function renderExercise(exercise) {
    var steps = (exercise.steps || []).map(function (step) {
      return "<li>" + escapeHTML(step) + "</li>";
    }).join("");
    return '<article class="exercise-card"><h3>' + escapeHTML(exercise.title) + '</h3>' +
      '<p class="exercise-prompt">' + escapeHTML(exercise.prompt) + '</p><ol class="number-list">' + steps + '</ol>' +
      '<button class="hint-toggle" type="button" aria-expanded="false">查看思路</button>' +
      '<div class="hint-content"><p>' + escapeHTML(exercise.hint) + '</p></div></article>';
  }

  function renderSources(sources) {
    return sources.map(function (source) {
      return '<article class="reading-item"><a href="' + source.url + '" target="_blank" rel="noopener">' +
        escapeHTML(source.title) + '</a><div class="reading-meta">' + escapeHTML(source.source) +
        '</div><p class="reading-desc">' + escapeHTML(source.desc) + '</p></article>';
    }).join("");
  }

  function renderLessonNav(lesson) {
    var previous = lessons.filter(function (item) { return item.index === lesson.index - 1; })[0];
    var next = lessons.filter(function (item) { return item.index === lesson.index + 1; })[0];
    return '<nav class="lesson-nav" aria-label="课时翻页">' +
      (previous ? '<a class="btn btn-secondary" href="../' + previous.slug + '/lesson.html">上一课：' + escapeHTML(previous.title) + '</a>' :
        '<span class="btn btn-secondary disabled">这是第一课</span>') +
      '<button class="btn btn-primary done-toggle" type="button" data-done="' + lesson.index + '">标记为已完成</button>' +
      (next ? '<a class="btn btn-secondary" href="../' + next.slug + '/lesson.html">下一课：' + escapeHTML(next.title) + '</a>' :
        '<span class="btn btn-secondary disabled">课程完结</span>') + '</nav>';
  }

  function routeItems(lesson) {
    var extensionGroup = (window.COURSE_EXTENSIONS || {})[lesson.slug] || {};
    var items = [{ id: "story", label: "导入" }].concat(
      lesson.sections.map(function (section, index) {
        return { id: section.id, label: "知识点 " + (index + 1) };
      })
    );
    if (extensionGroup.extensions && extensionGroup.extensions.length) {
      items.push({ id: "extensions", label: "延伸知识" });
    }
    items.push({ id: "interactive", label: "动手" });
    if (extensionGroup.miniExperiment) {
      items.push({ id: "mini-experiment", label: "小实验" });
    }
    if (extensionGroup.connections && extensionGroup.connections.length) {
      items.push({ id: "connections", label: "跨课关联" });
    }
    items.push({ id: "mantra", label: "口诀" }, { id: "quiz", label: "检测" }, { id: "exercise", label: "练习" });
    return items;
  }

  function renderLesson(lesson) {
    currentLessonSlug = lesson.slug;
    var title = lesson.title + " | " + data.meta.name;
    document.title = title;
    setMeta("og:title", title);
    setMeta("og:description", lesson.summary);
    setMeta("og:image", "../assets/share-cover.png");
    setMeta("og:type", "article");
    setMetaName("twitter:title", title);
    setMetaName("twitter:description", lesson.summary);
    setMetaName("twitter:image", "../assets/share-cover.png");
    var description = qs('meta[name="description"]');
    if (description) description.setAttribute("content", lesson.summary);
    var root = document.documentElement;
    root.style.setProperty("--accent", lesson.theme);
    root.style.setProperty("--accent-deep", lesson.themeDeep);
    root.style.setProperty("--accent-soft", lesson.theme + "33");

    qs("#lesson-number").textContent = "第 " + lesson.index + " 课";
    qs("#lesson-title").textContent = lesson.title;
    qs("#lesson-subtitle").textContent = lesson.subtitle;
    qs("#lesson-summary").textContent = lesson.summary;
    var artNode = qs("#lesson-art");
    if (artNode) artNode.innerHTML = art.get(lesson.art, lesson.title + "主题插画");
    qs("#lesson-meta").innerHTML =
      '<div><dt>时长</dt><dd>' + escapeHTML(lesson.duration) + '</dd></div>' +
      '<div><dt>适合</dt><dd>' + escapeHTML(lesson.ageGroup) + '</dd></div>' +
      '<div><dt>知识点</dt><dd>3 个</dd></div>' +
      '<div><dt>互动</dt><dd>1 个动手</dd></div>';

    var items = routeItems(lesson);
    qs("#lesson-route").innerHTML = items.map(function (item, index) {
      return '<a href="#' + item.id + '" data-route="' + item.id + '"' + (index === 0 ? ' class="active" aria-current="true"' : "") +
        '><span>' + String(index + 1).padStart(2, "0") + '</span>' + escapeHTML(item.label) + '</a>';
    }).join("");

    qs("#lesson-toc").innerHTML = '<h2>本课目录</h2><ol>' +
      items.map(function (item) {
        return '<li><a href="#' + item.id + '">' + escapeHTML(item.label) + '</a></li>';
      }).join("") + '<li><a href="#reading">延伸阅读</a></li></ol>';

    var reviewLabel = lesson.index === 1 ? "从这里开始" : "快速回顾";
    var reviewMarkup = lesson.review
      ? '<section class="review-card" aria-label="' + reviewLabel + '"><strong>' + reviewLabel + '</strong><p>' + escapeHTML(lesson.review) + '</p></section>'
      : "";
    var body = qs("#lesson-body");
    body.innerHTML =
      reviewMarkup +
      '<section class="lesson-section" id="story"><div class="section-head"><span class="section-kicker">导入</span><h2>' +
      escapeHTML(lesson.story.label) + '</h2></div><div class="story-card"><p>' + escapeHTML(lesson.story.text) + '</p></div></section>' +
      lesson.sections.map(function (section, index) { return renderSection(section, index, lesson); }).join("") +
      renderExtensions(lesson) +
      '<section class="lesson-section" id="interactive"><div class="section-head"><span class="section-kicker">动手时间</span><h2>一起玩一玩</h2></div>' +
      '<div class="interactive-panel" id="lesson-interactive"></div></section>' +
      renderMiniExperiment(lesson) +
      renderConnections(lesson) +
      '<section class="lesson-section" id="mantra"><div class="section-head"><span class="section-kicker">记住口诀</span><h2>一起念一遍</h2></div>' +
      '<div class="mantra-card"><p>' + escapeHTML(lesson.mantra.text) + '</p><span>' + escapeHTML(lesson.mantra.note) + '</span>' +
      '<button class="btn btn-secondary" type="button" data-speak="' + escapeHTML(lesson.mantra.text) + '">听一听</button></div></section>' +
      '<section class="lesson-section" id="quiz"><div class="section-head"><span class="section-kicker">知识检测</span><h2>三道小题</h2></div>' +
      '<div class="quiz-list">' + renderQuiz(lesson.quiz) + '</div></section>' +
      '<section class="lesson-section" id="exercise"><div class="section-head"><span class="section-kicker">动手练习</span><h2>轮到你创作</h2></div>' +
      '<div class="settings-bar"><button class="toggle-pill" id="exercise-toggle" type="button" aria-expanded="true" aria-controls="exercise-body">配套练习：显示中</button></div>' +
      '<div id="exercise-body">' + renderExercise(lesson.exercise) + '</div></section>' +
      '<section class="lesson-section" id="reading"><div class="section-head"><span class="section-kicker">延伸阅读</span><h2>想继续看</h2></div>' +
      '<div class="reading-list">' + renderSources(lesson.sources) + '</div></section>' +
      renderLessonNav(lesson);

    renderInteractive(lesson.interactive, qs("#lesson-interactive"));
    initQuiz();
    initExercise();
    initExerciseToggle();
    initSpeech();
    initDoneButton(lesson);
    initRouteObserver(items);
    initSelectionTools(lesson);
  }

  function panelHeader(config) {
    return '<div class="interactive-head"><h3>' + escapeHTML(config.title) + '</h3><p>' +
      escapeHTML(config.description) + '</p></div>';
  }

  function renderInteractive(config, container) {
    if (!container || !config) return;
    var renderers = {
      colorFind: renderColorFind,
      patternMatch: renderPatternMatch,
      dougongBuild: renderDougongBuild,
      whiteSpace: renderWhiteSpace,
      scriptName: renderScriptName,
      vaseColor: renderVaseColor,
      costumeStudio: renderCostumeStudio,
      gardenFrames: renderGardenFrames,
      festivalColor: renderFestivalColor,
      grottoObserver: renderGrottoObserver
    };
    (renderers[config.type] || function (c, box) { box.innerHTML = panelHeader(c); })(config, container);
    appendGameStatus(container);
    appendGameTools(container, config);
    appendInteractiveNext(container);
  }

  function appendGameStatus(container) {
    if (!container || qs(".game-status", container)) return;
    var status = document.createElement("div");
    status.className = "game-status";
    container.appendChild(status);
    updateGameStatus(container);
  }

  function updateGameStatus(container) {
    var status = qs(".game-status", container);
    if (!status) return;
    var done = isGameDone(currentLessonSlug);
    status.classList.toggle("done", done);
    status.textContent = done ? "已完成，再玩一次" : "动手玩一玩";
  }

  function appendGameTools(container, config) {
    if (!container || qs(".game-tools", container)) return;
    var hints = (config && config.hints) || ["先观察，再动手。", "想一想知识点和操作有什么关系。", "按顺序试一遍，再看反馈。"];
    var tools = document.createElement("div");
    tools.className = "game-tools";
    tools.innerHTML = '<button class="chip-btn game-tool" type="button" data-tool="hint" aria-expanded="false">提示</button>' +
      '<button class="chip-btn game-tool" type="button" data-tool="sound" aria-pressed="' +
      (isSoundOn() ? "true" : "false") + '">声音：' + (isSoundOn() ? "开" : "关") + '</button>';
    var hint = document.createElement("p");
    hint.className = "game-hint";
    hint.setAttribute("aria-live", "polite");
    hint.hidden = true;
    tools.appendChild(hint);
    var next = qs(".interactive-next", container);
    container.insertBefore(tools, next || null);
    var hintButton = qs("[data-tool='hint']", tools);
    var soundButton = qs("[data-tool='sound']", tools);
    var hintIndex = 0;
    hintButton.addEventListener("click", function () {
      if (hintIndex >= hints.length) hintIndex = 0;
      hint.hidden = false;
      hint.textContent = "提示 " + (hintIndex + 1) + "：" + hints[hintIndex];
      hintIndex += 1;
      hintButton.setAttribute("aria-expanded", "true");
      hintButton.textContent = hintIndex >= hints.length ? "再看一遍提示" : "再看一个提示";
    });
    soundButton.addEventListener("click", function () {
      var on = !isSoundOn();
      setSoundOn(on);
      soundButton.setAttribute("aria-pressed", String(on));
      soundButton.textContent = "声音：" + (on ? "开" : "关");
      if (on) playTone("click");
    });
  }

  function appendInteractiveNext(container) {
    if (!container || qs(".interactive-next", container)) return;
    var block = document.createElement("div");
    block.className = "interactive-next";
    block.innerHTML = '<p>做完这个，去检测一下。</p><button class="btn btn-secondary" type="button" data-action="go-quiz">去做题</button>';
    container.appendChild(block);
    var button = qs("[data-action='go-quiz']", block);
    if (!button) return;
    button.addEventListener("click", function () {
      var quiz = qs("#quiz");
      if (!quiz) return;
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      quiz.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      if (!reduce) {
        window.setTimeout(function () {
          quiz.scrollIntoView({ behavior: "auto", block: "start" });
        }, 800);
      }
    });
  }

  function markInteractionComplete(container, message) {
    var block = qs(".interactive-next", container);
    if (!block) return;
    if (!block.classList.contains("ready")) playTone("complete");
    block.classList.add("ready");
    var text = qs("p", block);
    if (text) text.textContent = message || "全部完成！下面来做3道小题，看看你记住了多少。";
    var button = qs("[data-action='go-quiz']", block);
    if (button) button.classList.add("btn-primary");
    markGameDone(currentLessonSlug);
    updateGameStatus(container);
  }

  function showKnowledgeCard(container, title, text) {
    if (!container || !text) return;
    var card = qs(".knowledge-card", container);
    if (!card) {
      card = document.createElement("div");
      card.className = "knowledge-card";
      card.setAttribute("aria-live", "polite");
      var next = qs(".interactive-next", container);
      container.insertBefore(card, next || null);
    }
    card.innerHTML = '<strong>' + escapeHTML(title) + '</strong><p>' + escapeHTML(text) + '</p>';
  }

  function renderColorFind(config, container) {
    var rounds = config.targets.slice();
    var pool = config.targets.concat(config.decoys || []);
    var current = 0;
    var found = [];
    container.innerHTML = panelHeader(config) +
      '<p class="game-prompt" id="color-prompt" aria-live="polite"></p>' +
      '<div class="color-grid">' + pool.map(function (item, index) {
        return '<button class="color-swatch" type="button" data-color="' + index + '" style="--swatch:' + item.color +
          '"><span class="swatch-dot" aria-hidden="true"></span><span>' + escapeHTML(item.name) + '</span></button>';
      }).join("") + '</div><div class="game-feedback" aria-live="polite">点一点，找到正确的颜色。</div>';
    function paint() {
      if (current >= rounds.length) {
        qs("#color-prompt", container).textContent = "全部找对了。你能说出它们的名字了。";
        qs(".game-feedback", container).textContent = "完成。朱砂红来自石头，天青色来自天空，靛蓝色来自植物。";
        markInteractionComplete(container, "全部找对了！下面来做3道小题，看看你记住了多少。");
        return;
      }
      qs("#color-prompt", container).textContent = "请找出：" + rounds[current].name;
    }
    paint();
    qa(".color-swatch", container).forEach(function (button) {
      button.addEventListener("click", function () {
        if (current >= rounds.length) return;
        var item = pool[Number(button.dataset.color)];
        var target = rounds[current];
        if (item.name === target.name) {
          button.classList.add("correct");
          playTone("correct");
          button.disabled = true;
          found.push(item.name);
          qs(".game-feedback", container).textContent = "找对了：" + item.name;
          showKnowledgeCard(container, "颜色来源", item.source || target.source || "");
          current += 1;
          paint();
        } else {
          button.classList.add("wrong");
          playTone("wrong");
          qs(".game-feedback", container).textContent = "再看一看，这个不是 " + target.name + "。";
          window.setTimeout(function () { button.classList.remove("wrong"); }, 500);
        }
      });
    });
  }

  function renderPatternMatch(config, container) {
    var active = null;
    var matched = [];
    container.innerHTML = panelHeader(config) +
      '<div class="pattern-game"><div class="pattern-tiles">' + config.pairs.map(function (pair) {
        return '<button class="pattern-tile" type="button" data-pattern="' + pair.id + '"><span class="pattern-shape pattern-' +
          pair.id + '" aria-hidden="true"></span></button>';
      }).join("") + '</div><div class="pattern-names">' + config.pairs.map(function (pair) {
        return '<button class="chip-btn" type="button" data-name="' + pair.id + '">' + escapeHTML(pair.name) + '</button>';
      }).join("") + '</div></div><div class="game-feedback" aria-live="polite">先点一个花纹，再点它的名字。</div>';
    qa("[data-pattern]", container).forEach(function (button) {
      button.addEventListener("click", function () {
        if (matched.indexOf(button.dataset.pattern) > -1) return;
        active = button.dataset.pattern;
        qa("[data-pattern]", container).forEach(function (item) {
          item.classList.toggle("active", item === button);
        });
        var pair = config.pairs.filter(function (item) { return item.id === active; })[0];
        if (pair) showKnowledgeCard(container, "纹样骨架", pair.structure || "");
        qs(".game-feedback", container).textContent = "已选花纹，请选择名字。";
      });
    });
    qa("[data-name]", container).forEach(function (button) {
      button.addEventListener("click", function () {
        if (!active) {
          qs(".game-feedback", container).textContent = "先点上面的花纹。";
          return;
        }
        if (active === button.dataset.name) {
          matched.push(active);
          button.classList.add("correct");
          playTone("correct");
          button.disabled = true;
          var tile = qs('[data-pattern="' + active + '"]', container);
          if (tile) { tile.classList.add("correct"); tile.disabled = true; }
          qs(".game-feedback", container).textContent = "配对成功。";
          var matchedPair = config.pairs.filter(function (pair) { return pair.id === active; })[0];
          if (matchedPair) {
            showKnowledgeCard(container, "纹样用途", matchedPair.structure + " " + matchedPair.usage);
          }
          active = null;
          if (matched.length === config.pairs.length) {
            qs(".game-feedback", container).textContent = "三组都配对成功。花纹的秘密在骨架里。";
            markInteractionComplete(container, "三组都配对成功。下面来做3道小题。");
          }
        } else {
          button.classList.add("wrong");
          playTone("wrong");
          qs(".game-feedback", container).textContent = "再想想它的线条是方还是圆。";
          window.setTimeout(function () { button.classList.remove("wrong"); }, 500);
        }
      });
    });
  }

  function renderDougongBuild(config, container) {
    var placed = [];
    var shuffled = config.order.slice().sort(function () { return Math.random() - 0.5; });
    container.innerHTML = panelHeader(config) +
      '<div class="build-stage" aria-hidden="true"><div class="build-ground"></div><div class="build-stack" id="build-stack"></div></div>' +
      '<div class="build-parts">' + shuffled.map(function (name) {
        return '<button class="chip-btn build-part" type="button" data-part="' + name + '">' + name + '</button>';
      }).join("") + '</div><div class="quake-tools"><button class="btn btn-secondary" id="quake-test" type="button" disabled>地震测试</button></div>' +
      '<div class="game-feedback" aria-live="polite">从下往上点：斗、拱、昂、枋。</div>';
    function paint() {
      qs("#build-stack", container).innerHTML = placed.map(function (name, index) {
        return '<div class="build-block build-' + index + '">' + name + '</div>';
      }).join("");
    }
    qa("[data-part]", container).forEach(function (button) {
      button.addEventListener("click", function () {
        var expected = config.order[placed.length];
        if (button.dataset.part === expected) {
          placed.push(button.dataset.part);
          button.disabled = true;
          button.classList.add("correct");
          playTone("correct");
          paint();
          if (config.parts && config.parts[button.dataset.part]) {
            showKnowledgeCard(container, "构件作用", config.parts[button.dataset.part]);
          }
          qs(".game-feedback", container).textContent = placed.length === config.order.length ?
            "斗拱搭好了。它把屋顶的重量托住了。" : "放对了，继续往上。";
          if (placed.length === config.order.length) {
            var quakeButton = qs("#quake-test", container);
            if (quakeButton) quakeButton.disabled = false;
            var stack = qs("#build-stack", container);
            if (stack && !qs(".build-roof", stack)) {
              stack.insertAdjacentHTML("beforeend", '<div class="build-roof">屋顶</div>');
            }
            qs(".game-feedback", container).textContent = "斗拱搭好了。现在可以试试地震测试。";
            markInteractionComplete(container, "斗拱搭好了！下面来做3道小题。");
          }
        } else {
          button.classList.add("wrong");
          playTone("wrong");
          qs(".game-feedback", container).textContent = "先放 " + expected + "，再放其他构件。";
          window.setTimeout(function () { button.classList.remove("wrong"); }, 500);
        }
      });
    });
    var quakeTest = qs("#quake-test", container);
    if (quakeTest) {
      quakeTest.addEventListener("click", function () {
        if (placed.length < config.order.length) return;
        var stage = qs(".build-stage", container);
        stage.classList.remove("quake");
        window.requestAnimationFrame(function () {
          stage.classList.add("quake");
          window.setTimeout(function () { stage.classList.remove("quake"); }, 1500);
        });
        showKnowledgeCard(container, "抗震小知识", "榫卯让木头可以轻微活动，地震时能分散力量，不容易散架。");
      });
    }
  }

  function renderWhiteSpace(config, container) {
    var active = {};
    container.innerHTML = panelHeader(config) +
      '<div class="blank-ratio" id="blank-ratio">当前留白比例：约85%</div>' +
      '<div class="blank-stage" id="blank-stage">' +
      '<svg viewBox="0 0 640 360" role="img" aria-label="留白实验画面"><rect width="640" height="360" fill="#FFFDF8"/>' +
      '<path d="M0 300h640" stroke="#414C39" stroke-width="4"/><path d="M0 316h640" stroke="#C7A19B" stroke-width="3" stroke-dasharray="8 14"/>' +
      '<g id="blank-boat"><path d="M128 268h112l-18 26H146z" fill="#414C39"/><path d="M184 268v-64l52 64z" fill="#C7A19B"/></g>' +
      '<g id="blank-birds"><path d="M420 92c14-14 28-14 42 0M486 118c14-14 28-14 42 0" fill="none" stroke="#414C39" stroke-width="6" stroke-linecap="round"/></g>' +
      '<g id="blank-mist"><path d="M340 210c60-28 120-28 180 0" fill="none" stroke="#A8B5C9" stroke-width="14" stroke-linecap="round" opacity="0.65"/></g>' +
      '<g id="blank-mountain"><path d="M400 300l86-128 74 128z" fill="#87968B"/></g></svg></div>' +
      '<div class="toggle-row">' + config.items.map(function (item) {
        return '<button class="chip-btn" type="button" aria-pressed="false" data-blank="' + item.id + '">' + escapeHTML(item.label) + '</button>';
      }).join("") + '</div>' +
      '<div class="blank-tools"><button class="btn btn-secondary" id="blank-compare-toggle" type="button" aria-expanded="false">并排对比</button></div>' +
      '<div class="blank-compare" id="blank-compare" hidden>' +
      '<figure class="blank-compare-item"><svg viewBox="0 0 640 360" role="img" aria-label="只有小船的留白画面"><rect width="640" height="360" fill="#FFFDF8"/><path d="M0 300h640" stroke="#414C39" stroke-width="4"/><path d="M0 316h640" stroke="#C7A19B" stroke-width="3" stroke-dasharray="8 14"/><path d="M128 268h112l-18 26H146z" fill="#414C39"/><path d="M184 268v-64l52 64z" fill="#C7A19B"/></svg><figcaption>只有小船：留白多，意境远。</figcaption></figure>' +
      '<figure class="blank-compare-item"><svg viewBox="0 0 640 360" role="img" aria-label="元素很多的画面"><rect width="640" height="360" fill="#FFFDF8"/><path d="M0 300h640" stroke="#414C39" stroke-width="4"/><path d="M0 316h640" stroke="#C7A19B" stroke-width="3" stroke-dasharray="8 14"/><path d="M128 268h112l-18 26H146z" fill="#414C39"/><path d="M184 268v-64l52 64z" fill="#C7A19B"/><path d="M420 92c14-14 28-14 42 0M486 118c14-14 28-14 42 0" fill="none" stroke="#414C39" stroke-width="6" stroke-linecap="round"/><path d="M340 210c60-28 120-28 180 0" fill="none" stroke="#A8B5C9" stroke-width="14" stroke-linecap="round" opacity="0.65"/><path d="M400 300l86-128 74 128z" fill="#87968B"/></svg><figcaption>元素很多：内容满，画面热闹。</figcaption></figure>' +
      '</div><div class="game-feedback" aria-live="polite">空白也是一种画面。加东西后，空白会变少。</div>';
    qa("[data-blank]", container).forEach(function (button) {
      button.addEventListener("click", function () {
        var id = button.dataset.blank;
        active[id] = !active[id];
        playTone("click");
        button.classList.toggle("active", active[id]);
        button.setAttribute("aria-pressed", String(Boolean(active[id])));
        var node = qs("#blank-" + id, container);
        if (node) node.style.display = active[id] ? "" : "none";
        var count = Object.keys(active).filter(function (key) { return active[key]; }).length;
        var ratio = Math.max(20, 85 - count * 15);
        qs("#blank-ratio", container).textContent = "当前留白比例：约" + ratio + "%";
        qs(".game-feedback", container).textContent = count === 0 ?
          "现在画面很空。空白可以代表水、天空和距离。" :
          "画面里的东西多了。空白变少后，观看的感觉也会变。";
        if (count > 0) markInteractionComplete(container, "画面变了。下面去做3道小题，看看你记住了多少。");
      });
    });
    var compareButton = qs("#blank-compare-toggle", container);
    var comparePanel = qs("#blank-compare", container);
    if (compareButton && comparePanel) {
      compareButton.addEventListener("click", function () {
        var open = comparePanel.hidden;
        comparePanel.hidden = !open;
        compareButton.setAttribute("aria-expanded", String(open));
        compareButton.textContent = open ? "收起对比" : "并排对比";
        if (open) markInteractionComplete(container, "你看到留白多和留白少的差别了。下面去做3道小题。");
      });
    }
    config.items.forEach(function (item) {
      var node = qs("#blank-" + item.id, container);
      if (node) node.style.display = "none";
    });
  }

  function renderScriptName(config, container) {
    var active = config.scripts[0];
    container.innerHTML = panelHeader(config) +
      '<label class="field-label" for="script-input">写下你的名字</label>' +
      '<input id="script-input" class="text-input" type="text" value="小小" autocomplete="off" spellcheck="false">' +
      '<div class="segmented" role="group" aria-label="书体切换">' + config.scripts.map(function (script, index) {
        return '<button class="segment-btn' + (index === 0 ? " active" : "") + '" type="button" aria-pressed="' + (index === 0) +
          '" data-script="' + script.id + '">' + escapeHTML(script.name) + '</button>';
      }).join("") + '</div><div class="script-preview"><span id="script-output">小小</span></div>' +
      '<div class="script-compare" aria-label="永字三体示意">' +
      '<div class="script-compare-item seal"><svg viewBox="0 0 120 140" role="img" aria-label="篆书永字示意"><text x="60" y="102" text-anchor="middle" font-size="86" fill="#414C39">永</text></svg><strong>篆书</strong><span>圆转均匀</span></div>' +
      '<div class="script-compare-item clerical"><svg viewBox="0 0 120 140" role="img" aria-label="隶书永字示意"><text x="60" y="102" text-anchor="middle" font-size="86" fill="#414C39">永</text></svg><strong>隶书</strong><span>蚕头燕尾</span></div>' +
      '<div class="script-compare-item regular"><svg viewBox="0 0 120 140" role="img" aria-label="楷书永字示意"><text x="60" y="102" text-anchor="middle" font-size="86" fill="#414C39">永</text></svg><strong>楷书</strong><span>方正清楚</span></div>' +
      '</div><p class="script-compare-note">字体示意，真实书体请参考碑帖。</p>' +
      '<div class="trace-card"><div class="trace-head"><strong>描一描：永</strong><span>用手指或鼠标沿着字形描一遍。</span></div>' +
      '<svg class="trace-svg" viewBox="0 0 200 200" role="img" aria-label="描红练习">' +
      '<text x="100" y="150" text-anchor="middle" font-size="140" fill="#EDE4D4" font-family="serif">永</text>' +
      '<path id="trace-path" fill="none" stroke="#E07A5F" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"></path>' +
      '</svg><div class="trace-actions"><button class="btn btn-secondary" id="trace-done" type="button">我描完了</button></div></div>' +
      '<div class="game-feedback" id="script-note" aria-live="polite">' + escapeHTML(active.note) + '</div>';
    function update() {
      var input = qs("#script-input", container);
      var output = qs("#script-output", container);
      output.textContent = input.value.trim() || "小小";
      output.className = active.className;
      qs("#script-note", container).textContent = active.note;
      qa("[data-script]", container).forEach(function (button) {
        var on = button.dataset.script === active.id;
        button.classList.toggle("active", on);
        button.setAttribute("aria-pressed", String(on));
      });
    }
    qs("#script-input", container).addEventListener("input", function () {
      update();
      markInteractionComplete(container, "你已经试过书体的变化。下面去做3道小题。");
    });
    qa("[data-script]", container).forEach(function (button) {
      button.addEventListener("click", function () {
        active = config.scripts.filter(function (script) { return script.id === button.dataset.script; })[0] || active;
        update();
        playTone("click");
        markInteractionComplete(container, "你已经试过书体的变化。下面去做3道小题。");
      });
    });
    update();
    var traceSvg = qs(".trace-svg", container);
    var tracePath = qs("#trace-path", container);
    var drawing = false;
    var tracePoints = [];
    function tracePoint(event) {
      var rect = traceSvg.getBoundingClientRect();
      return [
        Math.max(0, Math.min(200, (event.clientX - rect.left) / rect.width * 200)),
        Math.max(0, Math.min(200, (event.clientY - rect.top) / rect.height * 200))
      ];
    }
    function traceStart(event) {
      if (!traceSvg || !tracePath) return;
      drawing = true;
      tracePoints = [tracePoint(event)];
      tracePath.setAttribute("d", "M" + tracePoints[0][0] + " " + tracePoints[0][1]);
      try {
        if (traceSvg.setPointerCapture && event.pointerId !== undefined) traceSvg.setPointerCapture(event.pointerId);
      } catch (error) {
        // 合成指针事件没有可捕获的指针，忽略即可。
      }
      event.preventDefault();
    }
    function traceMove(event) {
      if (!drawing || !tracePath) return;
      tracePoints.push(tracePoint(event));
      tracePath.setAttribute("d", tracePoints.map(function (point, index) {
        return (index ? "L" : "M") + point[0] + " " + point[1];
      }).join(" "));
      event.preventDefault();
    }
    function traceEnd() { drawing = false; }
    if (traceSvg) {
      traceSvg.addEventListener("pointerdown", traceStart);
      traceSvg.addEventListener("pointermove", traceMove);
      traceSvg.addEventListener("pointerup", traceEnd);
      traceSvg.addEventListener("pointercancel", traceEnd);
    }
    var traceDone = qs("#trace-done", container);
    if (traceDone) {
      traceDone.addEventListener("click", function () {
        showKnowledgeCard(container, "描红完成", "你的永字写得很稳！写字也是手感练习。");
        markInteractionComplete(container, "描红完成。下面去做3道小题。");
      });
    }
  }

  function renderVaseColor(config, container) {
    var active = config.styles[0];
    container.innerHTML = panelHeader(config) +
      '<div class="vase-stage"><svg viewBox="0 0 360 360" role="img" aria-label="瓶子釉色预览">' +
      '<path id="vase-body" d="M132 42h96l-10 52c36 40 54 84 54 132 0 62-38 100-92 100s-92-38-92-100c0-48 18-92 54-132z" fill="#F2F1EA" stroke="#414C39" stroke-width="9" stroke-linejoin="round"/>' +
      '<path id="vase-line-one" d="M126 170c34 22 68 22 108 0" fill="none" stroke="#33586F" stroke-width="13" stroke-linecap="round"/>' +
      '<path id="vase-line-two" d="M118 226c42 24 84 24 124 0" fill="none" stroke="#33586F" stroke-width="13" stroke-linecap="round"/>' +
      '<path id="vase-line-three" d="M126 282c34 20 68 20 108 0" fill="none" stroke="#33586F" stroke-width="13" stroke-linecap="round"/></svg></div>' +
      '<div class="segmented" role="group" aria-label="釉色选择">' + config.styles.map(function (style, index) {
        return '<button class="segment-btn' + (index === 0 ? " active" : "") + '" type="button" aria-pressed="' + (index === 0) +
          '" data-vase="' + style.id + '">' + escapeHTML(style.name) + '</button>';
      }).join("") + '</div><div class="game-feedback" aria-live="polite">' + escapeHTML(active.note) + '</div>';
    function update() {
      qs("#vase-body", container).setAttribute("fill", active.body);
      ["#vase-line-one", "#vase-line-two", "#vase-line-three"].forEach(function (id) {
        qs(id, container).setAttribute("stroke", active.pattern);
      });
      qs(".game-feedback", container).textContent = active.note;
      showKnowledgeCard(container, "釉色知识", active.fact || active.note);
      qa("[data-vase]", container).forEach(function (button) {
        var on = button.dataset.vase === active.id;
        button.classList.toggle("active", on);
        button.setAttribute("aria-pressed", String(on));
      });
    }
    qa("[data-vase]", container).forEach(function (button) {
      button.addEventListener("click", function () {
        active = config.styles.filter(function (style) { return style.id === button.dataset.vase; })[0] || active;
        update();
        playTone("click");
        markInteractionComplete(container, "你换过釉色了。下面去做3道小题。");
      });
    });
    update();
  }

  function renderCostumeStudio(config, container) {
    var state = { collar: config.collars[0].id, sleeve: config.sleeves[0].id, belt: config.belts[0] };
    container.innerHTML = panelHeader(config) +
      '<div class="costume-stage"><svg viewBox="0 0 360 360" role="img" aria-label="传统服装搭配预览">' +
      '<path id="robe-body" d="M146 44l34 26 34-26 52 34-26 58-22-10v112h-76V126l-22 10-26-58z" fill="#E3C39D" stroke="#414C39" stroke-width="8" stroke-linejoin="round"/>' +
      '<path id="robe-collar" d="M146 44l34 26 34-26" fill="none" stroke="#FFFDF8" stroke-width="12" stroke-linejoin="round"/>' +
      '<path id="robe-lapel" d="M180 70l-34 48M180 70l34 48" fill="none" stroke="#FFFDF8" stroke-width="9" stroke-linecap="round"/>' +
      '<path id="robe-round" d="M146 68c18 28 50 28 68 0" fill="none" stroke="#FFFDF8" stroke-width="10" stroke-linecap="round"/>' +
      '<path id="robe-belt" d="M134 206h92l-8 26h-76z" fill="#A25F2B" stroke="#414C39" stroke-width="6" stroke-linejoin="round"/>' +
      '<path id="robe-sleeve-left" d="M94 122c-26 16-36 38-30 66M266 122c26 16 36 38 30 66" fill="none" stroke="#414C39" stroke-width="9" stroke-linecap="round"/></svg></div>' +
      '<div class="control-grid"><div class="control"><span>领型</span><div class="segmented">' + config.collars.map(function (item, index) {
        return '<button class="segment-btn' + (index === 0 ? " active" : "") + '" type="button" data-collar="' + item.id + '">' + item.name + '</button>';
      }).join("") + '</div></div><div class="control"><span>袖型</span><div class="segmented">' + config.sleeves.map(function (item, index) {
        return '<button class="segment-btn' + (index === 0 ? " active" : "") + '" type="button" data-sleeve="' + item.id + '">' + item.name + '</button>';
      }).join("") + '</div></div><div class="control"><span>腰带</span><div class="segmented">' + config.belts.map(function (item, index) {
        return '<button class="segment-btn' + (index === 0 ? " active" : "") + '" type="button" data-belt="' + item.id + '">' + item.name + '</button>';
      }).join("") + '</div></div></div><div class="game-feedback" aria-live="polite">领型、袖型和腰带都可以换。</div>';
    function update() {
      qs("#robe-collar", container).style.display = state.collar === "cross" ? "" : "none";
      qs("#robe-lapel", container).style.display = state.collar === "cross" ? "" : "none";
      qs("#robe-round", container).style.display = state.collar === "round" ? "" : "none";
      qs("#robe-sleeve-left", container).setAttribute("d", state.sleeve === "wide" ?
        "M94 122c-36 18-48 46-40 82M266 122c36 18 48 46 40 82" :
        "M94 122c-18 14-24 32-20 54M266 122c18 14 24 32 20 54");
      qs("#robe-belt", container).setAttribute("fill", state.belt.color);
      qa("[data-collar]", container).forEach(function (button) { button.classList.toggle("active", button.dataset.collar === state.collar); });
      qa("[data-sleeve]", container).forEach(function (button) { button.classList.toggle("active", button.dataset.sleeve === state.sleeve); });
      qa("[data-belt]", container).forEach(function (button) { button.classList.toggle("active", button.dataset.belt === state.belt.id); });
      var collarName = (config.collars.filter(function (item) { return item.id === state.collar; })[0] || {}).name || "";
      var sleeveName = (config.sleeves.filter(function (item) { return item.id === state.sleeve; })[0] || {}).name || "";
      qs(".game-feedback", container).textContent = "当前搭配：" + collarName + "，" + sleeveName + "，" + state.belt.name + "腰带。";
      var rating = "";
      if (state.collar === "cross" && state.sleeve === "wide" && state.belt.id === "red") {
        rating = "很有礼仪感，适合正式场合。";
      } else if (state.collar === "round" && state.sleeve === "narrow" && state.belt.id === "jade") {
        rating = "很利落，适合日常做事。";
      } else if (state.collar === "cross" && state.sleeve === "narrow" && state.belt.id === "ochre") {
        rating = "朴实大方，是读书人的样子。";
      } else {
        rating = "这套搭配有自己的味道。试试不同领型、袖型和腰带。";
      }
      showKnowledgeCard(container, "搭配评价", rating);
    }
    qa("[data-collar]", container).forEach(function (button) {
      button.addEventListener("click", function () {
        state.collar = button.dataset.collar;
        update();
        playTone("click");
        markInteractionComplete(container, "你改过服装搭配了。下面去做3道小题。");
      });
    });
    qa("[data-sleeve]", container).forEach(function (button) {
      button.addEventListener("click", function () {
        state.sleeve = button.dataset.sleeve;
        update();
        playTone("click");
        markInteractionComplete(container, "你改过服装搭配了。下面去做3道小题。");
      });
    });
    qa("[data-belt]", container).forEach(function (button) {
      button.addEventListener("click", function () {
        state.belt = config.belts.filter(function (item) { return item.id === button.dataset.belt; })[0] || state.belt;
        update();
        playTone("click");
        markInteractionComplete(container, "你改过服装搭配了。下面去做3道小题。");
      });
    });
    update();
  }

  function renderGardenFrames(config, container) {
    var active = config.frames[0];
    container.innerHTML = panelHeader(config) +
      '<div class="garden-stage"><svg viewBox="0 0 640 360" role="img" aria-label="园林框景示意">' +
      '<rect width="640" height="360" fill="#DCE7D8"/>' +
      '<path d="M0 300c120-60 240-60 360 0s240 60 360 0v60H0z" fill="#95B88A"/>' +
      '<path d="M420 88l40-30 40 30v58h-80z" fill="#C7A19B" stroke="#414C39" stroke-width="7"/><path d="M448 58h24M444 74h32M440 90h40" stroke="#414C39" stroke-width="5"/>' +
      '<circle id="frame-moon" cx="172" cy="176" r="86" fill="none" stroke="#414C39" stroke-width="16"/>' +
      '<rect id="frame-window" x="300" y="122" width="132" height="112" rx="12" fill="none" stroke="#414C39" stroke-width="14"/>' +
      '<path id="frame-corridor" d="M452 196h150v96H452z" fill="none" stroke="#414C39" stroke-width="14"/>' +
      '<g id="garden-moon"><path d="M120 240l52-90 52 90z" fill="#7E9C79"/><circle cx="172" cy="112" r="16" fill="#F2CC8F"/></g>' +
      '<g id="garden-window"><path d="M316 220l42-58 42 58z" fill="#7E9C79"/><path d="M328 238c18-14 36-14 54 0" fill="none" stroke="#414C39" stroke-width="5"/></g>' +
      '<g id="garden-corridor"><path d="M470 250h100v-18H470z" fill="#B8A8A0"/><path d="M490 232v-42M550 232v-42" stroke="#414C39" stroke-width="6"/></g>' +
      '</svg></div><div class="segmented" role="group" aria-label="取景位置">' + config.frames.map(function (frame, index) {
        return '<button class="segment-btn' + (index === 0 ? " active" : "") + '" type="button" data-frame="' + frame.id + '">' + frame.name + '</button>';
      }).join("") + '</div><div class="game-feedback" aria-live="polite"></div>';
    function update() {
      qs(".game-feedback", container).textContent = active.name + "框住了" + active.holds + "。" + active.note;
      ["frame-moon", "frame-window", "frame-corridor"].forEach(function (id) {
        var element = qs("#" + id, container);
        if (element) element.classList.toggle("highlight", id === "frame-" + active.id);
      });
      qa("[data-frame]", container).forEach(function (button) {
        button.classList.toggle("active", button.dataset.frame === active.id);
      });
    }
    qa("[data-frame]", container).forEach(function (button) {
      button.addEventListener("click", function () {
        active = config.frames.filter(function (frame) { return frame.id === button.dataset.frame; })[0] || active;
        update();
        playTone("click");
        markInteractionComplete(container, "你看过不同框景了。下面去做3道小题。");
      });
    });
    update();
  }

  function renderFestivalColor(config, container) {
    var festival = config.festivals[0];
    container.innerHTML = panelHeader(config) +
      '<div class="segmented" role="group" aria-label="节日选择">' + config.festivals.map(function (item, index) {
        return '<button class="segment-btn' + (index === 0 ? " active" : "") + '" type="button" data-festival="' + item.id + '">' + item.name + '</button>';
      }).join("") + '</div><div class="festival-stage"><div class="festival-scene" id="festival-scene">' +
      '<span class="festival-symbol" id="festival-symbol">灯</span><strong id="festival-name">春节</strong></div></div>' +
      '<div class="color-choice">' + config.colors.map(function (item) {
        return '<button class="chip-btn color-choice-btn" type="button" data-answer="' + item.color + '" style="--choice:' + item.color + '">' +
          '<span class="choice-dot"></span>' + item.name + '</button>';
      }).join("") + '</div><div class="festival-items" id="festival-items" aria-live="polite"></div>' +
      '<div class="game-feedback" aria-live="polite">选一个节日，再选颜色。</div>';
    var solved = false;
    function symbols() {
      return { spring: "灯", dragon: "粽", moon: "月" };
    }
    function update() {
      qs("#festival-name", container).textContent = festival.name;
      qs("#festival-symbol", container).textContent = symbols()[festival.id];
      qs("#festival-scene", container).style.setProperty("--festival-color", festival.id === "spring" ? "#E14B3B" : festival.id === "dragon" ? "#6F9B63" : "#D6A22C");
      var itemsNode = qs("#festival-items", container);
      if (itemsNode) {
        itemsNode.innerHTML = solved && festival.items
          ? festival.items.map(function (item) { return '<span class="festival-item">' + escapeHTML(item) + '</span>'; }).join("")
          : '<span class="festival-item muted">选对颜色后，看看这个节日的物品。</span>';
      }
      qa("[data-festival]", container).forEach(function (button) {
        button.classList.toggle("active", button.dataset.festival === festival.id);
      });
    }
    qa("[data-festival]", container).forEach(function (button) {
      button.addEventListener("click", function () {
        festival = config.festivals.filter(function (item) { return item.id === button.dataset.festival; })[0] || festival;
        solved = false;
        update();
      });
    });
    qa("[data-answer]", container).forEach(function (button) {
      button.addEventListener("click", function () {
        if (button.dataset.answer === festival.answer) {
          button.classList.add("correct");
          playTone("correct");
          solved = true;
          update();
          qs(".game-feedback", container).textContent = "答对了。" + festival.hint;
          markInteractionComplete(container, "节日配色答对了。下面去做3道小题。");
        } else {
          button.classList.add("wrong");
          playTone("wrong");
          qs(".game-feedback", container).textContent = "这个颜色更像另一种节日。再试试。";
          window.setTimeout(function () { button.classList.remove("wrong"); }, 500);
        }
      });
    });
    update();
  }

  function renderGrottoObserver(config, container) {
    var active = config.caves[0];
    container.innerHTML = panelHeader(config) +
      '<p class="grotto-scope">前三个是本课重点，麦积山是额外了解。</p>' +
      '<div class="grotto-layout"><div class="segmented grotto-tabs" role="group" aria-label="石窟选择">' +
      config.caves.map(function (cave, index) {
        return '<button class="segment-btn' + (index === 0 ? " active" : "") + '" type="button" data-cave="' + cave.id + '">' +
          cave.name + (cave.extra ? '<small>额外</small>' : '') + '</button>';
      }).join("") + '</div><div class="grotto-stage" id="grotto-stage"><div class="grotto-cliff"></div><div class="grotto-figure">' +
      '<span class="grotto-head"></span><span class="grotto-body"></span><span class="grotto-smile"></span></div>' +
      '<div class="grotto-painted" aria-hidden="true"></div></div>' +
      '<label class="grotto-restore" for="restore-slider">色彩复原：<span id="restore-label">现在</span></label>' +
      '<input id="restore-slider" class="restore-slider" type="range" min="0" max="100" value="0" aria-label="石窟色彩复原对比">' +
      '<div class="grotto-info"><h4 id="grotto-name"></h4><dl><div><dt>材料</dt><dd id="grotto-material"></dd></div><div><dt>观察重点</dt><dd id="grotto-look"></dd></div></dl>' +
      '<div class="grotto-observe"><strong>细节观察</strong><ul id="grotto-observe-list"></ul></div></div></div>' +
      '<div class="game-feedback" aria-live="polite">切换石窟，看看材料、颜色和表情怎样变化。</div>';
    function applyRestore() {
      var slider = qs("#restore-slider", container);
      var painted = qs(".grotto-painted", container);
      var label = qs("#restore-label", container);
      if (!slider || !painted) return;
      var value = Number(slider.value);
      painted.style.opacity = String(value / 100);
      if (label) label.textContent = value < 20 ? "现在" : value > 80 ? "原本" : "复原 " + value + "%";
      if (value > 0) {
        showKnowledgeCard(container, "色彩复原示意", "石窟原本可能有彩绘，颜色会随时间脱落。这里用示意色帮助理解，不是文物测色结果。");
      }
    }
    function update() {
      qs("#grotto-stage", container).style.setProperty("--grotto-tone", active.tone);
      var restoreSlider = qs("#restore-slider", container);
      if (restoreSlider) restoreSlider.value = "0";
      applyRestore();
      qs("#grotto-name", container).innerHTML = escapeHTML(active.name + "石窟") +
        (active.extra ? ' <small class="grotto-extra">额外了解</small>' : '');
      qs("#grotto-material", container).textContent = active.material;
      qs("#grotto-look", container).textContent = active.look;
      var observeList = qs("#grotto-observe-list", container);
      if (observeList) {
        observeList.innerHTML = (active.observe || []).map(function (item) {
          return '<li>' + escapeHTML(item) + '</li>';
        }).join("");
      }
      qa("[data-cave]", container).forEach(function (button) {
        button.classList.toggle("active", button.dataset.cave === active.id);
      });
    }
    qa("[data-cave]", container).forEach(function (button) {
      button.addEventListener("click", function () {
        active = config.caves.filter(function (cave) { return cave.id === button.dataset.cave; })[0] || active;
        update();
        playTone("click");
        markInteractionComplete(container, "你已经观察过不同石窟了。下面去做3道小题。");
      });
    });
    var restoreSlider = qs("#restore-slider", container);
    if (restoreSlider) restoreSlider.addEventListener("input", applyRestore);
    update();
  }

  function initQuiz() {
    qa(".quiz-check").forEach(function (button) {
      button.addEventListener("click", function () {
        var item = button.closest(".quiz-item");
        var selected = qs("input:checked", item);
        var result = qs(".quiz-result", item);
        if (!selected) {
          result.textContent = "请先选择一个答案。";
          result.className = "quiz-result";
          return;
        }
        var correct = Number(selected.value) === Number(item.dataset.correct);
        result.textContent = (correct ? "回答正确。" : "回答不正确。") + item.dataset.explanation;
        result.className = "quiz-result " + (correct ? "correct" : "incorrect");
      });
    });
  }

  function initExercise() {
    qa(".hint-toggle").forEach(function (button) {
      button.addEventListener("click", function () {
        var content = button.nextElementSibling;
        var open = content.classList.toggle("show");
        button.setAttribute("aria-expanded", String(open));
        button.textContent = open ? "收起思路" : "查看思路";
      });
    });
  }

  function initExerciseToggle() {
    var toggle = qs("#exercise-toggle");
    var section = qs("#exercise-body");
    if (!toggle || !section) return;
    var key = "little-aesthetics-show-exercise";
    var saved = localStorage.getItem(key);
    var show = saved === null ? true : saved === "1";
    function apply() {
      section.classList.toggle("hidden", !show);
      toggle.setAttribute("aria-expanded", String(show));
      toggle.textContent = show ? "配套练习：显示中" : "配套练习：已收起";
    }
    toggle.addEventListener("click", function () {
      show = !show;
      try { localStorage.setItem(key, show ? "1" : "0"); } catch (error) { toast("浏览器没有允许保存开关状态"); }
      apply();
    });
    apply();
  }

  function initSpeech() {
    qa("[data-speak]").forEach(function (button) {
      button.addEventListener("click", function () {
        if (!("speechSynthesis" in window)) {
          toast("这个浏览器暂时不支持朗读");
          return;
        }
        window.speechSynthesis.cancel();
        var utterance = new SpeechSynthesisUtterance(button.dataset.speak);
        utterance.lang = "zh-CN";
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
        toast("开始朗读口诀");
      });
    });
  }

  function initDoneButton(lesson) {
    var button = qs(".done-toggle");
    if (!button) return;
    function paint() {
      var done = isDone(lesson.index);
      button.textContent = done ? "已完成，点击取消" : "标记为已完成";
      button.classList.toggle("is-done", done);
      button.setAttribute("aria-pressed", String(done));
    }
    button.addEventListener("click", function () {
      var done = !isDone(lesson.index);
      setDone(lesson.index, done);
      paint();
      toast(done ? "已完成第 " + lesson.index + " 课" : "已取消完成标记");
    });
    paint();
  }

  function initRouteObserver(items) {
    var links = qa("#lesson-route a");
    if (!links.length || !("IntersectionObserver" in window)) return;
    var map = {};
    links.forEach(function (link) { map[link.dataset.route] = link; });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) {
          link.classList.remove("active");
          link.removeAttribute("aria-current");
        });
        var link = map[entry.target.id];
        if (link) {
          link.classList.add("active");
          link.setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-30% 0px -60% 0px", threshold: 0 });
    items.forEach(function (item) {
      var node = qs("#" + item.id);
      if (node) observer.observe(node);
    });
  }

  function getSelectedText() {
    var selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.rangeCount) return "";
    return selection.toString().replace(/\s+/g, " ").trim();
  }

  function getSectionLabel(node) {
    var element = node && node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
    var section = element && element.closest ? element.closest(".lesson-body > section") : null;
    if (!section) return "";
    var heading = qs("h2", section);
    return heading ? heading.textContent.trim() : "";
  }

  function initSelectionTools(lesson) {
    var toolbar = document.createElement("div");
    toolbar.className = "selection-toolbar";
    toolbar.setAttribute("role", "toolbar");
    toolbar.setAttribute("aria-label", "选文工具");
    toolbar.innerHTML =
      '<button type="button" data-action="ask">问 LLM</button>' +
      '<button type="button" data-action="modify">修改</button>' +
      '<button type="button" data-action="note">划线笔记</button>';
    document.body.appendChild(toolbar);

    var dialog = document.createElement("div");
    dialog.className = "selection-dialog";
    dialog.innerHTML = '<div class="selection-dialog-panel" role="dialog" aria-modal="true" aria-labelledby="selection-dialog-title">' +
      '<h3 id="selection-dialog-title">生成修改请求</h3><div class="selection-dialog-source"></div>' +
      '<label class="field-label" for="selection-instruction">想改成什么样</label>' +
      '<input id="selection-instruction" name="modification" type="text" autocomplete="off" placeholder="例如：写得更短一点…">' +
      '<div class="dialog-actions"><button class="btn btn-secondary" type="button" data-action="cancel">取消</button>' +
      '<button class="btn btn-primary" type="button" data-action="copy">复制修改请求</button></div></div>';
    document.body.appendChild(dialog);

    var hideTimer = 0;
    var notesKey = "little-aesthetics-notes::" + location.pathname;

    function hideToolbar() {
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(function () { toolbar.classList.remove("visible"); }, 180);
    }

    function positionToolbar(event) {
      window.clearTimeout(hideTimer);
      toolbar.classList.add("visible");
      var width = toolbar.offsetWidth;
      var height = toolbar.offsetHeight;
      var left = Math.min(Math.max(12, event.clientX - width / 2), window.innerWidth - width - 12);
      var top = event.clientY + 14;
      if (top + height > window.innerHeight - 12) top = event.clientY - height - 14;
      toolbar.style.left = left + "px";
      toolbar.style.top = top + "px";
    }

    document.addEventListener("mouseup", function (event) {
      if (toolbar.contains(event.target) || dialog.contains(event.target)) return;
      var text = getSelectedText();
      var selection = window.getSelection();
      if (text.length > 5 && selection && selection.anchorNode && qs(".lesson-body") && qs(".lesson-body").contains(selection.anchorNode)) {
        selectedNode = selection.anchorNode;
        positionToolbar(event);
      } else {
        hideToolbar();
      }
    });
    document.addEventListener("mousedown", function (event) {
      if (!toolbar.contains(event.target) && !dialog.contains(event.target)) hideToolbar();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        toolbar.classList.remove("visible");
        dialog.classList.remove("open");
      }
    });

    toolbar.addEventListener("click", function (event) {
      var button = event.target.closest("button[data-action]");
      if (!button) return;
      var text = getSelectedText();
      if (!text) return;
      var sectionLabel = getSectionLabel(selectedNode);
      var context = "## 课程上下文\n- 课程：" + data.meta.name + "\n- 课时：" + lesson.title + "\n- 章节：" + sectionLabel + "\n\n";
      if (button.dataset.action === "ask") {
        copyText(context + "## 我选中的内容\n\n" + text + "\n\n## 我的提问\n\n", "已复制提问模板");
      } else if (button.dataset.action === "modify") {
        qs(".selection-dialog-source", dialog).textContent = text;
        qs("#selection-instruction", dialog).value = "";
        dialog.classList.add("open");
        window.setTimeout(function () { qs("#selection-instruction", dialog).focus(); }, 80);
      } else if (button.dataset.action === "note") {
        addNote(text, sectionLabel);
      }
      toolbar.classList.remove("visible");
    });

    dialog.addEventListener("click", function (event) {
      if (event.target === dialog || event.target.dataset.action === "cancel") dialog.classList.remove("open");
      if (event.target.dataset.action === "copy") {
        var source = qs(".selection-dialog-source", dialog).textContent;
        var instruction = qs("#selection-instruction", dialog).value.trim() || "请给出更清楚、更简短的改写方案";
        copyText("## 课程上下文\n- 课程：" + data.meta.name + "\n- 课时：" + lesson.title + "\n- 章节：" +
          getSectionLabel(selectedNode) + "\n\n## 选中的原文\n\n" + source + "\n\n## 修改要求\n\n" + instruction + "\n", "已复制修改请求");
        dialog.classList.remove("open");
      }
    });

    function loadNotes() {
      try { return JSON.parse(localStorage.getItem(notesKey) || "[]"); } catch (error) { return []; }
    }
    function saveNotes(notes) {
      try { localStorage.setItem(notesKey, JSON.stringify(notes)); } catch (error) { toast("浏览器没有允许保存划线笔记"); }
    }
    function getTextNodes(root) {
      var nodes = [];
      (function walk(node) {
        if (node.nodeType === Node.TEXT_NODE) { nodes.push(node); return; }
        for (var i = 0; i < node.childNodes.length; i += 1) walk(node.childNodes[i]);
      })(root);
      return nodes;
    }
    function findRangeByOccurrence(root, text, occurrence) {
      var nodes = getTextNodes(root);
      var full = nodes.map(function (node) { return node.nodeValue; }).join("");
      var index = -1;
      for (var count = 0; count <= occurrence; count += 1) {
        index = full.indexOf(text, index + 1);
        if (index === -1) return null;
      }
      var end = index + text.length;
      var position = 0;
      var range = document.createRange();
      var startSet = false;
      var endSet = false;
      for (var i = 0; i < nodes.length; i += 1) {
        var length = nodes[i].nodeValue.length;
        if (!startSet && index <= position + length) { range.setStart(nodes[i], index - position); startSet = true; }
        if (!endSet && end <= position + length) { range.setEnd(nodes[i], end - position); endSet = true; break; }
        position += length;
      }
      return startSet && endSet ? range : null;
    }
    function findSection(label) {
      return qa(".lesson-body > section").filter(function (section) {
        var heading = qs("h2", section);
        return heading && heading.textContent.trim() === label;
      })[0];
    }
    function restoreNotes() {
      loadNotes().forEach(function (entry) {
        var section = findSection(entry.section);
        if (!section) return;
        var range = findRangeByOccurrence(section, entry.text, 0);
        if (!range) return;
        var span = document.createElement("span");
        span.className = "note-underline";
        span.dataset.noteId = entry.id;
        try { span.appendChild(range.extractContents()); range.insertNode(span); } catch (error) { return; }
      });
    }
    function addNote(text, sectionLabel) {
      var selection = window.getSelection();
      if (!selection || !selection.rangeCount || !text) return;
      var range = selection.getRangeAt(0);
      if (!range.commonAncestorContainer || !qs(".lesson-body").contains(range.commonAncestorContainer)) return;
      var id = "note-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7);
      var span = document.createElement("span");
      span.className = "note-underline";
      span.dataset.noteId = id;
      try { span.appendChild(range.extractContents()); range.insertNode(span); } catch (error) { toast("这段选区暂时无法划线"); return; }
      selection.removeAllRanges();
      var notes = loadNotes();
      notes.push({ id: id, text: text, section: sectionLabel });
      saveNotes(notes);
      toast("已添加划线笔记，点击标记可取消");
    }
    document.addEventListener("click", function (event) {
      var note = event.target.closest && event.target.closest(".note-underline");
      if (!note) return;
      var selection = window.getSelection();
      if (selection && !selection.isCollapsed && selection.toString().length > 0) return;
      var id = note.dataset.noteId;
      var parent = note.parentNode;
      while (note.firstChild) parent.insertBefore(note.firstChild, note);
      parent.removeChild(note);
      parent.normalize();
      saveNotes(loadNotes().filter(function (entry) { return entry.id !== id; }));
      toast("已取消划线笔记");
    });
    restoreNotes();
  }

  function mobileIcon(name) {
    var icons = {
      home: '<path d="M3 11.5 12 4l9 7.5"></path><path d="M5.5 10.5V20h13v-9.5"></path><path d="M9.5 20v-5h5v5"></path>',
      course: '<path d="M5 4h14v16H5z"></path><path d="M8 8h8M8 12h8M8 16h5"></path>',
      progress: '<path d="M5 19V9M12 19V5M19 19v-7"></path>',
      about: '<circle cx="12" cy="12" r="8"></circle><path d="M12 11v5M12 8h.01"></path>'
    };
    return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + (icons[name] || icons.course) + "</svg>";
  }

  function initMobileNavigation() {
    if (qs("#mobile-bottom-nav")) return;
    var page = document.body.dataset.page || "index";
    var nav = qs(".nav");
    var links = qs(".nav-links");
    if (nav && links && !qs(".nav-toggle", nav)) {
      if (!links.id) links.id = "site-nav-links";
      var toggle = document.createElement("button");
      toggle.className = "nav-toggle";
      toggle.type = "button";
      toggle.setAttribute("aria-label", "打开导航菜单");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-controls", links.id);
      toggle.innerHTML = "<span></span><span></span><span></span>";
      nav.insertBefore(toggle, links);
      toggle.addEventListener("click", function () {
        var header = toggle.closest(".site-header");
        var open = header.classList.toggle("nav-open");
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "关闭导航菜单" : "打开导航菜单");
      });
      links.addEventListener("click", function (event) {
        if (!event.target.closest("a")) return;
        toggle.closest(".site-header").classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
      document.addEventListener("click", function (event) {
        var header = toggle.closest(".site-header");
        if (!header || header.contains(event.target)) return;
        header.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
      document.addEventListener("keydown", function (event) {
        if (event.key !== "Escape") return;
        toggle.closest(".site-header").classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    }
    var base = page === "index" ? "" : "../";
    var current = page === "index" ? "home" : "course";
    var items = [
      { key: "home", label: "首页", href: base + "index.html" },
      { key: "course", label: "课程", href: base + "index.html#course-map" },
      { key: "progress", label: "进度", href: base + "index.html#progress" },
      { key: "about", label: "资料", href: base + "index.html#sources" }
    ];
    var bottom = document.createElement("nav");
    bottom.id = "mobile-bottom-nav";
    bottom.className = "mobile-bottom-nav";
    bottom.setAttribute("aria-label", "手机端快捷导航");
    bottom.innerHTML = items.map(function (item) {
      return '<a href="' + item.href + '"' + (item.key === current ? ' aria-current="page"' : "") + ">" +
        mobileIcon(item.key) + "<span>" + item.label + "</span></a>";
    }).join("");
    document.body.appendChild(bottom);
    document.body.classList.add("has-mobile-nav");
  }

  function initMobileToc() {
    var toc = qs(".lesson-toc");
    if (!toc) return;
    var query = window.matchMedia("(max-width: 760px)");
    function apply() {
      var details = qs(".mobile-toc", toc);
      if (query.matches && !details) {
        details = document.createElement("details");
        details.className = "mobile-toc";
        var summary = document.createElement("summary");
        summary.textContent = "课程目录";
        var bodyNode = document.createElement("div");
        bodyNode.className = "mobile-toc-body";
        while (toc.firstChild) bodyNode.appendChild(toc.firstChild);
        details.appendChild(summary);
        details.appendChild(bodyNode);
        toc.appendChild(details);
      } else if (!query.matches && details) {
        var node = qs(".mobile-toc-body", details);
        while (node && node.firstChild) toc.appendChild(node.firstChild);
        details.remove();
      }
    }
    apply();
    if (query.addEventListener) query.addEventListener("change", apply);
  }

  function initRandomLesson() {
    var button = qs("#random-lesson");
    if (!button) return;
    var last = -1;
    button.addEventListener("click", function () {
      if (!lessons.length) return;
      var index = Math.floor(Math.random() * lessons.length);
      if (lessons.length > 1 && index === last) index = (index + 1) % lessons.length;
      last = index;
      window.location.href = lessons[index].slug + "/lesson.html";
    });
  }

  function initFooter() {
    var row = qs(".site-footer .footer-row");
    if (!row) return;
    var page = document.body.dataset.page;
    var note = page === "lesson" ? "选择正文，可以提问、请求修改或添加划线笔记" : "用简单的话，看懂传统美学";
    row.innerHTML = '<div class="footer-brand"><strong>美识集·小小美育课</strong><span>10节课，30个知识点，10个互动游戏</span><span>内容参考故宫博物院、敦煌研究院、中国非物质文化遗产网、UNESCO等公开资料</span></div>' +
      '<div class="footer-meta"><span>' + note + '</span><span>内容更新：2026年10月12日</span></div>';
  }

  function init() {
    var page = document.body.dataset.page;
    if (page === "index") {
      renderIndex();
      initRandomLesson();
      initCertificate();
    }
    if (page === "lesson") {
      var lesson = lessonBySlug(document.body.dataset.lesson);
      if (lesson) renderLesson(lesson);
    }
    initMobileNavigation();
    initMobileToc();
    initFooter();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
