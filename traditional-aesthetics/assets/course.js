(function () {
  "use strict";

  var data = window.COURSE_DATA || { lessons: [] };
  var lessons = data.lessons || [];
  var toastTimer = 0;
  var selectedNode = null;
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
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function lessonBySlug(slug) {
    return lessons.filter(function (lesson) {
      return lesson.slug === slug;
    })[0];
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
    toastTimer = window.setTimeout(function () {
      node.classList.remove("show");
    }, 2600);
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
      navigator.clipboard.writeText(text).then(function () {
        toast(message);
      }).catch(fallback);
      return;
    }
    fallback();
  }

  function renderIndex() {
    var grid = qs("#lesson-grid");
    if (!grid) return;
    grid.innerHTML = lessons.map(function (lesson) {
      var chips = [lesson.level, lesson.duration, lesson.era].map(function (item) {
        return '<span class="meta-chip">' + escapeHTML(item) + '</span>';
      }).join("");
      return '<a class="lesson-card" href="' + lesson.slug + '/lesson.html" style="--card-accent:' + lesson.accent + '">' +
        '<span class="lesson-index">' + String(lesson.index).padStart(2, "0") + '</span>' +
        '<span class="lesson-card-body"><h3>' + escapeHTML(lesson.title) + '</h3>' +
        '<p>' + escapeHTML(lesson.summary) + '</p><span class="lesson-card-meta">' + chips + '</span></span>' +
        '</a>';
    }).join("");
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
      var listId = "source-links-" + (section.id || index);
      return '<span class="source-links"><button class="source-links-toggle" type="button" aria-expanded="false" aria-controls="' +
        escapeHTML(listId) + '">查看公开来源 (' + links.length + ')</button><span class="source-links-list" id="' +
        escapeHTML(listId) + '">' + links.map(function (link) {
          return '<a href="' + link.url + '" target="_blank" rel="noopener">' + escapeHTML(link.title || link.source || "公开来源") + '</a>';
        }).join("") + '</span></span>';
    }
    return '<span class="source-links"><a class="source-link anchor" href="#reading">查看本课延伸阅读</a></span>';
  }

  function renderSection(section, index, lesson) {
    var html = '<section id="' + escapeHTML(section.id) + '">';
    html += '<h2><span class="section-number">' + String(index + 1).padStart(2, "0") + '</span>' + escapeHTML(section.title) + '</h2>';
    (section.paragraphs || []).forEach(function (paragraph) {
      html += '<p>' + escapeHTML(paragraph) + '</p>';
    });
    if (section.insight) {
      html += '<div class="insight-box"><strong>关键理解</strong><p>' + escapeHTML(section.insight) + '</p></div>';
    }
    if (section.list) {
      html += '<ul class="plain-list">' + section.list.map(function (item) {
        return '<li>' + escapeHTML(item) + '</li>';
      }).join("") + '</ul>';
    }
    if (section.compare) {
      html += '<table class="compare-table"><thead><tr><th>对象</th><th>视觉或材料特征</th><th>观察重点</th></tr></thead><tbody>';
      section.compare.forEach(function (row) {
        html += '<tr>' + row.map(function (cell) {
          return '<td>' + escapeHTML(cell) + '</td>';
        }).join("") + '</tr>';
      });
      html += '</tbody></table>';
    }
    if (section.source) {
      html += '<div class="source-line content-source-line"><span class="source-text">' + escapeHTML(section.source) + '</span>' +
        renderSourceLinks(section, lesson, index) + '</div>';
    }
    html += '</section>';
    return html;
  }

  function renderQuiz(quiz) {
    return quiz.map(function (item, index) {
      var options = item.options.map(function (option, optionIndex) {
        return '<label class="quiz-option"><input type="radio" name="quiz-' + index + '" value="' + optionIndex + '"><span>' +
          escapeHTML(option) + '</span></label>';
      }).join("");
      return '<article class="quiz-item" data-correct="' + item.correct + '" data-explanation="' + escapeHTML(item.explanation) + '">' +
        '<h3>' + (index + 1) + '. ' + escapeHTML(item.question) + '</h3>' +
        '<div class="quiz-options">' + options + '</div>' +
        '<button class="btn btn-secondary quiz-check" type="button">检查答案</button>' +
        '<div class="quiz-result" aria-live="polite"></div>' +
        '</article>';
    }).join("");
  }

  function renderExerciseCard(exercise, label) {
    var steps = (exercise.steps || []).map(function (step) {
      return '<li>' + escapeHTML(step) + '</li>';
    }).join("");
    var meta = [exercise.type, exercise.level, exercise.duration].filter(Boolean).map(function (item) {
      return '<span>' + escapeHTML(item) + '</span>';
    }).join("");
    return '<article class="exercise-card exercise-entry"><div class="exercise-meta">' + meta + '</div>' +
      '<h3>' + escapeHTML(label) + '</h3><p>' + escapeHTML(exercise.prompt) + '</p>' +
      '<ol class="number-list">' + steps + '</ol>' +
      '<button class="hint-toggle" type="button">查看思路</button>' +
      '<div class="hint-content">' + escapeHTML(exercise.hint) + '</div></article>';
  }

  function renderExercise(lesson) {
    var exerciseGroup = window.COURSE_EXERCISES && window.COURSE_EXERCISES[lesson.index];
    var basic = exerciseGroup && exerciseGroup.basic ? exerciseGroup.basic : lesson.exercise;
    var advanced = exerciseGroup && exerciseGroup.advanced ? exerciseGroup.advanced : [];
    var html = '<div class="exercise-stack">' + renderExerciseCard(basic, "观察性入门题") + '</div>';
    if (!advanced.length) return html;
    html = '<div class="exercise-stack">' + renderExerciseCard(basic, "观察性入门题") +
      '<details class="advanced-exercises"><summary><span>进阶思考</span><strong>展开两个进阶练习</strong><small>' +
      advanced.map(function (item) { return escapeHTML(item.type); }).join(" · ") +
      '</small></summary><div class="advanced-exercise-list">' +
      advanced.map(function (item, index) {
        return renderExerciseCard(item, "进阶练习 " + (index + 1));
      }).join("") + '</div></details></div>';
    return html;
  }

  function renderSources(sources) {
    return sources.map(function (source) {
      return '<article class="reading-item"><a href="' + source.url + '" target="_blank" rel="noopener">' +
        escapeHTML(source.title) + '</a><div class="reading-meta">' + escapeHTML(source.source) +
        '</div><div class="reading-desc">' + escapeHTML(source.desc) + '</div></article>';
    }).join("");
  }

  function renderLessonNav(lesson) {
    var previous = lessons.filter(function (item) { return item.index === lesson.index - 1; })[0];
    var next = lessons.filter(function (item) { return item.index === lesson.index + 1; })[0];
    var left = previous
      ? '<a class="btn btn-secondary" href="../' + previous.slug + '/lesson.html">上一课：' + escapeHTML(previous.title) + '</a>'
      : '<span class="btn btn-secondary disabled">这是第一课</span>';
    var right = next
      ? '<a class="btn btn-primary" href="../' + next.slug + '/lesson.html">下一课：' + escapeHTML(next.title) + '</a>'
      : '<span class="btn btn-secondary disabled">课程完结</span>';
    return '<div class="lesson-nav">' + left + right + '</div>';
  }

  function renderLessonShell(lesson) {
    document.title = lesson.title + " | 美识集传统美学通识课";
    var description = qs('meta[name="description"]');
    if (description) description.setAttribute("content", lesson.summary);
    document.documentElement.style.setProperty("--accent", lesson.accent);
    var hero = qs(".lesson-hero");
    if (hero) hero.setAttribute("data-mark", lesson.visualMark);

    qs("#lesson-number").textContent = "第" + String(lesson.index).padStart(2, "0") + "课";
    qs("#lesson-title").textContent = lesson.title;
    qs("#lesson-question").textContent = lesson.question;
    qs("#lesson-summary").textContent = lesson.summary;
    qs("#lesson-meta").innerHTML =
      '<div><dt>层级</dt><dd>' + escapeHTML(lesson.level) + '</dd></div>' +
      '<div><dt>时期</dt><dd>' + escapeHTML(lesson.era) + '</dd></div>' +
      '<div><dt>地区</dt><dd>' + escapeHTML(lesson.region) + '</dd></div>' +
      '<div><dt>资料类型</dt><dd>' + escapeHTML(lesson.sourceType) + '</dd></div>';

    var supplementMarkup = renderSupplements(lesson);
    var supplementToc = supplementMarkup ? '<li><a href="#supplements">补充案例</a></li>' : "";
    qs("#lesson-toc").innerHTML = '<h2>本课目录</h2><ol>' + lesson.sections.map(function (section) {
      return '<li><a href="#' + escapeHTML(section.id) + '">' + escapeHTML(section.title) + '</a></li>';
    }).join("") + supplementToc + '<li><a href="#interactive">互动练习</a></li><li><a href="#quiz">知识检测</a></li><li><a href="#exercise">思考练习</a></li><li><a href="#reading">延伸阅读</a></li></ol>';

    var body = qs("#lesson-body");
    body.innerHTML =
      '<section id="story"><h2><span class="section-number">引</span>先带着问题进入</h2>' +
      '<div class="story-card"><strong>' + escapeHTML(lesson.story.label) + '</strong><p>' + escapeHTML(lesson.story.text) + '</p></div>' +
      '</section>' +
      lesson.sections.map(function (section, index) {
        return renderSection(section, index, lesson);
      }).join("") +
      supplementMarkup +
      '<section id="interactive"><h2><span class="section-number">动</span>互动练习</h2>' +
      '<div class="interactive-panel" id="lesson-interactive"></div></section>' +
      '<section id="quiz"><h2><span class="section-number">测</span>知识检测</h2><div class="quiz-list">' + renderQuiz(lesson.quiz) + '</div></section>' +
      '<section id="exercise"><h2><span class="section-number">练</span>思考练习</h2>' + renderExercise(lesson) + '</section>' +
      '<section id="reading"><h2><span class="section-number">阅</span>延伸阅读</h2><div class="reading-list">' + renderSources(lesson.sources) + '</div></section>' +
      renderLessonNav(lesson);

    renderInteractive(lesson.interactive, qs("#lesson-interactive"));
    initQuiz();
    initExercise();
    initSourceLinkToggles();
    initSelectionTools(lesson);
  }

  function renderSupplementTable(table) {
    if (!table || !table.length) return "";
    var head = table[0] || [];
    return '<table class="compare-table"><thead><tr>' + head.map(function (cell) {
      return '<th>' + escapeHTML(cell) + '</th>';
    }).join("") + '</tr></thead><tbody>' + table.slice(1).map(function (row) {
      return '<tr>' + row.map(function (cell) {
        return '<td>' + escapeHTML(cell) + '</td>';
      }).join("") + '</tr>';
    }).join("") + '</tbody></table>';
  }

  function renderSupplements(lesson) {
    var supplements = window.COURSE_SUPPLEMENTS && window.COURSE_SUPPLEMENTS[lesson.index];
    if (!supplements || !supplements.length) return "";
    var cards = supplements.map(function (item, index) {
      var body = (item.paragraphs || []).map(function (paragraph) {
        return '<p>' + escapeHTML(paragraph) + '</p>';
      }).join("");
      if (item.list) {
        body += '<ul class="plain-list">' + item.list.map(function (line) {
          return '<li>' + escapeHTML(line) + '</li>';
        }).join("") + '</ul>';
      }
      body += renderSupplementTable(item.table || item.compare || item.comp);
      body += '<div class="source-line"><span>' + escapeHTML(item.source) + '</span></div>';
      body += '<a class="supplement-source-link" href="' + item.url + '" target="_blank" rel="noopener">查看公开来源</a>';
      return '<details class="supplement-card"' + (index === 0 ? " open" : "") + '><summary><span>补充 ' +
        String(index + 1).padStart(2, "0") + '</span><strong>' + escapeHTML(item.title) + '</strong><small>' +
        escapeHTML(item.era) + ' · ' + escapeHTML(item.region) + '</small></summary><div class="supplement-body">' +
        '<div class="supplement-type">' + escapeHTML(item.type) + '</div>' + body + '</div></details>';
    }).join("");
    return '<section id="supplements"><h2><span class="section-number">补</span>补充案例</h2>' +
      '<p>本区把公开补充资料整理为可直接查证的案例。涉及争议或无法确认的内容，不写成确定结论。</p>' +
      '<div class="supplement-list">' + cards + '</div></section>';
  }

  function renderInteractive(config, container) {
    if (!container) return;
    var renderers = {
      spot: renderSpot,
      palette: renderPalette,
      pattern: renderPattern,
      builder: renderBuilder,
      perspective: renderPerspective,
      material: renderMaterial,
      costume: renderCostume,
      garden: renderGarden,
      festival: renderFestival,
      life: renderLife,
      calligraphy: renderCalligraphy,
      grottoes: renderGrottoes,
      heritage: renderHeritage
    };
    var renderer = renderers[config.type] || renderSpot;
    renderer(config, container);
  }

  function panelHeader(config) {
    return '<h3>' + escapeHTML(config.title) + '</h3><p>' + escapeHTML(config.description) + '</p>';
  }

  function renderSpot(config, container) {
    var spots = [
      { x: 16, y: 61, mark: "纹", name: "连续回纹", copy: "连续折线来自长期形成的几何装饰经验，常出现在边饰和分隔带。" },
      { x: 42, y: 30, mark: "色", name: "青灰釉色", copy: "低饱和青灰使人联想到陶瓷釉面和湿润空气，不等于某一件文物的测色。" },
      { x: 68, y: 64, mark: "筑", name: "起翘屋面", copy: "屋面轮廓同时回应排水、遮蔽和轻盈的视觉感受。" },
      { x: 82, y: 28, mark: "意", name: "留白构图", copy: "空处参与空间组织，让观看者在画面中寻找路径。" }
    ];
    container.innerHTML = panelHeader(config) + '<div class="spot-scene">' +
      spots.map(function (spot, index) {
        return '<button class="spot-hotspot" type="button" aria-pressed="false" data-spot="' + index +
          '" style="left:' + spot.x + '%;top:' + spot.y + '%">' + spot.mark + '</button>';
      }).join("") + '</div><div class="spot-output" aria-live="polite">点击标记，查看它对应的传统视觉经验。</div>';
    qa(".spot-hotspot", container).forEach(function (button) {
      button.addEventListener("click", function () {
        var spot = spots[Number(button.dataset.spot)];
        qa(".spot-hotspot", container).forEach(function (item) {
          item.setAttribute("aria-pressed", "false");
        });
        button.setAttribute("aria-pressed", "true");
        qs(".spot-output", container).innerHTML = '<strong>' + spot.name + '</strong><br>' + spot.copy;
      });
    });
  }

  function renderPalette(config, container) {
    var palettes = [
      {
        title: "五色关系",
        note: "屏幕参考组合，不表示古代统一色值",
        colors: [
          ["青", "#3E6B72"], ["赤", "#B83A2D"], ["黄", "#D6A22C"], ["白", "#F0EADF"], ["黑", "#1D2422"]
        ]
      },
      {
        title: "汝窑联想",
        note: "参考公开传统色出版物，仅作视觉学习",
        colors: [
          ["天青", "#8EA6A6"], ["月白", "#D6D2C8"], ["灰蓝", "#78919A"], ["釉灰", "#C3C1B8"], ["黛色", "#48575A"]
        ]
      },
      {
        title: "敦煌矿物色",
        note: "暖色统摄，石色并非统一颜料配方",
        colors: [
          ["石青", "#2F6483"], ["石绿", "#587A62"], ["赭石", "#A6533D"], ["土黄", "#C89C58"], ["壁白", "#E6D6B4"]
        ]
      },
      {
        title: "欧洲古典油画",
        note: "用光源、材质和媒介理解画面",
        colors: [
          ["群青", "#344F78"], ["土红", "#83483B"], ["深绿", "#3D5348"], ["暗金", "#A07A42"], ["骨白", "#D8CEB8"]
        ]
      }
    ];
    container.innerHTML = panelHeader(config) + palettes.map(function (palette) {
      return '<section style="margin-top:18px"><h4 style="margin:0 0 8px;font-family:var(--display)">' + palette.title + '</h4>' +
        '<p style="margin:0 0 10px;color:var(--ink-soft);font-size:13px">' + palette.note + '</p>' +
        '<div class="palette-grid">' + palette.colors.map(function (color) {
          return '<article class="palette-card"><button class="palette-swatch" type="button" data-copy="' + color[1] +
            '" style="--swatch:' + color[1] + '"><span>' + color[0] + ' ' + color[1] + '</span></button>' +
            '<h4>' + color[0] + '</h4><p>点击色块复制参考值</p></article>';
        }).join("") + '</div></section>';
    }).join("");
    bindCopyButtons(container);
  }

  function renderPattern(config, container) {
    var rounds = [
      {
        clue: "我用方折线条连续回环，常出现在器物口沿与建筑边饰。",
        answer: "回纹",
        options: ["回纹", "水纹", "冰裂纹", "佩斯利纹"],
        explain: "回纹的核心是方折回环和连续秩序，具体宽度与应用位置会随器物改变。"
      },
      {
        clue: "我由不规则交线分割表面，在不同媒介中可模拟冰面或釉面开片。",
        answer: "冰裂纹",
        options: ["缠枝花卉", "冰裂纹", "凤纹", "希腊回纹"],
        explain: "冰裂纹强调不规则疏密，不应画成完全对称的机械网格。"
      },
      {
        clue: "我以水滴形轮廓长期传播，后来因英国纺织城镇获得一个广泛使用的名称。",
        answer: "佩斯利纹",
        options: ["如意纹", "云雷纹", "佩斯利纹", "茛苕叶纹"],
        explain: "佩斯利纹具有跨地区传播和纺织工艺语境，不应压缩成单一起源故事。"
      },
      {
        clue: "我常以连续枝蔓连接花叶，在瓷器和织物中形成可扩展的装饰骨架。",
        answer: "缠枝花卉纹",
        options: ["水纹", "缠枝花卉纹", "万字纹", "蝙蝠纹"],
        explain: "缠枝花卉的关键是枝蔓连接与花叶层级，不是把多种花随意堆满。"
      }
    ];
    var current = 0;
    var score = 0;
    function draw(feedback) {
      var round = rounds[current];
      container.innerHTML = panelHeader(config) +
        '<div class="pattern-game"><div class="clue-card"><span>线索 ' + (current + 1) + " / " + rounds.length +
        '</span><h4>' + round.clue + '</h4></div><div class="pattern-options">' +
        round.options.map(function (option) {
          return '<button class="pattern-option" type="button" data-option="' + escapeHTML(option) + '">' + escapeHTML(option) + '</button>';
        }).join("") + '</div><div class="pattern-feedback">选择你认为匹配的纹样。</div></div>';
      if (feedback) qs(".pattern-feedback", container).textContent = feedback;
      qa(".pattern-option", container).forEach(function (button) {
        button.addEventListener("click", function () {
          var correct = button.dataset.option === round.answer;
          button.classList.add(correct ? "correct" : "wrong");
          qa(".pattern-option", container).forEach(function (item) {
            if (item.dataset.option === round.answer) item.classList.add("correct");
            item.disabled = true;
          });
          if (correct) score += 1;
          qs(".pattern-feedback", container).textContent = round.explain + " 当前得分：" + score + " / " + rounds.length;
          var next = document.createElement("button");
          next.type = "button";
          next.className = "btn btn-primary";
          next.textContent = current === rounds.length - 1 ? "重新开始" : "下一题";
          next.style.marginTop = "12px";
          next.addEventListener("click", function () {
            current = current === rounds.length - 1 ? 0 : current + 1;
            if (current === 0) score = 0;
            draw("");
          });
          qs(".pattern-feedback", container).appendChild(next);
        });
      });
    }
    draw("");
  }

  function renderBuilder(config, container) {
    var material = {
      "木构": { wall: "#d9c9aa", ground: "#8e6546", note: "梁柱体系为主，重点看节点、屋檐和墙体关系。" },
      "砖木": { wall: "#e4ded2", ground: "#8a7763", note: "砖墙与木构屋面组合，观察承重和防火关系。" },
      "石材": { wall: "#d0cbc2", ground: "#6c7070", note: "石构强调柱式、拱券或墙体厚度。" },
      "生土": { wall: "#cbb188", ground: "#8f724d", note: "生土材料回应气候与地形，表面受日照和雨水影响。" }
    };
    var roof = {
      "庑殿顶": ["#3a4c53", "等级较高，四坡屋面形成稳定轮廓。"],
      "歇山顶": ["#4a5a5e", "屋面组合变化丰富，山花与坡面需要同时观察。"],
      "攒尖顶": ["#40555e", "向中心收束，适合亭、塔等集中式结构。"],
      "悬山顶": ["#53636a", "屋面伸出山墙，与地方民居和气候条件相关。"]
    };
    var structure = {
      "斗拱": "檐下层叠构件承担出挑和传力，并形成重复节奏。",
      "拱券": "弧形结构把荷载分向两侧，观察跨度与支撑关系。",
      "柱式": "柱身、柱头和檐部比例构成古典建筑的视觉语法。",
      "梁架": "梁、枋、檩等构件共同形成木构空间骨架。"
    };
    function selectMarkup(label, id, options) {
      return '<div class="control"><label for="' + id + '">' + label + '</label><select id="' + id + '">' +
        Object.keys(options).map(function (key) {
          return '<option>' + key + '</option>';
        }).join("") + '</select></div>';
    }
    container.innerHTML = panelHeader(config) +
      '<div class="builder-layout"><div class="builder-preview"><div class="architecture-shape" aria-hidden="true"></div></div>' +
      '<div class="builder-readout"><div><div class="control-grid">' +
      selectMarkup("材料", "builder-material", material) +
      selectMarkup("屋顶", "builder-roof", roof) +
      selectMarkup("关键构件", "builder-structure", structure) +
      selectMarkup("色彩", "builder-color", { "粉墙黛瓦": "#e4ded2", "木褐土黄": "#d1b48f", "石白灰蓝": "#c9ced0", "红砖燕尾": "#b9674f" }) +
      '</div></div><div><h4 id="builder-title">木构 · 庑殿顶</h4><p id="builder-copy"></p></div></div></div>';
    function update() {
      var m = qs("#builder-material", container).value;
      var r = qs("#builder-roof", container).value;
      var s = qs("#builder-structure", container).value;
      var c = qs("#builder-color", container).value;
      var shape = qs(".architecture-shape", container);
      shape.style.setProperty("--preview-wall", material[m].wall);
      shape.style.setProperty("--preview-ground", material[m].ground);
      shape.style.setProperty("--preview-roof", roof[r][0]);
      if (c === "红砖燕尾") shape.style.setProperty("--preview-wall", "#b9674f");
      if (c === "木褐土黄") shape.style.setProperty("--preview-wall", "#d1b48f");
      if (c === "石白灰蓝") shape.style.setProperty("--preview-wall", "#c9ced0");
      qs("#builder-title", container).textContent = m + " · " + r + " · " + s;
      qs("#builder-copy", container).textContent = material[m].note + " " + roof[r][1] + " " + structure[s] +
        " 色彩“" + c + "”只用于观察记录，不代表固定历史涂装。";
    }
    qa("select", container).forEach(function (select) {
      select.addEventListener("change", update);
    });
    update();
  }

  function renderPerspective(config, container) {
    var modes = {
      "高远": "视线由山下仰望，近山放大，突出巍峨和高度。",
      "深远": "视线穿过前山看向山后，山体重叠形成幽深层次。",
      "平远": "视线沿水面或低山横向展开，远景压缩，空间显得辽阔。"
    };
    container.innerHTML = panelHeader(config) + '<div class="segmented">' +
      Object.keys(modes).map(function (mode, index) {
        return '<button class="segment-btn' + (index === 0 ? " active" : "") + '" type="button" data-mode="' + mode + '">' + mode + '</button>';
      }).join("") + '</div><div class="perspective-stage"><span class="perspective-label">高远</span>' +
      '<span class="mountain near"></span><span class="mountain far"></span><span class="water-line"></span></div>' +
      '<div class="practice-output"><h4>观看说明</h4><p>' + modes["高远"] + '</p></div>';
    qa("[data-mode]", container).forEach(function (button) {
      button.addEventListener("click", function () {
        var mode = button.dataset.mode;
        qa("[data-mode]", container).forEach(function (item) {
          item.classList.toggle("active", item === button);
        });
        qs(".perspective-label", container).textContent = mode;
        var near = qs(".mountain.near", container);
        var far = qs(".mountain.far", container);
        if (mode === "高远") {
          near.style.transform = "scale(1.35)";
          far.style.opacity = "0.35";
        } else if (mode === "深远") {
          near.style.transform = "scale(0.9) translateY(12px)";
          far.style.opacity = "1";
        } else {
          near.style.transform = "scale(0.7) translateX(-50px)";
          far.style.opacity = "0.72";
        }
        qs(".practice-output p", container).textContent = modes[mode];
      });
    });
  }

  function renderMaterial(config, container) {
    var materials = [
      ["青瓷", "#adc2bb", "釉层","低饱和青绿，表面有柔和反射，重点看釉厚与开片。"],
      ["白瓷", "#eee8db", "胎釉","白色并非单一面色，亮部、暗部和釉层厚度会形成细微冷暖变化。"],
      ["玉器", "#a8b8a0", "纹理","温润和半透感来自矿物结构与打磨，不适合用塑料高光表现。"],
      ["青铜", "#51766d", "铸痕","铸造接缝、氧化层和磨损共同形成深绿褐层次。"],
      ["明式家具", "#8b5d3b", "木纹","重点看纹理方向、构件比例、榫卯和表面包浆。"]
    ];
    var html = panelHeader(config) + '<div class="material-board">' + materials.map(function (item, index) {
      return '<button class="material-tile" type="button" data-material="' + index + '" style="--tile:' + item[1] + '">' +
        '<strong>' + item[0] + '</strong><span>' + item[2] + '</span></button>';
    }).join("") + '</div><div class="practice-output" aria-live="polite"><h4>' + materials[0][0] + '</h4><p>' + materials[0][3] + '</p></div>';
    container.innerHTML = html;
    qa("[data-material]", container).forEach(function (button) {
      button.addEventListener("click", function () {
        var item = materials[Number(button.dataset.material)];
        qs(".practice-output h4", container).textContent = item[0];
        qs(".practice-output p", container).textContent = item[3];
      });
    });
  }

  function renderCostume(config, container) {
    var styles = {
      "汉代深衣": { robe: "#6d3f48", line: "衣襟层叠较为完整，轮廓庄重，常见深色与红色组合。" },
      "宋代褙子": { robe: "#8ca49a", line: "对襟长衫与窄袖形成修长、清雅轮廓，配色偏克制。" },
      "明代袄裙": { robe: "#9a3b4a", line: "上衣与裙形成明确分层，织锦和纹样装饰更有秩序。" },
      "唐代圆领袍": { robe: "#4d6680", line: "圆领袍线条简洁，适合观察交流背景下的领型与袖型变化。" }
    };
    var roles = {
      "文人": "通过层叠和配色表现克制，不堆叠所有装饰。",
      "仕女": "关注高腰或裙装比例，以及织物垂坠和动作关系。",
      "武将": "重点检查肩部、腰带、下装与动作是否便于活动。"
    };
    container.innerHTML = panelHeader(config) +
      '<div class="control-grid"><div class="control"><label for="costume-style">时代与形制</label><select id="costume-style">' +
      Object.keys(styles).map(function (key) { return '<option>' + key + '</option>'; }).join("") +
      '</select></div><div class="control"><label for="costume-role">人物身份</label><select id="costume-role">' +
      Object.keys(roles).map(function (key) { return '<option>' + key + '</option>'; }).join("") +
      '</select></div><div class="control"><label for="costume-place">场合</label><select id="costume-place"><option>日常</option><option>宴会</option><option>礼仪</option></select></div></div>' +
      '<div class="costume-stage"><div class="costume-figure" aria-hidden="true"><span class="costume-head"></span><span class="costume-robe"></span></div>' +
      '<div class="costume-note"><h4 id="costume-title"></h4><p id="costume-copy"></p></div></div>';
    function update() {
      var styleName = qs("#costume-style", container).value;
      var roleName = qs("#costume-role", container).value;
      var place = qs("#costume-place", container).value;
      var style = styles[styleName];
      qs(".costume-robe", container).style.setProperty("--robe", style.robe);
      qs("#costume-title", container).textContent = styleName + " · " + roleName + " · " + place;
      qs("#costume-copy", container).textContent = style.line + " " + roles[roleName] +
        " 本结果用于结构观察，不宣称是唯一历史标准。";
    }
    qa("select", container).forEach(function (select) { select.addEventListener("change", update); });
    update();
  }

  function renderGarden(config, container) {
    var views = {
      "左侧取景": { x: "-42%", text: "花窗向左移动，近处山石进入边框，视线先落在近景再穿过水面。" },
      "中央取景": { x: "0", text: "窗洞框住亭与水面的对景关系，左右景色保持平衡。" },
      "右侧取景": { x: "42%", text: "亭台进入画面右侧，远处树冠成为借景，观看重心向建筑移动。" }
    };
    container.innerHTML = panelHeader(config) + '<div class="segmented">' +
      Object.keys(views).map(function (key, index) {
        return '<button class="segment-btn' + (index === 1 ? " active" : "") + '" type="button" data-garden="' + key + '">' + key + '</button>';
      }).join("") + '</div><div class="viewfinder"><span class="garden-water"></span><span class="garden-hill"></span>' +
      '<span class="garden-pavilion"></span><span class="garden-window"></span></div>' +
      '<div class="practice-output" aria-live="polite"><h4>中央取景</h4><p>' + views["中央取景"].text + '</p></div>';
    qs(".garden-window", container).style.transform = "translateX(0)";
    qa("[data-garden]", container).forEach(function (button) {
      button.addEventListener("click", function () {
        var key = button.dataset.garden;
        qa("[data-garden]", container).forEach(function (item) { item.classList.toggle("active", item === button); });
        qs(".garden-window", container).style.transform = "translateX(" + views[key].x + ")";
        qs(".practice-output h4", container).textContent = key;
        qs(".practice-output p", container).textContent = views[key].text;
      });
    });
  }

  function renderFestival(config, container) {
    var terms = [
      ["立春", "#d7c27a", "东风解冻"],
      ["春分", "#8faf83", "昼夜平分"],
      ["立夏", "#57936d", "草木繁盛"],
      ["夏至", "#2f7065", "日长至"],
      ["立秋", "#b78e55", "暑气渐退"],
      ["秋分", "#9f7b4b", "昼夜平分"],
      ["立冬", "#6a7180", "水始冰"],
      ["冬至", "#43576f", "日短至"]
    ];
    var festivals = [
      ["春节", "#b63e30", "红、金与暖白来自春联、灯笼、年画和礼品。"],
      ["端午", "#477862", "青绿、白色和五彩来自植物、水系与佩饰。"],
      ["中秋", "#8b6e3e", "金黄、月白和深蓝来自月色、花木与夜间观看。"],
      ["清明", "#6f8979", "青绿与素色连接春季景物和追思语境。"]
    ];
    container.innerHTML = panelHeader(config) + '<div class="season-strip">' + terms.map(function (term) {
      return '<button class="solar-chip" type="button" data-term="' + term[0] + '" style="--season:' + term[1] + '"><strong>' + term[0] + '</strong><span>' + term[2] + '</span></button>';
    }).join("") + '</div><div class="festival-palette">' + festivals.map(function (festival) {
      return '<button class="festival-card" type="button" data-festival="' + festival[0] + '" style="--festival:' + festival[1] + '"><strong>' + festival[0] + '</strong><p>' + festival[2] + '</p></button>';
    }).join("") + '</div><div class="practice-output" aria-live="polite"><h4>视觉提示</h4><p>选择节气或节日，查看颜色来源。地方差异和当代设计会改变具体组合。</p></div>';
    qa("[data-term], [data-festival]", container).forEach(function (button) {
      button.addEventListener("click", function () {
        var isTerm = Boolean(button.dataset.term);
        var label = button.dataset.term || button.dataset.festival;
        var text = isTerm
          ? "物候提示来自特定地区长期观察，不能当作全国同一天统一发生的自然现象。"
          : button.querySelector("p").textContent;
        qs(".practice-output h4", container).textContent = label;
        qs(".practice-output p", container).textContent = text;
      });
    });
  }

  function renderLife(config, container) {
    var space = {
      "个人书桌": ["清理一处视线", "选择一件顺手器物", "记录自然光变化"],
      "共享客厅": ["确定一个视觉中心", "减少无来源装饰", "为植物留出背景"],
      "阳台或窗边": ["观察季节物候", "记录早晚光线", "用简单器物回应植物"]
    };
    var time = {
      "每次五分钟": ["只看一个细节", "每天固定记录一句"],
      "每次半小时": ["完成一组对比观察", "整理三张来源卡"],
      "周末一小时": ["做一次空间回看", "比较两处材质或光线"]
    };
    var interest = {
      "色彩": ["从自然照片提取三色关系", "比较两种材质上的同一色相"],
      "器物": ["观察握持与重量", "记录釉色、木纹或织纹"],
      "空间": ["寻找一处框景", "记录行走时视线如何变化"]
    };
    container.innerHTML = panelHeader(config) +
      '<div class="control-grid"><div class="control"><label for="life-space">空间</label><select id="life-space">' +
      Object.keys(space).map(function (key) { return '<option>' + key + '</option>'; }).join("") +
      '</select></div><div class="control"><label for="life-time">可投入时间</label><select id="life-time">' +
      Object.keys(time).map(function (key) { return '<option>' + key + '</option>'; }).join("") +
      '</select></div><div class="control"><label for="life-interest">兴趣方向</label><select id="life-interest">' +
      Object.keys(interest).map(function (key) { return '<option>' + key + '</option>'; }).join("") +
      '</select></div></div><div class="practice-output"><h4>七日活动清单</h4><ol id="life-list"></ol></div>';
    function update() {
      var list = space[qs("#life-space", container).value].concat(time[qs("#life-time", container).value], interest[qs("#life-interest", container).value]);
      qs("#life-list", container).innerHTML = list.map(function (item) {
        return '<li>' + escapeHTML(item) + '</li>';
      }).join("");
    }
    qa("select", container).forEach(function (select) { select.addEventListener("change", update); });
    update();
  }

  function renderCalligraphy(config, container) {
    var scripts = {
      "篆书": {
        shape: "圆形骨架",
        data: "先秦文字系统的重要阶段，包含甲骨文、金文和小篆等形态。",
        look: "线条匀整，结构偏纵长或对称，早期文字保留象形线索。",
        note: "不把现代字体套成篆书，也不生成无法核验的伪古文。"
      },
      "隶书": {
        shape: "横向展开",
        data: "秦代萌芽，汉代成熟，是汉字结构由圆转向方折的重要阶段。",
        look: "横势明显，蚕头燕尾和波磔形成节奏。",
        note: "不要把所有宽扁字都称为隶书。"
      },
      "楷书": {
        shape: "点画分明",
        data: "汉末形成基础，唐代高度成熟。",
        look: "结构端正，笔画标准，可读性高，规范性最强。",
        note: "整齐只是基础，结字重心和笔画呼应更重要。"
      },
      "行书": {
        shape: "连带流动",
        data: "东汉末出现，晋代成熟，兼具可读性和书写速度。",
        look: "笔画有连带但不完全省略，字势自然流动。",
        note: "不要把连笔误认成潦草，行书仍讲结构。"
      },
      "草书": {
        shape: "高度简化",
        data: "汉初出现，包含章草、今草、狂草等类型。",
        look: "结构简省，笔势连绵，情绪和速度感突出。",
        note: "草书有严格法度，不等于随意连画。"
      }
    };
    container.innerHTML = panelHeader(config) + '<div class="script-layout"><div class="segmented script-tabs">' +
      Object.keys(scripts).map(function (key, index) {
        return '<button class="segment-btn' + (index === 0 ? " active" : "") + '" type="button" data-script="' + key + '">' + key + '</button>';
      }).join("") + '</div><div class="script-preview" aria-hidden="true"><span class="stroke stroke-a"></span><span class="stroke stroke-b"></span><span class="stroke stroke-c"></span><span class="stroke stroke-d"></span></div>' +
      '<div class="practice-output"><h4>篆书</h4><p>' + scripts["篆书"].data + " " + scripts["篆书"].look + " " + scripts["篆书"].note + '</p></div></div>';
    qa("[data-script]", container).forEach(function (button) {
      button.addEventListener("click", function () {
        var item = scripts[button.dataset.script];
        qa("[data-script]", container).forEach(function (other) { other.classList.toggle("active", other === button); });
        qs(".practice-output h4", container).textContent = button.dataset.script + " · " + item.shape;
        qs(".practice-output p", container).textContent = item.data + " " + item.look + " " + item.note;
        qs(".script-preview", container).dataset.script = button.dataset.script;
      });
    });
  }

  function renderGrottoes(config, container) {
    var caves = [
      ["敦煌莫高窟", "甘肃敦煌", "壁画与彩塑序列", "735个洞窟的公开统计常被引用，洞窟空间、壁画叙事和彩塑共同构成完整艺术环境。", "#B56845"],
      ["云冈石窟", "山西大同", "大型石刻造像", "早期造像体量雄浑，可见外来艺术影响，后续逐渐融入中原建筑和人物造型。", "#8D5E3C"],
      ["龙门石窟", "河南洛阳", "北魏至唐代石刻", "北魏造像清秀，唐代造像更加丰满、亲切，洞窟和崖面形成连续观看序列。", "#6F7B72"],
      ["麦积山石窟", "甘肃天水", "泥塑与东方微笑", "岩质较松散，造像以泥塑见长，亲切、世俗化是其常被讨论的特征。", "#A66B52"]
    ];
    container.innerHTML = panelHeader(config) + '<div class="grotto-layout"><div class="grotto-tabs">' +
      caves.map(function (cave, index) {
        return '<button class="grotto-tab' + (index === 0 ? " active" : "") + '" type="button" data-cave="' + cave[0] + '"><span>' + String(index + 1).padStart(2, "0") + '</span>' + cave[0] + '</button>';
      }).join("") + '</div><div class="grotto-scene"><div class="cliff-lines" aria-hidden="true"></div><div class="grotto-statue" aria-hidden="true"></div></div><div class="practice-output"><h4 id="grotto-title"></h4><p id="grotto-copy"></p></div></div>';
    function update(index) {
      var cave = caves[index];
      qs(".grotto-scene", container).style.setProperty("--grotto-color", cave[4]);
      qs("#grotto-title", container).textContent = cave[0] + " · " + cave[2];
      qs("#grotto-copy", container).textContent = cave[1] + "。 " + cave[3];
      qa("[data-cave]", container).forEach(function (button, buttonIndex) {
        button.classList.toggle("active", buttonIndex === index);
      });
    }
    qa("[data-cave]", container).forEach(function (button, index) {
      button.addEventListener("click", function () { update(index); });
    });
    update(0);
  }

  function renderHeritage(config, container) {
    var categories = {
      "传统美术": [
        ["木版年画", "刻印、套色、地方题材", "杨柳青、桃花坞、潍坊各有不同面貌。"],
        ["刺绣", "针法、丝线、底料", "苏、湘、蜀、粤绣不能互换成同一图案模板。"]
      ],
      "传统技艺": [
        ["制瓷", "泥料、成型、施釉、烧成", "复杂工序共同决定釉色和器形。"],
        ["织造", "织机、提花、经纬材料", "云锦、蜀锦的材料和结构重点不同。"],
        ["宣纸与徽墨", "纤维、烟料、胶法与制作", "工具性能会直接改变书写和绘画结果。"]
      ],
      "文房工具": [
        ["湖笔", "尖、齐、圆、健", "笔毫配比和锋颖决定运笔手感。"],
        ["砚台", "石质、发墨、造型", "触感和研墨效率与表面纹饰同样重要。"]
      ]
    };
    var active = "传统美术";
    function draw() {
      container.innerHTML = panelHeader(config) + '<div class="segmented heritage-tabs">' +
        Object.keys(categories).map(function (key) {
          return '<button class="segment-btn' + (key === active ? " active" : "") + '" type="button" data-category="' + key + '">' + key + '</button>';
        }).join("") + '</div><div class="heritage-grid">' + categories[active].map(function (item, index) {
          return '<article class="heritage-card"><span>' + String(index + 1).padStart(2, "0") + '</span><h4>' + item[0] + '</h4><strong>' + item[1] + '</strong><p>' + item[2] + '</p></article>';
        }).join("") + '</div><div class="source-line"><span>项目名称和使用语境请以中国非物质文化遗产网、文化和旅游部公开资料为准。</span></div>';
      qa("[data-category]", container).forEach(function (button) {
        button.addEventListener("click", function () {
          active = button.dataset.category;
          draw();
        });
      });
    }
    draw();
  }

  function bindCopyButtons(container) {
    qa("[data-copy]", container).forEach(function (button) {
      button.addEventListener("click", function () {
        copyText(button.dataset.copy, "已复制 " + button.dataset.copy);
      });
    });
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

  function initExercise() {
    qa(".hint-toggle").forEach(function (button) {
      button.addEventListener("click", function () {
        var content = button.nextElementSibling;
        var open = content.classList.toggle("show");
        button.textContent = open ? "收起思路" : "查看思路";
      });
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

  function buildPrompt(lesson, text, sectionLabel) {
    return "## 课程上下文\n- 课程：" + data.meta.name + "\n- 课时：" + lesson.title + "\n- 章节：" +
      sectionLabel + "\n\n## 我选中的内容\n\n" + text + "\n\n## 我的提问\n\n";
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
      '<label for="selection-instruction" style="display:block;margin-top:12px;font-size:13px;font-weight:800">想改成什么样</label>' +
      '<input id="selection-instruction" name="modification" type="text" autocomplete="off" placeholder="例如：保持信息不变，写得更适合初学者">' +
      '<div class="dialog-actions"><button class="btn btn-secondary" type="button" data-action="cancel">取消</button>' +
      '<button class="btn btn-primary" type="button" data-action="copy">复制修改请求</button></div></div>';
    document.body.appendChild(dialog);

    var hideTimer = 0;
    var notesKey = "traditional-aesthetics-notes::" + location.pathname;

    function hideToolbar() {
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(function () {
        toolbar.classList.remove("visible");
      }, 180);
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

    document.addEventListener("scroll", function () {
      toolbar.classList.remove("visible");
    }, { passive: true });

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
      if (button.dataset.action === "ask") {
        copyText(buildPrompt(lesson, text, sectionLabel), "已复制提问模板");
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
      if (event.target === dialog || event.target.dataset.action === "cancel") {
        dialog.classList.remove("open");
      }
      if (event.target.dataset.action === "copy") {
        var source = qs(".selection-dialog-source", dialog).textContent;
        var instruction = qs("#selection-instruction", dialog).value.trim() || "请给出更清楚、证据边界更明确的改写方案";
        var prompt = "## 课程上下文\n- 课程：" + data.meta.name + "\n- 课时：" + lesson.title + "\n- 章节：" +
          getSectionLabel(selectedNode) + "\n\n## 选中的原文\n\n" + source + "\n\n## 修改要求\n\n" + instruction + "\n";
        copyText(prompt, "已复制修改请求");
        dialog.classList.remove("open");
      }
    });

    function loadNotes() {
      try {
        return JSON.parse(localStorage.getItem(notesKey) || "[]");
      } catch (error) {
        return [];
      }
    }

    function saveNotes(notes) {
      try {
        localStorage.setItem(notesKey, JSON.stringify(notes));
      } catch (error) {
        toast("浏览器未允许保存划线笔记");
      }
    }

    function getTextNodes(root) {
      var nodes = [];
      (function walk(node) {
        if (node.nodeType === Node.TEXT_NODE) {
          nodes.push(node);
          return;
        }
        for (var index = 0; index < node.childNodes.length; index += 1) {
          walk(node.childNodes[index]);
        }
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
      for (var nodeIndex = 0; nodeIndex < nodes.length; nodeIndex += 1) {
        var length = nodes[nodeIndex].nodeValue.length;
        if (!startSet && index <= position + length) {
          range.setStart(nodes[nodeIndex], index - position);
          startSet = true;
        }
        if (!endSet && end <= position + length) {
          range.setEnd(nodes[nodeIndex], end - position);
          endSet = true;
          break;
        }
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
        try {
          span.appendChild(range.extractContents());
          range.insertNode(span);
        } catch (error) {
          return;
        }
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
      try {
        span.appendChild(range.extractContents());
        range.insertNode(span);
      } catch (error) {
        toast("这段选区暂时无法划线");
        return;
      }
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
      advanced: '<path d="M5 5h14v14H5z"></path><path d="M8 9h8M8 13h8M8 17h4"></path>',
      about: '<circle cx="12" cy="12" r="8"></circle><path d="M12 11v5M12 8h.01"></path>'
    };
    return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + (icons[name] || icons.course) + '</svg>';
  }

  function initMobileNavigation() {
    if (qs("#mobile-bottom-nav")) return;
    var page = document.body.dataset.page || "index";
    var lesson = lessonBySlug(document.body.dataset.lesson);
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

    var base = page === "index" ? "" : "../";
    var current = page === "index" ? "home" : (lesson && lesson.index >= 11 ? "advanced" : "course");
    var items = [
      { key: "home", label: "首页", href: base + "index.html" },
      { key: "course", label: "课程", href: base + "index.html#course-map" },
      { key: "advanced", label: "进阶", href: base + "11-calligraphy-seal/lesson.html" },
      { key: "about", label: "资料", href: base + "index.html#sources" }
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
    var page = document.body.dataset.page;
    if (page === "index") renderIndex();
    if (page === "lesson") {
      var lesson = lessonBySlug(document.body.dataset.lesson);
      if (lesson) renderLessonShell(lesson);
    }
    initMobileNavigation();
    initMobileToc();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
