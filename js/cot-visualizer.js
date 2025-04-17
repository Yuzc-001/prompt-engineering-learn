/**
 * 思维链(Chain of Thought)可视化演示
 * 这个脚本创建一个交互式思维链过程可视化组件，展示如何一步步推理解决问题
 */

class CoTVisualizer {
  constructor(container) {
    this.container = document.querySelector(container);
    if (!this.container) return;
    
    // 示例数据
    this.examples = [
      {
        id: 'math',
        title: '数学问题',
        problem: '如果一辆汽车以每小时60公里的速度行驶，需要多长时间才能行驶210公里？',
        steps: [
          {
            id: 'step1',
            content: '我需要计算行驶210公里所需的时间。',
            explanation: '首先理解问题：我们知道速度和距离，需要求时间。'
          },
          {
            id: 'step2',
            content: '使用公式：时间 = 距离 ÷ 速度',
            explanation: '时间、距离和速度之间的关系由这个基本公式表示。'
          },
          {
            id: 'step3',
            content: '代入数值：时间 = 210公里 ÷ 60公里/小时',
            explanation: '将已知的距离(210公里)和速度(60公里/小时)代入公式。'
          },
          {
            id: 'step4',
            content: '计算结果：时间 = 3.5小时',
            explanation: '进行除法运算：210 ÷ 60 = 3.5'
          },
          {
            id: 'step5',
            content: '将小时转换为小时和分钟：3.5小时 = 3小时30分钟',
            explanation: '0.5小时等于30分钟，所以3.5小时可以表示为3小时30分钟。'
          },
          {
            id: 'conclusion',
            content: '因此，以每小时60公里的速度行驶210公里需要3小时30分钟。',
            explanation: '总结最终答案，清晰地回答原问题。'
          }
        ]
      },
      {
        id: 'logic',
        title: '逻辑推理',
        problem: '有三个盒子，分别标有"苹果"、"橙子"和"苹果和橙子"。已知所有标签都是错误的。如果你只能打开一个盒子查看里面的水果，你应该打开哪个盒子才能确定所有盒子的内容？',
        steps: [
          {
            id: 'step1',
            content: '首先，我们知道所有标签都是错误的。',
            explanation: '理解关键条件：每个盒子上的标签都不正确地描述了其内容。'
          },
          {
            id: 'step2',
            content: '考虑标有"苹果和橙子"的盒子。由于标签错误，这个盒子实际上只能包含纯苹果或纯橙子。',
            explanation: '应用逻辑：如果标签是错的，那么这个盒子不可能同时包含两种水果。'
          },
          {
            id: 'step3',
            content: '如果我选择打开标有"苹果和橙子"的盒子，我会看到里面是纯苹果或纯橙子。',
            explanation: '确定要检查的盒子，这将给我们提供最多的信息。'
          },
          {
            id: 'step4',
            content: '假设我打开后发现是纯苹果。那么，标有"苹果"的盒子不能装苹果(因为标签错误)，所以它一定装的是橙子或者两种水果的混合。',
            explanation: '根据第一个发现推断其他盒子的可能内容。'
          },
          {
            id: 'step5',
            content: '同时，标有"橙子"的盒子不能装纯橙子，所以一定装的是苹果或两种水果的混合。',
            explanation: '继续逻辑推导过程。'
          },
          {
            id: 'step6',
            content: '但我们已经找到了纯苹果，且只有一个盒子可以包含两种水果。因此，标有"橙子"的盒子必须装苹果和橙子的混合，而标有"苹果"的盒子必须装纯橙子。',
            explanation: '排除法和逻辑约束让我们得出唯一可能的安排。'
          },
          {
            id: 'step7',
            content: '同样的逻辑适用于如果我打开"苹果和橙子"盒子发现的是纯橙子的情况。',
            explanation: '验证我们的解决方案适用于另一种可能的观察结果。'
          },
          {
            id: 'conclusion',
            content: '因此，打开标有"苹果和橙子"的盒子是最佳选择，因为不管里面是什么(纯苹果或纯橙子)，我们都能确定所有盒子的内容。',
            explanation: '总结最终答案，确认我们的推理是完整的。'
          }
        ]
      },
      {
        id: 'ethics',
        title: '伦理决策',
        problem: '一家公司发现其新开发的AI系统在某些情况下表现出偏见。该公司应该立即公开这个问题并暂停系统，还是先悄悄修复问题后再发布？',
        steps: [
          {
            id: 'step1',
            content: '让我分析这个伦理决策的关键因素。',
            explanation: '首先明确这是一个涉及多个利益相关者和价值观的复杂伦理问题。'
          },
          {
            id: 'step2',
            content: '选项1：立即公开问题并暂停系统',
            explanation: '先考虑第一个选择及其影响。'
          },
          {
            id: 'step3',
            content: '这种做法的优点是透明诚实，尊重用户知情权，防止偏见系统造成即时伤害，展示公司对伦理的重视。',
            explanation: '评估第一个选择的积极方面。'
          },
          {
            id: 'step4',
            content: '缺点是可能损害公司声誉，引起不必要的恐慌，造成经济损失，竞争对手可能趁机获利。',
            explanation: '评估第一个选择的消极方面。'
          },
          {
            id: 'step5',
            content: '选项2：先悄悄修复问题后再发布',
            explanation: '考虑第二个选择及其影响。'
          },
          {
            id: 'step6',
            content: '这种做法的优点是避免不必要的负面反应，公司有时间彻底解决问题，防止不完整信息引起的误解。',
            explanation: '评估第二个选择的积极方面。'
          },
          {
            id: 'step7',
            content: '缺点是缺乏透明度，如果被发现可能导致更严重的信任危机，系统在修复前可能继续造成伤害，可能违反某些行业规范或法规。',
            explanation: '评估第二个选择的消极方面。'
          },
          {
            id: 'step8',
            content: '考虑几个关键的伦理原则：透明度、诚信、避免伤害、责任感。',
            explanation: '引入伦理框架来评估这个情况。'
          },
          {
            id: 'step9',
            content: '还需考虑：偏见的严重程度和具体影响、修复所需时间、法律要求、行业最佳实践等。',
            explanation: '考虑可能影响决策的具体情境因素。'
          },
          {
            id: 'conclusion',
            content: '基于以上分析，在大多数情况下，更符合伦理的做法是适度的透明：立即暂停或限制系统，同时公开承认存在问题(无需技术细节)，承诺并设定修复时间表。这样既展示了责任感，又减轻了潜在伤害，同时保持了透明度和诚信。',
            explanation: '权衡利弊后得出平衡各方利益的结论。'
          }
        ]
      }
    ];
    
    this.currentExampleIndex = 0;
    this.currentStepIndex = 0;
    
    this.render();
    this.setupEvents();
    
    // 初始化显示第一个示例的第一步
    this.showExample(0);
  }
  
