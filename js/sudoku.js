let sudoku = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
];
let len = 9;

let dom = document.getElementById('sudoku');
let zr = zrender.init(dom);
let block = {
    width: 50,
    x: 0,
    y: 0
};
let PADDING = 10;
let WIDTH = 50;

let stat = 0;

let blockList = {};
let textList = {};
let group = new zrender.Group();

let currentBlockId = 0, currentTextId = 0;

// 初始化
// for(i=0;i<len;i++) {
//     let temp = [];
//     for(j=0;j<len;j++) {
//         temp.push(0);
//     }
//     sudoku.push(temp);
// }
// console.log(sudoku);


// initGrid();
drawBlock();
initGroup();

/**
 * 画网络
 */
function initGrid() {
    // 画水平线，长度9x50，画4条粗线
    for (i = 0; i <= 3; ++i) {
        let y = i * WIDTH * 3 + PADDING + 3 * i;
        let line = new zrender.Line({
            shape: {
                x1: 0 + PADDING,
                y1: y,
                x2: WIDTH * 9 + PADDING + 9,
                y2: y
            },
            style: {
                lineWidth: 3,
            },
            cursor: 'default'
        });
        zr.add(line);
    }

    // 画垂直线，长度9x50，画4条粗线
    for (i = 0; i <= 3; ++i) {
        let x = i * WIDTH * 3 + PADDING + 3 * i;
        let line = new zrender.Line({
            shape: {
                x1: x,
                y1: 0 + PADDING,
                x2: x,
                y2: WIDTH * 9 + PADDING + 9
            },
            style: {
                lineWidth: 3,
            },
            cursor: 'default'
        });
        zr.add(line);
    }
}

/**
 * 
 */
function drawBlock() {
    for (let i = 0; i < sudoku.length; ++i) {
        for (let j = 0; j < sudoku[i].length; ++j) {
            let _padx = Math.floor(j / 3) + 1;
            let _pady = Math.floor(i / 3) + 1;
            let x = 3 * _padx + j * WIDTH + PADDING;
            let y = 3 * _pady + i * WIDTH + PADDING;

            // add text
            let text = new zrender.Text({
                x: x,
                y: y,
                style: {
                    x: 16,
                    y: 16,
                    text: sudoku[i][j] > 0 ? sudoku[i][j] : '',
                    width: 35,
                    height: 35,
                    fill: '#000',
                    stroke: null,
                    lineWidth: 10,
                    fontWeight: 'bolder',
                    fontSize: '24px'
                },
                draggable: false,
                cursor: 'default',
                silent: true,
                sudokuKey: [i, j]
            });
            textList[text.id] = text;

            // block
            let block = new zrender.Rect({
                shape: {
                    r: [0, 0, 0, 0],
                    x: x,
                    y: y,
                    width: WIDTH,
                    height: WIDTH
                },
                style: {
                    stroke: '#666',
                    fill: '#fff'
                },
                cursor: 'default',
                sudokuKey: [i, j],
                sudokuValue: sudoku[i][j]
            });
            block.on('mouseover', function () {
                if (this.id != stat) {
                    this.attr('style', { fill: '#eee' });
                }

            });
            block.on('mouseout', function () {
                if (this.id != stat) {
                    this.attr('style', { fill: '#fff' });
                }
            });
            block.on('click', function () {
                currentBlockId = this.id;
                currentTextId = text.id;
                // console.log(this.id);
                if (stat === 0) {
                    stat = this.id;
                    this.attr('style', { fill: '#999' });
                    showGroup(x, y);
                } else if (stat === this.id) {
                    stat = 0;
                    this.attr('style', { fill: '#eee' });
                    hideGroup();
                } else {
                    blockList[stat].attr('style', { fill: '#fff' });
                    stat = this.id;
                    this.attr('style', { fill: '#999' });
                    showGroup(x, y);
                }
            });
            zr.add(block);
            blockList[block.id] = block;

            zr.add(text);
        }
    }


    let btn = new zrender.Rect({
        shape: {
            r: [3, 3],
            x: 10,
            y: 500,
            width: 120,
            height: 28
        },
        style: {
            stroke: '#666',
            fill: '#fff'
        }
    });
    btn.on('click', function () {
        sudoku = solveSudoku(sudoku);
        refresh();
    });
    zr.add(btn);
    let btnText = new zrender.Text({
        x: 10,
        y: 500,
        style: {
            x: 42,
            y: 10,
            text: '计算',
            width: 35,
            height: 35,
            fill: '#000',
            stroke: null,
            lineWidth: 10,
            fontWeight: 'bolder',
            fontSize: '16px'
        },
        draggable: false,
        cursor: 'default',
        silent: true
    });
    zr.add(btnText);

    let btn2 = new zrender.Rect({
        shape: {
            r: [3, 3],
            x: 140,
            y: 500,
            width: 120,
            height: 28
        },
        style: {
            stroke: '#666',
            fill: '#fff'
        }
    });
    btn2.on('click', function () {
        window.location.reload();
    });
    zr.add(btn2);

    let btnText2 = new zrender.Text({
        x: 140,
        y: 500,
        style: {
            x: 42,
            y: 10,
            text: '重置',
            width: 35,
            height: 35,
            fill: '#000',
            stroke: null,
            lineWidth: 10,
            fontWeight: 'bolder',
            fontSize: '16px'
        },
        draggable: false,
        cursor: 'default',
        silent: true
    });
    zr.add(btnText2);
}

