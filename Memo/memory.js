var table=[];
const cards=[
    {
        "id": 0,
        "front": "donut.png",
        "back": "back.jpg"
    },
    {
        "id": 1,
        "front": "maglia.png",
        "back": "back.jpg"
    },
    {
        "id": 2,
        "front": "papera.png",
        "back": "back.jpg"
    },
    {
        "id": 3,
        "front": "pollo.png",
        "back": "back.jpg"
    },
    {
        "id": 4,
        "front": "anguria.png",
        "back": "back.jpg"
    },
    {
        "id": 5,
        "front": "salvadanaio.png",
        "back": "back.jpg"
    },
    {
        "id": 6,
        "front": "tavolozza.png",
        "back": "back.jpg"
    },
    {
        "id": 7,
        "front": "cappello.png",
        "back": "back.jpg"
    },
    {
        "id": 8,
        "front": "anello.png",
        "back": "back.jpg"
    },
    {
        "id": 9,
        "front": "conchiglia.png",
        "back": "back.jpg"
    },
    {
        "id": 10,
        "front": "bersaglio.png",
        "back": "back.jpg"
    },
    {
        "id": 11,
        "front": "valigia.png",
        "back": "back.jpg"
    },
    {
        "id": 12,
        "front": "maschere.png",
        "back": "back.jpg"
    },
    {
        "id": 13,
        "front": "tromba.png",
        "back": "back.jpg"
    },
    {
        "id": 14,
        "front": "zampe.png",
        "back": "back.jpg"
    },
    {
        "id": 15,
        "front": "cervello.png",
        "back": "back.jpg"
    },
    {
        "id": 16,
        "front": "guanti.png",
        "back": "back.jpg"
    },
    {
        "id": 17,
        "front": "bolle.png",
        "back": "back.jpg"
    },
    {
        "id": 18,
        "front": "squalo.png",
        "back": "back.jpg"
    },
    {
        "id": 19,
        "front": "granchio.png",
        "back": "back.jpg"
    }
];
function setTable(r,c){
    let ids=[];
    let pairs=(r*c);
    let n=0;
    for(let i=0;i<pairs;i+=2){
        ids[i]=n;
        ids[i+1]=n;
        n++;
    }
    var m=[];
    for(let i=0;i<r;i++){
        m[i]=[];
        for(let j=0;j<c;j++){
            let id=ids[Math.round(Math.random()*(pairs-1))];
            m[i][j]=cards[id];
            ids.splice(ids.indexOf(id), 1);
            pairs--;
        }
    }
    return m;
}
function generateTable(m){
    const container=document.querySelector('div.cards-container');
    container.innerHTML = '';
    for(let i=0;i<m.length;i++){
        for(let j=0;j<m[0].length;j++){
            let card=document.createElement('div');
            card.className='flip-card';

            let card_inner=document.createElement('div');
            card_inner.className='flip-card-inner';
            card_inner.id=m[i][j].id;

            let front=document.createElement('div');
            front.className='flip-card-front';
            
            let frontImgURL="./images/"+m[i][j].back;
            front.style.backgroundImage='url('+frontImgURL+')';
            
            card_inner.appendChild(front);

            let back=document.createElement('div');
            back.className='flip-card-back';
            
            let backImgURL="./images/"+m[i][j].front;
            back.style.backgroundImage='url('+backImgURL+')';
            
            card_inner.appendChild(back);

            card.appendChild(card_inner);
            container.appendChild(card);
        }
    }
    container.style.gridTemplateColumns='repeat('+m[0].length+',1fr)';
}
var wins=0;
function match(wins){
let buttons=document.querySelectorAll('.difficulty button');
buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        const difficulty=document.querySelector('div.difficulty');
        difficulty.style.display='none';
        const rows=btn.getAttribute('data-rows');
        const cols=btn.getAttribute('data-cols');
        var table=setTable(rows,cols);
        generateTable(table);
        let trials=0;
        let lastFlipped=[];
        let flipped=[];
        let pairs=table.length*table[0].length/2;
        updatePairs(pairs);
        const memo = document.querySelectorAll('div.flip-card-inner');
        memo.forEach(card => {
            card.addEventListener('click', async () => {
                if(trials<2){
                    if(!lastFlipped.includes(card) && !flipped.includes(cards)){
                        card.classList.toggle('flip');
                        trials++;
                        lastFlipped.push(card);
                    }
                }
                if(trials==2){
                    if(lastFlipped[0].id==lastFlipped[1].id){
                        flipped.push(lastFlipped[0]);
                        flipped.push(lastFlipped[1]);
                        pairs--;
                        updatePairs(pairs);
                        if(pairs==0) endMatch(wins);
                    }else{
                        await sleep(1000);
                        lastFlipped[0].classList.toggle('flip');
                        lastFlipped[1].classList.toggle('flip');
                    }
                    lastFlipped=[];
                    trials=0;
                }
            });
        });
    });
});
}
function updatePairs(n){
    const pairs=document.querySelector('div.pairs');
    pairs.innerHTML=n+' pairs left';
}
function endMatch(wins){
    wins++;
    const score=document.querySelector('div.score');
    score.innerHTML='You won '+wins+' matches';
    const pairs=document.querySelector('div.pairs');
    pairs.innerHTML='';
    const memo = document.querySelectorAll('div.flip-card');
    memo.forEach(card => {
        card.remove();
    });
    const difficulty=document.querySelector('div.difficulty');
    difficulty.style.display='flex';
    match(wins);
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
match(wins);