  render() {
    this.container.innerHTML = `
      <div class="cot-visualizer">
        <div class="example-selector">
          <h3>选择示例：</h3>
          <div class="example-tabs">
            ${this.examples.map((example, index) => `
              <button class="example-tab ${index === 0 ? 'active' : ''}" data-index="${index}">
                ${example.title}
              </button>
            `).join('')}
          </div>
        </div>
        
        <div class="problem-container">
          <div class="problem-header">
            <h3>问题：</h3>
            <div class="cot-controls">
              <button class="auto-play-btn">
                <span class="play-icon">▶</span> 自动演示
              </button>
              <button class="reset-btn">重置</button>
            </div>
          </div>
          <div class="problem-content"></div>
        </div>
        
        <div class="thinking-process">
          <div class="thinking-header">
            <h3>思考过程：</h3>
            <div class="step-progress">
              <div class="progress-track">
                <div class="progress-fill"></div>
              </div>
              <div class="step-counter">
                <span class="current-step">1</span> / <span class="total-steps">6</span>
              </div>
            </div>
          </div>
          
          <div class="thinking-steps"></div>
          
          <div class="thinking-controls">
            <button class="prev-btn" disabled>上一步</button>
            <button class="next-btn">下一步</button>
          </div>
        </div>
        
        <div class="explanation-panel">
          <h3>为什么这一步很重要：</h3>
          <div class="explanation-content"></div>
        </div>
        
        <div class="cot-tips">
          <h3>思维链提示技巧：</h3>
          <ul>
            <li><strong>明确要求逐步思考</strong>：在提示中明确指示"一步步思考"、"逐步解决"或"展示你的推理过程"。</li>
            <li><strong>拆分复杂问题</strong>：对于复杂任务，将其分解为更小的、更容易管理的步骤。</li>
            <li><strong>使用自问自答</strong>：让模型提出问题，然后回答这些问题，促进更深入的思考。</li>
            <li><strong>要求验证</strong>：让模型检查其推理和计算，特别是在数学或逻辑问题中。</li>
            <li><strong>使用低温度设置</strong>：对于需要精确推理的任务，使用较低的温度值(如0.1-0.3)。</li>
          </ul>
        </div>
      </div>
    `;
    
    // 缓存元素引用
    this.exampleTabs = this.container.querySelectorAll('.example-tab');
    this.problemContent = this.container.querySelector('.problem-content');
    this.thinkingSteps = this.container.querySelector('.thinking-steps');
    this.currentStepCounter = this.container.querySelector('.current-step');
    this.totalStepsCounter = this.container.querySelector('.total-steps');
    this.progressFill = this.container.querySelector('.progress-fill');
    this.explanationContent = this.container.querySelector('.explanation-content');
    this.prevBtn = this.container.querySelector('.prev-btn');
    this.nextBtn = this.container.querySelector('.next-btn');
    this.autoPlayBtn = this.container.querySelector('.auto-play-btn');
    this.resetBtn = this.container.querySelector('.reset-btn');
  }
  
