/* =========================================================
   모든 페이지에 똑같이 들어가는 부분 (캐릭터, 메뉴, 하단, 꽃)
   → 이 파일 하나만 고치면 모든 페이지에 적용돼요.
   글자와 주소는 content.js 에서 가져와요.
   ========================================================= */

(function () {
  var page = document.body.getAttribute('data-page') || 'home';   // home / about / contact / project
  var isHome = page === 'home';

  /* ---------- 작은 도구들 (main.js 에서도 같이 써요) ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  // **굵게** 표시를 진짜 굵은 글씨로
  function richText(s) {
    return escapeHtml(s || '').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  }
  // 빈 줄로 문단 나누기
  function paragraphs(box, text) {
    String(text || '').trim().split(/\n\s*\n/).forEach(function (para) {
      if (para.trim()) {
        var p = el('p');
        p.innerHTML = richText(para.trim());
        box.appendChild(p);
      }
    });
  }
  function fullUrl(url) {
    if (!url) return '';
    return /^(https?:|mailto:)/i.test(url) ? url : 'https://' + url;   // www. 로 시작해도 괜찮아요
  }
  // 이미지 칸: 이미지가 없으면 빈칸 + 파일 이름 안내
  // swapExt = true 면 파일이 없을 때 확장자를 바꿔 한 번 더 찾아요 (.jpg ↔ .png, .jpeg → .png)
  //   예) content.js 에 "01.jpg" 라고 적었는데 폴더에 01.png 가 있어도 보여요 (Personal Works 용)
  function swapExtension(src) {
    var m = /\.(jpe?g|png)$/i.exec(src);
    if (!m) return '';
    return src.slice(0, m.index) + (/png/i.test(m[1]) ? '.jpg' : '.png');
  }
  function mediaBox(cls, src, alt, hint, swapExt) {
    var box = el('div', cls);
    var ph = el('div', 'placeholder');
    ph.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="14" rx="3"/><circle cx="9" cy="10" r="1.6"/><path d="m5 17 4.5-4 3 2.6 2.5-2.1L19.5 17"/></svg>';
    ph.appendChild(el('span', 'placeholder__hint', hint));
    box.appendChild(ph);
    if (src) {
      var img = el('img');
      img.alt = alt || '';
      img.loading = 'lazy';
      img.decoding = 'async';
      var other = swapExt ? swapExtension(src) : '';
      img.onload = function () { box.classList.add('is-loaded'); };
      img.onerror = function () {
        if (other) { var next = other; other = ''; img.src = next; return; }
        img.remove();
      };
      img.src = src;
      box.appendChild(img);
    }
    return box;
  }

  /* ---------- 🌸 꽃 모양 (모든 꽃이 이 한 곳에서 그려져요) ----------
     <span data-flower="pink"></span>    → 핑크 선 꽃
     <span data-flower="yellow"></span>  → 노랑 선 꽃
     <span data-flower="black"></span>   → 블랙 선 꽃 (하단 아이콘)
     색과 선 굵기는 css/style.css 맨 위 '꽃' 칸에서 바꿔요.
     모양을 바꾸고 싶으면 아래 숫자 3개만 고치면 돼요.            */
  var FLOWER = {
    outer: 19.8,   // 꽃잎 끝까지의 크기 (그림판 48칸 중)
    inner: 7.4,    // 꽃잎 사이 홈이 들어가는 깊이 (작을수록 깊게)
    round: 0.5,    // 꽃잎의 통통함 (작을수록 넓고 네모나게, 클수록 갸름하게)
  };
  var flowerPath = (function () {
    var n = 200, pts = [], i;
    for (i = 0; i < n; i++) {
      var t = i / n * Math.PI * 2;
      var k = Math.pow(Math.abs(Math.cos(5 * t / 2)), FLOWER.round);     // 꽃잎 5장
      var r = FLOWER.inner + (FLOWER.outer - FLOWER.inner) * k;
      pts.push([24 + r * Math.sin(t), 24.6 - r * Math.cos(t)]);
    }
    var mid = function (a, b) { return ((a[0] + b[0]) / 2).toFixed(2) + ' ' + ((a[1] + b[1]) / 2).toFixed(2); };
    var d = 'M' + mid(pts[0], pts[1]);
    for (i = 1; i <= n; i++) {
      var a = pts[i % n], b = pts[(i + 1) % n];
      d += ' Q' + a[0].toFixed(2) + ' ' + a[1].toFixed(2) + ' ' + mid(a, b);
    }
    return d + 'Z';
  })();
  function drawFlowers(root) {
    (root || document).querySelectorAll('[data-flower]:not(.is-drawn)').forEach(function (f) {
      f.classList.add('flower', 'flower--' + (f.getAttribute('data-flower') || 'pink'), 'is-drawn');
      f.setAttribute('aria-hidden', 'true');
      f.innerHTML = '<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path class="flower__line" d="' + flowerPath + '"/></svg>';
    });
  }

  window.UI = {
    $: $, el: el, richText: richText, paragraphs: paragraphs,
    fullUrl: fullUrl, mediaBox: mediaBox, drawFlowers: drawFlowers,
  };

  /* =========================================================
     1) 왼쪽 위 캐릭터 + 오른쪽 위 메뉴
     ========================================================= */
  var menu = SITE.menu || {};
  var header = $('[data-site-header]');
  if (header) {
    header.innerHTML =
      // 캐릭터: 누르면 메인 페이지 맨 위로
      '<a class="character" href="' + (isHome ? '#top' : 'index.html') + '" aria-label="메인 페이지 맨 위로">' +
        '<div class="character__float">' +
          '<span class="character__glow" aria-hidden="true"></span>' +
          '<img class="character__img" src="images/character/character.webp" alt="빙글빙글 도는 캐릭터" width="280" height="280">' +
        '</div>' +
      '</a>' +
      '<nav class="site-nav" aria-label="메뉴">' +
        '<a class="nav-link" data-nav="works" href="' + (isHome ? '#works' : 'index.html#works') + '"><span></span></a>' +
        '<a class="nav-link" data-nav="about" href="about.html"><span></span></a>' +
        '<a class="nav-link" data-nav="contact" href="contact.html"><span></span></a>' +
      '</nav>';
    header.querySelectorAll('.nav-link').forEach(function (a) {
      $('span', a).textContent = menu[a.getAttribute('data-nav')] || a.getAttribute('data-nav');
    });
  }

  // 휴대폰: 캐릭터를 톡 누르면 잠깐 빛나기
  var ch = $('.character');
  var glowTimer;
  if (ch) ch.addEventListener('touchstart', function () {
    ch.classList.add('is-glowing');
    clearTimeout(glowTimer);
    glowTimer = setTimeout(function () { ch.classList.remove('is-glowing'); }, 1600);
  }, { passive: true });

  /* ---------- 메뉴: 손으로 그린 듯한 진한 핑크 타원 ---------- */
  var SVG_NS = 'http://www.w3.org/2000/svg';
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));

  // 항상 같은 모양이 나오는 '랜덤' (메뉴마다 삐뚤빼뚤한 모양이 달라요)
  function seeded(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function drawInk(a, index) {
    var old = $('.nav-ink', a);
    if (old) old.remove();

    var w = a.offsetWidth, h = a.offsetHeight;
    if (!w) return;
    var pad = 10;
    var rand = seeded(index * 97 + 13);

    var cx = w / 2 + pad, cy = h / 2 + pad;
    var rx = w / 2 - 1, ry = h / 2 - 2;
    var tilt = (rand() - 0.5) * 0.12;                   // 살짝 기울어진 타원
    var start = Math.PI * (0.92 + rand() * 0.12);         // 왼쪽에서 펜을 대기 시작
    var sweep = Math.PI * 2 + 0.55 + rand() * 0.3;        // 한 바퀴보다 조금 더 (끝이 겹치게)
    var p1 = rand() * 6.28, p2 = rand() * 6.28;
    var steps = 72, pts = [];

    for (var i = 0; i <= steps; i++) {
      var k = i / steps;
      var t = start + sweep * k;
      // 반지름을 조금씩 흔들어서 손으로 그린 느낌
      var f = 1 + 0.045 * Math.sin(2 * t + p1) + 0.03 * Math.sin(3 * t + p2) + 0.09 * k - 0.03;
      var x = rx * f * Math.cos(t), y = ry * f * Math.sin(t);
      pts.push([
        cx + x * Math.cos(tilt) - y * Math.sin(tilt),
        cy + x * Math.sin(tilt) + y * Math.cos(tilt),
      ]);
    }

    var d = 'M' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1);
    for (var j = 1; j < pts.length - 1; j++) {
      var mx = (pts[j][0] + pts[j + 1][0]) / 2, my = (pts[j][1] + pts[j + 1][1]) / 2;
      d += ' Q' + pts[j][0].toFixed(1) + ' ' + pts[j][1].toFixed(1) + ' ' + mx.toFixed(1) + ' ' + my.toFixed(1);
    }

    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'nav-ink');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('width', w + pad * 2);
    svg.setAttribute('height', h + pad * 2 + 8);
    svg.style.left = -pad + 'px';
    svg.style.top = -pad + 'px';

    var loop = document.createElementNS(SVG_NS, 'path');
    loop.setAttribute('class', 'nav-ink__loop');
    loop.setAttribute('d', d);
    svg.appendChild(loop);

    // 타원 아래 작은 점
    var low = pts.reduce(function (m, q) { return q[1] > m[1] ? q : m; }, pts[0]);
    var dot = document.createElementNS(SVG_NS, 'circle');
    dot.setAttribute('class', 'nav-ink__dot');
    dot.setAttribute('cx', (low[0] + (rand() - 0.5) * 6).toFixed(1));
    dot.setAttribute('cy', (low[1] + 4.2).toFixed(1));
    dot.setAttribute('r', '2.4');
    svg.appendChild(dot);

    a.appendChild(svg);
    loop.style.setProperty('--len', Math.ceil(loop.getTotalLength()) + 1);
  }

  // 메뉴 + 손그림 타원 테두리 버튼(data-ink, 예: Contact 의 Submit)
  var inkTargets = navLinks.concat(Array.prototype.slice.call(document.querySelectorAll('[data-ink]')));
  function drawAllInk() { inkTargets.forEach(drawInk); }
  window.UI.redrawInk = drawAllInk;
  drawAllInk();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawAllInk);
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(drawAllInk, 150);
  });

  var currentNav;
  function setActiveNav(key) {
    if (key === currentNav) return;
    currentNav = key;
    navLinks.forEach(function (a) {
      var on = a.getAttribute('data-nav') === key;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }

  // 어느 메뉴에 타원을 그릴지
  if (page === 'about') setActiveNav('about');
  else if (page === 'contact') setActiveNav('contact');
  else if (page === 'project') setActiveNav('works');
  else {
    // 메인: Works ~ Personal Works 부분을 보고 있을 때만 Works
    var ticking = false;
    var updateNav = function () {
      ticking = false;
      var line = window.innerHeight * 0.4;
      var start = document.getElementById('works');
      var end = document.getElementById('personal') || start;
      var on = start && start.getBoundingClientRect().top <= line && end.getBoundingClientRect().bottom > line;
      // 하단이 화면 아래 30% 위로 올라오면(= 하단을 보고 있으면) 타원을 꺼요
      var foot = document.querySelector('.site-footer');
      if (foot && foot.getBoundingClientRect().top < window.innerHeight * 0.7) on = false;
      setActiveNav(on ? 'works' : null);
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(updateNav); }
    }, { passive: true });
    window.addEventListener('resize', updateNav);
    window.addEventListener('load', updateNav);
    document.addEventListener('DOMContentLoaded', updateNav);
  }

  /* =========================================================
     2) 하단 (버터 노랑) — 왼쪽: 꽃 아이콘 + ©  /  오른쪽: 글자 링크 3칸
     ========================================================= */
  var footer = $('[data-site-footer]');
  if (footer) {
    var link = function (href, label, newTab) {
      if (!href) return '';
      return '<li><a class="foot-link" href="' + href + '"' + (newTab ? ' target="_blank" rel="noopener"' : '') + '><span>' + escapeHtml(label) + '</span></a></li>';
    };
    footer.outerHTML =
      '<footer class="site-footer">' +
        '<div class="site-footer__inner">' +
          '<div class="site-footer__brand">' +
            '<span data-flower="black" class="flower--footer"></span>' +
            '<p class="site-footer__copy">© ' + new Date().getFullYear() + ' ' + escapeHtml(SITE.name || '') + '</p>' +
          '</div>' +
          '<nav class="site-footer__cols" aria-label="하단 링크">' +
            '<ul class="site-footer__col">' +
              link(fullUrl(SITE.linkedin), 'LinkedIn', true) +
              link(fullUrl(SITE.instagram), 'Instagram', true) +
            '</ul>' +
            '<ul class="site-footer__col">' +
              link(isHome ? '#works' : 'index.html#works', menu.works || 'Works') +
              link('about.html', menu.about || 'About') +
            '</ul>' +
            '<ul class="site-footer__col">' +
              link('contact.html', (SITE.footer || {}).button || "Let's talk") +
            '</ul>' +
          '</nav>' +
        '</div>' +
      '</footer>';
  }

  drawFlowers();
})();
