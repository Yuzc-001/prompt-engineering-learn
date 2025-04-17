/**
 * 提示词技术选择器
 * 基于用户需求推荐最合适的提示词技术
 */

class TechniqueChooser {
  constructor() {
    this.questionForm = document.querySelector('.chooser-questions');
    this.recommendationResult = document.querySelector('.recommendation-result');
    this.recommendedTechniques = document.querySelector('.recommended-techniques');
    this.getRecommendationBtn = document.querySelector('.get-recommendation-btn');
    
    if (!this.questionForm || !this.recommendationResult) return;
    
    this.setupEventListeners();
    
    // 技术匹配规则
    this.matchingRules = {
      // 零样本提示
      zeroShot: {
        matches: (answers) => {
          return (
            (answers.taskType === 'generation' || answers.taskType === 'classification') &&
            answers.complexity === 'simple' &&
            answers.format === 'flexible' &&
            answers.context === 'small'
          );
        },
        priority: 95,
        description: "零样本提示是直接指示模型执行任务，无需提供任何示例。适合简单明确的任务，特别是当上下文窗口有限时。",
        icon: "img/zero-shot-icon.svg"
      },
      
      // 单样本提示
      oneShot: {
        matches: (answers) => {
          return (
            (answers.taskType === 'generation' || answers.taskType === 'classification') &&
            (answers.complexity === 'simple' || answers.complexity === 'medium') &&
            (answers.format === 'semi-structured' || answers.format === 'structured') &&
            (answers.context === 'small' || answers.context === 'medium')
          );
        },
        priority: 90,
        description: "单样本提示通过提供一个示例来引导模型。适合需要特定格式或中等复杂度的任务，同时仍保持较低的令牌使用量。",
        icon: "img/one-shot-icon.svg"
      },
      
      // 少样本提示
      fewShot: {
        matches: (answers) => {
          return (
            (answers.taskType === 'generation' || answers.taskType === 'classification') &&
            (answers.complexity === 'medium' || answers.complexity === 'complex') &&
            (answers.format === 'semi-structured' || answers.format === 'structured') &&
            (answers.context === 'medium' || answers.context === 'large')
          );
        },
        priority: 85,
        description: "少样本提示通过提供多个示例引导模型，特别适合复杂的分类或生成任务，以及需要特定输出格式的情况。需要更大的上下文窗口。",
        icon: "img/few-shot-icon.svg"
      },
      
      // 思维链
      chainOfThought: {
        matches: (answers) => {
          return (
            (answers.taskType === 'reasoning' || answers.complexity === 'complex' || answers.complexity === 'very-complex') &&
            answers.context !== 'small'
          );
        },
        priority: 80,
        description: "思维链提示让模型展示其推理过程，特别适合复杂推理、问题解决和数学任务。需要更大的上下文窗口来容纳详细的思考过程。",
        icon: "img/cot-icon.svg"
      },
      
      // 系统提示
      systemPrompt: {
        matches: (answers) => {
          return (
            answers.taskType === 'conversation' || 
            (answers.format === 'structured' && answers.context !== 'small')
          );
        },
        priority: 75,
        description: "系统提示设定模型的整体行为和响应方式，特别适合对话应用和需要一致格式的输出。可以与其他技术结合使用。",
        icon: "img/system-icon.svg"
      },
      
      // 角色提示
      rolePrompt: {
        matches: (answers) => {
          return (
            answers.taskType === 'conversation' || 
            (answers.taskType === 'generation' && (answers.format === 'semi-structured' || answers.format === 'structured'))
          );
        },
        priority: 70,
        description: "角色提示让模型扮演特定角色，适合创意写作、专业建议和特定风格的内容生成。有助于保持一致的语气和专业知识。",
        icon: "img/role-icon.svg"
      },
      
      // 回溯提示
      stepBack: {
        matches: (answers) => {
          return (
            answers.taskType === 'reasoning' && 
            (answers.complexity === 'complex' || answers.complexity === 'very-complex') &&
            answers.context !== 'small'
          );
        },
        priority: 65,
        description: "回溯提示指导模型先退一步考虑更大的图景，再解决具体问题。适合复杂推理任务，特别是需要从多个角度思考的问题。",
        icon: "img/stepback-icon.svg"
      },
      
      // ReAct
      react: {
        matches: (answers) => {
          return (
            (answers.taskType === 'reasoning' || answers.taskType === 'conversation') && 
            (answers.complexity === 'complex' || answers.complexity === 'very-complex') &&
            answers.context === 'large'
          );
        },
        priority: 60,
        description: "ReAct (Reasoning + Acting) 结合推理和行动，适合需要工具使用、信息检索和多步骤任务执行的情况。需要较大的上下文窗口。",
        icon: "img/react-icon.svg"
      }
    };
  }
  