  setupEvents() {
    // 示例选项卡点击事件
    this.exampleTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const index = parseInt(tab.getAttribute('data-index'));
        this.showExample(index);
      });
    });
    
    // 上一步按钮
    this.prevBtn?.addEventListener('click', () => {
      if (this.currentStepIndex > 0) {
        this.showStep(this.currentStepIndex - 1);
      }
    });
    
    // 下一步按钮
    this.nextBtn?.addEventListener('click', () => {
      const totalSteps = this.examples[this.currentExampleIndex].steps.length;
      if (this.currentStepIndex < totalSteps - 1) {
        this.showStep(this.currentStepIndex + 1);
      }
    });
    
    // 自动播放按钮
    this.autoPlayBtn?.addEventListener('click', () => {
      const isPlaying = this.autoPlayBtn.classList.contains('playing');
      
      if (isPlaying) {
        // 停止自动播放
        this.stopAutoPlay();
      } else {
        // 开始自动播放
        this.startAutoPlay();
      }
    });
    
    // 重置按钮
    this.resetBtn?.addEventListener('click', () => {
      this.stopAutoPlay();
      this.showStep(0);
    });
  }
  
  showExample(index) {
    this.stopAutoPlay();
    this.currentExampleIndex = index;
    this.currentStepIndex = 0;
    
    // 更新选项卡激活状态
    this.exampleTabs.forEach((tab, i) => {
      if (i === index) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
    
    const example = this.examples[index];
    
    // 更新问题内容
    this.problemContent.textContent = example.problem;
    
    // 更新总步骤数
    this.totalStepsCounter.textContent = example.steps.length;
    
    // 清空思考步骤区域
    this.thinkingSteps.innerHTML = '';
    
    // 为每一步创建元素(初始都是隐藏的)
    example.steps.forEach((step, stepIndex) => {
      const stepElement = document.createElement('div');
      stepElement.className = `thinking-step ${stepIndex === 0 ? 'active' : ''}`;
      stepElement.setAttribute('data-step', stepIndex);
      stepElement.innerHTML = `<p>${step.content}</p>`;
      
      // 只显示第一步
      if (stepIndex > 0) {
        stepElement.style.display = 'none';
      }
      
      this.thinkingSteps.appendChild(stepElement);
    });
    
    // 显示第一步
    this.showStep(0);
  }
  
  showStep(index) {
    this.currentStepIndex = index;
    const example = this.examples[this.currentExampleIndex];
    const totalSteps = example.steps.length;
    
    // 更新进度指示器
    this.currentStepCounter.textContent = index + 1;
    this.progressFill.style.width = `${((index + 1) / totalSteps) * 100}%`;
    
    // 更新思考步骤显示
    const stepElements = this.thinkingSteps.querySelectorAll('.thinking-step');
    stepElements.forEach((el, i) => {
      if (i <= index) {
        el.style.display = 'block';
        el.classList.add('visible');
        
        if (i === index) {
          el.classList.add('active');
          // 滚动到当前步骤
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          el.classList.remove('active');
        }
      } else {
        el.classList.remove('visible', 'active');
        el.style.display = 'none';
      }
    });
    
    // 更新解释内容
    this.explanationContent.textContent = example.steps[index].explanation;
    this.explanationContent.classList.add('highlight');
    setTimeout(() => {
      this.explanationContent.classList.remove('highlight');
    }, 300);
    
    // 更新按钮状态
    this.prevBtn.disabled = index === 0;
    this.nextBtn.disabled = index === totalSteps - 1;
  }
  
  startAutoPlay() {
    this.stopAutoPlay(); // 确保不会有多个计时器
    
    this.autoPlayBtn.classList.add('playing');
    this.autoPlayBtn.querySelector('.play-icon').textContent = '‖';
    
    const totalSteps = this.examples[this.currentExampleIndex].steps.length;
    
    this.autoPlayInterval = setInterval(() => {
      if (this.currentStepIndex < totalSteps - 1) {
        this.showStep(this.currentStepIndex + 1);
      } else {
        this.stopAutoPlay();
      }
    }, 3000); // 每3秒显示下一步
  }
  
  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
      
      this.autoPlayBtn.classList.remove('playing');
      this.autoPlayBtn.querySelector('.play-icon').textContent = '▶';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new CoTVisualizer('#cot-visualizer');
});
