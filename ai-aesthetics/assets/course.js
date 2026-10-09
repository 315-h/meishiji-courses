(function () {
  "use strict";

  var data = window.COURSE_DATA || {};
  var lessons = window.COURSE_LESSONS || [];
  var body = document.body;
  var root = body.dataset.root || "";
  var page = body.dataset.page || "index";
  var lessonSlug = body.dataset.lesson || "";
  var toastTimer;
  var activePaletteIndex = 0;
  var activePatternCategory = "全部";
  var activeCompareTheme = "山水";
  var currentScene = { region: "江南园林", time: "清晨", focus: "人物" };
  var patternIconMap = {
    "回纹": "pattern-huiwen",
    "云雷纹": "pattern-yunlei",
    "万字纹": "pattern-wanzi",
    "冰裂纹": "pattern-binglie",
    "卷草纹": "pattern-juancao",
    "云纹": "pattern-yunwen",
    "水纹": "pattern-shuiwen",
    "缠枝花卉纹": "pattern-chanzhi",
    "松竹梅纹": "pattern-songzhumei",
    "龙纹": "pattern-longwen",
    "凤纹": "pattern-fengwen",
    "祥云纹": "pattern-xiangyun",
    "蝙蝠纹": "pattern-bianfu",
    "如意纹": "pattern-ruyi",
    "希腊回纹": "p-meander",
    "茛苕叶纹": "p-acanthus",
    "佩斯利纹": "p-paisley",
    "伊斯兰几何纹": "p-islamic-geo",
    "哥特花窗纹": "p-gothic-rose"
  };
  var SOURCE_KEYWORDS = [
    { keyword: "故宫博物院", match: ["故宫", "dpm.org.cn"] },
    { keyword: "敦煌研究院", match: ["敦煌", "dha.ac.cn", "e-dunhuang.com"] },
    { keyword: "中国非物质文化遗产网", match: ["非遗", "ihchina.cn"] },
    { keyword: "UNESCO", match: ["UNESCO", "unesco.org", "世界遗产"] },
    { keyword: "The Met", match: ["Met", "metmuseum.org", "大都会"] },
    { keyword: "卢浮宫", match: ["卢浮宫", "louvre.fr", "Louvre"] },
    { keyword: "东京国立博物馆", match: ["东京国立", "tnm.jp"] },
    { keyword: "大英博物馆", match: ["大英博物馆", "britishmuseum.org"] },
    { keyword: "V&A", match: ["V&A", "vam.ac.uk"] },
    { keyword: "Smarthistory", match: ["Smarthistory", "smarthistory.org"] },
    { keyword: "国家文物局", match: ["国家文物局", "ncha.gov.cn"] },
    { keyword: "文化和旅游部", match: ["文化和旅游部", "mct.gov.cn"] },
    { keyword: "建筑史", match: ["建筑史"] },
    { keyword: "艺术史", match: ["艺术史", "公认艺术史"] },
    { keyword: "考古", match: ["考古"] }
  ];

  function qs(selector, context) {
    return (context || document).querySelector(selector);
  }

  function qa(selector, context) {
    return Array.prototype.slice.call((context || document).querySelectorAll(selector));
  }

  function escapeHTML(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function contrastTone(hex) {
    var value = hex.replace("#", "");
    var r = parseInt(value.slice(0, 2), 16) / 255;
    var g = parseInt(value.slice(2, 4), 16) / 255;
    var b = parseInt(value.slice(4, 6), 16) / 255;
    function channel(item) {
      return item <= 0.03928 ? item / 12.92 : Math.pow((item + 0.055) / 1.055, 2.4);
    }
    var luminance = 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
    return luminance > 0.38 ? "tone-dark" : "tone-light";
  }

  function toast(message) {
    var node = qs("#global-toast");
    if (!node) {
      node = document.createElement("div");
      node.id = "global-toast";
      node.className = "toast";
      node.setAttribute("role", "status");
      node.setAttribute("aria-live", "polite");
      document.body.appendChild(node);
    }
    node.textContent = message;
    node.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      node.classList.remove("show");
    }, 2400);
  }

  function copyText(text, successMessage) {
    var fallback = function () {
      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy");
        toast(successMessage || "已复制");
      } catch (error) {
        toast("复制失败，请手动选择文本");
      }
      document.body.removeChild(area);
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () {
        toast(successMessage || "已复制");
      }).catch(fallback);
      return;
    }
    fallback();
  }

  function lessonBySlug(slug) {
    return lessons.filter(function (lesson) {
      return lesson.slug === slug;
    })[0];
  }

  function listMarkup(items, className) {
    if (!items || !items.length) return "";
    return '<ul class="' + (className || "plain-list") + '">' + items.map(function (item) {
      return "<li>" + escapeHTML(item) + "</li>";
    }).join("") + "</ul>";
  }

  function tableMarkup(rows) {
    if (!rows || !rows.length) return "";
    return '<table class="compare-table"><thead><tr>' + rows[0].map(function (cell) {
      return "<th>" + escapeHTML(cell) + "</th>";
    }).join("") + "</tr></thead><tbody>" + rows.slice(1).map(function (row) {
      return "<tr>" + row.map(function (cell) {
        return "<td>" + escapeHTML(cell) + "</td>";
      }).join("") + "</tr>";
    }).join("") + "</tbody></table>";
  }

  function renderIndex() {
    var pathRoot = qs("#path-grid");
    if (pathRoot) {
      pathRoot.innerHTML = [
        {
          title: "底层视觉基底",
          copy: "先掌握色彩职责与纹样结构，建立可复用的视觉语言。",
          lessons: lessons.slice(0, 2)
        },
        {
          title: "实体艺术载体",
          copy: "用建筑、绘画和器物把风格从抽象词变成可观察结构。",
          lessons: lessons.slice(2, 5)
        },
        {
          title: "创作实战专题",
          copy: "把知识放进插画、海报、场景、优化与完整项目。",
          lessons: lessons.slice(5)
        }
      ].map(function (column) {
        return '<article class="path-column"><h3>' + column.title + '</h3><p>' + column.copy + '</p><p>' + column.lessons.map(function (lesson) {
          return "第" + lesson.index + "课 " + lesson.title;
        }).join("<br>") + "</p></article>";
      }).join("");
    }

    var lessonGrid = qs(".lesson-grid");
    if (lessonGrid) {
      lessonGrid.innerHTML = lessons.map(function (lesson) {
        return '<a class="lesson-card" href="' + root + lesson.slug + '/lesson.html">' +
          '<span class="lesson-index">' + String(lesson.index).padStart(2, "0") + '</span>' +
          '<span><h3>' + escapeHTML(lesson.title) + '</h3>' +
          '<p>' + escapeHTML(lesson.summary) + '</p>' +
          '<span class="lesson-meta"><span class="meta-chip">' + escapeHTML(lesson.level) + '</span><span class="meta-chip">' + escapeHTML(lesson.duration) + '</span></span></span>' +
          '</a>';
      }).join("");
    }
  }

  function palettePrompt(palette) {
    return palette.prompt;
  }

  function paletteMatchesRegion(palette, region) {
    if (region === "全部") return true;
    if (region === "其他") return palette.region === "东方";
    return palette.region === region;
  }

  function pickRandomOption(options, currentIndex) {
    var alternatives = options.filter(function (entry) {
      return entry.index !== currentIndex;
    });
    var pool = alternatives.length ? alternatives : options;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function renderPaletteTool(container, compact) {
    if (!container || !data.palettes || !data.palettes.length) return;
    var regions = ["全部", "中国", "西方", "其他"];
    var activeRegion = "全部";

    function render() {
      var palette = data.palettes[activePaletteIndex];
      var filters = regions.map(function (region) {
        return '<button class="filter-btn' + (region === activeRegion ? " active" : "") + '" type="button" data-region="' + region + '">' + region + '色彩</button>';
      }).join("");
      var swatches = palette.colors.map(function (color) {
        return '<button class="color-swatch ' + contrastTone(color.hex) + '" type="button" style="background:' + color.hex + '" data-copy="' + color.hex + '" aria-label="复制' + color.name + '色值' + color.hex + '">' +
          '<span class="swatch-name">' + escapeHTML(color.name) + '</span>' +
          '<span class="swatch-values">' + color.hex + '<br>RGB ' + color.rgb + '<br>CMYK ' + color.cmyk + '</span>' +
          '</button>';
      }).join("");

      container.innerHTML =
        '<div class="palette-tool">' +
          '<aside><p class="filter-title">文明与风格</p><div class="filter-list" id="palette-filters">' + filters + '</div></aside>' +
          '<div class="palette-main">' +
            '<div class="palette-head"><div><h3>' + escapeHTML(palette.name) + '</h3><p>' + escapeHTML(palette.note) + '</p></div>' +
            '<div class="button-row"><button class="btn btn-quiet" type="button" id="palette-random">随机推荐</button></div></div>' +
            '<div class="palette-swatches">' + swatches + '</div>' +
            '<div class="palette-output" id="palette-output"><strong>AI配色提示词</strong>' + escapeHTML(palettePrompt(palette)) + '</div>' +
            '<div class="tool-actions" style="margin-top:14px"><button class="btn btn-primary" type="button" id="palette-generate">生成配色提示词</button><button class="btn btn-secondary" type="button" id="palette-copy">复制提示词</button></div>' +
          '</div>' +
        '</div>';

      qa("[data-region]", container).forEach(function (button) {
        button.addEventListener("click", function () {
          activeRegion = button.dataset.region;
          var matches = data.palettes.map(function (item, index) {
            return { item: item, index: index };
          }).filter(function (entry) {
            return paletteMatchesRegion(entry.item, activeRegion);
          });
          activePaletteIndex = matches[0].index;
          render();
        });
      });
      qa("[data-copy]", container).forEach(function (button) {
        button.addEventListener("click", function () {
          copyText(button.dataset.copy, "色值 " + button.dataset.copy + " 已复制");
        });
      });
      var randomButton = qs("#palette-random", container);
      if (randomButton) {
        randomButton.addEventListener("click", function () {
          var options = data.palettes.map(function (item, index) {
            return { item: item, index: index };
          }).filter(function (entry) {
            return paletteMatchesRegion(entry.item, activeRegion);
          });
          activePaletteIndex = pickRandomOption(options, activePaletteIndex).index;
          render();
        });
      }
      var generateButton = qs("#palette-generate", container);
      if (generateButton) {
        generateButton.addEventListener("click", function () {
          render();
          toast("配色提示词已生成");
        });
      }
      var copyButton = qs("#palette-copy", container);
      if (copyButton) {
        copyButton.addEventListener("click", function () {
          copyText(palettePrompt(palette), "配色提示词已复制");
        });
      }
    }

    render();
  }

  function renderMiniPalette(container) {
    if (!container || !data.palettes) return;
    var current = data.palettes[0];

    function render() {
      container.innerHTML =
        '<div class="panel-label"><span>随机传统配色卡</span><span>' + escapeHTML(current.region) + '</span></div>' +
        '<div class="mini-palette">' + current.colors.map(function (color) {
          return '<button class="mini-swatch" type="button" style="background:' + color.hex + '" data-copy="' + color.hex + '"><strong>' + escapeHTML(color.name) + '</strong><span>' + color.hex + '</span></button>';
        }).join("") + '</div>' +
        '<button class="btn btn-secondary" type="button" id="mini-random">换一组</button>';

      qa("[data-copy]", container).forEach(function (button) {
        button.addEventListener("click", function () {
          copyText(button.dataset.copy, "色值 " + button.dataset.copy + " 已复制");
        });
      });
      qs("#mini-random", container).addEventListener("click", function () {
        var currentIndex = data.palettes.indexOf(current);
        current = pickRandomOption(data.palettes.map(function (item, index) {
          return { item: item, index: index };
        }), currentIndex).item;
        render();
      });
    }

    render();
  }

  function patternCard(pattern) {
    var iconId = patternIconMap[pattern.name];
    var preview = iconId
      ? '<svg class="pattern-line-icon" viewBox="0 0 100 100" aria-hidden="true"><use href="#' + iconId + '"></use></svg>'
      : '<span class="pattern-glyph" aria-hidden="true"></span>';
    return '<button class="pattern-card" type="button" data-pattern="' + escapeHTML(pattern.name) + '" data-name="' + escapeHTML(pattern.name) + '">' +
      '<span class="pattern-preview">' + preview + '</span>' +
      '<span class="pattern-info"><strong>' + escapeHTML(pattern.name) + '</strong><span>' + escapeHTML(pattern.category) + ' · ' + escapeHTML(pattern.tag) + '</span></span>' +
      '</button>';
  }

  function openPatternModal(pattern) {
    var backdrop = qs("#pattern-modal");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.id = "pattern-modal";
      backdrop.className = "modal-backdrop";
      backdrop.setAttribute("role", "dialog");
      backdrop.setAttribute("aria-modal", "true");
      document.body.appendChild(backdrop);
    }
    var favorite = getFavorites().indexOf(pattern.name) > -1;
    backdrop.innerHTML =
      '<div class="modal-card">' +
        '<div class="modal-head"><div><span class="tag">' + escapeHTML(pattern.category) + '</span><h2>' + escapeHTML(pattern.name) + '</h2></div><button class="close-btn" type="button" id="pattern-close" aria-label="关闭详情">关闭</button></div>' +
        (patternIconMap[pattern.name] ? '<div class="pattern-modal-icon"><svg viewBox="0 0 100 100" aria-hidden="true"><use href="#' + patternIconMap[pattern.name] + '"></use></svg></div>' : '') +
        '<p class="reading-meta">' + escapeHTML(pattern.origin) + '</p>' +
        '<p>' + escapeHTML(pattern.meaning) + '</p>' +
        '<h3>造型核心</h3>' + listMarkup(pattern.features) +
        '<h3>AI提示词模板</h3><div class="prompt-box">' + escapeHTML(pattern.prompt) + '</div>' +
        '<h3>使用边界</h3><p>' + escapeHTML(pattern.avoid) + '</p>' +
        '<div class="button-row"><button class="btn btn-primary" type="button" id="pattern-copy">复制提示词</button><button class="btn btn-secondary favorite-btn" type="button" id="pattern-favorite">' + (favorite ? "已收藏" : "收藏纹样") + '</button></div>' +
      '</div>';
    backdrop.classList.add("open");
    qs("#pattern-close", backdrop).addEventListener("click", closePatternModal);
    qs("#pattern-copy", backdrop).addEventListener("click", function () {
      copyText(pattern.prompt, "纹样提示词已复制");
    });
    qs("#pattern-favorite", backdrop).addEventListener("click", function () {
      toggleFavorite(pattern.name);
      qs("#pattern-favorite", backdrop).textContent = getFavorites().indexOf(pattern.name) > -1 ? "已收藏" : "收藏纹样";
      toast(getFavorites().indexOf(pattern.name) > -1 ? "已加入个人纹样库" : "已取消收藏");
    });
    backdrop.addEventListener("click", function (event) {
      if (event.target === backdrop) closePatternModal();
    });
  }

  function closePatternModal() {
    var modal = qs("#pattern-modal");
    if (modal) modal.classList.remove("open");
  }

  function getFavorites() {
    try {
      return JSON.parse(localStorage.getItem("meishiji-pattern-favorites") || "[]");
    } catch (error) {
      return [];
    }
  }

  function toggleFavorite(name) {
    var favorites = getFavorites();
    var index = favorites.indexOf(name);
    if (index > -1) favorites.splice(index, 1);
    else favorites.push(name);
    localStorage.setItem("meishiji-pattern-favorites", JSON.stringify(favorites));
  }

  function renderPatternTool(container) {
    if (!container || !data.patterns) return;
    var categories = ["全部", "几何", "自然", "瑞兽", "跨地域"];
    var favoritesOnly = false;

    function render() {
      var favorites = getFavorites();
      var items = data.patterns.filter(function (pattern) {
        var categoryMatch = activePatternCategory === "全部" || pattern.category === activePatternCategory;
        var favoriteMatch = !favoritesOnly || favorites.indexOf(pattern.name) > -1;
        return categoryMatch && favoriteMatch;
      });
      container.innerHTML =
        '<div class="pattern-toolbar">' + categories.map(function (category) {
          return '<button class="chip-btn' + (category === activePatternCategory ? " active" : "") + '" type="button" data-category="' + category + '">' + category + '</button>';
        }).join("") + '<button class="chip-btn' + (favoritesOnly ? " active" : "") + '" type="button" id="favorites-only">我的收藏</button></div>' +
        (items.length ? '<div class="pattern-grid">' + items.map(patternCard).join("") + '</div>' : '<div class="empty-state">还没有收藏纹样。点击任意纹样卡片，在详情中收藏。</div>');

      qa("[data-category]", container).forEach(function (button) {
        button.addEventListener("click", function () {
          activePatternCategory = button.dataset.category;
          render();
        });
      });
      qs("#favorites-only", container).addEventListener("click", function () {
        favoritesOnly = !favoritesOnly;
        render();
      });
      qa(".pattern-card", container).forEach(function (button) {
        button.addEventListener("click", function () {
          var pattern = data.patterns.filter(function (item) {
            return item.name === button.dataset.name;
          })[0];
          openPatternModal(pattern);
        });
      });
    }

    render();
  }

  function renderCompareTool(container) {
    if (!container || !data.comparisons) return;
    var themes = Object.keys(data.comparisons);

    function render() {
      var item = data.comparisons[activeCompareTheme];
      container.innerHTML =
        '<div class="compare-tabs">' + themes.map(function (theme) {
          return '<button class="tab-btn' + (theme === activeCompareTheme ? " active" : "") + '" type="button" data-theme="' + theme + '">' + theme + '</button>';
        }).join("") + '</div>' +
        '<div class="compare-shell"><div class="compare-columns">' +
          '<article class="compare-side"><h3>' + escapeHTML(item.leftTitle) + '</h3><p>' + escapeHTML(item.leftSummary) + '</p>' + listMarkup(item.leftPoints, "compare-list") + '</article>' +
          '<article class="compare-side"><h3>' + escapeHTML(item.rightTitle) + '</h3><p>' + escapeHTML(item.rightSummary) + '</p>' + listMarkup(item.rightPoints, "compare-list") + '</article>' +
        '</div><div class="compare-prompt"><strong>风格迁移提示</strong><p>' + escapeHTML(item.prompt) + '</p><button class="btn btn-secondary" type="button" id="compare-copy">复制迁移提示</button></div></div>';
      qa("[data-theme]", container).forEach(function (button) {
        button.addEventListener("click", function () {
          activeCompareTheme = button.dataset.theme;
          render();
        });
      });
      qs("#compare-copy", container).addEventListener("click", function () {
        copyText(activeCompareTheme + "：" + item.prompt, "风格迁移提示已复制");
      });
    }

    render();
  }

  function matchSources(sourceText, sources) {
    var text = sourceText || "";
    var matches = [];
    function add(source) {
      if (!source || !source.url) return;
      if (!matches.some(function (item) { return item.url === source.url; })) matches.push(source);
    }
    SOURCE_KEYWORDS.forEach(function (rule) {
      var sourceMentionsRule = rule.match.some(function (term) {
        return text.indexOf(term) > -1;
      });
      if (!sourceMentionsRule) return;
      (sources || []).forEach(function (source) {
        var haystack = [source.title, source.source, source.url, source.desc].filter(Boolean).join(" ");
        var sourceMatchesRule = rule.match.some(function (term) {
          return haystack.indexOf(term) > -1;
        });
        if (sourceMatchesRule) add(source);
      });
    });
    (sources || []).forEach(function (source) {
      if (source.source && text.indexOf(source.source) > -1) add(source);
    });
    return matches.slice(0, 3);
  }

  function renderSourceLinks(section, lesson, index) {
    var links = section.sourceUrls && section.sourceUrls.length
      ? section.sourceUrls
      : matchSources(section.source, lesson.sources);
    if (links.length === 1) {
      return '<span class="source-links"><a class="source-link external" href="' + links[0].url +
        '" target="_blank" rel="noopener">查看公开来源</a></span>';
    }
    if (links.length > 1) {
      var listId = "source-links-section-" + (index + 1);
      return '<span class="source-links"><button class="source-links-toggle" type="button" aria-expanded="false" aria-controls="' +
        listId + '">查看公开来源 (' + links.length + ')</button><span class="source-links-list" id="' +
        listId + '">' + links.map(function (link) {
          return '<a href="' + link.url + '" target="_blank" rel="noopener">' + escapeHTML(link.title || link.source || "公开来源") + '</a>';
        }).join("") + '</span></span>';
    }
    return '<span class="source-links"><a class="source-link anchor" href="#reading">查看本课延伸阅读</a></span>';
  }

  function renderLesson() {
    var lesson = lessonBySlug(lessonSlug);
    if (!lesson) return;
    document.title = lesson.title + " | " + data.meta.name;
    var title = qs("#lesson-title");
    var summary = qs("#lesson-summary");
    var meta = qs("#lesson-meta");
    if (title) title.textContent = lesson.title;
    if (summary) summary.textContent = lesson.summary;
    if (meta) meta.innerHTML = '<span>' + String(lesson.index).padStart(2, "0") + '</span><span>' + escapeHTML(lesson.level) + '</span><span>' + escapeHTML(lesson.duration) + '</span>';

    var toc = qs("#lesson-toc");
    var content = qs("#lesson-content");
    if (!content) return;
    var tocRows = lesson.sections.map(function (section, index) {
      return '<a href="#section-' + (index + 1) + '">' + (index + 1) + '. ' + escapeHTML(section.title) + '</a>';
    });
    tocRows.push('<a href="#interactive">工具实践</a>', '<a href="#practice">练习与思考</a>', '<a href="#quiz">知识检测</a>', '<a href="#reading">延伸阅读</a>');
    if (toc) toc.innerHTML = '<h2>本课目录</h2>' + tocRows.join("");

    var sectionMarkup = lesson.sections.map(function (section, index) {
      var html = '<section class="content-section" id="section-' + (index + 1) + '">' +
        '<h2><span class="section-number">' + (index + 1) + '</span>' + escapeHTML(section.title) + '</h2>';
      if (section.source) {
        html += '<div class="source-line content-source-line"><span class="source-text">' + escapeHTML(section.source) + '</span>' +
          renderSourceLinks(section, lesson, index) + '</div>';
      }
      (section.paragraphs || []).forEach(function (paragraph) {
        html += '<p>' + escapeHTML(paragraph) + '</p>';
      });
      if (section.insight) html += '<div class="insight-box"><strong>要点：</strong>' + escapeHTML(section.insight) + '</div>';
      html += listMarkup(section.list);
      if (section.compare) {
        html += '<table class="compare-table"><thead><tr><th>类型</th><th>视觉特征</th><th>适用场景</th></tr></thead><tbody>' +
          section.compare.map(function (row) {
            return '<tr><td>' + row.map(escapeHTML).join('</td><td>') + '</td></tr>';
          }).join("") + '</tbody></table>';
      }
      if (section.table) html += tableMarkup(section.table);
      if (section.pipeline) html += '<div class="pattern-mini-grid">' + section.pipeline.map(function (step, stepIndex) {
        return '<div class="pattern-cell">' + (stepIndex + 1) + '<small>' + escapeHTML(step) + '</small></div>';
      }).join("") + '</div>';
      html += '</section>';
      return html;
    }).join("");

    content.innerHTML = sectionMarkup +
      '<section class="content-section" id="interactive"><h2><span class="section-number">工</span>工具实践</h2><div class="interactive-card" id="lesson-interactive"></div></section>' +
      '<section class="content-section" id="practice"><h2><span class="section-number">练</span>练习与思考</h2><div class="exercise-card">' +
        '<span class="exercise-label">操作练习</span>' +
        '<p><strong>任务：</strong>' + escapeHTML(lesson.exercise.prompt) + '</p>' +
        '<ol class="number-list">' + lesson.exercise.steps.map(function (step) { return '<li>' + escapeHTML(step) + '</li>'; }).join("") + '</ol>' +
        '<button class="btn btn-quiet hint-toggle" type="button" aria-expanded="false"' + (lesson.exercise.thinking ? ' aria-controls="exercise-thinking"' : '') + '>查看思路</button><div class="hint-content">' + escapeHTML(lesson.exercise.hint) + '</div>' +
      '</div>' + (lesson.exercise.thinking ? (
        '<div class="thinking-card is-hidden" id="exercise-thinking">' +
          '<span class="exercise-label">深度思考</span>' +
          '<h3>核心问题</h3><p class="thinking-question">' + escapeHTML(lesson.exercise.thinking.question) + '</p>' +
          '<h3>思考路径</h3><ol class="number-list">' + lesson.exercise.thinking.path.map(function (item) { return '<li>' + escapeHTML(item) + '</li>'; }).join("") + '</ol>' +
          '<h3>延伸追问</h3><ul class="plain-list">' + lesson.exercise.thinking.extensions.map(function (item) { return '<li>' + escapeHTML(item) + '</li>'; }).join("") + '</ul>' +
          '<h3>常见误区</h3><ul class="pitfall-list">' + lesson.exercise.thinking.pitfalls.map(function (item) { return '<li>' + escapeHTML(item) + '</li>'; }).join("") + '</ul>' +
        '</div>'
      ) : '') + '</section>' +
      '<section class="content-section" id="quiz"><h2><span class="section-number">测</span>知识检测</h2><div class="quiz" id="lesson-quiz"></div></section>' +
      '<section class="content-section" id="reading"><h2><span class="section-number">阅</span>延伸阅读</h2><div class="reading-list">' + lesson.sources.map(function (source) {
        return '<article class="reading-item"><a href="' + source.url + '" target="_blank" rel="noopener">' + escapeHTML(source.title) + '</a><div class="reading-meta">' + escapeHTML(source.source) + '</div><div class="reading-desc">' + escapeHTML(source.desc) + '</div></article>';
      }).join("") + '</div></section>' +
      '<nav class="lesson-nav" aria-label="课时导航">' + lessonNav(lesson) + '</nav>';

    renderLessonInteractive(lesson.interactive, qs("#lesson-interactive"), lesson);
    renderQuiz(lesson.quiz, qs("#lesson-quiz"));
    updateLessonNav(lesson);
    initSourceLinkToggles();
  }

  function lessonNav(lesson) {
    var previous = lessons.filter(function (item) { return item.index === lesson.index - 1; })[0];
    var next = lessons.filter(function (item) { return item.index === lesson.index + 1; })[0];
    var left = previous
      ? '<a class="btn btn-secondary" href="../' + previous.slug + '/lesson.html">上一课：' + escapeHTML(previous.title) + '</a>'
      : '<a class="btn btn-secondary" href="../index.html">返回课程首页</a>';
    var right = next
      ? '<a class="btn btn-primary" href="../' + next.slug + '/lesson.html">下一课：' + escapeHTML(next.title) + '</a>'
      : '<a class="btn btn-primary" href="../index.html">返回课程首页</a>';
    var supplement = '<a class="btn btn-quiet" href="../supplement.html">补充资料包</a>';
    return left + supplement + right;
  }

  function updateLessonNav() {
    return true;
  }

  function renderQuiz(items, container) {
    if (!container) return;
    container.innerHTML = items.map(function (item, index) {
      return '<article class="quiz-item" data-quiz="' + index + '"><h3>' + (index + 1) + '. ' + escapeHTML(item.question) + '</h3><div class="quiz-options">' + item.options.map(function (option, optionIndex) {
        return '<label class="quiz-option"><input type="radio" name="quiz-' + index + '" value="' + optionIndex + '"><span>' + escapeHTML(option) + '</span></label>';
      }).join("") + '</div><div class="quiz-feedback" aria-live="polite"></div></article>';
    }).join("");
    items.forEach(function (item, index) {
      qa('input[name="quiz-' + index + '"]', container).forEach(function (input) {
        input.addEventListener("change", function () {
          var feedback = qs(".quiz-feedback", input.closest(".quiz-item"));
          var selected = Number(input.value);
          feedback.className = "quiz-feedback " + (selected === item.correct ? "correct" : "incorrect");
          feedback.textContent = selected === item.correct ? "回答正确。" + item.explanation : "再想想。提示：" + item.explanation;
        });
      });
    });
  }

  function initSourceLinkToggles() {
    qa(".source-links-toggle").forEach(function (button) {
      button.addEventListener("click", function () {
        var list = qs("#" + button.getAttribute("aria-controls"));
        if (!list) return;
        var open = list.classList.toggle("open");
        button.setAttribute("aria-expanded", String(open));
      });
    });
  }

  function bindHints(scope) {
    qa(".hint-toggle", scope).forEach(function (button) {
      if (button.dataset.hintBound === "true") return;
      button.dataset.hintBound = "true";
      button.addEventListener("click", function () {
        var content = button.nextElementSibling;
        if (!content) return;
        var open = content.classList.toggle("show");
        var thinkingCard = button.closest(".content-section") ? qs(".thinking-card", button.closest(".content-section")) : null;
        if (thinkingCard) thinkingCard.classList.toggle("is-hidden", !open);
        button.setAttribute("aria-expanded", String(open));
        button.textContent = open ? "收起思路" : "查看思路";
      });
    });
  }

  function selectMarkup(label, id, options) {
    return '<div class="control"><label for="' + id + '">' + label + '</label><select id="' + id + '">' + options.map(function (option) {
      return '<option value="' + escapeHTML(option) + '">' + escapeHTML(option) + '</option>';
    }).join("") + '</select></div>';
  }

  function renderLessonInteractive(config, container, lesson) {
    if (!container || !config) return;
    if (config.type === "palette") {
      container.innerHTML = '<h3>' + escapeHTML(config.title) + '</h3><p>' + escapeHTML(config.description) + '</p><div id="lesson-palette"></div>';
      renderPaletteTool(qs("#lesson-palette", container), false);
      return;
    }
    if (config.type === "pattern") {
      container.innerHTML = '<h3>' + escapeHTML(config.title) + '</h3><p>' + escapeHTML(config.description) + '</p>' +
        '<div class="interactive-controls">' + selectMarkup("纹样", "pattern-name", data.patterns.map(function (item) { return item.name; })) +
        selectMarkup("层级", "pattern-level", ["主体纹样", "辅助纹样", "底纹"]) +
        selectMarkup("重复方式", "pattern-repeat", ["二方连续", "四方连续", "单独居中", "自由散点"]) +
        selectMarkup("载体", "pattern-carrier", ["织物", "瓷器", "建筑彩画", "书籍装帧"]) + '</div>' +
        '<div class="prompt-box" id="pattern-output"></div><div class="button-row" style="margin-top:12px"><button class="btn btn-primary" type="button" id="pattern-build">生成提示词</button><button class="btn btn-secondary" type="button" id="pattern-copy-lesson">复制</button></div>';
      var build = function () {
        var pattern = data.patterns.filter(function (item) { return item.name === qs("#pattern-name", container).value; })[0];
        var level = qs("#pattern-level", container).value;
        var repeat = qs("#pattern-repeat", container).value;
        var carrier = qs("#pattern-carrier", container).value;
        qs("#pattern-output", container).textContent = pattern.prompt + "，" + level + "，以" + repeat + "排列，应用于" + carrier + "，保持结构清晰与层级克制";
      };
      qs("#pattern-build", container).addEventListener("click", build);
      qs("#pattern-copy-lesson", container).addEventListener("click", function () { copyText(qs("#pattern-output", container).textContent, "纹样提示词已复制"); });
      build();
      return;
    }
    if (config.type === "architecture") {
      container.innerHTML = '<h3>' + escapeHTML(config.title) + '</h3><p>' + escapeHTML(config.description) + '</p>' +
        '<div class="interactive-controls">' + selectMarkup("建筑体系", "arch-system", ["江南园林", "徽派民居聚落", "唐宋宫殿", "哥特式教堂", "拜占庭集中式空间", "巴洛克公共建筑"]) +
        selectMarkup("镜头", "arch-shot", ["远景全景", "中景街巷", "近景构件"]) + selectMarkup("材料", "arch-material", ["粉墙瓦灰与木褐", "石材与灰泥", "砖石与铜绿", "木材与矿物彩绘"]) +
        selectMarkup("天气", "arch-weather", ["清晨薄雾", "午后直射光", "雨中湿润", "黄昏暖光"]) + '</div><div class="prompt-box" id="arch-output"></div>' +
        '<div class="button-row" style="margin-top:12px"><button class="btn btn-primary" type="button" id="arch-build">生成结构化描述</button></div>';
      qs("#arch-build", container).addEventListener("click", function () {
        var value = qs("#arch-system", container).value + "，" + qs("#arch-shot", container).value + "，结构关系清楚，关键构件可见，" + qs("#arch-material", container).value + "，" + qs("#arch-weather", container).value + "，尺度真实，避免跨体系结构混搭";
        qs("#arch-output", container).textContent = value;
        toast("建筑描述已生成");
      });
      qs("#arch-build", container).click();
      return;
    }
    if (config.type === "painting") {
      container.innerHTML = '<h3>' + escapeHTML(config.title) + '</h3><p>' + escapeHTML(config.description) + '</p>' +
        '<div class="interactive-controls"><div class="control"><label for="paint-subject">新主体</label><input id="paint-subject" type="text" value="雨夜中的现代城市庭院"></div>' +
        selectMarkup("绘画逻辑", "paint-system", ["中国山水游观", "工笔花鸟秩序", "敦煌壁画叙事", "文艺复兴稳定结构", "巴洛克强光暗部", "印象派色彩观察"]) +
        selectMarkup("媒介", "paint-medium", ["水墨纸本", "矿物壁画", "油彩画布", "细密线描"]) +
        selectMarkup("构图", "paint-composition", ["多重景深", "中心叙事", "横向展开", "对角线动势"]) + '</div><div class="prompt-box" id="paint-output"></div><div class="button-row" style="margin-top:12px"><button class="btn btn-primary" type="button" id="paint-build">生成迁移句式</button></div>';
      qs("#paint-build", container).addEventListener("click", function () {
        var value = "将" + qs("#paint-subject", container).value + "转化为" + qs("#paint-system", container).value + "的观察方式，采用" + qs("#paint-composition", container).value + "，" + qs("#paint-medium", container).value + "，保留原创主体与构图，不复现任何具体作品";
        qs("#paint-output", container).textContent = value;
        toast("风格迁移句式已生成");
      });
      qs("#paint-build", container).click();
      return;
    }
    if (config.type === "material") {
      container.innerHTML = '<h3>' + escapeHTML(config.title) + '</h3><p>' + escapeHTML(config.description) + '</p>' +
        '<div class="interactive-controls">' + selectMarkup("材质", "material-name", ["陶瓷釉面", "漆器涂饰", "玉器温润", "青铜氧化", "织锦纤维"]) +
        selectMarkup("表面", "material-surface", ["细密微痕", "自然开片", "铸造起伏", "经纬织纹", "层叠涂饰"]) +
        selectMarkup("光线", "material-light", ["柔和漫射光", "窄边侧光", "阴天散射光", "暖色低角度光"]) +
        selectMarkup("镜头", "material-shot", ["微距局部", "中景器物", "近景边缘"]) + '</div><div class="prompt-box" id="material-output"></div><div class="button-row" style="margin-top:12px"><button class="btn btn-primary" type="button" id="material-build">生成材质描述</button></div>';
      qs("#material-build", container).addEventListener("click", function () {
        var value = qs("#material-name", container).value + "，" + qs("#material-surface", container).value + "，" + qs("#material-light", container).value + "，自然使用痕迹，边缘反射与内部层次分开，" + qs("#material-shot", container).value + "，避免塑料高光";
        qs("#material-output", container).textContent = value;
      });
      qs("#material-build", container).click();
      return;
    }
    if (config.type === "workflow") {
      var stages = ["主题与用途", "配色职责", "主体与构图", "纹样层级", "材质与光线", "氛围与修正"];
      var activeStage = 0;
      container.innerHTML = '<h3>' + escapeHTML(config.title) + '</h3><p>' + escapeHTML(config.description) + '</p><div class="stepper" id="workflow-stepper"></div><div class="prompt-box" id="workflow-output"></div>';
      function renderSteps() {
        qs("#workflow-stepper", container).innerHTML = stages.map(function (stage, index) {
          return '<button class="step-row ' + (index === activeStage ? "active" : (index < activeStage ? "done" : "")) + '" type="button" data-stage="' + index + '"><span>' + (index + 1) + '</span><span>' + stage + '</span><span>' + (index < activeStage ? "已锁定" : "待设置") + '</span></button>';
        }).join("");
        qa("[data-stage]", container).forEach(function (button) {
          button.addEventListener("click", function () {
            activeStage = Number(button.dataset.stage);
            renderSteps();
          });
        });
        var stageText = [
          "用途：国风插画封面。主体：雨后庭院中的现代人物。",
          "色彩：宋代青瓷，月白为背景，黛青压暗部，朱砂仅点衣角。",
          "构图：中景，人物偏向右侧，左侧保留院落路径和留白。",
          "纹样：祥云作辅助，水纹作低对比底纹，不做满铺。",
          "材质：纸本水墨底，织物有经纬，金属只有轻微暖光。",
          "氛围：细雨、湿度、柔和漫射光，局部修正人物结构与纹样方向。"
        ][activeStage];
        qs("#workflow-output", container).textContent = stageText;
      }
      renderSteps();
      return;
    }
    if (config.type === "layout") {
      container.innerHTML = '<h3>' + escapeHTML(config.title) + '</h3><p>' + escapeHTML(config.description) + '</p>' +
        '<div class="interactive-controls">' + selectMarkup("视觉中心", "layout-center", ["器物轮廓", "人物剪影", "建筑入口", "标题开光"]) +
        selectMarkup("装饰密度", "layout-density", ["克制", "中等", "较密"]) + selectMarkup("传统承托", "layout-support", ["留白与轴线", "边框纹样", "底纹与开光", "材质与纸张"]) + '</div>' +
        '<div class="pattern-mini-grid" id="layout-preview"></div><div class="prompt-box" id="layout-output"></div><div class="button-row" style="margin-top:12px"><button class="btn btn-primary" type="button" id="layout-build">检查信息层级</button></div>';
      qs("#layout-build", container).addEventListener("click", function () {
        var density = qs("#layout-density", container).value;
        qs("#layout-preview", container).innerHTML = '<div class="pattern-cell">标题</div><div class="pattern-cell">' + escapeHTML(qs("#layout-center", container).value) + '</div><div class="pattern-cell">' + escapeHTML(qs("#layout-support", container).value) + '</div>';
        qs("#layout-output", container).textContent = "信息顺序：主标题 -> " + qs("#layout-center", container).value + " -> 时间地点 -> 辅助信息。装饰密度：" + density + "。传统元素由" + qs("#layout-support", container).value + "承担，标题区域保持清楚。";
      });
      qs("#layout-build", container).click();
      return;
    }
    if (config.type === "scene") {
      container.innerHTML = '<h3>' + escapeHTML(config.title) + '</h3><p>' + escapeHTML(config.description) + '</p>' +
        '<div class="interactive-controls">' + selectMarkup("地域空间", "scene-region", ["江南园林", "徽派院落", "唐宋宫苑", "哥特中庭", "拜占庭室内"]) +
        selectMarkup("时间", "scene-time", ["清晨", "午后", "黄昏", "雨夜"]) + selectMarkup("叙事焦点", "scene-focus", ["人物", "器物", "建筑入口", "水面"]) + '</div>' +
        '<div class="scene-stage" id="scene-stage"><span class="scene-sky"></span><span class="scene-light"></span><span class="scene-ground"></span><span class="scene-wall"></span><span class="scene-roof"></span><span class="scene-column"></span></div>' +
        '<div class="prompt-box" id="scene-output" style="margin-top:12px"></div><div class="button-row" style="margin-top:12px"><button class="btn btn-primary" type="button" id="scene-build">生成场景描述</button></div>';
      var renderScene = function () {
        var stage = qs("#scene-stage", container);
        var time = qs("#scene-time", container).value;
        var sky = qs(".scene-sky", stage);
        var light = qs(".scene-light", stage);
        if (time === "黄昏") {
          sky.style.background = "#c39e83";
          light.style.background = "rgba(137, 75, 54, 0.26)";
          light.style.left = "56%";
        } else if (time === "雨夜") {
          sky.style.background = "#53616a";
          light.style.background = "rgba(115, 139, 145, 0.2)";
          light.style.left = "6%";
        } else if (time === "午后") {
          sky.style.background = "#ded5bd";
          light.style.background = "rgba(199, 161, 155, 0.22)";
          light.style.left = "68%";
        } else {
          sky.style.background = "#d8dac7";
          light.style.background = "rgba(158, 169, 141, 0.18)";
          light.style.left = "62%";
        }
        qs("#scene-output", container).textContent = qs("#scene-region", container).value + "，" + time + "，主光方向明确，前景建立尺度，中景承载" + qs("#scene-focus", container).value + "，远景保持空气层次，建筑结构真实，只保留一个叙事焦点";
      };
      qs("#scene-build", container).addEventListener("click", function () { renderScene(); toast("场景描述已生成"); });
      renderScene();
      return;
    }
    if (config.type === "style") {
      var locks = ["色相区间", "光线方向", "媒介与表面", "线条方式", "镜头距离", "构图骨架"];
      container.innerHTML = '<h3>' + escapeHTML(config.title) + '</h3><p>' + escapeHTML(config.description) + '</p><div class="style-lock-grid">' + locks.map(function (item, index) {
        return '<label class="lock-option"><input type="checkbox" value="' + escapeHTML(item) + '"' + (index < 4 ? " checked" : "") + '><span>' + escapeHTML(item) + '</span></label>';
      }).join("") + '</div><div class="prompt-box" id="style-output"></div><div class="button-row" style="margin-top:12px"><button class="btn btn-primary" type="button" id="style-build">生成风格锁</button></div>';
      qs("#style-build", container).addEventListener("click", function () {
        var selected = qa("input:checked", container).map(function (input) { return input.value; });
        qs("#style-output", container).textContent = "固定" + selected.join("、") + "。每轮只替换一个变量。负面词仅保留：塑料高光、过饱和、结构粘连、比例失衡、纹样无方向重复。";
      });
      qs("#style-build", container).click();
      return;
    }
    if (config.type === "capstone") {
      var abilities = ["配色", "纹样", "建筑", "绘画", "材质"];
      container.innerHTML = '<h3>' + escapeHTML(config.title) + '</h3><p>' + escapeHTML(config.description) + '</p>' +
        '<div class="interactive-controls">' + selectMarkup("项目用途", "capstone-use", ["国风插画封面", "文创包装", "场景概念图", "传统风海报"]) + '</div>' +
        '<div class="style-lock-grid">' + abilities.map(function (ability, index) {
          return '<label class="lock-option"><input type="checkbox" value="' + ability + '"' + (index < 3 ? " checked" : "") + '><span>' + ability + '</span></label>';
        }).join("") + '</div><div class="prompt-box" id="capstone-output"></div><div class="button-row" style="margin-top:12px"><button class="btn btn-primary" type="button" id="capstone-build">生成项目清单</button></div>';
      qs("#capstone-build", container).addEventListener("click", function () {
        var selected = qa("input:checked", container).map(function (input) { return input.value; });
        if (selected.length !== 3) {
          toast("请选择正好三项能力");
          return;
        }
        qs("#capstone-output", container).textContent = "项目：" + qs("#capstone-use", container).value + "。主能力：" + selected.join("、") + "。交付：原创主视觉、五色说明卡、纹样结构说明、可复现提示词、公开来源记录、文化版权自检表。";
      });
      qs("#capstone-build", container).click();
      return;
    }
    container.innerHTML = '<h3>' + escapeHTML(config.title) + '</h3><p>' + escapeHTML(config.description) + '</p>';
    if (lesson.exercise) {
      container.insertAdjacentHTML("beforeend", '<div class="prompt-box">' + escapeHTML(lesson.exercise.prompt) + '</div>');
    }
  }

  function initSelectionTools() {
    if (page !== "lesson") return;
    var toolbar = document.createElement("div");
    toolbar.className = "selection-toolbar";
    toolbar.setAttribute("aria-label", "选中文本工具");
    toolbar.innerHTML = '<button type="button" data-action="ask">提问</button><button type="button" data-action="modify">修改要求</button><button type="button" data-action="note">划线笔记</button>';
    document.body.appendChild(toolbar);

    var dialog = document.createElement("div");
    dialog.className = "modal-backdrop";
    dialog.innerHTML = '<div class="modal-card"><div class="modal-head"><div><span class="tag">选中文本</span><h2>生成修改提示</h2></div><button class="close-btn" type="button" id="selection-close">关闭</button></div><p id="selection-source"></p><label for="selection-instruction"><strong>修改要求</strong></label><textarea id="selection-instruction" placeholder="例如：压缩为一段，保留来源标注并解释术语"></textarea><div class="button-row" style="margin-top:14px"><button class="btn btn-primary" type="button" id="selection-copy">复制修改提示</button></div></div>';
    document.body.appendChild(dialog);

    var selectedNode = null;
    function currentSelection() {
      var selection = window.getSelection();
      return selection && !selection.isCollapsed ? selection.toString().trim() : "";
    }
    function hideToolbar() {
      toolbar.classList.remove("visible");
    }
    function contextText() {
      var lesson = lessonBySlug(lessonSlug);
      return "课程：" + data.meta.name + "\n课时：" + (lesson ? lesson.title : "") + "\n";
    }
    document.addEventListener("mouseup", function (event) {
      if (toolbar.contains(event.target) || dialog.contains(event.target)) return;
      var text = currentSelection();
      if (text.length < 6) {
        hideToolbar();
        return;
      }
      selectedNode = window.getSelection().anchorNode;
      toolbar.classList.add("visible");
      var width = toolbar.offsetWidth;
      var height = toolbar.offsetHeight;
      var left = Math.min(Math.max(12, event.clientX - width / 2), window.innerWidth - width - 12);
      var top = event.clientY + 14;
      if (top + height > window.innerHeight - 12) top = event.clientY - height - 14;
      toolbar.style.left = left + "px";
      toolbar.style.top = top + "px";
    });
    document.addEventListener("mousedown", function (event) {
      if (!toolbar.contains(event.target) && !dialog.contains(event.target)) hideToolbar();
    });
    document.addEventListener("scroll", hideToolbar, { passive: true });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        hideToolbar();
        dialog.classList.remove("open");
      }
    });
    toolbar.addEventListener("click", function (event) {
      var button = event.target.closest("button");
      if (!button) return;
      var text = currentSelection();
      if (button.dataset.action === "ask") {
        copyText(contextText() + "\n我选中了：\n" + text + "\n\n我的问题：\n", "提问上下文已复制");
        hideToolbar();
      }
      if (button.dataset.action === "modify") {
        qs("#selection-source", dialog).textContent = text;
        dialog.classList.add("open");
        hideToolbar();
      }
      if (button.dataset.action === "note") {
        wrapSelectionAsNote();
        hideToolbar();
      }
    });
    qs("#selection-close", dialog).addEventListener("click", function () { dialog.classList.remove("open"); });
    qs("#selection-copy", dialog).addEventListener("click", function () {
      var source = qs("#selection-source", dialog).textContent;
      var instruction = qs("#selection-instruction", dialog).value.trim() || "请判断合理修改方向";
      copyText(contextText() + "\n选中原文：\n" + source + "\n\n修改要求：\n" + instruction, "修改提示已复制");
      dialog.classList.remove("open");
    });

    function wrapSelectionAsNote() {
      var selection = window.getSelection();
      if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;
      var range = selection.getRangeAt(0);
      try {
        var span = document.createElement("span");
        span.className = "note-underline";
        span.style.borderBottom = "2px solid #c7a19b";
        span.dataset.note = "1";
        range.surroundContents(span);
        selection.removeAllRanges();
        toast("已添加划线笔记，点击划线可取消");
      } catch (error) {
        toast("这段选区跨越多个结构，暂时无法划线");
      }
    }

    document.addEventListener("click", function (event) {
      var note = event.target.closest ? event.target.closest(".note-underline") : null;
      if (!note || currentSelection()) return;
      var parent = note.parentNode;
      while (note.firstChild) parent.insertBefore(note.firstChild, note);
      parent.removeChild(note);
      parent.normalize();
      toast("已取消划线笔记");
    });
  }

  function mobileIcon(name) {
    var icons = {
      home: '<path d="M3 11.5 12 4l9 7.5"></path><path d="M5.5 10.5V20h13v-9.5"></path><path d="M9.5 20v-5h5v5"></path>',
      course: '<path d="M5 4h14v16H5z"></path><path d="M8 8h8M8 12h8M8 16h5"></path>',
      tools: '<path d="M4 19h16"></path><path d="M6 19V9l6-4 6 4v10"></path><path d="M9 19v-6h6v6"></path>',
      about: '<circle cx="12" cy="12" r="8"></circle><path d="M12 11v5M12 8h.01"></path>',
      advanced: '<path d="M5 5h14v14H5z"></path><path d="M8 9h8M8 13h8M8 17h4"></path>'
    };
    return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + (icons[name] || icons.course) + '</svg>';
  }

  function mobileRoot() {
    if (typeof root === "string" && root) return root;
    return location.pathname.indexOf("/tools/") > -1 ? "../" : "";
  }

  function initMobileNavigation() {
    if (qs("#mobile-bottom-nav")) return;
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
      toggle.innerHTML = '<span></span><span></span><span></span>';
      nav.insertBefore(toggle, links);
      toggle.addEventListener("click", function () {
        var header = toggle.closest(".site-header");
        var open = header.classList.toggle("nav-open");
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "关闭导航菜单" : "打开导航菜单");
      });
      links.addEventListener("click", function (event) {
        if (!event.target.closest("a")) return;
        var header = toggle.closest(".site-header");
        header.classList.remove("nav-open");
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
      window.addEventListener("resize", function () {
        if (window.innerWidth <= 760) return;
        toggle.closest(".site-header").classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      }, { passive: true });
    }

    var base = mobileRoot();
    var path = location.pathname.replace(/\\/g, "/");
    var current = page === "index" ? "home" : "course";
    if (path.indexOf("/tools/") > -1) current = "tools";
    if (page === "extension") current = "course";
    var items = [
      { key: "home", label: "首页", href: base + "index.html" },
      { key: "course", label: "课程", href: base + "index.html#lesson-grid" },
      { key: "tools", label: "工具", href: base + "tools/patterns.html" },
      { key: "about", label: "关于", href: base + "index.html#about" }
    ];
    var bottom = document.createElement("nav");
    bottom.id = "mobile-bottom-nav";
    bottom.className = "mobile-bottom-nav";
    bottom.setAttribute("aria-label", "手机端快捷导航");
    bottom.innerHTML = items.map(function (item) {
      return '<a href="' + item.href + '"' + (item.key === current ? ' aria-current="page"' : "") + '>' +
        mobileIcon(item.key) + '<span>' + item.label + '</span></a>';
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
        var bodyNode = qs(".mobile-toc-body", details);
        while (bodyNode && bodyNode.firstChild) toc.appendChild(bodyNode.firstChild);
        details.remove();
      }
    }
    apply();
    if (query.addEventListener) query.addEventListener("change", apply);
  }

  function init() {
    if (window.PATTERN_ICON_SPRITE && !qs("#pattern-icon-sprite")) {
      var spriteHost = document.createElement("div");
      spriteHost.id = "pattern-icon-sprite";
      spriteHost.setAttribute("aria-hidden", "true");
      spriteHost.style.position = "absolute";
      spriteHost.style.width = "0";
      spriteHost.style.height = "0";
      spriteHost.style.overflow = "hidden";
      spriteHost.innerHTML = window.PATTERN_ICON_SPRITE;
      document.body.insertBefore(spriteHost, document.body.firstChild);
    }
    if (page === "index") renderIndex();
    if (qs("#mini-palette")) renderMiniPalette(qs("#mini-palette"));
    if (qs("#home-palette")) renderPaletteTool(qs("#home-palette"), false);
    if (qs("#pattern-app")) renderPatternTool(qs("#pattern-app"));
    if (qs("#compare-app")) renderCompareTool(qs("#compare-app"));
    if (page === "lesson") renderLesson();
    bindHints(document);
    initSelectionTools();
    initMobileNavigation();
    initMobileToc();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
