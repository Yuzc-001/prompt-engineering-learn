/**
 * Animations and interactive elements for Prompt Engineering Learn
 */

document.addEventListener('DOMContentLoaded', () => {
  // Handle scroll animations
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150; // Adjust this value based on when you want the animation to trigger
      
      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add('visible');
      }
    });
  };
  
  // Initial check on page load
  animateOnScroll();
  
  // Add scroll event listener
  window.addEventListener('scroll', animateOnScroll);
  
  // Handle code tabs in code demo
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      tabButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Show corresponding content
      const tabId = button.getAttribute('data-tab');
      document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
      });
      
      document.getElementById(`${tabId}-tab`).style.display = 'block';
    });
  });
  
  // Playground functionality
  const setupPlayground = () => {
    const playground = document.querySelector('.playground-container');
    if (!playground) return;
    
    const techniqueItems = playground.querySelectorAll('.technique-item');
    const templateItems = playground.querySelectorAll('.template-item');
    const promptEditor = playground.querySelector('.prompt-editor');
    const runBtn = playground.querySelector('.run-prompt-btn');
    const clearBtn = playground.querySelector('.clear-btn');
    const outputContent = playground.querySelector('.output-content');
    const loadingIndicator = playground.querySelector('.loading-indicator');
    const tempSlider = playground.querySelector('.playground-temp');
    const tempValue = playground.querySelector('.temp-value');
    
    // Templates for different techniques
    const templates = {
      'zero-shot': {
        summarize: '将以下文本总结为一段简短的摘要：\n\n[输入文本]',
        classify: '将以下文本分类为以下类别之一（积极、消极、中性）：\n\n[输入文本]',
        translate: '将以下文本翻译成[目标语言]：\n\n[输入文本]',
        brainstorm: '为[主题]提供5个创新想法：'
      },
      'few-shot': {
        summarize: '总结以下文本：\n\n示例1：\n原文：人工智能(AI)是计算机科学的一个分支，致力于创造能够执行通常需要人类智能的任务的机器。\n摘要：AI是创造模仿人类智能的计算机系统的领域。\n\n示例2：\n原文：全球变暖是指地球表面温度长期上升的现象，主要由人类活动产生的温室气体排放引起。\n摘要：全球变暖是由人类温室气体排放导致的地球温度上升现象。\n\n请总结以下文本：\n[输入文本]',
        classify: '确定下列评论的情感：\n\n示例1：\n评论：这款产品质量非常好，我很满意。\n情感：积极\n\n示例2：\n评论：送货太慢了，等了一周才收到。\n情感：消极\n\n示例3：\n评论：产品符合描述，没有特别惊喜，也没有失望。\n情感：中性\n\n评论：[输入文本]\n情感：',
        translate: '将文本翻译成目标语言：\n\n示例1：\n英文：Hello, how are you?\n中文：你好，你好吗？\n\n示例2：\n英文：I love learning new languages.\n中文：我喜欢学习新语言。\n\n请翻译：\n[输入文本]\n[目标语言]：',
        brainstorm: '为给定主题生成创意想法：\n\n示例1：\n主题：提高办公室生产力\n想法：\n1. 实施25分钟工作/5分钟休息的番茄工作法\n2. 创建无会议日，专注于深度工作\n3. 使用项目管理工具追踪任务进度\n\n示例2：\n主题：减少塑料使用\n想法：\n1. 使用可重复使用的购物袋\n2. 购买散装食品，减少包装\n3. 使用玻璃或不锈钢容器代替塑料容器\n\n请为以下主题提供创意想法：\n[主题]'
      },
      'cot': {
        summarize: '我需要总结以下文本。我将一步步思考以确保捕捉所有重要信息：\n\n[输入文本]',
        classify: '我将一步步分析以下文本的情感：\n\n[输入文本]',
        translate: '我将通过以下步骤将文本从[源语言]翻译成[目标语言]：\n1. 首先理解原文的含义\n2. 考虑文化和语言差异\n3. 进行准确翻译\n\n原文：[输入文本]',
        brainstorm: '我将使用以下步骤为[主题]生成创新想法：\n1. 分析主题的核心需求和挑战\n2. 考虑不同领域的解决方案\n3. 结合新技术或方法\n4. 评估每个想法的可行性\n\n主题：[主题]'
      },
      'role': {
        summarize: '你是一位专业的内容编辑，擅长提炼文章精华。请总结以下文本的核心内容：\n\n[输入文本]',
        classify: '作为一位资深情感分析专家，请评估以下文本的情感倾向(积极、消极或中性)，并解释你的分析理由：\n\n[输入文本]',
        translate: '你是一位精通[源语言]和[目标语言]的专业翻译，请将以下文本翻译成地道的[目标语言]：\n\n[输入文本]',
        brainstorm: '你是一位创新顾问，以打破常规思维而闻名。请为[主题]提供5个突破性的创意：'
      }
    };
    
    // Sample outputs for demonstration
    const sampleOutputs = {
      'zero-shot': {
        summarize: '这是一个简洁的摘要，提炼了原文的核心要点和主要信息，便于快速理解文本的主要内容。',
        classify: '情感分类：积极\n\n文本中使用了正面词汇和表达方式，整体表达了满意和赞赏的态度。',
        translate: '这是翻译后的文本，保留了原文的含义，同时符合目标语言的表达习惯和语法结构。',
        brainstorm: '关于[主题]的创新想法：\n1. [第一个创意想法的详细描述]\n2. [第二个创意想法的详细描述]\n3. [第三个创意想法的详细描述]\n4. [第四个创意想法的详细描述]\n5. [第五个创意想法的详细描述]'
      },
      'few-shot': {
        summarize: '这是基于示例学习的摘要，风格与示例一致，同样简洁有力地提炼了原文的核心要点。',
        classify: '情感：积极\n\n根据提供的示例模式，我判断这段文本表达了积极的情感。',
        translate: '[目标语言]：这是参照示例翻译的结果，保持了与示例相同的风格和准确性。',
        brainstorm: '创意想法：\n1. [基于示例格式的第一个想法]\n2. [基于示例格式的第二个想法]\n3. [基于示例格式的第三个想法]\n4. [基于示例格式的第四个想法]\n5. [基于示例格式的第五个想法]'
      },
      'cot': {
        summarize: '我的思考过程：\n1. 首先，我分析了文本的主要主题\n2. 然后，我确定了关键信息点\n3. 接着，我去除了次要细节\n4. 最后，我组织这些要点成为一个连贯的摘要\n\n摘要：[思维链推导的最终摘要]',
        classify: '分析步骤：\n1. 识别文本中的情感词汇：[列出情感词]\n2. 评估整体语气：[语气分析]\n3. 考虑上下文：[上下文因素]\n4. 权衡正面和负面因素：[权衡分析]\n\n结论：基于以上分析，这段文本的情感是[情感分类]。',
        translate: '翻译思考过程：\n1. 原文含义：[对原文的理解]\n2. 文化差异考虑：[文化调整]\n3. 语言表达转换：[表达方式分析]\n\n最终翻译：[思维链推导的翻译结果]',
        brainstorm: '创意思考过程：\n1. 主题分析：[对主题的理解]\n2. 跨领域联想：[不同领域的灵感]\n3. 技术可行性评估：[技术分析]\n\n创意成果：\n1. [第一个经过思考推导的创意]\n2. [第二个经过思考推导的创意]\n3. [第三个经过思考推导的创意]'
      },
      'role': {
        summarize: '作为专业内容编辑，我认为这段文本的核心要点是：[角色视角的专业摘要]',
        classify: '从情感分析专家的角度，我观察到这段文本中的情感标记包括：[专业角度的情感分析]。综合考虑，这是一段[情感分类]情感的文本。',
        translate: '作为专业翻译，我确保这个译文不仅准确传达原意，还符合[目标语言]的表达习惯：[专业翻译结果]',
        brainstorm: '作为创新顾问，我为[主题]提供的突破性想法：\n1. [专业角色视角的第一个创意]\n2. [专业角色视角的第二个创意]\n3. [专业角色视角的第三个创意]\n4. [专业角色视角的第四个创意]\n5. [专业角色视角的第五个创意]'
      }
    };
    
    // Update prompt based on selected technique and template
    let currentTechnique = 'zero-shot';
    
    techniqueItems.forEach(item => {
      item.addEventListener('click', () => {
        // Update active state
        techniqueItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        // Update current technique
        currentTechnique = item.getAttribute('data-technique');
      });
    });
    
    templateItems.forEach(item => {
      item.addEventListener('click', () => {
        const templateType = item.getAttribute('data-template');
        promptEditor.value = templates[currentTechnique][templateType];
      });
    });
    
    // Temperature slider
    tempSlider?.addEventListener('input', () => {
      tempValue.textContent = tempSlider.value;
    });
    
    // Clear button
    clearBtn?.addEventListener('click', () => {
      promptEditor.value = '';
      outputContent.innerHTML = '';
    });
    
    // Run button
    runBtn?.addEventListener('click', () => {
      if (!promptEditor.value.trim()) return;
      
      // Show loading state
      outputContent.innerHTML = '';
      loadingIndicator.style.display = 'block';
      
      // Get template type based on prompt content
      let templateType = 'summarize'; // Default
      for (const type in templates[currentTechnique]) {
        if (promptEditor.value.includes(templates[currentTechnique][type].substring(0, 20))) {
          templateType = type;
          break;
        }
      }
      
      // Simulate processing delay
      setTimeout(() => {
        loadingIndicator.style.display = 'none';
        
        // Get sample output
        const output = sampleOutputs[currentTechnique][templateType];
        
        // Animate typing effect
        let i = 0;
        const typeOutput = () => {
          if (i < output.length) {
            outputContent.innerHTML += output.charAt(i);
            outputContent.scrollTop = outputContent.scrollHeight;
            i++;
            setTimeout(typeOutput, Math.random() * 10 + 10);
          }
        };
        
        typeOutput();
      }, 1500);
    });
  };
  
  setupPlayground();
  
  // ReAct animation
  const setupReactAnimation = () => {
    const reactCycle = document.querySelector('.react-cycle');
    if (!reactCycle) return;
    
    const steps = ['react-think', 'react-act', 'react-observe'];
    let currentStep = 0;
    
    const animateStep = () => {
      // Reset all steps
      steps.forEach(step => {
        document.getElementById(step).classList.remove('active');
      });
      
      // Activate current step
      document.getElementById(steps[currentStep]).classList.add('active');
      
      // Move to next step
      currentStep = (currentStep + 1) % steps.length;
      
      // Continue animation
      setTimeout(animateStep, 1500);
    };
    
    // Start animation
    animateStep();
  };
  
  setupReactAnimation();
  
  // Temperature visualization
  const updateTempVisualization = () => {
    const tempSlider = document.getElementById('temp-slider');
    const tempMarker = document.querySelector('.temp-marker');
    
    if (!tempSlider || !tempMarker) return;
    
    tempSlider.addEventListener('input', () => {
      const value = tempSlider.value;
      tempMarker.style.left = `${value * 100}%`;
      tempMarker.textContent = value;
      
      // Update distribution visualization
      const bars = document.querySelectorAll('.distribution-bar');
      
      bars.forEach(bar => {
        bar.classList.remove('highlight');
      });
      
      if (value < 0.3) {
        // Highlight mostly the tallest bar (more deterministic)
        bars[3].classList.add('highlight');
      } else if (value < 0.7) {
        // Highlight a couple of tall bars
        bars[2].classList.add('highlight');
        bars[3].classList.add('highlight');
      } else {
        // Highlight multiple bars (more random)
        bars[1].classList.add('highlight');
        bars[2].classList.add('highlight');
        bars[4].classList.add('highlight');
      }
    });
  };
  
  updateTempVisualization();
  
  // Tooltips
  const setupTooltips = () => {
    const tooltips = document.querySelectorAll('.tooltip-icon');
    
    tooltips.forEach(tooltip => {
      tooltip.addEventListener('mouseenter', () => {
        const tooltipText = tooltip.nextElementSibling;
        tooltipText.style.visibility = 'visible';
        tooltipText.style.opacity = '1';
      });
      
      tooltip.addEventListener('mouseleave', () => {
        const tooltipText = tooltip.nextElementSibling;
        tooltipText.style.visibility = 'hidden';
        tooltipText.style.opacity = '0';
      });
    });
  };
  
  setupTooltips();
});
