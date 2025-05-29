var flag=false;
createField('easy',9,9,10);
var select=document.getElementById('level');
select.addEventListener('change',function(){
    var selectedOpt = select.options[select.selectedIndex];
    createField(selectedOpt.value, selectedOpt.dataset.row , selectedOpt.dataset.col, selectedOpt.dataset.bomb);
});
let firstClick=true;
document.querySelector('div.field').addEventListener('click', function(event) {
    const cell = event.target;
    if(firstClick && !flag){
        if(cell.dataset.bomb === 'true'){
            var selectedOpt = select.options[select.selectedIndex];
            createField(selectedOpt.value, selectedOpt.dataset.row , selectedOpt.dataset.col, selectedOpt.dataset.bomb);
            spread(cell);
            firstClick = false;
        }else{
            spread(cell);
            firstClick = false; 
        }
    }
});
function createField(lvl,r,c,bombs){
    const container=document.querySelector('div.container');
    if(lvl==='hard') container.style.width='65%';
    else container.style.width='35%';

    document.getElementById("number").innerHTML=bombs;
    document.getElementById("number").style.color="aliceblue";

    const field=document.querySelector('div.field');
    field.innerHTML='';
    field.style.gridTemplateRows='repeat('+r+', 1fr)';
    field.style.gridTemplateColumns='repeat('+c+', 1fr)';

    let bombPositions=generateBomb(r,c,bombs)
    let x=0;
    for(let i=0;i<r;i++){
        for(let j=0;j<c;j++){
            let cell=document.createElement('div');
            cell.className='cell';
            cell.style.aspectRatio='1/1';
            cell.setAttribute('onclick','pressed(this)')
            cell.dataset.row=i;
            cell.dataset.col=j;
            if(x<bombPositions.length && bombPositions[x].row==i && bombPositions[x].col==j){
                cell.dataset.bomb='true';
                x++;
            }else{
                cell.dataset.bomb='false';
            }
            cell.dataset.cover='true';
            cell.dataset.flag='false';
            if((j+i)%2==0) cell.classList.toggle('light-grass');
            else cell.classList.toggle('dark-grass');
            field.appendChild(cell);
        }
    }
}
function generateBomb(r,c,nBomb){
    var bombPositions=[];
    for(let i=0;i<nBomb;i++){
        let pos={
            row : parseInt(Math.random()*r),
            col: parseInt(Math.random()*c)
        }
        if(!bombPositions.some(b => b.row === pos.row && b.col === pos.col)){
            bombPositions.push(pos);
        }
    }
    sort(bombPositions);
    return bombPositions;
}
function sort(v){
    let f=true;
    while(f){
        f=false;
        for(let i=0;i<v.length-1;i++){
            if(v[i].row>v[i+1].row || (v[i].row==v[i+1].row && v[i].col>v[i+1].col)){
                f=true;
                let temp=v[i];
                v[i]=v[i+1];
                v[i+1]=temp;
            }
        }
    }
}
function uncover(cell){
    cell.dataset.cover='false';
    if(cell.classList.contains('light-grass')){
        cell.classList.toggle('light-grass');
        cell.classList.toggle('light-dirt');
    }else if(cell.classList.contains('dark-grass')){
        cell.classList.toggle('dark-grass');
        cell.classList.toggle('dark-dirt');
    }
    cell.removeAttribute('onclick');
}
function spread(cell){
    if(cell.dataset.bomb==='true'){
        showGameOver('Hai perso!');
        return;
    }
    uncover(cell);
    const row=parseInt(cell.dataset.row);
    const col=parseInt(cell.dataset.col);
    const selectedOpt=select.options[select.selectedIndex];
    const maxRow=parseInt(selectedOpt.dataset.row);
    const maxCol=parseInt(selectedOpt.dataset.col);
    const revealedCells=new Set();
    function isValidCell(r, c){
        return r>=0 && r<maxRow && c>=0 && c<maxCol;
    }
    function revealCell(r, c){
        const cellKey = `${r},${c}`;
        if(!isValidCell(r, c) || revealedCells.has(cellKey)) return;
        const currentCell = cellin(r, c);
        if(!currentCell || currentCell.classList.contains('revealed') || currentCell.dataset.flag==='true') return;
        revealedCells.add(cellKey);
        let n=0;
        for(let i=r-1;i<=r+1;i++){
            for(let j=c-1;j<=c+1;j++){
                if (isValidCell(i, j)){
                    const neighbor = cellin(i, j);
                    if(neighbor && neighbor.dataset.bomb==='true') n++;
                }
            }
        }
        uncover(currentCell);
        if(n>0){
            currentCell.innerHTML=n;
            currentCell.style.color='var(--color-'+n+')';
        }else{
            for(let i = r - 1; i <= r + 1; i++){
                for(let j = c - 1; j <= c + 1; j++){
                    revealCell(i, j);
                }
            }
        }
    }
    revealCell(row, col);
}
function cellin(r,c){
    let cells=document.querySelectorAll('.cell');
    for(let i=0;i<cells.length;i++){
        let row=parseInt(cells[i].dataset.row);
        let col=parseInt(cells[i].dataset.col);
        if(row==r && col==c){
            return cells[i];
        }
    }
    return null;
}
function switchFlag(){
    flag= !flag;
    const Switch=document.querySelector('button.switch');
    if(flag)
        Switch.innerHTML='<img src="mnswprimages/flag.webp" alt="flag">';
    else
        Switch.innerHTML='<img src="mnswprimages/shovel.webp" alt="naval-mine"/>';
}
function pressed(cell){
    if(flag) setFlag(cell);
    else spread(cell);
}
function setFlag(cell){
    if(cell.dataset.cover==='true'){
        let k;
        if(cell.dataset.flag==='false'){
            cell.innerHTML='<img src="mnswprimages/flag.webp" alt="flag">';
            cell.dataset.flag='true';
            k=-1;
        }else{
            cell.innerHTML='';
            cell.dataset.flag='false';
            k=1;
        }
        const bombN=document.getElementById("number");
        bombN.innerHTML=parseInt(bombN.innerHTML)+k;
        if(bombN.innerHTML==0){
            showGameOver('Hai vinto!');
        }
    }
}
function showGameOver(s) {
    document.getElementById('gameOver').style.display = 'flex';
    document.getElementById('result-score').innerHTML=s;
}
function restart(){
    const modal = document.getElementById('gameOver');
    modal.style.display = 'none';
    firstClick=true;
    var selectedOpt = select.options[select.selectedIndex];
    createField(selectedOpt.value, selectedOpt.dataset.row , selectedOpt.dataset.col, selectedOpt.dataset.bomb);
}