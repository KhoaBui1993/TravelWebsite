let addthingtodoBtn = document.getElementById('addthingtodoBtn');
let thingtodoList = document.querySelector('.thingtodoList');
let thingtodoDiv = document.querySelectorAll('.thingtodoDiv')[0];

addthingtodoBtn.addEventListener('click', function(){
  let newThingtodo = thingtodoDiv.cloneNode(true);
  let input = newThingtodo.getElementsByTagName('input')[0];
  input.value = '';
  thingtodoList.appendChild(newThingtodo);
});

let button = document.querySelector('.btn');

button.addEventListener('click', () => {
    button.classList.toggle('liked')
});