  setupEventListeners() {
    this.getRecommendationBtn?.addEventListener('click', () => {
      this.generateRecommendation();
    });
  }
  
  generateRecommendation() {
    // 收集用户回答
    const answers = {
      taskType: this.getSelectedValue('task-type'),
      complexity: this.getSelectedValue('complexity'),
      format: this.getSelectedValue('format'),
      context: this.getSelectedValue('context')
    };
    
    // 匹配推荐技术
    const recommendedTechniques = this.matchTechniques(answers);
    
    // 显示推荐结果
    this.displayRecommendations(recommendedTechniques);
  }
  
  getSelectedValue(name) {
    const selectedOption = document.querySelector(`input[name="${name}"]:checked`);
    return selectedOption ? selectedOption.value : null;
  }
  
  matchTechniques(answers) {
    // 确保所有问题都有答案
    if (!answers.taskType || !answers.complexity || !answers.format || !answers.context) {
      return [{
        id: 'error',
        name: '请回答所有问题',
        description: '需要回答所有问题才能提供准确的推荐。',
        priority: 0,
        match: 0
      }];
    }
    
    // 对每种技术计算匹配程度
    const matchResults = [];
    
    for (const [id, tech] of Object.entries(this.matchingRules)) {
      const isMatch = tech.matches(answers);
      
      if (isMatch) {
        // 计算匹配程度（简化版，实际可以有更复杂的算法）
        let matchScore = tech.priority;
        
        // 添加到结果列表
        matchResults.push({
          id,
          name: this.getTechName(id),
          description: tech.description,
          priority: tech.priority,
          match: matchScore,
          icon: tech.icon
        });
      }
    }
    
    // 按匹配程度排序
    return matchResults.sort((a, b) => b.match - a.match);
  }
  
  getTechName(id) {
    const nameMap = {
      zeroShot: '零样本提示',
      oneShot: '单样本提示',
      fewShot: '少样本提示',
      chainOfThought: '思维链提示',
      systemPrompt: '系统提示',
      rolePrompt: '角色提示',
      stepBack: '回溯提示',
      react: 'ReAct提示'
    };
    
    return nameMap[id] || id;
  }
  
  displayRecommendations(recommendations) {
    if (!this.recommendedTechniques) return;
    
    if (recommendations.length === 0) {
      this.recommendedTechniques.innerHTML = `
        <div class="no-recommendation">
          <p>基于您的选择，我们没有找到完全匹配的推荐。请尝试调整您的需求。</p>
        </div>
      `;
      return;
    }
    
    // 显示前3个最匹配的推荐
    const topRecommendations = recommendations.slice(0, 3);
    
    let htmlContent = '';
    
    topRecommendations.forEach((rec, index) => {
      const matchPercentage = Math.round((rec.match / 100) * 100);
      const isMain = index === 0;
      
      htmlContent += `
        <div class="technique-card ${isMain ? 'main-recommendation' : ''}">
          ${isMain ? '<div class="best-match-badge">最佳匹配</div>' : ''}
          <div class="technique-header">
            <div class="technique-icon">
              <img src="${rec.icon}" alt="${rec.name} icon">
            </div>
            <h4>${rec.name}</h4>
          </div>
          <div class="match-indicator">
            <div class="match-bar">
              <div class="match-fill" style="width: ${matchPercentage}%"></div>
            </div>
            <span class="match-percentage">${matchPercentage}% 匹配</span>
          </div>
          <p class="technique-description">${rec.description}</p>
        </div>
      `;
    });
    
    this.recommendedTechniques.innerHTML = htmlContent;
    this.recommendedTechniques.classList.add('show-results');
    
    // 为推荐添加动画效果
    const cards = this.recommendedTechniques.querySelectorAll('.technique-card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('animate-in');
      }, 100 * index);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new TechniqueChooser();
});
