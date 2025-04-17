/**
 * Interactive Prompt Demonstration Component
 * 
 * This script creates interactive prompt demonstrations where users can
 * experiment with different prompt techniques and see simulated results.
 */

class PromptDemo {
  constructor(containerSelector, options = {}) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) return;
    
    this.options = {
      title: options.title || '提示词示例',
      description: options.description || '尝试修改提示词，查看可能的输出变化',
      initialPrompt: options.initialPrompt || '',
      responses: options.responses || {},
      temperature: options.temperature !== undefined ? options.temperature : 0.7,
      templateParts: options.templateParts || null
    };
    
    this.currentResponse = null;
    this.render();
    this.attachEvents();
  }
  
  render() {
    // Create HTML structure
    this.container.innerHTML = `
      <div class="prompt-demo">
        <h3>${this.options.title}</h3>
        <p class="demo-description">${this.options.description}</p>
        
        <div class="prompt-editor">
          <div class="editor-header">
            <span>提示词 (Prompt)</span>
            <div class="controls">
              <div class="temperature-control">
                <label>Temperature: <span class="temp-value">${this.options.temperature}</span></label>
                <input type="range" class="temp-slider" min="0" max="1" step="0.1" value="${this.options.temperature}">
              </div>
              <button class="template-btn">使用模板</button>
              <button class="reset-btn">重置</button>
            </div>
          </div>
          <textarea class="prompt-input" placeholder="在这里输入你的提示词...">${this.options.initialPrompt}</textarea>
        </div>

        <div class="prompt-controls">
          <button class="run-btn">运行提示词</button>
        </div>

        <div class="response-area">
          <div class="response-header">
            <span>模拟输出</span>
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div class="response-content"></div>
        </div>
        
        ${this.options.templateParts ? this.renderTemplates() : ''}
      </div>
    `;
    
    // Cache elements
    this.promptInput = this.container.querySelector('.prompt-input');
    this.runButton = this.container.querySelector('.run-btn');
    this.responseContent = this.container.querySelector('.response-content');
    this.typingIndicator = this.container.querySelector('.typing-indicator');
    this.templateButton = this.container.querySelector('.template-btn');
    this.resetButton = this.container.querySelector('.reset-btn');
    this.tempSlider = this.container.querySelector('.temp-slider');
    this.tempValue = this.container.querySelector('.temp-value');
    this.templateContainer = this.container.querySelector('.template-container');
    
    // Hide typing indicator initially
    this.typingIndicator.style.display = 'none';
  }
  
  renderTemplates() {
    if (!this.options.templateParts) return '';
    
    const templates = this.options.templateParts.map((part, index) => {
      return `
        <div class="template-item" data-index="${index}">
          <h4>${part.title}</h4>
          <p>${part.description}</p>
          <pre>${part.template}</pre>
        </div>
      `;
    }).join('');
    
    return `
      <div class="template-container" style="display: none;">
        <h4>提示词模板</h4>
        <p>点击以下模板插入到提示词中：</p>
        <div class="template-list">
          ${templates}
        </div>
        <button class="close-templates">关闭</button>
      </div>
    `;
  }
  
  attachEvents() {
    // Run prompt button
    this.runButton?.addEventListener('click', () => this.runPrompt());
    
    // Template button
    this.templateButton?.addEventListener('click', () => {
      if (this.templateContainer) {
        this.templateContainer.style.display = 'block';
      }
    });
    
    // Close templates button
    const closeButton = this.container.querySelector('.close-templates');
    closeButton?.addEventListener('click', () => {
      if (this.templateContainer) {
        this.templateContainer.style.display = 'none';
      }
    });
    
    // Template item selection
    const templateItems = this.container.querySelectorAll('.template-item');
    templateItems.forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.dataset.index);
        const template = this.options.templateParts[index].template;
        this.promptInput.value += (this.promptInput.value ? '\n\n' : '') + template;
        this.templateContainer.style.display = 'none';
      });
    });
    
    // Reset button
    this.resetButton?.addEventListener('click', () => {
      this.promptInput.value = this.options.initialPrompt;
      this.responseContent.innerHTML = '';
    });
    
    // Temperature slider
    this.tempSlider?.addEventListener('input', () => {
      const value = this.tempSlider.value;
      this.tempValue.textContent = value;
      this.options.temperature = parseFloat(value);
    });
  }
  
  runPrompt() {
    const prompt = this.promptInput.value.trim();
    if (!prompt) return;
    
    // Show typing indicator
    this.responseContent.innerHTML = '';
    this.typingIndicator.style.display = 'flex';
    
    // Disable run button during "processing"
    this.runButton.disabled = true;
    
    // Determine which response to show based on the prompt and temperature
    setTimeout(() => {
      this.typingIndicator.style.display = 'none';
      this.runButton.disabled = false;
      
      // Get response based on prompt content
      const response = this.getAppropriateResponse(prompt);
      this.animateTyping(response);
    }, 1500); // Simulate processing delay
  }
  
  getAppropriateResponse(prompt) {
    // Default response if nothing matches
    let response = "我不确定如何回应这个提示词。请尝试调整你的提示，使其更加清晰或者遵循示例中的模式。";
    
    // Simple keyword matching to determine which response to show
    const promptLower = prompt.toLowerCase();
    
    // Check all response patterns and find matching one
    for (const pattern in this.options.responses) {
      if (promptLower.includes(pattern.toLowerCase())) {
        const responseOptions = this.options.responses[pattern];
        
        // If response has temperature variations, select based on current temperature
        if (Array.isArray(responseOptions)) {
          if (this.options.temperature < 0.3) {
            response = responseOptions[0]; // Low temperature (precise)
          } else if (this.options.temperature < 0.7) {
            response = responseOptions[1]; // Medium temperature
          } else {
            response = responseOptions[2]; // High temperature (creative)
          }
        } else {
          response = responseOptions;
        }
        
        break;
      }
    }
    
    return response;
  }
  
  animateTyping(text) {
    let i = 0;
    this.responseContent.innerHTML = '';
    
    // Create a recursive function to type characters one by one
    const type = () => {
      if (i < text.length) {
        this.responseContent.innerHTML += text.charAt(i);
        i++;
        
        // Adjust scroll to keep up with typing
        this.responseContent.scrollTop = this.responseContent.scrollHeight;
        
        // Random typing speed for realism
        const randomDelay = Math.random() * 10 + 20;
        setTimeout(type, randomDelay);
      }
    };
    
    type();
  }
}

