/* ===== CHOLESTEROL WEBSITE - JAVASCRIPT ===== */

document.addEventListener('DOMContentLoaded', () => {

  // ===== NAVBAR SCROLL =====
  const navbar = document.querySelector('.navbar');
  const backToTop = document.querySelector('.back-to-top');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    navbar.classList.toggle('scrolled', scrollY > 60);
    backToTop.classList.toggle('visible', scrollY > 500);

    // Active link highlight
    document.querySelectorAll('section[id]').forEach(section => {
      const top = section.offsetTop - 120;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (link) {
        link.classList.toggle('active', scrollY >= top && scrollY < top + height);
      }
    });
  });

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ===== MOBILE MENU =====
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
  });
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('open');
    });
  });

  // ===== SCROLL REVEAL =====
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ===== ANIMATED COUNTERS =====
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 2000;
    const start = performance.now();
    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      el.textContent = prefix + Math.round(eased * target).toLocaleString('en-IN') + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // ===== BMI CALCULATOR =====
  let bmiGender = 'male';
  document.querySelectorAll('.bmi-gender-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.bmi-gender-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      bmiGender = btn.dataset.gender;
    });
  });

  document.getElementById('bmi-calc-form').addEventListener('submit', (e) => {
    e.preventDefault();
    calculateBMI();
  });

  function calculateBMI() {
    const height = parseFloat(document.getElementById('bmi-height').value);
    const weight = parseFloat(document.getElementById('bmi-weight').value);
    const age = parseFloat(document.getElementById('bmi-age').value);

    if (!height || !weight || !age) {
      showCalcError('bmi-calc-form', 'Please fill in all fields.');
      return;
    }

    const heightM = height / 100;
    const bmi = Math.round((weight / (heightM * heightM)) * 10) / 10;

    // Asian BMI categories
    let category;
    if (bmi < 18.5) category = { label: 'Underweight', color: '#3b82f6', bg: 'rgba(59,130,246,0.2)', risk: 'low' };
    else if (bmi < 23) category = { label: 'Normal', color: '#22c55e', bg: 'rgba(34,197,94,0.2)', risk: 'low' };
    else if (bmi < 25) category = { label: 'Overweight', color: '#eab308', bg: 'rgba(234,179,8,0.2)', risk: 'moderate' };
    else if (bmi < 30) category = { label: 'Obese Class I', color: '#f97316', bg: 'rgba(249,115,22,0.2)', risk: 'high' };
    else category = { label: 'Obese Class II+', color: '#ef4444', bg: 'rgba(239,68,68,0.2)', risk: 'very high' };

    // Ideal weight (Asian BMI 18.5–22.9)
    const idealLow = Math.round(18.5 * heightM * heightM);
    const idealHigh = Math.round(22.9 * heightM * heightM);
    const weightDiff = weight - idealHigh;

    // Display
    const results = document.getElementById('bmi-results');
    results.classList.add('show');
    results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Gauge
    const gaugeFill = document.querySelector('.bmi-gauge-fill');
    const gaugeValue = document.querySelector('.bmi-gauge-value');
    const circumference = Math.PI * 82;
    const percent = Math.min(bmi / 40, 1);
    gaugeFill.style.strokeDasharray = circumference;
    gaugeFill.style.strokeDashoffset = circumference * (1 - percent);
    gaugeFill.style.stroke = category.color;
    gaugeValue.textContent = bmi;
    gaugeValue.style.color = category.color;

    // Values
    document.getElementById('bmi-calc-value').textContent = bmi;
    document.getElementById('bmi-calc-value').style.color = category.color;
    document.getElementById('bmi-calc-category').textContent = category.label;
    document.getElementById('bmi-calc-category').style.background = category.bg;
    document.getElementById('bmi-calc-category').style.color = category.color;

    document.getElementById('bmi-ideal-weight').textContent = idealLow + '–' + idealHigh + ' kg';

    if (weightDiff > 0) {
      document.getElementById('bmi-weight-status').textContent = 'Lose ' + Math.round(weightDiff) + ' kg to reach normal';
      document.getElementById('bmi-weight-status').style.background = 'rgba(249,115,22,0.2)';
      document.getElementById('bmi-weight-status').style.color = '#f97316';
    } else {
      document.getElementById('bmi-weight-status').textContent = 'Within healthy range';
      document.getElementById('bmi-weight-status').style.background = 'rgba(34,197,94,0.2)';
      document.getElementById('bmi-weight-status').style.color = '#22c55e';
    }

    // Interpretation
    let interp = '';
    if (category.risk === 'low' && bmi >= 18.5) {
      interp = `Your BMI of <strong>${bmi}</strong> is within the healthy range for Asian populations. Keep maintaining your current weight through balanced diet and regular exercise.`;
    } else if (category.risk === 'low') {
      interp = `Your BMI of <strong>${bmi}</strong> indicates you're underweight. Focus on nutrient-dense foods and strength training to build healthy mass.`;
    } else if (category.risk === 'moderate') {
      interp = `Your BMI of <strong>${bmi}</strong> puts you in the overweight category (Asian standards). This means <strong>increased risk for high cholesterol</strong>. Losing just ${Math.round(weightDiff)} kg can significantly improve your lipid profile. Focus on portion control and 150 min/week of exercise.`;
    } else if (category.risk === 'high') {
      interp = `Your BMI of <strong>${bmi}</strong> falls in the obese range for Indians. This carries <strong>high risk for dyslipidemia, diabetes, and heart disease</strong>. Target losing 0.5 kg/week through diet changes and daily exercise. Losing ${Math.round(weightDiff)} kg to reach ${idealHigh} kg would dramatically improve your heart health.`;
    } else {
      interp = `Your BMI of <strong>${bmi}</strong> indicates significant obesity with <strong>very high cardiovascular risk</strong>. Please consult a doctor alongside making lifestyle changes. Target losing 0.5–1 kg/week. Even a 5% weight loss (${Math.round(weight * 0.05)} kg) will meaningfully improve cholesterol and triglycerides.`;
    }

    if (age >= 40) {
      interp += ` <br><br><strong>Age Factor:</strong> After 40, metabolism slows and cholesterol tends to rise naturally. Regular lipid panel testing (every 6 months) is essential.`;
    }

    document.getElementById('bmi-interpretation-text').innerHTML = interp;
  }

  // ===== BODY FAT CALCULATOR =====
  let bfGender = 'male';
  document.querySelectorAll('.bf-gender-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.bf-gender-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      bfGender = btn.dataset.gender;
      const hipGroup = document.getElementById('hip-group');
      if (hipGroup) hipGroup.style.display = bfGender === 'female' ? 'flex' : 'none';
    });
  });

  document.getElementById('bf-calc-form').addEventListener('submit', (e) => {
    e.preventDefault();
    calculateBodyFat();
  });

  function calculateBodyFat() {
    const age = parseFloat(document.getElementById('calc-age').value);
    const heightCm = parseFloat(document.getElementById('calc-height').value);
    const weightKg = parseFloat(document.getElementById('calc-weight').value);
    const waistCm = parseFloat(document.getElementById('calc-waist').value);
    const neckCm = parseFloat(document.getElementById('calc-neck').value);
    const hipCm = parseFloat(document.getElementById('calc-hip').value) || 0;

    if (!age || !heightCm || !weightKg || !waistCm || !neckCm) {
      showCalcError('bf-calc-form', 'Please fill in all required fields.');
      return;
    }
    if (bfGender === 'female' && !hipCm) {
      showCalcError('bf-calc-form', 'Hip measurement is required for females.');
      return;
    }
    if (waistCm <= neckCm) {
      showCalcError('bf-calc-form', 'Waist must be greater than neck measurement.');
      return;
    }

    // U.S. Navy Method (metric)
    let bodyFat;
    if (bfGender === 'male') {
      bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) - 450;
    } else {
      if (waistCm + hipCm - neckCm <= 0) {
        showCalcError('bf-calc-form', 'Please check your measurements.');
        return;
      }
      bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.22100 * Math.log10(heightCm)) - 450;
    }

    bodyFat = Math.max(2, Math.min(Math.round(bodyFat * 10) / 10, 60));

    const heightM = heightCm / 100;
    const bmi = Math.round((weightKg / (heightM * heightM)) * 10) / 10;

    const category = getBFCategory(bodyFat, bfGender);
    const bmiCategory = getAsianBMICategory(bmi);

    displayBFResults(bodyFat, bmi, category, bmiCategory, age);
  }

  function getBFCategory(bf, gender) {
    if (gender === 'male') {
      if (bf < 6) return { label: 'Essential Fat', color: '#3b82f6', bg: 'rgba(59,130,246,0.2)' };
      if (bf < 14) return { label: 'Athletic', color: '#22c55e', bg: 'rgba(34,197,94,0.2)' };
      if (bf < 18) return { label: 'Fitness', color: '#22c55e', bg: 'rgba(34,197,94,0.2)' };
      if (bf < 25) return { label: 'Average', color: '#eab308', bg: 'rgba(234,179,8,0.2)' };
      return { label: 'Above Average', color: '#ef4444', bg: 'rgba(239,68,68,0.2)' };
    } else {
      if (bf < 14) return { label: 'Essential Fat', color: '#3b82f6', bg: 'rgba(59,130,246,0.2)' };
      if (bf < 21) return { label: 'Athletic', color: '#22c55e', bg: 'rgba(34,197,94,0.2)' };
      if (bf < 25) return { label: 'Fitness', color: '#22c55e', bg: 'rgba(34,197,94,0.2)' };
      if (bf < 32) return { label: 'Average', color: '#eab308', bg: 'rgba(234,179,8,0.2)' };
      return { label: 'Above Average', color: '#ef4444', bg: 'rgba(239,68,68,0.2)' };
    }
  }

  function getAsianBMICategory(bmi) {
    if (bmi < 18.5) return { label: 'Underweight', color: '#3b82f6', bg: 'rgba(59,130,246,0.2)' };
    if (bmi < 23) return { label: 'Normal (Asian)', color: '#22c55e', bg: 'rgba(34,197,94,0.2)' };
    if (bmi < 25) return { label: 'Overweight (Asian)', color: '#eab308', bg: 'rgba(234,179,8,0.2)' };
    if (bmi < 30) return { label: 'Obese Class I', color: '#f97316', bg: 'rgba(249,115,22,0.2)' };
    return { label: 'Obese Class II+', color: '#ef4444', bg: 'rgba(239,68,68,0.2)' };
  }

  function displayBFResults(bf, bmi, category, bmiCategory, age) {
    const results = document.getElementById('calc-results');
    results.classList.add('show');
    results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Gauge
    const gaugeFill = document.querySelector('.bf-gauge-fill');
    const gaugeValue = document.querySelector('.bf-gauge-value');
    const circumference = Math.PI * 82;
    const percent = Math.min(bf / 50, 1);
    gaugeFill.style.strokeDasharray = circumference;
    gaugeFill.style.strokeDashoffset = circumference * (1 - percent);
    gaugeFill.style.stroke = category.color;
    gaugeValue.textContent = bf + '%';
    gaugeValue.style.color = category.color;

    // Body fat result
    document.getElementById('bf-result-value').textContent = bf + '%';
    document.getElementById('bf-result-value').style.color = category.color;
    document.getElementById('bf-result-category').textContent = category.label;
    document.getElementById('bf-result-category').style.background = category.bg;
    document.getElementById('bf-result-category').style.color = category.color;

    // BMI result
    document.getElementById('bmi-result-value').textContent = bmi;
    document.getElementById('bmi-result-value').style.color = bmiCategory.color;
    document.getElementById('bmi-result-category').textContent = bmiCategory.label;
    document.getElementById('bmi-result-category').style.background = bmiCategory.bg;
    document.getElementById('bmi-result-category').style.color = bmiCategory.color;

    // Interpretation
    let tips = [];
    if (category.label === 'Above Average') {
      tips.push(`Body fat of <strong>${bf}%</strong> is above recommended range — higher risk for cholesterol issues.`);
      tips.push('Focus on caloric deficit through portion control + exercise. Target 0.5–1 kg/week loss.');
    } else if (category.label === 'Average') {
      tips.push(`Body fat of <strong>${bf}%</strong> is in the average range. Room for improvement.`);
      tips.push('Regular exercise and mindful eating can bring you to fitness range.');
    } else {
      tips.push(`Excellent! Body fat of <strong>${bf}%</strong> is in a healthy range. Maintain your routine.`);
    }

    if (bmi >= 23) {
      tips.push(`<br><strong>Note:</strong> BMI of ${bmi} (above Asian threshold of 23) indicates increased metabolic risk for South Asians.`);
    }

    document.getElementById('result-interpretation-text').innerHTML = tips.join(' ');
  }

  // ===== ERROR HELPER =====
  function showCalcError(formId, msg) {
    const form = document.getElementById(formId);
    const existing = form.querySelector('.calc-error');
    if (existing) existing.remove();

    const err = document.createElement('div');
    err.className = 'calc-error';
    err.style.cssText = `
      background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3);
      border-radius: 8px; padding: 12px 18px; color: #ef4444;
      font-size: 0.9rem; margin-top: 16px; grid-column: 1 / -1;
      animation: fadeInUp 0.3s ease;
    `;
    err.textContent = msg;
    form.appendChild(err);
    setTimeout(() => err.remove(), 4000);
  }

});
