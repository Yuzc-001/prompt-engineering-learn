/**
 * Interactive Temperature Visualization Demo
 * 这个脚本创建一个交互式的温度参数可视化演示，帮助用户理解LLM的温度参数如何影响输出
 */

class TemperatureDemo {
  constructor(container) {
    this.container = document.querySelector(container);
    if (!this.container) return;
    
    this.render();
    this.setupEvents();
  }
  
  render() {
    this.container.innerHTML = `
      <div class="temp-demo-container">
        <div class="temp-control-wrapper">
          <div class="temp-value-display">
            <span class="value-label">Temperature: </span>
            <span class="current-value">0.7</span>
          </div>
          <input type="range" min="0" max="1" step="0.1" value="0.7" class="temp-control-slider">
        </div>
        
        <div class="output-examples">
          <div class="example-wrapper">
            <div class="temp-indicator low-temp"><span>0.1</span></div>
            <div class="output-card">
              <h4>低温输出 (更确定性)</h4>
              <p class="low-temp-output">人工智能是计算机科学的一个分支，致力于研发能模拟人类智能的系统。主要研究领域包括机器学习、自然语言处理、计算机视觉和专家系统。</p>
            </div>
          </div>
          
          <div class="example-wrapper">
            <div class="temp-indicator medium-temp"><span>0.5</span></div>
            <div class="output-card">
              <h4>中温输出 (平衡)</h4>
              <p class="medium-temp-output">人工智能是让机器"思考"的科学与工程。它结合了数学、计算机科学和认知科学等领域，创造能够学习、推理和适应的智能系统。从智能助手到自动驾驶汽车，AI正在改变我们与技术互动的方式。</p>
            </div>
          </div>
          
          <div class="example-wrapper">
            <div class="temp-indicator high-temp"><span>0.9</span></div>
            <div class="output-card">
              <h4>高温输出 (更创造性)</h4>
              <p class="high-temp-output">人工智能——人类智慧的数字镜像！它就像是计算机世界中的一位魔法师，不断学习、适应并创造着未知的可能。从帮你选择今晚的电影，到解开宇宙最深奥的秘密，AI正以惊人的速度从科幻小说中走进现实生活。这场智能革命正在重新定义我们是谁，以及我们的未来将如何展开！✨🤖</p>
            </div>
          </div>
        </div>
        
        <div class="visualization-container">
          <h4>温度如何影响词汇选择概率</h4>
          <div class="token-visualization">
            <div class="token-selector">
              <div class="token-label">下一个词的可能性：</div>
              <div class="tokens">
                <div class="token-option selected" data-token="发展">发展</div>
                <div class="token-option" data-token="革命">革命</div>
                <div class="token-option" data-token="魔法">魔法</div>
                <div class="token-option" data-token="科技">科技</div>
                <div class="token-option" data-token="奇迹">奇迹</div>
              </div>
            </div>
            
            <div class="probability-display">
              <div class="probability-bars">
                <!-- 这些数据会通过JS动态更新 -->
                <div class="prob-bar" data-token="发展" style="height: 85%;">
                  <div class="bar-fill"></div>
                  <div class="prob-value">85%</div>
                </div>
                <div class="prob-bar" data-token="革命" style="height: 60%;">
                  <div class="bar-fill"></div>
                  <div class="prob-value">60%</div>
                </div>
                <div class="prob-bar" data-token="魔法" style="height: 35%;">
                  <div class="bar-fill"></div>
                  <div class="prob-value">35%</div>
                </div>
                <div class="prob-bar" data-token="科技" style="height: 45%;">
                  <div class="bar-fill"></div>
                  <div class="prob-value">45%</div>
                </div>
                <div class="prob-bar" data-token="奇迹" style="height: 30%;">
                  <div class="bar-fill"></div>
                  <div class="prob-value">30%</div>
                </div>
              </div>
              <div class="probability-axis">
                <div class="axis-label">100%</div>
                <div class="axis-label">50%</div>
                <div class="axis-label">0%</div>
              </div>
            </div>
          </div>
          
          <div class="explanation">
            <p><strong>什么是温度?</strong> 在LLM中，温度控制模型生成文本时的随机性。</p>
            <ul>
              <li><strong>低温 (0.1-0.3):</strong> 更确定、一致且保守的输出。模型更可能选择概率最高的词。</li>
              <li><strong>中温 (0.4-0.7):</strong> 平衡的创造性和一致性。</li>
              <li><strong>高温 (0.8-1.0):</strong> 更多样、创新但可能不那么连贯的输出。模型更可能选择概率较低的词。</li>
            </ul>
            <p>拖动上方滑块，观察不同温度如何影响词汇选择的概率分布！</p>
          </div>
        </div>
      </div>
    `;
    
    // 缓存元素
    this.temperatureSlider = this.container.querySelector('.temp-control-slider');
    this.currentValueDisplay = this.container.querySelector('.current-value');
    
    // 选择例子输出
    this.lowTempOutput = this.container.querySelector('.low-temp-output');
    this.mediumTempOutput = this.container.querySelector('.medium-temp-output');
    this.highTempOutput = this.container.querySelector('.high-temp-output');
    
    // 选择概率条
    this.probBars = this.container.querySelectorAll('.prob-bar');
    
    // 选择词汇选项
    this.tokenOptions = this.container.querySelectorAll('.token-option');
  }
  