// Initialize the demos when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Zero-shot demo
  new PromptDemo('#zero-shot-demo', {
    title: '零样本提示演示',
    description: '尝试修改提示词，观察输出如何变化。注意提示词的清晰度和具体性如何影响结果。',
    initialPrompt: '将以下文本总结为一段简短的摘要：\n\n人工智能(AI)是计算机科学的一个分支，致力于创造能够执行通常需要人类智能的任务的机器。这包括视觉识别、语音识别、决策制定、语言翻译等。AI研究的核心目标是开发能够思考和学习的机器。深度学习和机器学习是AI的子领域，它们使用算法使机器能够从数据中学习并做出预测。',
    responses: {
      '总结': [
        '人工智能是计算机科学分支，专注于创造能执行需要人类智能任务的机器，包括视觉识别、语音识别、决策制定和语言翻译。AI研究目标是开发具有思考和学习能力的机器，其中深度学习和机器学习是使机器从数据学习和预测的子领域。',
        '人工智能(AI)是计算机科学的一个领域，旨在开发能模仿人类智能的机器。它涵盖了从视觉和语音识别到决策和翻译等多种任务。AI的核心是创造能思考和学习的系统，而深度学习和机器学习作为AI的分支，通过算法帮助机器从数据中学习并做出预测。',
        '人工智能就像是给计算机装上了"大脑"，让它们能做一些通常需要人类聪明才智的事情！从看图识物、听懂语音，到做决定、翻译语言，这些AI都能搞定。研究人员梦想着打造真正会思考和学习的机器。机器学习和深度学习是AI家族中的"学霸"成员，它们擅长从海量数据中自学并预测未来！'
      ],
      '翻译': '请提供要翻译的具体文本和目标语言。',
      '分类': '请提供要分类的文本内容和可能的类别。'
    },
    temperature: 0.3,
    templateParts: [
      {
        title: '文本总结',
        description: '将长文本浓缩为简短摘要',
        template: '将以下文本总结为一段简短的摘要：\n\n[输入文本]'
      },
      {
        title: '情感分析',
        description: '分析文本的情感倾向',
        template: '分析以下文本的情感（积极、消极或中性）：\n\n[输入文本]'
      },
      {
        title: '关键信息提取',
        description: '从文本中提取关键信息',
        template: '从以下文本中提取关键信息和事实：\n\n[输入文本]'
      }
    ]
  });
  
  // Few-shot demo
  new PromptDemo('#few-shot-demo', {
    title: '少样本提示演示',
    description: '添加或修改示例，观察模型如何从示例中学习模式。',
    initialPrompt: '分类以下评论的情感：\n\n示例1：\n评论：这部电影太糟糕了，我浪费了两个小时。\n情感：负面\n\n示例2：\n评论：服务很快，食物也很美味。\n情感：正面\n\n示例3：\n评论：产品质量一般，但价格合理。\n情感：中性\n\n现在分类：\n评论：虽然界面设计很漂亮，但是软件经常崩溃，让人很失望。\n情感：',
    responses: {
      '情感': [
        '负面',
        '负面，因为尽管界面设计被评价为漂亮，但软件频繁崩溃导致用户失望，整体评价偏向负面。',
        '这是一个复杂的评价！一方面，用户欣赏软件的界面美观设计，这是个正面因素；但另一方面，频繁崩溃的功能性问题导致了失望情绪，这明显是负面的。权衡这两方面，负面因素（功能问题）超过了正面因素（美观设计），尤其是"让人很失望"这个强烈的负面情绪表达，所以整体情感倾向是负面的。'
      ],
      '翻译': [
        '法语：Bien que l\'interface soit joliment conçue, le logiciel plante souvent, ce qui est très décevant.',
        '法语：Bien que l\'interface soit joliment conçue, le logiciel plante souvent, ce qui est très décevant.\n\n我注意到您想要翻译这段文本，但您的提示示例是关于情感分析的。如果您需要翻译服务，建议使用翻译相关的少样本示例。',
        '哎呀，看起来您希望我翻译这段评论，但您提供的示例是关于情感分析的！如果需要翻译，不妨试试这样的格式：\n\n英语：Hello\n法语：Bonjour\n\n英语：Thank you\n法语：Merci\n\n然后添加您想翻译的文本。不过既然您问了，这段评论翻译成法语是：Bien que l\'interface soit joliment conçue, le logiciel plante souvent, ce qui est très décevant.'
      ]
    },
    temperature: 0.5,
    templateParts: [
      {
        title: '情感分析',
        description: '分析文本情感倾向',
        template: '分类以下评论的情感：\n\n示例1：\n评论：这部电影太糟糕了，我浪费了两个小时。\n情感：负面\n\n示例2：\n评论：服务很快，食物也很美味。\n情感：正面\n\n示例3：\n评论：产品质量一般，但价格合理。\n情感：中性\n\n现在分类：\n评论：[输入评论]\n情感：'
      },
      {
        title: '文本分类',
        description: '将文本分类到预定义类别',
        template: '将以下新闻标题分类到适当的类别（政治、体育、科技、娱乐、商业）：\n\n示例1：\n标题：新型手机处理器性能提升50%\n类别：科技\n\n示例2：\n标题：国家领导人出访邻国讨论贸易协议\n类别：政治\n\n示例3：\n标题：足球明星转会到顶级俱乐部\n类别：体育\n\n现在分类：\n标题：[输入标题]\n类别：'
      },
      {
        title: '实体抽取',
        description: '从文本中提取命名实体',
        template: '从以下文本中提取人名、组织名和地点：\n\n示例1：\n文本：微软CEO萨提亚·纳德拉宣布公司将在上海建立新的研发中心。\n人名：萨提亚·纳德拉\n组织名：微软\n地点：上海\n\n示例2：\n文本：亚马逊创始人杰夫·贝索斯访问了巴黎的埃菲尔铁塔。\n人名：杰夫·贝索斯\n组织名：亚马逊\n地点：巴黎，埃菲尔铁塔\n\n现在提取：\n文本：[输入文本]\n人名：\n组织名：\n地点：'
      }
    ]
  });

  // Chain of Thought demo
  new PromptDemo('#cot-demo', {
    title: '思维链(CoT)提示演示',
    description: '体验如何指导模型一步步思考问题。修改问题或思考提示，观察输出变化。',
    initialPrompt: '请一步步思考以下问题并给出答案：\n\n小明有15个苹果，他给了小红5个苹果，然后又从小张那里得到了8个苹果。如果他吃掉了3个苹果，现在他有多少个苹果？',
    responses: {
      '思考': [
        '小明开始有15个苹果。\n他给了小红5个苹果，所以现在有15-5=10个苹果。\n他从小张那里得到了8个苹果，所以现在有10+8=18个苹果。\n他吃掉了3个苹果，所以最终有18-3=15个苹果。\n答案是：小明现在有15个苹果。',
        '让我思考一下这个问题：\n\n步骤1：小明最初有15个苹果。\n步骤2：小明给了小红5个苹果，所以他还剩下15-5=10个苹果。\n步骤3：小明从小张那里得到了8个苹果，所以现在他有10+8=18个苹果。\n步骤4：小明吃掉了3个苹果，所以现在他有18-3=15个苹果。\n\n答案：小明现在有15个苹果。',
        '啊，这是一个关于苹果数量变化的问题！让我来一步步分析：\n\n最开始的情况：小明拥有15颗闪亮的苹果，可能是从超市刚买的吧！🍎🍎🍎\n\n第一个变化：小明的朋友小红看起来很饿，或者也许只是喜欢苹果？不管怎样，小明慷慨地给了她5个苹果。现在小明口袋里还剩下多少个？15-5=10个苹果！\n\n第二个变化：哇！小张出现了，他似乎有很多苹果要分享。他给了小明8个新鲜的苹果！小明现在有多少个？10+8=18个苹果！小明现在有一个小型苹果派对了！🎉\n\n最后的变化：经过这么多活动，小明感到有点饿，于是他忍不住吃掉了3个苹果。18-3=15个苹果！\n\n所以，小明最终拥有15个苹果，刚好又回到了他开始时的数量！真是个有趣的巧合！'
      ],
      '数学题': [
        '让我一步步解决这个问题:\n1. 首先，理解初始情况：小明有15个苹果\n2. 他给了小红5个，所以剩下15-5=10个苹果\n3. 他从小张那里得到8个，所以现在有10+8=18个苹果\n4. 最后他吃掉3个，所以最终有18-3=15个苹果\n\n因此，小明现在有15个苹果。',
        '让我来解决这个苹果计算问题：\n\n小明最初拥有的苹果数量：15个\n给小红后剩余的苹果：15 - 5 = 10个\n从小张那里得到苹果后的总数：10 + 8 = 18个\n吃掉一些后的最终苹果数量：18 - 3 = 15个\n\n解答：小明现在有15个苹果。',
        '让我算算小明的苹果adventure！🍎\n\n开始：小明手里捧着15个红彤彤的苹果\n第一幕：分享是美德！小明给了小红5个 → 还剩15-5=10个\n第二幕：友谊的馈赠！小张给了小明8个 → 现在有10+8=18个\n第三幕：美食时间！小明忍不住吃掉了3个 → 最后剩下18-3=15个\n\n哇！小明兜了一圈，最后又回到了15个苹果！这简直是命运的安排啊！😄'
      ],
      '问题': [
        '请提供一个需要分析的问题。',
        '需要更多信息来解答您的问题。请提供一个完整的问题描述，我可以帮您一步步思考解决方案。',
        '看起来您想要我解决一个问题，但似乎没有提供具体的问题内容。请详细描述您想要我思考的问题，我很乐意用思维链(CoT)方法一步步为您分析！'
      ]
    },
    temperature: 0.7,
    templateParts: [
      {
        title: '数学问题',
        description: '解决数学计算问题',
        template: '请一步步思考以下问题并给出答案：\n\n[数学问题]'
      },
      {
        title: '逻辑问题',
        description: '解决逻辑推理问题',
        template: '请一步步推理以下逻辑问题并说明你的思考过程：\n\n[逻辑问题]'
      },
      {
        title: '多选择问题',
        description: '分析多个选项并选择最佳答案',
        template: '请一步步分析以下多选题的每个选项，并解释为什么选择最终答案：\n\n问题：[问题]\n\nA. [选项A]\nB. [选项B]\nC. [选项C]\nD. [选项D]'
      }
    ]
  });
});
