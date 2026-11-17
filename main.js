// =============================================
// LifeFlow — Blood Donation Management System
// main.js (Optimized + Smooth Cursor + MySQL)
// =============================================

// =============================================
// 1. UI & ANIMATION LOGIC
// =============================================

// =============================================
// Custom Cursor (Optimized — Smooth & No Lag)
// =============================================
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');

let mouseX = 0;
let mouseY = 0;
let ringX = 0;
let ringY = 0;

if (cursor && ring) {

  // Mouse movement
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // GPU accelerated
    cursor.style.transform =
      `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  });

  // Smooth ring animation
  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;

    ring.style.transform =
      `translate3d(${ringX}px, ${ringY}px, 0)`;

    requestAnimationFrame(animateRing);
  }

  animateRing();

  // Hover effects
  document.querySelectorAll(
    'a, button, .blood-card, .feature-card'
  ).forEach(el => {

    el.addEventListener('mouseenter', () => {
      cursor.style.width = '20px';
      cursor.style.height = '20px';

      ring.style.width = '50px';
      ring.style.height = '50px';

      ring.style.borderColor =
        'rgba(217,43,43,0.8)';
    });

    el.addEventListener('mouseleave', () => {
      cursor.style.width = '12px';
      cursor.style.height = '12px';

      ring.style.width = '36px';
      ring.style.height = '36px';

      ring.style.borderColor =
        'rgba(217,43,43,0.5)';
    });
  });
}

// =============================================
// Scroll Reveal
// =============================================
const reveals = document.querySelectorAll('.reveal');

if (reveals.length > 0) {

  const revealObserver =
    new IntersectionObserver((entries) => {

      entries.forEach((entry, i) => {

        if (entry.isIntersecting) {

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, i * 80);

          revealObserver.unobserve(entry.target);
        }
      });

    }, { threshold: 0.1 });

  reveals.forEach(el =>
    revealObserver.observe(el)
  );
}

// =============================================
// Animate Blood Bars
// =============================================
const bars =
  document.querySelectorAll(
    '.blood-card-bar-fill'
  );

if (bars.length > 0) {

  const targets = [];

  bars.forEach(bar => {
    targets.push(bar.style.width || '0%');
    bar.style.width = '0%';
    bar.style.transition = 'none';
  });

  const barObserver =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            const idx =
              Array.from(bars)
                .indexOf(entry.target);

            requestAnimationFrame(() => {
              requestAnimationFrame(() => {

                entry.target.style.transition =
                  'width 1s ease';

                entry.target.style.width =
                  targets[idx];
              });
            });

            barObserver.unobserve(
              entry.target
            );
          }
        });
      },
      { threshold: 0.3 }
    );

  bars.forEach(bar =>
    barObserver.observe(bar)
  );
}

// =============================================
// Active Nav Highlight on Scroll
// =============================================
const sections =
  document.querySelectorAll(
    'section[id]'
  );

if (sections.length > 0) {

  window.addEventListener(
    'scroll',
    () => {

      let current = '';

      sections.forEach(section => {

        if (
          window.scrollY >=
          section.offsetTop - 120
        ) {
          current = section.id;
        }
      });

      document
        .querySelectorAll('.nav-links a')
        .forEach(link => {

          link.style.color =
            link.getAttribute('href') ===
            '#' + current
              ? 'var(--cream)'
              : '';
        });
    },
    { passive: true }
  );
}

// =============================================
// 2. DATABASE BACKEND LOGIC (MySQL Connected)
// =============================================
if (document.getElementById('donorTableBody')) {

  let activeFilter = 'all';
  let liveDonors = [];

  // =============================================
  // FETCH DONORS FROM DATABASE
  // =============================================
  async function fetchDonorsFromDB() {

    try {

      const response = await fetch(
        'http://localhost:5000/api/donors'
      );

      liveDonors =
        await response.json();

      renderDonors();

    } catch (error) {

      console.error(
        "❌ Error fetching data:",
        error
      );

      document.getElementById(
        'donorTableBody'
      ).innerHTML = `
        <tr>
          <td colspan="9"
              class="empty-msg"
              style="color:red;">
              ERROR CONNECTING TO DATABASE SERVER.
              IS NODE RUNNING?
          </td>
        </tr>`;
    }
  }

  // =============================================
  // RENDER DONORS TABLE
  // =============================================
  function renderDonors() {

    const query =
      document.getElementById(
        'searchInput'
      ).value
      .toLowerCase()
      .trim();

    const tbody =
      document.getElementById(
        'donorTableBody'
      );

    const countEl =
      document.getElementById(
        'donorCount'
      );

    let list =
      liveDonors.filter(d => {

        const matchSearch =
          d.name.toLowerCase()
            .includes(query) ||

          d.blood.toLowerCase()
            .includes(query) ||

          d.city.toLowerCase()
            .includes(query);

        const matchFilter =
          activeFilter === 'all'
            ? true
            : activeFilter ===
              'eligible'
            ? d.status ===
              'eligible'
            : activeFilter ===
              'cooldown'
            ? d.status ===
              'cooldown'
            : d.blood ===
              activeFilter;

        return (
          matchSearch &&
          matchFilter
        );
      });

    countEl.textContent =
      `${list.length} DONOR${
        list.length !== 1
          ? 'S'
          : ''
      } FOUND`;

    if (list.length === 0) {

      tbody.innerHTML = `
      <tr>
        <td colspan="9"
            class="empty-msg">
            NO DONORS MATCH YOUR SEARCH
        </td>
      </tr>`;

      return;
    }

    tbody.innerHTML =
      list.map((d, i) => `
      <tr>
        <td class="td-mono">
          ${String(i + 1)
            .padStart(2, '0')}
        </td>

        <td>${d.name}</td>

        <td class="td-blood">
          ${d.blood}
        </td>

        <td class="td-mono">
          ${d.age}
        </td>

        <td>${d.city}</td>

        <td class="td-mono">
          ${d.phone}
        </td>

        <td>
          <span class="badge badge-${d.status}">
            ${d.status.toUpperCase()}
          </span>
        </td>

        <td class="td-mono">
          ${
            d.lastDonation
              ? d.lastDonation.substring(0, 10)
              : '—'
          }
        </td>

        <td>
          <button class="btn-del"
            onclick="deleteDonor(${d.id})">
            ✕
          </button>
        </td>
      </tr>
    `).join('');
  }

  function setFilter(val, el) {
    activeFilter = val;

    document
      .querySelectorAll('.filter-tab')
      .forEach(tab =>
        tab.classList.remove('active')
      );

    el.classList.add('active');

    renderDonors();
  }

  function toggleForm() {
    document
      .getElementById('addForm')
      .classList.toggle('open');
  }

  async function addDonor() {

    const name =
      document.getElementById(
        'f_name'
      ).value.trim();

    const blood =
      document.getElementById(
        'f_blood'
      ).value;

    const age =
      parseInt(
        document.getElementById(
          'f_age'
        ).value
      );

    const phone =
      document.getElementById(
        'f_phone'
      ).value.trim();

    const city =
      document.getElementById(
        'f_city'
      ).value.trim();

    if (
      !name ||
      !age ||
      !phone ||
      !city
    ) {
      alert(
        'Sabhi fields fill karo!'
      );
      return;
    }

    try {

      await fetch(
        'http://localhost:5000/api/donors',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json'
          },
          body: JSON.stringify({
            name,
            blood,
            age,
            phone,
            city,
            status:
              'eligible'
          })
        }
      );

      [
        'f_name',
        'f_age',
        'f_phone',
        'f_city'
      ].forEach(id => {
        document.getElementById(
          id
        ).value = '';
      });

      toggleForm();
      fetchDonorsFromDB();

    } catch (error) {

      console.error(
        "❌ Error adding donor:",
        error
      );

      alert(
        "Failed to add donor."
      );
    }
  }

  async function deleteDonor(id) {

    if (
      !confirm(
        'Is donor ko remove karna chahte ho?'
      )
    ) return;

    try {

      await fetch(
        `http://localhost:5000/api/donors/${id}`,
        {
          method: 'DELETE'
        }
      );

      fetchDonorsFromDB();

    } catch (error) {

      console.error(
        "❌ Error deleting donor:",
        error
      );
    }
  }

  document
    .getElementById(
      'searchInput'
    )
    .addEventListener(
      'input',
      renderDonors
    );

  window.setFilter =
    setFilter;

  window.toggleForm =
    toggleForm;

  window.addDonor =
    addDonor;

  window.deleteDonor =
    deleteDonor;

  fetchDonorsFromDB();
}