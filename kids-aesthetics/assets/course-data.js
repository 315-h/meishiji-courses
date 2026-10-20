window.COURSE_DATA = {
  meta: {
    name: "美识集·小小美育课",
    shortName: "小小美育课",
    description: "十节给小朋友和初学者听的传统美学课。每课三个知识点、一个动手互动、一句口诀。",
    audience: "小学3-6年级学生及文化水平不高的成人",
    duration: "每课40分钟",
    updated: "2026-10-12"
  },
  lessons: [
    {
      index: 1,
      slug: "01-color",
      title: "颜色的秘密",
      subtitle: "传统颜色从哪来",
      question: "这个红，叫什么名字？",
      summary: "从朱砂、天青和靛蓝出发，看看传统颜色怎样从石头、天空和植物里来。",
      duration: "40分钟",
      ageGroup: "小学3-6年级",
      visualMark: "色",
      theme: "#E8A87C",
      themeDeep: "#B9653F",
      art: "01-color",
      mantra: {
        text: "朱砂红、天青色、靛蓝色，颜色的秘密在自然里。",
        note: "念的时候可以拍手。三个词，一句口诀。"
      },
      review: "这是第一课。我们从颜色开始，因为颜色是最容易看见的美。",
      story: {
        label: "先想一想",
        text: "你手里的红色蜡笔，只有一种红吗？古人见过的红色，可能来自石头。"
      },
      sections: [
        {
          id: "cinnabar",
          title: "朱砂红",
          kicker: "知识点 1",
          paragraphs: [
            "朱砂是一种红色矿石。",
            "它的学名叫辰砂。",
            "把矿石磨成粉，可以做成红颜料。",
            "古人用它画画，也用它做印章。"
          ],
          insight: "颜色可以来自矿物。石头也能变成颜料。",
          fact: "朱砂是硫化汞矿物。它是矿物，不是植物。",
          caution: "朱砂有毒性。看图片和听讲解即可，不要自己研磨。",
          source: "史实。矿物学常识与博物馆颜料资料。",
          sourceUrl: "https://www.dpm.org.cn/"
        },
        {
          id: "sky-blue",
          title: "天青色",
          kicker: "知识点 2",
          paragraphs: [
            "天青色让人想到雨后的天空。",
            "宋代汝窑瓷器常被这样形容。",
            "它的青色很淡，也很温润。",
            "不同光线里，看起来会有点变化。"
          ],
          insight: "颜色不只用眼睛看，也和光线有关。",
          fact: "青不只是一种颜色。它可以是蓝，也可以是蓝绿。",
          caution: "雨过天青云破处是后世传说，不是确定的史实。",
          source: "史实与审美赏析。故宫博物院藏品公开介绍。",
          sourceUrl: "https://www.dpm.org.cn/"
        },
        {
          id: "indigo",
          title: "靛蓝色",
          kicker: "知识点 3",
          paragraphs: [
            "靛蓝从蓝草里来。",
            "蓝草泡水发酵，可以得到染料。",
            "布浸过染液，就会变成蓝色。",
            "今天还有地方在用这种方法染布。"
          ],
          insight: "颜色也可以来自植物和手艺。",
          fact: "蓝染不是中国独有。很多地方都有蓝染传统。",
          caution: "靛蓝不等于某一种固定的蓝。深浅会变化。",
          source: "史实。中国非物质文化遗产网公开资料。",
          sourceUrl: "https://www.ihchina.cn/"
        }
      ],
      interactive: {
        type: "colorFind",
        title: "找颜色游戏",
        description: "听名字，点出对应的颜色。全部找对就完成。",
        hints: ["先看颜色下面的名字。", "朱砂红偏红，天青色偏青，靛蓝色偏深蓝。", "按顺序找：朱砂红、天青色、靛蓝色。"],
        targets: [
          { name: "朱砂红", color: "#B83A2D", source: "朱砂是红色矿石，磨成粉可以做颜料。" },
          { name: "天青色", color: "#8EA6A6", source: "天青色来自雨后天空的联想，宋代汝窑常被这样形容。" },
          { name: "靛蓝色", color: "#33586F", source: "靛蓝来自蓝草等植物，经过发酵和浸染得到。" }
        ],
        decoys: [
          { name: "鹅黄", color: "#E8C36A" },
          { name: "藕粉", color: "#D4A5A5" },
          { name: "苔绿", color: "#8B9D83" }
        ]
      },
      quiz: [
        {
          question: "朱砂是什么做的？",
          options: ["一种红色矿石", "一种蓝色花朵", "一种木头", "一种云彩"],
          correct: 0,
          explanation: "朱砂又叫辰砂，是硫化汞矿物。"
        },
        {
          question: "天青色的名字，最容易让人想到什么？",
          options: ["雨后的天空", "燃烧的火", "秋天的落叶", "夜里的灯"],
          correct: 0,
          explanation: "天青色来自对雨后天空的联想。"
        },
        {
          question: "下面哪句话更准确？",
          options: ["蓝染只有中国有", "靛蓝只有一种深浅", "很多地方都有蓝染传统", "蓝草是一种矿物"],
          correct: 2,
          explanation: "蓝染分布很广，颜色也会随工艺变化。"
        }
      ],
      exercise: {
        title: "动手做色盘",
        prompt: "在教室里或家里找出三个颜色。",
        steps: [
          "找一个偏红的颜色",
          "找一个偏青的颜色",
          "找一个偏蓝的颜色",
          "把它们的名字写下来"
        ],
        hint: "颜色不用和屏幕上的一模一样。先说像什么，再说为什么像。"
      },
      sources: [
        { title: "故宫博物院", source: "故宫博物院", url: "https://www.dpm.org.cn/", desc: "查看陶瓷和颜料相关公开藏品介绍。" },
        { title: "中国非物质文化遗产网", source: "中国非物质文化遗产网", url: "https://www.ihchina.cn/", desc: "查看传统染色和植物染料相关项目。" },
        { title: "传统颜料图片检索", source: "Wikimedia Commons", url: "https://commons.wikimedia.org/w/index.php?search=Chinese+pigment&title=Special:MediaSearch&type=image", desc: "用公开图片核对矿物和染料的外形。" }
      ]
    },
    {
      index: 2,
      slug: "02-pattern",
      title: "花纹的秘密",
      subtitle: "花纹不是随便画的",
      question: "花瓶上的花纹，在说什么？",
      summary: "认识回纹、云纹和缠枝纹，学会先看骨架，再看意思。",
      duration: "40分钟",
      ageGroup: "小学3-6年级",
      visualMark: "纹",
      theme: "#8B9D83",
      themeDeep: "#5F7A58",
      art: "02-pattern",
      mantra: {
        text: "回纹方、云纹圆、缠枝纹绕圈圈，花纹的秘密在骨架里。",
        note: "先看形状，再想它为什么要这样排。"
      },
      review: "第一课说，颜色可以从自然里来。花纹也有自己的骨架。",
      story: {
        label: "先想一想",
        text: "同样是花和线，为什么有的排成方框，有的卷成云朵？"
      },
      sections: [
        {
          id: "hui-pattern",
          title: "回纹",
          kicker: "知识点 1",
          paragraphs: [
            "回纹像回字，方方正正。",
            "它常常一圈一圈地连续。",
            "器物边缘常用它做边饰。",
            "连绵不断是常见的寓意。"
          ],
          insight: "先看线条怎样转弯，再看它排在哪里。",
          fact: "回纹在新石器时代彩陶上已经出现。它不是某个人发明的。",
          caution: "寓意会随时代和器物变化，不要只背一个答案。",
          source: "史实与审美赏析。博物馆纹饰公开介绍。",
          sourceUrl: "https://www.dpm.org.cn/"
        },
        {
          id: "cloud-pattern",
          title: "云纹",
          kicker: "知识点 2",
          paragraphs: [
            "云纹的线条弯弯卷卷。",
            "它让人想到天上的云。",
            "衣服、建筑和器物上都能见到。",
            "吉祥如意是常见的解释。"
          ],
          insight: "圆的线条，看起来更柔和。",
          fact: "云纹和雷纹不一样。云纹多圆转，雷纹多方折。",
          caution: "同一种纹样放在不同地方，意思可能不同。",
          source: "审美赏析。传统纹样公开资料。",
          sourceUrl: "https://commons.wikimedia.org/w/index.php?search=Chinese+cloud+pattern&title=Special:MediaSearch&type=image"
        },
        {
          id: "vine-pattern",
          title: "缠枝纹",
          kicker: "知识点 3",
          paragraphs: [
            "缠枝纹是花和藤蔓缠在一起。",
            "藤蔓会一直延伸、连接。",
            "缠枝莲、缠枝牡丹都很常见。",
            "生生不息是常见的寓意。"
          ],
          insight: "它靠连续的藤蔓，把画面连成一片。",
          fact: "缠枝纹有很多种。花不同，名字也不同。",
          caution: "不要把缠枝纹说成只有一种花。",
          source: "审美赏析。故宫博物院陶瓷纹饰公开介绍。",
          sourceUrl: "https://www.dpm.org.cn/"
        }
      ],
      interactive: {
        type: "patternMatch",
        title: "纹样配对",
        description: "先看花纹的样子，再给它找到正确的名字。",
        hints: ["先看线条是方还是圆。", "回纹方，云纹圆，缠枝纹有花和藤。", "依次配对：回纹、云纹、缠枝纹。"],
        pairs: [
          { id: "hui", name: "回纹", mark: "回", structure: "方方正正，连续转圈。", usage: "常用在器物边缘、建筑彩画和服饰边饰，寓意连绵不断。" },
          { id: "cloud", name: "云纹", mark: "云", structure: "弯弯卷卷，像云朵。", usage: "常用在衣服、建筑和器物上，寓意吉祥如意。" },
          { id: "vine", name: "缠枝纹", mark: "缠", structure: "花和藤蔓缠绕在一起。", usage: "常用在瓷器、织绣上，寓意生生不息。" }
        ]
      },
      quiz: [
        {
          question: "回纹最常见的骨架是什么样？",
          options: ["方折连续", "圆形旋转", "花藤缠绕", "完全不重复"],
          correct: 0,
          explanation: "回纹以方折连续的线条为特征。"
        },
        {
          question: "云纹和雷纹的一个简单区别是什么？",
          options: ["云圆雷方", "云方雷圆", "两个完全一样", "只和颜色有关"],
          correct: 0,
          explanation: "云纹多圆转，雷纹多方折。"
        },
        {
          question: "缠枝纹常常表现什么？",
          options: ["孤立的单个图形", "花和藤蔓连续缠绕", "只有直线", "只有数字"],
          correct: 1,
          explanation: "缠枝纹靠花与藤蔓的连续缠绕形成图案。"
        }
      ],
      exercise: {
        title: "给杯子画一圈边",
        prompt: "在纸上画一个杯子，再给杯口画一圈花纹。",
        steps: [
          "先画杯子的外形",
          "选回纹或云纹中的一种",
          "沿着杯口重复画一圈",
          "写下你选它的理由"
        ],
        hint: "先画骨架，再加细节。重复的间隔尽量均匀。"
      },
      sources: [
        { title: "故宫博物院", source: "故宫博物院", url: "https://www.dpm.org.cn/", desc: "查看陶瓷、青铜器和织绣上的公开纹饰。" },
        { title: "国家博物馆", source: "中国国家博物馆", url: "https://www.chnmuseum.cn/", desc: "查看古代器物与纹样公开资料。" },
        { title: "传统纹样图片检索", source: "Wikimedia Commons", url: "https://commons.wikimedia.org/w/index.php?search=Chinese+ornament+pattern&title=Special:MediaSearch&type=image", desc: "用公开图片比较不同纹样的线条结构。" }
      ]
    },
    {
      index: 3,
      slug: "03-architecture",
      title: "房子的秘密",
      subtitle: "中国房子的屋顶会说话",
      question: "屋顶为什么会翘起来？",
      summary: "从飞檐、斗拱和榫卯入手，看看老房子怎样挡雨、承重和连接。",
      duration: "40分钟",
      ageGroup: "小学3-6年级",
      visualMark: "筑",
      theme: "#A8B5C9",
      themeDeep: "#5C7089",
      art: "03-architecture",
      mantra: {
        text: "飞檐翘、斗拱托、榫卯咬，房子的秘密在木头上。",
        note: "一边念，一边用手比出屋檐和积木的样子。"
      },
      review: "上一课说，花纹有骨架和寓意。房子也有清楚的结构。",
      story: {
        label: "先想一想",
        text: "下雨时，水会从屋顶流下来。怎样让水跑得更远？"
      },
      sections: [
        {
          id: "eaves",
          title: "飞檐",
          kicker: "知识点 1",
          paragraphs: [
            "飞檐是向上翘的屋檐。",
            "它可以帮雨水抛得更远。",
            "也能保护下面的木柱子。",
            "翘起的线条看起来很轻。"
          ],
          insight: "形状常常同时解决功能和好看。",
          fact: "不同朝代的飞檐角度不一样。",
          caution: "不要说所有飞檐都完全相同。",
          source: "史实与审美赏析。古建筑公开资料。",
          sourceUrl: "https://www.dpm.org.cn/"
        },
        {
          id: "dougong",
          title: "斗拱",
          kicker: "知识点 2",
          paragraphs: [
            "斗拱是一层层木头叠起来的。",
            "它像积木，也像托举的手。",
            "主要作用是承重和向外托檐。",
            "它也是古建筑的重要装饰。"
          ],
          insight: "斗拱把屋顶的重量，分散到柱子上。",
          fact: "斗、拱、昂等构件组合在一起，才叫斗拱。",
          caution: "斗拱不只是装饰，它首先有结构作用。",
          source: "史实。中国古建筑公开科普资料。",
          sourceUrl: "https://whc.unesco.org/en/list/439/"
        },
        {
          id: "mortise",
          title: "榫卯",
          kicker: "知识点 3",
          paragraphs: [
            "榫卯靠凹凸咬合来连接木头。",
            "一块凸出来，另一块凹进去。",
            "咬住以后，可以很牢固。",
            "地震时，木头之间还能稍微活动。"
          ],
          insight: "不一定靠钉子，也能把木头连起来。",
          fact: "传统木构建筑也会使用金属件辅助。",
          caution: "不要说传统建筑完全不用钉子。",
          source: "史实。中国传统木作公开资料。",
          sourceUrl: "https://www.ihchina.cn/"
        }
      ],
      interactive: {
        type: "dougongBuild",
        title: "搭一个斗拱",
        description: "按从下到上的顺序点击构件。顺序对了，斗拱就搭好。",
        hints: ["从下往上搭。", "顺序是斗、拱、昂、枋。", "先点斗，再点拱，然后昂，最后枋。"],
        order: ["斗", "拱", "昂", "枋"],
        parts: {
          "斗": "斗是底座，像小盒子，托住上面的重量。",
          "拱": "拱是弯木，像手臂向两边伸展。",
          "昂": "昂是斜木，像杠杆，帮助屋檐翘起来。",
          "枋": "枋是横木，把所有构件连在一起。"
        }
      },
      quiz: [
        {
          question: "飞檐向上翘，有什么好处？",
          options: ["让雨水抛得更远", "让房子变矮", "让木头变轻", "让屋顶没有影子"],
          correct: 0,
          explanation: "飞檐能扩大出檐，帮助排水并保护木柱。"
        },
        {
          question: "斗拱的主要作用是什么？",
          options: ["承重和托檐", "只用来挂灯笼", "只用来画花纹", "用来装水"],
          correct: 0,
          explanation: "斗拱首先是结构构件，同时也有装饰作用。"
        },
        {
          question: "榫卯靠什么连接木头？",
          options: ["凹凸咬合", "胶水粘贴", "绳子捆绑", "磁铁吸引"],
          correct: 0,
          explanation: "榫卯通过构件之间的凹凸咬合连接。"
        }
      ],
      exercise: {
        title: "搭一个有飞檐的小房子",
        prompt: "用积木、纸盒或书本搭一个小房子。",
        steps: [
          "先搭两根柱子",
          "在柱子上放一块横板",
          "把屋顶两侧轻轻翘起",
          "说说哪一部分在承重"
        ],
        hint: "如果屋顶容易掉，先检查柱子是否放平。"
      },
      sources: [
        { title: "故宫博物院", source: "故宫博物院", url: "https://www.dpm.org.cn/", desc: "查看故宫古建筑公开介绍。" },
        { title: "UNESCO 世界遗产中心", source: "UNESCO", url: "https://whc.unesco.org/en/list/439/", desc: "查看中国古代建筑与木构相关世界遗产条目。" },
        { title: "中国非物质文化遗产网", source: "中国非物质文化遗产网", url: "https://www.ihchina.cn/", desc: "查看传统木作和榫卯相关项目。" }
      ]
    },
    {
      index: 4,
      slug: "04-painting",
      title: "画画的秘密",
      subtitle: "中国画不追求画得像",
      question: "空白的地方，画了什么？",
      summary: "从留白、散点透视和墨色变化出发，理解中国画怎样让人参与想象。",
      duration: "40分钟",
      ageGroup: "小学3-6年级",
      visualMark: "画",
      theme: "#D4A5A5",
      themeDeep: "#9C6464",
      art: "04-painting",
      mantra: {
        text: "留白空、边走看、墨分色，画画的秘密在意境里。",
        note: "留白不是没画完。它是画面的一部分。"
      },
      review: "上一课看了房子的结构。画画也有自己的安排方式。",
      story: {
        label: "先想一想",
        text: "一张画上只有一条小船，其余全是空白。空白是什么？"
      },
      sections: [
        {
          id: "blank",
          title: "留白",
          kicker: "知识点 1",
          paragraphs: [
            "留白是把一些地方空出来。",
            "空白可以代表水、雾和天空。",
            "它也能让画面有呼吸。",
            "看画的人会自己补上内容。"
          ],
          insight: "空白不是没画完，它参与构图。",
          fact: "不是所有中国画都留白。工笔画就可能画得很满。",
          caution: "不要把留白说成中国画唯一的样子。",
          source: "审美赏析。中国画公共讲解资料。",
          sourceUrl: "https://www.dpm.org.cn/"
        },
        {
          id: "perspective",
          title: "散点透视",
          kicker: "知识点 2",
          paragraphs: [
            "看中国画时，视点可以移动。",
            "像一边走，一边看。",
            "一幅画里可以有多个角度。",
            "不一定要像照片那样固定。"
          ],
          insight: "画里的人，可以在画中慢慢走。",
          fact: "散点透视是一种观看和构图方式。",
          caution: "西方画也不是都追求写实。现代艺术变化很多。",
          source: "审美赏析。艺术史通识资料。",
          sourceUrl: "https://www.metmuseum.org/toah/"
        },
        {
          id: "ink",
          title: "墨分五色",
          kicker: "知识点 3",
          paragraphs: [
            "墨加水，可以变浓变淡。",
            "笔上水分不同，效果也不同。",
            "浓、淡、干、湿，变化很多。",
            "所以只说一种黑，是不够的。"
          ],
          insight: "一种墨，也能画出很多层次。",
          fact: "墨分五色不是真的只有五种颜色。",
          caution: "它说的是浓淡干湿的变化效果。",
          source: "审美赏析。书画材料公开资料。",
          sourceUrl: "https://www.dpm.org.cn/"
        }
      ],
      interactive: {
        type: "whiteSpace",
        title: "留白加减实验",
        description: "点按钮，给画面加一点东西。看看空白变少后，感觉有什么不同。",
        hints: ["点按钮可以加元素。", "每加一个元素，留白比例会变小。", "试试加小船和远山，再看看留白比例。"],
        items: [
          { id: "boat", label: "加小船" },
          { id: "birds", label: "加飞鸟" },
          { id: "mist", label: "加雾气" },
          { id: "mountain", label: "加远山" }
        ]
      },
      quiz: [
        {
          question: "留白在画面里可以做什么？",
          options: ["参与构图", "只是没画完", "一定是错误", "只能代表白色"],
          correct: 0,
          explanation: "留白可以表现水、雾、天空，也让画面有呼吸。"
        },
        {
          question: "散点透视更像下面哪种体验？",
          options: ["边走边看", "站在原地不动", "只看一个点", "闭上眼睛"],
          correct: 0,
          explanation: "散点透视允许视点移动，像边走边看。"
        },
        {
          question: "墨分五色说的是什么？",
          options: ["真的只有五种颜料", "墨的浓淡干湿变化", "五种不同毛笔", "五种不同纸张"],
          correct: 1,
          explanation: "它指墨色和水分变化带来的丰富层次。"
        }
      ],
      exercise: {
        title: "画一幅留白画",
        prompt: "画一条小船，其余地方先空着。",
        steps: [
          "用一条线画出水面",
          "画一条小船",
          "在旁边留出一大片空白",
          "说说这片空白代表什么"
        ],
        hint: "空白可以代表水、天空、雾，也可以代表距离。"
      },
      sources: [
        { title: "故宫博物院", source: "故宫博物院", url: "https://www.dpm.org.cn/", desc: "查看中国古代绘画公开藏品介绍。" },
        { title: "The Met 艺术史时间线", source: "The Metropolitan Museum of Art", url: "https://www.metmuseum.org/toah/", desc: "比较不同地区绘画的观看方式。" },
        { title: "中国绘画图片检索", source: "Wikimedia Commons", url: "https://commons.wikimedia.org/w/index.php?search=Chinese+landscape+painting&title=Special:MediaSearch&type=image", desc: "用公共领域图片观察留白和构图。" }
      ]
    },
    {
      index: 5,
      slug: "05-calligraphy",
      title: "写字的秘密",
      subtitle: "汉字写好了就是艺术",
      question: "同一个字，为什么长得不一样？",
      summary: "认识篆书、隶书和楷书，感受同一个字在不同书体里的变化。",
      duration: "40分钟",
      ageGroup: "小学3-6年级",
      visualMark: "书",
      theme: "#C9B896",
      themeDeep: "#8A7444",
      art: "05-calligraphy",
      mantra: {
        text: "篆书圆、隶书翘、楷书方，写字的秘密在变化里。",
        note: "三种书体，没有谁最好。它们各有各的美。"
      },
      review: "上一课说，画面要有取舍。写字也要照顾线条和结构。",
      story: {
        label: "先想一想",
        text: "你在课本上写的字，和刻在石头上的字，会一样吗？"
      },
      sections: [
        {
          id: "seal",
          title: "篆书",
          kicker: "知识点 1",
          paragraphs: [
            "篆书的线条圆圆的。",
            "它看起来有点像画画。",
            "秦代统一文字时，篆书很重要。",
            "早期它还刻在青铜器和石头上。"
          ],
          insight: "先看线条，再看字形的整体。",
          fact: "甲骨文比篆书更早。篆书不是最古老的文字。",
          caution: "不要说篆书是第一个出现的文字。",
          source: "史实。书法史公开资料。",
          sourceUrl: "https://www.dpm.org.cn/"
        },
        {
          id: "clerical",
          title: "隶书",
          kicker: "知识点 2",
          paragraphs: [
            "隶书在汉代很流行。",
            "它的横画尾巴会翘起来。",
            "这个特点叫蚕头燕尾。",
            "字形比篆书更方，也更好写。"
          ],
          insight: "笔画的变化，让字更有节奏。",
          fact: "曹全碑是隶书的代表作品之一。",
          caution: "隶书不是只出现在汉代，后来也有人写。",
          source: "史实。碑刻与书法公开资料。",
          sourceUrl: "https://www.chnmuseum.cn/"
        },
        {
          id: "regular",
          title: "楷书",
          kicker: "知识点 3",
          paragraphs: [
            "楷书方方正正，很清楚。",
            "它和课本上的字比较接近。",
            "唐代楷书很成熟。",
            "一笔一画，都看得明白。"
          ],
          insight: "清楚、端正，是楷书给我们的第一印象。",
          fact: "书法常见五体是篆、隶、楷、行、草。",
          caution: "不要说楷书是唯一正确的书体。",
          source: "史实。书法史公开资料。",
          sourceUrl: "https://www.dpm.org.cn/"
        }
      ],
      interactive: {
        type: "scriptName",
        title: "名字书体体验",
        description: "输入你的名字，再切换三种书体，看看感觉有什么不同。",
        hints: ["先在输入框里写下名字。", "三种书体在名字下方可以切换。", "点篆书、隶书、楷书，看看线条有什么不同。"],
        scripts: [
          { id: "seal", name: "篆书", className: "script-seal", note: "圆转、均匀，像画线。" },
          { id: "clerical", name: "隶书", className: "script-clerical", note: "横画展开，尾巴上翘。" },
          { id: "regular", name: "楷书", className: "script-regular", note: "方正、清楚、笔画分明。" }
        ]
      },
      quiz: [
        {
          question: "篆书的线条通常给人什么感觉？",
          options: ["圆转", "尖锐", "断断续续", "只有直线"],
          correct: 0,
          explanation: "篆书线条圆转、均匀，整体感强。"
        },
        {
          question: "蚕头燕尾常用来形容哪种书体？",
          options: ["隶书", "篆书", "楷书", "甲骨文"],
          correct: 0,
          explanation: "隶书横画起笔和收笔有蚕头燕尾的特征。"
        },
        {
          question: "下面哪种说法更准确？",
          options: ["楷书是唯一好的书体", "篆书最古老", "每种书体都有自己的美", "隶书已经消失"],
          correct: 2,
          explanation: "篆、隶、楷各有特点，不能简单分高下。"
        }
      ],
      exercise: {
        title: "用三种感觉写名字",
        prompt: "把自己的名字写三遍。",
        steps: [
          "第一遍写圆一点",
          "第二遍把横画尾巴翘起来",
          "第三遍写方正、清楚",
          "比较三次有什么不同"
        ],
        hint: "不要求写得像书法家。先体会线条和结构的变化。"
      },
      sources: [
        { title: "故宫博物院", source: "故宫博物院", url: "https://www.dpm.org.cn/", desc: "查看历代书法公开藏品介绍。" },
        { title: "中国国家博物馆", source: "中国国家博物馆", url: "https://www.chnmuseum.cn/", desc: "查看碑刻和文字相关公开资料。" },
        { title: "书法拓片图片检索", source: "Wikimedia Commons", url: "https://commons.wikimedia.org/w/index.php?search=Chinese+calligraphy+rubbing&title=Special:MediaSearch&type=image", desc: "用公共领域图片比较书体。" }
      ]
    },
    {
      index: 6,
      slug: "06-porcelain",
      title: "瓶子的秘密",
      subtitle: "瓷器的美在颜色和光泽",
      question: "瓷碗和陶碗，哪里不一样？",
      summary: "从瓷与陶的区别入手，认识青花瓷和青瓷的釉色之美。",
      duration: "40分钟",
      ageGroup: "小学3-6年级",
      visualMark: "瓷",
      theme: "#7FB3A8",
      themeDeep: "#3F7E73",
      art: "06-porcelain",
      mantra: {
        text: "瓷器滑、青花蓝、天青润，瓶子的秘密在釉色里。",
        note: "釉色会随光线变化，屏幕颜色只能做参考。"
      },
      review: "上一课看了书体的变化。器物也会随材料和工艺变化。",
      story: {
        label: "先想一想",
        text: "同样是碗，为什么有的粗糙，有的光滑？"
      },
      sections: [
        {
          id: "ceramic",
          title: "瓷和陶",
          kicker: "知识点 1",
          paragraphs: [
            "瓷器更白，也更坚硬。",
            "它的表面通常更光滑。",
            "陶器更粗，也容易吸水。",
            "两种材料各有各的用处。"
          ],
          insight: "先看材料和烧成，再判断用途。",
          fact: "中国较早发明了瓷器。后来很多地方也能生产。",
          caution: "陶器不是低级的瓷器。它们只是不同。",
          source: "史实。陶瓷史公开资料。",
          sourceUrl: "https://www.dpm.org.cn/"
        },
        {
          id: "blue-white",
          title: "青花瓷",
          kicker: "知识点 2",
          paragraphs: [
            "青花瓷是白地蓝花。",
            "工匠用钴料画花纹。",
            "画好后再上釉烧制。",
            "蓝色会藏在釉下，很清亮。"
          ],
          insight: "白和蓝的对比，让花纹很清楚。",
          fact: "早期青花钴料有一部分从海外输入。",
          caution: "青花瓷不是一开始就完全用国产原料。",
          source: "史实。故宫博物院陶瓷公开介绍。",
          sourceUrl: "https://www.dpm.org.cn/"
        },
        {
          id: "celadon",
          title: "青瓷",
          kicker: "知识点 3",
          paragraphs: [
            "青瓷的釉色偏青，也很温润。",
            "它常让人想到玉。",
            "宋代汝窑青瓷很有名。",
            "不同光线下，颜色会变。"
          ],
          insight: "青瓷的美，不只在颜色，也在光泽。",
          fact: "汝窑存世数量很少，具体数字有争议。",
          caution: "屏幕上的天青色只是参考，不等于文物测色。",
          source: "史实与审美赏析。故宫博物院陶瓷公开介绍。",
          sourceUrl: "https://www.dpm.org.cn/"
        }
      ],
      interactive: {
        type: "vaseColor",
        title: "给瓶子上色",
        description: "选择一种釉色，看看同一个瓶子会变成什么感觉。",
        hints: ["先选一种釉色。", "青花是蓝白，青瓷是淡青，彩绘颜色多。", "点青花瓷、青瓷、彩绘，看看瓶子颜色。"],
        styles: [
          { id: "blue", name: "青花瓷", body: "#F2F1EA", pattern: "#33586F", note: "白地蓝花，对比清楚。", fact: "白地蓝花，用钴料画花纹，再上釉烧制。" },
          { id: "celadon", name: "青瓷", body: "#8EA6A6", pattern: "#6E8E8A", note: "单色釉，温润安静。", fact: "单色釉，颜色像玉，宋代汝窑最有名。" },
          { id: "color", name: "彩绘", body: "#FFF8EC", pattern: "#D07A5F", note: "多色装饰，热闹明亮。", fact: "多种颜色，热闹明亮，明清很流行。" }
        ]
      },
      quiz: [
        {
          question: "下面哪一项更像瓷器？",
          options: ["更白、更硬、更光滑", "更粗、更软、更吸水", "一定是黑色", "一定没有釉"],
          correct: 0,
          explanation: "瓷器通常更致密、坚硬，表面也更光滑。"
        },
        {
          question: "青花瓷主要是什么配色？",
          options: ["白地蓝花", "红地金字", "全黑", "全绿"],
          correct: 0,
          explanation: "青花瓷以白地蓝花为主要特征。"
        },
        {
          question: "关于汝窑，下面哪种说法更稳妥？",
          options: ["全世界只有一件", "存世很少，具体数字有争议", "每件颜色完全一样", "它属于陶器"],
          correct: 1,
          explanation: "汝窑传世数量少，但具体统计存在争议。"
        }
      ],
      exercise: {
        title: "画一个自己的瓶子",
        prompt: "在纸上画一个瓶子，选一种釉色。",
        steps: [
          "先画瓶子的外形",
          "选青花或青瓷中的一种",
          "用少量颜色完成",
          "写下你选择的颜色名字"
        ],
        hint: "不要涂得太满。留一点浅色，釉面看起来更亮。"
      },
      sources: [
        { title: "故宫博物院陶瓷馆", source: "故宫博物院", url: "https://www.dpm.org.cn/", desc: "查看青花瓷、汝窑和历代陶瓷公开资料。" },
        { title: "中国国家博物馆", source: "中国国家博物馆", url: "https://www.chnmuseum.cn/", desc: "查看古代陶瓷公开藏品。" },
        { title: "中国陶瓷图片检索", source: "Wikimedia Commons", url: "https://commons.wikimedia.org/w/index.php?search=Chinese+porcelain&title=Special:MediaSearch&type=image", desc: "用公开图片观察器形和釉色。" }
      ]
    },
    {
      index: 7,
      slug: "07-costume",
      title: "衣服的秘密",
      subtitle: "古人的衣服有规矩",
      question: "为什么领子要交叉？",
      summary: "认识交领右衽、广袖和腰带，理解传统服饰的形制与场合。",
      duration: "40分钟",
      ageGroup: "小学3-6年级",
      visualMark: "衣",
      theme: "#D4A373",
      themeDeep: "#A25F2B",
      art: "07-costume",
      mantra: {
        text: "领子y、袖子宽、腰带系，衣服的秘密在规矩里。",
        note: "传统服装不止一种样子。不同朝代差别很大。"
      },
      review: "上一课说，釉色和光泽会变。衣服的形制也会变。",
      story: {
        label: "先想一想",
        text: "如果衣服没有扣子，它怎样才不会散开？"
      },
      sections: [
        {
          id: "collar",
          title: "交领右衽",
          kicker: "知识点 1",
          paragraphs: [
            "交领的领子会交叉。",
            "常见穿法是左边压住右边。",
            "这个形制叫交领右衽。",
            "看起来像一个字母y。"
          ],
          insight: "领口的交叉，也是身份的标记。",
          fact: "不同朝代也有圆领、对襟等形制。",
          caution: "不要说所有古人都只穿交领右衽。",
          source: "史实。服饰史与博物馆公开资料。",
          sourceUrl: "https://www.dpm.org.cn/"
        },
        {
          id: "sleeves",
          title: "广袖",
          kicker: "知识点 2",
          paragraphs: [
            "广袖就是很宽的袖子。",
            "抬手时，袖子会飘起来。",
            "礼仪和舞蹈中很好看。",
            "古人也会穿窄袖，方便做事。"
          ],
          insight: "衣服的宽窄，和使用场合有关。",
          fact: "文学里说袖子里能装东西，是夸张写法。",
          caution: "不要以为所有袖子都能装重物。",
          source: "史实与审美赏析。服饰史公开资料。",
          sourceUrl: "https://www.chnmuseum.cn/"
        },
        {
          id: "belt",
          title: "腰带",
          kicker: "知识点 3",
          paragraphs: [
            "传统衣服常用腰带固定。",
            "腰带可以打结，也可以束紧。",
            "上面还能挂玉佩和香囊。",
            "不同身份，腰带也不一样。"
          ],
          insight: "腰带既实用，也能表达身份和审美。",
          fact: "玉佩和香囊的搭配，也有时代差异。",
          caution: "不要把一种腰带样式说成所有朝代通用。",
          source: "史实。服饰与配饰公开资料。",
          sourceUrl: "https://www.dpm.org.cn/"
        }
      ],
      interactive: {
        type: "costumeStudio",
        title: "传统服装搭配台",
        description: "选择领型、袖型和腰带颜色，看看衣服怎样变化。",
        hints: ["先选领型。", "再选袖型和腰带颜色。", "试试交领、广袖、朱红腰带，看看评价。"],
        collars: [
          { id: "cross", name: "交领" },
          { id: "round", name: "圆领" }
        ],
        sleeves: [
          { id: "wide", name: "广袖" },
          { id: "narrow", name: "窄袖" }
        ],
        belts: [
          { id: "ochre", name: "赭石", color: "#A25F2B" },
          { id: "jade", name: "青玉", color: "#5F8A78" },
          { id: "red", name: "朱红", color: "#B83A2D" }
        ]
      },
      quiz: [
        {
          question: "交领右衽常被形容成什么形状？",
          options: ["字母y", "圆形", "三角形", "一条直线"],
          correct: 0,
          explanation: "交叉的领口从正面看像字母y。"
        },
        {
          question: "广袖最适合下面哪种描述？",
          options: ["袖子很宽，飘动明显", "袖子很短", "没有袖子", "只用于运动"],
          correct: 0,
          explanation: "广袖宽大，礼仪和舞蹈中很醒目。"
        },
        {
          question: "关于传统服饰，哪种说法更准确？",
          options: ["所有朝代都一样", "只有一种正确款式", "不同朝代和身份差别很大", "只能用红色"],
          correct: 2,
          explanation: "传统服饰随时代、身份和场合变化。"
        }
      ],
      exercise: {
        title: "设计一件传统衣服",
        prompt: "画一件你设计的传统衣服。",
        steps: [
          "画出领口的交叉或圆形",
          "选择广袖或窄袖",
          "画一条腰带",
          "给衣服取一个名字"
        ],
        hint: "先画大的外形，再补领子和腰带。"
      },
      sources: [
        { title: "故宫博物院", source: "故宫博物院", url: "https://www.dpm.org.cn/", desc: "查看织绣和服饰相关公开藏品。" },
        { title: "中国国家博物馆", source: "中国国家博物馆", url: "https://www.chnmuseum.cn/", desc: "查看历代服饰与配饰公开资料。" },
        { title: "中国传统服饰图片检索", source: "Wikimedia Commons", url: "https://commons.wikimedia.org/w/index.php?search=Hanfu&title=Special:MediaSearch&type=image", desc: "用公开图片观察领型和袖型。" }
      ]
    },
    {
      index: 8,
      slug: "08-garden",
      title: "花园的秘密",
      subtitle: "中国花园一步一个景",
      question: "门洞为什么像一幅画框？",
      summary: "从借景、框景和曲径出发，理解园林怎样安排观看的路线。",
      duration: "40分钟",
      ageGroup: "小学3-6年级",
      visualMark: "园",
      theme: "#95B88A",
      themeDeep: "#5A8450",
      art: "08-garden",
      mantra: {
        text: "借远景、框近景、弯路走，花园的秘密在藏与借里。",
        note: "园林不是一眼看完，而是一步一步发现。"
      },
      review: "上一课看了衣服的规矩。花园也安排观看的路线。",
      story: {
        label: "先想一想",
        text: "如果站在亭子里，能看到园外的塔，塔算不算花园的一部分？"
      },
      sections: [
        {
          id: "borrowed",
          title: "借景",
          kicker: "知识点 1",
          paragraphs: [
            "借景是把园外的景色用进园内。",
            "远处的塔、山和树都可以借。",
            "它能让花园看起来更大。",
            "观看的位置很重要。"
          ],
          insight: "园林不只管园内，也安排园外的视线。",
          fact: "借景要真的看得见，才算用得上。",
          caution: "不是每一处园外景物都能借进园中。",
          source: "史实与审美赏析。古典园林公开资料。",
          sourceUrl: "https://whc.unesco.org/en/list/813/"
        },
        {
          id: "framed",
          title: "框景",
          kicker: "知识点 2",
          paragraphs: [
            "框景用门洞或窗洞来取景。",
            "框住的景色，像一幅画。",
            "走近一步，画就变了。",
            "圆洞、方窗和花窗都能框景。"
          ],
          insight: "边框会改变我们看景的顺序。",
          fact: "框景既有实用功能，也是一种构图方法。",
          caution: "框景不是随便开一个洞，位置要经过安排。",
          source: "审美赏析。苏州古典园林公开资料。",
          sourceUrl: "https://whc.unesco.org/en/list/813/"
        },
        {
          id: "winding",
          title: "曲径",
          kicker: "知识点 3",
          paragraphs: [
            "园林里的路常常弯弯的。",
            "转弯后，会看到新的景色。",
            "这种感觉叫移步换景。",
            "它让游园像一次探索。"
          ],
          insight: "路线的变化，也是观看的变化。",
          fact: "移步换景是形容观看感受，不是每一步都完全不同。",
          caution: "皇家园林和私家园林差别很大。",
          source: "审美赏析。古典园林公开资料。",
          sourceUrl: "https://whc.unesco.org/en/list/813/"
        }
      ],
      interactive: {
        type: "gardenFrames",
        title: "框景取景器",
        description: "点一个门洞或窗洞，看看它框住了什么。",
        hints: ["先点一个门洞或窗洞。", "圆门洞、花窗、回廊框住的景色不同。", "依次点圆门洞、花窗、回廊，看说明变化。"],
        frames: [
          { id: "moon", name: "圆门洞", holds: "远处的塔", note: "把远景框进来，空间像被拉长了。" },
          { id: "window", name: "花窗", holds: "假山和竹影", note: "近景被分成几块，更有层次。" },
          { id: "corridor", name: "回廊", holds: "水面和桥", note: "一边走，一边换景。" }
        ]
      },
      quiz: [
        {
          question: "借景是把什么借进园里？",
          options: ["园外的景色", "别人的家具", "地砖", "屋顶"],
          correct: 0,
          explanation: "借景利用园外可见的景物，扩大园内感受。"
        },
        {
          question: "框景常用什么来取景？",
          options: ["门洞和窗洞", "手机", "镜子", "书本"],
          correct: 0,
          explanation: "门洞、窗洞和花窗都能把景色框起来。"
        },
        {
          question: "移步换景更准确的意思是什么？",
          options: ["每走一步景色都完全改变", "走动时看到的景会变化", "园林只有一条直路", "花园没有植物"],
          correct: 1,
          explanation: "移步换景形容行走中观看位置变化带来的景色变化。"
        }
      ],
      exercise: {
        title: "设计一个小花园",
        prompt: "在纸上画一个花园。",
        steps: [
          "画一条弯曲的小路",
          "加一块石头或一座小山",
          "画一个门洞或花窗",
          "说说你想框住什么景色"
        ],
        hint: "先安排路线，再放景物。路不要画成直线。"
      },
      sources: [
        { title: "UNESCO 苏州古典园林", source: "UNESCO World Heritage Centre", url: "https://whc.unesco.org/en/list/813/", desc: "查看苏州古典园林的公开介绍。" },
        { title: "故宫博物院", source: "故宫博物院", url: "https://www.dpm.org.cn/", desc: "查看皇家园林和建筑空间公开资料。" },
        { title: "苏州园林图片检索", source: "Wikimedia Commons", url: "https://commons.wikimedia.org/w/index.php?search=Suzhou+garden&title=Special:MediaSearch&type=image", desc: "用公开图片观察框景和路径。" }
      ]
    },
    {
      index: 9,
      slug: "09-festival",
      title: "节日的秘密",
      subtitle: "节日的颜色都有来历",
      question: "过年为什么到处都是红色？",
      summary: "从春节、端午和中秋出发，看看节日颜色怎样和季节与习俗相连。",
      duration: "40分钟",
      ageGroup: "小学3-6年级",
      visualMark: "节",
      theme: "#E07A5F",
      themeDeep: "#C04F35",
      art: "09-festival",
      mantra: {
        text: "春节红、端午绿、中秋黄，节日的秘密在季节里。",
        note: "不同地方的节日过法不完全一样。"
      },
      review: "上一课说，园林靠路线取景。节日也用颜色提示季节。",
      story: {
        label: "先想一想",
        text: "如果给一年画一条颜色带，春节、端午和中秋会是什么颜色？"
      },
      sections: [
        {
          id: "spring",
          title: "春节红",
          kicker: "知识点 1",
          paragraphs: [
            "春节常见的颜色是红色。",
            "红灯笼、红对联、红包都用红色。",
            "红色看起来热闹、喜庆。",
            "古人认为红色能驱邪。"
          ],
          insight: "先看颜色，再看它和什么习俗一起出现。",
          fact: "红色驱邪是民间信仰和传说，不是史实结论。",
          caution: "要说古人认为，不要写成科学事实。",
          source: "民间信仰与民俗。中国非物质文化遗产网公开资料。",
          sourceUrl: "https://www.ihchina.cn/"
        },
        {
          id: "dragon-boat",
          title: "端午绿",
          kicker: "知识点 2",
          paragraphs: [
            "端午常见艾草和粽叶。",
            "它们都是绿色的。",
            "绿色让人想到夏天和植物。",
            "端午也有五彩绳，不只一种颜色。"
          ],
          insight: "绿色来自植物，也来自季节。",
          fact: "艾草、粽叶和五彩绳，都是端午常见元素。",
          caution: "不同地区的端午习俗不完全一样。",
          source: "民俗。中国非物质文化遗产网公开资料。",
          sourceUrl: "https://www.ihchina.cn/"
        },
        {
          id: "mid-autumn",
          title: "中秋黄",
          kicker: "知识点 3",
          paragraphs: [
            "中秋的月亮很圆。",
            "月饼和桂花常带黄色。",
            "黄色让人想到秋天和丰收。",
            "中秋也和团圆有关。"
          ],
          insight: "节日颜色，常和眼前的事物有关。",
          fact: "月亮本身不是黄色，我们看到的是视觉感受。",
          caution: "不要用一个颜色概括所有地区的节日。",
          source: "民俗与审美赏析。中国非物质文化遗产网公开资料。",
          sourceUrl: "https://www.ihchina.cn/"
        }
      ],
      interactive: {
        type: "festivalColor",
        title: "节日配色",
        description: "选一个节日，再选出最合适的颜色。",
        hints: ["先选一个节日。", "春节偏红，端午偏绿，中秋偏黄。", "春节点朱红，端午点艾绿，中秋点月黄。"],
        festivals: [
          { id: "spring", name: "春节", answer: "#E14B3B", hint: "灯笼和对联常用这个颜色。", items: ["红灯笼", "春联", "红包", "鞭炮"] },
          { id: "dragon", name: "端午", answer: "#6F9B63", hint: "艾草和粽叶让你想到这个颜色。", items: ["艾草", "粽叶", "龙舟", "五彩绳"] },
          { id: "moon", name: "中秋", answer: "#D6A22C", hint: "月亮、月饼和桂花常给人这种感觉。", items: ["月饼", "月亮", "桂花", "兔子"] }
        ],
        colors: [
          { name: "朱红", color: "#E14B3B" },
          { name: "艾绿", color: "#6F9B63" },
          { name: "月黄", color: "#D6A22C" },
          { name: "靛蓝", color: "#33586F" }
        ]
      },
      quiz: [
        {
          question: "红色能驱邪，属于下面哪一类？",
          options: ["民间信仰和传说", "确定的历史事实", "数学公式", "天气记录"],
          correct: 0,
          explanation: "这是民间信仰和传说中的说法，要说明古人认为。"
        },
        {
          question: "端午节常见的绿色来自哪里？",
          options: ["艾草和粽叶", "红灯笼", "月饼", "春联"],
          correct: 0,
          explanation: "艾草和粽叶都是端午常见的绿色植物。"
        },
        {
          question: "中秋的黄色最容易让人想到什么？",
          options: ["月亮、月饼和桂花", "雪花", "海浪", "沙漠"],
          correct: 0,
          explanation: "中秋的视觉元素常和月亮、月饼、桂花联系在一起。"
        }
      ],
      exercise: {
        title: "画一个节日场景",
        prompt: "选一个节日，画一个小场景。",
        steps: [
          "先写出节日的名字",
          "选一个代表颜色",
          "画出两三个节日物品",
          "说说颜色为什么合适"
        ],
        hint: "先想季节，再想物品，最后选颜色。"
      },
      sources: [
        { title: "中国非物质文化遗产网", source: "中国非物质文化遗产网", url: "https://www.ihchina.cn/", desc: "查看春节、端午、中秋相关公开条目。" },
        { title: "故宫博物院", source: "故宫博物院", url: "https://www.dpm.org.cn/", desc: "查看宫廷节令与工艺公开资料。" },
        { title: "中国传统节日图片检索", source: "Wikimedia Commons", url: "https://commons.wikimedia.org/w/index.php?search=Chinese+festival&title=Special:MediaSearch&type=image", desc: "用公开图片观察节日色彩和物品。" }
      ]
    },
    {
      index: 10,
      slug: "10-sculpture",
      title: "石头的秘密",
      subtitle: "石窟里的佛像会微笑",
      question: "石头做的脸，为什么看起来在笑？",
      summary: "认识敦煌、云冈、龙门和麦积山，观察石窟造像的表情与风格。",
      duration: "40分钟",
      ageGroup: "小学3-6年级",
      visualMark: "石",
      theme: "#9A8C98",
      themeDeep: "#6B5A6B",
      art: "10-sculpture",
      mantra: {
        text: "敦煌彩、云冈壮、龙门笑，石头的秘密在工匠手里。",
        note: "佛像的微笑是艺术风格，不是说佛真的在笑。"
      },
      review: "上一课看了节日的颜色。石头上的表情也有时代风格。",
      story: {
        label: "先想一想",
        text: "一尊石像没有动，为什么看久了，会觉得它的表情在变化？"
      },
      sections: [
        {
          id: "dunhuang",
          title: "敦煌",
          kicker: "知识点 1",
          paragraphs: [
            "敦煌莫高窟在甘肃。",
            "这里有壁画，也有彩塑。",
            "颜色丰富，故事很多。",
            "它记录了很长一段时间的变化。"
          ],
          insight: "先看材料，再看颜色和内容。",
          fact: "莫高窟以壁画和彩塑闻名。",
          caution: "壁画颜色会随时间变化，不能用今天的颜色直接推断原貌。",
          source: "史实。敦煌研究院与 UNESCO 公开资料。",
          sourceUrl: "https://whc.unesco.org/en/list/440/"
        },
        {
          id: "yungang",
          title: "云冈",
          kicker: "知识点 2",
          paragraphs: [
            "云冈石窟在山西。",
            "这里的佛像很大，也很有力量。",
            "山崖就是雕刻的背景。",
            "整体感觉雄伟、厚重。"
          ],
          insight: "大和重，是云冈给人的第一印象。",
          fact: "云冈石窟以石刻造像为主。",
          caution: "石窟造像风格会随时代变化，不要用一个词概括全部。",
          source: "史实。UNESCO 世界遗产公开资料。",
          sourceUrl: "https://whc.unesco.org/en/list/1039/"
        },
        {
          id: "longmen",
          title: "龙门",
          kicker: "知识点 3",
          paragraphs: [
            "龙门石窟在河南。",
            "卢舍那大佛很有名。",
            "它的脸圆润，表情慈祥。",
            "嘴角微微上扬，像在微笑。"
          ],
          insight: "线条和角度，会改变一张脸的表情。",
          fact: "中国四大石窟是敦煌、云冈、龙门和麦积山。",
          caution: "佛像微笑是艺术风格，不是佛真的在笑。",
          source: "史实与审美赏析。UNESCO 世界遗产公开资料。",
          sourceUrl: "https://whc.unesco.org/en/list/1003/"
        }
      ],
      interactive: {
        type: "grottoObserver",
        title: "石窟观察台",
        description: "切换石窟，观察材料、颜色和表情的变化。",
        hints: ["先点一个石窟。", "看材料和观察重点。", "依次点敦煌、云冈、龙门、麦积山。"],
        caves: [
          { id: "dunhuang", name: "敦煌", material: "壁画和彩塑", look: "颜色丰富，故事多", tone: "#C98A5B", observe: ["看看壁画里有哪些颜色。", "找一找人物和故事。", "想一想颜色为什么这么丰富。"] },
          { id: "yungang", name: "云冈", material: "山崖石刻", look: "体量大，气势雄伟", tone: "#9A8C98", observe: ["看佛像的体型是壮还是瘦。", "看石头表面的质感。", "想一想山崖怎样变成雕像。"] },
          { id: "longmen", name: "龙门", material: "石灰岩石刻", look: "面容圆润，表情慈祥", tone: "#B7A99A", observe: ["看佛像的嘴角是上扬还是下垂。", "看脸型是圆润还是方正。", "找一找唐代造像的从容感。"] },
          { id: "maijishan", name: "麦积山", material: "泥塑和彩绘", look: "微笑温和，姿态亲切", tone: "#C7A19B", extra: true, observe: ["看泥塑的微笑和姿态。", "找一找彩绘留下的颜色。", "想一想泥塑和石刻的差别。"] }
        ]
      },
      quiz: [
        {
          question: "敦煌莫高窟最出名的是什么？",
          options: ["壁画和彩塑", "只有木家具", "只有玻璃", "现代海报"],
          correct: 0,
          explanation: "莫高窟以壁画和彩塑闻名。"
        },
        {
          question: "云冈石窟给人什么整体感觉？",
          options: ["雄伟厚重", "轻巧透明", "完全平面", "只有文字"],
          correct: 0,
          explanation: "云冈大像体量宏大，石刻感强。"
        },
        {
          question: "佛像的微笑应该怎样理解？",
          options: ["佛真的在笑", "一种艺术风格和观看感受", "天气造成的", "石头自己长出来的"],
          correct: 1,
          explanation: "微笑是工匠通过线条和表情造成的艺术效果。"
        }
      ],
      exercise: {
        title: "画一个微笑的脸",
        prompt: "画一张圆圆的脸，让它看起来在微笑。",
        steps: [
          "先画一个圆脸",
          "画两条弯弯的眼睛",
          "画一条微微上扬的嘴",
          "把画拿远一点，再看看感觉"
        ],
        hint: "眼睛和嘴角一起变化，微笑会更自然。"
      },
      sources: [
        { title: "UNESCO 莫高窟", source: "UNESCO World Heritage Centre", url: "https://whc.unesco.org/en/list/440/", desc: "查看莫高窟公开介绍。" },
        { title: "UNESCO 云冈石窟", source: "UNESCO World Heritage Centre", url: "https://whc.unesco.org/en/list/1039/", desc: "查看云冈石窟公开介绍。" },
        { title: "UNESCO 龙门石窟", source: "UNESCO World Heritage Centre", url: "https://whc.unesco.org/en/list/1003/", desc: "查看龙门石窟公开介绍。" }
      ]
    }
  ]
};