function refresh() {
    for (const key in textList) {
        let i = textList[key].sudokuKey[0];
        let j = textList[key].sudokuKey[1];
        textList[key].attr('style', { text: sudoku[i][j] > 0 ? sudoku[i][j] : '' });
    }
}

/**
 * 画弹窗
 * @param {*} x 
 * @param {*} y 
 */
function initGroup(x, y) {
    let _x, _y = 0;
    for (i = 0; i < 9; i++) {
        _x = i % 3;
        if (_x === 0 && i > 2) {
            _y += 50;
        }

        // 弹窗数字
        let text = new zrender.Text({
            x: 50 * _x,
            y: _y,
            style: {
                x: 16,
                y: 16,
                text: i + 1,
                width: 35,
                height: 35,
                fill: 'blue',
                stroke: null,
                lineWidth: 10,
                fontWeight: 'bolder',
                fontSize: '24px'
            },
            draggable: false,
            cursor: 'default',
            silent: true
        });

        // 弹窗方块
        let rect = new zrender.Rect({
            shape: {
                r: [0, 0, 0, 0],
                x: 50 * _x,
                y: _y,
                width: WIDTH,
                height: WIDTH
            },
            style: {
                stroke: '#666',
                fill: '#eee'
            },
            cursor: 'default',
        });
        // 方块事件
        rect.on('mouseover', function () {
            this.attr('style', { fill: '#aaa' });
        });
        rect.on('mouseout', function () {
            this.attr('style', { fill: '#eee' });
        });
        rect.on('click', function () {
            // 点击的文字内容
            let _t = text.style.text;
            textList[currentTextId].attr('style', { text: _t });
            blockList[currentBlockId].attr('style', { fill: '#fff' });
            stat = 0;
            // 点击数字后，更新sudoku数组内容
            sudoku[blockList[currentBlockId].sudokuKey[0]][blockList[currentBlockId].sudokuKey[1]] = _t;
            hideGroup();
        });
        group.add(rect);


        group.add(text);
    }
    group.hide();
    zr.add(group);
}

/**
 * 显示弹窗
 * @param {x坐标} x 
 * @param {y坐标} y 
 */
function showGroup(x, y) {
    group.attr({
        x: x + 50,
        y: y + 50
    });
    group.show();
}

/**
 * 隐藏弹窗
 */
function hideGroup() {
    group.hide();
}


// 此处开始数独解法
let sudokuLine = [];
let sudokuColumn = [];
let sudokuBlock = [];
let sudokuValid = false;
let sudokuSpaces = [];

/**
 * 
 */
function sulotion() {
    sudokuLine = [];
    sudokuColumn = [];
    sudokuBlock = [];
    sudokuValid = false;
    sudokuSpaces = [];
    for (a = 0; a < 3; ++a) {
        sudokuBlock.push([[], [], []]);
        for (b = 0; b < 3; ++b) {
            sudokuBlock[a][b].push(new Array(9));
        }
    }

    for (let ii = 0; ii < 9; ++ii) {
        sudokuLine.push(new Array(9));
        sudokuColumn.push(new Array(9));
    }
    for (let i = 0; i < 9; ++i) {
        for (let j = 0; j < 9; ++j) {
            if (sudoku[i][j] == 0) {
                sudokuSpaces.push([i, j]);
            } else {
                let index = sudoku[i][j] - 1;
                sudokuLine[i][index] = true;
                sudokuColumn[j][index] = true;
                sudokuBlock[Math.floor(i / 3)][Math.floor(j / 3)][index] = true;
            }
        }
    }

    dfs(0);
}

/**
 * 
 * @param {*} pos 
 */