  setupEvents() {
    // 温度滑块变化事件
    this.temperatureSlider?.addEventListener('input', (e) => {
      const tempValue = parseFloat(e.target.value);
      this.currentValueDisplay.textContent = tempValue;
      
      // 更新输出例子的高亮状态
      this.updateExamplesHighlight(tempValue);
      
      // 更新概率分布图
      this.updateProbabilityDistribution(tempValue);
    });
    
    // 词汇选项点击事件
    this.tokenOptions.forEach(option => {
      option.addEventListener('click', () => {
        this.tokenOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
      });
    });
  }
  
  updateExamplesHighlight(temperature) {
    // 移除所有高亮
    const examples = this.container.querySelectorAll('.example-wrapper');
    examples.forEach(example => example.classList.remove('highlighted'));
    
    // 根据温度范围添加高亮
    if (temperature <= 0.3) {
      examples[0].classList.add('highlighted');
    } else if (temperature <= 0.7) {
      examples[1].classList.add('highlighted');
    } else {
      examples[2].classList.add('highlighted');
    }
  }
  
  updateProbabilityDistribution(temperature) {
    // 原始概率
    const baseProbabilities = {
      "发展": 0.85,
      "革命": 0.60,
      "魔法": 0.35,
      "科技": 0.45,
      "奇迹": 0.30
    };
    
    // 根据温度调整概率分布
    const adjustedProbabilities = this.adjustProbabilities(baseProbabilities, temperature);
    
    // 更新条形图
    this.probBars.forEach(bar => {
      const token = bar.getAttribute('data-token');
      const probability = adjustedProbabilities[token];
      const heightPercentage = probability * 100;
      
      bar.style.height = `${heightPercentage}%`;
      bar.querySelector('.prob-value').textContent = `${Math.round(heightPercentage)}%`;
      
      // 动画过渡
      bar.querySelector('.bar-fill').style.height = `${heightPercentage}%`;
    });
  }
  
  adjustProbabilities(baseProbabilities, temperature) {
    if (temperature === 0) {
      // 如果温度为0，返回最大概率为1，其余为0的分布
      const maxToken = Object.entries(baseProbabilities).reduce((max, [token, prob]) => 
        prob > max[1] ? [token, prob] : max, ['', 0])[0];
      
      return Object.fromEntries(
        Object.keys(baseProbabilities).map(token => 
          [token, token === maxToken ? 1 : 0]
        )
      );
    }
    
    // 温度对分布的影响
    // 高温使分布更均匀，低温使分布更尖锐
    const adjusted = {};
    
    // 使用softmax函数来模拟温度的影响
    // 先将概率转换为logits (log概率)
    const logits = Object.entries(baseProbabilities).map(
      ([token, prob]) => [token, Math.log(prob / (1 - prob))]
    );
    
    // 应用温度
    const scaledLogits = logits.map(
      ([token, logit]) => [token, logit / temperature]
    );
    
    // 计算softmax分母
    const maxLogit = Math.max(...scaledLogits.map(([_, l]) => l));
    const expSum = scaledLogits.reduce(
      (sum, [_, logit]) => sum + Math.exp(logit - maxLogit), 0
    );
    
    // 计算最终概率
    scaledLogits.forEach(([token, logit]) => {
      adjusted[token] = Math.exp(logit - maxLogit) / expSum;
    });
    
    return adjusted;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new TemperatureDemo('#temperature-visualization');
});
