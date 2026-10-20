(function () {
  "use strict";

  var PALETTE = {
    ink: "#414C39",
    inkSoft: "#6B5D4F",
    paper: "#F7F2E8",
    cream: "#FFFDF8",
    clay: "#C7A19B",
    yellow: "#F2CC8F",
    mint: "#81B29A"
  };

  function wrap(label, body, extra) {
    return '<svg class="lesson-art-svg" width="640" height="420" viewBox="0 0 640 420" role="img" aria-label="' + label +
      '" preserveAspectRatio="xMidYMid meet"' + (extra ? ' data-scene="' + extra + '"' : '') + '>' +
      '<rect width="640" height="420" rx="28" fill="' + PALETTE.paper + '"/>' + body + "</svg>";
  }

  function face(cx, cy, r, fill) {
    return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + fill + '"/>' +
      '<circle cx="' + (cx - r * 0.32) + '" cy="' + (cy - r * 0.12) + '" r="' + (r * 0.07) + '" fill="' + PALETTE.ink + '"/>' +
      '<circle cx="' + (cx + r * 0.32) + '" cy="' + (cy - r * 0.12) + '" r="' + (r * 0.07) + '" fill="' + PALETTE.ink + '"/>' +
      '<path d="M' + (cx - r * 0.26) + ' ' + (cy + r * 0.26) + ' Q' + cx + ' ' + (cy + r * 0.5) + ' ' + (cx + r * 0.26) + ' ' + (cy + r * 0.26) + '" fill="none" stroke="' + PALETTE.ink + '" stroke-width="5" stroke-linecap="round"/>';
  }

  var ART = {
    "01-color": function () {
      return wrap("颜料盘和三块传统色", [
        '<path d="M108 262c0-92 76-166 170-166 88 0 148 54 148 118 0 40-30 62-66 62h-32c-20 0-34 14-34 32 0 30-24 48-62 48-68 0-124-42-124-94z" fill="' + PALETTE.cream + '" stroke="' + PALETTE.ink + '" stroke-width="8"/>',
        '<circle cx="232" cy="176" r="34" fill="#B83A2D"/>',
        '<circle cx="318" cy="158" r="34" fill="#8EA6A6"/>',
        '<circle cx="374" cy="228" r="34" fill="#33586F"/>',
        '<circle cx="176" cy="268" r="30" fill="' + PALETTE.yellow + '"/>',
        '<path d="M300 96l86-70" stroke="' + PALETTE.ink + '" stroke-width="14" stroke-linecap="round"/>',
        '<path d="M370 34l46-16 14 34-44 20z" fill="' + PALETTE.clay + '" stroke="' + PALETTE.ink + '" stroke-width="7" stroke-linejoin="round"/>',
        '<path d="M84 350h472" stroke="' + PALETTE.clay + '" stroke-width="12" stroke-linecap="round"/>'
      ].join(""));
    },
    "02-pattern": function () {
      var bands = [
        '<path d="M214 104h212" stroke="' + PALETTE.cream + '" stroke-width="10" stroke-linecap="round"/>',
        '<path d="M226 148h188l-12 24H238z" fill="none" stroke="' + PALETTE.cream + '" stroke-width="8" stroke-linejoin="round"/>',
        '<path d="M238 176h164l-12 24H250z" fill="none" stroke="' + PALETTE.cream + '" stroke-width="8" stroke-linejoin="round"/>',
        '<path d="M250 252c24-26 48-26 70 0 22-26 46-26 70 0" fill="none" stroke="' + PALETTE.cream + '" stroke-width="9" stroke-linecap="round"/>',
        '<path d="M266 296c18-22 36-22 54 0 18-22 36-22 54 0" fill="none" stroke="' + PALETTE.cream + '" stroke-width="9" stroke-linecap="round"/>'
      ].join("");
      return wrap("带回纹与云纹的原创花瓶", [
        '<path d="M256 58h128l-10 46c40 40 60 86 60 142 0 72-50 118-114 118s-114-46-114-118c0-56 20-102 60-142z" fill="#7E9C79" stroke="' + PALETTE.ink + '" stroke-width="8" stroke-linejoin="round"/>',
        bands,
        '<path d="M214 332c32 18 62 26 92 26s60-8 92-26" fill="none" stroke="' + PALETTE.cream + '" stroke-width="10" stroke-linecap="round"/>',
        '<path d="M320 58v-26" stroke="' + PALETTE.ink + '" stroke-width="10" stroke-linecap="round"/>'
      ].join(""));
    },
    "03-architecture": function () {
      return wrap("带飞檐和斗拱的原创小房子", [
        '<rect x="150" y="236" width="340" height="130" rx="14" fill="' + PALETTE.cream + '" stroke="' + PALETTE.ink + '" stroke-width="8"/>',
        '<path d="M116 244c44 10 94 4 138-26h132c44 30 94 36 138 26l-34-42c-30 8-60 4-84-18H234c-24 22-54 26-84 18z" fill="#A8B5C9" stroke="' + PALETTE.ink + '" stroke-width="8" stroke-linejoin="round"/>',
        '<path d="M196 236v-34h248v34" fill="' + PALETTE.cream + '" stroke="' + PALETTE.ink + '" stroke-width="8"/>',
        '<path d="M210 202h44l-10 20h-44zM254 202h44l-10 20h-44zM298 202h44l-10 20h-44zM342 202h44l-10 20h-44z" fill="' + PALETTE.yellow + '" stroke="' + PALETTE.ink + '" stroke-width="6" stroke-linejoin="round"/>',
        '<rect x="286" y="288" width="68" height="78" rx="10" fill="' + PALETTE.clay + '" stroke="' + PALETTE.ink + '" stroke-width="7"/>',
        '<circle cx="336" cy="326" r="5" fill="' + PALETTE.ink + '"/>',
        '<path d="M104 366h432" stroke="' + PALETTE.ink + '" stroke-width="10" stroke-linecap="round"/>'
      ].join(""));
    },
    "04-painting": function () {
      return wrap("一幅有大面积留白的原创山水示意图", [
        '<rect x="76" y="52" width="488" height="316" rx="18" fill="' + PALETTE.cream + '" stroke="' + PALETTE.ink + '" stroke-width="8"/>',
        '<path d="M108 312l92-150 58 82 42-58 86 126z" fill="#87968B" stroke="' + PALETTE.ink + '" stroke-width="7" stroke-linejoin="round"/>',
        '<path d="M292 286l52-72 40 52 34-40 52 60z" fill="#A8B5C9" stroke="' + PALETTE.ink + '" stroke-width="7" stroke-linejoin="round"/>',
        '<circle cx="482" cy="126" r="26" fill="' + PALETTE.yellow + '" stroke="' + PALETTE.ink + '" stroke-width="6"/>',
        '<path d="M132 276c22 10 44 10 66 0" fill="none" stroke="' + PALETTE.ink + '" stroke-width="7" stroke-linecap="round"/>',
        '<path d="M118 296h96l-12 18h-72z" fill="' + PALETTE.ink + '"/>',
        '<path d="M368 214c14-12 30-12 44 0M436 232c14-12 30-12 44 0" fill="none" stroke="' + PALETTE.ink + '" stroke-width="6" stroke-linecap="round"/>',
        '<path d="M140 340h360" stroke="' + PALETTE.clay + '" stroke-width="6" stroke-linecap="round" stroke-dasharray="2 18"/>'
      ].join(""));
    },
    "05-calligraphy": function () {
      return wrap("毛笔和一个永字示意图", [
        '<rect x="86" y="66" width="468" height="288" rx="20" fill="' + PALETTE.cream + '" stroke="' + PALETTE.clay + '" stroke-width="10"/>',
        '<text x="206" y="292" font-size="210" font-family="Songti SC, SimSun, serif" fill="' + PALETTE.ink + '">永</text>',
        '<path d="M420 112l86 128" stroke="' + PALETTE.ink + '" stroke-width="18" stroke-linecap="round"/>',
        '<path d="M406 96l38-16 18 38-38 16z" fill="' + PALETTE.clay + '" stroke="' + PALETTE.ink + '" stroke-width="7" stroke-linejoin="round"/>',
        '<circle cx="500" cy="252" r="30" fill="#B83A2D" stroke="' + PALETTE.ink + '" stroke-width="7"/>',
        '<path d="M126 320h252" stroke="' + PALETTE.ink + '" stroke-width="5" stroke-linecap="round" stroke-dasharray="4 14"/>'
      ].join(""));
    },
    "06-porcelain": function () {
      return wrap("青花瓷瓶与青瓷瓶示意图", [
        '<path d="M176 74h76l-8 40c28 34 42 72 42 116 0 58-30 96-72 96s-72-38-72-96c0-44 14-82 42-116z" fill="#F2F1EA" stroke="' + PALETTE.ink + '" stroke-width="8" stroke-linejoin="round"/>',
        '<path d="M178 176c26 18 48 18 72 0M172 228c30 18 54 18 84 0M176 274c26 16 50 16 76 0" fill="none" stroke="#33586F" stroke-width="11" stroke-linecap="round"/>',
        '<path d="M388 92h72l-8 38c28 32 42 68 42 108 0 54-28 90-70 90s-70-36-70-90c0-40 14-76 42-108z" fill="#8EA6A6" stroke="' + PALETTE.ink + '" stroke-width="8" stroke-linejoin="round"/>',
        '<path d="M374 214c32 20 62 20 92 0" fill="none" stroke="#6E8E8A" stroke-width="10" stroke-linecap="round"/>',
        '<path d="M110 350h420" stroke="' + PALETTE.clay + '" stroke-width="10" stroke-linecap="round"/>'
      ].join(""));
    },
    "07-costume": function () {
      return wrap("交领广袖传统服装示意图", [
        '<path d="M256 82l64 44 64-44 84 54-42 92-38-16v128H252V212l-38 16-42-92z" fill="' + PALETTE.clay + '" stroke="' + PALETTE.ink + '" stroke-width="8" stroke-linejoin="round"/>',
        '<path d="M256 82l64 44 64-44" fill="none" stroke="' + PALETTE.cream + '" stroke-width="12" stroke-linejoin="round"/>',
        '<path d="M320 126l-60 76M320 126l60 76" fill="none" stroke="' + PALETTE.cream + '" stroke-width="10" stroke-linecap="round"/>',
        '<path d="M222 236h196l-12 34H234z" fill="#D4A373" stroke="' + PALETTE.ink + '" stroke-width="7" stroke-linejoin="round"/>',
        '<path d="M132 190c-26 26-34 60-24 98M508 190c26 26 34 60 24 98" fill="none" stroke="' + PALETTE.ink + '" stroke-width="9" stroke-linecap="round"/>',
        '<path d="M252 342h136" stroke="' + PALETTE.ink + '" stroke-width="8" stroke-linecap="round"/>'
      ].join(""));
    },
    "08-garden": function () {
      return wrap("圆形门洞框住园林与远塔的示意图", [
        '<rect x="74" y="48" width="492" height="324" rx="24" fill="#DCE7D8"/>',
        '<circle cx="320" cy="210" r="138" fill="' + PALETTE.cream + '" stroke="' + PALETTE.ink + '" stroke-width="14"/>',
        '<path d="M238 306c20-78 52-118 96-118s76 40 96 118z" fill="#95B88A"/>',
        '<path d="M300 214h40l-8-30h-24z" fill="' + PALETTE.clay + '" stroke="' + PALETTE.ink + '" stroke-width="6" stroke-linejoin="round"/>',
        '<path d="M308 184h24M306 172h28M312 160h16" stroke="' + PALETTE.ink + '" stroke-width="6" stroke-linecap="round"/>',
        '<path d="M214 306c34-24 68-24 102 0 34-24 68-24 102 0" fill="none" stroke="' + PALETTE.ink + '" stroke-width="7" stroke-linecap="round"/>',
        '<path d="M148 322c48 20 98 28 172 28s124-8 172-28" fill="none" stroke="#7E9C79" stroke-width="12" stroke-linecap="round"/>'
      ].join(""));
    },
    "09-festival": function () {
      return wrap("灯笼、粽子和月饼组成的节日示意图", [
        '<path d="M142 96v34" stroke="' + PALETTE.ink + '" stroke-width="8" stroke-linecap="round"/>',
        '<ellipse cx="142" cy="178" rx="60" ry="54" fill="#E07A5F" stroke="' + PALETTE.ink + '" stroke-width="8"/>',
        '<path d="M104 146c24 18 52 18 76 0M104 210c24 18 52 18 76 0" fill="none" stroke="#F2CC8F" stroke-width="8" stroke-linecap="round"/>',
        '<path d="M142 232v28M122 260h40" stroke="' + PALETTE.ink + '" stroke-width="8" stroke-linecap="round"/>',
        '<path d="M292 232l58-62 58 62z" fill="#7E9C79" stroke="' + PALETTE.ink + '" stroke-width="8" stroke-linejoin="round"/>',
        '<path d="M300 246h100l-50 76z" fill="#95B88A" stroke="' + PALETTE.ink + '" stroke-width="8" stroke-linejoin="round"/>',
        '<path d="M350 246v62M322 262h56" stroke="' + PALETTE.cream + '" stroke-width="7" stroke-linecap="round"/>',
        '<circle cx="504" cy="220" r="58" fill="#D6A22C" stroke="' + PALETTE.ink + '" stroke-width="8"/>',
        '<path d="M476 210c18 12 38 12 56 0M480 238c14 10 34 10 48 0" fill="none" stroke="#F2CC8F" stroke-width="7" stroke-linecap="round"/>',
        '<path d="M90 356h460" stroke="' + PALETTE.clay + '" stroke-width="12" stroke-linecap="round"/>'
      ].join(""));
    },
    "10-sculpture": function () {
      return wrap("山崖与微笑坐像示意图", [
        '<path d="M68 356l108-250 92 160 74-192 124 282z" fill="#B8A8A0" stroke="' + PALETTE.ink + '" stroke-width="9" stroke-linejoin="round"/>',
        '<circle cx="352" cy="184" r="52" fill="#C7A19B" stroke="' + PALETTE.ink + '" stroke-width="8"/>',
        '<path d="M300 208l-46 92M404 208l46 92" stroke="' + PALETTE.ink + '" stroke-width="10" stroke-linecap="round"/>',
        '<path d="M296 322c36 24 76 24 112 0l24 46H272z" fill="#C7A19B" stroke="' + PALETTE.ink + '" stroke-width="8" stroke-linejoin="round"/>',
        '<circle cx="334" cy="178" r="5" fill="' + PALETTE.ink + '"/><circle cx="370" cy="178" r="5" fill="' + PALETTE.ink + '"/>',
        '<path d="M334 204c12 10 24 10 36 0" fill="none" stroke="' + PALETTE.ink + '" stroke-width="6" stroke-linecap="round"/>',
        '<path d="M86 356h472" stroke="' + PALETTE.clay + '" stroke-width="12" stroke-linecap="round"/>'
      ].join(""));
    },
    "home-cluster": function () {
      return wrap("十个课程主题组成的原创插画", [
        '<circle cx="320" cy="212" r="150" fill="' + PALETTE.cream + '" stroke="' + PALETTE.ink + '" stroke-width="8"/>',
        '<path d="M320 82l34 62 66-30-8 72 72 14-56 46 42 60-72-8-18 70-48-56-56 44 8-72-70-18 58-46-34-64 72 10z" fill="' + PALETTE.yellow + '" stroke="' + PALETTE.ink + '" stroke-width="7" stroke-linejoin="round"/>',
        '<circle cx="320" cy="212" r="58" fill="' + PALETTE.clay + '" stroke="' + PALETTE.ink + '" stroke-width="7"/>',
        face(320, 212, 40, PALETTE.clay),
        '<circle cx="142" cy="120" r="34" fill="#B83A2D" stroke="' + PALETTE.ink + '" stroke-width="7"/>',
        '<circle cx="512" cy="126" r="34" fill="#8EA6A6" stroke="' + PALETTE.ink + '" stroke-width="7"/>',
        '<circle cx="126" cy="312" r="34" fill="#95B88A" stroke="' + PALETTE.ink + '" stroke-width="7"/>',
        '<circle cx="512" cy="306" r="34" fill="#D4A373" stroke="' + PALETTE.ink + '" stroke-width="7"/>',
        '<path d="M188 86c18 0 30 12 30 30s-12 30-30 30-30-12-30-30 12-30 30-30z" fill="none" stroke="' + PALETTE.ink + '" stroke-width="7"/>',
        '<path d="M452 86h50l-8 22 26 30-38 8-24-20z" fill="#7E9C79" stroke="' + PALETTE.ink + '" stroke-width="7" stroke-linejoin="round"/>',
        '<path d="M170 294c22 12 44 12 66 0" fill="none" stroke="' + PALETTE.ink + '" stroke-width="8" stroke-linecap="round"/>',
        '<path d="M438 292h62l-10 28h-42z" fill="#33586F" stroke="' + PALETTE.ink + '" stroke-width="7" stroke-linejoin="round"/>'
      ].join(""));
    }
  };

  window.LESSON_ART = {
    get: function (key, label) {
      var fn = ART[key];
      if (!fn) return "";
      return fn(label);
    },
    palette: PALETTE
  };
})();
