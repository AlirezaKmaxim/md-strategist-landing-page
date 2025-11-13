  document.addEventListener('DOMContentLoaded', () => {
    // All Logo Pool for implement into Html
    const logoPaths = [
      "svg/Moshtarian-VisionHealth-Sabz-1.svg",
      "svg/Moshtarian-InBody-Sabz-1.svg",
      "svg/Panis-Logo-PNG-Sabz-1.svg",
      "svg/logo-ala-1.svg",
      "svg/Moshtarian-Dr.-Nourouzi-Sabz-1-1.svg",
      "svg/Vector-3.svg",
      "svg/logo-kamo-05-1-1.svg",
      "svg/dorwa-logo-1.svg",
      "svg/halal-iran-logo-1.svg",
      "svg/ariana-dream-1.svg",
      "svg/rezazadeh-logo-1.svg",
      "svg/dr-kazemi-logo-1-1.svg",
      "svg/اشترومن-1.svg",
      "svg/Vector-1.svg",
      "svg/آراکس-1.svg",
      "svg/Isolation_Mode-1.svg",
      "svg/tehran-brain-logo-1.svg",
      "svg/dr-shabani-logo-1.svg",
      "svg/Vector-2.svg",
      "svg/لوگو-در-دنتال-1.svg",
      "svg/ایرانیان03-1.svg",
      "svg/dr-karamilogo-ezgif.com-png-to-webp-converter-1.svg",
      "svg/Dr.-Pourhossini-Logo-PNG-Sabz-1.svg",
      "svg/Moshtarian-Dr.-Etminani-Sabz-1.svg",
      "svg/Moshtarian-Dr.-Nejat-Sabz-1.svg",
      "svg/Moshtarian-Dr.-Afsahi-Sabz-1.svg",
      "svg/Moshtarian-Dr.-Ranjbar-Sabz-1.svg",
    ];

    const swipers = [];
    const currentLogoIndex = []; // لوگوی فعلی هر سوایپر (real index)

    // کمکى: شافل کردن آرایه (الگوریتم Fisher–Yates)
    const shuffle = (arr) => {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };

    // آماده‌سازی اسلایدرها
    document.querySelectorAll('.logo-swiper').forEach((swiperEl, index) => {
      const wrapper = swiperEl.querySelector('.swiper-wrapper');
      if (!wrapper) return;

      // تمیز کردن محتوا
      wrapper.innerHTML = "";

      // همه لوگوها رو توی هر اسلایدر می‌ریزیم
      logoPaths.forEach((src) => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';

        const img = document.createElement('img');
        img.src = src;
        img.alt = "";

        slide.appendChild(img);
        wrapper.appendChild(slide);
      });

      const swiper = new Swiper(swiperEl, {
        effect: "fade",
        fadeEffect: { crossFade: true },
        loop: true,
        allowTouchMove: false,
        speed: 900,
        autoplay: false,
      });

      swipers.push(swiper);
    });

    if (!swipers.length) return;

    //  اطمینان از اینکه تعداد لوگوها >= تعداد سوایپرها
    if (logoPaths.length < swipers.length) {
      console.warn("تعداد لوگوها کمتر از تعداد خانه‌هاست؛ یکتا بودن همزمان ممکن نیست.");
    }

    // ✅ مقداردهی اولیه: هر خونه از اول یه لوگوی متفاوت بگیره
    const allIndices = [...Array(logoPaths.length).keys()]; // [0..N-1]
    shuffle(allIndices);

    swipers.forEach((swiper, i) => {
      const idx = allIndices[i % allIndices.length];
      currentLogoIndex[i] = idx;
      swiper.slideToLoop(idx, 0);  // بدون انیمیشن
    });

    //  تاخیر رندوم بین تغییرها
    const randomDelay = () => 700 + Math.random() * 900;

    const getNewUniqueLogoForSwiper = (swiperIndex) => {
      const used = new Set(
        currentLogoIndex.filter((_, i) => i !== swiperIndex) // همه به جز این سوایپر
      );

      const candidates = [];
      for (let i = 0; i < logoPaths.length; i++) {
        if (!used.has(i)) {
          candidates.push(i);
        }
      }

      const pool = candidates.length ? candidates : [...Array(logoPaths.length).keys()];

      let newIdx;
      const oldIdx = currentLogoIndex[swiperIndex];
      if (pool.length === 1) {
        newIdx = pool[0];
      } else {
        do {
          newIdx = pool[Math.floor(Math.random() * pool.length)];
        } while (newIdx === oldIdx);
      }

      return newIdx;
    };

    let lastSwiperIndex = -1;

    const tick = () => {
      if (!swipers.length) return;

      // یک سوایپر تصادفی، اما نه همون قبلی
      let swiperIndex;
      do {
        swiperIndex = Math.floor(Math.random() * swipers.length);
      } while (swipers.length > 1 && swiperIndex === lastSwiperIndex);

      lastSwiperIndex = swiperIndex;
      const swiper = swipers[swiperIndex];
      const newLogoIdx = getNewUniqueLogoForSwiper(swiperIndex);

      currentLogoIndex[swiperIndex] = newLogoIdx;
      swiper.slideToLoop(newLogoIdx, 900); // فید ۹۰۰ms

      setTimeout(tick, randomDelay());
    };

    // ⏱ شروع چرخه‌ی رندوم
    setTimeout(tick, randomDelay());

    // ✅ بعد از اینکه همه‌چیز آماده شد، گرید رو نشون بده (برای جلوگیری از فلیکر اولیه)
    const grid = document.querySelector('.parent');
    if (grid) {
      // مطمئن می‌شیم توی فریم بعدی کلاس اضافه بشه
      requestAnimationFrame(() => {
        grid.classList.add('grid-ready');
      });
    }
  });


























  
    document.addEventListener('DOMContentLoaded', () => {
      let hasClickedAllow = false;
      let videoElement = null;
      let stream = null;
      let lastHash = window.location.hash;

      const isMobile = () => window.innerWidth <= 768;

      // ✅ اگر #header وجود نداشت، داینامیک بسازش (بدون دست زدن به استایل‌های تو)
      const getHeaderContainer = () => {
        let header = document.querySelector('#header');
        if (!header) {
          header = document.createElement('div');
          header.id = 'header';
          header.style.position = 'fixed';
          header.style.top = '20px';
          header.style.left = '50%';
          header.style.transform = 'translateX(-50%)';
          header.style.zIndex = '9999';
          document.body.appendChild(header);
        }
        return header;
      };

      const updateClass = () => {
        const btn = document.querySelector('.btn-shine');
        if (!hasClickedAllow && btn) btn.classList.add('cam-logo');
      };

      const downdateClass = () => {
        const btn = document.querySelector('.cam-logo');
        if (btn) btn.classList.remove('cam-logo');
      };

      const addDynamicStyles = () => {
        let style = document.getElementById('dynamicStyles');
        if (!style) {
          style = document.createElement('style');
          style.id = 'dynamicStyles';
          document.head.appendChild(style);
        }

        if (isMobile()) {
          style.innerHTML = `
            #customMessageBox {
              width: 350px;
              height:60px;
              margin: 10px auto 0;
            }
            #customMessageBox > img {
              display: none;
            }
            #customMessageBox > button {
              padding: 8px;
              line-height: 20px;
              font-size: 14px;
            }
            #customMessageBox > span {
              margin-right: 4%;
              font-size: 13px;
            }
            .stream-video {
              height: 100%;
              object-fit: cover;
              border-radius:5px;
              transform: scaleX(-1);
            }
          `;
        } else {
          style.innerHTML = `
            #customMessageBox {
              width: 540px;
              height: 75px;
            }
            #customMessageBox > img {
              width: 75px;
              height: 75px;
            }
            #customMessageBox > button {
              padding: 2.5px 45px;
              line-height: 45px;
              font-size: 16px;
            }
            #customMessageBox > span {
              font-size: 14px;
            }
            .stream-video {
              height: 100%;
              object-fit: cover;
              border-radius: 5px;
              transform: scaleX(-1);
            }
          `;
        }
      };

      const showErrorMessage = () => {
        const target = getHeaderContainer();
        if (!target) return;

        const old = document.getElementById('customMessageBox');
        if (old) old.remove();

        const messageBox = document.createElement('div');
        messageBox.id = 'customMessageBox';
        messageBox.style.display = 'flex';
        messageBox.style.alignItems = 'center';
        messageBox.style.justifyContent = 'center';
        messageBox.style.background =
          'linear-gradient(82.94deg, #082223 3.66%, #1D4641 96.34%)';
        messageBox.style.borderRadius = '43.2px';
        messageBox.style.marginTop = '10px';
        messageBox.style.color = 'white';
        messageBox.style.transform = 'scaleX(0)';
        messageBox.style.transition = 'transform 0.6s ease-in-out';

        const messageText = document.createElement('span');
        messageText.textContent = 'متاسفانه امکان دسترسی به دوربین وجود ندارد!';
        messageText.style.fontSize = '14px';
        messageText.style.fontWeight = '500';
        messageText.style.textAlign = 'center';
        messageBox.appendChild(messageText);

        addDynamicStyles();
        target.appendChild(messageBox);
        setTimeout(() => (messageBox.style.transform = 'scaleX(1)'), 50);
      };

      const stopStream = () => {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          stream = null;
          if (videoElement) {
            videoElement.srcObject = null;
          }
        }
      };

      const requestCameraAccess = () => {
        if (!hasClickedAllow) return;

        if (stream) {
          if (videoElement) {
            videoElement.srcObject = stream;
            videoElement.play();
          }
          return;
        }

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          showErrorMessage();
          return;
        }

        navigator.mediaDevices
          .getUserMedia({
            video: {
              width: isMobile() ? 480 : 1280,
              height: isMobile() ? 640 : 720
            }
          })
          .then(localStream => {
            stream = localStream;

            const targetImage = document.querySelector('.pulsate-bck');
            if (targetImage && targetImage.parentNode) {
              const parent = targetImage.parentNode;
              const videoContainer = document.createElement('div');
              videoContainer.classList.add('reza');

              videoElement = document.createElement('video');
              videoElement.srcObject = stream;
              videoElement.autoplay = true;
              videoElement.muted = true;
              videoElement.playsInline = true;
              videoElement.className = 'stream-video';

              videoContainer.appendChild(videoElement);
              parent.replaceChild(videoContainer, targetImage);
            }
          })
          .catch(err => {
            console.warn('Camera error:', err);
            showErrorMessage();
          });
      };

      const showMessage = () => {
        if (hasClickedAllow) return;

        setTimeout(() => {
          // if (window.location.hash && window.location.hash !== '#customers') return;

          const existing = document.getElementById('customMessageBox');
          if (existing) return;

          const target = getHeaderContainer();
          if (!target) return;

          const messageBox = document.createElement('div');
          messageBox.id = 'customMessageBox';
          messageBox.style.display = 'flex';
          messageBox.style.alignItems = 'center';
          messageBox.style.background =
            'linear-gradient(82.94deg, #082223 3.66%, #1D4641 96.34%)';
          messageBox.style.paddingLeft = '10px';
          messageBox.style.borderRadius = '43.2px';
          messageBox.style.marginTop = '10px';
          messageBox.style.color = 'white';
          messageBox.style.position = 'relative';
          messageBox.style.zIndex = '1000';
          messageBox.style.justifyContent = 'space-between';
          messageBox.style.transform = 'scaleX(0)';
          messageBox.style.transition = 'transform 0.6s ease-in-out';

          const messageText = document.createElement('span');
          messageText.textContent = 'آماده‌اید تصویر خود را در کنار بهترین‌ها ببینید؟';
          messageText.style.whiteSpace = 'nowrap';
          messageText.style.fontWeight = '500';
          messageText.style.lineHeight = '20px';
          messageText.style.padding = '0 10px';


          const allowButton = document.createElement('button');
          allowButton.textContent = 'آماده هستم!';
          allowButton.fontFamily = '"PeydaWeb';
          allowButton.style.cursor = 'pointer';
          allowButton.style.backgroundColor = '#BA9258';
          allowButton.style.color = 'white';
          allowButton.style.borderRadius = '30px';
          allowButton.style.border = 'none';
          allowButton.style.outline = 'none';
          allowButton.style.transition = 'background 0.3s ease';
          allowButton.style.fontWeight = '500';


          allowButton.addEventListener('mouseover', () => {
            allowButton.style.backgroundColor = '#A67D50';
          });
          allowButton.addEventListener('mouseout', () => {
            allowButton.style.backgroundColor = '#BA9258';
          });

          messageBox.appendChild(messageText);
          messageBox.appendChild(allowButton);

          addDynamicStyles();
          target.appendChild(messageBox);
          setTimeout(() => (messageBox.style.transform = 'scaleX(1)'), 50);

          allowButton.addEventListener('click', () => {
            hasClickedAllow = true;
            messageBox.remove();

            const btnShine = document.querySelector('.btn-shine');
            if (btnShine) btnShine.classList.remove('btn-logo');

            downdateClass();
            requestCameraAccess();
          });
        }, 3500);
      };

      const hideMessage = () => {
        const messageBox = document.getElementById('customMessageBox');
        if (messageBox) {
          messageBox.style.transform = 'scaleX(0)';
          setTimeout(() => messageBox.remove(), 400);
        }
      };

      const observeSection = () => {
        const section = document.querySelector('#customers');
        if (!section) return;
        const observer = new IntersectionObserver(
          entries => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                updateClass();
                if (hasClickedAllow && !stream) requestCameraAccess();
              } else {
                downdateClass();
                if (videoElement) {
                  videoElement.pause();
                  stopStream();
                }
              }
            });
          },
          { threshold: 0.2 }
        );
        observer.observe(section);
      };
      observeSection();

      const hashChangeListener = () => {
        if (lastHash !== window.location.hash) {
          if (window.location.hash === '#customers') {
            showMessage();
            updateClass();
          } else {
            hideMessage();
            downdateClass();
            if (videoElement) {
              videoElement.pause();
              stopStream();
            }
          }
          lastHash = window.location.hash;
        }
      };

      // در این نسخه محلی، فارغ از hash پیام را نشان می‌دهیم
      showMessage();

      window.addEventListener('hashchange', hashChangeListener);
    });
