document.addEventListener('DOMContentLoaded', () => {
  // Handle sliders for LLM configuration
  const tempSlider = document.getElementById('temp-slider');
  const tempValue = document.getElementById('temp-value');
  const topkSlider = document.getElementById('topk-slider');
  const topkValue = document.getElementById('topk-value');
  const toppSlider = document.getElementById('topp-slider');
  const toppValue = document.getElementById('topp-value');

  // Update displayed values when sliders change
  tempSlider?.addEventListener('input', () => {
    tempValue.textContent = tempSlider.value;
  });

  topkSlider?.addEventListener('input', () => {
    topkValue.textContent = topkSlider.value;
  });

  toppSlider?.addEventListener('input', () => {
    toppValue.textContent = toppSlider.value;
  });

  // Interactive demo buttons
  const cotDemoBtn = document.getElementById('cot-demo-btn');
  const cotDemoResult = document.getElementById('cot-demo-result');

  cotDemoBtn?.addEventListener('click', () => {
    cotDemoResult.style.display = cotDemoResult.style.display === 'block' ? 'none' : 'block';
    cotDemoBtn.textContent = cotDemoResult.style.display === 'block' ? '隐藏思维链示例' : '查看思维链示例';
  });

  // Smooth scrolling for navigation links
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 70,
          behavior: 'smooth'
        });
      }
    });
  });
});
