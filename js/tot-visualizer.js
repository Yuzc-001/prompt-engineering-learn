/**
 * 思维树(Tree of Thoughts)可视化组件
 * 创建一个交互式思维树可视化，展示多路径推理的过程
 */

class ToTVisualizer {
  constructor(container) {
    this.container = document.querySelector(container);
    if (!this.container) return;
    
    // 树配置选项
    this.config = {
      branchingFactor: 2, // 默认分支因子
      depth: 3,          // 默认树深度
      autoExpand: false  // 是否自动展开所有节点
    };
    
    // 思维树示例数据
    this.examples = [
      {
        id: 'game-24',
        title: '24点游戏',
        problem: '使用数字 4, 5, 6, 7，通过加、减、乘、除运算得到24',
        root: {
          content: '计算24点: 4, 5, 6, 7',
          children: [
            {
              content: '先尝试4和6',
              children: [
                {
                  content: '4 * 6 = 24，需要在算式中放入5和7',
                  children: [
                    {
                      content: '24 + 5 - 7 = 22 ❌',
                      isLeaf: true,
                      success: false
                    },
                    {
                      content: '24 / 6 * 5 + 7 = 27 ❌',
                      isLeaf: true,
                      success: false
                    }
                  ]
                },
                {
                  content: '4 + 6 = 10，尝试与5和7组合',
                  children: [
                    {
                      content: '10 + 5 + 7 = 22 ❌',
                      isLeaf: true,
                      success: false
                    },
                    {
                      content: '10 * 5 - 7 * 5 = 15 ❌',
                      isLeaf: true,
                      success: false
                    }
                  ]
                }
              ]
            },
            {
              content: '考虑5和7的组合',
              children: [
                {
                  content: '5 + 7 = 12，与4和6组合',
                  children: [
                    {
                      content: '12 * 4 - 6 = 42 ❌',
                      isLeaf: true,
                      success: false
                    },
                    {
                      content: '12 - 6 = 6，然后6 * 4 = 24 ✅',
                      isLeaf: true,
                      success: true
                    }
                  ]
                },
                {
                  content: '考虑4和5相乘',
                  children: [
                    {
                      content: '4 * 5 = 20，与6和7组合',
                      children: [
                        {
                          content: '20 + 6 - 7 = 19 ❌',
                          isLeaf: true,
                          success: false
                        },
                        {
                          content: '20 + 6 * (7/6) = 27 ❌',
                          isLeaf: true,
                          success: false
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      },
      {
        id: 'puzzle',
        title: '逻辑谜题',
        problem: '有三个盒子，标签分别为"苹果"、"橙子"和"苹果和橙子"，但标签都是错误的。如何通过只打开一个盒子确定所有盒子的内容？',
        root: {
          content: '解决错误标签谜题',
          children: [
            {
              content: '假设打开标有"苹果"的盒子',
              children: [
                {
                  content: '如果里面是橙子',
                  children: [
                    {
                      content: '标有"橙子"的盒子只能是苹果和橙子的混合',
                      isLeaf: true,
                      success: false
                    },
                    {
                      content: '标有"苹果和橙子"的盒子只能是苹果',
                      isLeaf: true,
                      success: false
                    }
                  ]
                },
                {
                  content: '如果里面是苹果和橙子的混合',
                  children: [
                    {
                      content: '标有"橙子"的盒子只能是苹果',
                      isLeaf: true,
                      success: false
                    },
                    {
                      content: '标有"苹果和橙子"的盒子只能是橙子',
                      isLeaf: true,
                      success: false
                    }
                  ]
                }
              ]
            },
            {
              content: '假设打开标有"橙子"的盒子',
              children: [
                {
                  content: '如果里面是苹果',
                  children: [
                    {
                      content: '标有"苹果"的盒子只能是苹果和橙子的混合',
                      isLeaf: true,
                      success: false
                    },
                    {
                      content: '标有"苹果和橙子"的盒子只能是橙子',
                      isLeaf: true,
                      success: false
                    }
                  ]
                },
                {
                  content: '如果里面是苹果和橙子的混合',
                  children: [
                    {
                      content: '标有"苹果"的盒子只能是橙子',
                      isLeaf: true, 
                      success: false
                    },
                    {
                      content: '标有"苹果和橙子"的盒子只能是苹果',
                      isLeaf: true,
                      success: false
                    }
                  ]
                }
              ]
            },
            {
              content: '打开标有"苹果和橙子"的盒子 👍',
              children: [
                {
                  content: '如果里面是苹果',
                  children: [
                    {
                      content: '标有"苹果"的盒子只能是橙子',
                      isLeaf: true,
                      success: false
                    },
                    {
                      content: '标有"橙子"的盒子只能是苹果和橙子的混合',
                      isLeaf: true,
                      success: true
                    }
                  ]
                },
                {
                  content: '如果里面是橙子',
                  children: [
                    {
                      content: '标有"苹果"的盒子只能是苹果和橙子的混合',
                      isLeaf: true,
                      success: true
                    },
                    {
                      content: '标有"橙子"的盒子只能是苹果',
                      isLeaf: true,
                      success: false
                    }
                  ]
                }
              ]
            }
          ]
        }
      }
    ];
    
    // 界面元素
    this.elements = {
      exampleTabs: null,
      problemContent: null,
      treeContainer: null,
      configControls: null
    };
    
    this.currentExample = 0;
    
    this.init();
  }
  
  init() {
    this.render();
    this.setupControls();
    this.showExample(0);
  }
  
  render() {
    // 创建可视化容器结构
    this.container.innerHTML = `
      <div class="tot-visualizer">
        <div class="tot-examples-tabs">
          ${this.examples.map((example, idx) => 
            `<button class="tot-tab ${idx === 0 ? 'active' : ''}" data-example="${idx}">${example.title}</button>`
          ).join('')}
        </div>
        
        <div class="tot-problem-display">
          <h4>问题：</h4>
          <p class="tot-problem-content"></p>
        </div>
        
        <div class="tot-config-panel">
          <div class="tot-config-control">
            <label for="branchFactor">分支因子:</label>
            <input type="range" id="branchFactor" min="1" max="4" value="${this.config.branchingFactor}" />
            <span class="tot-config-value">${this.config.branchingFactor}</span>
          </div>
          
          <div class="tot-config-control">
            <label for="treeDepth">树深度:</label>
            <input type="range" id="treeDepth" min="1" max="4" value="${this.config.depth}" />
            <span class="tot-config-value">${this.config.depth}</span>
          </div>
          
          <div class="tot-config-control">
            <label for="autoExpand">自动展开:</label>
            <input type="checkbox" id="autoExpand" ${this.config.autoExpand ? 'checked' : ''} />
          </div>
        </div>
        
        <div class="tot-tree-container"></div>
      </div>
    `;
    
    // 缓存元素引用
    this.elements.exampleTabs = this.container.querySelectorAll('.tot-tab');
    this.elements.problemContent = this.container.querySelector('.tot-problem-content');
    this.elements.treeContainer = this.container.querySelector('.tot-tree-container');
    this.elements.configControls = {
      branchFactor: this.container.querySelector('#branchFactor'),
      treeDepth: this.container.querySelector('#treeDepth'),
      autoExpand: this.container.querySelector('#autoExpand')
    };
  }
  
  setupControls() {
    // 示例切换
    this.elements.exampleTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const index = parseInt(tab.dataset.example);
        this.showExample(index);
      });
    });
    
    // 配置控制
    Object.entries(this.elements.configControls).forEach(([key, control]) => {
      if (key === 'autoExpand') {
        control.addEventListener('change', () => {
          this.config.autoExpand = control.checked;
          this.updateTree();
        });
      } else {
        control.addEventListener('input', () => {
          const value = parseInt(control.value);
          this.config[key === 'branchFactor' ? 'branchingFactor' : 'depth'] = value;
          control.nextElementSibling.textContent = value;
          this.updateTree();
        });
      }
    });
  }
  
  showExample(index) {
    this.currentExample = index;
    
    // 更新标签激活状态
    this.elements.exampleTabs.forEach((tab, i) => {
      if (i === index) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
    
    // 显示问题
    const example = this.examples[index];
    this.elements.problemContent.textContent = example.problem;
    
    // 构建树
    this.buildTree();
  }
  
  updateTree() {
    this.buildTree();
  }
  
  buildTree() {
    const example = this.examples[this.currentExample];
    const root = example.root;
    
    // 创建树结构
    this.elements.treeContainer.innerHTML = this.renderNode(root, 0);
    
    // 添加节点展开/折叠功能
    this.elements.treeContainer.querySelectorAll('.tot-node').forEach(node => {
      node.addEventListener('click', (e) => {
        if (e.target.classList.contains('tot-node-toggle') || 
            e.target.classList.contains('tot-node-content')) {
          const parent = e.target.closest('.tot-node');
          parent.classList.toggle('expanded');
        }
        e.stopPropagation();
      });
    });
    
    // 如果设置了自动展开，展开所有节点
    if (this.config.autoExpand) {
      this.elements.treeContainer.querySelectorAll('.tot-node').forEach(node => {
        node.classList.add('expanded');
      });
    } else {
      // 默认展开第一级
      const rootNode = this.elements.treeContainer.querySelector('.tot-node');
      if (rootNode) rootNode.classList.add('expanded');
    }
  }
  
  renderNode(node, depth) {
    if (!node || depth > this.config.depth) return '';
    
    // 确定节点状态类
    let nodeClass = '';
    if (node.isLeaf) {
      nodeClass = node.success ? 'tot-node-success' : 'tot-node-failure';
    }
    
    // 构建节点HTML
    let html = `
      <div class="tot-node ${nodeClass}">
        <div class="tot-node-header">
          ${node.children && node.children.length > 0 ? '<span class="tot-node-toggle">▶</span>' : '<span class="tot-node-toggle empty"></span>'}
          <div class="tot-node-content">${node.content}</div>
        </div>
    `;
    
    // 添加子节点，根据配置的分支因子限制子节点数量
    if (node.children && node.children.length > 0) {
      const visibleChildren = node.children.slice(0, this.config.branchingFactor);
      html += `<div class="tot-node-children">`;
      visibleChildren.forEach(child => {
        html += this.renderNode(child, depth + 1);
      });
      html += `</div>`;
    }
    
    html += `</div>`;
    return html;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ToTVisualizer('#tot-viz');
});