function dfs(pos) {
    if (pos == sudokuSpaces.length) {
        sudokuValid = true;
        console.log(pos);
        return;
    }

    // console.log(sudokuSpaces[pos]);
    let i = sudokuSpaces[pos][0]
    let j = sudokuSpaces[pos][1];
    let _i = Math.floor(i / 3)
    let _j = Math.floor(j / 3);
    for (let idx = 0; idx < 9 && !sudokuValid; ++idx) {
        if (!sudokuLine[i][idx] && !sudokuColumn[j][idx] && !sudokuBlock[_i][_j][idx]) {
            sudokuLine[i][idx] = true;
            sudokuColumn[j][idx] = true;
            sudokuBlock[_i][_j][idx] = true;
            sudoku[i][j] = idx + 1;
            dfs(pos + 1);
            sudokuLine[i][idx] = false;
            sudokuColumn[j][idx] = false;
            sudokuBlock[_i][_j][idx] = false;
        }
    }
}


/**
 * @name 小九宫格位置推算
 * @description
  [0, 0] -> [2, 2] -> 0
  [0, 3] -> [2, 5] -> 1
  [0, 6] -> [2, 8] -> 2
  [3, 0] -> [5, 2] -> 3
  [3, 3] -> [5, 5] -> 4
  [3, 6] -> [5, 8] -> 5
  [6, 0] -> [8, 2] -> 6
  [6, 3] -> [8, 5] -> 7
  [6, 6] -> [8, 8] -> 8
 * @return 推演公式：
    公式：i / 3 * 3 + j / 3
    JS 的话，除法记得做换算：Math.floor(i / 3) * 3 + Math.floor(j / 3)
 */

/**
 * @param {character[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 */
const solveSudoku = (board) => {
    // 1. 监控横排具备数字，9 排，每排有 9 个空位
    const rowList = Array.from(Array(9), () => new Set());

    // 2. 监控竖排具备数字，9 列，每列有 9 个空位
    const columnList = Array.from(Array(9), () => new Set());

    // 3. 监控小九宫格具备数字，9 个，每个九宫格有 9 个空位
    const boxList = Array.from(Array(9), () => new Set());

    // 4. 遍历大九宫格 board，将存在的数据放到 rowList、columnList 以及 boxList 中
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] !== 0) {
                rowList[i].add(board[i][j]);
                columnList[j].add(board[i][j]);
                boxList[Math.floor(i / 3) * 3 + Math.floor(j / 3)].add(board[i][j]);
            }
        }
    }

    /**
     * @name 6.判断数独能否成立
     * @param {number} m 横坐标
     * @param {number} n 纵坐标
     * @param {string} value 需要判断的值
     */
    const judgeSudoku = (m, n, value) => {
        // 6.1 如果横排监控重复，返回 false
        if (rowList[m].has(value)) {
            return false;
        }

        // 6.2 如果纵排监控重复，返回 false
        if (columnList[n].has(value)) {
            return false;
        }

        // 6.3 如果小九宫监控重复，返回 false
        if (boxList[Math.floor(m / 3) * 3 + Math.floor(n / 3)].has(value)) {
            return false;
        }

        // 6.4 否则返回 true
        return true;
    };

    /**
     * @name 5.回溯
     * @param {number} m 横坐标
     * @param {number} n 纵坐标
     */
    const recursion = (m, n) => {
        // 5.1 如果抵达 [8, 8] 位置，下一次过来就是 [9, 0]，结束递归
        if (m === 9 && n === 0) {
            return true;
        }

        // 5.2 设置下一次需要遍历的横纵坐标
        const newRow = n + 1 === 9 ? m + 1 : m;
        const newCol = (n + 1) % 9;

        // 5.3 如果当前的坐标对应的是 '.'，则进行回溯
        if (board[m][n] === 0) {

            // 5.3.1 遍历 1-9，进行判断是否可以填写
            for (let i = 1; i <= 9; i++) {

                // 5.3.2 获取新值
                const newValue = i;

                // 5.3.3 如果新值可用
                if (judgeSudoku(m, n, newValue)) {

                    // 5.3.4 进行新值填充
                    board[m][n] = newValue;

                    // 5.3.5 对应监控添加记录
                    rowList[m].add(newValue);
                    columnList[n].add(newValue);
                    boxList[Math.floor(m / 3) * 3 + Math.floor(n / 3)].add(newValue);

                    // 5.3.6 如果前面走对了，那么终止循环
                    if (recursion(newRow, newCol)) {
                        return true;
                    }

                    // 5.3.7 还原值，进行下一个值填充
                    board[m][n] = 0;

                    // 5.3.8 还原监控，方便下一个值填充
                    rowList[m].delete(newValue);
                    columnList[n].delete(newValue);
                    boxList[Math.floor(m / 3) * 3 + Math.floor(n / 3)].delete(newValue);
                }
            }
        } else { // 5.4 否则一直向前
            return recursion(newRow, newCol);
        }

        // 5.5 都走了表示 false
        return false;
    };
    recursion(0, 0);

    return board;
};