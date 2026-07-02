document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. Header Scroll Effect & Active Navigation Link
  // ==========================================================================
  const header = document.getElementById('main-header');
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    // Scroll header background toggle
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll active link highlight
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${currentSectionId}`) {
          item.classList.add('active');
        }
      });
    }
  });

  // ==========================================================================
  // 2. Mobile Menu Toggle Drawer
  // ==========================================================================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileMenuBtn.innerHTML = isOpen 
        ? '<i class="fa-solid fa-xmark"></i>' 
        : '<i class="fa-solid fa-bars"></i>';
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });
  }

  // ==========================================================================
  // 3. Scroll Reveal Animations (Intersection Observer)
  // ==========================================================================
  const revealElements = document.querySelectorAll('.scroll-reveal');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          observer.unobserve(entry.target); // Trigger animation once
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if browser doesn't support IntersectionObserver
    revealElements.forEach(el => el.classList.add('reveal-active'));
  }

  // ==========================================================================
  // 4. Interactive Price & Portions Calculator (인정 계산기)
  // ==========================================================================
  const selectItems = document.querySelectorAll('.select-item');
  const hoisungTotalEl = document.querySelector('.hoisung-total');
  const marketTotalEl = document.querySelector('.market-total');
  const savedMoneyEl = document.getElementById('saved-money');
  const savedCommentEl = document.getElementById('saved-comment');

  let cart = {
    '옛날짜장면': 0,
    '간짜장 (곱빼기)': 0,
    '생등심 탕수육 (미니/소)': 0,
    '소주': 0
  };

  selectItems.forEach(item => {
    const minusBtn = item.querySelector('.minus');
    const plusBtn = item.querySelector('.plus');
    const countSpan = item.querySelector('.count');
    const itemName = item.getAttribute('data-name');
    const price = parseInt(item.getAttribute('data-price'));
    const marketPrice = parseInt(item.getAttribute('data-market-price'));

    plusBtn.addEventListener('click', () => {
      cart[itemName]++;
      countSpan.textContent = cart[itemName];
      updateTotals();
    });

    minusBtn.addEventListener('click', () => {
      if (cart[itemName] > 0) {
        cart[itemName]--;
        countSpan.textContent = cart[itemName];
        updateTotals();
      }
    });
  });

  function updateTotals() {
    let hoisungTotal = 0;
    let marketTotal = 0;

    selectItems.forEach(item => {
      const itemName = item.getAttribute('data-name');
      const price = parseInt(item.getAttribute('data-price'));
      const marketPrice = parseInt(item.getAttribute('data-market-price'));
      const count = cart[itemName];

      hoisungTotal += price * count;
      marketTotal += marketPrice * count;
    });

    const savedTotal = marketTotal - hoisungTotal;

    // Update numbers dynamically with locale formatting
    hoisungTotalEl.innerHTML = hoisungTotal.toLocaleString() + '<span>원</span>';
    marketTotalEl.innerHTML = marketTotal.toLocaleString() + '<span>원</span>';
    savedMoneyEl.textContent = savedTotal.toLocaleString() + '원';

    // Update custom flavor messages based on cart content
    let comment = "메뉴를 선택하시면 회성각의 넉넉한 인정을 보여드립니다!";

    if (hoisungTotal === 0) {
      comment = "메뉴를 선택하시면 회성각의 넉넉한 인정을 보여드립니다!";
    } else {
      const selectedNames = Object.keys(cart).filter(k => cart[k] > 0);
      
      let commentsList = [];
      if (cart['간짜장 (곱빼기)'] > 0) {
        commentsList.push(`두 끼 분량인 <strong>간짜장 곱빼기(${cart['간짜장 (곱빼기)']}개)</strong>로 든든한 식사가 가능해요.`);
      }
      if (cart['소주'] > 0) {
        commentsList.push(`소주를 병당 <strong>3,500원</strong>에 모십니다. (타 매장 대비 병당 1,500원 이득!)`);
      }
      if (cart['생등심 탕수육 (미니/소)'] > 0) {
        commentsList.push(`얼리지 않은 신선한 <strong>생고기 등심 탕수육</strong>으로 육즙 가득한 맛을 채웁니다.`);
      }
      if (cart['옛날짜장면'] > 0) {
        commentsList.push(`<strong>불맛 가득 옛날짜장면</strong>이 단돈 5,500원! 최고의 가성비입니다.`);
      }

      if (savedTotal > 0) {
        commentsList.push(`<br><span class="accent-comment">회성각을 선택하셔서 총 <strong>${savedTotal.toLocaleString()}원</strong>을 버셨습니다! 이 금액이면 소주 ${(Math.floor(savedTotal / 3500))}병을 더 마실 수 있어요!</span>`);
      }

      comment = commentsList.join('<br>');
    }

    savedCommentEl.innerHTML = comment;
  }
});
